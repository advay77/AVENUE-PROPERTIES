"use client";

import Link from "next/link";
import { useEffect, useState, type MouseEvent } from "react";
import { IconHeart, IconPin, IconWa } from "./icons";
import { toast } from "./toast";
import { demoMode, interestMessage, propertyHref, telLink, waLink, type Property } from "@/lib/site";

const KEY = "av_shortlist";

function readList() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function PropertyCard({ property, variant = "card" }: { property: Property; variant?: "card" | "row" }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(readList().includes(property.id));
  }, [property.id]);

  function toggle(e: MouseEvent) {
    e.preventDefault();
    const list = readList();
    const on = !list.includes(property.id);
    const next = on ? [...list, property.id] : list.filter((id) => id !== property.id);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setSaved(on);
    toast(on ? "Saved to your shortlist." : "Removed from your shortlist.", "ok", 2400);
  }

  const href = propertyHref(property.id);
  const msg = interestMessage(property);
  const badge = property.demo && demoMode;
  const articleClass = variant === "row" ? "prop-row reveal" : "prop-card reveal";

  return (
    <article className={articleClass} data-id={property.id}>
      <div className="media">
        <Link href={href} aria-label={property.title}>
          <img loading="lazy" src={property.images[0]} alt={property.title} />
        </Link>
        <div className="prop-badges">
          <span className="prop-badges-l">
            {badge ? <span className="tag tag--demo">Sample listing</span> : null}
            {variant === "card" && property.purpose === "rent" ? <span className="tag tag--green">For rent</span> : null}
          </span>
          <button
            className="prop-fav"
            type="button"
            data-id={property.id}
            aria-pressed={saved}
            aria-label={saved ? "Saved — remove from shortlist" : "Save this property"}
            onClick={toggle}
          >
            <IconHeart />
          </button>
        </div>
      </div>
      <div className="prop-body">
        <div className="prop-price">
          <b>{property.priceLabel}</b>
          <i>{property.priceSuffix}</i>
        </div>
        <h3>
          <Link href={href}>{property.title}</Link>
        </h3>
        <p className="prop-loc">
          <IconPin /> {property.locality}, {property.area}
        </p>
        <ul className="prop-specs">
          {property.specs.map(([k, v]) => (
            <li key={k}>
              <span className="k">{k}</span>
              <span className="v">{v}</span>
            </li>
          ))}
        </ul>
        <p className="prop-desc">{property.desc}</p>
        <div className="prop-actions">
          <Link className="btn btn--dark" href={href}>
            View details
          </Link>
          {variant === "row" ? (
            <a className="btn btn--ghost" href={telLink()}>
              Call about this
            </a>
          ) : null}
          <a className="btn btn--wa" href={waLink(msg)} target="_blank" rel="noopener" aria-label="Enquire on WhatsApp">
            <IconWa />
          </a>
        </div>
      </div>
    </article>
  );
}
