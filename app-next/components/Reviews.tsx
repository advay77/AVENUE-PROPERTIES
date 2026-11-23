"use client";

import { useState } from "react";
import { IconGoogle, Star } from "./icons";
import type { GooglePlaceView } from "@/lib/google";

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

export function Reviews({ place }: { place: GooglePlaceView }) {
  const reviews = place.live ? place.reviews : place.reviews.filter((review) => review.rating >= 4).slice(0, 6);
  const avg = place.rating != null ? place.rating : reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1);
  const buckets = [0, 0, 0, 0, 0];
  if (!place.live) {
    reviews.forEach((review) => {
      buckets[Math.min(4, Math.max(0, Math.round(review.rating) - 1))] += 1;
    });
  }
  const maxB = Math.max(...buckets, 1);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const totalLabel =
    place.total != null
      ? `${avg.toFixed(1)} from ${place.total.toLocaleString("en-IN")} Google reviews`
      : "Rating appears once reviews are live";

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
          {totalLabel}
          {" · "}
          <a href={place.profileUrl} target="_blank" rel="noopener">
            See all on Google
          </a>
        </p>
        {place.live ? null : (
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
        )}
        <p className={place.live ? "gr-status is-live" : "gr-status"}>
          {place.source === "places"
            ? "Live from Google. Google returns at most five reviews and chooses which ones."
            : place.source === "listing"
              ? "Live rating from the Avenue Properties Google listing. Google chooses these lines. Names and the full list are on Google."
              : "Could not reach Google just now. The button below still opens the official review box."}
        </p>
        <div className="gr-actions">
          <a className="btn btn--primary btn--block" href={place.writeReviewUrl} target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Write a Review
          </a>
          <a className="btn btn--ghost btn--block" href={place.profileUrl} target="_blank" rel="noopener">
            Open on Google Maps
          </a>
        </div>
      </div>
      <div className="gr-list">
        <div className="gr-track">
          {reviews.map((review, i) => {
            const longText = review.text.length > 240;
            const shown = open[i] || !longText ? review.text : `${review.text.slice(0, 240).trim()}…`;
            const initial = review.author.trim().charAt(0).toUpperCase() || "G";
            return (
              <article className="gr-card" key={review.text.slice(0, 24) + i}>
                <div className="gr-card-top">
                  {review.photo ? (
                    <img className="gr-avatar" src={review.photo} alt="" />
                  ) : (
                    <span className="gr-avatar gr-avatar--letter">{initial}</span>
                  )}
                  <span className="gr-who">
                    <strong>{review.author}</strong>
                    <span>
                      {review.time}
                      {review.sample ? " · sample content" : ""}
                    </span>
                  </span>
                </div>
                <Stars rating={review.rating} size={15} />
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
          <p className="gr-status">
            {place.live
              ? "This is a selection from Google, not every review."
              : "Sample layout — these are not customer reviews."}
          </p>
          <a className="btn btn--ghost btn--sm" href={place.profileUrl} target="_blank" rel="noopener">
            Read every review on Google
          </a>
        </div>
      </div>
    </div>
  );
}
