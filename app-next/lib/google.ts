export const googleBusiness = {
  placeId: "ChIJPfYgfWLvDDkRm3G5lTZ_rQM",
  cid: "265007825501647259",
  lat: 28.5770186,
  lng: 77.3795235,
  profileUrl:
    "https://www.google.com/maps/place/Avenue+Properties/@28.5770186,77.3795235,17z/data=!4m8!3m7!1s0x390cef627d20f63d:0x3ad7f3695b9719b!8m2!3d28.5770186!4d77.3795235!9m1!1b1!16s%2Fg%2F11gg5nc_l_",
  reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJPfYgfWLvDDkRm3G5lTZ_rQM",
  writeReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJPfYgfWLvDDkRm3G5lTZ_rQM",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Avenue%20Properties&query_place_id=ChIJPfYgfWLvDDkRm3G5lTZ_rQM",
};

export type GoogleCard = {
  author: string;
  rating: number;
  time: string;
  text: string;
  photo: string;
  sample?: boolean;
};

export type GooglePlaceView = {
  live: boolean;
  source: "places" | "listing" | "sample";
  rating: number | null;
  total: number | null;
  reviews: GoogleCard[];
  writeReviewUrl: string;
  profileUrl: string;
};

type PlacesReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string };
};

function cleanQuote(text: string) {
  let body = text.trim();
  if (body.charAt(0) === '"' && body.charAt(body.length - 1) === '"') body = body.slice(1, -1).trim();
  return body;
}

export function parsePublicPlace(rawText: string): { rating: number | null; total: number | null; reviews: GoogleCard[] } {
  const countMatch = rawText.match(/(\d{2,6}) reviews/);
  const total = countMatch ? Number(countMatch[1]) : null;
  let rating: number | null = null;
  if (total) {
    const hit = rawText.match(new RegExp("(\\d\\.\\d)," + total + "\\b"));
    if (hit) rating = Number(hit[1]);
  }
  const reviews: GoogleCard[] = [];
  try {
    const data = JSON.parse(rawText.replace(/^\)\]\}'\s*/, "")) as unknown;
    const seen = new Set<string>();
    const walk = (node: unknown) => {
      if (!Array.isArray(node)) return;
      const head = node[0] as unknown;
      const text = node[1];
      const stars = node[9];
      if (
        Array.isArray(head) &&
        typeof head[0] === "string" &&
        head[0].indexOf("google.com/maps/contrib/") !== -1 &&
        typeof text === "string" &&
        typeof stars === "number" &&
        stars >= 1 &&
        stars <= 5
      ) {
        const body = cleanQuote(text);
        if (body.length > 12 && !seen.has(body)) {
          seen.add(body);
          const photoRaw = typeof head[2] === "string" ? head[2] : "";
          reviews.push({
            author: "Google review",
            rating: stars,
            time: "On Google",
            text: body,
            photo: photoRaw.indexOf("//") === 0 ? "https:" + photoRaw : photoRaw,
          });
        }
      }
      node.forEach(walk);
    };
    walk(data);
  } catch {
    /* rating may still be usable */
  }
  return { rating, total, reviews: reviews.slice(0, 5) };
}

async function fromPlacesApi(key: string): Promise<GooglePlaceView | null> {
  const res = await fetch("https://places.googleapis.com/v1/places/" + googleBusiness.placeId, {
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "rating,userRatingCount,reviews",
    },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 86400 },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { rating?: number; userRatingCount?: number; reviews?: PlacesReview[] };
  if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") return null;
  const reviews = (data.reviews || []).slice(0, 5).map((review) => ({
    author: review.authorAttribution?.displayName || "Google review",
    rating: review.rating || 0,
    time: review.relativePublishTimeDescription || "On Google",
    text: review.text?.text || review.originalText?.text || "",
    photo: review.authorAttribution?.photoUri || "",
  })).filter((review) => review.text && review.rating >= 1);
  return {
    live: true,
    source: "places",
    rating: data.rating,
    total: data.userRatingCount,
    reviews,
    writeReviewUrl: googleBusiness.writeReviewUrl,
    profileUrl: googleBusiness.reviewsUrl,
  };
}

async function fromPublicListing(): Promise<GooglePlaceView | null> {
  const page = await fetch("https://www.google.com/maps?cid=" + googleBusiness.cid + "&hl=en", {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 86400 },
  });
  if (!page.ok) return null;
  const html = await page.text();
  const found = html.match(/\/maps\/preview\/place\?[^"\s]+/);
  if (!found) return null;
  const preview = await fetch("https://www.google.com" + found[0].replace(/&amp;/g, "&"), {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 86400 },
  });
  if (!preview.ok) return null;
  const parsed = parsePublicPlace(await preview.text());
  if (parsed.rating == null || parsed.total == null) return null;
  return {
    live: true,
    source: "listing",
    rating: parsed.rating,
    total: parsed.total,
    reviews: parsed.reviews,
    writeReviewUrl: googleBusiness.writeReviewUrl,
    profileUrl: googleBusiness.reviewsUrl,
  };
}

export async function getGooglePlace(samples: GoogleCard[]): Promise<GooglePlaceView> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  try {
    if (key) {
      const live = await fromPlacesApi(key);
      if (live) return live;
    }
  } catch {
    /* fall through */
  }
  try {
    const listing = await fromPublicListing();
    if (listing) return listing;
  } catch {
    /* fall through */
  }
  return {
    live: false,
    source: "sample",
    rating: null,
    total: null,
    reviews: samples,
    writeReviewUrl: googleBusiness.writeReviewUrl,
    profileUrl: googleBusiness.reviewsUrl,
  };
}
