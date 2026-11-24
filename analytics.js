(function () {
  'use strict';

  const CONFIG = {
    GA4_MEASUREMENT_ID: '',
    CLARITY_PROJECT_ID: '',
    UTM_SESSION_KEY: 'k1_utm',
    KPI_STORAGE_KEY: 'k1_kpi_metrics_v1',
    MAX_RECENT_EVENTS: 100
  };

  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const FUNNEL_EVENTS = [
    'page_view',
    'qr_visit',
    'packaging_view_switch',
    'qr_preview_switch',
    'preorder_submit',
    'b2b_submit',
    'qr_recipe_open',
    'youtube_extract',
    'youtube_save_to_feed'
  ];

  let ga4Loaded = false;
  let clarityLoaded = false;

  /* ---------- Safe Storage Helpers ---------- */
  function readStorage(store, key, fallback) {
    try {
      const raw = store.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeStorage(store, key, value) {
    try {
      store.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore storage quota or privacy-mode errors
    }
  }

  /* ---------- UTM & Attribution Capture ---------- */
  function captureAttribution() {
    const existing = readStorage(window.sessionStorage, CONFIG.UTM_SESSION_KEY, null);
    const params = new URLSearchParams(window.location.search || '');
    const fromUrl = {};
    let hasUrlUtm = false;

    UTM_KEYS.forEach(k => {
      const val = (params.get(k) || '').trim();
      if (val) {
        fromUrl[k] = val;
        hasUrlUtm = true;
      }
    });

    const base = existing || {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_content: '',
      referrer: document.referrer || '',
      first_page_url: window.location.href
    };

    if (hasUrlUtm) {
      UTM_KEYS.forEach(k => {
        if (fromUrl[k]) base[k] = fromUrl[k];
      });
    }

    if (!base.referrer && document.referrer) {
      base.referrer = document.referrer;
    }

    writeStorage(window.sessionStorage, CONFIG.UTM_SESSION_KEY, base);
    return base;
  }

  function getAttribution() {
    const saved = readStorage(window.sessionStorage, CONFIG.UTM_SESSION_KEY, null) || captureAttribution();
    return {
      utm_source: saved.utm_source || '',
      utm_medium: saved.utm_medium || '',
      utm_campaign: saved.utm_campaign || '',
      utm_content: saved.utm_content || '',
      referrer: saved.referrer || document.referrer || '',
      page_url: window.location.href
    };
  }

  function detectQrVisit(attr) {
    const a = attr || getAttribution();
    const src = (a.utm_source || '').toLowerCase();
    const med = (a.utm_medium || '').toLowerCase();
    const hash = window.location.hash || '';
    const isRecipeHash = /^#\/recipe\/.+/.test(hash);
    const isQrParam = src === 'qr' || src.startsWith('qr_') || src.startsWith('qr-') || med === 'qr';
    return {
      isQr: isQrParam || isRecipeHash,
      reason: isQrParam ? 'utm_qr' : (isRecipeHash ? 'recipe_hash_landing' : ''),
      recipeId: isRecipeHash ? decodeURIComponent(hash.replace(/^#\/recipe\//, '')) : ''
    };
  }

  /* ---------- Optional Third-Party Analytics Injection ---------- */
  function initGA4() {
    const id = (CONFIG.GA4_MEASUREMENT_ID || '').trim();
    if (!id || ga4Loaded) return;
    ga4Loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { send_page_view: false });

    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  }

  function initClarity() {
    const id = (CONFIG.CLARITY_PROJECT_ID || '').trim();
    if (!id || clarityLoaded) return;
    clarityLoaded = true;

    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${encodeURIComponent(id)}`;
    document.head.appendChild(s);
  }

  /* ---------- Local KPI Telemetry Store ---------- */
  function loadKpiState() {
    const now = new Date().toISOString();
    const state = readStorage(window.localStorage, CONFIG.KPI_STORAGE_KEY, null);
    if (state && typeof state === 'object' && state.counts) {
      return state;
    }
    const counts = {};
    FUNNEL_EVENTS.forEach(ev => { counts[ev] = 0; });
    return {
      version: 1,
      firstSeenAt: now,
      updatedAt: now,
      counts,
      lastTimestamps: {},
      recent: []
    };
  }

  function recordLocalEvent(eventName, params) {
    const now = new Date().toISOString();
    const state = loadKpiState();
    state.counts[eventName] = (state.counts[eventName] || 0) + 1;
    state.lastTimestamps[eventName] = now;
    state.updatedAt = now;
    if (!Array.isArray(state.recent)) state.recent = [];
    state.recent.push({
      event: eventName,
      timestamp: now,
      params: params || {}
    });
    if (state.recent.length > CONFIG.MAX_RECENT_EVENTS) {
      state.recent = state.recent.slice(state.recent.length - CONFIG.MAX_RECENT_EVENTS);
    }
    writeStorage(window.localStorage, CONFIG.KPI_STORAGE_KEY, state);
    return state;
  }

  /* ---------- Public Track API ---------- */
  function track(eventName, params) {
    if (!eventName) return;
    const attr = getAttribution();
    const payload = Object.assign(
      {
        utm_source: attr.utm_source,
        utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign,
        utm_content: attr.utm_content,
        page_path: window.location.pathname
      },
      params || {}
    );

    recordLocalEvent(eventName, payload);

    if (ga4Loaded && typeof window.gtag === 'function') {
      try {
        window.gtag('event', eventName, payload);
      } catch {
        // Ignore gtag invocation errors
      }
    }
  }

  function pct(num, den) {
    if (!den) return '0.0%';
    return `${((num / den) * 100).toFixed(1)}%`;
  }

  function exportKpiSummary() {
    const state = loadKpiState();
    const c = state.counts || {};
    const pageViews = c.page_view || 0;
    const preorders = c.preorder_submit || 0;
    const b2b = c.b2b_submit || 0;
    const ytExtracts = c.youtube_extract || 0;
    const ytSaves = c.youtube_save_to_feed || 0;

    return {
      generatedAt: new Date().toISOString(),
      firstSeenAt: state.firstSeenAt,
      updatedAt: state.updatedAt,
      attribution: getAttribution(),
      counts: Object.assign(
        FUNNEL_EVENTS.reduce((acc, k) => { acc[k] = 0; return acc; }, {}),
        c
      ),
      funnel: {
        preorderConversionRate: pct(preorders, pageViews),
        b2bConversionRate: pct(b2b, pageViews),
        youtubeSaveRate: pct(ytSaves, ytExtracts)
      },
      lastTimestamps: state.lastTimestamps || {},
      recentEvents: Array.isArray(state.recent) ? state.recent.slice(-20) : []
    };
  }

  /* ---------- Boot ---------- */
  const initialAttr = captureAttribution();
  const qrInfo = detectQrVisit(initialAttr);

  initGA4();
  initClarity();

  track('page_view', {
    page_title: document.title || '',
    page_location: window.location.href,
    is_qr_visit: qrInfo.isQr
  });

  if (qrInfo.isQr) {
    track('qr_visit', {
      reason: qrInfo.reason,
      recipe_id: qrInfo.recipeId
    });
  }

  window.K1Analytics = {
    CONFIG,
    getAttribution,
    isQrVisit: () => detectQrVisit().isQr,
    track,
    exportKpiSummary,
    init: function () {
      initGA4();
      initClarity();
    }
  };
})();
