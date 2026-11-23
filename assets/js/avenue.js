/* ===========================================================================
   AVENUE PROPERTIES — site behaviour
   ---------------------------------------------------------------------------
   Loaded on every page, after config.js and data.js.

     Avenue.util        small helpers
     Avenue.hydrate     fills [data-av="..."] from config (phone, address, links)
     Avenue.header      sticky header, mobile drawer, active nav
     Avenue.reveal      scroll-in animation
     Avenue.toast       transient messages
     Avenue.shortlist   saved properties (this browser)
     Avenue.search      hero search console
     Avenue.cards       property card / row markup
     Avenue.listing     Buy / Rent / Commercial pages (filter, sort, paginate)
     Avenue.detail      property.html
     Avenue.carousel    testimonial slider
     Avenue.forms       validation + submit -> Avenue.alerts
     Avenue.alerts      live visitor + enquiry alerts  (feature 1)
     Avenue.reviews     Google Business reviews        (feature 2)
   =========================================================================== */

window.Avenue = (function () {
  'use strict';

  var CFG  = window.AVENUE_CONFIG || {};
  var DATA = window.AVENUE_DATA || {};
  var BIZ  = CFG.business || {};

  /* ======================================================================
     UTIL
     ====================================================================== */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    if (html != null) n.innerHTML = html;
    return n;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function params() {
    var out = {};
    (location.search || '').replace(/^\?/, '').split('&').forEach(function (pair) {
      if (!pair) return;
      var i = pair.indexOf('=');
      var k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i));
      var v = i < 0 ? '' : decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      out[k] = v;
    });
    return out;
  }

  function store(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw == null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  }
  function put(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }

  function waLink(message) {
    var num = BIZ.whatsapp || '';
    if (!num) return '#';
    return 'https://wa.me/' + num + (message ? '?text=' + encodeURIComponent(message) : '');
  }
  function telLink() { return 'tel:' + (BIZ.phoneDial || ''); }
  function mapsLink() { return 'https://maps.google.com/?q=' + encodeURIComponent(BIZ.mapsQuery || ''); }

  function nowIST() {
    try {
      return new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    } catch (e) { return new Date().toLocaleString(); }
  }

  function deviceLabel() {
    var w = window.innerWidth;
    var kind = w < 680 ? 'Mobile' : w < 1024 ? 'Tablet' : 'Desktop';
    return kind + ' · ' + w + '×' + window.innerHeight;
  }

  function reduceMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  var util = { $: $, $$: $$, el: el, esc: esc, params: params, store: store, put: put,
               waLink: waLink, telLink: telLink, mapsLink: mapsLink, nowIST: nowIST };

  /* ======================================================================
     ICONS (inline, so no icon font or extra request)
     ====================================================================== */
  var I = {
    pin:   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
    heart: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.5 12.6 12 20l-7.5-7.4a4.8 4.8 0 0 1 0-6.9 5 5 0 0 1 7 0l.5.5.5-.5a5 5 0 0 1 7 0 4.8 4.8 0 0 1 0 6.9Z"/></svg>',
    wa:    '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.6 14.1c-.2.7-1.3 1.3-1.8 1.3-.5.1-1 .1-1.7-.1a13.4 13.4 0 0 1-6.6-5.8c-.5-.8-.8-1.7-.8-2.6 0-1 .5-1.5.7-1.7.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2 0 .4-.1.5l-.4.5c-.1.2-.3.3-.1.6a9.3 9.3 0 0 0 4 3.4c.3.1.5.1.6-.1l.8-1c.2-.2.3-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6 0 1Z"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="m4 12 5.5 5.5L20 7"/></svg>',
    info:  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/><path d="M12 16v-5M12 8h.01"/></svg>',
    star:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 17.3-6.2 3.7 1.7-7-5.5-4.7 7.2-.6L12 2l2.8 6.7 7.2.6-5.5 4.7 1.7 7z"/></svg>',
    google:'<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.4L6.4 10c.8-2.4 3-4.1 5.6-4.1Z"/></svg>'
  };

  /* ======================================================================
     TOAST
     ====================================================================== */
  var toast = (function () {
    var wrap;
    function ensure() {
      if (!wrap) {
        wrap = el('div', { class: 'toast-wrap', role: 'status', 'aria-live': 'polite' });
        document.body.appendChild(wrap);
      }
      return wrap;
    }
    return function (msg, kind, ms) {
      var t = el('div', { class: 'toast' + (kind ? ' toast--' + kind : '') });
      t.innerHTML = (kind === 'ok' ? I.check : I.info) + '<span>' + esc(msg) + '</span>';
      ensure().appendChild(t);
      setTimeout(function () {
        t.style.transition = 'opacity .3s, transform .3s';
        t.style.opacity = '0'; t.style.transform = 'translateY(8px)';
        setTimeout(function () { t.remove(); }, 320);
      }, ms || 4200);
    };
  })();

  /* ======================================================================
     ALERTS  —  feature 1: live visitor / enquiry alerts
     ----------------------------------------------------------------------
     Fans a message out to every channel configured in config.js.
     Nothing here costs money: Telegram, Web3Forms and Discord all have
     free tiers that cover a small business site comfortably.
     ====================================================================== */
  var alerts = (function () {
    var A = (CFG.alerts || {});
    var LOG_KEY = 'av_alert_log';
    var VISIT_KEY = 'av_last_visit';
    var VID_KEY = 'av_vid';

    function channels() {
      var list = [];
      if (A.relayUrl) list.push('relay');
      if (A.telegram && A.telegram.botToken && A.telegram.chatId) list.push('telegram');
      if (A.web3formsKey) list.push('web3forms');
      if (A.discordWebhook) list.push('discord');
      return list;
    }

    function visitorId() {
      var id = store(VID_KEY, null);
      if (!id) {
        id = 'V' + Math.random().toString(36).slice(2, 7).toUpperCase();
        put(VID_KEY, id);
      }
      return id;
    }

    function logLocal(entry) {
      if (A.keepLocalCopy === false) return;
      var log = store(LOG_KEY, []);
      log.unshift(entry);
      put(LOG_KEY, log.slice(0, 50));
    }

    function post(url, body, asForm) {
      var opts = { method: 'POST', keepalive: true };
      if (asForm) {
        opts.body = body;                       // URLSearchParams / FormData
      } else {
        opts.headers = { 'Content-Type': 'application/json' };
        opts.body = JSON.stringify(body);
      }
      return fetch(url, opts);
    }

    function buildText(kind, d) {
      var L = [];
      if (kind === 'enquiry') {
        L.push('🔔 NEW ENQUIRY — ' + (BIZ.name || 'Website'));
        L.push('');
        L.push('Name:    ' + (d.name || '—'));
        L.push('Phone:   ' + (d.phone || '—'));
        if (d.email)   L.push('Email:   ' + d.email);
        if (d.intent)  L.push('Wants:   ' + d.intent);
        if (d.budget)  L.push('Budget:  ' + d.budget);
        if (d.area)    L.push('Area:    ' + d.area);
        if (d.property)L.push('Listing: ' + d.property);
        if (d.message) L.push('Note:    ' + d.message);
        L.push('');
        L.push('Page:  ' + d.page);
        L.push('Time:  ' + d.time + ' IST');
      } else {
        L.push('👀 Visitor on the site — ' + (BIZ.name || 'Website'));
        L.push('');
        L.push('Page:     ' + d.page);
        L.push('Came from: ' + (d.referrer || 'direct / typed in'));
        L.push('Device:   ' + d.device);
        L.push('Visitor:  ' + d.visitor);
        L.push('Time:     ' + d.time + ' IST');
      }
      return L.join('\n');
    }

    function send(kind, data) {
      if (!A.enabled) return Promise.resolve({ sent: [], skipped: 'alerts disabled' });

      var d = Object.assign({
        page: document.title + '  (' + location.pathname.split('/').pop() + ')',
        referrer: document.referrer || '',
        device: deviceLabel(),
        visitor: visitorId(),
        time: nowIST()
      }, data || {});

      var text = buildText(kind, d);
      var subject = (kind === 'enquiry' ? 'New enquiry' : 'New visitor') + ' — ' + (BIZ.name || 'Website');
      var jobs = [];
      var used = channels();

      if (A.relayUrl) {
        jobs.push(post(A.relayUrl, { kind: kind, subject: subject, text: text, data: d }));
      } else {
        if (A.telegram && A.telegram.botToken && A.telegram.chatId) {
          jobs.push(post('https://api.telegram.org/bot' + A.telegram.botToken + '/sendMessage', {
            chat_id: A.telegram.chatId, text: text, disable_web_page_preview: true
          }));
        }
        if (A.web3formsKey) {
          jobs.push(post('https://api.web3forms.com/submit', Object.assign({
            access_key: A.web3formsKey, subject: subject, from_name: BIZ.name || 'Website', message: text
          }, kind === 'enquiry' ? { name: d.name, phone: d.phone, email: d.email || '' } : {})));
        }
        if (A.discordWebhook) {
          jobs.push(post(A.discordWebhook, { content: '```\n' + text + '\n```' }));
        }
      }

      logLocal({ kind: kind, at: new Date().toISOString(), time: d.time, text: text, channels: used });

      if (!jobs.length) {
        if (window.console) console.info('[Avenue alerts] no channel configured yet — alert kept in this browser only.\n' + text);
        return Promise.resolve({ sent: [], skipped: 'no channel configured' });
      }

      return Promise.allSettled(jobs).then(function (res) {
        var okCount = res.filter(function (r) { return r.status === 'fulfilled'; }).length;
        if (!okCount && window.console) console.warn('[Avenue alerts] every channel failed. On file:// this is normal — alerts need the site served over http(s).');
        return { sent: used, ok: okCount };
      });
    }

    function visitPing() {
      if (!A.enabled || !A.visitAlerts) return;
      if (!A.alertOnEveryPage) {
        var last = store(VISIT_KEY, 0);
        var gap = (A.visitThrottleMinutes || 120) * 60 * 1000;
        if (Date.now() - last < gap) return;
      }
      put(VISIT_KEY, Date.now());
      send('visit');
    }

    return {
      send: send, visitPing: visitPing, channels: channels, buildText: buildText,
      log: function () { return store(LOG_KEY, []); },
      clearLog: function () { put(LOG_KEY, []); }
    };
  })();

  /* ======================================================================
     HYDRATE — config-driven contact details everywhere
     ====================================================================== */
  function hydrate() {
    $$('[data-av]').forEach(function (n) {
      var k = n.getAttribute('data-av');
      switch (k) {
        case 'name':      n.textContent = BIZ.name || ''; break;
        case 'phone':     n.textContent = BIZ.phoneDisplay || ''; if (n.tagName === 'A') n.href = telLink(); break;
        case 'tel':       n.href = telLink(); break;
        case 'address1':  n.textContent = BIZ.addressLine1 || ''; break;
        case 'address2':  n.textContent = BIZ.addressLine2 || ''; break;
        case 'hours':     n.textContent = BIZ.hours || ''; break;
        case 'maps':      n.href = mapsLink(); break;
        case 'wa':        n.href = waLink(n.getAttribute('data-msg') || 'Hi ' + (BIZ.name || '') + ', I would like to discuss a property.'); break;
        case 'year':      n.textContent = String(new Date().getFullYear()); break;
      }
    });

    // social links — hide the ones that are not configured
    var S = CFG.social || {};
    $$('[data-social]').forEach(function (a) {
      var url = S[a.getAttribute('data-social')];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else a.remove();
    });
  }

  /* ======================================================================
     HEADER
     ====================================================================== */
  function header() {
    var head = $('.site-header');
    if (!head) return;

    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var burger = $('#burger'), drawer = $('#drawer');
    if (burger && drawer) {
      burger.addEventListener('click', function () {
        var open = burger.getAttribute('aria-expanded') === 'true';
        burger.setAttribute('aria-expanded', String(!open));
        burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
        drawer.classList.toggle('is-open', !open);
      });
      $$('a', drawer).forEach(function (a) {
        a.addEventListener('click', function () {
          burger.setAttribute('aria-expanded', 'false');
          drawer.classList.remove('is-open');
        });
      });
      window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer.classList.contains('is-open')) burger.click();
      });
    }

    // mark the current page in both menus
    var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $$('.nav-links a, .drawer a').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('?')[0].split('#')[0].toLowerCase();
      if (href && href === here) a.classList.add('is-current');
    });
  }

  /* ======================================================================
     REVEAL
     ====================================================================== */
  function reveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion()) {
      items.forEach(function (n) { n.classList.add('is-off'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });

    items.forEach(function (n, i) {
      n.style.transitionDelay = Math.min(i % 6, 5) * 55 + 'ms';
      io.observe(n);
    });
    setTimeout(function () { items.forEach(function (n) { n.classList.add('is-in'); }); }, 2600);
  }

  /* ======================================================================
     SHORTLIST
     ====================================================================== */
  var shortlist = {
    key: 'av_shortlist',
    all: function () { return store(this.key, []); },
    has: function (id) { return this.all().indexOf(id) > -1; },
    toggle: function (id) {
      var list = this.all(), i = list.indexOf(id);
      if (i > -1) list.splice(i, 1); else list.push(id);
      put(this.key, list);
      return i === -1;
    }
  };

  function bindFavs(scope) {
    $$('.prop-fav', scope || document).forEach(function (b) {
      var id = b.getAttribute('data-id');
      if (id && shortlist.has(id)) {
        b.setAttribute('aria-pressed', 'true');
        b.setAttribute('aria-label', 'Saved — remove from shortlist');
      }
      b.addEventListener('click', function (e) {
        e.preventDefault();
        var on = id ? shortlist.toggle(id) : b.getAttribute('aria-pressed') !== 'true';
        b.setAttribute('aria-pressed', String(on));
        b.setAttribute('aria-label', on ? 'Saved — remove from shortlist' : 'Save this property');
        toast(on ? 'Saved to your shortlist.' : 'Removed from your shortlist.', 'ok', 2400);
      });
    });
  }

  /* ======================================================================
     SEARCH CONSOLE
     ====================================================================== */
  var SEARCH_MODES = {
    buy: {
      typeLabel: 'Property type',
      types: [['', 'All residential'], ['apartment', 'Apartment / Flat'], ['builder-floor', 'Builder floor'], ['villa', 'Independent house / Villa'], ['plot', 'Plot / Land']],
      budgetLabel: 'Budget',
      budgets: [['', 'Any budget'], ['0-5000000', 'Under ₹50 Lakh'], ['5000000-10000000', '₹50 Lakh – ₹1 Crore'], ['10000000-20000000', '₹1 Cr – ₹2 Cr'], ['20000000-40000000', '₹2 Cr – ₹4 Cr'], ['40000000-', 'Above ₹4 Cr']],
      cta: 'Search Properties', page: 'buy.html'
    },
    rent: {
      typeLabel: 'Property type',
      types: [['', 'All rentals'], ['apartment', 'Apartment / Flat'], ['builder-floor', 'Builder floor'], ['villa', 'Independent house']],
      budgetLabel: 'Monthly rent',
      budgets: [['', 'Any rent'], ['0-20000', 'Under ₹20,000'], ['20000-35000', '₹20,000 – ₹35,000'], ['35000-60000', '₹35,000 – ₹60,000'], ['60000-100000', '₹60,000 – ₹1 Lakh'], ['100000-', 'Above ₹1 Lakh']],
      cta: 'Search Rentals', page: 'rent.html'
    },
    sell: {
      typeLabel: 'What you own',
      types: [['apartment', 'Apartment / Flat'], ['builder-floor', 'Builder floor'], ['villa', 'Independent house / Villa'], ['plot', 'Plot / Land'], ['office', 'Shop / Office']],
      budgetLabel: 'Expected price',
      budgets: [['', 'Not sure — advise me'], ['0-5000000', 'Under ₹50 Lakh'], ['5000000-10000000', '₹50 Lakh – ₹1 Crore'], ['10000000-20000000', '₹1 Cr – ₹2 Cr'], ['20000000-40000000', '₹2 Cr – ₹4 Cr'], ['40000000-', 'Above ₹4 Cr']],
      cta: 'Get a Valuation', page: 'contact.html'
    },
    commercial: {
      typeLabel: 'Space type',
      types: [['', 'All commercial'], ['office', 'Office space'], ['retail', 'Retail / Showroom'], ['shop', 'Shop'], ['warehouse', 'Warehouse / Industrial']],
      budgetLabel: 'Budget or rent',
      budgets: [['', 'Any budget'], ['0-100000', 'Lease — under ₹1 Lakh / month'], ['100000-300000', 'Lease — ₹1 – 3 Lakh / month'], ['0-20000000', 'Buy — under ₹2 Cr'], ['20000000-50000000', 'Buy — ₹2 – 5 Cr'], ['50000000-', 'Buy — above ₹5 Cr']],
      cta: 'Search Commercial', page: 'commercial.html'
    }
  };

  function searchConsole() {
    var form = $('#searchPanel');
    if (!form) return;

    var sType = $('#sType'), sBudget = $('#sBudget'), tabs = $$('.search-tab');
    var mode = 'buy';

    function fill(sel, items) {
      sel.innerHTML = '';
      items.forEach(function (pair) {
        var o = document.createElement('option');
        o.value = pair[0]; o.textContent = pair[1];
        sel.appendChild(o);
      });
    }
    function apply(m) {
      mode = m;
      var cfg = SEARCH_MODES[m] || SEARCH_MODES.buy;
      $('#sTypeLabel').textContent = cfg.typeLabel;
      $('#sBudgetLabel').textContent = cfg.budgetLabel;
      $('#searchBtnLabel').textContent = cfg.cta;
      fill(sType, cfg.types);
      fill(sBudget, cfg.budgets);
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
        tab.setAttribute('aria-selected', 'true');
        form.setAttribute('aria-labelledby', tab.id);
        apply(tab.getAttribute('data-mode'));
      });
      tab.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); next.click();
      });
    });

    apply('buy');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cfg = SEARCH_MODES[mode];
      var q = [];
      var loc = $('#sLocation').value;
      if (loc && loc.indexOf('All ') !== 0) q.push('locality=' + encodeURIComponent(loc.replace(/,.*$/, '').trim()));
      if (sType.value) q.push('kind=' + encodeURIComponent(sType.value));
      if (sBudget.value) q.push('price=' + encodeURIComponent(sBudget.value));
      if (mode === 'sell') q.push('intent=sell');
      location.href = cfg.page + (q.length ? '?' + q.join('&') : '');
    });
  }

  /* ======================================================================
     PROPERTY CARDS
     ====================================================================== */
  var cards = {
    stars: function () { return ''; },

    card: function (p) {
      var msg = 'Hi ' + (BIZ.name || '') + ', I am interested in: ' + p.title + ' (' + p.locality + ').';
      var badge = p.demo && CFG.demoMode !== false ? '<span class="tag tag--demo">Sample listing</span>' : '';
      var rentTag = p.purpose === 'rent' ? '<span class="tag tag--green">For rent</span>' : '';
      return '' +
      '<article class="prop-card reveal" data-id="' + esc(p.id) + '">' +
        '<div class="media">' +
          '<a href="property.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.title) + '">' +
            '<img loading="lazy" src="' + esc(p.images[0]) + '" alt="' + esc(p.title) + '">' +
          '</a>' +
          '<div class="prop-badges">' +
            '<span class="prop-badges-l">' + badge + rentTag + '</span>' +
            '<button class="prop-fav" type="button" data-id="' + esc(p.id) + '" aria-pressed="false" aria-label="Save this property">' + I.heart + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="prop-body">' +
          '<div class="prop-price"><b>' + esc(p.priceLabel) + '</b><i>' + esc(p.priceSuffix) + '</i></div>' +
          '<h3><a href="property.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a></h3>' +
          '<p class="prop-loc">' + I.pin + ' ' + esc(p.locality) + ', ' + esc(p.area) + '</p>' +
          '<ul class="prop-specs">' + p.specs.map(function (s) {
            return '<li><span class="k">' + esc(s[0]) + '</span><span class="v">' + esc(s[1]) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="prop-desc">' + esc(p.desc) + '</p>' +
          '<div class="prop-actions">' +
            '<a class="btn btn--dark" href="property.html?id=' + encodeURIComponent(p.id) + '">View details</a>' +
            '<a class="btn btn--wa" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener" aria-label="Enquire on WhatsApp">' + I.wa + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    },

    row: function (p) {
      var msg = 'Hi ' + (BIZ.name || '') + ', I am interested in: ' + p.title + ' (' + p.locality + ').';
      var badge = p.demo && CFG.demoMode !== false ? '<span class="tag tag--demo">Sample listing</span>' : '';
      return '' +
      '<article class="prop-row reveal" data-id="' + esc(p.id) + '">' +
        '<div class="media">' +
          '<a href="property.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + esc(p.title) + '">' +
            '<img loading="lazy" src="' + esc(p.images[0]) + '" alt="' + esc(p.title) + '">' +
          '</a>' +
          '<div class="prop-badges"><span class="prop-badges-l">' + badge + '</span>' +
            '<button class="prop-fav" type="button" data-id="' + esc(p.id) + '" aria-pressed="false" aria-label="Save this property">' + I.heart + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="prop-body">' +
          '<div class="prop-price"><b>' + esc(p.priceLabel) + '</b><i>' + esc(p.priceSuffix) + '</i></div>' +
          '<h3><a href="property.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.title) + '</a></h3>' +
          '<p class="prop-loc">' + I.pin + ' ' + esc(p.locality) + ', ' + esc(p.area) + '</p>' +
          '<ul class="prop-specs">' + p.specs.map(function (s) {
            return '<li><span class="k">' + esc(s[0]) + '</span><span class="v">' + esc(s[1]) + '</span></li>';
          }).join('') + '</ul>' +
          '<p class="prop-desc">' + esc(p.desc) + '</p>' +
          '<div class="prop-actions">' +
            '<a class="btn btn--dark" href="property.html?id=' + encodeURIComponent(p.id) + '">View details</a>' +
            '<a class="btn btn--ghost" href="' + esc(telLink()) + '">Call about this</a>' +
            '<a class="btn btn--wa" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener" aria-label="Enquire on WhatsApp">' + I.wa + '</a>' +
          '</div>' +
        '</div>' +
      '</article>';
    }
  };

  /* ======================================================================
     HOME — featured grid with chips
     ====================================================================== */
  function featured() {
    var grid = $('#featuredGrid');
    if (!grid) return;
    var all = (DATA.properties || []).filter(function (p) { return p.featured; });

    function draw(filter) {
      var list = all.filter(function (p) {
        if (!filter || filter === 'all') return true;
        if (filter === 'buy') return p.purpose === 'buy' && p.segment === 'residential';
        if (filter === 'rent') return p.purpose === 'rent' && p.segment === 'residential';
        if (filter === 'commercial') return p.segment === 'commercial';
        if (filter === 'plot') return p.kind === 'plot';
        return true;
      });
      grid.innerHTML = list.map(cards.card).join('');
      $$('.reveal', grid).forEach(function (n) { n.classList.add('is-in'); });
      bindFavs(grid);
    }

    draw('all');

    var chips = $$('#featuredFilters .chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-on'); });
        chip.classList.add('is-on');
        draw(chip.getAttribute('data-filter'));
      });
    });
  }

  /* ======================================================================
     HOME — categories & localities from data
     ====================================================================== */
  function homeBlocks() {
    var cat = $('#catGrid');
    if (cat) {
      cat.innerHTML = (DATA.categories || []).map(function (c) {
        return '<a class="cat-card reveal" href="' + esc(c.href) + '">' +
          '<img loading="lazy" src="' + esc(c.img) + '" alt="' + esc(c.name) + '">' +
          '<span class="cat-arrow" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M7 17 17 7M9 7h8v8"/></svg></span>' +
          '<div class="cat-body"><h3>' + esc(c.name) + '</h3><span>' + esc(c.sub) + '</span></div></a>';
      }).join('');
    }

    var loc = $('#locGrid');
    if (loc) {
      loc.innerHTML = (DATA.localities || []).map(function (l) {
        return '<a class="loc-card reveal" href="' + esc(l.href) + '">' +
          '<img loading="lazy" src="' + esc(l.img) + '" alt="' + esc(l.name) + '">' +
          '<div class="loc-body"><h3>' + esc(l.name) + '</h3><span>' + esc(l.sub) + '</span>' +
          '<span class="loc-meta"><i class="loc-dot" aria-hidden="true"></i> ' + esc(l.meta) + '</span></div></a>';
      }).join('');
    }
  }

  /* ======================================================================
     LISTING PAGES  (buy / rent / commercial)
     ====================================================================== */
  var KIND_LABEL = {
    apartment: 'Apartment', 'builder-floor': 'Builder floor', villa: 'Villa / House',
    plot: 'Plot / Land', office: 'Office', retail: 'Retail / Showroom',
    shop: 'Shop', warehouse: 'Warehouse'
  };

  function listing() {
    var root = $('#listingRoot');
    if (!root) return;

    var scope = {
      purpose: root.getAttribute('data-purpose') || '',   // buy | rent | '' (both)
      segment: root.getAttribute('data-segment') || ''    // residential | commercial | ''
    };

    var base = (DATA.properties || []).filter(function (p) {
      if (scope.segment && p.segment !== scope.segment) return false;
      if (scope.purpose && p.purpose !== scope.purpose) return false;
      return true;
    });

    var qp = params();
    var state = {
      kinds: qp.kind ? [qp.kind] : [],
      localities: qp.locality ? [qp.locality] : [],
      bhk: [],
      price: qp.price || '',
      sort: 'featured',
      view: 'grid',
      page: 1,
      perPage: 6
    };

    var elGrid = $('#results');
    var elCount = $('#resultsCount');
    var elActive = $('#activeFilters');
    var elPager = $('#pagination');

    /* ---- build the filter panel from the data we actually have -------- */
    function uniq(fn) {
      var seen = {}, out = [];
      base.forEach(function (p) {
        var v = fn(p);
        if (v == null || v === '') return;
        if (!seen[v]) { seen[v] = 0; out.push(v); }
        seen[v]++;
      });
      return out.map(function (v) { return { value: v, count: seen[v] }; });
    }

    function buildFilters() {
      var panel = $('#filterGroups');
      if (!panel) return;
      var html = '';

      var kinds = uniq(function (p) { return p.kind; });
      if (kinds.length > 1) {
        html += '<div class="fgroup"><span class="fg-title">Property type</span>' +
          kinds.map(function (k) {
            return '<label class="fopt"><input type="checkbox" data-facet="kinds" value="' + esc(k.value) + '">' +
              '<span>' + esc(KIND_LABEL[k.value] || k.value) + '</span><span class="count">' + k.count + '</span></label>';
          }).join('') + '</div>';
      }

      var bhks = uniq(function (p) { return p.bhk; }).sort(function (a, b) { return a.value - b.value; });
      if (bhks.length > 1) {
        html += '<div class="fgroup"><span class="fg-title">Bedrooms</span>' +
          bhks.map(function (b) {
            return '<label class="fopt"><input type="checkbox" data-facet="bhk" value="' + esc(b.value) + '">' +
              '<span>' + esc(b.value) + ' BHK</span><span class="count">' + b.count + '</span></label>';
          }).join('') + '</div>';
      }

      var locs = uniq(function (p) { return p.locality; });
      if (locs.length > 1) {
        html += '<div class="fgroup"><span class="fg-title">Locality</span>' +
          locs.map(function (l) {
            return '<label class="fopt"><input type="checkbox" data-facet="localities" value="' + esc(l.value) + '">' +
              '<span>' + esc(l.value) + '</span><span class="count">' + l.count + '</span></label>';
          }).join('') + '</div>';
      }

      var bands = scope.purpose === 'rent'
        ? [['0-25000', 'Under ₹25,000'], ['25000-50000', '₹25,000 – ₹50,000'], ['50000-100000', '₹50,000 – ₹1 Lakh'], ['100000-', 'Above ₹1 Lakh']]
        : [['0-10000000', 'Under ₹1 Cr'], ['10000000-25000000', '₹1 Cr – ₹2.5 Cr'], ['25000000-50000000', '₹2.5 Cr – ₹5 Cr'], ['50000000-', 'Above ₹5 Cr']];
      html += '<div class="fgroup"><span class="fg-title">' + (scope.purpose === 'rent' ? 'Monthly rent' : 'Budget') + '</span>' +
        bands.map(function (b) {
          return '<label class="fopt"><input type="radio" name="priceBand" data-facet="price" value="' + b[0] + '">' +
            '<span>' + b[1] + '</span></label>';
        }).join('') + '</div>';

      panel.innerHTML = html;

      // reflect any filters that arrived in the URL
      $$('input[data-facet]', panel).forEach(function (input) {
        var facet = input.getAttribute('data-facet');
        if (facet === 'price') input.checked = state.price === input.value;
        else if (state[facet] && state[facet].indexOf(input.value) > -1) input.checked = true;

        input.addEventListener('change', function () {
          if (facet === 'price') state.price = input.checked ? input.value : '';
          else {
            var arr = state[facet];
            var i = arr.indexOf(input.value);
            if (input.checked && i < 0) arr.push(input.value);
            if (!input.checked && i > -1) arr.splice(i, 1);
          }
          state.page = 1;
          render();
        });
      });
    }

    /* ---- filter + sort ------------------------------------------------ */
    function matches(p) {
      if (state.kinds.length && state.kinds.indexOf(p.kind) < 0) return false;
      if (state.localities.length && state.localities.indexOf(p.locality) < 0) return false;
      if (state.bhk.length && state.bhk.indexOf(String(p.bhk)) < 0) return false;
      if (state.price) {
        var parts = state.price.split('-');
        var lo = parts[0] ? +parts[0] : 0;
        var hi = parts[1] ? +parts[1] : Infinity;
        if (p.price < lo || p.price > hi) return false;
      }
      return true;
    }

    function sortList(list) {
      var s = state.sort;
      var out = list.slice();
      if (s === 'price-asc')  out.sort(function (a, b) { return a.price - b.price; });
      if (s === 'price-desc') out.sort(function (a, b) { return b.price - a.price; });
      if (s === 'area-desc')  out.sort(function (a, b) { return b.sqft - a.sqft; });
      if (s === 'featured')   out.sort(function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
      return out;
    }

    /* ---- active filter pills ------------------------------------------ */
    function drawActive() {
      if (!elActive) return;
      var pills = [];
      state.kinds.forEach(function (v) { pills.push(['kinds', v, KIND_LABEL[v] || v]); });
      state.bhk.forEach(function (v) { pills.push(['bhk', v, v + ' BHK']); });
      state.localities.forEach(function (v) { pills.push(['localities', v, v]); });
      if (state.price) pills.push(['price', state.price, scope.purpose === 'rent' ? 'Rent band' : 'Budget band']);

      elActive.innerHTML = pills.map(function (p) {
        return '<span class="afilter">' + esc(p[2]) +
          '<button type="button" data-facet="' + p[0] + '" data-value="' + esc(p[1]) + '" aria-label="Remove filter">' +
          '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M6 6l12 12M18 6 6 18"/></svg></button></span>';
      }).join('') + (pills.length > 1 ? '<button class="chip" id="clearAll" type="button">Clear all</button>' : '');

      $$('button[data-facet]', elActive).forEach(function (b) {
        b.addEventListener('click', function () {
          var f = b.getAttribute('data-facet'), v = b.getAttribute('data-value');
          if (f === 'price') state.price = '';
          else state[f] = state[f].filter(function (x) { return x !== v; });
          state.page = 1;
          syncInputs(); render();
        });
      });
      var clear = $('#clearAll', elActive);
      if (clear) clear.addEventListener('click', function () {
        state.kinds = []; state.bhk = []; state.localities = []; state.price = ''; state.page = 1;
        syncInputs(); render();
      });
    }

    function syncInputs() {
      $$('#filterGroups input[data-facet]').forEach(function (input) {
        var facet = input.getAttribute('data-facet');
        if (facet === 'price') input.checked = state.price === input.value;
        else input.checked = (state[facet] || []).indexOf(input.value) > -1;
      });
    }

    /* ---- pagination ---------------------------------------------------- */
    function drawPager(total) {
      if (!elPager) return;
      var pages = Math.ceil(total / state.perPage);
      if (pages <= 1) { elPager.innerHTML = ''; return; }
      var html = '<button type="button" data-go="prev"' + (state.page === 1 ? ' disabled' : '') + '>Previous</button>';
      for (var i = 1; i <= pages; i++) {
        html += '<button type="button" data-go="' + i + '" class="' + (i === state.page ? 'is-on' : '') + '">' + i + '</button>';
      }
      html += '<button type="button" data-go="next"' + (state.page === pages ? ' disabled' : '') + '>Next</button>';
      elPager.innerHTML = html;

      $$('button[data-go]', elPager).forEach(function (b) {
        b.addEventListener('click', function () {
          var go = b.getAttribute('data-go');
          if (go === 'prev') state.page = Math.max(1, state.page - 1);
          else if (go === 'next') state.page = Math.min(pages, state.page + 1);
          else state.page = +go;
          render();
          var top = $('.results-bar');
          if (top) window.scrollTo({ top: top.getBoundingClientRect().top + window.scrollY - 110, behavior: reduceMotion() ? 'auto' : 'smooth' });
        });
      });
    }

    /* ---- render -------------------------------------------------------- */
    function render() {
      var list = sortList(base.filter(matches));
      var total = list.length;
      var start = (state.page - 1) * state.perPage;
      var slice = list.slice(start, start + state.perPage);

      if (elCount) {
        elCount.innerHTML = total
          ? total + ' propert' + (total === 1 ? 'y' : 'ies') + ' <span>· showing ' + (start + 1) + '–' + Math.min(start + state.perPage, total) + '</span>'
          : 'No properties match those filters';
      }

      if (!total) {
        elGrid.className = '';
        elGrid.innerHTML =
          '<div class="empty-state">' +
            '<h3>Nothing matches those filters yet</h3>' +
            '<p>This page shows demo inventory, so the combination you picked may simply not exist in the sample set. Tell us what you are looking for and we will send matching options from live inventory.</p>' +
            '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
              '<a class="btn btn--primary" href="contact.html">Send your requirement</a>' +
              '<button class="btn btn--ghost" type="button" id="resetAll">Clear all filters</button>' +
            '</div>' +
          '</div>';
        var r = $('#resetAll');
        if (r) r.addEventListener('click', function () {
          state.kinds = []; state.bhk = []; state.localities = []; state.price = ''; state.page = 1;
          syncInputs(); render();
        });
      } else {
        elGrid.className = state.view === 'list' ? 'prop-list' : 'prop-grid prop-grid--2';
        if (state.view === 'list') elGrid.style.display = 'grid', elGrid.style.gap = '18px';
        else elGrid.style.display = '', elGrid.style.gap = '';
        elGrid.innerHTML = slice.map(state.view === 'list' ? cards.row : cards.card).join('');
        $$('.reveal', elGrid).forEach(function (n) { n.classList.add('is-in'); });
        bindFavs(elGrid);
      }

      drawActive();
      drawPager(total);
    }

    /* ---- tools --------------------------------------------------------- */
    var sortSel = $('#sortBy');
    if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; state.page = 1; render(); });

    $$('.view-toggle button').forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.view-toggle button').forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        state.view = b.getAttribute('data-view');
        render();
      });
    });

    var ftoggle = $('#filtersToggle'), fpanel = $('#filtersPanel');
    if (ftoggle && fpanel) {
      ftoggle.addEventListener('click', function () {
        var open = fpanel.classList.toggle('is-open');
        ftoggle.setAttribute('aria-expanded', String(open));
      });
    }

    buildFilters();
    render();
  }

  /* ======================================================================
     PROPERTY DETAIL
     ====================================================================== */
  function detail() {
    var root = $('#detailRoot');
    if (!root) return;

    var id = params().id;
    var p = (DATA.properties || []).filter(function (x) { return x.id === id; })[0];

    if (!p) {
      root.innerHTML =
        '<div class="empty-state" style="margin-block:40px">' +
          '<h3>That listing is not available</h3>' +
          '<p>The property you followed may have been sold, rented or removed. Browse what is currently listed, or tell us what you are looking for.</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap">' +
            '<a class="btn btn--primary" href="buy.html">Browse properties</a>' +
            '<a class="btn btn--ghost" href="contact.html">Send a requirement</a>' +
          '</div>' +
        '</div>';
      return;
    }

    document.title = p.title + ' — ' + (BIZ.name || 'Avenue Properties');
    var crumb = $('#detailCrumb');
    if (crumb) crumb.textContent = p.locality + ' · ' + (KIND_LABEL[p.kind] || p.kind);

    var msg = 'Hi ' + (BIZ.name || '') + ', I would like details and a site visit for: ' + p.title + ' (' + p.locality + ', ' + p.priceLabel + ').';
    var badge = p.demo && CFG.demoMode !== false
      ? '<p class="note" style="margin-top:22px">' + I.info + '<span><strong>Sample listing.</strong> This is demo content used to show the detail page layout. It is not live inventory and nothing here is a verified offer.</span></p>' : '';

    root.innerHTML =
      '<div class="detail">' +
        '<div>' +
          '<div class="gallery">' + p.images.map(function (src, i) {
            return '<div class="media"><img ' + (i ? 'loading="lazy" ' : '') + 'src="' + esc(src) + '" alt="' + esc(p.title) + ' — photo ' + (i + 1) + '"></div>';
          }).join('') + '</div>' +

          '<div class="detail-head">' +
            '<div class="prop-badges-l">' +
              (p.purpose === 'rent' ? '<span class="tag tag--green">For rent</span>' : '<span class="tag tag--type">For sale</span>') +
              '<span class="tag tag--type">' + esc(KIND_LABEL[p.kind] || p.kind) + '</span>' +
              '<span class="tag tag--type">' + esc(p.status) + '</span>' +
            '</div>' +
            '<h1>' + esc(p.title) + '</h1>' +
            '<p class="prop-loc" style="font-size:15.5px">' + I.pin + ' ' + esc(p.locality) + ', ' + esc(p.area) + '</p>' +
            '<div class="detail-price"><b>' + esc(p.priceLabel) + '</b><span>' + esc(p.priceSuffix) + '</span></div>' +
          '</div>' +

          '<ul class="spec-grid">' +
            [['Configuration', p.bhk ? p.bhk + ' BHK' : (KIND_LABEL[p.kind] || '—')],
             ['Area', p.sqftLabel],
             ['Facing', p.facing],
             ['Floor', p.floor],
             ['Parking', p.parking],
             ['Furnishing', p.furnishing],
             ['Possession', p.possession],
             ['Age', p.ageOfProperty]].map(function (s) {
              return '<li><span class="k">' + esc(s[0]) + '</span><span class="v">' + esc(s[1] || '—') + '</span></li>';
            }).join('') +
          '</ul>' +

          '<div class="detail-block"><h2>About this property</h2><p>' + esc(p.desc) + '</p></div>' +

          '<div class="detail-block"><h2>Highlights</h2><ul class="amenities">' +
            p.highlights.map(function (h) {
              return '<li>' + I.check + '<span>' + esc(h) + '</span></li>';
            }).join('') + '</ul></div>' +

          '<div class="detail-block"><h2>Amenities</h2><ul class="amenities">' +
            p.amenities.map(function (a) {
              return '<li>' + I.check + '<span>' + esc(a) + '</span></li>';
            }).join('') + '</ul></div>' +

          badge +
        '</div>' +

        '<aside class="detail-aside">' +
          '<div class="agent-card">' +
            '<div class="agent-meta">' +
              '<span class="brand-mark" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.6V20h13V9.6"/><path d="M10 20v-5.5h4V20"/></svg></span>' +
              '<span><strong>' + esc(BIZ.name || '') + '</strong><span>' + esc(BIZ.locality || '') + ' · open all days, 10 AM – 8 PM</span></span>' +
            '</div>' +
            '<h2>Arrange a site visit</h2>' +
            '<form id="detailForm" novalidate>' +
              '<div class="form-grid">' +
                '<div class="f span-2"><label for="dName">Your name <span class="req">*</span></label><input id="dName" type="text" autocomplete="name" placeholder="Your name" required><span class="err">Please enter your name.</span></div>' +
                '<div class="f span-2"><label for="dPhone">Phone number <span class="req">*</span></label><input id="dPhone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile number" required><span class="err">Please enter a valid 10-digit mobile number.</span></div>' +
                '<div class="f span-2"><label for="dMsg">Message</label><textarea id="dMsg" style="min-height:76px">I would like to see this property.</textarea></div>' +
                '<label class="consent span-2" for="dConsent"><input id="dConsent" type="checkbox" required><span>I agree to be contacted about this property.</span></label>' +
                '<div class="span-2"><button class="btn btn--primary btn--block" type="submit">Request a visit</button></div>' +
              '</div>' +
            '</form>' +
            '<div class="form-ok" id="detailOk" role="status">' + I.check +
              '<span><strong>Request noted.</strong> <span class="ok-detail"></span></span></div>' +
            '<div style="display:grid;gap:9px">' +
              '<a class="btn btn--wa btn--block" href="' + esc(waLink(msg)) + '" target="_blank" rel="noopener">' + I.wa + ' Ask on WhatsApp</a>' +
              '<a class="btn btn--ghost btn--block" href="' + esc(telLink()) + '">Call ' + esc(BIZ.phoneDisplay || '') + '</a>' +
            '</div>' +
          '</div>' +
        '</aside>' +
      '</div>';

    forms.bind($('#detailForm'), {
      fields: { name: '#dName', phone: '#dPhone', message: '#dMsg', consent: '#dConsent' },
      okBox: '#detailOk',
      extra: { property: p.title + ' — ' + p.locality + ' (' + p.priceLabel + ')', intent: 'Site visit request' }
    });

    // similar properties
    var simWrap = $('#similarGrid');
    if (simWrap) {
      var sim = (DATA.properties || []).filter(function (x) {
        return x.id !== p.id && x.segment === p.segment && x.purpose === p.purpose;
      }).slice(0, 3);
      simWrap.innerHTML = sim.map(cards.card).join('');
      $$('.reveal', simWrap).forEach(function (n) { n.classList.add('is-in'); });
      bindFavs(simWrap);
    }
  }

  /* ======================================================================
     TESTIMONIAL CAROUSEL
     ====================================================================== */
  function carousel() {
    var track = $('#quoteTrack');
    if (!track) return;

    track.innerHTML = (DATA.testimonials || []).map(function (t, i) {
      return '<figure class="quote-card' + (i === 0 ? ' is-on' : '') + '">' +
        '<span class="quote-mark" aria-hidden="true">&ldquo;</span>' +
        '<blockquote>' + esc(t.quote) + '</blockquote>' +
        '<figcaption class="quote-foot">' +
          '<img loading="lazy" src="' + esc(t.avatar) + '" alt="">' +
          '<span class="quote-who"><strong>' + esc(t.name) + '</strong><span>' + esc(t.role) + '</span></span>' +
        '</figcaption></figure>';
    }).join('');

    var slides = $$('.quote-card', track);
    var dotsWrap = $('#qDots');
    var at = 0, timer = null;
    if (!slides.length || !dotsWrap) return;

    slides.forEach(function (_, i) {
      var d = el('button', { class: 'q-dot' + (i === 0 ? ' is-on' : ''), type: 'button',
                             'aria-label': 'Testimonial ' + (i + 1) + ' of ' + slides.length });
      d.addEventListener('click', function () { go(i, true); });
      dotsWrap.appendChild(d);
    });
    var dots = $$('.q-dot', dotsWrap);

    function go(i, manual) {
      at = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-on', n === at); });
      dots.forEach(function (d, n) { d.classList.toggle('is-on', n === at); });
      if (manual) restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (reduceMotion()) return;
      timer = setInterval(function () { go(at + 1); }, 7000);
    }
    var prev = $('#qPrev'), next = $('#qNext');
    if (prev) prev.addEventListener('click', function () { go(at - 1, true); });
    if (next) next.addEventListener('click', function () { go(at + 1, true); });
    restart();
  }

  /* ======================================================================
     FORMS
     ====================================================================== */
  var forms = {
    bind: function (form, opts) {
      if (!form) return;
      opts = opts || {};
      var F = opts.fields || {};
      var okBox = opts.okBox ? $(opts.okBox) : null;

      function node(sel) { return sel ? $(sel, document) : null; }
      function setBad(input, bad) {
        if (!input) return;
        var wrap = input.closest('.f');
        if (wrap) wrap.classList.toggle('is-bad', bad);
      }

      ['name', 'phone', 'email'].forEach(function (k) {
        var n = node(F[k]);
        if (n) n.addEventListener('input', function () { setBad(n, false); });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = node(F.name), phone = node(F.phone), consent = node(F.consent);
        var digits = phone ? phone.value.replace(/\D/g, '') : '';
        var nameBad = name ? name.value.trim().length < 2 : false;
        var phoneBad = phone ? !(digits.length === 10 || (digits.length === 12 && digits.indexOf('91') === 0)) : false;

        setBad(name, nameBad);
        setBad(phone, phoneBad);
        if (nameBad) { name.focus(); return; }
        if (phoneBad) { phone.focus(); return; }
        if (consent && !consent.checked) { consent.focus(); toast('Please tick the consent box so we may contact you.', 'warn'); return; }

        var payload = Object.assign({
          name: name ? name.value.trim() : '',
          phone: phone ? phone.value.trim() : '',
          email: node(F.email) ? node(F.email).value.trim() : '',
          intent: node(F.intent) ? node(F.intent).value : '',
          budget: node(F.budget) ? node(F.budget).value : '',
          area: node(F.area) ? node(F.area).value.trim() : '',
          message: node(F.message) ? node(F.message).value.trim() : ''
        }, opts.extra || {});

        var btn = $('button[type="submit"]', form);
        var label = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

        alerts.send('enquiry', payload).then(function (res) {
          if (btn) { btn.disabled = false; btn.innerHTML = label; }
          form.reset();

          var live = res && res.sent && res.sent.length;
          if (okBox) {
            var detailSpan = $('.ok-detail', okBox);
            var txt = live
              ? 'We have your details and will call back within working hours (' + (BIZ.hours || '') + ').'
              : 'Alerts are not connected yet, so this enquiry was saved in this browser only — see setup.html. Connect a channel in config.js and it will reach the phone instantly.';
            if (detailSpan) detailSpan.textContent = txt;
            else okBox.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m4 12 5.5 5.5L20 7"/></svg><span><strong>Enquiry received.</strong> ' + esc(txt) + '</span>';
            okBox.classList.add('is-on');
            okBox.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'nearest' });
          }
          toast(live ? 'Enquiry sent. We will call you back.' : 'Enquiry saved. Connect an alert channel to receive it instantly.', live ? 'ok' : 'warn', 5200);
        });
      });
    },

    initPageForms: function () {
      forms.bind($('#enquiryForm'), {
        fields: { name: '#fName', phone: '#fPhone', email: '#fEmail', intent: '#fIntent',
                  budget: '#fBudget', area: '#fArea', message: '#fMsg', consent: '#fConsent' },
        okBox: '#formOk'
      });
      forms.bind($('#listForm'), {
        fields: { name: '#lName', phone: '#lPhone', intent: '#lIntent', area: '#lArea', message: '#lMsg', consent: '#lConsent' },
        okBox: '#listOk',
        extra: { intent: 'List a property' }
      });
    }
  };

  /* ======================================================================
     GOOGLE REVIEWS  —  feature 2
     ====================================================================== */
  var reviews = (function () {
    var G = CFG.google || {};

    function starsHtml(rating, size) {
      var out = '<span class="gr-stars" aria-label="' + rating + ' out of 5">';
      for (var i = 1; i <= 5; i++) {
        out += I.star.replace('<svg', '<svg class="' + (i <= Math.round(rating) ? 'on' : '') + '"' + (size ? ' width="' + size + '" height="' + size + '"' : ''));
      }
      return out + '</span>';
    }

    function writeReviewUrl() {
      if (G.placeId) return 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(G.placeId);
      return G.profileUrl || '';
    }

    function seeAllUrl() {
      if (G.profileUrl) return G.profileUrl;
      if (G.placeId) return 'https://www.google.com/maps/place/?q=place_id:' + encodeURIComponent(G.placeId);
      return 'https://www.google.com/maps/search/' + encodeURIComponent((BIZ.name || '') + ' ' + (BIZ.locality || ''));
    }

    function render(data) {
      var sum = $('#grSummary'), list = $('#grList');
      if (!sum || !list) return;

      var isLive = !!data.live;
      var reviewsList = (data.reviews || []).filter(function (r) {
        return !G.minRatingToShow || r.rating >= G.minRatingToShow;
      }).slice(0, G.maxReviews || 6);

      // distribution across the reviews we can actually show
      var buckets = [0, 0, 0, 0, 0];
      reviewsList.forEach(function (r) { buckets[Math.min(4, Math.max(0, Math.round(r.rating) - 1))]++; });
      var maxB = Math.max.apply(null, buckets) || 1;

      var write = writeReviewUrl();

      sum.innerHTML =
        '<div class="gr-brandline">' + I.google + '<span>Google reviews</span></div>' +
        '<div class="gr-score"><b>' + (data.rating ? data.rating.toFixed(1) : '—') + '</b><span class="out">/ 5</span></div>' +
        starsHtml(data.rating || 0) +
        '<p class="gr-total">' + (data.total ? data.total.toLocaleString('en-IN') + ' Google review' + (data.total === 1 ? '' : 's') : 'Rating appears once reviews are live') +
          ' · <a href="' + esc(seeAllUrl()) + '" target="_blank" rel="noopener">See all on Google</a></p>' +
        '<div class="gr-bars" aria-hidden="true">' + [5, 4, 3, 2, 1].map(function (n) {
          var c = buckets[n - 1];
          return '<div class="gr-bar"><span>' + n + '</span><span class="track"><span class="fill" style="width:' + Math.round(c / maxB * 100) + '%"></span></span><span>' + c + '</span></div>';
        }).join('') + '</div>' +
        '<p class="gr-status' + (isLive ? ' is-live' : '') + '">' + esc(data.status) + '</p>' +
        '<div class="gr-actions">' +
          (write
            ? '<a class="btn btn--primary btn--block" href="' + esc(write) + '" target="_blank" rel="noopener">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
                'Write a Review</a>'
            : '<button class="btn btn--primary btn--block" type="button" disabled>Write a Review</button>') +
          '<a class="btn btn--ghost btn--block" href="' + esc(seeAllUrl()) + '" target="_blank" rel="noopener">Open on Google Maps</a>' +
        '</div>';

      list.innerHTML = '<div class="gr-track">' + reviewsList.map(function (r) {
        var initial = (r.author || '?').trim().charAt(0).toUpperCase();
        var avatar = r.photo
          ? '<img class="gr-avatar" src="' + esc(r.photo) + '" alt="" loading="lazy" referrerpolicy="no-referrer">'
          : '<span class="gr-avatar gr-avatar--letter">' + esc(initial) + '</span>';
        var text = String(r.text || '');
        var longText = text.length > 240;
        return '<article class="gr-card">' +
          '<div class="gr-card-top">' + avatar +
            '<span class="gr-who"><strong>' + esc(r.author) + '</strong><span>' + esc(r.time || '') + (r.sample ? ' · sample content' : '') + '</span></span>' +
          '</div>' +
          starsHtml(r.rating, 15) +
          '<p data-full="' + esc(text) + '">' + esc(longText ? text.slice(0, 240).trim() + '…' : text) + '</p>' +
          (longText ? '<button class="gr-more" type="button">Read more</button>' : '') +
        '</article>';
      }).join('') + '</div>' +
      '<div class="gr-foot">' +
        '<p class="gr-status">' + (isLive
          ? 'Live from Google. Google returns at most five reviews through its API and chooses which ones.'
          : 'Sample layout — these are not customer reviews.') + '</p>' +
        '<a class="btn btn--ghost btn--sm" href="' + esc(seeAllUrl()) + '" target="_blank" rel="noopener">Read every review on Google</a>' +
      '</div>';

      $$('.gr-more', list).forEach(function (b) {
        b.addEventListener('click', function () {
          var p = b.previousElementSibling;
          var open = b.textContent === 'Show less';
          p.textContent = open ? p.getAttribute('data-full').slice(0, 240).trim() + '…' : p.getAttribute('data-full');
          b.textContent = open ? 'Read more' : 'Show less';
        });
      });
    }

    function fallback(reason) {
      var manual = (G.manualReviews && G.manualReviews.length) ? G.manualReviews : (DATA.sampleGoogleReviews || []);
      var avg = manual.length ? manual.reduce(function (s, r) { return s + (r.rating || 0); }, 0) / manual.length : 0;
      render({
        live: false,
        rating: avg,
        total: (G.manualReviews && G.manualReviews.length) ? G.manualReviews.length : 0,
        reviews: manual,
        status: reason
      });
    }

    function loadLive() {
      return new Promise(function (resolve, reject) {
        if (window.google && window.google.maps && window.google.maps.importLibrary) return resolve();
        var s = document.createElement('script');
        s.async = true;
        s.src = 'https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(G.apiKey) +
                '&libraries=places&v=weekly&loading=async';
        s.onload = resolve;
        s.onerror = function () { reject(new Error('script')); };
        document.head.appendChild(s);
      }).then(function () {
        return google.maps.importLibrary('places');
      }).then(function (lib) {
        var place = new lib.Place({ id: G.placeId });
        return place.fetchFields({ fields: ['rating', 'userRatingCount', 'reviews', 'displayName', 'googleMapsURI'] })
          .then(function () { return place; });
      }).then(function (place) {
        var list = (place.reviews || []).map(function (r) {
          var a = r.authorAttribution || {};
          return {
            author: a.displayName || 'Google user',
            photo: a.photoURI || '',
            rating: r.rating || 0,
            time: r.relativePublishTimeDescription || '',
            text: (r.text && r.text.text) ? r.text.text : (r.text || '')
          };
        });
        if (place.googleMapsURI && !G.profileUrl) G.profileUrl = place.googleMapsURI;
        render({
          live: true,
          rating: place.rating || 0,
          total: place.userRatingCount || 0,
          reviews: list,
          status: 'Connected to the Google Business Profile — updates automatically.'
        });
      });
    }

    function init() {
      if (!$('#grSummary')) return;

      if (!G.placeId || !G.apiKey) {
        fallback(!G.placeId && !G.apiKey
          ? 'Not connected yet. Add the Google Place ID and an API key in config.js to show live ratings here.'
          : (!G.placeId ? 'Add the Google Place ID in config.js to go live.' : 'Add a Places API key in config.js to go live.'));
        return;
      }

      loadLive().catch(function (err) {
        if (window.console) console.warn('[Avenue reviews] live fetch failed:', err && err.message);
        fallback('Could not reach Google just now — showing saved reviews. Check that the Places API is enabled and the key allows this domain.');
      });
    }

    return { init: init, writeReviewUrl: writeReviewUrl, seeAllUrl: seeAllUrl };
  })();

  /* ======================================================================
     BOOT
     ====================================================================== */
  function boot() {
    document.body.classList.remove('no-js');
    hydrate();
    header();
    homeBlocks();
    featured();
    listing();
    detail();
    carousel();
    searchConsole();
    forms.initPageForms();
    reviews.init();
    bindFavs(document);
    reveal();
    alerts.visitPing();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  return {
    util: util, cfg: CFG, data: DATA, icons: I,
    toast: toast, alerts: alerts, reviews: reviews, forms: forms,
    shortlist: shortlist, cards: cards
  };
})();
