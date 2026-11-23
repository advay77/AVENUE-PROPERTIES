# Cursor prompts — Avenue Properties

Paste these into Cursor's chat (Cmd/Ctrl + L) in Agent mode.

`.cursor/rules/avenue-properties.mdc` is already in this repo and loads
automatically on every request, so Cursor always knows the architecture, the
design tokens, the breakpoints and the house rules. These prompts only have to
describe **the task**.

**Two phases.**

- **Phase 1 (sections 0–8)** — the current static site. Use these if you are
  finishing the demo: real listings, alerts, reviews, legal pages.
- **Phase 2 (sections 9–16)** — the real build: Next.js, Postgres, admin panel.
  The stack and the reasoning behind it are in **`STACK.md`**. Read that before
  starting Phase 2; the prompts below assume those choices.

Phase 1 is not wasted work. The CSS, the copy, the layouts and the data shape
all port straight across — `STACK.md` has the mapping.

---

## 0 · Kickoff — paste this first, once per session

```
You are working on the Avenue Properties website in this repo.

Read these first, in order, before you change anything:
  1. .cursor/rules/avenue-properties.mdc   — architecture and hard rules
  2. README.md                              — what is connected and what isn't
  3. assets/js/config.js                    — the single config surface
  4. assets/css/avenue.css                  — read the section index at the top

This is a static site: no build step, no framework, no package.json. Vanilla
HTML/CSS/JS. Do not add React, Tailwind, Vite or npm.

Before you write code, tell me in 5 lines what you understood about:
  - where property card markup lives
  - how contact details reach the page
  - what the responsive contract is
  - why every listing shows a "Sample listing" badge

Then wait for my task. Don't change anything yet.
```

---

## 1 · Replace the demo inventory with real listings

The highest-value task. Everything else is cosmetic until this is done.

```
Replace the demo inventory in assets/js/data.js with real listings.

I will give you the raw property details (sector, config, area, price, floor,
facing, status, description). For each one, produce a record in the exact shape
documented at the top of data.js.

Rules:
- `id` is a url-safe slug, because property.html?id=<slug> depends on it
- `price` is a plain number in rupees (monthly for rentals) — the sort uses it
- `priceLabel` is what the card prints: "₹1.65 Cr", "₹85 Lakh", "₹28,000"
- `specs` is exactly 3 pairs, because the card has 3 columns
- set `demo: false` on any record that is a real listing
- `featured: true` on the 6 you want on the home page

After the real listings are in, set demoMode: false in assets/js/config.js and
delete the standing "Demo content" / "Demo inventory" <p class="note"> blocks
from index.html, buy.html, rent.html and commercial.html.

Then serve the site and confirm: the home page shows 6 featured cards, each
listing page counts correctly, the sidebar filter counts match, and clicking
through to property.html?id=… renders the detail page.
```

---

## 2 · Connect the instant alerts

```
Connect the live visitor/enquiry alerts.

Everything is already built in Avenue.alerts (assets/js/avenue.js). I only need
the channel wired up. Open setup.html in a browser, which has a guided form and
test buttons — but I want you to do the config.js edit.

Here are my credentials: <paste Telegram bot token and chat ID>

Put them in assets/js/config.js under alerts.telegram. Do not touch any other
setting. Then explain to me, in two sentences, the trade-off of having that
token in a public page, and whether I should use the Cloudflare Worker relay in
README.md instead.

The site must be served over http(s) to test — browsers block these calls from
file:// pages. Start a server, submit the enquiry form on contact.html, and
confirm the alert actually arrived before telling me it works.
```

---

## 3 · Connect Google reviews

```
Connect the Google Business reviews block on the home page.

Google Business Profile link: <paste it>
Place ID: <paste it, or tell me how to find it>
Places API key: <paste it, or say you don't have one yet>

Put them in assets/js/config.js under `google`. Then:

- Confirm the "Write a Review" button opens
  https://search.google.com/local/writereview?placeid=<the id>
- If the API key is present, confirm the live rating and review text replace
  the sample cards, and that the status line under the rating switches to the
  green "Connected" state.
- If the key is missing, leave the sample fallback alone — it is deliberate.

Remind me to restrict the API key to my domain in Google Cloud before this goes
live, and tell me what happens if I don't.
```

---

## 4 · Add the three legal pages

Currently the footer links to `contact.html` as a placeholder on all three.

```
Create privacy.html, terms.html and disclaimer.html.

Copy the page chrome (utility strip, header, drawer, footer, fab stack, script
tags) exactly from about.html so the header and footer stay identical — the nav
highlights itself by filename, so nothing else is needed.

Use the .page-hero pattern for the top of each page and a simple
.section.section--white with a readable prose column for the body. Add a
max-width of about 70ch to the body text so it does not run the full width.

Write real content for an Indian real estate consultancy:
- privacy: what is collected via the enquiry forms, that alerts are sent to the
  business over Telegram/email, that nothing is sold to third parties, how to
  request deletion, and the contact address from config.js
- terms: that listings are indicative and not offers, that pricing and
  availability change, that the client must verify title and approvals
  independently
- disclaimer: that the site is not a party to any transaction, and that no
  RERA registration or certification is claimed

Do not invent a company registration number, a RERA number, a CIN or a
jurisdiction I have not given you. Leave a clearly marked [TO BE CONFIRMED]
placeholder for anything legal that I must supply.

Then update the footer links in every page from contact.html to the real files.
```

---

## 5 · EMI calculator on the property detail page

Standard on Indian property sites, and a genuine conversion tool.

```
Add an EMI calculator to the property detail page (property.html, rendered by
Avenue.detail in assets/js/avenue.js).

Put it in the right-hand aside, directly under the existing .agent-card, as a
second card using the same .agent-card styling.

Inputs: loan amount (pre-filled to 80% of the listing price), interest rate
(default 8.5%), tenure in years (default 20). Use range sliders with the number
shown beside each, since this is mostly used on a phone.

Output: monthly EMI, total interest, and total payable — all formatted in Indian
digit grouping (₹1,23,456 not ₹123,456). Use Intl.NumberFormat('en-IN').

Standard formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where r is the monthly
rate and n is months. Handle r = 0 without dividing by zero.

Add a line under the result saying the figure is indicative and the actual rate
depends on the lender and the applicant's profile — do not imply we arrange
finance.

Only show the calculator for properties where purpose === 'buy'. Rentals and
leases should not get it.

Build the styling from existing tokens in avenue.css. Verify at 360px that
nothing overflows.
```

---

## 6 · A saved-properties page

`Avenue.shortlist` already stores ids — the heart button on every card works.
There is just nowhere to see what was saved.

```
Create shortlist.html — the page that shows what the heart buttons saved.

Avenue.shortlist already exists in assets/js/avenue.js and stores ids in
localStorage. Build the page on top of it:

- Copy the page chrome from buy.html
- A .page-hero with "Your shortlist"
- Render the saved properties with Avenue.cards.card() into a .prop-grid
- A designed empty state (reuse .empty-state) for when nothing is saved, that
  links to buy.html and rent.html
- A "Send this shortlist to Avenue Properties" button that opens WhatsApp with
  the saved property titles pre-filled in the message, using Avenue.util.waLink()
- Unsaving a property should remove it from the page immediately

Add a link to it in the header next to the Call button, showing the count as a
small badge when it is greater than zero. The count must update when a heart is
clicked anywhere on the site without a page reload.

Remember localStorage can throw in private windows — the existing store()/put()
helpers already handle that, use them.
```

---

## 7 · Locality guide pages (the SEO play)

```
Create locality guide pages for the sectors in assets/js/data.js → localities.

One page per locality, e.g. noida-sector-137.html, following the same chrome as
about.html. Each page should carry:
- a .page-hero with the locality name
- 300-500 words on what the sector is actually like: what kind of stock it has,
  who buys there, connectivity, what is nearby
- the properties from data.js that match that locality, via Avenue.cards.card()
- a contact CTA

Write honestly from what you can verify. Where you do not know something
specific about a sector, leave a clearly marked [VERIFY] note rather than
inventing a fact about metro distances, school names or price trends.

Also generate sitemap.xml listing every page, and update robots.txt to allow
crawling and point at it — but ONLY after I tell you the real domain is live.
Right now the preview is deliberately blocked from search engines.
```

---

## 8 · If Cursor starts drifting

Paste this to pull it back:

```
Stop. Re-read .cursor/rules/avenue-properties.mdc.

You have broken one of the hard rules. Check specifically:
- Is there a colour literal in a component rule instead of a token?
- Did you hand-write property card markup outside Avenue.cards?
- Did you hardcode the phone number or address instead of using data-av?
- Did you add a framework, a build step or a package.json?
- Did you invent a statistic, a certification or a claim about the business?

Show me the diff of what you changed, point at which rule you broke, and fix it
without changing anything else.
```

---

# Phase 2 — the real build

Read `STACK.md` first. Short version of what was decided and why:

- **Next.js 15 (App Router) + TypeScript** — one codebase for the public site,
  the admin panel and the API, and server-rendered property pages so Google can
  actually index them. This is the whole reason plain HTML was dropped.
- **PostgreSQL via Supabase** — database, admin auth and property-photo storage
  from one service. **Prisma** for schema and queries.
- **Vercel** for hosting (already deployed there).
- **The public site keeps `avenue.css`.** It is ported, not redesigned.
  **Tailwind + shadcn/ui are used only inside `/admin`.** The two never mix.
- **Resend** for email, **Upstash Redis** for rate limiting, **Telegram**
  for instant alerts — now server-side, so the bot token leaves the browser.

---

## 9 · Scaffold the Next.js project

```
We are rebuilding this static site as a Next.js application. Read STACK.md
before you do anything — it has the stack decisions and the reasoning.

Scaffold the project in this repo, in a new /app-next directory so the current
static site keeps running for the client demo until we cut over.

Stack, exactly:
  Next.js 15, App Router, TypeScript, ESLint
  Tailwind CSS — but configured to apply ONLY under /admin routes
  Prisma + PostgreSQL
  Supabase (database, auth, storage)
  react-hook-form + Zod
  shadcn/ui, admin only

Set up:
  - Route groups: (site) for the public pages, (admin) for the panel
  - app/globals.css  — port assets/css/avenue.css into it, as close to
    unchanged as you can. Keep every token, keep every breakpoint. Do NOT
    convert it to Tailwind utilities.
  - A typed env file with Zod validation, and .env.example listing every
    variable with a comment explaining where to get it
  - .gitignore for .env, .next, node_modules

Do not build any page yet. Scaffold, get `npm run dev` working, show me the
folder structure, and confirm the ported CSS renders a token correctly.
```

---

## 10 · Database schema and seed

```
Create the Prisma schema. STACK.md has the data model to start from — follow
it, and tell me if you think a field is missing.

Tables: properties, property_images, localities, enquiries, testimonials,
site_settings.

Important details:
  - properties.slug is unique and is what the URL uses
  - properties.published (boolean) so the client can draft a listing
  - properties.price is an Int in rupees, because sorting depends on it;
    price_label is the display string ("₹1.65 Cr")
  - highlights and amenities are string arrays
  - enquiries.status is an enum: new | contacted | visiting | closed
  - enquiries.property_id is nullable — a general enquiry has no property

Then write a seed script that imports every record from the old
assets/js/data.js so we start with working content. Keep demo: true on them so
they stay badged as samples.

Run the migration against Supabase, run the seed, and show me the row counts.
```

---

## 11 · Port the public pages

```
Port the public pages from the static site to the Next.js app.

Pages: home, buy, rent, commercial, property/[slug], interiors, about, contact.

Rules for this port:
  - Reuse the existing markup and class names. This is a port, not a redesign.
    The CSS is already in globals.css and the design is already approved.
  - Shared chrome (utility strip, header, drawer, footer, fab stack) becomes
    layout components used by the (site) route group — not copied per page
  - Avenue.cards.card() becomes <PropertyCard />, one component, used everywhere
  - The listing pages query Postgres on the SERVER and read filters from URL
    search params, so a filtered view is linkable and indexable. Do not port
    the client-side filtering
  - property/[slug] uses generateStaticParams and generateMetadata, so every
    property has its own title, description and OG image
  - Contact details come from site_settings, replacing the data-av system

Keep the responsive contract: no horizontal scroll from 360px to 1440px.
Check it before you tell me a page is done.
```

---

## 12 · Enquiry pipeline

```
Wire the enquiry forms to the database and to Telegram.

Flow: form → Server Action → Zod validation → save to enquiries table →
Telegram alert → Resend auto-reply to the enquirer → success state.

Requirements:
  - The Telegram bot token and chat ID are env vars. They must never reach the
    browser. This is the main reason we have a backend
  - Rate limit by IP with Upstash: 3 submissions per 10 minutes. Property
    enquiry forms get spammed, this is not optional
  - A honeypot field as a second layer
  - Validate on the server too, not just the client — same Zod schema both sides
  - If Telegram fails, the enquiry must still be saved. Never lose a lead
    because an alert failed
  - Keep the visitor-alert feature, throttled per session, fired server-side

Show me the failure paths: what the user sees if the database is down, and what
happens if Telegram times out.
```

---

## 13 · Admin panel

```
Build the admin panel under /admin. Tailwind + shadcn/ui here only.

Auth: Supabase Auth, email and password. Two or three users, no signup page —
I create accounts manually. Middleware protects every /admin route and redirects
to /admin/login.

Screens:
  1. Dashboard — enquiry count this week, new vs contacted, recent enquiries,
     published vs draft property count
  2. Properties — table with search, filter by purpose/locality/status, sort.
     Create, edit, duplicate, publish/unpublish, delete with confirmation
  3. Property editor — every field from the schema, drag-to-reorder image
     upload to Supabase Storage, live preview of how the card will look
  4. Enquiries — inbox with status (new/contacted/visiting/closed), notes,
     click-to-call and click-to-WhatsApp, filter by status, export to CSV
  5. Settings — phone, address, hours, social links, demo mode toggle

Use TanStack Table for the tables. Use Server Actions for mutations, with
optimistic updates where it helps.

Image upload matters most here — the client will use it daily. Make it work by
drag and drop, show upload progress, and compress before upload so a 6 MB phone
photo does not take a minute.
```

---

## 14 · Google reviews, server-side

```
Move the Google reviews block to the server.

Right now the plan was a browser-side Places API call. With a backend that is
wrong: the key would be public and every visitor would burn a paid API call.

Instead: fetch Place Details in a server component, cached with
`revalidate: 86400` so it refreshes once a day. The API key is an env var and
never reaches the browser.

Keep the existing visual design exactly — rating, star bars, review cards,
Write a Review button. Keep the sample fallback for when the key is missing or
the call fails, and keep it clearly labelled as sample.

Google returns at most 5 reviews and chooses which ones. Do not try to work
around that, and do not imply on the page that it shows all reviews.
```

---

## 15 · SEO

```
Set up SEO properly now that pages are server-rendered.

  - generateMetadata on every page: real title, description, canonical
  - OG images generated per property with next/og, showing the price,
    configuration and locality over the primary photo
  - JSON-LD: RealEstateAgent on the home page, and a
    RealEstateListing / Residence per property page
  - app/sitemap.ts generating from the database, so new listings appear
    automatically
  - app/robots.ts — blocked while we are on the vercel.app preview, opened up
    only when I tell you the real domain is live
  - Locality guide pages at /noida/[locality], pulling the matching properties

Do not invent facts about a sector — metro distances, school names, price
trends. Leave a [VERIFY] marker where you need me to confirm something.
```

---

## 16 · Cut over

```
Cut the Next.js app over to production.

  1. Point the Vercel project at the Next.js app instead of the static site
  2. Move the static site to /legacy in the repo, or delete it once the new
     one is confirmed working — your call, tell me which and why
  3. Every environment variable set in Vercel, for Production and Preview
  4. Supabase on a paid plan if we are past the free tier — check and tell me
  5. Vercel Pro, because Hobby is non-commercial and this is a business site
  6. Custom domain, HTTPS, www redirect
  7. robots.txt opened up, sitemap submitted to Google Search Console
  8. Walk through every form on production and confirm the alert arrives

Give me a go-live checklist with each item checked off against something you
actually tested, not against what should work.
```

---

## Running the static site locally

```
python -m http.server 4173
```

Then `http://127.0.0.1:4173`. Alerts and Google reviews need http(s) — they do
not work from a `file://` page.

## Deploying

```
vercel deploy --prod --yes
```

Live at https://avenue-properties-one.vercel.app
