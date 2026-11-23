import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { IconClock, IconPhone, IconPin, IconWa } from "@/components/icons";
import { googleBusiness } from "@/lib/google";
import { business, mapsLink, telLink, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Avenue Properties — Sector 75, Noida" },
  description:
    "Visit Avenue Properties at Shop No. 27, Aims Golf Avenue 1, Sector 75, Noida. Call +91 70119 66691, open 10 AM to 8 PM every day. Send an enquiry or list your property.",
};

const INTENTS = ["Buy a property", "Rent a property", "Sell my property", "Rent out my property", "Lease commercial space", "Discuss interior services"];
const BUDGETS = ["Not decided yet", "Under ₹50 Lakh", "₹50 Lakh – ₹1 Crore", "₹1 Cr – ₹2 Cr", "₹2 Cr – ₹4 Cr", "Above ₹4 Cr", "Rental — monthly"];
const LIST_INTENTS = ["Sell this property", "Rent it out", "Lease it (commercial)", "Just get a valuation"];

export default function ContactPage() {
  const map = `https://www.google.com/maps?q=${googleBusiness.lat},${googleBusiness.lng}&z=17&output=embed`;
  return (
    <>
      <section className="page-hero">
        <img className="ph-bg" src="https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1800&q=70" alt="" />
        <div className="shell">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span className="sep">/</span><span aria-current="page">Contact</span>
          </nav>
          <h1>Talk to Avenue Properties</h1>
          <p className="ph-lede">Walk into the office in Sector 75, call, or send the details on WhatsApp. We are open every day of the week from 10 AM to 8 PM.</p>
          <div className="ph-actions">
            <a className="btn btn--primary" href={telLink()}>Call {business.phoneDisplay}</a>
            <a className="btn btn--outline-light" href={waLink()} target="_blank" rel="noopener">Chat on WhatsApp</a>
          </div>
        </div>
      </section>

      <section className="section section--white section--sm">
        <div className="shell">
          <div className="grid-3">
            <a className="value-card reveal" href={telLink()}>
              <span className="value-ico"><IconPhone size={20} /></span>
              <h3>Call the office</h3>
              <p>{business.phoneDisplay}<br />Quickest for a same-day site visit.</p>
            </a>
            <a className="value-card reveal" href={waLink()} target="_blank" rel="noopener">
              <span className="value-ico" style={{ background: "#E6F6ED", color: "#14703B" }}><IconWa size={20} /></span>
              <h3>WhatsApp</h3>
              <p>Send photographs, floor plans or a listing link and we will reply with options.</p>
            </a>
            <a className="value-card reveal" href={mapsLink()} target="_blank" rel="noopener">
              <span className="value-ico"><IconPin size={20} /></span>
              <h3>Visit the office</h3>
              <p>Shop No. 27, Aims Golf Avenue 1, Sector 75, Noida — open all seven days.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="shell">
          <div className="contact-layout">
            <div className="reveal">
              <span className="eyebrow">Office</span>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 800, marginTop: 16 }}>Where to find us</h2>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-ico"><IconPin size={18} /></span>
                  <div><div className="k">Address</div><div className="v">{business.name}<br />{business.addressLine1},<br />{business.addressLine2}</div></div>
                </div>
                <div className="info-row">
                  <span className="info-ico"><IconPhone size={18} /></span>
                  <div><div className="k">Phone & WhatsApp</div><div className="v"><a href={telLink()}>{business.phoneDisplay}</a></div></div>
                </div>
                <div className="info-row">
                  <span className="info-ico"><IconClock size={18} /></span>
                  <div><div className="k">Working hours</div><div className="v">{business.hours}<br /><small>Open all seven days, including public holidays unless noted.</small></div></div>
                </div>
              </div>
              <div className="contact-actions">
                <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener">Chat on WhatsApp</a>
                <a className="btn btn--light" href={mapsLink()} target="_blank" rel="noopener">Get directions</a>
              </div>
              <div className="map">
                <iframe title="Map showing Avenue Properties, Sector 75, Noida" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={map} />
              </div>
            </div>
            <EnquiryForm
              idPrefix="f"
              heading="Send an enquiry"
              lede="Tell us what you are looking for. We will call back within working hours."
              intentOptions={INTENTS}
              budgetOptions={BUDGETS}
              showEmail
              submitLabel="Send enquiry"
              consentText="I agree to be contacted by Avenue Properties about this enquiry by phone, WhatsApp or email."
              callLink
              okStrong="Enquiry received."
            />
          </div>
        </div>
      </section>

      <section className="section section--white" id="list">
        <div className="shell">
          <div className="contact-layout">
            <div className="reveal">
              <span className="eyebrow">Sellers & landlords</span>
              <h2 style={{ fontSize: "clamp(26px,3.4vw,40px)", fontWeight: 800, marginTop: 16 }}>List your property with us</h2>
              <p style={{ marginTop: 16, color: "var(--muted)", fontSize: 17, maxWidth: "50ch" }}>
                Share what you own and what you expect for it. We will come back with a realistic price band for your sector before anything is advertised.
              </p>
              <ol className="process" style={{ gridTemplateColumns: "1fr", marginTop: 28, gap: 12 }}>
                <li className="reveal"><h3>Valuation first</h3><p>What comparable units in your sector actually closed at — not an inflated number to win the listing.</p></li>
                <li className="reveal"><h3>Photographs and listing</h3><p>Shot properly, written properly, and put in front of buyers who are already looking in your sector.</p></li>
                <li className="reveal"><h3>Screened viewings only</h3><p>We filter the enquiries so your time goes to people who can actually transact.</p></li>
                <li className="reveal"><h3>Through to registry</h3><p>Negotiation, agreement to sale, registry appointment and handover, coordinated end to end.</p></li>
              </ol>
            </div>
            <EnquiryForm
              idPrefix="l"
              heading="Tell us about the property"
              lede="Takes a minute. We will call you back within working hours."
              intentOptions={LIST_INTENTS}
              areaLabel="Sector / locality"
              areaPlaceholder="e.g. Sector 75, Noida"
              messageLabel="Property details"
              messagePlaceholder="Type, configuration, area in sq.ft., floor, age, parking, and what you expect for it…"
              submitLabel="List my property"
              consentText="I agree to be contacted by Avenue Properties about listing this property."
              whatsapp="Hi Avenue Properties, I would like to list my property."
              okStrong="Details received."
              extra={{ intent: "List a property" }}
            />
          </div>
        </div>
      </section>

      <section className="section section--tint section--sm">
        <div className="shell">
          <div className="sec-head reveal">
            <span className="eyebrow">Before you come</span>
            <h2>Getting to the office</h2>
            <p>We are in the Aims Golf Avenue 1 market row in Sector 75, which sits between the Sector 74–77 society belt and the Sector 76 metro station.</p>
          </div>
          <div className="grid-3">
            <div className="value-card reveal">
              <span className="value-ico"><IconClock size={20} /></span>
              <h3>Open every day</h3>
              <p>{business.hours}. A quick call before you set out means someone will be free when you arrive.</p>
            </div>
            <div className="value-card reveal">
              <span className="value-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="13" rx="2" /><path d="M8 19l-1 2M16 19l1 2M4 11h16" /></svg></span>
              <h3>Nearest metro</h3>
              <p>Sector 76 on the Aqua Line, then a short auto ride. Ask us and we will send the pin on WhatsApp.</p>
            </div>
            <div className="value-card reveal">
              <span className="value-ico"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 17h14M6 17l1-6h10l1 6M8 11V8h8v3" /><circle cx="8" cy="19" r="1.6" /><circle cx="16" cy="19" r="1.6" /></svg></span>
              <h3>Parking</h3>
              <p>Market parking in front of the shop row. Site visits are usually easier if we drive you between sectors.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
