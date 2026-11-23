# Which stack to build Avenue Properties on

## Short answer

**Next.js.** Not plain HTML/CSS/JS.

The moment you said "admin panel, backend, database", plain HTML stopped being
the right tool. Not because it can't be done — it can — but because you would
end up hand-building the three things Next.js gives you for free, and you would
still have two codebases to maintain instead of one.

The current static site was correct for what it was: a design to show the
client. It did its job. Phase 2 is a different job.

---

## Why not plain HTML/CSS/JS

You can absolutely run `index.html` + a separate PHP/Node backend. People do.
Here is what it actually costs you on *this* project:

| What you need | Plain HTML | What it really means |
|---|---|---|
| Admin panel | Build login, sessions, CSRF, forms, tables, image upload from scratch | 3–4 weeks of work that a framework hands you |
| Property pages | Generate HTML per property, or render client-side | Client-side rendering = **Google sees an empty page**. For a property site that is fatal |
| Two codebases | Static frontend + separate API | Two deploys, CORS, duplicated types, two places to fix a bug |
| Search & filters | Everything in JS in the browser | Fine for 18 demo listings. Breaks at 500 real ones |
| Image handling | Manual resize, manual WebP | Property photos are heavy. Slow site = lost leads |

The SEO point is the decisive one. Real estate is a search business. Someone
types *"3 bhk sector 137 noida"* into Google. If your property pages are drawn
by JavaScript after the page loads, you are not competing for that search.
Next.js renders them on the server, so Google gets real HTML.

---

## Why Next.js specifically

- **One codebase** for the public site, the admin panel and the API.
- **Server rendering** → property and locality pages are indexable, fast, and
  get proper OG previews when shared on WhatsApp.
- **Server Actions** → forms submit to the server with no separate API layer.
- **Already on Vercel** → deployment is `git push`, nothing new to learn.
- **Cursor knows it extremely well.** This matters more than people admit. You
  are going to build this with an AI assistant; pick the stack with the most
  training data behind it, not the cleverest one.

---

## The stack

### Core

| Layer | Pick | Why this one |
|---|---|---|
| Framework | **Next.js 15, App Router** | Server rendering, API and admin in one project |
| Language | **TypeScript** | Catches the mistakes AI assistants make most — wrong field names, wrong shapes |
| Hosting | **Vercel** | Already deployed there. Git push to deploy |
| Database | **PostgreSQL via Supabase** | Postgres + Auth + file storage in one service. One account instead of three |
| ORM | **Prisma** | Migrations, typed queries, and the best Cursor support of any ORM |
| Admin auth | **Supabase Auth** | Email + password. You have 2–3 admin users, not 2000 |
| Image storage | **Supabase Storage** + `next/image` | Property photos resized and served as WebP automatically |
| Forms | **react-hook-form + Zod** | Zod validates on the client *and* the server from one schema |
| Admin UI | **Tailwind CSS + shadcn/ui** | Tables, dialogs, date pickers — do not hand-build these |
| Email | **Resend** | Auto-reply to the enquirer. 3,000/month free |
| Alerts | **Telegram, server-side** | Same as today, but the bot token moves to an env var |
| Rate limiting | **Upstash Redis** | Property enquiry forms get spammed. This is not optional |
| Analytics | **Vercel Analytics** | One line, no cookie banner needed |

### Keep the public site's CSS as it is

This is the part most people get wrong when they rebuild.

`assets/css/avenue.css` is already a token-based design system, already verified
from 360px to 1440px, already matching the brand. **Port it, do not redesign
it.** It becomes `app/globals.css` almost unchanged, and the HTML pages become
React components that use the same class names.

Use Tailwind **only inside `/admin`**. The public site keeps its own CSS, the
admin panel gets Tailwind + shadcn. They sit in separate route groups and never
touch each other. You get a designed public site and a fast-to-build admin
panel, without converting one into the other.

That decision alone saves you several weeks and keeps the design you already
approved.

---

## What carries over

Nothing built so far is wasted:

| Built now | Becomes |
|---|---|
| `assets/css/avenue.css` | `app/globals.css` — nearly as-is |
| `assets/js/data.js` records | The `properties` table schema. The fields are already right |
| `Avenue.cards.card()` | `<PropertyCard />` component |
| `Avenue.listing()` filters | Server-side Postgres queries with URL search params |
| `Avenue.alerts` | A server action + `/api/alerts` route |
| `Avenue.reviews` | A cached server fetch of the Places API |
| Every page's copy and layout | Directly, page by page |

---

## Data model to start from

```
properties        id, slug, title, purpose, segment, kind,
                  price, price_label, price_suffix,
                  bhk, sqft, sqft_label, locality, area, status,
                  facing, floor, parking, furnishing, possession, age,
                  description, highlights[], amenities[],
                  featured, published, created_at, updated_at

property_images   id, property_id, url, alt, sort_order

localities        id, slug, name, blurb, image_url, meta

enquiries         id, name, phone, email, intent, budget, locality,
                  message, property_id, source_page,
                  status (new | contacted | visiting | closed),
                  assigned_to, notes, created_at

testimonials      id, name, role, quote, avatar_url, published

site_settings     key, value      -- phone, hours, social links, demo mode
```

`published` on `properties` matters: the client should be able to draft a
listing without it going live.

`status` on `enquiries` is what turns the admin panel from a form inbox into
something that actually earns its keep — the client can see which leads have
been called and which have not.

---

## Two things that get fixed by having a backend

Both of these are caveats in the current build. A backend removes them:

1. **The Telegram bot token.** Today it sits in `config.js`, visible in page
   source. With a backend it moves to an environment variable and the browser
   never sees it. The Cloudflare Worker workaround in `README.md` becomes
   unnecessary.

2. **The Google Places API key.** Today it would be in the browser, and every
   visitor burns a paid API call. Server-side, fetch it once and cache for 24
   hours with `revalidate`. The key stays secret, the quota stays tiny, and the
   page gets faster.

---

## What it costs

| Service | Free tier | When you start paying |
|---|---|---|
| Vercel | Generous | **See the note below** |
| Supabase | 500 MB DB, 1 GB storage | ~₹2,100/mo when you outgrow it |
| Resend | 3,000 emails/month | Unlikely to be exceeded |
| Upstash | 10,000 commands/day | Unlikely to be exceeded |
| Telegram | Free forever | Never |

**The Vercel note, because it will catch you otherwise:** Vercel's free Hobby
plan is for non-commercial use. A real estate agency's live site is commercial,
so you need **Pro at $20/month** once it is the client's actual website. It is
fine for the preview you are showing them now. Budget for it — do not find out
from a suspension email.

Realistically: **₹0 while building, around ₹1,700/month once live**, rising when
the photo library grows.

---

## Phasing

**Phase 1 — done.** Static site, 9 pages, live on Vercel, design approved.
Keep it running as the client demo while Phase 2 is built.

**Phase 2 — the real site.**
1. Next.js project, port `avenue.css`, rebuild the public pages as components
2. Prisma schema + Supabase, seed from `data.js`
3. Property listing and detail pages rendered server-side
4. Enquiry forms → database + Telegram, with rate limiting
5. Admin: login, property CRUD, image upload, enquiry inbox
6. Google reviews cached server-side
7. Real domain, `robots.txt` opened up, `sitemap.xml` generated

**Phase 3 — things that actually make money.**
EMI calculator, saved shortlist per user, property comparison, locality guide
pages for SEO, site-visit scheduling, WhatsApp click tracking, lead source
reporting in the admin panel.

---

## What I would avoid

- **WordPress.** Tempting for the admin panel. You would spend the project
  fighting plugins, and it is the most attacked platform on the web.
- **Rebuilding the design in Tailwind.** The CSS is done and verified. Porting
  it is an afternoon; redoing it is a fortnight.
- **A separate React SPA plus an Express API.** Two deploys, CORS, and no SEO —
  all the cost of a framework with none of the benefit.
- **MongoDB.** Property data is relational: properties have images, enquiries
  point at properties, listings filter on locality. Use Postgres.
- **Paying for an admin template.** shadcn/ui is free and you own the code.
