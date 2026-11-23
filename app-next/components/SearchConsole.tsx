"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconHome, IconPin, IconRupee, IconSearch } from "./icons";

const LOCS = [
  "All Noida localities",
  "Sector 75",
  "Sector 76",
  "Sector 50",
  "Sector 93A",
  "Sector 128",
  "Sector 137",
  "Sector 150",
  "Sector 151",
  "Sector 62",
  "Sector 63",
  "Sector 18",
  "Greater Noida West",
];

const MODES = {
  buy: {
    typeLabel: "Property type",
    types: [
      ["", "All residential"],
      ["apartment", "Apartment / Flat"],
      ["builder-floor", "Builder floor"],
      ["villa", "Independent house / Villa"],
      ["plot", "Plot / Land"],
    ],
    budgetLabel: "Budget",
    budgets: [
      ["", "Any budget"],
      ["0-5000000", "Under ₹50 Lakh"],
      ["5000000-10000000", "₹50 Lakh – ₹1 Crore"],
      ["10000000-20000000", "₹1 Cr – ₹2 Cr"],
      ["20000000-40000000", "₹2 Cr – ₹4 Cr"],
      ["40000000-", "Above ₹4 Cr"],
    ],
    cta: "Search Properties",
    page: "/buy",
  },
  rent: {
    typeLabel: "Property type",
    types: [
      ["", "All rentals"],
      ["apartment", "Apartment / Flat"],
      ["builder-floor", "Builder floor"],
      ["villa", "Independent house"],
    ],
    budgetLabel: "Monthly rent",
    budgets: [
      ["", "Any rent"],
      ["0-20000", "Under ₹20,000"],
      ["20000-35000", "₹20,000 – ₹35,000"],
      ["35000-60000", "₹35,000 – ₹60,000"],
      ["60000-100000", "₹60,000 – ₹1 Lakh"],
      ["100000-", "Above ₹1 Lakh"],
    ],
    cta: "Search Rentals",
    page: "/rent",
  },
  sell: {
    typeLabel: "What you own",
    types: [
      ["apartment", "Apartment / Flat"],
      ["builder-floor", "Builder floor"],
      ["villa", "Independent house / Villa"],
      ["plot", "Plot / Land"],
      ["office", "Shop / Office"],
    ],
    budgetLabel: "Expected price",
    budgets: [
      ["", "Not sure — advise me"],
      ["0-5000000", "Under ₹50 Lakh"],
      ["5000000-10000000", "₹50 Lakh – ₹1 Crore"],
      ["10000000-20000000", "₹1 Cr – ₹2 Cr"],
      ["20000000-40000000", "₹2 Cr – ₹4 Cr"],
      ["40000000-", "Above ₹4 Cr"],
    ],
    cta: "Get a Valuation",
    page: "/contact",
  },
  commercial: {
    typeLabel: "Space type",
    types: [
      ["", "All commercial"],
      ["office", "Office space"],
      ["retail", "Retail / Showroom"],
      ["shop", "Shop"],
      ["warehouse", "Warehouse / Industrial"],
    ],
    budgetLabel: "Budget or rent",
    budgets: [
      ["", "Any budget"],
      ["0-100000", "Lease — under ₹1 Lakh / month"],
      ["100000-300000", "Lease — ₹1 – 3 Lakh / month"],
      ["0-20000000", "Buy — under ₹2 Cr"],
      ["20000000-50000000", "Buy — ₹2 – 5 Cr"],
      ["50000000-", "Buy — above ₹5 Cr"],
    ],
    cta: "Search Commercial",
    page: "/commercial",
  },
} as const;

type Mode = keyof typeof MODES;

export function SearchConsole() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("buy");
  const [loc, setLoc] = useState(LOCS[0]);
  const [kind, setKind] = useState("");
  const [budget, setBudget] = useState("");
  const cfg = MODES[mode];

  function select(next: Mode) {
    setMode(next);
    setKind(MODES[next].types[0][0]);
    setBudget(MODES[next].budgets[0][0]);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (loc && !loc.startsWith("All ")) q.set("locality", loc.replace(/,.*/, "").trim());
    if (kind) q.set("kind", kind);
    if (budget) q.set("price", budget);
    if (mode === "sell") q.set("intent", "sell");
    const qs = q.toString();
    router.push(cfg.page + (qs ? `?${qs}` : ""));
  }

  return (
    <div className="shell search-wrap">
      <div className="search" role="search">
        <div className="search-tabs" role="tablist" aria-label="What are you looking to do?">
          {(Object.keys(MODES) as Mode[]).map((key) => (
            <button
              key={key}
              className="search-tab"
              role="tab"
              id={`tab-${key}`}
              aria-selected={mode === key}
              aria-controls="searchPanel"
              onClick={() => select(key)}
            >
              {key[0].toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
        <form className="search-body" id="searchPanel" role="tabpanel" aria-labelledby={`tab-${mode}`} noValidate onSubmit={submit}>
          <div className="field">
            <label className="field-label" htmlFor="sLocation">
              <IconPin size={13} /> Location
            </label>
            <div className="select">
              <select id="sLocation" value={loc} onChange={(e) => setLoc(e.target.value)}>
                {LOCS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sType">
              <IconHome size={13} />
              <span>{cfg.typeLabel}</span>
            </label>
            <div className="select">
              <select id="sType" value={kind} onChange={(e) => setKind(e.target.value)}>
                {cfg.types.map(([value, label]) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="sBudget">
              <IconRupee />
              <span>{cfg.budgetLabel}</span>
            </label>
            <div className="select">
              <select id="sBudget" value={budget} onChange={(e) => setBudget(e.target.value)}>
                {cfg.budgets.map(([value, label]) => (
                  <option key={label} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn btn--primary" type="submit">
            <IconSearch />
            <span>{cfg.cta}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
