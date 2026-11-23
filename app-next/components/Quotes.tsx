"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/site";

export function Quotes() {
  const [at, setAt] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || testimonials.length < 2) return;
    const timer = window.setInterval(() => setAt((n) => (n + 1) % testimonials.length), 7000);
    return () => window.clearInterval(timer);
  }, [at]);

  function go(i: number) {
    setAt((i + testimonials.length) % testimonials.length);
  }

  return (
    <div className="quotes reveal">
      <div className="quote-track">
        {testimonials.map((t, i) => (
          <figure className={i === at ? "quote-card is-on" : "quote-card"} key={t.role}>
            <span className="quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>{t.quote}</blockquote>
            <figcaption className="quote-foot">
              <img loading="lazy" src={t.avatar} alt="" />
              <span className="quote-who">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="quote-nav">
        <button className="q-btn" type="button" aria-label="Previous testimonial" onClick={() => go(at - 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M15 5 8 12l7 7" />
          </svg>
        </button>
        <button className="q-btn" type="button" aria-label="Next testimonial" onClick={() => go(at + 1)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
        <div className="q-dots" role="tablist" aria-label="Choose testimonial">
          {testimonials.map((t, i) => (
            <button key={t.role} className={i === at ? "q-dot is-on" : "q-dot"} type="button" aria-label={`Testimonial ${i + 1} of ${testimonials.length}`} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
