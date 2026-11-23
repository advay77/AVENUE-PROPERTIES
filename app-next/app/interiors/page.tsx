import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { IconHome, IconWa } from "@/components/icons";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Interior Services in Noida — Avenue Properties" },
  description:
    "Residential and commercial interior fit-outs in Noida: modular kitchens, wardrobes, office layouts, renovation and rental-ready packages.",
};

export default function InteriorsPage() {
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span aria-current="page">Interior Services</span>
          </nav>
          <h1>Interior services for homes and offices</h1>
          <p className="ph-lede">A separate service from the property work. Once the keys are yours, we can take the flat, floor, shop or office from an empty shell to a finished, usable space.</p>
          <div className="ph-actions">
            <Link className="btn btn--primary" href="/contact">Book a consultation</Link>
            <a className="btn btn--outline-light" href={waLink("Hi Avenue Properties, I would like to discuss interior services.")} target="_blank" rel="noopener">Ask on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">What we do</span>
            <h2>Residential and commercial interiors</h2>
            <p>Full fit-out or a single room. The scope is yours to set — what we hold is the drawing, the budget and the site.</p>
          </div>
          <div className="grid-3">
            <Item title="Residential interiors" body="False ceilings, flooring, painting, lighting, wardrobes and furniture — room by room or the whole home in one go." icon={<IconHome size={20} />} />
            <Item title="Office & commercial fit-outs" body="Workstations, cabins, reception, conference rooms and pantry, planned around headcount and the lease term." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M9 20v-6" /></svg>} />
            <Item title="Modular kitchens & wardrobes" body="Measured on site, made to the drawing, installed and finished — the two things that decide how a home feels to live in." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>} />
            <Item title="Lighting & electricals" body="Light layouts that suit how the room is actually used, with the switching and points planned before the walls close." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>} />
            <Item title="Renovation & repair" body="Older flats and floors brought up to date — bathrooms, kitchens, flooring and a full repaint." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>} />
            <Item title="Rental-ready packages" body="The minimum fit-out that lifts a rental into a higher bracket, costed against the extra rent it earns." icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20V8l8-5 8 5v12" /><path d="M9 20v-6h6v6" /></svg>} />
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">How it runs</span>
            <h2>From the first measurement to the handover</h2>
            <p>Four stages, each with something you can see and sign off before the next begins.</p>
          </div>
          <ol className="process">
            <li className="reveal"><h3>Site measurement</h3><p>We measure the actual flat or floor — builder drawings and reality are rarely the same.</p></li>
            <li className="reveal"><h3>Design & estimate</h3><p>Layouts, material choices and a line-by-line estimate, so there are no surprises mid-project.</p></li>
            <li className="reveal"><h3>Execution</h3><p>Civil, carpentry, electrical and painting run in sequence, with one point of contact throughout.</p></li>
            <li className="reveal"><h3>Handover</h3><p>Snag list closed, cleaning done, warranties and care instructions handed across.</p></li>
          </ol>
        </div>
      </section>

      <section className="section section--white">
        <div className="shell">
          <div className="sec-head sec-head--row reveal">
            <div className="sec-head-copy">
              <span className="eyebrow">Reference imagery</span>
              <h2>The kind of work we plan for</h2>
              <p>Reference photographs showing the finish level we work to. These are not photographs of completed Avenue Properties projects — project photographs replace them once a portfolio is supplied.</p>
            </div>
          </div>
          <div className="grid-3">
            {[
              ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=72", "Living room reference"],
              ["https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=72", "Modular kitchen reference"],
              ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=72", "Office interior reference"],
              ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=72", "Bedroom reference"],
              ["https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=72", "Dining reference"],
              ["https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=72", "Workspace reference"],
            ].map(([src, alt]) => (
              <div className="media reveal" style={{ borderRadius: 20, aspectRatio: "4/3" }} key={alt}>
                <img loading="lazy" src={src} alt={alt} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sell section">
        <img className="sell-bg" loading="lazy" src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell sell-layout">
          <div className="reveal">
            <span className="eyebrow">Next step</span>
            <h2>Send the floor plan. We will send a plan and a number.</h2>
            <p>Share the layout and what you want done. We will come back with a scope, an indicative budget and a realistic timeline before anyone visits the site.</p>
            <div className="sell-actions">
              <Link className="btn btn--light btn--lg" href="/contact">Book a consultation</Link>
              <a className="btn btn--wa btn--lg" href={waLink("Hi Avenue Properties, I would like an interior consultation.")} target="_blank" rel="noopener">
                <IconWa size={17} /> Send on WhatsApp
              </a>
            </div>
          </div>
          <ol className="sell-steps reveal">
            <li className="sell-step"><b>1</b><span><strong>Share the space</strong>Floor plan or address, and what you want done.</span></li>
            <li className="sell-step"><b>2</b><span><strong>Scope & budget</strong>An itemised estimate before any commitment.</span></li>
            <li className="sell-step"><b>3</b><span><strong>Drawings</strong>Layouts and finishes agreed on paper first.</span></li>
            <li className="sell-step"><b>4</b><span><strong>Build & hand over</strong>One contact through execution to snagging.</span></li>
          </ol>
        </div>
      </section>
    </>
  );
}

function Item({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div className="value-card reveal">
      <span className="value-ico">{icon}</span>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}
