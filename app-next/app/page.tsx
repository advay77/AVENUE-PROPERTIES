import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { FeaturedGrid } from "@/components/FeaturedGrid";
import { IconClock, IconHome, IconInfo, IconPhone, IconPin, IconWa } from "@/components/icons";
import { Reviews } from "@/components/Reviews";
import { SearchConsole } from "@/components/SearchConsole";
import { getGooglePlace } from "@/lib/google";
import { business, categories, legacyHref, localities, mapsLink, sampleGoogleReviews, telLink, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Avenue Properties — Real Estate Consultancy in Noida" },
  description:
    "Avenue Properties is a real estate consultancy in Sector 75, Noida. Residential and commercial property buying, selling, renting and leasing, with valuation, documentation coordination and interior services.",
  openGraph: {
    title: "Avenue Properties — Real Estate Consultancy in Noida",
    description: "Find the right property. Make the right move. Residential and commercial property consultancy in Noida, Uttar Pradesh.",
    type: "website",
  },
};

const BUDGETS = ["Not decided yet", "Under ₹50 Lakh", "₹50 Lakh – ₹1 Crore", "₹1 Cr – ₹2 Cr", "₹2 Cr – ₹4 Cr", "Above ₹4 Cr", "Rental — monthly"];
const INTENTS = ["Buy a property", "Rent a property", "Sell my property", "Rent out my property", "Lease commercial space", "Discuss interior services"];

export default async function HomePage() {
  const google = await getGooglePlace(sampleGoogleReviews.map((review) => ({ ...review, photo: "" })));
  const agent: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Avenue Properties",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop No. 27, Aims Golf Avenue 1, Sector 75",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
    telephone: "+91-70119-66691",
    hasMap: google.profileUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    areaServed: ["Noida", "Greater Noida"],
  };
  if (google.live && google.rating != null && google.total != null) {
    agent.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: google.rating,
      reviewCount: google.total,
      bestRating: 5,
    };
  }
  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden="true">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=72" alt="" />
        </div>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Noida & Greater Noida</span>
            <h1>
              Find the right property.<em>Make the right move.</em>
            </h1>
            <p className="hero-lede">
              Avenue Properties advises buyers, sellers, tenants and businesses across Noida — from shortlisting and site visits to negotiation, valuation and documentation. One consultant, start to possession.
            </p>
            <ul className="hero-marks">
              <li className="hero-mark">
                <IconHome /> Residential & commercial
              </li>
              <li className="hero-mark">
                <IconPin /> Sector 75, Noida
              </li>
              <li className="hero-mark">
                <IconClock /> Open all days, 10 AM – 8 PM
              </li>
            </ul>
          </div>
        </div>
      </section>

      <SearchConsole />

      <section className="section section--tint">
        <div className="shell">
          <div className="sec-head sec-head--row reveal">
            <div className="sec-head-copy">
              <span className="eyebrow">What we handle</span>
              <h2>Property categories</h2>
              <p>Every category below is handled end to end — shortlisting, site visits, price negotiation, paperwork and handover.</p>
            </div>
            <Link className="btn btn--ghost" href="/buy">
              See all listings
            </Link>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link className="cat-card reveal" href={legacyHref(c.href)} key={c.name}>
                <img loading="lazy" src={c.img} alt={c.name} />
                <span className="cat-arrow" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
                <div className="cat-body">
                  <h3>{c.name}</h3>
                  <span>{c.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white" id="featured">
        <div className="shell">
          <div className="sec-head sec-head--row reveal">
            <div className="sec-head-copy">
              <span className="eyebrow">Sample inventory</span>
              <h2>Featured properties</h2>
              <p>Illustrative listings showing how inventory will appear. Live availability, pricing and photographs are shared on request.</p>
            </div>
            <Link className="btn btn--ghost" href="/contact">
              Ask for live availability
            </Link>
          </div>
          <FeaturedGrid />
          <p className="note" style={{ marginTop: 30 }}>
            <IconInfo />
            <span>
              <strong>Demo content.</strong> The listings above are illustrative examples used to show the card layout. They are not live inventory, and no price, area or availability shown here is a verified offer. Real listings, photographs and documents replace them once inventory is supplied.
            </span>
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="why-layout">
            <div className="why-visual reveal">
              <img loading="lazy" src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=72" alt="Interior of a contemporary residence" />
              <div className="why-plate">
                <strong>Consultation, not cold calling</strong>
                <span>Shortlists built around your budget, commute and possession timeline.</span>
              </div>
            </div>
            <div>
              <div className="sec-head reveal">
                <span className="eyebrow">Why Avenue Properties</span>
                <h2>The work between “I like it” and “it’s mine”</h2>
                <p>Most of a property decision happens off the listing page — in the site visit, the price conversation and the paperwork. That is the part we handle.</p>
              </div>
              <div className="value-grid">
                <Value icon="bulb" title="Expert property consultation" body="A shortlist built from your budget, family needs and commute — not whatever is easiest to sell this week." />
                <Value icon="pin" title="Site visit assistance" body="Visits planned sector by sector so you see several comparable options in one trip, with someone who knows the block." />
                <Value icon="expand" title="Price negotiation" body="We quote the sector’s recent transaction range before you make an offer, and carry the negotiation for you." />
                <Value icon="house" title="Property valuation" body="An honest view of what your flat, floor or shop should fetch today, based on what comparable units actually closed at." />
                <Value icon="file" title="Documentation coordination" body="Agreement to sale, registry appointment, society NOC and handover — coordinated so nothing stalls at the last step." />
                <Value icon="case" title="Residential & commercial" body="Flats, builder floors and plots on one side; offices, retail and leasing on the other. Same consultant either way." />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="sec-head sec-head--row reveal">
            <div className="sec-head-copy">
              <span className="eyebrow">Explore the city</span>
              <h2>Where people are buying in Noida</h2>
              <p>A quick orientation to the sectors we work in most. Notes are indicative and meant to start the conversation — current inventory and pricing come from us directly.</p>
            </div>
            <Link className="btn btn--ghost" href="/contact">
              Talk to a consultant
            </Link>
          </div>
          <div className="loc-grid">
            {localities.map((l) => (
              <Link className="loc-card reveal" href={legacyHref(l.href)} key={l.name}>
                <img loading="lazy" src={l.img} alt={l.name} />
                <div className="loc-body">
                  <h3>{l.name}</h3>
                  <span>{l.sub}</span>
                  <span className="loc-meta">
                    <i className="loc-dot" aria-hidden="true" /> {l.meta}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint" id="reviews">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">Reviews</span>
            <h2>What clients say on Google</h2>
            <p>Ratings and reviews come straight from the Avenue Properties Google Business Profile, so nothing here is written by us. The button opens Google’s own review box — new reviews go directly to Google.</p>
          </div>
          <Reviews place={google} />
        </div>
      </section>

      <section className="sell section" id="sell">
        <img className="sell-bg" loading="lazy" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell sell-layout">
          <div className="reveal">
            <span className="eyebrow">Sellers & landlords</span>
            <h2>Looking to sell or rent out your property?</h2>
            <p>Tell us what you own and where. We will give you a realistic price band for the sector, photograph and list the property, screen the enquiries that come in, run the site visits and carry the negotiation through to registry or rent agreement.</p>
            <div className="sell-actions">
              <Link className="btn btn--light btn--lg" href="/contact#list">
                List your property
              </Link>
              <a className="btn btn--wa btn--lg" href={waLink("Hi Avenue Properties, I would like to list my property.")} target="_blank" rel="noopener">
                <IconWa size={17} /> Send details on WhatsApp
              </a>
            </div>
          </div>
          <ol className="sell-steps reveal">
            <Step n="1" title="Share the details" body="Sector, configuration, area, floor and what you expect." />
            <Step n="2" title="Valuation & pricing" body="A price band based on what comparable units in your sector are closing at." />
            <Step n="3" title="Listing & viewings" body="Photographs, listing copy, screened enquiries and scheduled site visits." />
            <Step n="4" title="Close & paperwork" body="Negotiation, agreement, registry or rent agreement, and handover." />
          </ol>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="int-layout">
            <div className="int-collage reveal">
              <div className="media">
                <img loading="lazy" src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=72" alt="Contemporary living room interior" />
              </div>
              <div className="media">
                <img loading="lazy" src="https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=72" alt="Modular kitchen" />
              </div>
              <div className="media">
                <img loading="lazy" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=72" alt="Office meeting room interior" />
              </div>
            </div>
            <div>
              <div className="sec-head reveal">
                <span className="eyebrow">Interior services</span>
                <h2>Hand over the keys, then hand over the drawings</h2>
                <p>A separate service from the property work. If you want the flat, floor or office fitted out before you move in, we can take it from empty shell to finished.</p>
              </div>
              <div className="int-list">
                <div className="int-item reveal">
                  <span className="value-ico"><IconHome size={18} /></span>
                  <div>
                    <h3>Residential interiors</h3>
                    <p>Full-home fit-out or room by room — false ceilings, flooring, painting, lighting and furniture.</p>
                  </div>
                </div>
                <div className="int-item reveal">
                  <span className="value-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 20v-6" /></svg>
                  </span>
                  <div>
                    <h3>Commercial & office fit-outs</h3>
                    <p>Workstation layouts, cabins, reception and conference rooms, planned around headcount and the lease terms.</p>
                  </div>
                </div>
                <div className="int-item reveal">
                  <span className="value-ico">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
                  </span>
                  <div>
                    <h3>Modular kitchens & wardrobes</h3>
                    <p>Measured, made and installed — the two things that decide how a new home actually feels to live in.</p>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 11, flexWrap: "wrap", marginTop: 26 }} className="reveal">
                <Link className="btn btn--primary btn--lg" href="/interiors">
                  See interior services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--ink" id="contact">
        <div className="shell">
          <div className="contact-layout">
            <div className="reveal">
              <span className="eyebrow">Get in touch</span>
              <h2 style={{ fontSize: "clamp(26px,3.6vw,44px)", fontWeight: 800, marginTop: 16 }}>Come to the office, or just send a message</h2>
              <p style={{ marginTop: 16, color: "rgba(255,255,255,.68)", maxWidth: "48ch", fontSize: "clamp(15px,1.4vw,17px)" }}>
                We are open every day of the week. Walk in, call, or send the property details on WhatsApp and we will come back to you.
              </p>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-ico"><IconPin size={18} /></span>
                  <div>
                    <div className="k">Office</div>
                    <div className="v">
                      {business.name}
                      <br />
                      {business.addressLine1},<br />
                      {business.addressLine2}
                    </div>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-ico"><IconPhone size={18} /></span>
                  <div>
                    <div className="k">Phone & WhatsApp</div>
                    <div className="v">
                      <a href={telLink()}>{business.phoneDisplay}</a>
                    </div>
                  </div>
                </div>
                <div className="info-row">
                  <span className="info-ico"><IconClock size={18} /></span>
                  <div>
                    <div className="k">Working hours</div>
                    <div className="v">
                      {business.hours}
                      <br />
                      <small>Open all seven days</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-actions">
                <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener">
                  <IconWa size={17} /> Chat on WhatsApp
                </a>
                <a className="btn btn--light" href={telLink()}>
                  Call the office
                </a>
              </div>
              <div className="map">
                <svg className="map-grid" aria-hidden="true" width="100%" height="100%">
                  <defs>
                    <pattern id="mg" width="56" height="56" patternUnits="userSpaceOnUse">
                      <path d="M56 0H0v56" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mg)" />
                  <path d="M0 62 H2000" stroke="rgba(255,255,255,.12)" strokeWidth="9" />
                  <path d="M330 0 V600" stroke="rgba(255,255,255,.12)" strokeWidth="7" />
                </svg>
                <a className="map-pin" href={mapsLink()} target="_blank" rel="noopener">
                  <span className="pin">
                    <IconPin size={19} />
                  </span>
                  <b>Aims Golf Avenue 1, Sector 75</b>
                  <span>Open in Google Maps →</span>
                </a>
                <span className="map-note">Map placeholder — live embed on the Contact page</span>
              </div>
            </div>
            <EnquiryForm
              idPrefix="h"
              heading="Send an enquiry"
              lede="Tell us what you are looking for. We will call back within working hours."
              intentOptions={INTENTS}
              budgetOptions={BUDGETS}
              submitLabel="Send enquiry"
              consentText="I agree to be contacted by Avenue Properties about this enquiry by phone, WhatsApp or email."
              callLink
              okStrong="Enquiry received."
            />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(agent),
        }}
      />
    </>
  );
}

function Value({ icon, title, body }: { icon: string; title: string; body: string }) {
  return (
    <div className="value-card reveal">
      <span className="value-ico">{valueIcon(icon)}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function valueIcon(icon: string) {
  if (icon === "pin") return <IconPin size={20} />;
  if (icon === "house") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 20V8l8-5 8 5v12" />
        <path d="M9 20v-6h6v6" />
        <path d="M2 20h20" />
      </svg>
    );
  }
  if (icon === "expand") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 3h5v5M21 3l-7.5 7.5M8 21H3v-5M3 21l7.5-7.5" />
      </svg>
    );
  }
  if (icon === "file") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v5h5M9 13h6M9 17h4" />
      </svg>
    );
  }
  if (icon === "case") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="8" width="18" height="13" rx="2" />
        <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
    </svg>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="sell-step">
      <b>{n}</b>
      <span>
        <strong>{title}</strong>
        {body}
      </span>
    </li>
  );
}
