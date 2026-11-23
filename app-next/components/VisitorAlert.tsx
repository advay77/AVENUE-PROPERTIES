"use client";

import { useEffect } from "react";

const KEY = "av_visit_ping";
const WINDOW_MS = 120 * 60 * 1000;

export function VisitorAlert() {
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(KEY) || 0);
      if (Date.now() - last < WINDOW_MS) return;
      localStorage.setItem(KEY, String(Date.now()));
    } catch {
      return;
    }
    fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "visit",
        path: location.pathname + location.search,
        referrer: document.referrer || "",
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);
  return null;
}
