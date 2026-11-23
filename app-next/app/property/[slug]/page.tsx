import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquiryForm } from "@/components/EnquiryForm";
import { BrandLogo } from "@/components/BrandLogo";
import { IconCheck, IconInfo, IconPin, IconWa } from "@/components/icons";
import { PropertyCard } from "@/components/PropertyCard";
import { business, demoMode, KIND_LABEL, properties, telLink, waLink, type Property } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return properties.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = properties.find((x) => x.id === slug);
  if (!p) return { title: { absolute: "Property details — Avenue Properties" } };
  return {
    title: { absolute: `${p.title} — ${business.name}` },
    description: p.desc,
  };
}

export default async function PropertyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = properties.find((x) => x.id === slug);
  if (!p) notFound();
  const similar = properties.filter((x) => x.id !== p.id && x.segment === p.segment && x.purpose === p.purpose).slice(0, 3);
  const msg = `Hi ${business.name}, I would like details and a site visit for: ${p.title} (${p.locality}, ${p.priceLabel}).`;
  const specs: [string, string][] = [
    ["Configuration", p.bhk ? `${p.bhk} BHK` : KIND_LABEL[p.kind] || "—"],
    ["Area", p.sqftLabel],
    ["Facing", p.facing],
    ["Floor", p.floor],
    ["Parking", p.parking],
    ["Furnishing", p.furnishing],
    ["Possession", p.possession],
    ["Age", p.ageOfProperty],
  ];

  return (
    <>
      <section className="page-hero" style={{ paddingBlock: 0 }}>
        <img className="ph-bg" src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <Link href="/buy">Properties</Link>
            <span className="sep">/</span>
            <span aria-current="page">{p.locality} · {KIND_LABEL[p.kind] || p.kind}</span>
          </nav>
          <h1 style={{ fontSize: "clamp(22px,2.6vw,30px)", marginTop: 12 }}>Property details</h1>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="detail">
            <div>
              <div className="gallery">
                {p.images.map((src, i) => (
                  <div className="media" key={src}>
                    <img loading={i ? "lazy" : undefined} src={src} alt={`${p.title} — photo ${i + 1}`} />
                  </div>
                ))}
              </div>
              <div className="detail-head">
                <div className="prop-badges-l">
                  {p.purpose === "rent" ? <span className="tag tag--green">For rent</span> : <span className="tag tag--type">For sale</span>}
                  <span className="tag tag--type">{KIND_LABEL[p.kind] || p.kind}</span>
                  <span className="tag tag--type">{p.status}</span>
                </div>
                <h1>{p.title}</h1>
                <p className="prop-loc" style={{ fontSize: 15.5 }}>
                  <IconPin /> {p.locality}, {p.area}
                </p>
                <div className="detail-price">
                  <b>{p.priceLabel}</b>
                  <span>{p.priceSuffix}</span>
                </div>
              </div>
              <ul className="spec-grid">
                {specs.map(([k, v]) => (
                  <li key={k}><span className="k">{k}</span><span className="v">{v || "—"}</span></li>
                ))}
              </ul>
              <div className="detail-block">
                <h2>About this property</h2>
                <p>{p.desc}</p>
              </div>
              <div className="detail-block">
                <h2>Highlights</h2>
                <ul className="amenities">
                  {p.highlights.map((h) => (
                    <li key={h}><IconCheck /><span>{h}</span></li>
                  ))}
                </ul>
              </div>
              <div className="detail-block">
                <h2>Amenities</h2>
                <ul className="amenities">
                  {p.amenities.map((a) => (
                    <li key={a}><IconCheck /><span>{a}</span></li>
                  ))}
                </ul>
              </div>
              {p.demo && demoMode ? (
                <p className="note" style={{ marginTop: 22 }}>
                  <IconInfo />
                  <span><strong>Sample listing.</strong> This is demo content used to show the detail page layout. It is not live inventory and nothing here is a verified offer.</span>
                </p>
              ) : null}
            </div>
            <aside className="detail-aside">
              <div className="agent-card">
                <div className="agent-meta">
                  <BrandLogo />
                  <span>
                    <strong>{business.name}</strong>
                    <span>{business.locality} · open all days, 10 AM – 8 PM</span>
                  </span>
                </div>
                <h2>Arrange a site visit</h2>
                <VisitForm property={p} />
                <div style={{ display: "grid", gap: 9 }}>
                  <a className="btn btn--wa btn--block" href={waLink(msg)} target="_blank" rel="noopener">
                    <IconWa /> Ask on WhatsApp
                  </a>
                  <a className="btn btn--ghost btn--block" href={telLink()}>Call {business.phoneDisplay}</a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section--tint section--sm">
        <div className="shell">
          <div className="sec-head sec-head--row reveal">
            <div className="sec-head-copy">
              <span className="eyebrow">Keep looking</span>
              <h2>Similar properties</h2>
              <p>Other listings in the same bracket. Ask us for the live set before planning a visit.</p>
            </div>
            <Link className="btn btn--ghost" href="/buy">All listings</Link>
          </div>
          <div className="prop-grid">
            {similar.map((item) => (
              <PropertyCard key={item.id} property={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function VisitForm({ property }: { property: Property }) {
  return (
    <EnquiryForm
      idPrefix="d"
      heading=""
      lede=""
      intentOptions={[]}
      defaultMessage="I would like to see this property."
      submitLabel="Request a visit"
      consentText="I agree to be contacted about this property."
      okStrong="Request noted."
      bare
      extra={{ property: `${property.title} — ${property.locality} (${property.priceLabel})`, intent: "Site visit request" }}
    />
  );
}
