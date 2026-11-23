import raw from "./inventory.json";

export const business = {
  name: "Avenue Properties",
  addressLine1: "Shop No. 27, Aims Golf Avenue 1",
  addressLine2: "Sector 75, Noida, Uttar Pradesh 201301",
  utilityAddress: "Shop No. 27, Aims Golf Avenue 1, Sector 75, Noida",
  locality: "Noida",
  region: "Uttar Pradesh",
  postalCode: "201301",
  phoneDisplay: "+91 70119 66691",
  phoneDial: "+917011966691",
  whatsapp: "917011966691",
  hours: "10:00 AM – 8:00 PM, Monday to Sunday",
  mapsQuery: "Aims Golf Avenue 1, Sector 75, Noida, Uttar Pradesh 201301",
};

export const demoMode = true;

export function telLink() {
  return `tel:${business.phoneDial}`;
}

export function mapsLink() {
  return `https://maps.google.com/?q=${encodeURIComponent(business.mapsQuery)}`;
}

export function waLink(message?: string) {
  const msg = message || `Hi ${business.name}, I would like to discuss a property.`;
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export type Property = {
  id: string;
  title: string;
  purpose: "buy" | "rent";
  segment: "residential" | "commercial";
  kind: string;
  price: number;
  priceLabel: string;
  priceSuffix: string;
  bhk: number | null;
  sqft: number;
  sqftLabel: string;
  locality: string;
  area: string;
  status: string;
  facing: string;
  floor: string;
  parking: string;
  furnishing: string;
  possession: string;
  ageOfProperty: string;
  images: string[];
  specs: [string, string][];
  desc: string;
  highlights: string[];
  amenities: string[];
  featured: boolean;
  demo: boolean;
};

export type Category = { name: string; sub: string; img: string; href: string };
export type Locality = { name: string; sub: string; meta: string; img: string; href: string };
export type Testimonial = { quote: string; name: string; role: string; avatar: string };
export type SampleReview = { author: string; rating: number; time: string; text: string; sample?: boolean };

export const KIND_LABEL: Record<string, string> = {
  apartment: "Apartment",
  "builder-floor": "Builder floor",
  villa: "Villa / House",
  plot: "Plot / Land",
  office: "Office",
  retail: "Retail / Showroom",
  shop: "Shop",
  warehouse: "Warehouse",
};

export const properties = raw.properties as Property[];
export const categories = raw.categories as Category[];
export const localities = raw.localities as Locality[];
export const testimonials = raw.testimonials as Testimonial[];
export const sampleGoogleReviews = raw.sampleGoogleReviews as SampleReview[];

export function legacyHref(href: string) {
  return href
    .replaceAll("property.html?id=", "/property/")
    .replaceAll("index.html", "/")
    .replaceAll("buy.html", "/buy")
    .replaceAll("rent.html", "/rent")
    .replaceAll("commercial.html", "/commercial")
    .replaceAll("interiors.html", "/interiors")
    .replaceAll("about.html", "/about")
    .replaceAll("contact.html", "/contact");
}

export function propertyHref(id: string) {
  return `/property/${id}`;
}

export function interestMessage(p: Pick<Property, "title" | "locality">) {
  return `Hi ${business.name}, I am interested in: ${p.title} (${p.locality}).`;
}
