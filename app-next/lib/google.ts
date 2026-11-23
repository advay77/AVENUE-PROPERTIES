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
    const take = (node: unknown) => {
      if (!Array.isArray(node)) return;
      let name = "";
      let photo = "";
      let time = "";
      let stars = 0;
      let text = "";
      let names = 0;
      const walk = (current: unknown) => {
        if (!Array.isArray(current)) return;
        const photoUrl = current[1];
        const contrib = current[2];
        if (
          typeof current[0] === "string" &&
          typeof photoUrl === "string" &&
          photoUrl.indexOf("googleusercontent.com") !== -1 &&
          Array.isArray(contrib) &&
          typeof contrib[0] === "string" &&
          contrib[0].indexOf("maps/contrib/") !== -1 &&
          current[0].length > 1 &&
          current[0].length < 80 &&
          current[0].indexOf("http") !== 0
        ) {
          names += 1;
          name = current[0];
          photo = photoUrl.indexOf("//") === 0 ? "https:" + photoUrl : photoUrl;
        }
        if (!stars && current.length === 1 && typeof current[0] === "number" && current[0] >= 1 && current[0] <= 5) stars = current[0];
        current.forEach((child) => {
          if (typeof child !== "string") {
            walk(child);
            return;
          }
          if (!time && / ago$/.test(child) && child.length < 40) time = child;
          const skip = child.indexOf("http") === 0 || child.indexOf("/") === 0 || child.indexOf("Dear ") === 0;
          if (!skip && child.length > 40 && child.length > text.length) text = child;
        });
      };
      walk(node);
      const body = cleanQuote(text);
      const key = name + body.slice(0, 48);
      if (names === 1 && name && body && stars && !seen.has(key)) {
        seen.add(key);
        reviews.push({ author: name, rating: stars, time: time || "On Google", text: body, photo });
      }
      node.forEach(take);
    };
    take(data);
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
    next: { revalidate: 3600 },
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
    next: { revalidate: 3600 },
  });
  if (!page.ok) return null;
  const html = await page.text();
  const found = html.match(/\/maps\/preview\/place\?[^"\s]+/);
  if (!found) return null;
  const preview = await fetch("https://www.google.com" + found[0].replace(/&amp;/g, "&"), {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en" },
    signal: AbortSignal.timeout(8000),
    next: { revalidate: 3600 },
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
