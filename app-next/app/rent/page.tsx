import type { Metadata } from "next";
import Link from "next/link";
import { ListingBoard } from "@/components/ListingBoard";
import { telLink, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Rent Property in Noida — Avenue Properties" },
  description:
    "Flats, builder floors and furnished homes for rent across Noida and Greater Noida. Family, bachelor and corporate lease options through Avenue Properties.",
};

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; locality?: string; price?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span aria-current="page">Rent Properties</span>
          </nav>
          <h1>Property for rent in Noida</h1>
          <p className="ph-lede">
            Flats, builder floors and furnished homes to rent across Noida. Family, bachelor and corporate lease options — we screen the landlord and the paperwork, not just the property.
          </p>
          <div className="ph-actions">
            <Link className="btn btn--primary" href="/contact">Tell us what you need</Link>
            <a className="btn btn--outline-light" href={waLink("Hi Avenue Properties, I am looking for a rental property in Noida.")} target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="shell">
          <ListingBoard purpose="rent" segment="residential" initialKind={sp.kind || ""} initialLocality={sp.locality || ""} initialPrice={sp.price || ""} sortPriceLabel="Rent" footLabel="Need something else? Tell us" />
        </div>
      </section>
      <section className="sell section section--sm">
        <img className="sell-bg" loading="lazy" src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell sell-layout">
          <div className="reveal">
            <span className="eyebrow">Landlords</span>
            <h2>Have a flat or floor lying empty?</h2>
            <p>We photograph it, list it, screen the enquiries and bring you tenants who have already been checked — then draw up the rent agreement and handle the handover inventory.</p>
            <div className="sell-actions">
              <Link className="btn btn--light btn--lg" href="/contact#list">List it for rent</Link>
              <a className="btn btn--outline-light btn--lg" href={telLink()}>Call the office</a>
            </div>
          </div>
          <ol className="sell-steps reveal">
            <li className="sell-step"><b>1</b><span><strong>Rent assessment</strong>What comparable units in your society are actually getting.</span></li>
            <li className="sell-step"><b>2</b><span><strong>Listing & screening</strong>Photographs, listing copy, and only screened tenants shown around.</span></li>
            <li className="sell-step"><b>3</b><span><strong>Agreement</strong>Rent agreement, police verification guidance and deposit terms.</span></li>
            <li className="sell-step"><b>4</b><span><strong>Handover</strong>Inventory list, meter readings and keys, documented.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
