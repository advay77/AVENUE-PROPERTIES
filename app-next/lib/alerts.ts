type EnquiryBody = {
  name?: string;
  phone?: string;
  email?: string;
  intent?: string;
  budget?: string;
  area?: string;
  message?: string;
  path?: string;
};

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function alertsConfigured() {
  return Boolean(
    (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) ||
      process.env.DISCORD_WEBHOOK_URL ||
      process.env.WEB3FORMS_ACCESS_KEY
  );
}

function istNow() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

export function visitText(path: string, referrer: string) {
  return [
    "Avenue Properties — visitor",
    "Page: " + (path || "/"),
    "From: " + (referrer || "direct"),
    "Time: " + istNow() + " IST",
  ].join("\n");
}

export function enquiryText(body: EnquiryBody) {
  return [
    "Avenue Properties — new enquiry",
    "Name: " + clip(body.name, 80),
    "Phone: " + clip(body.phone, 20),
    body.email ? "Email: " + clip(body.email, 80) : "",
    body.intent ? "Intent: " + clip(body.intent, 80) : "",
    body.budget ? "Budget: " + clip(body.budget, 80) : "",
    body.area ? "Locality: " + clip(body.area, 120) : "",
    body.message ? "Message: " + clip(body.message, 1000) : "",
    "Page: " + (clip(body.path, 200) || "/"),
    "Time: " + istNow() + " IST",
  ]
    .filter(Boolean)
    .join("\n");
}

async function postJson(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  return res.ok;
}

export async function deliverAlert(text: string) {
  const jobs: Promise<boolean>[] = [];
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (token && chat) {
    jobs.push(
      postJson("https://api.telegram.org/bot" + token + "/sendMessage", {
        chat_id: chat,
        text: text.slice(0, 4000),
        disable_web_page_preview: true,
      })
    );
  }
  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (discord) jobs.push(postJson(discord, { content: text.slice(0, 1900) }));
  const web3 = process.env.WEB3FORMS_ACCESS_KEY;
  if (web3) {
    jobs.push(
      postJson("https://api.web3forms.com/submit", {
        access_key: web3,
        subject: text.split("\n")[0] || "Avenue Properties alert",
        message: text,
      })
    );
  }
  if (!jobs.length) return false;
  const results = await Promise.allSettled(jobs);
  return results.some((result) => result.status === "fulfilled" && result.value);
}
