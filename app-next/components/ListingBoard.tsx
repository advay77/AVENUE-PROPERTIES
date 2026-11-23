"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IconClose, IconFilter, IconGrid, IconInfo, IconList } from "./icons";
import { PropertyCard } from "./PropertyCard";
import { KIND_LABEL, properties, type Property } from "@/lib/site";

type Scope = { purpose: "" | "buy" | "rent"; segment: "residential" | "commercial" };

export function ListingBoard({
  purpose,
  segment,
  initialKind = "",
  initialLocality = "",
  initialPrice = "",
  sortPriceLabel,
  footLabel,
}: Scope & {
  initialKind?: string;
  initialLocality?: string;
  initialPrice?: string;
  sortPriceLabel: string;
  footLabel: string;
}) {
  const base = useMemo(
    () =>
      properties.filter((p) => {
        if (segment && p.segment !== segment) return false;
        if (purpose && p.purpose !== purpose) return false;
        return true;
      }),
    [purpose, segment]
  );

  const [kinds, setKinds] = useState<string[]>(initialKind ? [initialKind] : []);
  const [localities, setLocalities] = useState<string[]>(initialLocality ? [initialLocality] : []);
  const [bhk, setBhk] = useState<string[]>([]);
  const [price, setPrice] = useState(initialPrice);
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const perPage = 6;

  const kindOptions = uniq(base, (p) => p.kind);
  const bhkOptions = uniq(base, (p) => (p.bhk == null ? "" : String(p.bhk)))
    .filter((x) => x.value)
    .sort((a, b) => Number(a.value) - Number(b.value));
  const locOptions = uniq(base, (p) => p.locality);
  const bands =
    purpose === "rent"
      ? [
          ["0-25000", "Under ₹25,000"],
          ["25000-50000", "₹25,000 – ₹50,000"],
          ["50000-100000", "₹50,000 – ₹1 Lakh"],
          ["100000-", "Above ₹1 Lakh"],
        ]
      : [
          ["0-10000000", "Under ₹1 Cr"],
          ["10000000-25000000", "₹1 Cr – ₹2.5 Cr"],
          ["25000000-50000000", "₹2.5 Cr – ₹5 Cr"],
          ["50000000-", "Above ₹5 Cr"],
        ];

  const filtered = useMemo(() => {
    const list = base.filter((p) => {
      if (kinds.length && !kinds.includes(p.kind)) return false;
      if (localities.length && !localities.includes(p.locality)) return false;
      if (bhk.length && !bhk.includes(String(p.bhk))) return false;
      if (price) {
        const [loRaw, hiRaw] = price.split("-");
        const lo = loRaw ? Number(loRaw) : 0;
        const hi = hiRaw ? Number(hiRaw) : Infinity;
        if (p.price < lo || p.price > hi) return false;
      }
      return true;
    });
    const out = list.slice();
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    if (sort === "area-desc") out.sort((a, b) => b.sqft - a.sqft);
    if (sort === "featured") out.sort((a, b) => Number(b.featured) - Number(a.featured));
    return out;
  }, [base, kinds, localities, bhk, price, sort]);

  const pages = Math.ceil(filtered.length / perPage) || 1;
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * perPage;
  const slice = filtered.slice(start, start + perPage);

  function toggle(list: string[], value: string, set: (v: string[]) => void) {
    set(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
    setPage(1);
  }

  function clear() {
    setKinds([]);
    setBhk([]);
    setLocalities([]);
    setPrice("");
    setPage(1);
  }

  const pills: { facet: string; value: string; label: string }[] = [
    ...kinds.map((v) => ({ facet: "kinds", value: v, label: KIND_LABEL[v] || v })),
    ...bhk.map((v) => ({ facet: "bhk", value: v, label: `${v} BHK` })),
    ...localities.map((v) => ({ facet: "localities", value: v, label: v })),
    ...(price ? [{ facet: "price", value: price, label: purpose === "rent" ? "Rent band" : "Budget band" }] : []),
  ];

  return (
    <div className="listing">
      <aside>
        <button className="btn btn--ghost filters-toggle" type="button" aria-expanded={filtersOpen} aria-controls="filtersPanel" onClick={() => setFiltersOpen((v) => !v)}>
          <span>Filters</span>
          <IconFilter />
        </button>
        <div className={filtersOpen ? "filters-panel is-open" : "filters-panel"} id="filtersPanel" style={{ marginTop: 12 }}>
          <h2>Narrow it down</h2>
          <div>
            {kindOptions.length > 1 ? (
              <div className="fgroup">
                <span className="fg-title">Property type</span>
                {kindOptions.map((k) => (
                  <label className="fopt" key={k.value}>
                    <input type="checkbox" checked={kinds.includes(k.value)} onChange={() => toggle(kinds, k.value, setKinds)} />
                    <span>{KIND_LABEL[k.value] || k.value}</span>
                    <span className="count">{k.count}</span>
                  </label>
                ))}
              </div>
            ) : null}
            {bhkOptions.length > 1 ? (
              <div className="fgroup">
                <span className="fg-title">Bedrooms</span>
                {bhkOptions.map((b) => (
                  <label className="fopt" key={b.value}>
                    <input type="checkbox" checked={bhk.includes(b.value)} onChange={() => toggle(bhk, b.value, setBhk)} />
                    <span>{b.value} BHK</span>
                    <span className="count">{b.count}</span>
                  </label>
                ))}
              </div>
            ) : null}
            {locOptions.length > 1 ? (
              <div className="fgroup">
                <span className="fg-title">Locality</span>
                {locOptions.map((l) => (
                  <label className="fopt" key={l.value}>
                    <input type="checkbox" checked={localities.includes(l.value)} onChange={() => toggle(localities, l.value, setLocalities)} />
                    <span>{l.value}</span>
                    <span className="count">{l.count}</span>
                  </label>
                ))}
              </div>
            ) : null}
            <div className="fgroup">
              <span className="fg-title">{purpose === "rent" ? "Monthly rent" : "Budget"}</span>
              {bands.map(([value, label]) => (
                <label className="fopt" key={value}>
                  <input type="radio" name="priceBand" checked={price === value} onChange={() => { setPrice(price === value ? "" : value); setPage(1); }} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="filters-foot">
            <Link className="btn btn--primary btn--block btn--sm" href="/contact">
              {footLabel}
            </Link>
          </div>
        </div>
      </aside>

      <div>
        <div className="results-bar">
          <p className="results-count">
            {filtered.length ? (
              <>
                {filtered.length} propert{filtered.length === 1 ? "y" : "ies"}{" "}
                <span>
                  · showing {start + 1}–{Math.min(start + perPage, filtered.length)}
                </span>
              </>
            ) : (
              "No properties match those filters"
            )}
          </p>
          <div className="results-tools">
            <label className="sr-only" htmlFor="sortBy">Sort by</label>
            <select className="sort-select" id="sortBy" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
              <option value="featured">Featured first</option>
              <option value="price-asc">{sortPriceLabel} — low to high</option>
              <option value="price-desc">{sortPriceLabel} — high to low</option>
              <option value="area-desc">Largest area</option>
            </select>
            <div className="view-toggle" role="group" aria-label="View">
              <button type="button" className={view === "grid" ? "is-on" : undefined} aria-label="Grid view" onClick={() => setView("grid")}>
                <IconGrid />
              </button>
              <button type="button" className={view === "list" ? "is-on" : undefined} aria-label="List view" onClick={() => setView("list")}>
                <IconList />
              </button>
            </div>
          </div>
        </div>

        <div className="active-filters">
          {pills.map((p) => (
            <span className="afilter" key={p.facet + p.value}>
              {p.label}
              <button
                type="button"
                aria-label="Remove filter"
                onClick={() => {
                  if (p.facet === "kinds") setKinds(kinds.filter((x) => x !== p.value));
                  if (p.facet === "bhk") setBhk(bhk.filter((x) => x !== p.value));
                  if (p.facet === "localities") setLocalities(localities.filter((x) => x !== p.value));
                  if (p.facet === "price") setPrice("");
                  setPage(1);
                }}
              >
                <IconClose />
              </button>
            </span>
          ))}
          {pills.length > 1 ? (
            <button className="chip" type="button" onClick={clear}>
              Clear all
            </button>
          ) : null}
        </div>

        {!filtered.length ? (
          <div className="empty-state">
            <h3>Nothing matches those filters yet</h3>
            <p>
              This page shows demo inventory, so the combination you picked may simply not exist in the sample set. Tell us what you are looking for and we will send matching options from live inventory.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn--primary" href="/contact">
                Send your requirement
              </Link>
              <button className="btn btn--ghost" type="button" onClick={clear}>
                Clear all filters
              </button>
            </div>
          </div>
        ) : view === "list" ? (
          <div className="prop-list" style={{ display: "grid", gap: 18 }}>
            {slice.map((p) => (
              <PropertyCard key={p.id} property={p} variant="row" />
            ))}
          </div>
        ) : (
          <div className="prop-grid prop-grid--2">
            {slice.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}

        {filtered.length > perPage ? (
          <div className="pagination">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(Math.max(1, safePage - 1))}>
              Previous
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className={n === safePage ? "is-on" : undefined} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
            <button type="button" disabled={safePage === pages} onClick={() => setPage(Math.min(pages, safePage + 1))}>
              Next
            </button>
          </div>
        ) : (
          <div className="pagination" />
        )}

        <p className="note" style={{ marginTop: 30 }}>
          <IconInfo />
          <span>
            <strong>Demo inventory.</strong> These listings are illustrative and are not verified offers. Prices, areas and availability change daily — ask us for the current set before you plan a visit.
          </span>
        </p>
      </div>
    </div>
  );
}

function uniq(list: Property[], fn: (p: Property) => string) {
  const seen = new Map<string, number>();
  list.forEach((p) => {
    const v = fn(p);
    if (!v) return;
    seen.set(v, (seen.get(v) || 0) + 1);
  });
  return Array.from(seen, ([value, count]) => ({ value, count }));
}
