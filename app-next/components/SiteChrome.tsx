"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { IconChevron, IconClock, IconPhone, IconPin, IconWa } from "./icons";
import { VisitorAlert } from "./VisitorAlert";
import { business, mapsLink, telLink, waLink } from "@/lib/site";

const NAV = [
  { href: "/", label: "Home", drawer: "Home" },
  { href: "/buy", label: "Buy", drawer: "Buy Properties" },
  { href: "/rent", label: "Rent", drawer: "Rent Properties" },
  { href: "/commercial", label: "Commercial", drawer: "Commercial" },
  { href: "/interiors", label: "Interior Services", drawer: "Interior Services" },
  { href: "/about", label: "About Us", drawer: "About Us" },
  { href: "/contact", label: "Contact", drawer: "Contact" },
];

function current(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href;
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const year = new Date().getFullYear();

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.remove("no-js");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!items.length) return;
    if (!("IntersectionObserver" in window) || reduce) {
      items.forEach((n) => n.classList.add("is-off"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-in");
          io.unobserve(en.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.06 }
    );
    items.forEach((n, i) => {
      n.style.transitionDelay = `${Math.min(i % 6, 5) * 55}ms`;
      io.observe(n);
    });
    const timer = window.setTimeout(() => items.forEach((n) => n.classList.add("is-in")), 2600);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>

      <div className="utility">
        <div className="shell">
          <div className="utility-left">
            <a href={mapsLink()} target="_blank" rel="noopener">
              <IconPin size={13} />
              {business.utilityAddress}
            </a>
            <span>{business.hours}</span>
          </div>
          <div className="utility-right">
            <a href={telLink()}>
              <IconPhone size={13} />
              <span>{business.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      <header className={stuck ? "site-header is-stuck" : "site-header"}>
        <div className="shell">
          <nav className="nav" aria-label="Primary">
            <Link className="brand" href="/" aria-label="Avenue Properties, home">
              <BrandLogo />
              <span className="brand-name">
                Avenue<span>Properties</span>
              </span>
            </Link>

            <div className="nav-links">
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className={current(pathname, item.href) ? "is-current" : undefined}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="nav-cta">
              <a className="btn btn--ghost" href={telLink()}>
                <IconPhone />
                Call
              </a>
              <Link className="btn btn--primary" href="/contact#list">
                List<span className="long"> Your Property</span>
              </Link>
              <button
                className="burger"
                aria-expanded={open}
                aria-controls="drawer"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <span />
              </button>
            </div>
          </nav>
        </div>

        <div className={open ? "drawer is-open" : "drawer"} id="drawer">
          <div className="shell">
            <ul>
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={current(pathname, item.href) ? "is-current" : undefined}>
                    {item.drawer} <IconChevron />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="drawer-actions">
              <Link className="btn btn--primary btn--block" href="/contact#list">
                List Your Property
              </Link>
              <a className="btn btn--ghost btn--block" href={telLink()}>
                Call <span>{business.phoneDisplay}</span>
              </a>
            </div>
            <p className="drawer-meta">
              {business.addressLine1},<br />
              {business.addressLine2}
              <br />
              <span>{business.hours}</span>
            </p>
          </div>
        </div>
      </header>

      <VisitorAlert />
      <main id="main">{children}</main>

      <footer className="site-footer">
        <div className="shell">
          <div className="foot-top">
            <div className="foot-about">
              <Link className="brand" href="/">
                <BrandLogo />
                <span className="brand-name">
                  Avenue<span>Properties</span>
                </span>
              </Link>
              <p>
                Real estate consultancy in Noida, Uttar Pradesh. Residential and commercial property buying, selling,
                renting and leasing, with valuation, documentation coordination and interior services.
              </p>
              <div className="socials">
                <a href={waLink()} target="_blank" rel="noopener" aria-label="Avenue Properties on WhatsApp">
                  <IconWa size={17} />
                </a>
              </div>
            </div>

            <div className="foot-col">
              <h4>Properties</h4>
              <ul>
                <li><Link href="/buy">Buy a property</Link></li>
                <li><Link href="/rent">Rent a property</Link></li>
                <li><Link href="/commercial">Commercial spaces</Link></li>
                <li><Link href="/buy?kind=builder-floor">Builder floors</Link></li>
                <li><Link href="/buy?kind=plot">Plots & land</Link></li>
                <li><Link href="/contact#list">List your property</Link></li>
              </ul>
            </div>

            <div className="foot-col">
              <h4>Services</h4>
              <ul>
                <li><Link href="/about#services">Property consultation</Link></li>
                <li><Link href="/about#services">Site visit assistance</Link></li>
                <li><Link href="/about#services">Price negotiation</Link></li>
                <li><Link href="/about#services">Property valuation</Link></li>
                <li><Link href="/about#services">Documentation coordination</Link></li>
                <li><Link href="/interiors">Interior services</Link></li>
              </ul>
            </div>

            <div className="foot-col">
              <h4>Contact</h4>
              <ul className="foot-contact">
                <li>
                  <IconPin size={15} />
                  <span>
                    {business.addressLine1},<br />
                    {business.addressLine2}
                  </span>
                </li>
                <li>
                  <IconPhone size={15} />
                  <a href={telLink()}>{business.phoneDisplay}</a>
                </li>
                <li>
                  <IconClock size={15} />
                  <span>{business.hours}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="foot-bottom">
            <span>
              © {year} {business.name}. All rights reserved.
            </span>
            <nav className="foot-legal" aria-label="Legal">
              <Link href="/contact">Privacy Policy</Link>
              <Link href="/contact">Terms of Use</Link>
              <Link href="/contact">Disclaimer</Link>
              <Link href="/contact">Sitemap</Link>
            </nav>
          </div>
        </div>
      </footer>

      <div className="fab-stack">
        <a className="fab fab--call" href={telLink()} aria-label="Call Avenue Properties">
          <IconPhone size={22} />
        </a>
        <a className="fab fab--wa" href={waLink()} target="_blank" rel="noopener" aria-label="Chat with Avenue Properties on WhatsApp">
          <IconWa size={26} />
        </a>
      </div>
    </>
  );
}
