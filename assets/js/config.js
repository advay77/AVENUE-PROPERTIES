/* ===========================================================================
   AVENUE PROPERTIES — site configuration
   ---------------------------------------------------------------------------
   This is the ONLY file you need to edit to connect the live features.
   Open setup.html in a browser for a guided version of everything below.
   =========================================================================== */

window.AVENUE_CONFIG = {

  /* ---------------------------------------------------------------------
     BUSINESS DETAILS — used across every page, the footer and schema.org
     --------------------------------------------------------------------- */
  business: {
    name: 'Avenue Properties',
    addressLine1: 'Shop No. 27, Aims Golf Avenue 1',
    addressLine2: 'Sector 75, Noida, Uttar Pradesh 201301',
    locality: 'Noida',
    region: 'Uttar Pradesh',
    postalCode: '201301',
    phoneDisplay: '+91 70119 66691',
    phoneDial: '+917011966691',
    whatsapp: '917011966691',          // digits only, with country code
    email: '',                         // optional — shown in the footer when set
    hours: '10:00 AM – 8:00 PM, Monday to Sunday',
    mapsQuery: 'Aims Golf Avenue 1, Sector 75, Noida, Uttar Pradesh 201301'
  },

  /* ---------------------------------------------------------------------
     1. LIVE VISITOR / ENQUIRY ALERTS
     ---------------------------------------------------------------------
     Free instant alerts. No WhatsApp Business API, no recurring charges.
     Fill in ANY ONE channel (or several — alerts fan out to all of them).

     TELEGRAM  — fastest, truly instant, free forever.
       1. In Telegram, message @BotFather -> /newbot -> copy the bot token
       2. Message your new bot once (say "hi") so it can reply to you
       3. Open https://api.telegram.org/bot<TOKEN>/getUpdates and copy
          the "chat":{"id": ... } number
       SECURITY: a bot token written here is visible in the page source.
       Anyone who reads it can send messages AS your bot (they cannot read
       your chats or post to your site). Fine for a shop alert bot. For a
       hardened setup, use `relayUrl` below instead — README.md has a
       ready-made free Cloudflare Worker that keeps the token server-side.

     WEB3FORMS — email alerts. The access key is public by design.
       Get a free key at https://web3forms.com (no account needed).

     DISCORD   — paste a channel webhook URL (Server Settings -> Integrations).

     RELAY     — your own endpoint (Cloudflare Worker / Vercel function).
       When set, every alert is POSTed here as JSON and nothing else is
       called from the browser. This is the recommended production setup.
     --------------------------------------------------------------------- */
  alerts: {
    enabled: true,

    telegram: {
      botToken: '',                    // e.g. '7612345678:AAH...'
      chatId: ''                       // e.g. '512345678'
    },
    web3formsKey: '',                  // e.g. 'a1b2c3d4-...'
    discordWebhook: '',                // e.g. 'https://discord.com/api/webhooks/...'
    relayUrl: '',                      // e.g. 'https://alerts.yourdomain.workers.dev'

    /* Visitor alerts: ping you when somebody lands on the site.
       Throttled so one person browsing 8 pages sends ONE alert. */
    visitAlerts: true,
    visitThrottleMinutes: 120,         // same visitor won't re-alert inside this window
    alertOnEveryPage: false,           // true = one alert per page view (noisy)

    /* Enquiry alerts: always on when a form is submitted. */
    enquiryAlerts: true,

    /* Keep a copy of every enquiry in this browser so nothing is lost while
       the channels above are still being set up. Viewable in setup.html. */
    keepLocalCopy: true
  },

  /* ---------------------------------------------------------------------
     2. GOOGLE REVIEWS
     ---------------------------------------------------------------------
     THREE things to supply, all from the client's Google Business Profile:

       placeId      Find it at https://developers.google.com/maps/documentation/places/web-service/place-id
                    (search the business name, copy the ChIJ... string)
       apiKey       Google Cloud -> Places API enabled -> API key.
                    RESTRICT IT: Application restrictions -> HTTP referrers ->
                    add your domain. An unrestricted key can be abused.
       profileUrl   The public "share" link from the Google Business Profile.

     Google's Places API returns a maximum of 5 reviews and they are the
     ones Google chooses — this is a Google limit, not a site limit.

     If placeId + apiKey are blank, the block falls back to `manualReviews`
     below (or clearly-marked sample reviews) and still shows a working
     "Write a Review" button as soon as placeId is filled in.
     --------------------------------------------------------------------- */
  google: {
    placeId: '',                       // e.g. 'ChIJN1t_tDeuEmsRUsoyG83frY4'
    apiKey: '',
    profileUrl: '',                    // the client's Google Business share link
    minRatingToShow: 4,                // hide 1–3 star reviews from the carousel
    maxReviews: 6,

    /* Optional: reviews copied by hand from the Google profile. Used when
       the API is not connected. Set `sample: true` on anything that is not
       a real customer review so the page labels it honestly. */
    manualReviews: []
  },

  /* ---------------------------------------------------------------------
     3. SOCIAL LINKS — leave blank to hide the icon
     --------------------------------------------------------------------- */
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  },

  /* ---------------------------------------------------------------------
     4. DEMO MODE
     ---------------------------------------------------------------------
     true  = sample listings and sample reviews carry a visible badge.
     Set to false once real inventory and real reviews are connected.
     --------------------------------------------------------------------- */
  demoMode: true
};
