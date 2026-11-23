import type { Metadata } from "next";
import Link from "next/link";
import { ListingBoard } from "@/components/ListingBoard";
import { telLink, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Buy Property in Noida — Avenue Properties" },
  description:
    "Apartments, builder floors, villas and plots for sale across Noida and Greater Noida, with site visits, price negotiation and documentation handled by Avenue Properties.",
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; locality?: string; price?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span aria-current="page">Buy Properties</span>
          </nav>
          <h1>Property for sale in Noida</h1>
          <p className="ph-lede">
            Apartments, builder floors, independent houses and plots across Noida and Greater Noida. Filter the sample set below, then tell us your actual requirement — live inventory moves faster than any listing page.
          </p>
          <div className="ph-actions">
            <Link className="btn btn--primary" href="/contact">Send your requirement</Link>
            <a className="btn btn--outline-light" href={waLink("Hi Avenue Properties, I am looking to buy a property in Noida.")} target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="shell">
          <ListingBoard purpose="buy" segment="residential" initialKind={sp.kind || ""} initialLocality={sp.locality || ""} initialPrice={sp.price || ""} sortPriceLabel="Price" footLabel="Can’t find it? Tell us" />
        </div>
      </section>
      <section className="sell section section--sm">
        <img className="sell-bg" loading="lazy" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell sell-layout">
          <div className="reveal">
            <span className="eyebrow">Buying in Noida</span>
            <h2>Tell us the budget and the commute. We will do the shortlisting.</h2>
            <p>Most buyers lose weeks on listings that were sold a month ago. Send us the requirement once and we will come back with what is genuinely available in your sector and budget this week.</p>
            <div className="sell-actions">
              <Link className="btn btn--light btn--lg" href="/contact">Send your requirement</Link>
              <a className="btn btn--outline-light btn--lg" href={telLink()}>Call the office</a>
            </div>
          </div>
          <ol className="sell-steps reveal">
            <li className="sell-step"><b>1</b><span><strong>Requirement call</strong>Budget, configuration, sector, possession timeline.</span></li>
            <li className="sell-step"><b>2</b><span><strong>Shortlist</strong>Three to five options that actually fit, with honest pricing notes.</span></li>
            <li className="sell-step"><b>3</b><span><strong>Site visits</strong>Planned sector by sector so one trip covers several options.</span></li>
            <li className="sell-step"><b>4</b><span><strong>Offer to registry</strong>Negotiation, agreement, bank coordination, registry and handover.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}
