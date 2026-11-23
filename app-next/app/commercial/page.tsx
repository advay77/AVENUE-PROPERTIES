import type { Metadata } from "next";
import Link from "next/link";
import { ListingBoard } from "@/components/ListingBoard";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Commercial Property in Noida — Avenue Properties" },
  description:
    "Offices, retail, showrooms and warehousing for sale and lease across Noida. Leasing, investment and fit-out advice from Avenue Properties.",
};

export default async function CommercialPage({
  searchParams,
}: {
  searchParams: Promise<{ kind?: string; locality?: string; price?: string }>;
}) {
  const sp = await searchParams;
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span aria-current="page">Commercial</span>
          </nav>
          <h1>Commercial property in Noida</h1>
          <p className="ph-lede">
            Offices, retail, showrooms and warehousing — for purchase, for lease, and for the fit-out afterwards. Sectors 62, 63, 18, 132 and the Expressway corridor.
          </p>
          <div className="ph-actions">
            <Link className="btn btn--primary" href="/contact">Discuss a requirement</Link>
            <a className="btn btn--outline-light" href={waLink("Hi Avenue Properties, I am looking for commercial space in Noida.")} target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="shell">
          <ListingBoard purpose="" segment="commercial" initialKind={sp.kind || ""} initialLocality={sp.locality || ""} initialPrice={sp.price || ""} sortPriceLabel="Price" footLabel="Looking for something specific?" />
        </div>
      </section>
      <section className="section section--tint">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">Commercial services</span>
            <h2>Three ways we work on commercial space</h2>
            <p>Whether you are taking space, giving space or investing in it, the work is different each time.</p>
          </div>
          <div className="grid-3">
            <div className="value-card reveal">
              <span className="value-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 20v-6" /></svg></span>
              <h3>Taking space</h3>
              <p>Headcount to floor plate, lease terms, lock-in, escalation and the fit-out budget — sized before you sign, not after.</p>
            </div>
            <div className="value-card reveal">
              <span className="value-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V7l7-4 7 4v14" /><path d="M9 21v-5h6v5" /></svg></span>
              <h3>Leasing out</h3>
              <p>Tenant search, credit sense-check, rent benchmarking for the building, and a lease that holds up when the tenant changes.</p>
            </div>
            <div className="value-card reveal">
              <span className="value-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l6-6 4 4 7-7" /><path d="M14 8h6v6" /></svg></span>
              <h3>Investing</h3>
              <p>Yield maths on a tenanted unit, exit liquidity in that micro-market, and the title and approval checks before money moves.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section section--white section--sm">
        <div className="shell">
          <div className="int-layout">
            <div className="int-collage reveal">
              <div className="media"><img loading="lazy" src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=72" alt="Fitted office floor" /></div>
              <div className="media"><img loading="lazy" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=72" alt="Retail frontage" /></div>
              <div className="media"><img loading="lazy" src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=72" alt="Meeting room" /></div>
            </div>
            <div>
              <div className="sec-head reveal">
                <span className="eyebrow">Fit-out</span>
                <h2>Take the floor, then make it work</h2>
                <p>Most commercial deals stall after signing, when the fit-out turns out to cost more than the first year of rent. We plan the two together.</p>
              </div>
              <div className="int-list">
                <div className="int-item reveal"><span className="value-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg></span><div><h3>Layout before lease</h3><p>A workstation layout drawn on the actual floor plate, so you know the real seat count before signing.</p></div></div>
                <div className="int-item reveal"><span className="value-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></span><div><h3>Budget and timeline</h3><p>A fit-out number you can take to a board, and a handover date you can plan a move around.</p></div></div>
                <div className="int-item reveal"><span className="value-ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m4 12 5.5 5.5L20 7" /></svg></span><div><h3>Execution</h3><p>Civil, electrical, HVAC, furniture and signage coordinated through one point of contact.</p></div></div>
              </div>
              <div style={{ marginTop: 26 }} className="reveal">
                <Link className="btn btn--primary btn--lg" href="/interiors">See interior services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
