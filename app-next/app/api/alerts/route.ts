import { alertsConfigured, deliverAlert, enquiryText, visitText } from "@/lib/alerts";

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((at) => now - at < 10 * 60 * 1000);
  if (recent.length >= 12) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function POST(request: Request) {
  const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (limited(ip)) return Response.json({ ok: false, delivered: false }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, delivered: false }, { status: 400 });
  }

  const kind = body.kind === "visit" || body.kind === "enquiry" ? body.kind : "";
  if (!kind) return Response.json({ ok: false, delivered: false }, { status: 400 });

  if (!alertsConfigured()) return Response.json({ ok: true, delivered: false, configured: false });

  const path = typeof body.path === "string" ? body.path.slice(0, 200) : "/";
  const text =
    kind === "visit"
      ? visitText(path, typeof body.referrer === "string" ? body.referrer.slice(0, 300) : "")
      : enquiryText({
          name: typeof body.name === "string" ? body.name : "",
          phone: typeof body.phone === "string" ? body.phone : "",
          email: typeof body.email === "string" ? body.email : "",
          intent: typeof body.intent === "string" ? body.intent : "",
          budget: typeof body.budget === "string" ? body.budget : "",
          area: typeof body.area === "string" ? body.area : "",
          message: typeof body.message === "string" ? body.message : "",
          path,
        });

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";
  if (kind === "enquiry" && (name.length < 2 || !(phone.length === 10 || (phone.length === 12 && phone.startsWith("91"))))) {
    return Response.json({ ok: false, delivered: false }, { status: 400 });
  }

  try {
    const delivered = await deliverAlert(text);
    return Response.json({ ok: true, delivered, configured: true });
  } catch {
    return Response.json({ ok: true, delivered: false, configured: true });
  }
}
