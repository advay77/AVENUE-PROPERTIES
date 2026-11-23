"use client";

import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { properties } from "@/lib/site";

const FILTERS = [
  ["all", "All"],
  ["buy", "For sale"],
  ["rent", "For rent"],
  ["commercial", "Commercial"],
  ["plot", "Plots"],
] as const;

export function FeaturedGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number][0]>("all");
  const all = properties.filter((p) => p.featured);
  const list = all.filter((p) => {
    if (filter === "all") return true;
    if (filter === "buy") return p.purpose === "buy" && p.segment === "residential";
    if (filter === "rent") return p.purpose === "rent" && p.segment === "residential";
    if (filter === "commercial") return p.segment === "commercial";
    if (filter === "plot") return p.kind === "plot";
    return true;
  });

  return (
    <>
      <div className="filters" role="group" aria-label="Filter properties" style={{ display: "flex", flexWrap: "wrap", gap: 9, marginBottom: 28 }}>
        {FILTERS.map(([id, label]) => (
          <button key={id} className={filter === id ? "chip is-on" : "chip"} type="button" onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>
      <div className="prop-grid">
        {list.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </>
  );
}
