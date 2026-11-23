# Cursor prompts — Avenue Properties

Paste these into Cursor's chat (Cmd/Ctrl + L) in Agent mode.

`.cursor/rules/avenue-properties.mdc` is already in this repo and loads
automatically on every request, so Cursor always knows the architecture, the
design tokens, the breakpoints and the house rules. These prompts only have to
describe **the task**.

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

## Running it locally

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
