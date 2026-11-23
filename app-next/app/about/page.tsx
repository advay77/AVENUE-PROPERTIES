import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { IconCheck, IconClose, IconPin } from "@/components/icons";
import { Quotes } from "@/components/Quotes";
import { telLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Avenue Properties — Noida Real Estate Consultancy" },
  description:
    "Avenue Properties is a real estate consultancy in Sector 75, Noida, covering residential and commercial buying, selling, renting, leasing, valuation and interiors.",
};

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">/</span>
            <span aria-current="page">About Us</span>
          </nav>
          <h1>A property consultancy, not a listing board</h1>
          <p className="ph-lede">Avenue Properties works out of Sector 75, Noida, advising buyers, sellers, tenants and businesses on residential and commercial property across Noida and Greater Noida.</p>
          <div className="ph-actions">
            <Link className="btn btn--primary" href="/contact">Talk to us</Link>
            <a className="btn btn--outline-light" href={telLink()}>Call the office</a>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="why-layout">
            <div className="why-visual reveal">
              <img loading="lazy" src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=72" alt="Residential street in Noida" />
              <div className="why-plate">
                <strong>Sector 75, Noida</strong>
                <span>Walk-in office, open every day from 10 AM to 8 PM.</span>
              </div>
            </div>
            <div>
              <div className="sec-head reveal">
                <span className="eyebrow">Who we are</span>
                <h2>We work one sector at a time</h2>
                <p>Noida is not one market. Sector 50 behaves nothing like Sector 137, and Greater Noida West is a different conversation again.</p>
              </div>
              <div style={{ display: "grid", gap: 18, color: "var(--ink-soft)", lineHeight: 1.75, fontSize: 16 }} className="reveal">
                <p>Avenue Properties is a consultancy. That means the first conversation is about your budget, your commute and when you actually need to move — not about whichever unit we are keenest to close this week.</p>
                <p>We cover residential buying and selling, rentals, and commercial sale, rental and leasing. Alongside that we handle the parts most people find hardest to do alone: valuing a property honestly, negotiating on price, and keeping the documentation moving so a deal does not stall at the registry.</p>
                <p>We also run an interior services arm, so a flat or office can be fitted out by the same team that handed you the keys.</p>
              </div>
              <div className="ph-actions" style={{ marginTop: 28 }}>
                <Link className="btn btn--primary" href="/contact">Start a conversation</Link>
                <Link className="btn btn--ghost" href="/buy">Browse properties</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint" id="services">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">Services</span>
            <h2>What we actually do for you</h2>
            <p>Six pieces of work. Most clients need four or five of them on any one transaction.</p>
          </div>
          <div className="grid-3">
            <Card title="Expert property consultation" body="A shortlist built from your budget, family needs and commute — not whatever is easiest to sell this week." icon={<IconPin size={20} />} bulb />
            <Card title="Site visit assistance" body="Visits planned sector by sector so you see several comparable options in one trip, with someone who knows the block." icon={<IconPin size={20} />} />
            <Card title="Price negotiation" body="We quote the sector’s recent transaction range before you make an offer, and carry the negotiation for you." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5M21 3l-7.5 7.5M8 21H3v-5M3 21l7.5-7.5" /></svg>} />
            <Card title="Property valuation" body="An honest view of what your flat, floor or shop should fetch today, based on what comparable units actually closed at." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V8l8-5 8 5v12" /><path d="M9 20v-6h6v6" /><path d="M2 20h20" /></svg>} />
            <Card title="Documentation coordination" body="Agreement to sale, registry appointment, society NOC and handover — coordinated so nothing stalls at the last step." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" /><path d="M14 2v5h5M9 13h6M9 17h4" /></svg>} />
            <Card title="Residential & commercial" body="Flats, builder floors and plots on one side; offices, retail and leasing on the other. Same consultant either way." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18" /></svg>} />
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">Sample testimonials</span>
            <h2>What clients would say here</h2>
            <p>Placeholder reviews, shown to demonstrate the layout. They will be replaced with real, attributed client testimonials once those are collected. Live Google reviews appear on the home page.</p>
          </div>
          <Quotes />
        </div>
      </section>

      <section className="section section--ink section--sm">
        <div className="shell">
          <div className="sec-head reveal" style={{ marginBottom: 28 }}>
            <span className="eyebrow">Working with us</span>
            <h2>What to expect</h2>
            <p>Three things we hold ourselves to, and one thing we will not do.</p>
          </div>
          <div className="grid-2" style={{ gap: 14 }}>
            <Note ok title="We tell you when something is overpriced." body="Even when it is the unit you have already fallen for." />
            <Note ok title="One point of contact." body="The same person through shortlisting, visits, negotiation and registry." />
            <Note ok title="Paperwork is part of the job." body="Not something handed back to you at the end." />
            <Note title="No pressure calling." body="If the timing is not right, we will say so and stay in touch." />
          </div>
        </div>
      </section>
    </>
  );
}

function Card({ title, body, icon, bulb }: { title: string; body: string; icon: ReactNode; bulb?: boolean }) {
  return (
    <div className="value-card reveal">
      <span className="value-ico">
        {bulb ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6M10 21h4" />
            <path d="M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6h5.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" />
          </svg>
        ) : (
          icon
        )}
      </span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

function Note({ ok = false, title, body }: { ok?: boolean; title: string; body: string }) {
  return (
    <div className="note note--ink reveal">
      {ok ? <IconCheck size={17} /> : <IconClose />}
      <span>
        <strong style={{ color: "#fff" }}>{title}</strong>
        <br />
        {body}
      </span>
    </div>
  );
}
