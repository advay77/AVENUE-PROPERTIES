"use client";

import { useState } from "react";
import { IconGoogle, Star } from "./icons";
import { business, sampleGoogleReviews } from "@/lib/site";

function Stars({ rating, size }: { rating: number; size?: number }) {
  const rounded = Math.round(rating);
  return (
    <span className="gr-stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} on={i <= rounded} size={size} />
      ))}
    </span>
  );
}

export function Reviews() {
  const reviews = sampleGoogleReviews.filter((r) => r.rating >= 4).slice(0, 6);
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);
  const buckets = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    buckets[Math.min(4, Math.max(0, Math.round(r.rating) - 1))] += 1;
  });
  const maxB = Math.max(...buckets, 1);
  const seeAll = `https://www.google.com/maps/search/${encodeURIComponent(`${business.name} ${business.locality}`)}`;
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <div className="greview reveal">
      <div className="gr-summary">
        <div className="gr-brandline">
          <IconGoogle />
          <span>Google reviews</span>
        </div>
        <div className="gr-score">
          <b>{avg.toFixed(1)}</b>
          <span className="out">/ 5</span>
        </div>
        <Stars rating={avg} />
        <p className="gr-total">
          Rating appears once reviews are live ·{" "}
          <a href={seeAll} target="_blank" rel="noopener">
            See all on Google
          </a>
        </p>
        <div className="gr-bars" aria-hidden="true">
          {[5, 4, 3, 2, 1].map((n) => (
            <div className="gr-bar" key={n}>
              <span>{n}</span>
              <span className="track">
                <span className="fill" style={{ width: `${Math.round((buckets[n - 1] / maxB) * 100)}%` }} />
              </span>
              <span>{buckets[n - 1]}</span>
            </div>
          ))}
        </div>
        <p className="gr-status">Not connected yet. Add the Google Place ID and an API key in config.js to show live ratings here.</p>
        <div className="gr-actions">
          <button className="btn btn--primary btn--block" type="button" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Write a Review
          </button>
          <a className="btn btn--ghost btn--block" href={seeAll} target="_blank" rel="noopener">
            Open on Google Maps
          </a>
        </div>
      </div>
      <div className="gr-list">
        <div className="gr-track">
          {reviews.map((r, i) => {
            const longText = r.text.length > 240;
            const shown = open[i] || !longText ? r.text : `${r.text.slice(0, 240).trim()}…`;
            return (
              <article className="gr-card" key={i}>
                <div className="gr-card-top">
                  <span className="gr-avatar gr-avatar--letter">{r.author.trim().charAt(0).toUpperCase()}</span>
                  <span className="gr-who">
                    <strong>{r.author}</strong>
                    <span>
                      {r.time}
                      {r.sample ? " · sample content" : ""}
                    </span>
                  </span>
                </div>
                <Stars rating={r.rating} size={15} />
                <p>{shown}</p>
                {longText ? (
                  <button className="gr-more" type="button" onClick={() => setOpen({ ...open, [i]: !open[i] })}>
                    {open[i] ? "Show less" : "Read more"}
                  </button>
                ) : null}
              </article>
            );
          })}
        </div>
        <div className="gr-foot">
          <p className="gr-status">Sample layout — these are not customer reviews.</p>
          <a className="btn btn--ghost btn--sm" href={seeAll} target="_blank" rel="noopener">
            Read every review on Google
          </a>
        </div>
      </div>
    </div>
  );
}
