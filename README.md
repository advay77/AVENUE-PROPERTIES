# Avenue Properties — website

Static site. No build step, no framework, no server required. Open `index.html` in a
browser and it runs. Every page shares one stylesheet and one script, so the look and
behaviour stay identical across the site.

```
avenue-properties/
├─ index.html          home
├─ buy.html            property for sale        (filter / sort / paginate)
├─ rent.html           property for rent        (filter / sort / paginate)
├─ commercial.html     offices, retail, warehousing + fit-out
├─ property.html       single-listing page, opened as property.html?id=<slug>
├─ interiors.html      interior services
├─ about.html          about, services, testimonials
├─ contact.html        contact, map, enquiry form, "list your property" form
├─ setup.html          internal console — connect alerts + Google reviews (noindex)
└─ assets/
   ├─ css/avenue.css   the whole design system, in one file
   └─ js/
      ├─ config.js     ← the only file you edit to go live
      ├─ data.js       demo inventory, localities, testimonials
      └─ avenue.js     all behaviour
```

---

## Where it is hosted

Live on Vercel, under the account `advayanand87-1153`:

**https://avenue-properties-one.vercel.app**

Publicly viewable — no login, no Vercel account needed. Send that link to the client.

Redeploy after any edit, from this folder:

```
vercel deploy --prod --yes
```

Two things about this deployment:

- **`robots.txt` blocks search engines.** This is a preview URL, so keeping it out of
  Google stops it competing with the real domain later. The file says exactly what to
  change when the real domain goes live.
- **`README.md` and `.claude/` are not deployed** (see `.vercelignore`), so this handover
  doc is not public.

To put it on the client's own domain: add the domain in the Vercel dashboard under this
project, point the DNS at Vercel, then open `robots.txt` and allow crawling.

---

## Going live — the short version

1. Open `setup.html` in a browser.
2. Fill in **one** alert channel and the **Google Place ID**.
3. Press the test buttons. When they come through, copy the generated block.
4. Paste it into `assets/js/config.js`.
5. Replace the demo listings in `assets/js/data.js`, set `demoMode: false`, upload.

Alerts and Google reviews both need the site served over `http(s)` — they will not work
from a `file://` page, because browsers block cross-site requests from local files.

---

## 1. Live visitor & enquiry alerts

The site pings you when somebody lands on it, and again when somebody submits a form.
No WhatsApp Business API and no monthly fee. Configure any one of these in
`config.js` → `alerts`; if you configure several, every alert goes to all of them.

| Channel | Cost | Speed | Notes |
|---|---|---|---|
| **Telegram** | free | instant | Best option. Message `@BotFather` → `/newbot` for a token, message your bot once, then read the `chat.id` from `api.telegram.org/bot<TOKEN>/getUpdates` |
| **Web3Forms** | free tier | email | Access key is public by design. Get one at web3forms.com, no account needed |
| **Discord** | free | instant | Paste a channel webhook URL |
| **Relay** | free | instant | Your own endpoint — see below. Recommended for production |

**Visitor alerts are throttled.** One person browsing eight pages sends one alert, not
eight. Change the window with `visitThrottleMinutes` (default 120), or set
`alertOnEveryPage: true` if you genuinely want one per page view.

**Enquiry alerts** carry name, phone, what they want, budget, locality, the message, the
page they were on, and the time in IST.

**While nothing is connected**, every enquiry is still saved in the visitor's browser and
listed in `setup.html`, so nothing is lost during the demo period.

### A note on the Telegram token

A bot token written into `config.js` is visible to anyone who views the page source.
Someone who finds it can send messages *as* your bot — they cannot read your chats, post
to the site, or reach any other account. For a shop alert bot that is usually an
acceptable trade. If you would rather not expose it, use a relay.

### Relay (keeps the token server-side)

Deploy this free Cloudflare Worker, put its URL in `config.js` → `alerts.relayUrl`, and
the browser will call only your own endpoint.

```js
// Cloudflare Worker — Workers & Pages → Create → Worker → paste → Deploy
// Then: Settings → Variables → add BOT_TOKEN and CHAT_ID as secrets.
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': 'https://YOUR-DOMAIN.com', // your live domain
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: cors });

    const body = await request.json().catch(() => null);
    if (!body || typeof body.text !== 'string' || body.text.length > 4000) {
      return new Response('Bad request', { status: 400, headers: cors });
    }

    await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.CHAT_ID,
        text: body.text,
        disable_web_page_preview: true
      })
    });

    return new Response('ok', { headers: cors });
  }
};
```

Set `Access-Control-Allow-Origin` to your real domain rather than `*`, so only your own
site can post through it.

---

## 2. Google reviews

Shows the live Google Business rating, review count and review text on the home page,
with a one-click **Write a Review** button that opens Google's own review box — new
reviews go straight to Google, never through this site.

Fill in `config.js` → `google`:

| Field | Where it comes from | What it unlocks |
|---|---|---|
| `placeId` | [Place ID finder](https://developers.google.com/maps/documentation/places/web-service/place-id) — search the business, copy the `ChIJ…` string | The **Write a Review** button and the Maps links |
| `apiKey` | Google Cloud → enable **Places API** → create an API key | Live rating, review count and review text |
| `profileUrl` | The share link from the Google Business Profile | "See all on Google" |

**Restrict the API key.** In Google Cloud set *Application restrictions → HTTP referrers*
and add the live domain. A Places key is visible in the page source by design; the
referrer restriction is what stops anyone else billing calls to the client's account.

**Google returns at most five reviews** through its API, and Google chooses which five.
That is a platform limit, not a limit of this site. The block links out to the full list.

Until both values are present, the block shows a clearly-labelled sample layout and keeps
working — nothing breaks, and the section never looks empty in front of a client.

You can also paste reviews by hand into `google.manualReviews` if you would rather not
enable the API at all.

---

## 3. Replacing the demo content

Everything marked **Sample listing** comes from `assets/js/data.js`. Each record is
documented at the top of that file. Keep the shape and the whole site updates — cards,
filters, the detail page and the similar-properties row all read from the same array.

When real inventory is in, set `demoMode: false` in `config.js`. That removes the
"Sample listing" badges. The standing demo notices under the listing grids are plain HTML
in the pages — delete those paragraphs when they no longer apply.

Photography is currently Unsplash placeholder imagery, licensed for use but generic.
Replace the URLs in `data.js` and in the page headers with the client's own photographs.

---

## 4. Responsive behaviour

Breakpoints, used consistently in `avenue.css`:

| Width | What changes |
|---|---|
| 1180px | Nav spacing tightens |
| 1024px | Utility strip hides; listing filters move above the results; category grid goes to 3 columns |
| 860px | Main nav collapses into the drawer; property grids go to 2 columns; sections stack |
| 680px | Single-column property grid; floating call button appears; category grid to 2 |
| 520px | Search console stacks to one field per row; forms to one column |
| 390px | CTA label shortens so the header never wraps |

The page body never scrolls sideways at any width.

---

## 5. Still to do before launch

- Real Privacy Policy, Terms of Use and Disclaimer pages — the footer links are placeholders
- Real client testimonials to replace the sample carousel on the About page
- The client's own photography
- Social profile links in `config.js` (blank ones are hidden automatically)
- A real domain over HTTPS

Nothing on the site claims a certification, a RERA registration, a transaction count or a
verified-listing status. Those must not be added without documents to back them.
