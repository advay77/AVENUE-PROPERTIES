function esc(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const CHECK =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m4 12 5.5 5.5L20 7"/></svg>';
const INFO =
  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>';

export function toast(msg: string, kind?: "ok" | "warn", ms = 4200) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    wrap.setAttribute("role", "status");
    wrap.setAttribute("aria-live", "polite");
    document.body.appendChild(wrap);
  }
  const t = document.createElement("div");
  t.className = "toast" + (kind ? ` toast--${kind}` : "");
  t.innerHTML = (kind === "ok" ? CHECK : INFO) + `<span>${esc(msg)}</span>`;
  wrap.appendChild(t);
  window.setTimeout(() => {
    t.style.transition = "opacity .3s, transform .3s";
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    window.setTimeout(() => t.remove(), 320);
  }, ms);
}

const LOG_KEY = "av_alert_log";

export function saveEnquiry(payload: Record<string, string>) {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const log = raw ? (JSON.parse(raw) as unknown[]) : [];
    log.unshift({ kind: "enquiry", at: new Date().toISOString(), ...payload });
    localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(0, 50)));
  } catch {
    /* private windows can throw */
  }
}
