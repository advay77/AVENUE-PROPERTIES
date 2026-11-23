"use client";

import { useState, type FormEvent } from "react";
import { IconArrow, IconCheck, IconWa } from "./icons";
import { saveEnquiry, toast } from "./toast";
import { business, telLink, waLink } from "@/lib/site";

type Field = { name: string; phone: string; email: string; intent: string; budget: string; area: string; message: string; consent: boolean };

const empty: Field = { name: "", phone: "", email: "", intent: "", budget: "", area: "", message: "", consent: false };

export function EnquiryForm({
  idPrefix,
  heading,
  lede,
  intentOptions,
  budgetOptions,
  defaultIntent,
  defaultMessage,
  showEmail,
  areaLabel = "Preferred locality",
  areaPlaceholder = "e.g. Sector 75, Sector 137, Greater Noida West",
  messageLabel = "Anything else we should know",
  messagePlaceholder = "Configuration, possession timeline, floor preference, parking…",
  submitLabel,
  consentText,
  whatsapp,
  callLink,
  okStrong,
  extra,
  bare,
}: {
  idPrefix: string;
  heading: string;
  lede: string;
  intentOptions: string[];
  budgetOptions?: string[];
  defaultIntent?: string;
  defaultMessage?: string;
  showEmail?: boolean;
  areaLabel?: string;
  areaPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel: string;
  consentText: string;
  whatsapp?: string;
  callLink?: boolean;
  okStrong: string;
  extra?: Record<string, string>;
  bare?: boolean;
}) {
  const [fields, setFields] = useState<Field>({
    ...empty,
    intent: defaultIntent || intentOptions[0] || "",
    budget: budgetOptions?.[0] || "",
    message: defaultMessage || "",
  });
  const [bad, setBad] = useState<{ name?: boolean; phone?: boolean }>({});
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState("");

  const wide = idPrefix === "d";
  const ids = {
    name: `${idPrefix}Name`,
    phone: `${idPrefix}Phone`,
    email: `${idPrefix}Email`,
    intent: `${idPrefix}Intent`,
    budget: `${idPrefix}Budget`,
    area: `${idPrefix}Area`,
    message: `${idPrefix}Msg`,
    consent: `${idPrefix}Consent`,
  };

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const digits = fields.phone.replace(/\D/g, "");
    const nameBad = fields.name.trim().length < 2;
    const phoneBad = !(digits.length === 10 || (digits.length === 12 && digits.startsWith("91")));
    setBad({ name: nameBad, phone: phoneBad });
    if (nameBad) return;
    if (phoneBad) return;
    if (!fields.consent) {
      toast("Please tick the consent box so we may contact you.", "warn");
      return;
    }
    setSending(true);
    const payload = {
      name: fields.name.trim(),
      phone: fields.phone.trim(),
      email: fields.email.trim(),
      intent: extra?.intent || fields.intent,
      budget: fields.budget,
      area: fields.area.trim(),
      message: fields.message.trim(),
      ...(extra || {}),
    };
    saveEnquiry(payload);
    setSending(false);
    setFields({
      ...empty,
      intent: defaultIntent || intentOptions[0] || "",
      budget: budgetOptions?.[0] || "",
      message: defaultMessage || "",
    });
    setOk(
      `Alerts are not connected yet, so this enquiry was saved in this browser only — see setup.html. Connect a channel in config.js and it will reach the phone instantly.`
    );
    toast("Enquiry saved. Connect an alert channel to receive it instantly.", "warn", 5200);
  }

  const form = (
    <>
      {heading ? <h2>{heading}</h2> : null}
      {lede ? <p>{lede}</p> : null}
      <form className="form-grid" id={`${idPrefix}Form`} noValidate onSubmit={onSubmit}>
        <div className={`f${wide ? " span-2" : ""}${bad.name ? " is-bad" : ""}`}>
          <label htmlFor={ids.name}>
            {idPrefix === "l" ? "Your name" : idPrefix === "d" ? "Your name" : "Full name"} <span className="req">*</span>
          </label>
          <input id={ids.name} name="name" type="text" autoComplete="name" placeholder="Your name" required value={fields.name} onChange={(e) => { setFields({ ...fields, name: e.target.value }); setBad({ ...bad, name: false }); }} />
          <span className="err">Please enter your name.</span>
        </div>
        <div className={`f${wide ? " span-2" : ""}${bad.phone ? " is-bad" : ""}`}>
          <label htmlFor={ids.phone}>
            Phone number <span className="req">*</span>
          </label>
          <input id={ids.phone} name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" required value={fields.phone} onChange={(e) => { setFields({ ...fields, phone: e.target.value }); setBad({ ...bad, phone: false }); }} />
          <span className="err">Please enter a valid 10-digit mobile number.</span>
        </div>
        {showEmail ? (
          <div className="f span-2">
            <label htmlFor={ids.email}>
              Email <span style={{ color: "var(--muted-light)", fontWeight: 500 }}>(optional)</span>
            </label>
            <input id={ids.email} name="email" type="email" autoComplete="email" placeholder="you@example.com" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} />
          </div>
        ) : null}
        {intentOptions.length ? (
          <div className="f">
            <label htmlFor={ids.intent}>I want to</label>
            <select id={ids.intent} name="intent" value={fields.intent} onChange={(e) => setFields({ ...fields, intent: e.target.value })}>
              {intentOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ) : null}
        {budgetOptions ? (
          <div className="f">
            <label htmlFor={ids.budget}>Budget</label>
            <select id={ids.budget} name="budget" value={fields.budget} onChange={(e) => setFields({ ...fields, budget: e.target.value })}>
              {budgetOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        ) : null}
        {idPrefix !== "d" ? (
          <div className="f span-2">
            <label htmlFor={ids.area}>{areaLabel}</label>
            <input id={ids.area} name="area" type="text" placeholder={areaPlaceholder} value={fields.area} onChange={(e) => setFields({ ...fields, area: e.target.value })} />
          </div>
        ) : null}
        <div className="f span-2">
          <label htmlFor={ids.message}>{idPrefix === "d" ? "Message" : messageLabel}</label>
          <textarea id={ids.message} name="message" placeholder={messagePlaceholder} style={idPrefix === "d" ? { minHeight: 76 } : undefined} value={fields.message} onChange={(e) => setFields({ ...fields, message: e.target.value })} />
        </div>
        <label className="consent span-2" htmlFor={ids.consent}>
          <input id={ids.consent} name="consent" type="checkbox" required checked={fields.consent} onChange={(e) => setFields({ ...fields, consent: e.target.checked })} />
          <span>{consentText}</span>
        </label>
        <div className="span-2" style={{ display: "flex", gap: 11, flexWrap: "wrap" }}>
          <button className={idPrefix === "d" ? "btn btn--primary btn--block" : "btn btn--primary btn--lg"} type="submit" disabled={sending}>
            {sending ? "Sending…" : submitLabel}
            {idPrefix === "f" || idPrefix === "h" ? <IconArrow /> : null}
          </button>
          {callLink ? (
            <a className="btn btn--ghost btn--lg" href={telLink()}>
              Or call us
            </a>
          ) : null}
          {whatsapp ? (
            <a className="btn btn--wa btn--lg" href={waLink(whatsapp)} target="_blank" rel="noopener">
              {idPrefix === "l" ? null : <IconWa size={17} />} Send on WhatsApp
            </a>
          ) : null}
        </div>
      </form>
      <div className={ok ? "form-ok is-on" : "form-ok"} role="status">
        <IconCheck size={18} />
        <span>
          <strong>{okStrong}</strong> <span className="ok-detail">{ok}</span>
        </span>
      </div>
      <span className="sr-only">{business.name}</span>
    </>
  );

  if (bare) return form;
  return <div className="enquiry reveal">{form}</div>;
}
