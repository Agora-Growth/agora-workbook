/*! Agora Growth · Workbook del Sistema de Ingresos™ · v1.8
 *  Se monta dentro de <div id="ag-wb"></div>. window.AG_WB_CONFIG = { endpoint, mode: 'participant' | 'admin' }.
 */
(function () {
  'use strict';

  /* ===================== CONFIGURACIÓN ===================== */
  const DEFAULTS = {
    mountId: 'ag-wb',
    mode: 'participant',
    endpoint: '',
    workbookUrl: 'https://www.agoragrowth.com/sprint-ejecutivo-workbook',
    assetsBase: 'https://cdn.jsdelivr.net/gh/Agora-Growth/agora-workbook@v1.8/',
    libs: { jspdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js' },
    fontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=DM+Serif+Display&display=swap'
  };
  function merge(a, b) {
    const out = Object.assign({}, a);
    Object.keys(b || {}).forEach((k) => {
      out[k] = (b[k] && typeof b[k] === 'object' && !Array.isArray(b[k]) && a[k] && typeof a[k] === 'object') ? merge(a[k], b[k]) : b[k];
    });
    return out;
  }
  // Las fuentes del PDF viven junto a este script (misma versión en jsDelivr).
  const SELF = document.currentScript && document.currentScript.src;
  if (SELF && /\/workbook(\.min)?\.js(\?|$)/.test(SELF)) DEFAULTS.assetsBase = SELF.replace(/[^/]*$/, '');
  const CFG = merge(DEFAULTS, window.AG_WB_CONFIG);
  const ADMIN = CFG.mode === 'admin';
  const LOGO_WHITE = 'data:image/png;base64,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';
  const LOGO_DARK = 'data:image/png;base64,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';
  const MAX_CHARS = 20000;

  // El contenido del workbook llega del servidor después de iniciar sesión.
  let CONTENT = null, BPS = [], SECTION_IDS = [], PLAN_IDS = [];
  function setContent(c) {
    if (!c || !c.blueprints) throw new Error('El servidor no envió el contenido del workbook. Revisa que el Apps Script esté actualizado.');
    CONTENT = c; BPS = c.blueprints;
    SECTION_IDS = []; BPS.forEach((bp) => bp.sections.forEach((s) => SECTION_IDS.push(s.id)));
    PLAN_IDS = []; c.plan.periods.forEach((p) => c.plan.fields.forEach((f) => PLAN_IDS.push('PLAN_' + p.id + '_' + f.id)));
  }

  /* ===================== UTILIDADES ===================== */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const first = (name) => String(name || '').trim().split(/\s+/)[0] || '';
  const slug = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  const filled = (v) => !!String(v == null ? '' : v).trim();
  const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MONTHS_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  function parseIso(iso) { const p = String(iso || '').split('-').map(Number); return p.length === 3 && p[0] ? new Date(p[0], p[1] - 1, p[2], 12) : null; }
  function addDays(d, n) { const x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function shortDate(d) { return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
  function longDate(d) { return d.getDate() + ' de ' + MONTHS_L[d.getMonth()] + ' de ' + d.getFullYear(); }
  function relTime(iso) {
    if (!iso) return '';
    const d = new Date(iso); if (isNaN(d)) return '';
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return 'hace un momento';
    if (s < 3600) return 'hace ' + Math.round(s / 60) + ' min';
    if (s < 86400) return 'hace ' + Math.round(s / 3600) + ' h';
    if (s < 172800) return 'ayer';
    if (s < 604800) return 'hace ' + Math.round(s / 86400) + ' días';
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  /* ---------- Sesiones en vivo: siempre en hora de la Ciudad de México ---------- */
  const MX_TZ = 'America/Mexico_City';
  const pad2 = (n) => ('0' + n).slice(-2);
  // Minutos que hay que sumar a UTC para obtener la hora de CDMX en ese instante.
  function mxOffsetMin(ms) {
    try {
      const p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: MX_TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        .formatToParts(new Date(ms)).forEach((x) => { p[x.type] = x.value; });
      return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - ms) / 60000);
    } catch (e) { return -360; }
  }
  function mxMs(iso, hhmm) {
    const d = String(iso || '').split('-').map(Number), t = String(hhmm || '00:00').split(':').map(Number);
    if (d.length !== 3 || !d[0]) return null;
    const guess = Date.UTC(d[0], d[1] - 1, d[2], t[0] || 0, t[1] || 0);
    return guess - mxOffsetMin(guess) * 60000;
  }
  function mxToday() { const x = new Date(Date.now() + mxOffsetMin(Date.now()) * 60000); return x.getUTCFullYear() + '-' + pad2(x.getUTCMonth() + 1) + '-' + pad2(x.getUTCDate()); }
  function isoAdd(iso, n) { const d = parseIso(iso); if (!d) return ''; const x = addDays(d, n); return x.getFullYear() + '-' + pad2(x.getMonth() + 1) + '-' + pad2(x.getDate()); }
  function fmtTime(hhmm) {
    const m = String(hhmm || '').match(/^(\d{1,2}):(\d{2})$/); if (!m) return { t: '', ap: '' };
    const h = Number(m[1]);
    return { t: ((h % 12) || 12) + ':' + m[2], ap: h < 12 ? 'am' : 'pm' };
  }
  function fmtRange(start, end) {
    const a = fmtTime(start), b = fmtTime(end);
    if (!a.t) return '';
    if (!b.t) return a.t + ' ' + a.ap;
    return a.ap === b.ap ? a.t + ' – ' + b.t + ' ' + b.ap : a.t + ' ' + a.ap + ' – ' + b.t + ' ' + b.ap;
  }
  function dayLong(iso) { const d = parseIso(iso); return d ? DAYS[d.getDay()] + ' ' + d.getDate() + ' de ' + MONTHS_L[d.getMonth()] : ''; }
  const safeUrl = (u) => (/^https?:\/\/[^\s<>"']+$/i.test(String(u || '').trim()) ? String(u).trim() : '');
  // upcoming → soon (15 min antes) → live → ended. Sin hora de fin se asume 2 h.
  function sessionInfo(s, now) {
    if (!s || !s.date) return { state: 'tbd' };
    const start = mxMs(s.date, s.start || '00:00');
    const end = s.end ? mxMs(s.date, s.end) : start + (s.start ? 2 : 24) * 3600e3;
    const state = now > end ? 'ended' : now >= start ? 'live' : now >= start - 15 * 60e3 ? 'soon' : 'upcoming';
    return { state: state, start: start, end: end, today: s.date === mxToday() };
  }
  const SESSION_FALLBACK = [
    { title: 'Kick-off', day: 0, start: '08:00', end: '09:00' },
    { title: 'Taller en vivo · Blueprints 1–4', day: 3, start: '16:00', end: '19:00' },
    { title: 'Taller en vivo y cierre · Blueprints 5–8', day: 4, start: '16:00', end: '19:00' }
  ];

  const STORE_OK = (function () { try { window.localStorage.setItem('agwb:t', '1'); window.localStorage.removeItem('agwb:t'); return true; } catch (e) { return false; } })();
  const store = {
    get(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { } },
    del(k) { try { window.localStorage.removeItem(k); } catch (e) { } }
  };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const ex = document.querySelector('script[data-agwb-src="' + src + '"]');
      if (ex && ex.getAttribute('data-loaded')) return resolve();
      if (ex) { ex.addEventListener('load', () => resolve()); ex.addEventListener('error', () => reject(new Error('No se pudo cargar ' + src))); return; }
      const s = document.createElement('script');
      s.src = src; s.async = true; s.setAttribute('data-agwb-src', src);
      s.onload = () => { s.setAttribute('data-loaded', '1'); resolve(); };
      s.onerror = () => { s.remove(); reject(new Error('No se pudo cargar ' + src)); };
      document.head.appendChild(s);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.top = '-1000px';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy')); } catch (e) { reject(e); }
      ta.remove();
    });
  }

  const ICON = {
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/></svg>',
    eye: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    video: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10.5l6-3.5v10l-6-3.5"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/></svg>',
    alert: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7v6M12 16.5v.5"/></svg>',
    calc: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    sheet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>',
    slides: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8M12 18v4"/></svg>',
    link: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
    compass: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M16 8l-2.5 5.5L8 16l2.5-5.5z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>',
    lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    help: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6v.6M12 17h.01"/></svg>',
    send: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/><path d="M11.5 13.5L20 4"/></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v6h6"/><path d="M20 12a8 8 0 0 0-14.9-4L4 10M4 14a8 8 0 0 0 14.9 4"/></svg>',
    screen: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    building: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10"/><path d="M8 7h4M8 11h4M8 15h4M3 21h18"/></svg>',
    tour: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16"/></svg>'
  };

  /* ===================== ESTADO ===================== */
  const tokenKey = 'agwb:token:' + (ADMIN ? 'admin' : 'participant');
  const S = {
    token: store.get(tokenKey), me: null, answers: {}, pending: {}, saving: false, saveTimer: null, retry: 0, savedAt: null, materials: [], focusSection: null,
    cop: freshCop(), doubts: [], followup: [], facilitator: 'tu facilitador',
    admin: freshAdmin(),
    msg: '', busy: false
  };
  function freshCop() { return { state: null, thread: null, busy: false, applied: {}, doubtSent: {}, draft: '' }; }
  function freshAdmin() { return { me: null, cohorts: null, detail: {}, workbooks: {}, showPins: {}, addMode: 'one', lastAdd: null, filter: '', fc: {}, questions: {}, doubtFilter: 'pending', proj: null, settingsOpen: false }; }
  let root, view, toastEl, saveEl;

  /* ===================== API ===================== */
  async function api(action, data) {
    if (!CFG.endpoint) throw new Error('Falta configurar el endpoint del workbook.');
    const res = await fetch(CFG.endpoint, { method: 'POST', body: JSON.stringify(Object.assign({ action: action, token: S.token }, data || {})) });
    const out = await res.json();
    if (out && out.error === 'auth' && action !== 'login') {
      logout('Tu sesión terminó. Vuelve a entrar.');
      const err = new Error('auth'); err.code = 'auth'; throw err;
    }
    return out;
  }

  /* ===================== MONTAJE ===================== */
  function mount() {
    root = document.getElementById(CFG.mountId);
    if (!root || root.getAttribute('data-agwb-ready')) return;
    root.setAttribute('data-agwb-ready', '1');
    root.setAttribute('lang', 'es-MX');
    if (!document.getElementById('agwb-style')) {
      const st = document.createElement('style'); st.id = 'agwb-style'; st.textContent = CSS; document.head.appendChild(st);
    }
    if (CFG.fontsUrl && !document.querySelector('link[data-agwb-fonts]')) {
      const ln = document.createElement('link'); ln.rel = 'stylesheet'; ln.href = CFG.fontsUrl; ln.setAttribute('data-agwb-fonts', '1'); document.head.appendChild(ln);
    }
    root.innerHTML = '<div class="wb-view"></div><div class="wb-fab-slot"></div><div class="wb-tour-slot"></div><div class="wb-save" aria-live="polite"></div><div class="wb-toast" role="status" aria-live="polite"></div><div class="wb-layer"></div>';
    view = root.querySelector('.wb-view');
    saveEl = root.querySelector('.wb-save');
    toastEl = root.querySelector('.wb-toast');
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', (e) => { if (e.target.matches('select[data-calc]')) onInput(e); else if (e.target.hasAttribute('data-act-change')) onChange(e); });
    root.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', onKey);
    window.addEventListener('hashchange', () => { render(); scrollTop(); });
    window.addEventListener('pagehide', flushBeacon);
    window.addEventListener('beforeunload', (e) => { if (!ADMIN && Object.keys(S.pending).length && !STORE_OK) { e.preventDefault(); e.returnValue = ''; } });
    window.addEventListener('online', () => { if (Object.keys(S.pending).length) scheduleSave(200); });
    setInterval(tickCountdowns, 1000);
    setInterval(() => {   // "Por comenzar" / "En vivo" / "Terminada" cambian con la hora
      const el = view && view.querySelector('[data-sessions]');
      if (el && S.me && S.me.cohort) el.outerHTML = sessionsHtml(S.me.cohort.sessions);
    }, 60000);
    start();
  }

  async function start() {
    if (!S.token) return render();
    if (ADMIN) {
      renderLoading('Cargando el panel…');
      try {
        const me = await api('admin.me');
        if (!me.ok) throw new Error(me.error);
        setContent(me.content);
        S.admin.me = me; S.materials = me.materials || []; S.admin.settings = me.settings; S.admin.feedbackSheet = me.feedbackSheet;
      } catch (e) { if (e.code !== 'auth') return renderError(e); return; }
      return render();
    }
    await loadParticipant();
  }

  function route() {
    const h = location.hash.replace(/^#/, '');
    return h.indexOf('wb/') === 0 ? h.split('/') : ['wb', ADMIN ? 'cohortes' : 'inicio'];
  }
  function go(hash) { if (location.hash === '#' + hash) { render(); scrollTop(); } else location.hash = hash; }
  function scrollTop() {
    const r = root.getBoundingClientRect();
    if (r.top < 0) { try { root.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { root.scrollIntoView(); } }
  }

  function render() {
    renderView();
    updateFab();
  }
  function renderView() {
    if (!S.token) return renderLogin();
    if (ADMIN) return CONTENT ? renderAdmin() : renderLoading('Cargando el panel…');
    if (!S.me) return renderLoading('Cargando tu workbook…');
    const r = route();
    if (r[1] === 'bp' && BPS[Number(r[2]) - 1]) return renderBlueprint(Number(r[2]), r[3] || 'completa');
    if (r[1] === 'guia') return renderGuide(r[2]);
    if (r[1] === 'plan') return renderPlan();
    if (r[1] === 'biblioteca') return renderLibrary();
    if (r[1] === 'seguimiento') return renderFollowup(r[2]);
    if (r[1] === 'empresa') return renderCompany();
    return renderHome();
  }

  function show(html) { view.innerHTML = '<div class="wb-screen">' + html + '</div>'; autosizeAll(); }
  function renderLoading(text) { show('<div class="wb-center"><span class="wb-spin"></span><p>' + esc(text || 'Cargando…') + '</p></div>'); }
  function renderError(e) {
    show('<div class="wb-center"><p class="wb-h3">No pudimos cargar la información.</p><p class="wb-muted">' + esc(e && e.message || 'Revisa tu conexión.') +
      '</p><button class="wb-btn" data-act="reload">Intentar de nuevo</button></div>');
  }

  function toast(text) {
    toastEl.textContent = text; toastEl.classList.add('is-on');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  }

  /* ===================== LOGIN ===================== */
  function renderLogin() {
    show(
      '<div class="wb-login">' +
      '<img class="wb-login-logo" src="' + LOGO_DARK + '" alt="Agora Growth">' +
      '<span class="wb-pill">' + (ADMIN ? 'Panel de Agora' : 'Sprint Ejecutivo') + '</span>' +
      '<h1 class="wb-h1">' + (ADMIN ? 'Workbook · Admin' : 'Tu Workbook del <span>Sistema de Ingresos™</span>') + '</h1>' +
      '<p class="wb-lead">' + (ADMIN ? 'Entra con tu correo de Agora y tu PIN de admin.' : 'Entra con el correo y el PIN de 6 dígitos que te enviamos.') + '</p>' +
      (S.msg ? '<p class="wb-note">' + esc(S.msg) + '</p>' : '') +
      '<form class="wb-form" data-form="login" novalidate>' +
      '<label class="wb-field"><span>Correo</span><input class="wb-input" name="email" type="email" inputmode="email" autocomplete="username" required></label>' +
      '<label class="wb-field"><span>PIN</span><input class="wb-input wb-pin" name="pin" type="password" inputmode="numeric" autocomplete="current-password" maxlength="6" pattern="[0-9]*" required></label>' +
      '<p class="wb-err" data-err></p>' +
      '<button class="wb-btn wb-btn--full" type="submit" data-submit>Entrar</button>' +
      '</form>' +
      '<p class="wb-small">' + (ADMIN ? 'Tu PIN de admin está en la pestaña «Admins» del Sheet.' : '¿No encuentras tu PIN? Busca el correo «Tu acceso al Workbook del Sprint Ejecutivo» o pídeselo a tu coach de Agora.') + '</p>' +
      '</div>'
    );
    const inp = view.querySelector('input[name=email]');
    const touch = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
    if (inp && !touch) try { inp.focus({ preventScroll: true }); } catch (e) { }
  }

  async function doLogin(form) {
    const err = form.querySelector('[data-err]');
    const btn = form.querySelector('[data-submit]');
    const email = form.elements.email.value.trim();
    const pin = form.elements.pin.value.replace(/\D/g, '');
    err.textContent = '';
    if (!email || pin.length !== 6) { err.textContent = 'Escribe tu correo y tu PIN de 6 dígitos.'; return; }
    btn.disabled = true; btn.innerHTML = '<span class="wb-spin wb-spin--light"></span> Entrando…';
    try {
      const out = await api('login', { email: email, pin: pin, mode: ADMIN ? 'admin' : 'participant' });
      if (!out.ok) {
        err.textContent = out.error === 'locked' ? 'Demasiados intentos. Espera ' + (out.minutes || 15) + ' minutos y vuelve a intentar.' :
          'El correo o el PIN no coinciden.' + (out.left > 0 && out.left <= 2 ? ' Te quedan ' + out.left + ' intentos.' : '');
        btn.disabled = false; btn.textContent = 'Entrar'; return;
      }
      if (ADMIN && out.role !== 'admin') { err.textContent = 'Este acceso es solo para el equipo de Agora.'; btn.disabled = false; btn.textContent = 'Entrar'; return; }
      if (!ADMIN && out.role !== 'participant') { err.textContent = 'Ese es un acceso de admin: entra desde el panel de Agora.'; btn.disabled = false; btn.textContent = 'Entrar'; return; }
      S.token = out.token; S.msg = '';
      store.set(tokenKey, out.token);
      if (ADMIN) {
        const me = await api('admin.me');
        if (!me.ok) throw new Error(me.error);
        setContent(me.content); S.admin.me = me; S.materials = me.materials || []; S.admin.settings = me.settings; S.admin.feedbackSheet = me.feedbackSheet;
        if (location.hash.indexOf('#wb/') === 0) render(); else go('wb/cohortes');
      }
      else await loadParticipant();
    } catch (e) {
      err.textContent = 'No pudimos conectar. Revisa tu internet e intenta de nuevo.';
      btn.disabled = false; btn.textContent = 'Entrar';
    }
  }

  function logout(msg) {
    if (!ADMIN && Object.keys(S.pending).length) flushBeacon();
    clearTimeout(S.saveTimer);
    S.token = null; S.me = null; S.answers = {}; S.pending = {}; S.msg = msg || '';
    endTour();
    S.cop = freshCop(); S.doubts = []; S.followup = [];
    S.admin = freshAdmin();
    store.del(tokenKey);
    closeLayer();
    updateFab();
    saveEl.className = 'wb-save';
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    renderLogin();
  }

  /* ===================== PARTICIPANTE: DATOS Y GUARDADO ===================== */
  const pendingKey = () => 'agwb:pending:' + (S.me ? S.me.profile.id : '');

  async function loadParticipant() {
    renderLoading('Cargando tu workbook…');
    try {
      const out = await api('load');
      if (!out.ok) throw new Error('No pudimos abrir tu workbook (' + out.error + ').');
      setContent(out.content);
      S.me = { profile: out.profile, cohort: out.cohort };
      S.materials = out.materials || [];
      S.cop = freshCop(); S.cop.state = out.copilot || { mode: 'hidden' };
      S.doubts = out.doubts || []; S.followup = out.followup || []; S.facilitator = out.facilitator || 'tu facilitador';
      S.answers = out.answers || {};
      let local = null;
      try { local = JSON.parse(store.get(pendingKey()) || 'null'); } catch (e) { }
      if (local && typeof local === 'object' && Object.keys(local).length) {
        Object.assign(S.answers, local); S.pending = local; scheduleSave(300);
      }
      render();
    } catch (e) { if (e.code !== 'auth') renderError(e); }
  }

  function setAnswer(field, value) {
    S.answers[field] = value;
    S.pending[field] = value;
    store.set(pendingKey(), JSON.stringify(S.pending));
    setSave('pending');
    scheduleSave(1200);
  }

  function scheduleSave(ms) { clearTimeout(S.saveTimer); S.saveTimer = setTimeout(saveNow, ms); }

  async function saveNow() {
    if (S.saving) { scheduleSave(800); return; }
    const snapshot = Object.assign({}, S.pending);
    if (!Object.keys(snapshot).length) return;
    S.saving = true; setSave('saving');
    try {
      const out = await api('save', { changes: snapshot });
      if (!out.ok) throw new Error(out.error);
      Object.keys(snapshot).forEach((k) => { if (S.pending[k] === snapshot[k]) delete S.pending[k]; });
      if (Object.keys(S.pending).length) store.set(pendingKey(), JSON.stringify(S.pending)); else store.del(pendingKey());
      S.retry = 0; S.savedAt = new Date();
      setSave(Object.keys(S.pending).length ? 'pending' : 'saved');
      if (Object.keys(S.pending).length) scheduleSave(600);
    } catch (e) {
      if (e.code === 'auth') return;
      S.retry = Math.min(S.retry + 1, 6);
      setSave('offline');
      scheduleSave([2000, 4000, 8000, 15000, 30000, 30000][S.retry - 1] || 30000);
    } finally { S.saving = false; }
  }

  function flushBeacon() {
    if (ADMIN || !S.token || !Object.keys(S.pending).length || !navigator.sendBeacon || !CFG.endpoint) return;
    try { navigator.sendBeacon(CFG.endpoint, JSON.stringify({ action: 'save', token: S.token, changes: S.pending })); } catch (e) { }
  }

  function setSave(state) {
    const t = { pending: 'Cambios sin guardar…', saving: 'Guardando…', saved: 'Guardado', offline: 'Sin conexión · reintentando' }[state] || '';
    saveEl.className = 'wb-save is-on is-' + state;
    saveEl.innerHTML = (state === 'saved' ? ICON.check : '<span class="wb-dot"></span>') + '<span>' + t + '</span>';
    clearTimeout(saveEl._t);
    if (state === 'saved') saveEl._t = setTimeout(() => saveEl.classList.remove('is-on'), 2500);
  }

  /* ===================== PROGRESO ===================== */
  function progress(ans) {
    const answered = SECTION_IDS.filter((id) => filled(ans[id])).length;
    const done = BPS.filter((bp) => filled(ans[bp.doneId])).map((bp) => bp.n);
    const plan = PLAN_IDS.filter((id) => filled(ans[id])).length;
    return { answered: answered, total: SECTION_IDS.length, pct: Math.round(answered / SECTION_IDS.length * 100), done: done, plan: plan };
  }
  function bpProgress(bp, ans) {
    const n = bp.sections.filter((s) => filled(ans[s.id])).length;
    return { n: n, total: bp.sections.length, done: filled(ans[bp.doneId]) };
  }
  function bar(pct, cls) { return '<div class="wb-bar ' + (cls || '') + '"><i style="width:' + Math.max(0, Math.min(100, pct)) + '%"></i></div>'; }

  /* ===================== PARTICIPANTE: PANTALLAS ===================== */
  function topBar() {
    const p = S.me.profile, c = S.me.cohort;
    return '<div class="wb-top">' +
      '<div class="wb-hello"><span class="wb-kicker">Sprint Ejecutivo' + (c ? ' · ' + esc(c.name) : '') + '</span><strong>Hola, ' + esc(first(p.name)) + '</strong></div>' +
      '<div class="wb-tools" data-tour="tools">' +
      '<a class="wb-tool wb-tool--company' + (companyProgress().pct < 80 ? ' is-todo' : '') + '" href="#wb/empresa" data-tour="tool-empresa">' + ICON.building + '<span>Mi empresa</span></a>' +
      '<button type="button" class="wb-tool" data-act="tour" aria-label="Tutorial" title="Tutorial">' + ICON.tour + '<span class="wb-tl">Tutorial</span></button>' +
      '<button type="button" class="wb-tool" data-act="glossary" aria-label="Glosario" title="Glosario">' + ICON.book + '<span class="wb-tl">Glosario</span></button>' +
      '<button type="button" class="wb-tool" data-act="pdf" aria-label="Descargar PDF" title="Descargar PDF">' + ICON.download + '<span class="wb-tl">PDF</span></button>' +
      '<button type="button" class="wb-tool wb-tool--ghost" data-act="logout"><span>Salir</span></button>' +
      '</div></div>';
  }

  function sessionsHtml(sessions) {
    if (!sessions || !sessions.length) return '';
    const now = Date.now();
    const infos = sessions.map((s) => sessionInfo(s, now));
    const next = infos.findIndex((x) => x.state !== 'ended' && x.state !== 'tbd');
    const cards = sessions.map((s, i) => {
      const inf = infos[i], meet = safeUrl(s.meet), rec = safeUrl(s.recording);
      const badge = inf.state === 'live' ? '<span class="wb-chip wb-chip--live"><i></i>En vivo ahora</span>' :
        inf.state === 'soon' ? '<span class="wb-chip wb-chip--live"><i></i>Por comenzar</span>' :
        inf.state === 'ended' ? '<span class="wb-chip wb-chip--muted">Terminada</span>' :
        inf.today ? '<span class="wb-chip">Hoy</span>' : (i === next ? '<span class="wb-chip">Próxima</span>' : '');
      let actions = '';
      if (inf.state !== 'ended') {
        actions += meet ? '<a class="wb-btn wb-btn--sm' + (inf.state === 'live' || inf.state === 'soon' ? ' wb-btn--lime' : '') + '" href="' + esc(meet) + '" target="_blank" rel="noopener">' + ICON.video + 'Unirme</a>' :
          '<p class="wb-small">La liga para unirte aparecerá aquí antes de la sesión.</p>';
      }
      if (rec) actions += '<a class="wb-btn wb-btn--sm' + (inf.state === 'ended' ? '' : ' wb-btn--ghost') + '" href="' + esc(rec) + '" target="_blank" rel="noopener">' + ICON.play + 'Ver repetición</a>';
      else if (inf.state === 'ended') actions += '<p class="wb-small">La repetición estará disponible aquí muy pronto.</p>';
      const fb = feedbackUrl(s);
      if (fb && (inf.state === 'live' || inf.state === 'ended')) actions += '<a class="wb-btn wb-btn--sm' + (inf.state === 'ended' ? ' wb-btn--lime wb-btn--flat' : ' wb-btn--ghost') + '" href="' + esc(fb) + '" target="_blank" rel="noopener" data-feedback="' + s.n + '">' + ICON.star + 'Dar feedback de la sesión</a>';
      const when = s.date ? dayLong(s.date) + (s.start ? ' · ' + fmtRange(s.start, s.end) : '') : 'Fecha por confirmar';
      const cal = inf.state !== 'ended' && s.date && s.start ? '<div class="wb-session-cal">' + ICON.cal + '<span>Agregar a</span><a href="' + esc(gcalUrl(s)) + '" target="_blank" rel="noopener">Google Calendar</a>' +
        '<button type="button" data-act="ics" data-n="' + s.n + '">Outlook o Apple</button></div>' : '';
      return '<article class="wb-session is-' + inf.state + (i === next ? ' is-next' : '') + '" data-session="' + s.n + '">' +
        '<div class="wb-session-top"><span class="wb-kicker">Sesión ' + s.n + '</span>' + badge + '</div>' +
        '<strong class="wb-session-title">' + esc(s.title) + '</strong>' +
        '<span class="wb-session-when">' + esc(when) + (s.start ? ' <small>hora CDMX</small>' : '') + '</span>' +
        '<div class="wb-session-actions">' + actions + '</div>' + cal + '</article>';
    }).join('');
    return '<section class="wb-sec" data-sessions><span class="wb-pill">Sesiones en vivo</span>' +
      '<h2 class="wb-h2">Únete en vivo o ve la repetición</h2>' +
      '<p class="wb-muted wb-mt">Todos los horarios están en hora de la Ciudad de México.</p>' +
      '<div class="wb-sessions">' + cards + '</div></section>';
  }

  function renderHome() {
    const pr = progress(S.answers);
    const kick = S.me.cohort ? parseIso(S.me.cohort.kickoff) : null;
    const sessions = (S.me.cohort && S.me.cohort.sessions) || [];
    let liveN = 0;
    const steps = CONTENT.intro.steps.map((s, i) => '<div class="wb-step"><b>' + (i + 1) + '</b><strong>' + esc(s.t) + '</strong><span>' + esc(s.d) + '</span></div>').join('');
    const route = CONTENT.route.items.map((it) => {
      const on = filled(S.answers[it.id]);
      let d = kick ? shortDate(addDays(kick, it.day)) : 'Día ' + (it.day + 1), when = it.when;
      const ses = it.live ? sessions[liveN++] : null;   // las 3 actividades "en vivo" de la ruta son las 3 sesiones
      if (ses && ses.date) { d = shortDate(parseIso(ses.date)); when = fmtRange(ses.start, ses.end) || when; }
      return '<button type="button" class="wb-route' + (on ? ' is-on' : '') + '" data-act="toggle" data-field="' + it.id + '" aria-pressed="' + on + '">' +
        '<span class="wb-route-when">' + esc(d) + (when ? '<small>' + esc(when) + '</small>' : '') + (it.live ? '<em>En vivo</em>' : '') + '</span>' +
        '<span class="wb-route-text">' + esc(it.text) + '</span><span class="wb-check">' + ICON.check + '</span></button>';
    }).join('');
    const cards = BPS.map((bp) => {
      const b = bpProgress(bp, S.answers);
      const st = b.done ? '<span class="wb-chip wb-chip--done">' + ICON.check + 'Terminado</span>' : (b.n ? '<span class="wb-chip">En progreso</span>' : '<span class="wb-chip wb-chip--muted">Sin empezar</span>');
      return '<a class="wb-bpcard' + (b.done ? ' is-done' : '') + '" href="#wb/bp/' + bp.n + '">' +
        '<span class="wb-bpnum">' + bp.n + '</span>' +
        '<span class="wb-bpbody"><strong>' + esc(bp.title) + '</strong>' + (bp.subtitle ? '<small>' + esc(bp.subtitle) + '</small>' : '') +
        '<span class="wb-bpmeta">' + st + '<span class="wb-muted">' + b.n + '/' + b.total + ' secciones</span></span>' + bar(b.n / b.total * 100) + '</span></a>';
    }).join('');
    const prep = prepProgress(S.answers);
    const T = sprintTimes(S.me.cohort), pre = T.kick && Date.now() < T.kick;
    const guideCard = '<a class="wb-card wb-card--link wb-card--guide" href="#wb/guia" data-tour="guia"><span class="wb-pill">' + (pre ? 'Empieza aquí' : 'Antes del kick-off') + '</span>' +
      '<strong class="wb-h3">Guía previa: ' + esc(CONTENT.guide.headline.toLowerCase()) + '</strong><span class="wb-muted">' +
      [materialsFor('guide').some((m) => /video/i.test(m.type)) ? 'video' : '', materialsFor('guide').some((m) => /pdf/i.test(m.type)) ? 'PDF' : '', 'capítulos'].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' o $1').replace(/^./, (c) => c.toUpperCase()) +
      ' · tu preparación ' + prep.n + '/' + prep.total + '</span>' + ICON.right + '</a>';
    show(
      topBar() +
      tourInviteHtml() +
      clockHtml() +
      companyCardHtml() +
      '<div class="wb-hero" data-tour="avance"><span class="wb-pill wb-pill--lime">Tu avance</span>' +
      '<h1 class="wb-h1 wb-h1--light">' + esc(CONTENT.title) + '</h1>' +
      '<div class="wb-hero-stats"><div class="wb-big">' + pr.pct + '<small>%</small></div>' +
      '<p>' + pr.answered + ' de ' + pr.total + ' secciones respondidas · ' + pr.done.length + ' de 8 Blueprints terminados · Plan de 90 días: ' + pr.plan + '/9</p></div>' +
      bar(pr.pct, 'wb-bar--hero') +
      (pr.answered ? '' : (pre ? '' : '<a class="wb-btn wb-btn--lime" href="#wb/bp/1">Empezar por el Blueprint 1</a>')) +
      '</div>' +
      (pre ? '<section class="wb-sec">' + guideCard + '</section>' : '') +
      sessionsHtml(sessions) +
      doubtsHomeHtml() +
      '<section class="wb-sec" data-tour="pasos"><span class="wb-pill">Cómo usar tu workbook</span><div class="wb-steps">' + steps + '</div></section>' +
      '<section class="wb-sec" data-tour="ruta"><span class="wb-pill">Tu ruta de 5 días</span><h2 class="wb-h2">' + esc(CONTENT.route.intro) + '</h2>' +
      '<div class="wb-routes">' + route + '</div>' +
      '<div class="wb-callout"><strong>' + esc(CONTENT.route.note.t) + '</strong><span>' + esc(CONTENT.route.note.d) + '</span></div></section>' +
      '<section class="wb-sec" data-tour="blueprints"><span class="wb-pill">Los 8 Blueprints</span><h2 class="wb-h2">Tu Sistema de Ingresos, un Blueprint a la vez</h2><div class="wb-bpgrid">' + cards + '</div></section>' +
      '<section class="wb-sec wb-three" data-tour="cierre">' + (T.end && Date.now() > T.end ? followupCard() : (pre ? '' : guideCard)) +
      '<a class="wb-card wb-card--link" href="#wb/plan"><span class="wb-pill wb-pill--ink">Cierre</span><strong class="wb-h3">' + esc(CONTENT.plan.title) + '</strong><span class="wb-muted">' + pr.plan + ' de 9 campos completos</span>' + ICON.right + '</a>' +
      '<a class="wb-card wb-card--link" href="#wb/biblioteca"><span class="wb-pill wb-pill--ink">Bono del Sprint</span><strong class="wb-h3">' + esc(CONTENT.library.title) + '</strong><span class="wb-muted">Los recursos de cada Blueprint</span>' + ICON.right + '</a>' +
      '</section>'
    );
  }

  function copyBtn(text, label) {
    return '<button type="button" class="wb-copy" data-act="copy" data-copy="' + esc(text) + '">' + ICON.copy + '<span>' + (label || 'Copiar prompt') + '</span></button>';
  }

  function textarea(id, placeholder, readOnly) {
    const v = S.answers[id] || '';
    if (readOnly) return '<div class="wb-answer' + (filled(v) ? '' : ' is-empty') + '">' + (filled(v) ? esc(v) : 'Sin respuesta todavía.') + '</div>';
    return '<textarea class="wb-ta" data-field="' + id + '" rows="3" maxlength="' + MAX_CHARS + '" placeholder="' + esc(placeholder || 'Escribe aquí tu respuesta…') + '">' + esc(v) + '</textarea>';
  }

  function bpHtml(bp, readOnly) {
    const secs = bp.sections.map((s) =>
      '<article class="wb-section' + (filled(S.answers[s.id]) ? ' has-answer' : '') + '" id="wb-' + s.id + '">' +
      '<div class="wb-section-head"><span class="wb-num">' + s.n + '</span><h3 class="wb-h3">' + esc(s.title) + '</h3></div>' +
      '<p class="wb-q">' + esc(s.question) + '</p>' +
      (readOnly ? '' : prepRefsHtml(s)) +
      '<div class="wb-label">Tu respuesta</div>' + textarea(s.id, 'Escribe aquí tu respuesta (2 a 3 líneas son suficientes)…', readOnly) +
      (readOnly ? '' : sectionBar(s.id) +
        '<div class="wb-prompt"><div class="wb-prompt-head"><span>' + (copOn() ? 'Prompt para tu IA' : 'Copiloto IA') + '</span><span class="wb-prompt-btns">' + copPromptBtn(s.prompt, s.id) + copyBtn(s.prompt) + '</span></div><p>' + esc(s.prompt) + '</p></div>') +
      '</article>').join('');
    const done = filled(S.answers[bp.doneId]);
    return (readOnly ? '' : '<div class="wb-take"><span>Qué te llevas</span><p>' + esc(bp.takeaway) + '</p></div>') +
      '<div class="wb-sec" data-tour="vs"><div class="wb-label wb-label--top">Resultado esperado</div><div class="wb-vs">' +
      '<div class="wb-vs-bad"><b>Mal hecho</b><p>' + esc(bp.bad) + '</p></div>' +
      '<div class="wb-vs-good"><b>Bien hecho</b><p>' + esc(bp.good) + '</p></div></div></div>' +
      (readOnly ? '' : '<div class="wb-master"><div class="wb-prompt-head"><span>' + (copOn() ? 'Prompt maestro para tu IA' : 'Copiloto IA · Prompt maestro') + '</span><span class="wb-prompt-btns">' + copPromptBtn(bp.masterPrompt, '') + copyBtn(bp.masterPrompt) + '</span></div><p>' + esc(bp.masterPrompt) + '</p></div>') +
      '<section class="wb-sec"><span class="wb-pill">Completa cada sección</span><h2 class="wb-h2">' + bp.sections.length + ' secciones</h2>' +
      (readOnly ? '' : '<p class="wb-muted">Con 2 a 3 líneas por respuesta es suficiente; usa el prompt del Copiloto para avanzar más rápido. Todo se guarda solo.</p>') +
      (!readOnly && bp.callout ? '<div class="wb-bpcallout">' + ICON.compass + '<div><strong>' + esc(bp.callout.title) + '</strong><p>' + esc(bp.callout.text) + '</p></div></div>' : '') +
      secs + '</section>' +
      (readOnly ? '' :
        '<a class="wb-kitcta" href="#wb/bp/' + bp.n + '/kit"><span><span class="wb-kicker">Siguiente paso</span><strong>Compara tu borrador con el kit de práctica</strong>' +
        '<span class="wb-muted">Un ejemplo resuelto, una rúbrica de 5 puntos y los errores más comunes.</span></span>' + ICON.right + '</a>' +
        '<button type="button" class="wb-done' + (done ? ' is-on' : '') + '" data-act="toggle" data-field="' + bp.doneId + '" aria-pressed="' + done + '">' +
        '<span class="wb-check">' + ICON.check + '</span><span>Terminé el Blueprint ' + bp.n + ' y estoy listo para el siguiente.</span></button>' + copNudgeHtml(bp));
  }

  function bpHead(bp) {
    return '<div class="wb-bphead"><span class="wb-pill">Blueprint ' + bp.n + ' de 8</span>' +
      '<h1 class="wb-h1">' + esc(bp.title) + (bp.subtitle ? ' <span class="wb-sub">(' + esc(bp.subtitle) + ')</span>' : '') + '</h1>' +
      '<p class="wb-lead">' + esc(bp.tagline) + '</p></div>';
  }

  function bpTabs(bp, tab) {
    const b = bpProgress(bp, S.answers), mats = materialsFor(bp.n).filter((m) => !/kit/i.test(m.type)).length + (CONTENT.tools && CONTENT.tools.bp === bp.n ? 1 : 0);
    const t = (key, href, label, meta) => '<a class="wb-tab' + (tab === key ? ' is-on' : '') + '" href="' + href + '"' + (tab === key ? ' aria-current="page"' : '') + '>' + label + (meta ? '<small' + (key === 'completa' ? ' data-bpcount="' + bp.n + '"' : key === 'kit' ? ' data-rubtab="' + bp.n + '"' : '') + '>' + meta + '</small>' : '') + '</a>';
    return '<nav class="wb-tabs2" aria-label="Partes del Blueprint">' +
      t('completa', '#wb/bp/' + bp.n, 'Completa', b.n + '/' + b.total) +
      t('kit', '#wb/bp/' + bp.n + '/kit', 'Kit<span class="wb-tab-long"> de práctica</span>', rubricCount(bp) + '/5') +
      t('recursos', '#wb/bp/' + bp.n + '/recursos', 'Recursos', mats ? String(mats + bp.resources.length) : '') + '</nav>';
  }

  function toolsStackHtml(T) {
    return '<section class="wb-sec wb-stack"><span class="wb-pill">Recurso</span><h2 class="wb-h2">' + esc(T.title) + '</h2><p class="wb-muted wb-mt">' + esc(T.intro) + '</p>' +
      '<div class="wb-kit-howto">' + T.rules.map((r, i) => '<div><b>' + (i + 1) + '</b><span><strong>' + esc(r.b) + '</strong> ' + esc(r.t) + '</span></div>').join('') + '</div>' +
      '<p class="wb-small">' + esc(T.levelNote) + '</p>' +
      T.groups.map((g) => '<details class="wb-concept"><summary><strong>' + esc(g.name) + '</strong><small>' + esc(g.tag) + ' · ' + g.tools.length + ' herramientas</small></summary>' +
        '<div class="wb-stack-list">' + g.tools.map((x) => '<a class="wb-stack-tool" href="https://' + esc(x[3]) + '" target="_blank" rel="noopener"><strong>' + esc(x[0]) + '</strong><span>' + esc(x[1]) + '</span>' +
          '<em class="' + (x[2] === 'Mínimo' ? 'is-min' : '') + '">' + esc(x[2]) + '</em></a>').join('') + '</div></details>').join('') +
      '<h3 class="wb-h3 wb-gh3">Dos reglas que no se negocian</h3><div class="wb-errors">' + T.musts.map((m) => '<div class="wb-error">' + ICON.alert + '<p><strong>' + esc(m.b) + '</strong> ' + esc(m.t) + '</p></div>').join('') + '</div>' +
      '<h3 class="wb-h3 wb-gh3">' + esc(T.test.title) + '</h3><ol class="wb-gnum">' + T.test.steps.map((x, i) => '<li><b>' + (i + 1) + '</b><p>' + esc(x) + '</p></li>').join('') + '</ol>' +
      '<h3 class="wb-h3 wb-gh3">Orden recomendado de compra</h3><div class="wb-table-wrap"><table class="wb-table"><tbody>' + T.order.map((r) => '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>').join('') + '</tbody></table></div>' +
      '<div class="wb-prompt"><div class="wb-prompt-head"><span>Copiloto IA</span>' + copyBtn(T.prompt) + '</div><p>' + esc(T.prompt) + '</p></div>' +
      '<p class="wb-small">' + esc(T.sources) + '</p></section>';
  }

  function renderResources(bp) {
    const mats = materialsFor(bp.n).filter((m) => !/kit/i.test(m.type));
    const faqs = bp.faqs.map((f) => '<details class="wb-faq"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>').join('');
    return (mats.length ? '<section class="wb-sec wb-sec--first"><span class="wb-pill">Materiales del Blueprint ' + bp.n + '</span><div class="wb-mats">' + mats.map(materialCard).join('') + '</div></section>' : '') +
      (CONTENT.tools && CONTENT.tools.bp === bp.n ? toolsStackHtml(CONTENT.tools) : '') +
      '<section class="wb-sec' + (mats.length ? '' : ' wb-sec--first') + '"><span class="wb-pill">Preguntas frecuentes</span><div class="wb-faqs">' + faqs + '</div></section>' +
      '<section class="wb-sec"><span class="wb-pill">Para profundizar</span><p class="wb-muted wb-mt">' + esc(bp.resourcesIntro) + '</p>' + bp.resources.map(resourceHtml).join('') + '</section>';
  }

  function resourceHtml(r) {
    return '<div class="wb-res"><strong>' + esc(r.title) + '</strong><span class="wb-muted">' + esc(r.author) + ' · ' + esc(r.kind.toLowerCase()) + '</span>' +
      (r.featured ? '<span class="wb-chip wb-chip--done">Recomendado para todo el Sprint</span>' : '') +
      '<p><b>Úsalo en:</b> ' + esc(r.use) + '</p>' +
      (r.url ? '<a href="https://' + esc(r.url.replace(/^https?:\/\//, '')) + '" target="_blank" rel="noopener">' + esc(r.url) + '</a>' : '') + '</div>';
  }

  function renderBlueprint(n, tab) {
    const bp = BPS[n - 1];
    const prev = BPS[n - 2], next = BPS[n];
    if (['completa', 'kit', 'recursos'].indexOf(tab) < 0) tab = 'completa';
    const body = tab === 'kit' ? renderKit(bp) : tab === 'recursos' ? renderResources(bp) : bpHtml(bp, false);
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a></div>' +
      bpHead(bp) + bpTabs(bp, tab) + body +
      '<nav class="wb-pager">' +
      (prev ? '<a href="#wb/bp/' + prev.n + '">' + ICON.left + '<span><small>Anterior</small>' + esc(prev.title) + '</span></a>' : '<a href="#wb/inicio">' + ICON.left + '<span><small>Volver</small>Inicio</span></a>') +
      (next ? '<a class="is-next" href="#wb/bp/' + next.n + '"><span><small>Siguiente</small>' + esc(next.title) + '</span>' + ICON.right + '</a>' :
        '<a class="is-next" href="#wb/plan"><span><small>Siguiente</small>Plan de 90 días</span>' + ICON.right + '</a>') +
      '</nav>'
    );
    if (tab === 'kit') computeAllTools();
    if (S.focusSection) {
      const el = view.querySelector('#wb-' + S.focusSection);
      S.focusSection = null;
      if (el) {
        el.classList.add('is-flash');
        setTimeout(() => { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); } }, 60);
        const ta = el.querySelector('textarea');
        if (ta) setTimeout(() => { try { ta.focus({ preventScroll: true }); ta.setSelectionRange(ta.value.length, ta.value.length); } catch (e) { } }, 400);
      }
    }
  }

  function planHtml(readOnly) {
    return CONTENT.plan.periods.map((p) =>
      '<div class="wb-period"><div class="wb-period-head">' + esc(p.label) + '</div>' +
      CONTENT.plan.fields.map((f) => {
        const id = 'PLAN_' + p.id + '_' + f.id;
        return '<div class="wb-label">' + esc(f.label) + '</div>' + textarea(id, f.label + '…', readOnly);
      }).join('') + '</div>').join('');
  }

  function renderPlan() {
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a></div>' +
      '<div class="wb-bphead"><span class="wb-pill">Cierre del Sprint</span><h1 class="wb-h1">' + esc(CONTENT.plan.title) + '</h1>' +
      '<p class="wb-lead">' + esc(CONTENT.plan.intro) + '</p></div>' +
      (copOn() ? '<div class="wb-secbar wb-secbar--top"><span class="wb-secbar-label">' + ICON.spark + 'Copiloto</span><button type="button" class="wb-chipbtn" data-act="cop" data-kind="chip" data-msg="Ayúdame a armar mi plan de 90 días con lo que decidí en mis Blueprints.">Ayúdame a armar mi plan</button>' +
        '<button type="button" class="wb-chipbtn" data-act="cop" data-kind="coherence" data-msg="¿Mi plan de 90 días es coherente con lo que decidí en mis 8 Blueprints?">¿Es coherente con mis Blueprints?</button></div>' : '') +
      planHtml(false) +
      '<a class="wb-kitcta" href="#wb/seguimiento"><span><span class="wb-kicker">Después del Sprint</span><strong>Seguimiento a los 30, 60 y 90 días</strong>' +
      '<span class="wb-muted">' + (S.followup.length ? 'Te escribimos el ' + S.followup.map((f) => shortDate(parseIso(f.date)).toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' y $1') + ' para revisar cómo vas.' : 'Te escribimos cada 30 días para revisar cómo vas.') + '</span></span>' + ICON.right + '</a>' +
      '<nav class="wb-pager"><a href="#wb/bp/8">' + ICON.left + '<span><small>Anterior</small>' + esc(BPS[7].title) + '</span></a>' +
      '<a class="is-next" href="#wb/inicio"><span><small>Listo</small>Volver al inicio</span>' + ICON.right + '</a></nav>'
    );
  }

  function renderLibrary() {
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a></div>' +
      '<div class="wb-bphead"><span class="wb-pill">Bono del Sprint</span><h1 class="wb-h1">' + esc(CONTENT.library.title) + '</h1>' +
      '<p class="wb-lead">' + esc(CONTENT.library.intro) + '</p></div>' +
      BPS.map((bp) => '<section class="wb-sec"><span class="wb-pill wb-pill--ink">' + bp.n + ' · ' + esc(bp.title) + '</span>' + bp.resources.map(resourceHtml).join('') + '</section>').join('')
    );
  }

  /* ===================== RELOJ DEL SPRINT ===================== */
  function daysBetween(isoA, isoB) { const a = parseIso(isoA), b = parseIso(isoB); return a && b ? Math.round((b - a) / 864e5) : 0; }
  function countParts(ms) {
    const d = Math.max(0, ms);
    return { d: Math.floor(d / 864e5), h: Math.floor(d % 864e5 / 36e5), m: Math.floor(d % 36e5 / 6e4), s: Math.floor(d % 6e4 / 1e3) };
  }
  function countHtml(target, compact) {
    const p = countParts(target - Date.now());
    if (compact) return (p.d ? p.d + ' d ' : '') + (p.d || p.h ? p.h + ' h ' : '') + (p.d ? '' : p.m + ' min');
    const seg = (n, l) => '<span><b>' + (l === 'd' ? n : pad2(n)) + '</b><small>' + l + '</small></span>';
    return p.d ? seg(p.d, 'd') + seg(p.h, 'h') + seg(p.m, 'min') : seg(p.h, 'h') + seg(p.m, 'min') + seg(p.s, 's');
  }
  function countdown(target, compact) {
    return '<span class="wb-count' + (compact ? ' wb-count--inline' : '') + '" data-countdown="' + target + '"' + (compact ? ' data-compact="1"' : '') + '>' + countHtml(target, compact) + '</span>';
  }
  function tickCountdowns() {
    if (!view) return;
    let expired = false;
    view.querySelectorAll('[data-countdown]').forEach((el) => {
      const t = Number(el.getAttribute('data-countdown'));
      if (t <= Date.now()) expired = true;
      el.innerHTML = countHtml(t, el.hasAttribute('data-compact'));
    });
    if (expired && !ADMIN && S.me && route()[1] === 'inicio' && !document.activeElement.matches('input,textarea')) renderHome();
  }

  function sprintTimes(c) {
    const ses = (c && c.sessions) || [];
    const first = ses[0] && ses[0].date ? ses[0] : null;
    const kick = first ? mxMs(first.date, first.start || '08:00') : (c && c.kickoff ? mxMs(c.kickoff, '08:00') : null);
    const last = ses.length && ses[ses.length - 1].date ? ses[ses.length - 1] : null;
    const end = last ? sessionInfo(last, 0).end : (kick ? kick + 5 * 864e5 : null);
    const ct = CONTENT.route.contest;
    const contest = ct && c && c.kickoff ? mxMs(isoAdd(c.kickoff, ct.day), ct.time) + 59e3 : null;
    return { kick: kick, end: end, contest: contest };
  }

  function clockHtml() {
    const c = S.me.cohort;
    if (!c) return '';
    const T = sprintTimes(c), now = Date.now();
    if (T.kick == null) return '';
    const ses = c.sessions || [];
    const prep = prepProgress(S.answers);
    if (now < T.kick) {
      const s0 = ses[0];
      return '<section class="wb-clock is-pre">' +
        '<div class="wb-clock-main"><span class="wb-kicker">Tu Sprint arranca en</span>' + countdown(T.kick) +
        (s0 && s0.date ? '<span class="wb-clock-sub">' + esc(dayLong(s0.date) + (s0.start ? ' · ' + fmtRange(s0.start, s0.end) : '')) + ' · hora CDMX</span>' : '') + '</div>' +
        '<div class="wb-clock-side"><span class="wb-pill wb-pill--lime">Antes del kick-off</span>' +
        '<strong class="wb-h3">Empieza por el porqué</strong>' +
        '<p>Lee la guía previa (unos 30 minutos) y completa tu preparación: llegarás con tus segmentos y tus números listos.</p>' +
        bar(prep.pct, 'wb-bar--hero') + '<span class="wb-clock-meta">Preparación ' + prep.n + ' de ' + prep.total + '</span>' +
        '<a class="wb-btn wb-btn--lime wb-btn--sm" href="#wb/guia">' + (prep.n ? 'Seguir con la guía previa' : 'Abrir la guía previa') + ICON.right + '</a></div></section>';
    }
    if (now <= T.end) {
      const dayIdx = Math.max(0, Math.min(4, daysBetween(c.kickoff, mxToday())));
      const infos = ses.map((s) => sessionInfo(s, now));
      const li = infos.findIndex((x) => x.state === 'live' || x.state === 'soon');
      const ni = infos.findIndex((x) => x.state === 'upcoming');
      let main;
      if (li >= 0) {
        const s = ses[li], meet = safeUrl(s.meet);
        main = '<span class="wb-kicker">' + (infos[li].state === 'live' ? 'En vivo ahora' : 'Está por comenzar') + '</span>' +
          '<strong class="wb-clock-title">' + esc(s.title) + '</strong>' +
          '<span class="wb-clock-sub">' + esc(fmtRange(s.start, s.end)) + ' · hora CDMX</span>' +
          (meet ? '<a class="wb-btn wb-btn--lime" href="' + esc(meet) + '" target="_blank" rel="noopener">' + ICON.video + 'Unirme ahora</a>' : '<span class="wb-clock-sub">La liga aparece en «Sesiones en vivo».</span>');
      } else if (ni >= 0) {
        const s = ses[ni];
        main = '<span class="wb-kicker">Próxima sesión en vivo en</span>' + countdown(infos[ni].start) +
          '<span class="wb-clock-sub">' + esc(s.title) + ' · ' + esc(dayLong(s.date) + (s.start ? ' · ' + fmtRange(s.start, s.end) : '')) + '</span>';
      } else {
        main = '<span class="wb-kicker">Último día</span><strong class="wb-clock-title">Termina tu versión base y tu plan de 90 días</strong>';
      }
      const items = CONTENT.route.items.filter((it) => it.day === dayIdx);
      const contest = T.contest && now < T.contest ?
        '<div class="wb-clock-contest">' + ICON.trophy + '<span><b>' + esc(CONTENT.route.contest.title) + ':</b> cierra en ' + countdown(T.contest, true) +
        '<small>' + esc(CONTENT.route.contest.text) + '</small></span></div>' : '';
      return '<section class="wb-clock">' +
        '<div class="wb-clock-main">' + main + '</div>' +
        '<div class="wb-clock-side"><span class="wb-pill wb-pill--lime">Hoy · Día ' + (dayIdx + 1) + ' de 5</span>' +
        '<ul class="wb-today">' + items.map((it) => '<li class="' + (filled(S.answers[it.id]) ? 'is-on' : '') + '">' + ICON.check +
          '<span>' + (it.when ? '<b>' + esc(it.when) + ':</b> ' : '') + esc(it.text) + '</span></li>').join('') + '</ul>' + contest + '</div></section>';
    }
    return '<section class="wb-clock is-post"><div class="wb-clock-main"><span class="wb-kicker">Sprint terminado</span>' +
      '<strong class="wb-clock-title">Ahora toca ejecutar</strong><span class="wb-clock-sub">Tu workbook sigue aquí: ajústalo con datos reales en las próximas semanas.</span></div>' +
      (openCheckin() ? '<div class="wb-clock-side"><span class="wb-pill wb-pill--lime">Seguimiento</span><strong class="wb-h3">Tu check-in de ' + openCheckin().n + ' días está abierto</strong>' +
        '<p>Tres minutos para contarnos cómo vas con tu plan: qué lograste, qué te frenó y qué ajustas.</p>' +
        '<a class="wb-btn wb-btn--lime wb-btn--sm" href="#wb/seguimiento/' + openCheckin().n + '">Hacer mi check-in' + ICON.right + '</a></div></section>' :
      '<div class="wb-clock-side"><strong class="wb-h3">Tu plan de 90 días</strong><p>Lo que decidiste en los 8 Blueprints, convertido en acciones con responsable y fecha.</p>' +
      '<a class="wb-btn wb-btn--lime wb-btn--sm" href="#wb/plan">Abrir mi plan de 90 días' + ICON.right + '</a></div></section>');
  }

  /* ===================== PREPARACIÓN ===================== */
  function prepIds() {
    const out = [];
    CONTENT.prep.groups.forEach((g) => { (g.fields || []).forEach((f) => out.push(f.id)); (g.checks || []).forEach((c) => out.push(c.id)); });
    out.push(CONTENT.prep.doneId);
    return out;
  }
  function prepProgress(ans) {
    const ids = prepIds(), n = ids.filter((id) => filled(ans[id])).length;
    return { n: n, total: ids.length, pct: Math.round(n / ids.length * 100) };
  }
  function prepField(id) {
    for (const g of CONTENT.prep.groups) for (const f of (g.fields || [])) if (f.id === id) return f;
    return null;
  }
  function agendaText() {
    const ses = ((S.me && S.me.cohort && S.me.cohort.sessions) || []).filter((s) => s.date);
    if (!ses.length) return 'tus sesiones en vivo';
    const parts = ses.map((s) => DAYS[parseIso(s.date).getDay()].toLowerCase() + (s.start ? ' ' + fmtRange(s.start, s.end) : ''));
    return 'sesiones en vivo del ' + (parts.length > 1 ? parts.slice(0, -1).join(', ') + ' y ' + parts[parts.length - 1] : parts[0]) + ' (hora CDMX)';
  }
  function toggleRow(id, label, extra) {
    const on = filled(S.answers[id]);
    return '<button type="button" class="wb-checkrow' + (on ? ' is-on' : '') + (extra ? ' ' + extra : '') + '" data-act="toggle" data-field="' + id + '" aria-pressed="' + on + '">' +
      '<span class="wb-check">' + ICON.check + '</span><span>' + esc(label) + '</span></button>';
  }
  function prepHtml(readOnly) {
    return CONTENT.prep.groups.map((g) => {
      let body = '';
      if (g.note) body += '<p class="wb-small wb-small--top">' + esc(g.note) + '</p>';
      (g.fields || []).forEach((f) => {
        const v = S.answers[f.id] || '';
        if (readOnly) { body += '<div class="wb-ro-item"><h4>' + esc(f.label) + '</h4>' + textarea(f.id, '', true) + '</div>'; return; }
        const input = f.kind === 'line' ?
          '<input class="wb-input" data-field="' + f.id + '" maxlength="300" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || '') + '">' :
          '<textarea class="wb-ta wb-ta--sm" data-field="' + f.id + '" rows="2" maxlength="5000" placeholder="' + esc(f.placeholder || '') + '">' + esc(v) + '</textarea>';
        body += '<label class="wb-field wb-prepfield"><span>' + esc(f.label) + '</span>' + (f.hint ? '<em class="wb-hint">' + esc(f.hint) + '</em>' : '') + input + '</label>';
      });
      (g.checks || []).forEach((c) => {
        const label = c.label.replace('{sesiones}', agendaText());
        body += readOnly ? '<p class="wb-ro-check">' + (filled(S.answers[c.id]) ? '✓ ' : '○ ') + esc(label) + '</p>' : toggleRow(c.id, label);
      });
      (g.attitudes || []).forEach((a, i) => { body += '<div class="wb-attitude"><b>' + (i + 1) + '</b><p><strong>' + esc(a.b) + '</strong> ' + esc(a.t) + '</p></div>'; });
      return '<section class="wb-prepgroup"><h3 class="wb-h3">' + esc(g.title) + '</h3>' + body + '</section>';
    }).join('');
  }
  function prepRefsHtml(sec) {
    const refs = (sec.prepRefs || []).map((id) => [prepField(id), S.answers[id]]).filter((x) => x[0] && filled(x[1]));
    if (!refs.length) return '';
    return '<div class="wb-prepref"><div class="wb-prepref-head"><span>De tu guía previa</span><a href="#wb/guia/prep">Editar</a></div>' +
      refs.map((x) => '<p><b>' + esc(x[0].label) + ':</b> ' + esc(String(x[1]).trim()) + '</p>').join('') + '</div>';
  }

  /* ===================== GUÍA PREVIA ===================== */
  const guideKey = () => 'agwb:guide:' + (S.me ? S.me.profile.id : '');
  function guideRead() { try { return JSON.parse(store.get(guideKey()) || '[]'); } catch (e) { return []; } }
  function markRead(id) { const r = guideRead(); if (r.indexOf(id) < 0) { r.push(id); store.set(guideKey(), JSON.stringify(r)); } }

  function videoEmbed(url, start) {
    let m = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
    if (m) return 'https://www.youtube-nocookie.com/embed/' + m[1] + '?rel=0&modestbranding=1' + (start ? '&start=' + Math.floor(start) + '&autoplay=1' : '');
    m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return 'https://player.vimeo.com/video/' + m[1] + (start ? '#t=' + Math.floor(start) + 's' : '');
    m = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (m) return 'https://drive.google.com/file/d/' + m[1] + '/preview';
    return '';
  }
  function guideVideoHtml() {
    const v = materialsFor('guide').find((m) => /video/i.test(m.type));
    if (!v) return '';
    const src = videoEmbed(v.url, 0);
    const ch = CONTENT.guide.videoChapters || [];
    const fmt = (t) => Math.floor(t / 60) + ':' + pad2(Math.floor(t % 60));
    return '<section class="wb-video" id="wb-guide-video">' +
      (src ? '<div class="wb-video-frame"><iframe data-video src="' + esc(src) + '" title="' + esc(v.title) + '" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>' :
        '<a class="wb-btn" href="' + esc(v.url) + '" target="_blank" rel="noopener">' + ICON.play + 'Ver el video</a>') +
      '<div class="wb-video-meta"><span class="wb-kicker">En video · ' + esc(CONTENT.guide.videoLength || '') + '</span><p class="wb-small wb-small--top">' + esc(CONTENT.guide.videoNote) + '</p>' +
      (ch.length && src && /youtube|vimeo/.test(src) ? '<div class="wb-chapters">' + ch.map((c) => '<button type="button" class="wb-chapter" data-act="seek" data-t="' + c.t + '" data-url="' + esc(v.url) + '"><b>' + fmt(c.t) + '</b>' + esc(c.title) + '</button>').join('') + '</div>' : '') +
      '</div></section>';
  }

  function renderGuide(chId) {
    const G = CONTENT.guide;
    const idx = chId ? G.chapters.findIndex((c) => c.id === chId) : -1;
    if (idx >= 0) return renderGuideChapter(idx);
    const read = guideRead(), prep = prepProgress(S.answers);
    const pdf = materialsFor('guide').find((m) => /pdf/i.test(m.type));
    const cards = G.chapters.map((c, i) => '<a class="wb-gch' + (read.indexOf(c.id) >= 0 ? ' is-read' : '') + (c.prep ? ' is-prep' : '') + '" href="#wb/guia/' + c.id + '">' +
      '<span class="wb-gch-n">' + (i + 1) + '</span><span class="wb-gch-body"><small>' + esc(c.kicker) + '</small><strong>' + esc(c.title) + '</strong>' +
      (c.prep ? '<span class="wb-chip' + (prep.n === prep.total ? ' wb-chip--done' : '') + '">Interactivo · ' + prep.n + '/' + prep.total + '</span>' :
        (read.indexOf(c.id) >= 0 ? '<span class="wb-chip wb-chip--done">' + ICON.check + 'Leído</span>' : '')) + '</span>' + ICON.right + '</a>').join('');
    const video = materialsFor('guide').find((m) => /video/i.test(m.type));
    const opts = (video ? '<button type="button" class="wb-gopt" data-act="scroll-video">' + ICON.play + '<span><strong>Ver en video</strong><small>' + esc(G.videoLength || 'Resumen narrado') + ' · lo esencial de la guía</small></span></button>' : '') +
      (pdf ? '<a class="wb-gopt" href="' + esc(pdf.url) + '" target="_blank" rel="noopener">' + ICON.file + '<span><strong>Leer en PDF</strong><small>La guía completa, para leerla o imprimirla</small></span></a>' : '') +
      '<a class="wb-gopt" href="#wb/guia/' + G.chapters[0].id + '">' + ICON.book + '<span><strong>Leer por capítulos</strong><small>Aquí mismo, con tu preparación interactiva</small></span></a>';
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a><span class="wb-muted">Preparación ' + prep.n + '/' + prep.total + '</span></div>' +
      '<div class="wb-bphead"><span class="wb-pill">Antes del kick-off</span><h1 class="wb-h1">' + esc(G.headline) + '</h1>' +
      '<p class="wb-lead">' + esc(G.title) + ' · ' + esc(G.kicker) + '.</p></div>' +
      (video || pdf ? '<section class="wb-gchoice"><span class="wb-kicker">Elige cómo recorrerla</span><div class="wb-gopts">' + opts + '</div></section>' : '') +
      guideVideoHtml() +
      '<a class="wb-prepcta" href="#wb/guia/prep"><span><span class="wb-kicker">Capítulo 6 · interactivo</span><strong class="wb-h3">Tu preparación antes del kick-off</strong>' +
      '<span class="wb-muted">Tus segmentos, tus números y tu agenda. Se guarda solo y lo verás como referencia en los Blueprints.</span>' + bar(prep.pct) + '</span>' +
      '<b class="wb-prepcta-n">' + prep.n + '<small>/' + prep.total + '</small></b></a>' +
      '<section class="wb-sec"><span class="wb-pill">Capítulos</span><div class="wb-gchs">' + cards + '</div></section>'
    );
  }

  function guideBlock(b) {
    switch (b.type) {
      case 'p': return '<p class="wb-gp">' + esc(b.text) + '</p>';
      case 'h3': return '<h3 class="wb-h3 wb-gh3">' + esc(b.text) + '</h3>';
      case 'callout': return '<div class="wb-gcallout">' + esc(b.text) + '</div>';
      case 'quote': return '<blockquote class="wb-quote"><p>' + esc(b.text) + '</p><cite>' + esc(b.by) + '</cite></blockquote>';
      case 'checks': return '<div class="wb-gchecks"><strong>' + esc(b.title) + '</strong><ul>' + b.items.map((x) => '<li>' + ICON.check + '<span>' + esc(x) + '</span></li>').join('') + '</ul></div>';
      case 'symptoms': return '<ul class="wb-symptoms">' + b.items.map((x) => '<li>' + ICON.alert + '<span>' + esc(x) + '</span></li>').join('') + '</ul>';
      case 'list': return '<ul class="wb-glist">' + b.items.map((x) => '<li><p><strong>' + esc(x.b) + '</strong> ' + esc(x.t) + '</p>' + (x.tag ? '<span class="wb-chip">' + esc(x.tag) + '</span>' : '') + '</li>').join('') + '</ul>';
      case 'numbered': return '<ol class="wb-gnum">' + b.items.map((x, i) => '<li><b>' + (i + 1) + '</b><p><strong>' + esc(x.b) + '</strong> ' + esc(x.t) + '</p></li>').join('') + '</ol>';
      case 'chain': return '<div class="wb-chain">' + b.rows.map((r) => '<details class="wb-chain-item"><summary><span class="wb-bpnum">' + r.n + '</span><span><strong>' + esc(r.name) + '</strong><small>' + esc(r.q) + '</small></span></summary>' +
        '<div class="wb-chain-body"><p><b>Por qué va en este lugar:</b> ' + esc(r.why) + '</p><p class="wb-chain-skip"><b>Si te lo saltas:</b> ' + esc(r.skip) + '</p>' +
        '<a href="#wb/bp/' + r.n + '">Ir al Blueprint ' + r.n + ICON.right + '</a></div></details>').join('') + '</div>';
      case 'concepts': return '<div class="wb-concepts">' + b.groups.map((g, i) => '<details class="wb-concept"' + (i === 0 ? ' open' : '') + '><summary><span class="wb-bpnum">' + g.bp + '</span><strong>' + esc(g.title) + '</strong><small>' + g.items.length + ' conceptos</small></summary>' +
        g.items.map((it) => '<div class="wb-cterm"><strong>' + esc(it[0]) + '</strong><p>' + esc(it[1]) + '</p><p class="wb-why"><b>Por qué:</b> ' + esc(it[2]) + '</p></div>').join('') + '</details>').join('') + '</div>';
      case 'week': return weekHtml();
      case 'readings': return '<div class="wb-table-wrap"><table class="wb-table"><thead><tr><th>Tema</th><th>Lectura</th><th>Autor</th></tr></thead><tbody>' +
        b.rows.map((r) => '<tr><td>' + esc(r[0]) + '</td><td><strong>' + esc(r[1]) + '</strong></td><td>' + esc(r[2]) + '</td></tr>').join('') + '</tbody></table></div>';
      default: return '';
    }
  }

  function weekHtml() {
    const c = S.me && S.me.cohort, ses = (c && c.sessions) || [];
    let liveN = 0;
    const byDay = [0, 1, 2, 3, 4].map((d) => ({ d: d, items: [] }));
    CONTENT.route.items.forEach((it) => {
      const s = it.live ? ses[liveN++] : null;
      byDay[it.day].items.push({ live: it.live, when: s && s.start ? fmtRange(s.start, s.end) : it.when, text: it.live && s ? s.title : it.text.split('. ')[0] });
    });
    return '<div class="wb-week">' + byDay.map((x) => {
      const date = c && c.kickoff ? parseIso(isoAdd(c.kickoff, x.d)) : null;
      return '<div class="wb-day' + (x.items.some((i) => i.live) ? ' is-live' : '') + '"><span class="wb-day-name">' + (date ? DAYS[date.getDay()] + ' ' + date.getDate() : 'Día ' + (x.d + 1)) + '</span>' +
        x.items.map((i) => '<p class="' + (i.live ? 'is-live' : '') + '">' + (i.when ? '<b>' + esc(i.when) + '</b>' : '') + esc(i.text) + '</p>').join('') + '</div>';
    }).join('') + '</div>';
  }

  function renderGuideChapter(i) {
    const G = CONTENT.guide, ch = G.chapters[i], prev = G.chapters[i - 1], next = G.chapters[i + 1];
    markRead(ch.id);
    const prep = prepProgress(S.answers);
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/guia">' + ICON.left + 'Guía previa</a><span class="wb-muted">' + (i + 1) + ' de ' + G.chapters.length + '</span></div>' +
      '<article class="wb-gchapter"><div class="wb-bphead"><span class="wb-pill">' + esc(ch.kicker) + '</span><h1 class="wb-h1">' + esc(ch.title) + '</h1>' +
      (ch.lead ? '<p class="wb-lead">' + esc(ch.lead) + '</p>' : '') + '</div>' +
      ch.blocks.map(guideBlock).join('') +
      (ch.prep ? '<div class="wb-prepbar"><span>Tu preparación</span>' + bar(prep.pct) + '<b data-prepcount>' + prep.n + '/' + prep.total + '</b></div>' + prepHtml(false) +
        '<p class="wb-small">Todo se guarda solo. Tus segmentos y tus números aparecerán como referencia en el Blueprint 1 cuando hagas TAM, SAM, SOM y Unit Economics.</p>' : '') +
      (ch.id === 'cierre' ? toggleRow(CONTENT.prep.doneId, CONTENT.prep.doneLabel, 'wb-done') : '') +
      '</article>' +
      '<nav class="wb-pager">' +
      (prev ? '<a href="#wb/guia/' + prev.id + '">' + ICON.left + '<span><small>Anterior</small>' + esc(prev.title) + '</span></a>' : '<a href="#wb/guia">' + ICON.left + '<span><small>Volver</small>Guía previa</span></a>') +
      (next ? '<a class="is-next" href="#wb/guia/' + next.id + '"><span><small>Siguiente</small>' + esc(next.title) + '</span>' + ICON.right + '</a>' :
        '<a class="is-next" href="#wb/inicio"><span><small>Listo</small>Volver al inicio</span>' + ICON.right + '</a>') +
      '</nav>'
    );
  }

  /* ===================== MATERIALES ===================== */
  function materialsFor(bp) { return (S.materials || []).filter((m) => m.bp === bp); }
  function gCopyUrl(url) {
    const m = url.match(/^https:\/\/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([\w-]+)/);
    return m ? 'https://docs.google.com/' + m[1] + '/d/' + m[2] + '/copy' : '';
  }
  function typeIcon(t) {
    t = String(t || '').toLowerCase();
    if (/video/.test(t)) return ICON.play;
    if (/hoja|sheet|excel/.test(t)) return ICON.sheet;
    if (/present|slides|deck/.test(t)) return ICON.slides;
    if (/enlace|link/.test(t)) return ICON.link;
    return ICON.file;
  }
  function materialCard(m) {
    const copy = gCopyUrl(m.url);
    return '<div class="wb-mat"><span class="wb-mat-icon">' + typeIcon(m.type) + '</span><div class="wb-mat-body"><strong>' + esc(m.title) + '</strong>' +
      (m.description ? '<p>' + esc(m.description) + '</p>' : '') + '<span class="wb-mat-type">' + esc(m.type.replace(/^Kit PDF$/, 'PDF')) + '</span></div>' +
      '<div class="wb-mat-actions"><a class="wb-btn wb-btn--sm" href="' + esc(m.url) + '" target="_blank" rel="noopener">Abrir</a>' +
      (copy ? '<a class="wb-btn wb-btn--sm wb-btn--ghost" href="' + esc(copy) + '" target="_blank" rel="noopener">Hacer una copia</a>' : '') + '</div></div>';
  }

  /* ===================== KIT DE PRÁCTICA ===================== */
  function rubricIds(bp) { return bp.kit.rubric.map((r, i) => 'RUB' + bp.n + '_' + (i + 1)); }
  function rubricCount(bp, ans) { return rubricIds(bp).filter((id) => filled((ans || S.answers)[id])).length; }
  function sectionById(id) { for (const bp of BPS) for (const s of bp.sections) if (s.id === id) return { bp: bp, s: s }; return null; }

  function kitBlock(b, bp) {
    switch (b.type) {
      case 'compare': return '<div class="wb-compare"><div class="wb-compare-l"><span>' + esc(b.left.label) + '</span><p>' + esc(b.left.text) + '</p></div>' +
        '<div class="wb-compare-r"><span>' + esc(b.right.label) + '</span><p>' + esc(b.right.text) + '</p></div></div>' +
        (b.changes ? '<div class="wb-changes"><b>Qué cambió</b><ol>' + b.changes.map((c) => '<li>' + esc(c) + '</li>').join('') + '</ol></div>' : '');
      case 'table': return '<div class="wb-table-wrap"><table class="wb-table' + (b.total ? ' has-total' : '') + (b.head.length >= 4 ? ' is-wide' : '') + '"><thead><tr>' + b.head.map((h) => '<th>' + esc(h) + '</th>').join('') + '</tr></thead><tbody>' +
        b.rows.map((r) => '<tr>' + r.map((c, j) => (j === 0 ? '<th scope="row">' + esc(c) + '</th>' : '<td>' + esc(c) + '</td>')).join('') + '</tr>').join('') + '</tbody></table></div>' +
        (b.note ? '<p class="wb-note2">' + esc(b.note) + '</p>' : '');
      case 'flow': return '<div class="wb-flow' + (b.dir === 'back' ? ' is-back' : '') + '">' + b.steps.map((s, i) => '<span class="wb-flow-step">' + esc(s) + '</span>' + (i < b.steps.length - 1 ? '<i>' + (b.dir === 'back' ? '←' : '→') + '</i>' : '')).join('') + '</div>' +
        (b.note ? '<p class="wb-note2">' + esc(b.note) + '</p>' : '');
      case 'bullets': return '<ul class="wb-glist">' + b.items.map((x) => '<li><p><strong>' + esc(x.b) + '</strong> ' + esc(x.t) + '</p></li>').join('') + '</ul>';
      case 'tool': { const t = bp.kit.tools.find((x) => x.type === b.tool); return t ? toolHtml(t) : ''; }
      default: return '';
    }
  }

  function renderKit(bp) {
    const k = bp.kit, done = rubricCount(bp);
    const pdf = materialsFor(bp.n).find((m) => /kit/i.test(m.type) || /^kit de práctica/i.test(m.title));
    const tpl = k.template, tgt = tpl && tpl.target ? sectionById(tpl.target) : null;
    return '<div class="wb-kit">' +
      '<div class="wb-kit-head"><span class="wb-pill wb-pill--ink">Kit de práctica · Blueprint ' + bp.n + '</span>' +
      (pdf ? '<a class="wb-btn wb-btn--ghost wb-btn--sm" href="' + esc(pdf.url) + '" target="_blank" rel="noopener">' + ICON.download + 'Kit en PDF</a>' : '') + '</div>' +
      '<p class="wb-lead">' + esc(k.intro) + '</p>' +
      '<div class="wb-case"><span>El caso</span><p>' + esc(k.case) + '</p></div>' +
      '<div class="wb-kit-howto">' + CONTENT.kitHowto.map((h, i) => '<div><b>' + (i + 1) + '</b><span>' + esc(h) + '</span></div>').join('') + '</div>' +
      k.sections.map((s, i) => '<section class="wb-kit-sec"><h2 class="wb-h3"><span class="wb-num">' + (i + 1) + '</span>' + esc(s.title) + '</h2>' + s.blocks.map((b) => kitBlock(b, bp)).join('') + '</section>').join('') +
      (tpl ? '<section class="wb-kit-sec wb-template"><h2 class="wb-h3">Plantilla: ' + esc(tpl.title.charAt(0).toLowerCase() + tpl.title.slice(1)) + '</h2>' +
        '<ul>' + tpl.rows.map((r) => '<li>' + esc(r) + '</li>').join('') + '</ul><div class="wb-actions">' +
        (tgt ? '<button type="button" class="wb-btn wb-btn--sm" data-act="template-insert" data-bp="' + bp.n + '">' + ICON.plus + 'Llevarla a mi respuesta (' + esc(tgt.s.title) + ')</button>' : '') +
        copyBtn(tpl.rows.map((r) => r + ': ').join('\n'), 'Copiar plantilla') + '</div></section>' : '') +
      '<section class="wb-kit-sec wb-rubric"><div class="wb-row"><h2 class="wb-h3">Rúbrica: revisa tu Blueprint ' + bp.n + '</h2><b class="wb-rubcount" data-rubcount="' + bp.n + '">' + done + '/5</b></div>' +
      '<p class="wb-small wb-small--top">Marca lo que ya cumple tu respuesta. Lo que quede sin marcar es lo primero que debes corregir.</p>' +
      rubricIds(bp).map((id, i) => toggleRow(id, k.rubric[i])).join('') +
      toggleRow(bp.doneId, 'Terminé el Blueprint ' + bp.n + ' y estoy listo para el siguiente.', 'wb-done') + copNudgeHtml(bp) + '</section>' +
      '<section class="wb-kit-sec"><h2 class="wb-h3">3 errores comunes</h2><div class="wb-errors">' +
      k.errors.map((e) => '<div class="wb-error">' + ICON.alert + '<p><strong>' + esc(e.t) + '</strong> ' + esc(e.d) + '</p></div>').join('') + '</div></section>' +
      '<section class="wb-kit-sec"><div class="wb-master"><div class="wb-prompt-head"><span>' + (copOn() ? 'Prompts para revisar tu trabajo' : 'Copiloto IA · Prompts para revisar tu trabajo') + '</span></div>' +
      k.prompts.map((p) => '<div class="wb-kprompt"><p>' + esc(p) + '</p><span class="wb-prompt-btns">' + copPromptBtn(p, '') + copyBtn(p) + '</span></div>').join('') + '</div></section>' +
      (k.variant ? '<section class="wb-kit-sec"><div class="wb-variant"><span>Variante en otra industria</span><p>' + esc(k.variant) + '</p></div></section>' : '') +
      '</div>';
  }

  /* ---------- Herramientas interactivas del kit ---------- */
  const money = (n) => (isFinite(n) ? '$' + Math.round(n).toLocaleString('es-MX') : '—');
  const num = (n, d) => (isFinite(n) ? Number(n).toLocaleString('es-MX', { maximumFractionDigits: d == null ? 0 : d }) : '—');
  function parseAmount(v) {
    const s = String(v || '').toLowerCase().replace(/\s/g, '');
    const m = s.match(/(\d[\d,]*(?:\.\d+)?)(m(?:illones?)?|mdp|k|mil)?/);
    if (!m) return '';
    let n = Number(m[1].replace(/,/g, ''));
    if (/^m/.test(m[2] || '')) n *= 1e6; else if (m[2] === 'k' || m[2] === 'mil') n *= 1e3;
    return n;
  }
  function parseRate(v) {
    const s = String(v || '').toLowerCase();
    let m = s.match(/(\d+(?:\.\d+)?)\s*de\s*cada\s*(\d+)/);
    if (m) return Math.round(Number(m[1]) / Number(m[2]) * 1000) / 10;
    m = s.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? Number(m[1]) : '';
  }
  const TOOL_DEFS = {
    backcalc: {
      title: 'Tu cálculo hacia atrás', sub: 'Escribe tus números (o usa los de tu guía previa) y lleva el resultado a tu respuesta.',
      inputs: [
        { k: 'meta', label: 'Meta de ingresos al año', prep: 'PREP_META', parse: parseAmount, ex: 1350000, money: true },
        { k: 'ticket', label: 'Ticket promedio por cliente al año', prep: 'PREP_TICKET', parse: parseAmount, ex: 54000, money: true },
        { k: 'cierre', label: 'Tasa de cierre (%)', prep: 'PREP_CIERRE', parse: parseRate, ex: 20, pct: true },
        { k: 'conv', label: '% de leads que pasa a oportunidad', ex: 30, pct: true }],
      calc: (v) => {
        const cl = Math.ceil(v.meta / v.ticket), op = Math.ceil(cl / (v.cierre / 100)), ld = Math.ceil(op / (v.conv / 100));
        return { rows: [['Clientes que necesitas', num(cl)], ['Oportunidades', num(op)], ['Leads al año', num(ld)], ['Leads al mes', '~' + num(Math.ceil(ld / 12))]],
          text: 'Cálculo hacia atrás: meta de ' + money(v.meta) + ' al año ÷ ticket de ' + money(v.ticket) + ' = ' + num(cl) + ' clientes → ' + num(op) + ' oportunidades (cierre de ' + num(v.cierre, 1) + '%) → ' + num(ld) + ' leads al año (' + num(v.conv, 1) + '% pasa a oportunidad) → ~' + num(Math.ceil(ld / 12)) + ' leads al mes.' };
      }
    },
    scorecard: { title: 'Tu scorecard de priorización', sub: 'Califica tus dos segmentos candidatos del 1 al 5 y lleva la decisión a tu respuesta.' },
    valueEq: {
      title: 'Califica tu oferta en la Value Equation', sub: 'Del 1 al 10, donde 10 es lo mejor para el cliente. La más baja es la que mejoras primero.',
      vars: [['dream', 'Resultado soñado'], ['prob', 'Probabilidad percibida de éxito'], ['time', 'Tiempo de espera (10 = muy rápido)'], ['effort', 'Esfuerzo o sacrificio (10 = casi nada)']]
    },
    unitEcon: {
      title: 'Tu CAC, LTV y payback', sub: 'Empieza con los números del ejemplo y cámbialos por los tuyos.',
      inputs: [
        { k: 'gasto', label: 'Gasto comercial al mes (incluye tu tiempo)', prep: 'PREP_INVERSION', parse: parseAmount, ex: 60000, money: true },
        { k: 'nuevos', label: 'Clientes nuevos al mes', ex: 2 },
        { k: 'ticket', label: 'Ticket anual por cliente', prep: 'PREP_TICKET', parse: parseAmount, ex: 54000, money: true },
        { k: 'margen', label: 'Margen (%)', ex: 80, pct: true },
        { k: 'churn', label: 'Churn anual (%)', ex: 33, pct: true }],
      calc: (v) => {
        const cac = v.gasto / v.nuevos, vida = 100 / v.churn, ltv = v.ticket * (v.margen / 100) * vida, ratio = ltv / cac, pay = cac / (v.ticket * (v.margen / 100) / 12);
        return { rows: [['CAC', money(cac)], ['LTV', money(ltv)], ['LTV ÷ CAC', num(ratio, 1)], ['Payback', num(pay, 1) + ' meses']],
          flag: ratio >= 3 && pay <= 12 ? 'Dentro de la referencia común en B2B (LTV÷CAC ≥ 3 y payback < 12 meses).' : 'Fuera de la referencia común en B2B (LTV÷CAC ≥ 3 y payback < 12 meses): revisa pricing, retención o canal.',
          text: 'CAC: ' + money(v.gasto) + ' al mes ÷ ' + num(v.nuevos, 1) + ' clientes nuevos = ' + money(cac) + '. LTV: ' + money(v.ticket) + ' × ' + num(v.margen, 1) + '% de margen × ' + num(vida, 1) + ' años de vida (churn de ' + num(v.churn, 1) + '%) = ' + money(ltv) + '. LTV ÷ CAC = ' + num(ratio, 1) + '. Payback: ' + num(pay, 1) + ' meses.' };
      }
    },
    velocity: {
      title: 'Tu pipeline velocity', sub: 'Cuánto ingreso genera tu pipeline por día.',
      inputs: [
        { k: 'ops', label: 'Oportunidades activas', ex: 10 },
        { k: 'ticket', label: 'Ticket promedio', prep: 'PREP_TICKET', parse: parseAmount, ex: 54000, money: true },
        { k: 'cierre', label: 'Tasa de cierre (%)', prep: 'PREP_CIERRE', parse: parseRate, ex: 20, pct: true },
        { k: 'ciclo', label: 'Ciclo de venta (días)', ex: 30 }],
      calc: (v) => {
        const vel = v.ops * v.ticket * (v.cierre / 100) / v.ciclo;
        return { rows: [['Por día', money(vel)], ['Por mes (30 días)', money(vel * 30)]],
          text: 'Pipeline velocity: ' + num(v.ops) + ' oportunidades × ' + money(v.ticket) + ' × ' + num(v.cierre, 1) + '% de cierre ÷ ' + num(v.ciclo) + ' días = ' + money(vel) + ' al día (' + money(vel * 30) + ' al mes).' };
      }
    }
  };

  function toolHtml(t) {
    const def = TOOL_DEFS[t.type], tgt = sectionById(t.target);
    let body = '';
    if (t.type === 'scorecard') {
      const crit = ['Tamaño de la oportunidad', 'Competencia (5 = poca)', 'Facilidad de entrada'];
      const sel = (seg, i) => '<select class="wb-input wb-input--sm" data-calc="' + seg + i + '">' + [1, 2, 3, 4, 5].map((n) => '<option' + (n === 3 ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>';
      body = '<div class="wb-score"><div class="wb-score-row wb-score-head"><span></span><input class="wb-input wb-input--sm" data-calc="nA" value="Segmento 1" aria-label="Nombre del segmento 1"><input class="wb-input wb-input--sm" data-calc="nB" value="Segmento 2" aria-label="Nombre del segmento 2"></div>' +
        crit.map((c, i) => '<div class="wb-score-row"><span>' + esc(c) + '</span>' + sel('A', i) + sel('B', i) + '</div>').join('') +
        '<div class="wb-score-row wb-score-total"><span>Total</span><b data-out="tA">9</b><b data-out="tB">9</b></div></div>';
    } else if (t.type === 'valueEq') {
      body = '<div class="wb-sliders">' + def.vars.map((x) => '<label class="wb-slider"><span>' + esc(x[1]) + '</span><input type="range" min="1" max="10" value="5" data-calc="' + x[0] + '"><b data-out="' + x[0] + '">5</b></label>').join('') + '</div>';
    } else {
      body = '<div class="wb-calc-inputs">' + def.inputs.map((inp) => {
        const fromPrep = inp.prep && inp.parse ? inp.parse(S.answers[inp.prep]) : '';
        const v = fromPrep !== '' && fromPrep > 0 ? fromPrep : inp.ex;
        return '<label class="wb-field"><span>' + esc(inp.label) + (fromPrep ? ' <em>· de tu guía previa</em>' : '') + '</span><input class="wb-input wb-input--sm" type="number" inputmode="decimal" min="0" step="any" data-calc="' + inp.k + '" value="' + v + '"></label>';
      }).join('') + '</div>';
    }
    return '<div class="wb-tool-card" data-tool="' + t.type + '" data-target="' + esc(t.target) + '"><div class="wb-tool-head">' + ICON.calc + '<div><strong>' + esc(def.title) + '</strong><span>' + esc(def.sub) + '</span></div></div>' +
      body + '<div class="wb-tool-out" data-out="result"></div>' +
      (tgt ? '<button type="button" class="wb-btn wb-btn--sm" data-act="tool-insert">' + ICON.plus + 'Llevar a mi respuesta (' + esc(tgt.s.title) + ')</button>' : '') + '</div>';
  }

  function toolValues(el) { const v = {}; el.querySelectorAll('[data-calc]').forEach((i) => { v[i.getAttribute('data-calc')] = i.tagName === 'INPUT' && i.type !== 'number' && i.type !== 'range' ? i.value : Number(i.value); }); return v; }
  function computeTool(el) {
    const type = el.getAttribute('data-tool'), v = toolValues(el), out = el.querySelector('[data-out=result]');
    let res;
    if (type === 'scorecard') {
      const tA = v.A0 + v.A1 + v.A2, tB = v.B0 + v.B1 + v.B2;
      el.querySelector('[data-out=tA]').textContent = tA; el.querySelector('[data-out=tB]').textContent = tB;
      const win = tA > tB || (tA === tB && v.A2 >= v.B2) ? 'A' : 'B';
      const nW = (win === 'A' ? v.nA : v.nB) || 'Segmento', nL = (win === 'A' ? v.nB : v.nA) || 'Segmento';
      res = { rows: [['Prioriza', nW + ' (' + (win === 'A' ? tA : tB) + ' pts)']],
        text: 'Scorecard (1 a 5): ' + (v.nA || 'Segmento 1') + ': tamaño ' + v.A0 + ', competencia ' + v.A1 + ', facilidad ' + v.A2 + ' = ' + tA + '. ' + (v.nB || 'Segmento 2') + ': tamaño ' + v.B0 + ', competencia ' + v.B1 + ', facilidad ' + v.B2 + ' = ' + tB + '. Decisión: priorizar ' + nW + ' durante 90 días; ' + nL + ' queda como siguiente segmento.' };
    } else if (type === 'valueEq') {
      const vars = TOOL_DEFS.valueEq.vars;
      vars.forEach((x) => { el.querySelector('[data-out=' + x[0] + ']').textContent = v[x[0]]; });
      const low = vars.reduce((a, x) => (v[x[0]] < v[a[0]] ? x : a), vars[0]);
      el.querySelectorAll('.wb-slider').forEach((l) => l.classList.toggle('is-low', l.querySelector('[data-calc]').getAttribute('data-calc') === low[0]));
      res = { rows: [['Mejora primero', low[1].replace(/ \(.*\)$/, '')]],
        text: 'Value Equation (1 a 10, 10 = mejor para el cliente): ' + vars.map((x) => x[1].replace(/ \(.*\)$/, '') + ' ' + v[x[0]]).join(' · ') + '. La más débil: ' + low[1].replace(/ \(.*\)$/, '').toLowerCase() + '; es la que mejoro primero.' };
    } else {
      const def = TOOL_DEFS[type];
      const ok = def.inputs.every((i) => isFinite(v[i.k]) && v[i.k] > 0);
      res = ok ? def.calc(v) : { rows: [], text: '', flag: 'Completa todos los datos con números mayores que cero.' };
    }
    out.innerHTML = '<div class="wb-tool-rows">' + res.rows.map((r) => '<div><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>').join('') + '</div>' + (res.flag ? '<p class="wb-small wb-small--top">' + esc(res.flag) + '</p>' : '');
    el._text = res.text;
    return res;
  }
  function computeAllTools() { view.querySelectorAll('[data-tool]').forEach(computeTool); }

  function insertIntoAnswer(target, text) {
    const hit = sectionById(target);
    if (!hit || !text) return;
    const cur = S.answers[target] || '';
    setAnswer(target, cur.trim() ? cur.replace(/\s+$/, '') + '\n\n' + text : text);
    S.focusSection = target;
    toast('Lo agregamos a tu respuesta de «' + hit.s.title + '»');
    go('wb/bp/' + hit.bp.n);
  }

  /* ===================== GLOSARIO ===================== */
  function openGlossary(bpN) {
    const g = CONTENT.glossary;
    const groups = g.groups.slice().sort((a, b) => (a.bp === bpN ? -1 : 0) - (b.bp === bpN ? -1 : 0));
    const layer = root.querySelector('.wb-layer');
    layer.innerHTML =
      '<div class="wb-overlay" data-act="close-layer"></div>' +
      '<aside class="wb-drawer" role="dialog" aria-modal="true" aria-label="Glosario del Sprint">' +
      '<div class="wb-drawer-head"><div><span class="wb-pill wb-pill--lime">Glosario</span><h2 class="wb-h2">' + esc(g.title) + '</h2></div>' +
      '<button type="button" class="wb-icon" data-act="close-layer" aria-label="Cerrar">' + ICON.x + '</button></div>' +
      '<label class="wb-search">' + ICON.search + '<input type="search" data-glossary-search placeholder="Buscar un término…" aria-label="Buscar un término"></label>' +
      '<div class="wb-gloss">' + groups.map((gr) =>
        '<div class="wb-gloss-group' + (gr.bp === bpN ? ' is-current' : '') + '"><h3>' + esc(gr.title) + '</h3>' +
        gr.terms.map((t) => '<div class="wb-term" data-term="' + esc((t[0] + ' ' + t[1]).toLowerCase()) + '"><strong>' + esc(t[0]) + '</strong><p>' + esc(t[1]) + '</p></div>').join('') +
        '</div>').join('') +
      '<p class="wb-gloss-empty" hidden>No encontramos ese término.</p>' +
      '<div class="wb-tip"><strong>¿Falta un término?</strong><span>' + esc(g.tip) + '</span></div></div></aside>';
    layer.classList.add('is-on');
    const inp = layer.querySelector('[data-glossary-search]');
    try { inp.focus({ preventScroll: true }); } catch (e) { }
  }
  function filterGlossary(q) {
    const layer = root.querySelector('.wb-layer');
    const needle = q.trim().toLowerCase();
    let any = false;
    layer.querySelectorAll('.wb-gloss-group').forEach((gr) => {
      let vis = 0;
      gr.querySelectorAll('.wb-term').forEach((t) => { const show = !needle || t.getAttribute('data-term').indexOf(needle) >= 0; t.hidden = !show; if (show) vis++; });
      gr.hidden = !vis; if (vis) any = true;
    });
    layer.querySelector('.wb-gloss-empty').hidden = any;
  }
  function closeLayer() { const l = root && root.querySelector('.wb-layer'); if (l) { l.classList.remove('is-on'); l.innerHTML = ''; } }

  /* ===================== MARKDOWN (respuestas del copiloto) ===================== */
  function mdInline(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => {
        u = u.replace(/&amp;/g, '&');
        if (/^#wb\/[\w/-]*$/.test(u)) return '<a href="' + esc(u) + '" data-act="cop-link">' + t + '</a>';
        const ok = safeUrl(u);
        return ok ? '<a href="' + esc(ok) + '" target="_blank" rel="noopener">' + t + '</a>' : t;
      })
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/(^|[\s(«])\*([^*\n]+)\*(?=[\s).,;:!?»]|$)/g, '$1<em>$2</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  function md(src) {
    let html = '', list = null, para = [];
    const flushP = () => { if (para.length) { html += '<p>' + para.map(mdInline).join('<br>') + '</p>'; para = []; } };
    const flushL = () => { if (list) { html += '<' + list.t + '>' + list.items.map((x) => '<li>' + mdInline(x) + '</li>').join('') + '</' + list.t + '>'; list = null; } };
    String(src || '').replace(/\r/g, '').split('\n').forEach((ln) => {
      const t = ln.trim();
      let m;
      if (!t) { flushP(); flushL(); return; }
      if ((m = t.match(/^#{1,4}\s+(.*)$/))) { flushP(); flushL(); html += '<h4>' + mdInline(m[1]) + '</h4>'; return; }
      if ((m = t.match(/^[-*•]\s+(.*)$/))) { flushP(); if (!list || list.t !== 'ul') { flushL(); list = { t: 'ul', items: [] }; } list.items.push(m[1]); return; }
      if ((m = t.match(/^\d+[.)]\s+(.*)$/))) { flushP(); if (!list || list.t !== 'ol') { flushL(); list = { t: 'ol', items: [] }; } list.items.push(m[1]); return; }
      if (/^(---+|\*\*\*+)$/.test(t)) { flushP(); flushL(); html += '<hr>'; return; }
      flushL(); para.push(t);
    });
    flushP(); flushL();
    return html;
  }

  /* ===================== COPILOTO IA (participante) ===================== */
  const copState = () => (S.cop && S.cop.state) || { mode: 'hidden' };
  const copOn = () => !ADMIN && !!S.me && copState().mode === 'active';
  const copReady = () => copOn() && copState().status === 'ok';

  function updateFab() {
    const slot = root && root.querySelector('.wb-fab-slot');
    if (!slot) return;
    let html = '';
    if (ADMIN) {
      const r = route();
      if (S.token && CONTENT && S.admin.me && ((r[1] === 'cohorte' && r[2]) || (r[1] === 'participante' && r[2]))) {
        html = '<button type="button" class="wb-fab" data-act="fc-open">' + ICON.spark + '<span>Copiloto del facilitador</span></button>';
      }
    } else if (S.me && S.token) {
      const st = copState();
      if (st.mode === 'active') html = '<button type="button" class="wb-fab" data-act="cop-open" aria-label="Abrir tu Copiloto IA">' + ICON.spark + '<span>Copiloto</span></button>';
      else if (st.mode === 'locked') html = '<button type="button" class="wb-fab wb-fab--locked" data-act="cop-open" aria-label="Copiloto IA (no disponible)">' + ICON.lock + '<span>Copiloto</span></button>';
    }
    slot.innerHTML = html;
  }

  // Etiqueta legible de un campo del workbook.
  function fieldLabelC(id) {
    const hit = sectionById(id);
    if (hit) return 'Blueprint ' + hit.bp.n + ' · ' + hit.bp.n + '.' + hit.s.n + ' ' + hit.s.title;
    let m = String(id).match(/^PLAN_(D\d+_\d+)_(\w+)$/);
    if (m) {
      const per = CONTENT.plan.periods.find((p) => p.id === m[1]), f = CONTENT.plan.fields.find((x) => x.id === m[2]);
      return 'Plan de 90 días · ' + (per ? per.label : '') + ' · ' + (f ? f.label : '');
    }
    m = String(id).match(/^SEG(\d+)_(\w+)$/);
    if (m) { const q = CONTENT.followup.questions.find((x) => x.id === m[2]); return 'Check-in de ' + m[1] + ' días · ' + (q ? q.label : m[2]); }
    const pf = prepField(id);
    return pf ? 'Preparación · ' + pf.label : id;
  }
  function hrefForField(id) {
    const hit = sectionById(id);
    if (hit) return '#wb/bp/' + hit.bp.n;
    if (/^PLAN_/.test(id)) return '#wb/plan';
    const m = String(id).match(/^SEG(\d+)_/);
    if (m) return '#wb/seguimiento/' + m[1];
    return '#wb/guia/prep';
  }

  function sectionBar(id) {
    const hit = sectionById(id);
    const t = hit ? hit.s.title : '';
    return '<div class="wb-secbar">' +
      (copOn() ? '<span class="wb-secbar-label">' + ICON.spark + 'Copiloto</span>' +
        '<button type="button" class="wb-chipbtn is-empty-only" data-act="cop" data-kind="start" data-field="' + id + '" data-msg="' + esc('Ayúdame a empezar «' + t + '».') + '">Ayúdame a empezar</button>' +
        '<button type="button" class="wb-chipbtn is-filled-only" data-act="cop" data-kind="review" data-field="' + id + '" data-msg="' + esc('Revisa mi respuesta de «' + t + '» con la rúbrica.') + '">Revisa mi respuesta</button>' +
        '<button type="button" class="wb-chipbtn is-filled-only" data-act="cop" data-kind="concrete" data-field="' + id + '" data-msg="' + esc('Ayúdame a hacer más concreta mi respuesta de «' + t + '».') + '">Hazla más concreta</button>' : '') +
      '<button type="button" class="wb-chipbtn wb-chipbtn--ghost" data-act="doubt-open" data-field="' + id + '">' + ICON.help + 'Duda para el taller</button>' +
      '</div><div data-doubt-slot="' + id + '"></div>';
  }
  function copPromptBtn(prompt, field) {
    if (!copOn()) {
      if (ADMIN || !S.me || companyProgress().n < 3) return '';
      return '<button type="button" class="wb-copy wb-copy--ctx" data-act="copy" data-copy="' + esc(companyContextText() + '\n\n' + prompt) + '" title="Copia el prompt con el contexto de Mi empresa">' + ICON.building + '<span>Copiar con mi contexto</span></button>';
    }
    return '<button type="button" class="wb-copy wb-copy--cop" data-act="cop" data-kind="prompt"' + (field ? ' data-field="' + field + '"' : '') +
      ' data-msg="' + esc('Trabajemos este prompt del workbook con mis datos: «' + prompt + '»') + '">' + ICON.spark + '<span>Hacerlo con mi copiloto</span></button>';
  }
  const nudgeKey = (n) => 'agwb:nudge:' + (S.me ? S.me.profile.id : '') + ':' + n;
  function copNudgeHtml(bp) {
    if (!copOn() || !filled(S.answers[bp.doneId]) || store.get(nudgeKey(bp.n))) return '';
    return '<div class="wb-copnudge" data-nudge="' + bp.n + '">' + ICON.spark + '<div><strong>¿Quieres que tu copiloto revise el Blueprint ' + bp.n + '?</strong>' +
      '<span>Lo compara con la rúbrica del kit y te dice qué corregir primero.</span></div>' +
      '<div class="wb-actions"><button type="button" class="wb-btn wb-btn--sm" data-act="cop" data-kind="bp-review" data-msg="' + esc('Revisa mi Blueprint ' + bp.n + ' completo con la rúbrica y dime qué corregir primero.') + '">Revisar con el copiloto</button>' +
      '<button type="button" class="wb-icon" data-act="nudge-off" data-n="' + bp.n + '" aria-label="Ocultar">' + ICON.x + '</button></div></div>';
  }

  function copChips() {
    const r = route();
    if (r[1] === 'bp' && BPS[Number(r[2]) - 1]) {
      const n = Number(r[2]), bp = BPS[n - 1];
      const out = [['chip', 'Explícame el Blueprint ' + n + ' en 3 líneas', 'Explícame el Blueprint ' + n + ' (' + bp.title + ') en 3 líneas y por qué va en este orden.'],
        ['chip', '¿Por dónde empiezo?', '¿Por dónde empiezo el Blueprint ' + n + ' con lo que ya tengo en mi workbook?'],
        ['bp-review', 'Revisa mi Blueprint ' + n, 'Revisa mi Blueprint ' + n + ' completo con la rúbrica y dime qué corregir primero.']];
      if (n >= 2) out.push(['coherence', '¿Cuadra con los anteriores?', '¿Mi Blueprint ' + n + ' es coherente con lo que escribí en los Blueprints anteriores?']);
      if (r[3] === 'kit') out[0] = ['chip', 'Explícame el caso del kit', 'Explícame el caso resuelto del kit del Blueprint ' + n + ' y qué debo copiar de él.'];
      return out;
    }
    if (r[1] === 'guia') return [['chip', 'Resúmeme la guía en 5 puntos', 'Resúmeme la guía previa en 5 puntos.'], ['chip', 'Ayúdame con mi preparación', 'Ayúdame a completar mi preparación antes del kick-off.']];
    if (r[1] === 'plan') return [['chip', 'Ayúdame a armar mi plan', 'Ayúdame a armar mi plan de 90 días con lo que decidí en mis Blueprints.']];
    if (r[1] === 'empresa') return [['chip', '¿Para qué usas estos datos?', '¿Para qué usas los datos de Mi empresa y cuáles son los más importantes para ayudarme bien?'],
      ['chip', 'Ayúdame a describir qué vendo', 'Ayúdame a describir en una o dos líneas qué vende mi empresa y a quién.']];
    if (r[1] === 'seguimiento') return [['chip', 'Ayúdame con mi check-in', 'Ayúdame a preparar mi check-in: qué logré contra mi plan y qué ajusto.']];
    return [['chip', '¿Qué me toca hoy?', '¿Qué me toca hacer hoy en el Sprint?'], ['chip', '¿Cuándo es mi próxima sesión?', '¿Cuándo es mi próxima sesión en vivo y qué debo llevar?'],
      ['chip', '¿Cómo voy?', '¿Cómo voy con mi workbook y qué debería priorizar?']];
  }

  function copStatusText() {
    const st = copState();
    const until = st.until ? dayLong(st.until).toLowerCase() : '';
    switch (st.status) {
      case 'ok': return 'Te quedan <b>' + st.leftToday + '</b> mensajes hoy' + (until ? ' · disponible hasta el ' + esc(until) : '');
      case 'limit-day': return 'Usaste tus ' + st.dailyLimit + ' mensajes de hoy. Mañana se renuevan.';
      case 'limit': return 'Usaste los ' + st.limit + ' mensajes de tu Sprint. Si necesitas más, pídeselo a ' + esc(S.facilitator) + '.';
      case 'expired': return 'Tu copiloto estuvo disponible hasta el ' + esc(until) + '. Tu conversación queda aquí para consultarla.';
      case 'paused': return 'El copiloto está en pausa por el momento. Intenta más tarde.';
      default: return '';
    }
  }

  function copWelcome() {
    return { r: 'a', i: -1, t: 'Hola, ' + first(S.me.profile.name) + '. Soy tu copiloto del Sprint. Puedo explicarte cualquier parte del contenido, ayudarte a arrancar una sección con tus datos o revisar tus respuestas con la rúbrica de cada kit.\n\nLo que te proponga no se guarda hasta que tú lo insertes.', p: [], d: '' };
  }

  function propHtml(m, p, j) {
    const key = (m.ts || m.i) + ':' + j, done = S.cop.applied[key], cur = S.answers[p.field] || '';
    const act = (mode, primary, label) => '<button type="button" class="wb-btn wb-btn--sm' + (primary ? '' : ' wb-btn--ghost') + '" data-act="cop-apply" data-i="' + m.i + '" data-j="' + j + '" data-mode="' + mode + '">' + label + '</button>';
    return '<div class="wb-prop" data-prop="' + esc(key) + '"><div class="wb-prop-head"><span class="wb-kicker">Propuesta para</span><strong>' + esc(fieldLabelC(p.field)) + '</strong></div>' +
      '<div class="wb-prop-text">' + esc(p.text) + '</div><div class="wb-prop-actions">' +
      (done ? '<span class="wb-ok">' + ICON.check + (done === 'append' ? 'Agregado a tu respuesta' : 'Insertado en tu respuesta') + '</span>' +
        '<a href="' + hrefForField(p.field) + '" data-act="cop-goto" data-field="' + esc(p.field) + '">Ver en mi workbook</a>' :
        (filled(cur) ? act('replace', p.mode !== 'append', 'Reemplazar mi respuesta') + act('append', p.mode === 'append', 'Agregar al final') : act('replace', true, 'Insertar en mi respuesta')) +
        copyBtn(p.text, 'Copiar')) + '</div></div>';
  }
  function copDoubtHtml(m) {
    const sent = S.cop.doubtSent[m.ts || m.i];
    return '<div class="wb-prop wb-prop--doubt"><div class="wb-prop-head"><span class="wb-kicker">Duda para el taller</span><strong>La revisa ' + esc(S.facilitator) + ' en vivo</strong></div>' +
      (sent ? '<p class="wb-ok">' + ICON.check + esc(sent) + '</p>' :
        '<textarea class="wb-ta wb-ta--sm" data-doubt-text="' + m.i + '" rows="3" maxlength="1500">' + esc(m.d) + '</textarea>' +
        '<div class="wb-prop-actions"><button type="button" class="wb-btn wb-btn--sm" data-act="cop-doubt" data-i="' + m.i + '">' + ICON.send + 'Enviar mi duda</button></div>') + '</div>';
  }
  function copMsgHtml(m) {
    if (m.r === 'u') return '<div class="wb-msg wb-msg--u"><p>' + esc(m.t).replace(/\n/g, '<br>') + '</p></div>';
    if (m.r === 'err') return '<div class="wb-msg wb-msg--err">' + ICON.alert + '<p>' + esc(m.t) + '</p></div>';
    return '<div class="wb-msg wb-msg--a"><div class="wb-md">' + md(m.t) + '</div>' + (m.p || []).map((p, j) => propHtml(m, p, j)).join('') + (m.d ? copDoubtHtml(m) : '') + '</div>';
  }

  async function openCopilot(opts) {
    opts = opts || {};
    const st = copState();
    const layer = root.querySelector('.wb-layer');
    const locked = st.mode !== 'active';
    layer.innerHTML = '<div class="wb-overlay" data-act="close-layer"></div>' +
      '<aside class="wb-drawer wb-cop" role="dialog" aria-modal="true" aria-label="Copiloto IA">' +
      '<div class="wb-drawer-head"><div><span class="wb-pill wb-pill--lime">' + ICON.spark + 'Copiloto IA</span><h2 class="wb-h2">Tu copiloto del Sprint</h2></div><div class="wb-drawer-btns">' +
      (locked ? '' : '<button type="button" class="wb-icon" data-act="cop-reset" title="Nueva conversación" aria-label="Nueva conversación">' + ICON.reset + '</button>') +
      '<button type="button" class="wb-icon" data-act="close-layer" aria-label="Cerrar">' + ICON.x + '</button></div></div>' +
      '<div class="wb-cop-body" data-cop-body></div></aside>';
    layer.classList.add('is-on');
    const body = layer.querySelector('[data-cop-body]');
    if (locked) {
      body.innerHTML = '<div class="wb-cop-locked">' + ICON.lock + '<h3 class="wb-h3">El Copiloto IA no está activo en tu Sprint</h3><p>' + esc(st.message || '') + '</p>' +
        '<ul><li>Te explica el contenido, las sesiones y cada Blueprint.</li><li>Te ayuda a arrancar cada sección con tus propios datos.</li><li>Revisa tus respuestas con la rúbrica de cada kit.</li></ul></div>';
      return;
    }
    if (!S.cop.thread) {
      body.innerHTML = '<div class="wb-center"><span class="wb-spin"></span><p>Abriendo tu copiloto…</p></div>';
      try {
        const out = await api('copilot.open');
        if (!out.ok) throw new Error(out.error);
        S.cop.thread = out.thread; S.cop.state = out.state;
      } catch (e) {
        if (e.code === 'auth') return;
        body.innerHTML = '<div class="wb-center"><p>No pudimos abrir tu copiloto.</p><button type="button" class="wb-btn wb-btn--sm" data-act="cop-open">Intentar de nuevo</button></div>';
        return;
      }
      if (!layer.querySelector('[data-cop-body]')) return;   // se cerró mientras cargaba
    }
    body.innerHTML = '<p class="wb-cop-status" data-cop-status></p><div data-cop-ctx></div><div class="wb-cop-msgs" data-cop-msgs aria-live="polite"></div><div class="wb-cop-chips" data-cop-chips></div>' +
      '<form class="wb-cop-form" data-form="cop" novalidate><textarea class="wb-cop-input" name="msg" rows="1" maxlength="4000" placeholder="Pregúntale lo que quieras del Sprint…" aria-label="Escribe tu mensaje"></textarea>' +
      '<button type="submit" class="wb-cop-send" aria-label="Enviar" data-submit>' + ICON.send + '</button></form>' +
      '<p class="wb-cop-note">Es una IA: revisa lo que propone antes de usarlo. Agora puede leer estas conversaciones para mejorar el programa.</p>';
    const inp = body.querySelector('.wb-cop-input');
    inp.value = S.cop.draft || '';
    copRefresh();
    if (opts.message) copSend(opts.message, opts.ctx);
    else if (!(window.matchMedia && window.matchMedia('(pointer:coarse)').matches)) try { inp.focus({ preventScroll: true }); } catch (e) { }
  }

  function copRefresh() {
    const layer = root.querySelector('.wb-layer');
    const msgs = layer.querySelector('[data-cop-msgs]');
    if (!msgs || !S.cop.thread) return;
    const st = copState(), ready = copReady();
    layer.querySelector('[data-cop-status]').innerHTML = copStatusText();
    layer.querySelector('[data-cop-status]').className = 'wb-cop-status' + (st.status === 'ok' ? '' : ' is-warn');
    const cp = companyProgress();
    layer.querySelector('[data-cop-ctx]').innerHTML = ready && cp.pct < 50 && route()[1] !== 'empresa' ?
      '<a class="wb-cop-ctx" href="#wb/empresa" data-act="cop-link">' + ICON.building + '<span><b>Tu copiloto todavía no conoce tu empresa.</b> Completa «Mi empresa» (5 minutos, ' + cp.n + ' de ' + cp.total + ' datos) y sus respuestas serán sobre tu caso, no generales.</span></a>' : '';
    const list = S.cop.thread.length ? S.cop.thread : [copWelcome()];
    msgs.innerHTML = list.map(copMsgHtml).join('') +
      (S.cop.busy ? '<div class="wb-msg wb-msg--a wb-msg--typing"><span class="wb-dots"><i></i><i></i><i></i></span><small data-typing>Pensando…</small></div>' : '');
    layer.querySelector('[data-cop-chips]').innerHTML = ready && !S.cop.busy ? copChips().map((c) =>
      '<button type="button" class="wb-chipbtn" data-act="cop" data-kind="' + c[0] + '" data-msg="' + esc(c[2]) + '">' + esc(c[1]) + '</button>').join('') : '';
    const form = layer.querySelector('.wb-cop-form');
    form.hidden = st.status === 'expired';
    form.querySelector('textarea').disabled = !ready;
    form.querySelector('button').disabled = !ready || S.cop.busy;
    msgs.scrollTop = msgs.scrollHeight;
  }

  const COP_ERRORS = {
    'limit-day': 'Llegaste al límite de mensajes de hoy. Mañana se renuevan.', limit: 'Usaste todos los mensajes de tu Sprint.',
    expired: 'Tu copiloto ya no está disponible.', paused: 'El copiloto está en pausa por el momento. Intenta más tarde.',
    busy: 'Hay mucha actividad en este momento. Intenta de nuevo en unos segundos.', forbidden: 'Tu copiloto no está activo.'
  };

  async function copSend(text, ctx) {
    text = String(text || '').trim();
    if (!text || S.cop.busy || !copReady()) return;
    ctx = Object.assign({ route: location.hash.replace(/^#/, '') || 'wb/inicio', kind: 'chat' }, ctx || {});
    S.cop.busy = true;
    const temp = { r: 'u', t: text, i: -2 };
    S.cop.thread.push(temp);
    const inp = root.querySelector('.wb-cop-input');
    if (inp && inp.value.trim() === text) { inp.value = ''; S.cop.draft = ''; inp.style.height = ''; }
    copRefresh();
    const slow = setTimeout(() => { const el = root.querySelector('[data-typing]'); if (el) el.textContent = 'Sigo pensando… las respuestas con propuesta tardan unos segundos.'; }, 9000);
    try {
      if (Object.keys(S.pending).length) { clearTimeout(S.saveTimer); await saveNow(); }
      const out = await api('copilot.send', { message: text, context: ctx });
      S.cop.thread.pop();
      if (out.state) S.cop.state = out.state;
      if (!out.ok) {
        S.cop.thread.push({ r: 'err', t: out.message || COP_ERRORS[out.error] || 'El copiloto no pudo responder. Intenta de nuevo.', i: -3 });
        S.cop.draft = text;
        const i2 = root.querySelector('.wb-cop-input'); if (i2 && !i2.value) i2.value = text;
      } else {
        S.cop.thread = out.thread || S.cop.thread.concat([{ r: 'u', t: text, i: out.reply.i - 1, f: ctx.field || '' }, out.reply]);
      }
    } catch (e) {
      S.cop.thread.pop();
      if (e.code === 'auth') return;
      S.cop.thread.push({ r: 'err', t: 'No pudimos conectar. Revisa tu internet e intenta de nuevo.', i: -3 });
      S.cop.draft = text;
    } finally {
      clearTimeout(slow);
      S.cop.busy = false;
      copRefresh();
      updateFab();
    }
  }

  function copFromButton(t) {
    const kind = t.getAttribute('data-kind') || 'chat', field = t.getAttribute('data-field') || '';
    const ctx = { kind: kind, field: field };
    const msg = t.getAttribute('data-msg') || '';
    const layerOpen = root.querySelector('.wb-layer .wb-cop');
    if (layerOpen && S.cop.thread) return copSend(msg, ctx);
    return openCopilot({ message: msg, ctx: ctx });
  }

  function applyProposal(i, j, mode) {
    const m = (S.cop.thread || []).find((x) => x.i === i && x.r === 'a');
    if (!m || !m.p || !m.p[j]) return;
    const p = m.p[j], cur = S.answers[p.field] || '';
    const val = mode === 'append' && filled(cur) ? cur.replace(/\s+$/, '') + '\n\n' + p.text : p.text;
    setAnswer(p.field, val);
    view.querySelectorAll('[data-field="' + p.field + '"]').forEach((el) => {
      if (el.tagName !== 'TEXTAREA' && el.tagName !== 'INPUT') return;
      el.value = val;
      if (el.tagName === 'TEXTAREA') autosize(el);
      const art = el.closest('.wb-section');
      if (art) { art.classList.toggle('has-answer', filled(val)); art.classList.remove('is-flash'); void art.offsetWidth; art.classList.add('is-flash'); }
    });
    const c = view.querySelector('[data-bpcount]');
    if (c) { const b = bpProgress(BPS[Number(c.getAttribute('data-bpcount')) - 1], S.answers); c.textContent = b.n + '/' + b.total; }
    updatePrepCount();
    const key = (m.ts || m.i) + ':' + j;
    S.cop.applied[key] = mode;
    const card = root.querySelector('.wb-layer [data-prop="' + key + '"]');
    if (card) card.outerHTML = propHtml(m, p, j);
    toast('Listo: quedó en tu respuesta');
  }

  /* ===================== DUDAS PARA EL TALLER ===================== */
  function nextSessionC() {
    const ses = (S.me && S.me.cohort && S.me.cohort.sessions) || [], now = Date.now();
    return ses.find((s) => { const inf = sessionInfo(s, now); return inf.state !== 'ended' && inf.state !== 'tbd'; }) || null;
  }
  function sessionShort(s) { return s ? s.title + ' · ' + dayLong(s.date).toLowerCase() + (s.start ? ', ' + fmtTime(s.start).t + ' ' + fmtTime(s.start).ap : '') : ''; }

  function doubtForm(field) {
    const s = nextSessionC();
    return '<form class="wb-doubtform" data-form="doubt"' + (field ? ' data-field="' + field + '"' : '') + ' novalidate>' +
      '<label class="wb-field"><span>¿Qué quieres que revisemos en el taller?</span><textarea class="wb-ta wb-ta--sm" name="text" rows="3" maxlength="1500" placeholder="Escribe tu duda en una o dos líneas…"></textarea></label>' +
      '<p class="wb-small wb-small--top">' + (s ? 'La verá ' + esc(S.facilitator) + ' para el ' + esc(sessionShort(s)) + ' (hora CDMX).' : 'La verá ' + esc(S.facilitator) + ' y te responderá aquí.') +
      (field ? ' Va con tu respuesta de esta sección para dar contexto.' : '') + '</p>' +
      '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>' + ICON.send + 'Enviar mi duda</button>' +
      '<button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
  }
  const DOUBT_CHIP = { 'Pendiente': '', 'Vista en taller': ' wb-chip--done', 'Resuelta': ' wb-chip--done' };
  function doubtItemHtml(d, withdraw) {
    return '<div class="wb-doubt"><div class="wb-doubt-top"><span class="wb-chip' + (DOUBT_CHIP[d.status] || '') + '">' + esc(d.status) + '</span>' +
      (d.section ? '<span class="wb-muted">' + esc(d.section) + '</span>' : '') + '<span class="wb-muted">' + esc(relTime(d.date)) + '</span></div>' +
      '<p>' + esc(d.text) + '</p>' + (d.reply ? '<div class="wb-doubt-reply"><b>Respuesta de Agora</b><p>' + esc(d.reply) + '</p></div>' : '') +
      (withdraw && d.status === 'Pendiente' ? '<button type="button" class="wb-linkbtn" data-act="doubt-withdraw" data-id="' + esc(d.id) + '">Retirar</button>' : '') + '</div>';
  }
  function doubtsHomeHtml() {
    const s = nextSessionC();
    if (!S.doubts.length && !s) return '';
    return '<section class="wb-sec" data-doubts-home><div class="wb-row"><div><span class="wb-pill">Dudas para el taller</span>' +
      '<h2 class="wb-h2">¿Algo que quieras revisar en vivo?</h2></div>' +
      (s ? '<button type="button" class="wb-btn wb-btn--ghost wb-btn--sm" data-act="doubt-open" data-field="">' + ICON.help + 'Nueva duda</button>' : '') + '</div>' +
      '<p class="wb-muted wb-mt">' + (s ? esc(S.facilitator) + ' las revisa en el ' + esc(sessionShort(s)) + '. También puedes enviarlas desde cada sección de tus Blueprints.' : 'Aquí ves el estado de tus dudas.') + '</p>' +
      '<div data-doubt-slot=""></div>' +
      (S.doubts.length ? '<div class="wb-doubts">' + S.doubts.map((d) => doubtItemHtml(d, true)).join('') + '</div>' : '') + '</section>';
  }

  /* ===================== CALENDARIO Y FEEDBACK ===================== */
  function utcStamp(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function sessionRange(s) { const a = mxMs(s.date, s.start), b = s.end ? mxMs(s.date, s.end) : a + 2 * 3600e3; return [a, b]; }
  function gcalUrl(s) {
    const r = sessionRange(s);
    const details = 'Sprint Ejecutivo · Agora Growth\n' + (safeUrl(s.meet) ? 'Únete aquí: ' + s.meet + '\n' : 'La liga para unirte está en tu workbook.\n') + 'Tu workbook: ' + CFG.workbookUrl;
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent('Sprint Ejecutivo · ' + s.title) +
      '&dates=' + utcStamp(r[0]) + '/' + utcStamp(r[1]) + '&details=' + encodeURIComponent(details) + '&location=' + encodeURIComponent(safeUrl(s.meet) || CFG.workbookUrl) + '&ctz=' + encodeURIComponent(MX_TZ);
  }
  function downloadIcs(s) {
    const r = sessionRange(s), c = S.me.cohort;
    const e = (x) => String(x).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Agora Growth//Sprint Ejecutivo//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:sprint-' + (c && c.id || 'c') + '-' + s.n + '@agoragrowth.com', 'DTSTAMP:' + utcStamp(Date.now()), 'DTSTART:' + utcStamp(r[0]), 'DTEND:' + utcStamp(r[1]),
      'SUMMARY:' + e('Sprint Ejecutivo · ' + s.title),
      'DESCRIPTION:' + e('Sprint Ejecutivo · Agora Growth\n' + (safeUrl(s.meet) ? 'Únete aquí: ' + s.meet + '\n' : 'La liga para unirte está en tu workbook.\n') + 'Tu workbook: ' + CFG.workbookUrl),
      'LOCATION:' + e(safeUrl(s.meet) || CFG.workbookUrl), 'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:' + e(s.title), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'Sprint-Ejecutivo-sesion-' + s.n + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }
  // Typeform con campos ocultos (email, nombre, cohorte y sesión) para que la respuesta llegue identificada.
  function feedbackUrl(s) {
    const u = safeUrl(s && s.feedback);
    if (!u || !S.me) return '';
    const q = 'email=' + encodeURIComponent(S.me.profile.email || '') + '&nombre=' + encodeURIComponent(S.me.profile.name || '') +
      '&cohorte=' + encodeURIComponent((S.me.cohort && S.me.cohort.name) || '') + '&sesion=' + s.n;
    return u + (u.indexOf('#') >= 0 ? '&' : '#') + q;
  }

  /* ===================== SEGUIMIENTO DEL PLAN DE 90 DÍAS ===================== */
  function checkins() {
    const today = mxToday();
    return (S.followup || []).map((f) => {
      const cp = CONTENT.followup.checkpoints.find((x) => x.n === f.n) || {};
      return Object.assign({}, cp, f, { open: today >= f.date, sent: filled(S.answers['SEG' + f.n + '_ENVIADO']) });
    });
  }
  function openCheckin() { return checkins().filter((c) => c.open && !c.sent).pop() || null; }
  function followupCard() {
    const oc = openCheckin(), list = checkins(), done = list.filter((c) => c.sent).length;
    return '<a class="wb-card wb-card--link wb-card--guide" href="#wb/seguimiento' + (oc ? '/' + oc.n : '') + '"><span class="wb-pill' + (oc ? '' : ' wb-pill--ink') + '">' + (oc ? 'Check-in abierto' : 'Después del Sprint') + '</span>' +
      '<strong class="wb-h3">' + esc(CONTENT.followup.title) + '</strong><span class="wb-muted">' + (list.length ? done + ' de ' + list.length + ' check-ins enviados' : 'Check-ins a los 30, 60 y 90 días') + '</span>' + ICON.right + '</a>';
  }

  function renderFollowup(focus) {
    const FU = CONTENT.followup, list = checkins();
    const cards = list.map((c) => {
      const per = CONTENT.plan.periods.find((p) => p.id === c.period);
      const goal = S.answers['PLAN_' + c.period + '_OBJETIVO'], acts = S.answers['PLAN_' + c.period + '_ACCIONES'];
      const id = (k) => 'SEG' + c.n + '_' + k;
      const chip = c.sent ? '<span class="wb-chip wb-chip--done">' + ICON.check + 'Enviado</span>' : c.open ? '<span class="wb-chip">Abierto</span>' : '<span class="wb-chip wb-chip--muted">Se abre el ' + esc(dayLong(c.date).toLowerCase()) + '</span>';
      let body = '<div class="wb-fu-goal"><span class="wb-kicker">Tu plan · ' + esc(per ? per.label : '') + '</span>' +
        (filled(goal) ? '<p><b>Objetivo:</b> ' + esc(goal) + '</p>' : '<p class="wb-muted">Aún no escribes el objetivo de este periodo. <a href="#wb/plan">Ir a mi plan</a></p>') +
        (filled(acts) ? '<p><b>Acciones clave:</b> ' + esc(acts) + '</p>' : '') + '</div>';
      if (c.open || c.sent) {
        const st = S.answers[id('ESTADO')] || '';
        body += '<div class="wb-field"><span>' + esc(FU.statusLabel) + '</span><div class="wb-fu-status" role="radiogroup">' + FU.status.map((x) =>
          '<button type="button" class="wb-chipbtn' + (st === x ? ' is-on' : '') + '" role="radio" aria-checked="' + (st === x) + '" data-act="fu-status" data-field="' + id('ESTADO') + '" data-value="' + esc(x) + '">' + esc(x) + '</button>').join('') + '</div></div>' +
          FU.questions.map((q) => '<label class="wb-field"><span>' + esc(c.n === 90 && q.label90 ? q.label90 : q.label) + '</span>' + (q.hint ? '<em class="wb-hint">' + esc(q.hint) + '</em>' : '') +
            '<textarea class="wb-ta wb-ta--sm" data-field="' + id(q.id) + '" rows="2" maxlength="5000">' + esc(S.answers[id(q.id)] || '') + '</textarea></label>').join('') +
          toggleRow(id('AYUDA'), FU.help) +
          (copOn() && copReady() ? '<div class="wb-secbar"><span class="wb-secbar-label">' + ICON.spark + 'Copiloto</span><button type="button" class="wb-chipbtn" data-act="cop" data-kind="chip" data-msg="' + esc('Ayúdame con mi check-in de ' + c.n + ' días: compara lo que logré con mi plan y sugiéreme qué ajustar.') + '">Ayúdame con este check-in</button></div>' : '') +
          '<div class="wb-actions">' + (c.sent ? '<span class="wb-ok">' + ICON.check + 'Enviado el ' + esc(dayLong(S.answers[id('ENVIADO')]).toLowerCase() || '') + '. Puedes seguir editándolo.</span>' :
            '<button type="button" class="wb-btn" data-act="fu-send" data-n="' + c.n + '">' + esc(FU.send) + '</button>') + '</div>';
      } else {
        body += '<p class="wb-small">Te escribimos ese día para recordártelo.</p>';
      }
      return '<section class="wb-card wb-fu' + (c.open && !c.sent ? ' is-open' : '') + '" id="wb-fu-' + c.n + '"><div class="wb-row"><div><span class="wb-kicker">Día ' + c.n + '</span><h2 class="wb-h3">' + esc(c.title) + '</h2></div>' + chip + '</div>' + body + '</section>';
    }).join('');
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a></div>' +
      '<div class="wb-bphead"><span class="wb-pill">Después del Sprint</span><h1 class="wb-h1">' + esc(FU.title) + '</h1><p class="wb-lead">' + esc(FU.intro) + '</p></div>' +
      (cards ? '<div class="wb-fus">' + cards + '</div>' : '<div class="wb-empty"><strong>Las fechas de tus check-ins aparecerán cuando tu cohorte tenga sus sesiones.</strong></div>') +
      '<nav class="wb-pager"><a href="#wb/plan">' + ICON.left + '<span><small>Tu plan</small>' + esc(CONTENT.plan.title) + '</span></a><a class="is-next" href="#wb/inicio"><span><small>Listo</small>Volver al inicio</span>' + ICON.right + '</a></nav>'
    );
    const el = focus && view.querySelector('#wb-fu-' + focus);
    if (el) setTimeout(() => { try { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { el.scrollIntoView(); } }, 60);
  }

  /* ===================== MI EMPRESA ===================== */
  function companyFields() { const out = []; ((CONTENT && CONTENT.company && CONTENT.company.groups) || []).forEach((g) => g.fields.forEach((f) => out.push(f))); return out; }
  function companyProgress(ans) {
    const f = companyFields(), a = ans || S.answers || {};
    const n = f.filter((x) => filled(a[x.id])).length;
    return { n: n, total: f.length, pct: f.length ? Math.round(n / f.length * 100) : 0 };
  }
  function companyLevel(pct) { return pct >= 80 ? 'Completo: tu copiloto ya conoce tu negocio' : pct >= 50 ? 'Bien: con unos datos más queda completo' : pct > 0 ? 'Vas empezando' : 'Sin empezar'; }
  // Texto para pegar en cualquier IA antes de un prompt.
  function companyContextText() {
    const a = S.answers || {}, L = ['Contexto de mi empresa (úsalo para responder con mi caso):'];
    companyFields().forEach((f) => {
      let v = a[f.id];
      if (f.id === 'EMP_NOMBRE' && !filled(v) && S.me && S.me.profile.company) v = S.me.profile.company;
      if (filled(v)) L.push('- ' + f.label.replace(/[?¿]/g, '') + ': ' + String(v).trim().replace(/\n+/g, ' / '));
    });
    ['PREP_META', 'PREP_CIERRE', 'PREP_INVERSION', 'PREP_PRIORIDAD'].forEach((id) => { const f = prepField(id); if (f && filled(a[id])) L.push('- ' + f.label + ': ' + String(a[id]).trim()); });
    return L.join('\n');
  }
  function companyCardHtml() {
    const c = companyProgress();
    if (c.pct >= 80) return '';
    return '<a class="wb-cmpcard" href="#wb/empresa" data-tour="empresa"><div class="wb-cmpcard-main"><span class="wb-pill wb-pill--lime">Paso 1 · 5 minutos</span>' +
      '<strong class="wb-h3">Cuéntanos de tu empresa</strong><span>' + (copOn() ? 'Así tu copiloto y tus prompts hablan de tu negocio, no en general.' : 'Así tus prompts de IA hablan de tu negocio, no en general.') +
      ' El equipo de Agora también lo usa para preparar los talleres con tu caso.</span></div>' +
      '<div class="wb-cmpcard-side"><b>' + c.n + '<small>/' + c.total + '</small></b><span class="wb-muted">datos de tu empresa</span>' + bar(c.pct) +
      '<span class="wb-btn wb-btn--sm">' + (c.n ? 'Continuar' : 'Empezar') + ICON.right + '</span></div></a>';
  }
  function companyFieldHtml(f) {
    const v = S.answers[f.id] || '';
    const label = '<span>' + esc(f.label) + (f.shared ? ' <i class="wb-shared">También en tu preparación</i>' : '') + '</span>' + (f.hint ? '<em class="wb-hint">' + esc(f.hint) + '</em>' : '');
    if (f.kind === 'chips') {
      return '<div class="wb-field wb-cmpfield"><span>' + esc(f.label) + '</span><div class="wb-fu-status" role="radiogroup" aria-label="' + esc(f.label) + '">' + f.options.map((o) =>
        '<button type="button" class="wb-chipbtn' + (v === o ? ' is-on' : '') + '" role="radio" aria-checked="' + (v === o) + '" data-act="emp-chip" data-field="' + f.id + '" data-value="' + esc(o) + '">' + esc(o) + '</button>').join('') + '</div></div>';
    }
    const input = f.kind === 'line' ?
      '<input class="wb-input" data-field="' + f.id + '" maxlength="300" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || '') + '">' :
      '<textarea class="wb-ta wb-ta--sm" data-field="' + f.id + '" rows="2" maxlength="5000" placeholder="' + esc(f.placeholder || '') + '">' + esc(v) + '</textarea>';
    return '<label class="wb-field wb-cmpfield">' + label + input + '</label>';
  }
  function renderCompany() {
    const K = CONTENT.company;
    if (!filled(S.answers.EMP_NOMBRE) && S.me.profile.company) setAnswer('EMP_NOMBRE', S.me.profile.company);
    const c = companyProgress();
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a></div>' +
      '<div class="wb-bphead"><span class="wb-pill">Paso 1 · Tu contexto</span><h1 class="wb-h1">' + esc(K.title) + '</h1><p class="wb-lead">' + esc(K.lead) + '</p></div>' +
      '<div class="wb-cmpbar" data-tour="cmp-progreso"><div><b data-cmpcount>' + c.n + '/' + c.total + '</b><span data-cmplevel>' + esc(companyLevel(c.pct)) + '</span></div>' + bar(c.pct) + '</div>' +
      '<section class="wb-cmpwhy" data-tour="cmp-why"><div><strong class="wb-h3">¿Por qué vale la pena?</strong><p>' + esc(K.why) + '</p></div>' +
      '<div class="wb-cmpvs"><div class="is-bad"><span>Sin tu contexto, tu IA te dice</span><p>«' + esc(K.before) + '»</p></div>' +
      '<div class="wb-cmpvs-good"><span>Con tu contexto</span><p>«' + esc(K.after) + '»</p></div></div></section>' +
      '<p class="wb-small">' + esc(K.note) + '</p>' +
      K.groups.map((g, i) => '<section class="wb-cmpgroup"' + (i === 0 ? ' data-tour="cmp-group"' : '') + '><h2 class="wb-h3"><span class="wb-num">' + (i + 1) + '</span>' + esc(g.title) + '</h2>' +
        (g.note ? '<p class="wb-small wb-small--top">' + esc(g.note) + '</p>' : '') + g.fields.map(companyFieldHtml).join('') + '</section>').join('') +
      '<section class="wb-cmpcopy"><div><strong>¿Usas otra IA?</strong><span>Copia tu contexto y pégalo antes de cualquier prompt del workbook.</span></div>' +
      '<button type="button" class="wb-btn wb-btn--ghost wb-btn--sm" data-act="copy-context">' + ICON.copy + 'Copiar mi contexto</button></section>' +
      '<nav class="wb-pager"><a href="#wb/inicio">' + ICON.left + '<span><small>Volver</small>Inicio</span></a>' +
      '<a class="is-next" href="#wb/guia"><span><small>Siguiente</small>Guía previa y preparación</span>' + ICON.right + '</a></nav>'
    );
  }
  function updateCompanyCount() {
    const el = view.querySelector('[data-cmpcount]');
    if (!el) return;
    const c = companyProgress();
    el.textContent = c.n + '/' + c.total;
    const lv = view.querySelector('[data-cmplevel]'); if (lv) lv.textContent = companyLevel(c.pct);
    const b = view.querySelector('.wb-cmpbar .wb-bar i'); if (b) b.style.width = c.pct + '%';
  }

  /* ===================== TUTORIAL (recorrido guiado) ===================== */
  const tourKey = () => 'agwb:tour:' + (S.me ? S.me.profile.id : '');
  let TOUR = null;
  function tourInviteHtml() {
    if (store.get(tourKey())) return '';
    return '<div class="wb-tourinvite" data-tourinvite>' + ICON.tour + '<div><strong>¿Primera vez aquí?</strong><span>Te muestro tu workbook en unos minutos: qué es cada parte y qué te toca llenar. Lo puedes repetir cuando quieras desde «Tutorial».</span></div>' +
      '<div class="wb-actions"><button type="button" class="wb-btn wb-btn--sm" data-act="tour">Hacer el recorrido</button><button type="button" class="wb-linkbtn" data-act="tour-dismiss">Ahora no</button></div></div>';
  }
  function tourSteps() {
    const F = S.facilitator, st = copState(), cop = st.mode === 'active';
    const s = [];
    const add = (chapter, route, sel, title, text) => s.push({ chapter: chapter, route: route, sel: sel, title: title, text: text });
    add('Bienvenida', 'wb/inicio', null, 'Te muestro tu workbook', 'Vamos a recorrer cada parte: qué es, para qué sirve y qué te toca llenar. Avanza con «Siguiente» o con las flechas del teclado. Puedes salir cuando quieras y repetir este recorrido desde el botón «Tutorial».');
    add('Inicio', 'wb/inicio', '[data-tour=tools]', 'Tu barra de herramientas', '«Mi empresa» es el contexto de tu negocio (lo vemos al final). «Tutorial» repite este recorrido. «Glosario» explica cada término del Sprint. «PDF» descarga tu workbook completo. No hay botón de guardar: todo lo que escribes se guarda solo.');
    add('Inicio', 'wb/inicio', '.wb-clock', 'El reloj del Sprint', 'Antes del kick-off cuenta el tiempo que falta. Durante el Sprint te dice cuándo es la próxima sesión en vivo y qué te toca hacer hoy. Todos los horarios están en hora de la Ciudad de México.');
    add('Inicio', 'wb/inicio', ['[data-tour=empresa]', '[data-tour=tool-empresa]'], 'Paso 1: Mi empresa', 'Unos 5 minutos sobre tu negocio: a qué te dedicas, tu tamaño, cómo vendes hoy y tu reto principal. Con eso, ' + (cop ? 'tu copiloto y ' : '') + 'los prompts del workbook te responden sobre tu caso y no en general.');
    add('Inicio', 'wb/inicio', '[data-tour=avance]', 'Tu avance', 'El porcentaje de las 43 secciones que ya respondiste, cuántos de los 8 Blueprints marcaste como terminados y cómo va tu plan de 90 días.');
    add('Inicio', 'wb/inicio', '[data-tour=guia]', 'La guía previa', 'El porqué del Sprint y tu preparación antes del kick-off. Te la enseño en un momento.');
    add('Inicio', 'wb/inicio', '[data-sessions]', 'Tus sesiones en vivo', 'Las 3 sesiones de tu cohorte con fecha y hora. Aquí aparece el botón «Unirme» (se ilumina 15 minutos antes) y puedes agregarlas a tu calendario. Al terminar cada una verás la repetición y el formulario para darnos tu feedback.');
    add('Inicio', 'wb/inicio', '[data-doubts-home]', 'Dudas para el taller', '¿Algo que quieras revisar en vivo? Escríbelo aquí o desde cualquier sección de tus Blueprints. ' + F + ' las revisa en la siguiente sesión y aquí ves si ya se vio y su respuesta.');
    add('Inicio', 'wb/inicio', '[data-tour=pasos]', 'Cómo trabajar cada sección', 'Los 4 pasos que vas a repetir en todo el workbook: lee la pregunta, responde en 2 o 3 líneas, acelera con IA y valida contra el ejemplo y el kit de práctica.');
    add('Inicio', 'wb/inicio', '[data-tour=ruta]', 'Tu ruta de 5 días', 'Lo que toca cada día del Sprint, del kick-off al cierre. Marca cada bloque cuando lo termines para no atrasarte: los Blueprints 1, 2 y 3 son la base de todo lo demás.');
    add('Inicio', 'wb/inicio', '[data-tour=blueprints]', 'Los 8 Blueprints', 'El corazón del workbook. Cada Blueprint responde una pregunta de tu sistema de ingresos y tiene de 4 a 8 secciones. Aquí ves cuántas llevas en cada uno. Vamos a abrir el primero.');
    add('Blueprint', 'wb/bp/1', '.wb-tabs2', 'Tres pestañas en cada Blueprint', '«Completa» es donde escribes tus respuestas. «Kit de práctica» trae un caso resuelto, calculadoras y una rúbrica para revisarte. «Recursos» tiene materiales, preguntas frecuentes y lecturas.');
    add('Blueprint', 'wb/bp/1', '.wb-take', 'Qué te llevas', 'El resultado que vas a tener al terminar este Blueprint. Léelo antes de empezar: es tu meta.');
    add('Blueprint', 'wb/bp/1', '[data-tour=vs]', 'Mal hecho vs. bien hecho', 'Así se ve una respuesta vaga y una que sí sirve. Compara las tuyas con la de la derecha: concreta, con números y con tu cliente bien definido.');
    add('Blueprint', 'wb/bp/1', '.wb-master', 'El prompt maestro', 'Un prompt para trabajar todo el Blueprint con IA. ' + (cop ? 'Con «Hacerlo con mi copiloto» lo trabajas aquí mismo con tus datos; o cópialo para usarlo en otra IA.' : 'Cópialo, cambia lo que va entre [corchetes] por tus datos y pégalo en tu asistente de IA. Si ya llenaste «Mi empresa», usa «Copiar con mi contexto».'));
    add('Blueprint', 'wb/bp/1', '#wb-BP1_S1', 'Cada sección es una pregunta', 'Arriba está la pregunta. En verde ves lo que escribiste en tu preparación, como referencia. Responde en 2 o 3 líneas; si tienes más de un ICP o producto, responde para cada uno.');
    add('Blueprint', 'wb/bp/1', '#wb-BP1_S1 textarea', 'Aquí escribes tu respuesta', 'Se guarda sola mientras escribes (abajo a la izquierda verás «Guardado»). Puedes salir y volver cuando quieras, desde cualquier dispositivo.');
    add('Blueprint', 'wb/bp/1', '#wb-BP1_S1 .wb-secbar', 'Ayuda en cada sección', cop ? '«Ayúdame a empezar», «Revisa mi respuesta» y «Hazla más concreta» abren tu copiloto con esta sección. Con «Duda para el taller» le mandas a ' + F + ' lo que quieras revisar en vivo.' :
      'Con «Duda para el taller» le mandas a ' + F + ' lo que quieras revisar en vivo; va con tu respuesta para dar contexto.');
    add('Blueprint', 'wb/bp/1', '#wb-BP1_S1 .wb-prompt', 'Un prompt para cada sección', 'Cada sección trae su prompt para tu IA. Cambia los [corchetes] por tus datos. Revisa siempre lo que te devuelva: la IA acelera el borrador, pero el criterio es tuyo.');
    add('Blueprint', 'wb/bp/1', '.wb-kitcta', 'Después, compara con el kit', 'Cuando tengas tu borrador, abre el kit de práctica del Blueprint. Vamos a verlo.');
    add('Kit de práctica', 'wb/bp/1/kit', '.wb-case', 'El caso resuelto', 'Un ejemplo completo de este Blueprint hecho por otra empresa, paso a paso. Úsalo como referencia de nivel, no como plantilla para copiar.');
    add('Kit de práctica', 'wb/bp/1/kit', '.wb-tool-card', 'Calculadoras', 'Escribe tus números y la calculadora hace la cuenta. Con «Llevar a mi respuesta» el resultado se agrega a la sección que corresponde.');
    add('Kit de práctica', 'wb/bp/1/kit', '.wb-rubric', 'La rúbrica', 'Cinco puntos que debe cumplir tu Blueprint. Marca los que ya cumples: lo que quede sin marcar es lo primero que debes corregir. Al final, marca el Blueprint como terminado.');
    add('Guía previa', 'wb/guia', ['.wb-gchoice', '.wb-gchs'], 'La guía previa', 'Te explica por qué el Sprint funciona como funciona. Elige cómo recorrerla: en video, en PDF o por capítulos aquí mismo.');
    add('Guía previa', 'wb/guia', '.wb-prepcta', 'Tu preparación antes del kick-off', 'El capítulo interactivo: tus segmentos, tus números y tu agenda (13 puntos). Llénalo antes del lunes; esos datos aparecen después como referencia en el Blueprint 1.');
    add('Cierre', 'wb/plan', '.wb-period', 'Tu plan de 90 días', 'El cierre del Sprint: qué vas a implementar en los días 1 a 30, 31 a 60 y 61 a 90, con responsable y fecha. Lo revisamos juntos el viernes. Después te escribimos a los 30, 60 y 90 días para ver cómo vas.');
    add('Mi empresa', 'wb/empresa', '[data-tour=cmp-why]', 'Mi empresa: tu primer paso', 'Este es el contexto de tu negocio. Mira la diferencia entre una respuesta sin contexto y una con contexto: eso es lo que ganas con 5 minutos.');
    add('Mi empresa', 'wb/empresa', '[data-tour=cmp-group]', 'Llénalo a tu ritmo', 'Un rango está bien y lo que no sepas lo dejas vacío. Tus segmentos y números son los mismos de tu preparación: si los llenas aquí, quedan allá también. Todo se guarda solo.');
    if (st.mode === 'active') add('Copiloto', 'wb/empresa', '.wb-fab', 'Tu Copiloto IA', 'Pregúntale lo que quieras del contenido, de tus sesiones o de tu caso. Te puede proponer borradores (tú decides si los insertas) y revisar tus respuestas con la rúbrica. Tienes ' + (st.dailyLimit || '') + ' mensajes al día' + (st.until ? ', hasta el ' + dayLong(st.until).toLowerCase() : '') + '.');
    else if (st.mode === 'locked') add('Copiloto', 'wb/empresa', '.wb-fab', 'Copiloto IA', 'Este botón es el Copiloto IA: un asistente que conoce todo el Sprint y tu workbook. No está incluido en tu Sprint; si te interesa, pregúntale a ' + F + '.');
    add('Listo', 'wb/empresa', null, 'Ya conoces tu workbook', 'Tu primer paso: completa «Mi empresa» (estás aquí) y después tu preparación en la guía previa. Si algo no queda claro, repite este recorrido desde «Tutorial» o mándanos una duda para el taller.');
    return s;
  }

  function startTour() {
    closeLayer();
    store.set(tourKey(), '1');
    const inv = view.querySelector('[data-tourinvite]'); if (inv) inv.remove();
    TOUR = { steps: tourSteps(), i: 0, dir: 1, token: 0 };
    window.addEventListener('scroll', tourReposition, { passive: true });
    window.addEventListener('resize', tourReposition);
    tourShow();
  }
  function endTour() {
    if (!TOUR) return;
    TOUR = null;
    window.removeEventListener('scroll', tourReposition);
    window.removeEventListener('resize', tourReposition);
    const slot = root.querySelector('.wb-tour-slot'); if (slot) slot.innerHTML = '';
  }
  function tourFind(sel) {
    const list = Array.isArray(sel) ? sel : [sel];
    for (const q of list) { const el = root.querySelector(q); if (el && el.getClientRects().length) return el; }
    return null;
  }
  async function tourShow() {
    const T0 = TOUR;
    if (!T0) return;
    const token = ++T0.token, step = T0.steps[T0.i];
    if (step.route && route().slice(0, 4).join('/') !== step.route) {
      if (location.hash !== '#' + step.route) location.hash = step.route; else render();
      await new Promise((r) => setTimeout(r, 150));
      if (TOUR !== T0 || token !== T0.token) return;
    }
    let el = null;
    if (step.sel) {
      for (let k = 0; k < 40 && !el; k++) { el = tourFind(step.sel); if (!el) await new Promise((r) => setTimeout(r, 60)); }
      if (TOUR !== T0 || token !== T0.token) return;
      if (!el) {   // no existe en esta pantalla (ej. sin sesiones próximas): se salta
        const n = T0.i + T0.dir;
        if (n < 0 || n >= T0.steps.length) return endTour();
        T0.i = n; return tourShow();
      }
      const fixed = getComputedStyle(el).position === 'fixed';
      if (!fixed) {
        const r = el.getBoundingClientRect(), vh = window.innerHeight, mobile = window.innerWidth <= 560;
        const room = mobile ? vh * 0.5 : vh - 40;
        const top = r.height > room - 80 ? 80 : Math.max(80, (room - r.height) / 2);
        window.scrollTo(0, Math.max(0, window.pageYOffset + r.top - top));
      }
      await new Promise((r) => setTimeout(r, 120));
      if (TOUR !== T0 || token !== T0.token) return;
    }
    T0.el = el;
    tourRender();
  }
  function tourRender() {
    if (!TOUR) return;
    const T0 = TOUR, step = T0.steps[T0.i], n = T0.steps.length, last = T0.i === n - 1;
    const slot = root.querySelector('.wb-tour-slot');
    slot.innerHTML = '<div class="wb-tour' + (T0.el ? '' : ' is-center') + '" role="dialog" aria-modal="true" aria-label="Recorrido por tu workbook">' +
      '<div class="wb-tour-shade"></div><div class="wb-tour-hole"></div>' +
      '<div class="wb-tour-card"><div class="wb-tour-top"><span class="wb-kicker">' + esc(step.chapter) + ' · ' + (T0.i + 1) + ' de ' + n + '</span>' +
      '<button type="button" class="wb-icon" data-act="tour-end" aria-label="Salir del recorrido">' + ICON.x + '</button></div>' +
      '<strong class="wb-tour-title">' + esc(step.title) + '</strong><p>' + esc(step.text) + '</p>' +
      '<div class="wb-tour-bar"><i style="width:' + Math.round((T0.i + 1) / n * 100) + '%"></i></div>' +
      '<div class="wb-tour-nav">' + (T0.i ? '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="tour-prev">' + ICON.left + 'Atrás</button>' : '<span></span>') +
      '<button type="button" class="wb-btn wb-btn--sm" data-act="' + (last ? 'tour-end' : 'tour-next') + '">' + (last ? 'Terminar' : T0.i === 0 ? 'Empezar' : 'Siguiente') + (last ? '' : ICON.right) + '</button></div></div></div>';
    tourReposition();
    const btn = slot.querySelector('[data-act=tour-next], .wb-tour-nav [data-act=tour-end]');
    if (btn) try { btn.focus({ preventScroll: true }); } catch (e) { }
  }
  function tourReposition() {
    if (!TOUR) return;
    const slot = root.querySelector('.wb-tour-slot'), hole = slot.querySelector('.wb-tour-hole'), card = slot.querySelector('.wb-tour-card');
    if (!hole || !card) return;
    const el = TOUR.el, vw = window.innerWidth, vh = window.innerHeight, mobile = vw <= 560;
    if (!el || !el.isConnected) { hole.style.display = 'none'; card.style.cssText = ''; return; }
    const r = el.getBoundingClientRect(), pad = 8;
    hole.style.display = 'block';
    hole.style.top = (r.top - pad) + 'px'; hole.style.left = Math.max(4, r.left - pad) + 'px';
    hole.style.width = Math.min(vw - 8, r.width + pad * 2) + 'px'; hole.style.height = (r.height + pad * 2) + 'px';
    if (mobile) {   // en móvil la tarjeta va abajo; si el objetivo está abajo (ej. el botón del copiloto), arriba
      card.style.cssText = '';
      card.classList.toggle('is-top', r.top > vh - (card.offsetHeight || 240) - 16);
      return;
    }
    const cw = Math.min(400, vw - 32), ch = card.offsetHeight || 220;
    let top = r.bottom + pad + 14;
    if (top + ch > vh - 12) top = r.top - pad - 14 - ch;
    if (top < 12) top = Math.max(12, vh - ch - 16);
    const left = Math.max(16, Math.min(vw - cw - 16, r.left));
    card.style.cssText = 'top:' + Math.round(top) + 'px;left:' + Math.round(left) + 'px;width:' + cw + 'px';
  }
  function tourMove(d) {
    if (!TOUR) return;
    const n = TOUR.i + d;
    if (n < 0) return;
    if (n >= TOUR.steps.length) return endTour();
    TOUR.i = n; TOUR.dir = d; tourShow();
  }

  /* ===================== ADMIN ===================== */
  function adminTop() {
    return '<div class="wb-top"><div class="wb-hello"><span class="wb-kicker">Panel de Agora · Workbook</span><strong>' + esc(S.admin.me && S.admin.me.name ? 'Hola, ' + first(S.admin.me.name) : 'Panel de admin') + '</strong></div>' +
      '<div class="wb-tools"><button type="button" class="wb-tool" data-act="refresh">Actualizar</button><button type="button" class="wb-tool wb-tool--ghost" data-act="logout"><span>Salir</span></button></div></div>';
  }

  function renderAdmin() {
    const r = route();
    if (r[1] === 'cohorte' && r[2]) return adminCohort(r[2]);
    if (r[1] === 'participante' && r[2]) return adminWorkbook(r[2]);
    return adminCohorts();
  }

  const stale = (o) => !o || Date.now() - (o._at || 0) > 60000;
  async function adminCohorts(force) {
    if (stale(S.admin.cohorts) || force) {
      renderLoading('Cargando cohortes…');
      try {
        const out = await api('admin.overview');
        if (!out.ok) throw new Error(out.message || out.error);
        S.admin.cohorts = out.cohorts; S.admin.cohorts._at = Date.now();
        if (out.settings) S.admin.settings = out.settings;
        if (out.feedbackSheet) S.admin.feedbackSheet = out.feedbackSheet;
      } catch (e) { if (e.code !== 'auth') renderError(e); return; }
      if (route()[1] !== 'cohortes') return;
    }
    const list = S.admin.cohorts;
    const cards = list.map((c) => {
      const k = parseIso(c.kickoff);
      return '<a class="wb-cohort' + (c.status === 'Cerrada' ? ' is-closed' : '') + '" href="#wb/cohorte/' + esc(c.id) + '">' +
        '<div class="wb-cohort-head"><strong>' + esc(c.name) + '</strong><span class="wb-chip' + (c.status === 'Cerrada' ? ' wb-chip--muted' : ' wb-chip--done') + '">' + esc(c.status) + '</span></div>' +
        '<span class="wb-muted">Kick-off: ' + (k ? esc(shortDate(k) + ' ' + k.getFullYear()) : '—') + '</span>' +
        cohortSessionsLine(c.sessions) +
        '<div class="wb-cohort-stats"><span><b>' + c.participants + '</b> ' + (c.participants === 1 ? 'participante' : 'participantes') + '</span><span><b>' + c.avgProgress + '%</b> avance promedio</span><span><b>' + c.finished + '</b> con los 8 Blueprints</span></div>' +
        bar(c.avgProgress) +
        ((c.copilotOn || c.doubtsPending) ? '<div class="wb-cohort-extra">' + (c.copilotOn ? '<span>' + ICON.spark + c.copilotOn + ' con copiloto · US$' + money2(c.copilotCost) + '</span>' : '') +
          (c.doubtsPending ? '<span class="wb-warn">' + ICON.help + c.doubtsPending + (c.doubtsPending === 1 ? ' duda pendiente' : ' dudas pendientes') + '</span>' : '') + '</div>' : '') + '</a>';
    }).join('');
    show(
      adminTop() +
      '<div class="wb-bphead wb-row"><div><span class="wb-pill">Cohortes</span><h1 class="wb-h1">Sprint Ejecutivo</h1></div>' +
      '<button type="button" class="wb-btn" data-act="new-cohort">' + ICON.plus + 'Nueva cohorte</button></div>' +
      '<div data-newcohort></div>' + copSettingsHtml() +
      (list.length ? '<div class="wb-cohorts">' + cards + '</div>' :
        '<div class="wb-empty"><strong>Todavía no hay cohortes.</strong><span>Crea la primera para empezar a dar de alta participantes.</span></div>')
    );
  }

  // Una línea para la tarjeta de la cohorte: próxima sesión y ligas/grabaciones que faltan.
  function cohortSessionsLine(sessions) {
    if (!sessions || !sessions.length) return '';
    const now = Date.now();
    const infos = sessions.map((s) => sessionInfo(s, now));
    const ni = infos.findIndex((x) => x.state !== 'ended' && x.state !== 'tbd');
    const noMeet = sessions.filter((s, i) => infos[i].state !== 'ended' && !safeUrl(s.meet)).length;
    const noRec = sessions.filter((s, i) => infos[i].state === 'ended' && !safeUrl(s.recording)).length;
    const nextTxt = ni >= 0 ? 'Próxima sesión: ' + shortDate(parseIso(sessions[ni].date)) + (sessions[ni].start ? ' · ' + fmtRange(sessions[ni].start, sessions[ni].end) : '') : 'Sesiones terminadas';
    return '<span class="wb-cohort-next">' + esc(nextTxt) +
      (noMeet ? ' <b class="wb-warn">Falta' + (noMeet > 1 ? 'n ' + noMeet + ' ligas' : ' 1 liga') + ' de Meet</b>' : '') +
      (noRec ? ' <b class="wb-warn">Falta' + (noRec > 1 ? 'n ' + noRec + ' grabaciones' : ' 1 grabación') + '</b>' : '') + '</span>';
  }

  function sessionDefaults() { return (S.admin.me && S.admin.me.sessionDefaults) || SESSION_FALLBACK; }

  // Campos de una sesión (alta de cohorte y edición de una sesión).
  function sessionFields(prefix, s, opts) {
    return '<div class="wb-grid4">' +
      '<label class="wb-field"><span>Título</span><input class="wb-input" name="' + prefix + 'title" maxlength="80" value="' + esc(s.title || '') + '"></label>' +
      '<label class="wb-field"><span>Fecha</span><input class="wb-input" name="' + prefix + 'date" type="date" value="' + esc(s.date || '') + '"' + (opts && opts.auto ? ' data-auto="1"' : '') + '></label>' +
      '<label class="wb-field"><span>De <em>(CDMX)</em></span><input class="wb-input" name="' + prefix + 'start" type="time" step="900" value="' + esc(s.start || '') + '"></label>' +
      '<label class="wb-field"><span>A <em>(CDMX)</em></span><input class="wb-input" name="' + prefix + 'end" type="time" step="900" value="' + esc(s.end || '') + '"></label></div>' +
      '<label class="wb-field"><span>Liga de Google Meet <em>(o de la invitación)</em></span><input class="wb-input" name="' + prefix + 'meet" type="url" inputmode="url" maxlength="500" placeholder="https://meet.google.com/…" value="' + esc(s.meet || '') + '"></label>' +
      (opts && opts.recording ? '<label class="wb-field"><span>Liga de la grabación <em>(Google Drive)</em></span><input class="wb-input" name="' + prefix + 'recording" type="url" inputmode="url" maxlength="500" placeholder="https://drive.google.com/…" value="' + esc(s.recording || '') + '"></label>' +
        '<p class="wb-small">Comparte la grabación en Drive como «Cualquier persona con el enlace puede ver»; si no, los participantes no podrán abrirla.</p>' +
        '<label class="wb-field"><span>Formulario de feedback <em>(Typeform)</em></span><input class="wb-input" name="' + prefix + 'feedback" type="url" inputmode="url" maxlength="500" placeholder="https://…typeform.com/to/…" value="' + esc(s.feedback || '') + '"></label>' +
        '<p class="wb-small">Les aparece en la tarjeta de la sesión desde que empieza. Si lo dejas vacío, esta sesión no lleva formulario.</p>' : '');
  }

  function readSessionForm(F, prefix) {
    const v = (k) => (F[prefix + k] ? F[prefix + k].value.trim() : undefined);
    const s = { title: v('title'), date: v('date'), start: v('start'), end: v('end'), meet: v('meet') };
    if (F[prefix + 'recording']) s.recording = v('recording');
    if (F[prefix + 'feedback']) s.feedback = v('feedback');
    return s;
  }

  function cohortForm(c) {
    const defs = sessionDefaults();
    const sessionsBlock = c ? '<p class="wb-small">Si cambias el kick-off, las 3 sesiones se mueven los mismos días. Sus horarios y ligas se editan en «Sesiones en vivo».</p>' :
      '<div class="wb-sessnew"><h4 class="wb-h4">Sesiones en vivo <span class="wb-muted">· hora de la Ciudad de México</span></h4>' +
      '<p class="wb-small">Las fechas se llenan solas al elegir el kick-off. La liga de Meet la puedes agregar ahora o después.</p>' +
      defs.map((d, i) => '<fieldset class="wb-fieldset"><legend>Sesión ' + (i + 1) + '</legend>' +
        sessionFields('s' + (i + 1) + '_', { title: d.title, start: d.start, end: d.end }, { auto: true }) + '</fieldset>').join('') + '</div>';
    return '<form class="wb-card wb-form" data-form="' + (c ? 'edit-cohort' : 'new-cohort') + '" novalidate>' +
      '<h3 class="wb-h3">' + (c ? 'Editar cohorte' : 'Nueva cohorte') + '</h3>' +
      '<div class="wb-grid2"><label class="wb-field"><span>Nombre</span><input class="wb-input" name="name" maxlength="80" value="' + esc(c ? c.name : '') + '" placeholder="Ej. Cohorte Noviembre 2026" required></label>' +
      '<label class="wb-field"><span>Kick-off (lunes)</span><input class="wb-input" name="kickoff" type="date" value="' + esc(c ? c.kickoff : '') + '" required></label></div>' +
      sessionsBlock +
      '<p class="wb-err" data-err></p>' +
      '<div class="wb-actions"><button class="wb-btn" type="submit" data-submit>' + (c ? 'Guardar cambios' : 'Crear cohorte') + '</button>' +
      '<button class="wb-btn wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
  }

  async function adminCohort(id, force) {
    if (force || stale(S.admin.detail[id])) {
      renderLoading('Cargando cohorte…');
      try {
        const out = await api('admin.cohort.detail', { id: id });
        if (!out.ok) throw new Error(out.error === 'not_found' ? 'Esa cohorte no existe.' : (out.message || out.error));
        S.admin.detail[id] = out; out._at = Date.now();
        if (out.settings) S.admin.settings = out.settings;
      } catch (e) { if (e.code !== 'auth') renderError(e); return; }
      if (route()[2] !== id) return;
    }
    const d = S.admin.detail[id], c = d.cohort;
    const k = parseIso(c.kickoff);
    const active = d.participants.filter((p) => p.status === 'Activo');
    const inactive = d.participants.filter((p) => p.status !== 'Activo');
    const totalActive = active.length;
    show(
      adminTop() +
      '<div class="wb-crumbs"><a href="#wb/cohortes">' + ICON.left + 'Cohortes</a></div>' +
      '<div class="wb-bphead wb-row"><div><span class="wb-pill' + (c.status === 'Cerrada' ? ' wb-pill--ink' : '') + '">' + esc(c.status) + '</span><h1 class="wb-h1">' + esc(c.name) + '</h1>' +
      '<p class="wb-lead">Kick-off: ' + (k ? esc(shortDate(k) + ' ' + k.getFullYear()) : '—') + ' · ' + totalActive + (totalActive === 1 ? ' participante' : ' participantes') + '</p></div>' +
      '<div class="wb-actions"><button type="button" class="wb-btn wb-btn--ghost" data-act="edit-cohort">Editar</button>' +
      '<button type="button" class="wb-btn wb-btn--ghost" data-act="toggle-cohort">' + (c.status === 'Cerrada' ? 'Reabrir' : 'Cerrar cohorte') + '</button></div></div>' +
      '<div data-editcohort></div>' +
      autoCard(d) +
      sessionsAdmin(c) +
      doubtsAdmin(d) +
      followupAdmin(d) +
      addPanel(c) +
      '<section class="wb-sec"><div class="wb-row"><div><span class="wb-pill">Participantes</span></div>' +
      (d.participants.length > 2 ? '<label class="wb-search wb-search--inline">' + ICON.search + '<input type="search" data-filter value="' + esc(S.admin.filter) + '" placeholder="Buscar por nombre, correo o empresa" aria-label="Buscar participante"></label>' : '') +
      '</div>' +
      (active.length ? '<div class="wb-people">' + active.map(personCard).join('') + '</div>' :
        '<div class="wb-empty"><strong>Aún no hay participantes activos.</strong><span>Agrégalos arriba: uno por uno o pegando una lista.</span></div>') +
      '<div class="wb-empty" data-nomatch hidden><strong>Nadie coincide con la búsqueda.</strong></div>' +
      (inactive.length ? '<details class="wb-inactive"><summary>Quitados (' + inactive.length + ')</summary><div class="wb-people">' + inactive.map(personCard).join('') + '</div></details>' : '') +
      '</section>' + questionsPanel(null)
    );
    filterPeople();
  }

  function sessionsAdmin(c) {
    const now = Date.now();
    const rows = (c.sessions || []).map((s) => {
      const inf = sessionInfo(s, now), meet = safeUrl(s.meet), rec = safeUrl(s.recording);
      const when = s.date ? dayLong(s.date) + (s.start ? ' · ' + fmtRange(s.start, s.end) : '') : 'Sin fecha';
      return '<div class="wb-sessrow" data-n="' + s.n + '">' +
        '<div class="wb-sessrow-main"><span class="wb-kicker">Sesión ' + s.n + (inf.state === 'ended' ? ' · terminada' : inf.state === 'live' ? ' · en vivo' : '') + '</span>' +
        '<strong>' + esc(s.title) + '</strong><span class="wb-muted">' + esc(when) + '</span></div>' +
        '<div class="wb-sesslinks">' +
        (meet ? '<a href="' + esc(meet) + '" target="_blank" rel="noopener">' + ICON.video + 'Meet</a>' : (inf.state === 'ended' ? '' : '<b class="wb-warn">Falta liga de Meet</b>')) +
        (rec ? '<a href="' + esc(rec) + '" target="_blank" rel="noopener">' + ICON.play + 'Grabación</a>' : (inf.state === 'ended' ? '<b class="wb-warn">Falta la grabación</b>' : '<span class="wb-muted">Grabación: después de la sesión</span>')) +
        (safeUrl(s.feedback) ? '<a href="' + esc(s.feedback) + '" target="_blank" rel="noopener">' + ICON.star + 'Feedback</a>' : '<span class="wb-muted">Sin formulario de feedback</span>') +
        '</div>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="edit-session" data-n="' + s.n + '">' + (inf.state === 'ended' && !rec ? 'Agregar grabación' : 'Editar') + '</button>' +
        '<div class="wb-sessform-slot" data-sess-slot></div></div>';
    }).join('');
    return '<section class="wb-card wb-sessadmin"><div class="wb-row"><h2 class="wb-h3">Sesiones en vivo</h2><span class="wb-muted wb-small0">Hora de la Ciudad de México</span></div>' + rows + '</section>';
  }

  function filterPeople() {
    const f = S.admin.filter.trim().toLowerCase();
    const cards = view.querySelectorAll('.wb-person');
    let vis = 0;
    cards.forEach((el) => { const on = !f || el.getAttribute('data-search').indexOf(f) >= 0; el.hidden = !on; if (on) vis++; });
    const nm = view.querySelector('[data-nomatch]');
    if (nm) nm.hidden = !(f && cards.length && !vis);
  }

  function addPanel(c) {
    const m = S.admin.addMode;
    const last = S.admin.lastAdd && S.admin.lastAdd.cohortId === c.id ? S.admin.lastAdd : null;
    return '<section class="wb-card wb-add">' +
      '<div class="wb-row"><h2 class="wb-h3">Agregar participantes</h2>' +
      '<div class="wb-tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (m === 'one') + '" data-act="add-mode" data-mode="one">Uno</button>' +
      '<button type="button" role="tab" aria-selected="' + (m === 'many') + '" data-act="add-mode" data-mode="many">Varios</button></div></div>' +
      '<form class="wb-form" data-form="add" novalidate>' +
      (m === 'one' ?
        '<div class="wb-grid3"><label class="wb-field"><span>Nombre</span><input class="wb-input" name="name" maxlength="80" required></label>' +
        '<label class="wb-field"><span>Correo</span><input class="wb-input" name="email" type="email" inputmode="email" maxlength="120" required></label>' +
        '<label class="wb-field"><span>Empresa <em>(opcional)</em></span><input class="wb-input" name="company" maxlength="80"></label></div>' :
        '<label class="wb-field"><span>Pega la lista: una persona por línea · Nombre, correo, empresa</span>' +
        '<textarea class="wb-ta wb-ta--list" name="list" rows="5" placeholder="Ana López, ana@empresa.com, Clínica Sol&#10;Beto Ruiz, beto@empresa.com"></textarea></label>' +
        '<p class="wb-small">También puedes copiar y pegar las columnas directo desde un Sheet o Excel.</p>') +
      '<label class="wb-checkline"><input type="checkbox" name="send" checked><span>Enviarles por correo su acceso (link, correo y PIN)</span></label>' +
      '<p class="wb-err" data-err></p>' +
      '<div class="wb-actions"><button class="wb-btn" type="submit" data-submit>' + ICON.plus + (m === 'one' ? 'Agregar' : 'Agregar lista') + '</button></div></form>' +
      (last ? addResult(last) : '') +
      '</section>';
  }

  function addResult(r) {
    const lines = r.added.map((p) => '<li><strong>' + esc(p.name) + '</strong> · ' + esc(p.email) + ' · PIN <code>' + esc(p.pin) + '</code>' +
      (p.sent ? ' · <span class="wb-ok">correo enviado</span>' : (p.sendError ? ' · <span class="wb-bad">no se pudo enviar el correo</span>' : '')) + '</li>').join('');
    const skipped = r.skipped.map((p) => '<li><strong>' + esc(p.name || '(sin nombre)') + '</strong> · ' + esc(p.email || '(sin correo)') + ' · <span class="wb-bad">' + esc(p.reason) + '</span></li>').join('');
    const copy = r.added.map((p) => p.name + ' · ' + p.email + ' · PIN ' + p.pin).join('\n');
    return '<div class="wb-result">' +
      (r.added.length ? '<p><b>' + r.added.length + (r.added.length === 1 ? ' persona agregada' : ' personas agregadas') + '</b></p><ul>' + lines + '</ul>' +
        copyBtn(copy, 'Copiar accesos') : '') +
      (r.skipped.length ? '<p><b>No se agregaron ' + r.skipped.length + '</b></p><ul>' + skipped + '</ul>' : '') + '</div>';
  }

  function personCard(p) {
    const showPin = !!S.admin.showPins[p.id];
    const chips = BPS.map((bp) => '<i class="' + (p.done.indexOf(bp.n) >= 0 ? 'on' : '') + '" title="Blueprint ' + bp.n + '">' + bp.n + '</i>').join('');
    const inactive = p.status !== 'Activo';
    const access = 'Hola, ' + first(p.name) + '. Tu acceso al Workbook del Sprint Ejecutivo:\n' + CFG.workbookUrl + '\nCorreo: ' + p.email + '\nPIN: ' + p.pin;
    return '<article class="wb-person' + (inactive ? ' is-inactive' : '') + '" data-pid="' + esc(p.id) + '" data-search="' + esc((p.name + ' ' + p.email + ' ' + p.company).toLowerCase()) + '">' +
      '<div class="wb-person-main"><strong>' + esc(p.name) + '</strong><span class="wb-muted">' + esc(p.email) + (p.company ? ' · ' + esc(p.company) : '') + '</span></div>' +
      '<div class="wb-person-pin"><span class="wb-label">PIN</span><code>' + (showPin ? esc(p.pin) : '••••••') + '</code>' +
      '<button type="button" class="wb-icon" data-act="pin-toggle" data-id="' + esc(p.id) + '" aria-label="' + (showPin ? 'Ocultar PIN' : 'Mostrar PIN') + '">' + ICON.eye + '</button>' +
      '<button type="button" class="wb-icon" data-act="copy" data-copy="' + esc(p.pin) + '" aria-label="Copiar PIN">' + ICON.copy + '</button></div>' +
      '<div class="wb-person-prog"><div class="wb-row-sm"><span><b>' + p.progress + '%</b> · ' + p.answered + '/' + p.total + ' secciones</span><span class="wb-muted">Plan ' + p.plan + '/9</span></div>' +
      '<div class="wb-row-sm wb-prepline"><span class="' + (p.prep >= (p.prepTotal || 13) ? 'wb-ok' : '') + '">Preparación ' + (p.prep || 0) + '/' + (p.prepTotal || 13) + '</span>' +
      '<span class="' + (p.companyTotal && p.companyN / p.companyTotal >= 0.8 ? 'wb-ok' : 'wb-muted') + '">Mi empresa ' + (p.companyN || 0) + '/' + (p.companyTotal || 23) + '</span></div>' +
      bar(p.progress) + '<div class="wb-bpdots" aria-label="Blueprints terminados">' + chips + '</div></div>' +
      '<div class="wb-person-meta"><span>' + (p.lastActivity ? 'Última actividad ' + esc(relTime(p.lastActivity)) : (p.lastLogin ? 'Entró ' + esc(relTime(p.lastLogin)) : 'Aún no entra')) + '</span>' +
      '<span>' + (p.sent ? 'Acceso enviado ' + esc(relTime(p.sent)) : 'Acceso no enviado') + '</span></div>' +
      (inactive ? '' : personCopHtml(p)) +
      '<div class="wb-person-actions">' +
      (inactive ? '<button type="button" class="wb-btn wb-btn--sm" data-act="reactivate" data-id="' + esc(p.id) + '">Reactivar</button>' :
        '<a class="wb-btn wb-btn--sm" href="#wb/participante/' + esc(p.id) + '">Ver workbook</a>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="fc-person" data-id="' + esc(p.id) + '">' + ICON.spark + 'Resumen con IA</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="admin-pdf" data-id="' + esc(p.id) + '">PDF</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="resend" data-id="' + esc(p.id) + '">Reenviar acceso</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="copy" data-copy="' + esc(access) + '">Copiar acceso</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="edit-person" data-id="' + esc(p.id) + '">Editar</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--danger" data-act="remove" data-id="' + esc(p.id) + '">Quitar</button>') +
      '</div><div data-edit-slot></div></article>';
  }

  function findPerson(id) {
    for (const k in S.admin.detail) {
      const p = S.admin.detail[k].participants.find((x) => x.id === id);
      if (p) return { cohortId: k, p: p };
    }
    return null;
  }
  function replacePerson(p) {
    const d = S.admin.detail[p.cohortId];
    if (!d) return;
    const i = d.participants.findIndex((x) => x.id === p.id);
    if (i < 0) return;
    const prev = d.participants[i];
    if (p.copilot && !p.copilot.state && prev.copilot) p.copilot.state = prev.copilot.state;
    d.participants[i] = Object.assign({}, prev, p);
  }

  async function getWorkbook(id, force) {
    if (!S.admin.workbooks[id] || force) {
      const out = await api('admin.participant.workbook', { id: id });
      if (!out.ok) throw new Error(out.error === 'not_found' ? 'Ese participante no existe.' : (out.message || out.error));
      S.admin.workbooks[id] = out;
    }
    return S.admin.workbooks[id];
  }

  async function adminWorkbook(id) {
    let w;
    renderLoading('Cargando workbook…');
    try { w = await getWorkbook(id, true); } catch (e) { if (e.code !== 'auth') renderError(e); return; }
    if (route()[2] !== id) return;
    const p = w.participant;
    const saved = S.answers; S.answers = w.answers;   // el render en solo lectura usa S.answers
    const pr = progress(w.answers);
    const blocks = BPS.map((bp) => {
      const b = bpProgress(bp, w.answers);
      return '<details class="wb-ro"' + (b.n ? ' open' : '') + '><summary><span class="wb-bpnum">' + bp.n + '</span><span><strong>' + esc(bp.title) + '</strong>' +
        '<small>' + b.n + '/' + b.total + ' secciones' + (b.done ? ' · terminado' : '') + '</small></span></summary>' +
        bp.sections.map((s) => '<div class="wb-ro-item"><h4>' + s.n + '. ' + esc(s.title) + '</h4><p class="wb-q">' + esc(s.question) + '</p>' + textarea(s.id, '', true) + '</div>').join('') +
        '</details>';
    }).join('');
    const prep = prepProgress(w.answers);
    const rub = BPS.reduce((a, bp) => a + rubricCount(bp, w.answers), 0);
    const prepBlock = '<details class="wb-ro"' + (prep.n ? ' open' : '') + '><summary><span class="wb-bpnum">' + ICON.compass + '</span><span><strong>Antes del kick-off · preparación</strong><small>' + prep.n + '/' + prep.total + ' completado</small></span></summary>' +
      '<div class="wb-ro-prep">' + prepHtml(true) + '</div></details>';
    const html = adminTop() +
      '<div class="wb-crumbs"><a href="#wb/cohorte/' + esc(p.cohortId) + '">' + ICON.left + esc(w.cohort ? w.cohort.name : 'Cohorte') + '</a></div>' +
      '<div class="wb-bphead wb-row"><div><span class="wb-pill">Solo lectura</span><h1 class="wb-h1">' + esc(p.name) + '</h1>' +
      '<p class="wb-lead">' + esc(p.email) + (p.company ? ' · ' + esc(p.company) : '') + (w.updated ? ' · Última actividad ' + esc(relTime(w.updated)) : '') + '</p></div>' +
      '<div class="wb-actions"><button type="button" class="wb-btn wb-btn--ghost" data-act="fc-person" data-id="' + esc(p.id) + '">' + ICON.spark + 'Resumen con IA</button><button type="button" class="wb-btn" data-act="admin-pdf" data-id="' + esc(p.id) + '">' + ICON.download + 'Descargar PDF</button></div></div>' +
      '<div class="wb-statrow"><div><b>' + pr.pct + '%</b><span>avance</span></div><div><b>' + pr.answered + '/' + pr.total + '</b><span>secciones</span></div>' +
      '<div><b>' + pr.done.length + '/8</b><span>Blueprints terminados</span></div><div><b>' + pr.plan + '/9</b><span>plan de 90 días</span></div>' +
      '<div><b>' + prep.n + '/' + prep.total + '</b><span>preparación</span></div><div><b>' + rub + '/40</b><span>rúbricas marcadas</span></div>' +
      '<div><b>' + companyProgress(w.answers).n + '/' + companyProgress(w.answers).total + '</b><span>Mi empresa</span></div></div>' +
      adminExtrasHtml(w) + adminCompanyHtml(w) +
      prepBlock + blocks +
      '<details class="wb-ro"' + (pr.plan ? ' open' : '') + '><summary><span class="wb-bpnum">90</span><span><strong>' + esc(CONTENT.plan.title) + '</strong><small>' + pr.plan + '/9 campos</small></span></summary>' + planHtml(true) + '</details>' +
      adminFollowupHtml(w);
    S.answers = saved;
    show(html);
  }

  /* ===================== ADMIN: COPILOTO, DUDAS Y SEGUIMIENTO ===================== */
  const money2 = (n) => (Number(n) || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const MODES = ['Activo', 'Bloqueado', 'Oculto'];

  function copSettingsHtml() {
    const st = S.admin.settings;
    if (!st) return '';
    const pct = st.budget > 0 ? Math.min(100, st.spent / st.budget * 100) : 100;
    const state = !st.enabled ? 'Apagado' : !st.hasKey ? 'Falta la API key' : st.spent >= st.budget ? 'En pausa: se alcanzó el tope del mes' : 'Encendido';
    const warn = [];
    if (!st.hasKey) warn.push('Falta la API key de Claude: en Apps Script › Configuración del proyecto › Propiedades del script, agrega ANTHROPIC_API_KEY con tu key.');
    if (!st.automations) warn.push('Los recordatorios y el seguimiento por correo no están programados: en Apps Script ejecuta «instalar» una vez.');
    return '<section class="wb-card wb-copset"><div class="wb-row"><div class="wb-copset-main"><span class="wb-kicker">' + ICON.spark + 'Copiloto IA · ' + esc(st.model) + '</span>' +
      '<strong>' + esc(state) + '</strong><span class="wb-muted">US$' + money2(st.spent) + ' de US$' + money2(st.budget) + ' este mes · ' + st.dailyLimit + ' mensajes por alumno al día · ' + st.sprintLimit + ' por Sprint</span></div>' +
      '<div class="wb-actions">' + (S.admin.feedbackSheet ? '<a class="wb-btn wb-btn--sm wb-btn--ghost" href="' + esc(S.admin.feedbackSheet) + '" target="_blank" rel="noopener">' + ICON.sheet + 'Respuestas de feedback</a>' : '') +
      '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="cop-settings">Ajustes del copiloto</button></div></div>' +
      bar(pct, pct >= 90 ? 'wb-bar--warn' : '') +
      warn.map((w) => '<p class="wb-warnline">' + ICON.alert + '<span>' + esc(w) + '</span></p>').join('') +
      (S.admin.settingsOpen ? '<form class="wb-form wb-copset-form" data-form="cop-settings" novalidate>' +
        '<label class="wb-checkline"><input type="checkbox" name="enabled"' + (st.enabled ? ' checked' : '') + '><span>Copiloto encendido (si lo apagas, nadie lo puede usar: ni participantes ni facilitadores)</span></label>' +
        '<div class="wb-grid3"><label class="wb-field"><span>Tope de gasto al mes (USD)</span><input class="wb-input" name="budget" type="number" inputmode="decimal" min="0" step="1" value="' + esc(st.budget) + '"></label>' +
        '<label class="wb-field"><span>Mensajes por alumno al día</span><input class="wb-input" name="daily" type="number" inputmode="numeric" min="1" step="1" value="' + esc(st.dailyLimit) + '"></label>' +
        '<label class="wb-field"><span>Mensajes por alumno en el Sprint</span><input class="wb-input" name="sprint" type="number" inputmode="numeric" min="1" step="1" value="' + esc(st.sprintLimit) + '"></label></div>' +
        '<p class="wb-small wb-small--top">Al llegar al tope de gasto, el copiloto se pausa hasta el mes siguiente. Los límites de mensajes aplican a todos; para hacer una excepción, usa «Ajustar» en la tarjeta del participante.</p>' +
        '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>Guardar</button><button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cop-settings">Cancelar</button></div></form>' : '') +
      '</section>';
  }

  function lastSessionDate(c) { const d = (c.sessions || []).filter((s) => s.date).map((s) => s.date).sort(); return d.length ? d[d.length - 1] : ''; }

  function autoCard(d) {
    const c = d.cohort, act = d.participants.filter((p) => p.status === 'Activo');
    const on = act.filter((p) => p.copilot && p.copilot.state && p.copilot.state.mode === 'active');
    const msgs = act.reduce((a, p) => a + ((p.copilot && p.copilot.used) || 0), 0), cost = act.reduce((a, p) => a + ((p.copilot && p.copilot.cost) || 0), 0);
    const cur = c.copilot || c.copilotDefault || 'Oculto';
    const last = lastSessionDate(c), until = last ? isoAdd(last, 1) : '';
    const fu = (d.followupDates || []).map((f) => shortDate(parseIso(f.date)).toLowerCase()).join(', ').replace(/, ([^,]*)$/, ' y $1');
    const fac = (S.admin.me && S.admin.me.facilitator) || 'Jaime';
    return '<section class="wb-card wb-auto"><h2 class="wb-h3">Copiloto IA y correos automáticos</h2>' +
      '<div class="wb-auto-row"><div><strong>' + ICON.spark + 'Copiloto IA para esta cohorte</strong><span class="wb-muted">' + on.length + ' de ' + act.length + ' con copiloto activo · ' + msgs + ' mensajes · US$' + money2(cost) +
      (until ? ' · se apaga solo al terminar el ' + esc(dayLong(until).toLowerCase()) : '') + '</span></div>' +
      '<select class="wb-input wb-input--sm wb-select" data-act-change="cohort-copilot" aria-label="Copiloto de la cohorte">' + MODES.map((m) => '<option' + (m === cur ? ' selected' : '') + '>' + m + '</option>').join('') + '</select></div>' +
      '<p class="wb-small wb-small--top"><b>Activo:</b> lo usan. <b>Bloqueado:</b> ven el botón con candado y el mensaje «' + esc((S.admin.settings && S.admin.settings.lockedMessage) || '') + '». <b>Oculto:</b> no ven nada. Al cambiarlo aquí se aplica a todos; en la tarjeta de cada participante puedes hacer excepciones.</p>' +
      '<label class="wb-checkline wb-auto-row"><input type="checkbox" data-act-change="cohort-reminders"' + (c.reminders ? ' checked' : '') + '><span><strong>Recordatorios de cada sesión por correo</strong><span class="wb-muted">Un día antes a las 5 pm y una hora antes (hora CDMX), con la liga de Meet y qué llevar.</span></span></label>' +
      '<label class="wb-checkline wb-auto-row"><input type="checkbox" data-act-change="cohort-followup"' + (c.followup ? ' checked' : '') + '><span><strong>Seguimiento del plan de 90 días</strong><span class="wb-muted">' + (fu ? 'Check-ins el ' + esc(fu) : 'Check-ins a los 30, 60 y 90 días') + '. Si alguien pide ayuda, le llega un aviso a ' + esc(fac) + '.</span></span></label>' +
      (S.admin.feedbackSheet ? '<a class="wb-linkline" href="' + esc(S.admin.feedbackSheet) + '" target="_blank" rel="noopener">' + ICON.sheet + 'Ver las respuestas de los formularios de feedback</a>' : '') +
      '</section>';
  }

  const ADOUBT_CHIP = { 'Pendiente': '', 'Vista en taller': ' wb-chip--done', 'Resuelta': ' wb-chip--done' };
  function adminDoubtCard(x) {
    const ans = x.current || x.snapshot;
    return '<article class="wb-adoubt" data-doubt="' + esc(x.id) + '"><div class="wb-doubt-top"><strong>' + esc(x.name) + '</strong>' +
      (x.section ? '<span class="wb-muted">' + esc(x.section) + '</span>' : '<span class="wb-muted">Duda general</span>') +
      '<span class="wb-muted">' + esc(relTime(x.date)) + '</span><span class="wb-chip' + (ADOUBT_CHIP[x.status] || '') + '">' + esc(x.status) + '</span></div>' +
      '<p class="wb-adoubt-text">' + esc(x.text) + '</p>' +
      (ans ? '<details class="wb-adoubt-ans"><summary>Su respuesta en esa sección</summary><p>' + esc(ans) + '</p>' +
        (x.snapshot && x.current && x.snapshot !== x.current ? '<p class="wb-small"><b>Cuando preguntó decía:</b> ' + esc(x.snapshot) + '</p>' : '') + '</details>' : '') +
      (x.reply ? '<div class="wb-doubt-reply"><b>Respuesta de Agora</b><p>' + esc(x.reply) + '</p></div>' : '') +
      '<div class="wb-actions">' +
      '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="proj-open" data-id="' + esc(x.id) + '">' + ICON.screen + 'Proyectar</button>' +
      (x.status === 'Pendiente' ?
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="doubt-status" data-id="' + esc(x.id) + '" data-status="Vista en taller">Vista en taller</button>' +
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="doubt-status" data-id="' + esc(x.id) + '" data-status="Resuelta">Resuelta</button>' :
        '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="doubt-status" data-id="' + esc(x.id) + '" data-status="Pendiente">Volver a pendiente</button>') +
      '<button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="doubt-reply" data-id="' + esc(x.id) + '">' + (x.reply ? 'Editar respuesta' : 'Responder por escrito') + '</button>' +
      '</div><div data-reply-slot></div></article>';
  }

  function doubtsAdmin(d) {
    const all = d.doubts || [], pend = all.filter((x) => x.status === 'Pendiente');
    const list = S.admin.doubtFilter === 'all' ? all : pend;
    const ses = d.cohort.sessions || [];
    const groups = {};
    list.forEach((x) => { (groups[x.session || 0] = groups[x.session || 0] || []).push(x); });
    const order = Object.keys(groups).map(Number).sort((a, b) => (a || 99) - (b || 99));
    const f = S.admin.doubtFilter;
    return '<section class="wb-sec" data-doubts-admin><div class="wb-row"><div><span class="wb-pill">Dudas para los talleres</span><h2 class="wb-h2">' +
      (pend.length ? pend.length + (pend.length === 1 ? ' duda pendiente' : ' dudas pendientes') : 'Sin dudas pendientes') + '</h2></div>' +
      '<div class="wb-actions">' + (all.length ? '<div class="wb-tabs" role="tablist"><button type="button" role="tab" aria-selected="' + (f !== 'all') + '" data-act="doubt-filter" data-f="pending">Pendientes (' + pend.length + ')</button>' +
        '<button type="button" role="tab" aria-selected="' + (f === 'all') + '" data-act="doubt-filter" data-f="all">Todas (' + all.length + ')</button></div>' : '') +
      (pend.length ? '<button type="button" class="wb-btn wb-btn--sm" data-act="proj-open">' + ICON.screen + 'Proyectar pendientes</button>' : '') + '</div></div>' +
      (list.length ? order.map((n) => {
        const s = n ? ses[n - 1] : null;
        return '<h3 class="wb-doubt-group">' + (s ? 'Para la sesión ' + n + ' · ' + esc(s.title) + (s.date ? ' · ' + esc(shortDate(parseIso(s.date))) : '') : 'Después de las sesiones en vivo') + '</h3>' + groups[n].map(adminDoubtCard).join('');
      }).join('') :
        '<div class="wb-empty"><strong>' + (all.length ? 'Todas las dudas están atendidas.' : 'Todavía no hay dudas.') + '</strong><span>Los participantes las envían desde cada sección de sus Blueprints o desde su inicio.</span></div>') +
      '</section>';
  }

  function followupAdmin(d) {
    const dates = d.followupDates || [];
    const last = lastSessionDate(d.cohort);
    if (!dates.length || !last || mxToday() <= last) return '';
    const act = d.participants.filter((p) => p.status === 'Activo');
    const today = mxToday();
    const cell = (p, f) => {
      const x = (p.followup || {})[f.n] || {};
      if (x.sent) return '<span class="wb-chip' + (x.status === 'Lo logré' ? ' wb-chip--done' : '') + '">' + esc(x.status || 'Enviado') + '</span>' + (x.help ? '<b class="wb-warn">' + ICON.flag + 'Pidió ayuda</b>' : '');
      return today >= f.date ? '<span class="wb-muted">Pendiente</span>' : '<span class="wb-muted">—</span>';
    };
    const firstOpen = dates.filter((f) => today >= f.date).pop();
    const answered = firstOpen ? act.filter((p) => ((p.followup || {})[firstOpen.n] || {}).sent).length : 0;
    const helps = act.filter((p) => Object.keys(p.followup || {}).some((k) => p.followup[k].help)).length;
    return '<section class="wb-sec"><span class="wb-pill">Seguimiento del plan de 90 días</span><h2 class="wb-h2">' +
      (firstOpen ? answered + ' de ' + act.length + ' respondieron el check-in de ' + firstOpen.n + ' días' : 'El primer check-in es el ' + esc(dayLong(dates[0].date).toLowerCase())) + '</h2>' +
      (helps ? '<p class="wb-muted wb-mt">' + helps + (helps === 1 ? ' persona pidió' : ' personas pidieron') + ' que las contacten.</p>' : '') +
      '<div class="wb-table-wrap"><table class="wb-table wb-fu-table"><thead><tr><th>Participante</th>' + dates.map((f) => '<th>Día ' + f.n + '<small>' + esc(shortDate(parseIso(f.date))) + '</small></th>').join('') + '</tr></thead><tbody>' +
      act.map((p) => '<tr><th scope="row"><a href="#wb/participante/' + esc(p.id) + '">' + esc(p.name) + '</a></th>' + dates.map((f) => '<td>' + cell(p, f) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table></div></section>';
  }

  function questionsPanel(pid) {
    return '<details class="wb-ro wb-questions" data-questions="' + (pid || '') + '"><summary data-act="load-questions" data-pid="' + (pid || '') + '"><span class="wb-bpnum">' + ICON.spark + '</span><span><strong>' +
      (pid ? 'Lo que le preguntó al copiloto' : 'Lo que preguntan al copiloto') + '</strong><small>Para detectar qué les cuesta</small></span></summary><div data-questions-body></div></details>';
  }
  function questionsListHtml(qs, pid) {
    if (!qs.length) return '<p class="wb-muted">Todavía no hay preguntas.</p>';
    return (pid ? '' : '<div class="wb-actions"><button type="button" class="wb-btn wb-btn--sm" data-act="fc-questions">' + ICON.spark + 'Analizar con el copiloto</button></div>') +
      '<ul class="wb-qlist">' + qs.slice(0, 120).map((q) => '<li><div class="wb-doubt-top">' + (pid ? '' : '<strong>' + esc(q.name) + '</strong>') +
        (q.context ? '<span class="wb-muted">' + esc(q.context) + '</span>' : '') + '<span class="wb-muted">' + esc(relTime(q.date)) + '</span></div><p>' + esc(q.text) + '</p></li>').join('') + '</ul>';
  }

  function personCopHtml(p) {
    const c = p.copilot || {}, st = c.state || {};
    const d = S.admin.detail[p.cohortId];
    const cm = d ? (d.cohort.copilot || d.cohort.copilotDefault) : '';
    const usage = st.mode === 'active' ? c.used + ' mensajes · US$' + money2(c.cost) + (st.until ? (st.status === 'expired' ? ' · terminó el ' : ' · hasta el ') + shortDate(parseIso(st.until)).toLowerCase() : '') +
      (st.usedToday != null ? ' · hoy ' + st.usedToday + ' de ' + st.dailyLimit : '') + (c.limit ? ' · ' + c.limit + ' por Sprint' : '') : st.mode === 'locked' ? 'Ve el botón con candado' : 'No lo ve';
    return '<div class="wb-person-cop"><span class="wb-label">' + ICON.spark + 'Copiloto</span>' +
      '<select class="wb-input wb-input--sm wb-select" data-act-change="person-copilot" data-id="' + esc(p.id) + '" aria-label="Copiloto de ' + esc(p.name) + '">' +
      '<option value=""' + (!c.mode ? ' selected' : '') + '>Como la cohorte (' + esc(cm) + ')</option>' + MODES.map((m) => '<option value="' + m + '"' + (c.mode === m ? ' selected' : '') + '>' + m + '</option>').join('') + '</select>' +
      '<span class="wb-muted wb-small0">' + esc(usage) + '</span>' +
      (st.mode === 'active' ? '<button type="button" class="wb-linkbtn" data-act="person-cop-adjust" data-id="' + esc(p.id) + '">Ajustar</button>' : '') + '</div><div data-copadj-slot></div>';
  }

  function adminExtrasHtml(w) {
    const st = w.copilot || {}, p = w.participant, c = p.copilot || {};
    const doubts = w.doubts || [];
    return (st.mode === 'active' || c.used ? '<details class="wb-ro"><summary><span class="wb-bpnum">' + ICON.spark + '</span><span><strong>Copiloto IA</strong><small>' + c.used + ' mensajes · US$' + money2(c.cost) +
      (st.until ? ' · ' + (st.status === 'expired' ? 'terminó el ' : 'hasta el ') + esc(shortDate(parseIso(st.until)).toLowerCase()) : '') + '</small></span></summary>' +
      '<div data-questions-inline="' + esc(p.id) + '"><button type="button" class="wb-btn wb-btn--sm wb-btn--ghost" data-act="load-questions" data-pid="' + esc(p.id) + '">Ver lo que le preguntó</button></div></details>' : '') +
      (doubts.length ? '<details class="wb-ro" open><summary><span class="wb-bpnum">' + ICON.help + '</span><span><strong>Sus dudas para el taller</strong><small>' + doubts.length + (doubts.length === 1 ? ' duda' : ' dudas') + '</small></span></summary>' +
        '<div class="wb-doubts">' + doubts.map((x) => doubtItemHtml(x, false)).join('') + '</div></details>' : '');
  }
  function adminCompanyHtml(w) {
    const a = w.answers || {}, c = companyProgress(a);
    return '<details class="wb-ro"' + (c.n ? ' open' : '') + '><summary><span class="wb-bpnum">' + ICON.building + '</span><span><strong>Mi empresa</strong><small>' + c.n + '/' + c.total + ' datos</small></span></summary>' +
      '<div class="wb-cmpro">' + companyFields().map((f) => '<div><span>' + esc(f.label) + '</span><p' + (filled(a[f.id]) ? '' : ' class="wb-muted"') + '>' + (filled(a[f.id]) ? esc(a[f.id]) : '—') + '</p></div>').join('') + '</div></details>';
  }
  function adminFollowupHtml(w) {
    const dates = w.followupDates || [], a = w.answers || {};
    const any = dates.some((f) => filled(a['SEG' + f.n + '_ENVIADO']) || filled(a['SEG' + f.n + '_ESTADO']));
    if (!any) return '';
    const FU = CONTENT.followup;
    return '<details class="wb-ro" open><summary><span class="wb-bpnum">' + ICON.flag + '</span><span><strong>' + esc(FU.title) + '</strong><small>Check-ins</small></span></summary>' +
      dates.map((f) => {
        const g = (k) => a['SEG' + f.n + '_' + k] || '';
        if (!filled(g('ESTADO')) && !filled(g('ENVIADO'))) return '';
        return '<div class="wb-ro-item"><h4>Día ' + f.n + (filled(g('ENVIADO')) ? ' · enviado el ' + esc(shortDate(parseIso(g('ENVIADO')))) : ' · sin enviar') + (filled(g('AYUDA')) ? ' · <span class="wb-warn">pidió ayuda</span>' : '') + '</h4>' +
          '<p><b>' + esc(FU.statusLabel) + '</b> ' + esc(g('ESTADO') || '—') + '</p>' +
          FU.questions.map((q) => '<p class="wb-q"><b>' + esc(f.n === 90 && q.label90 ? q.label90 : q.label) + '</b></p><div class="wb-answer' + (filled(g(q.id)) ? '' : ' is-empty') + '">' + (filled(g(q.id)) ? esc(g(q.id)) : 'Sin respuesta.') + '</div>').join('') + '</div>';
      }).join('') + '</details>';
  }

  /* ---------- Proyector de dudas ---------- */
  function openProjector(cid, id) {
    const d = S.admin.detail[cid];
    if (!d) return;
    const pend = d.doubts.filter((x) => x.status === 'Pendiente');
    const list = id ? [id] : pend.map((x) => x.id);
    if (!list.length) return;
    S.admin.proj = { cid: cid, list: list, idx: 0, names: false };
    renderProjector();
    const el = root.querySelector('.wb-proj');
    if (el && el.requestFullscreen) el.requestFullscreen().catch(() => { });
  }
  function renderProjector() {
    const P0 = S.admin.proj, d = S.admin.detail[P0.cid];
    const x = d.doubts.find((y) => y.id === P0.list[P0.idx]);
    const layer = root.querySelector('.wb-layer');
    if (!x) return closeProjector();
    const ans = x.current || x.snapshot;
    const wasFs = !!document.fullscreenElement;
    const html = '<div class="wb-proj-top"><span>' + ICON.screen + 'Dudas para el taller · ' + (P0.idx + 1) + ' de ' + P0.list.length + '</span>' +
      '<div class="wb-actions"><label class="wb-checkline wb-checkline--light"><input type="checkbox" data-act-change="proj-names"' + (P0.names ? ' checked' : '') + '><span>Mostrar nombres</span></label>' +
      '<button type="button" class="wb-icon wb-icon--light" data-act="proj-close" aria-label="Cerrar">' + ICON.x + '</button></div></div>' +
      '<div class="wb-proj-main"><span class="wb-proj-kicker">' + esc(x.section || 'Duda general') + '</span><p class="wb-proj-q">' + esc(x.text) + '</p>' +
      (P0.names ? '<span class="wb-proj-who">' + esc(x.name) + '</span>' : '') +
      (ans ? '<div class="wb-proj-ans"><span>Su respuesta</span><p>' + esc(ans) + '</p></div>' : '') + '</div>' +
      '<div class="wb-proj-nav"><button type="button" class="wb-btn wb-btn--onDark" data-act="proj-prev"' + (P0.idx === 0 ? ' disabled' : '') + '>' + ICON.left + 'Anterior</button>' +
      (x.status === 'Pendiente' ? '<button type="button" class="wb-btn wb-btn--lime wb-btn--flat" data-act="proj-seen">' + ICON.check + 'Marcar como vista</button>' : '<span class="wb-proj-done">' + ICON.check + esc(x.status) + '</span>') +
      '<button type="button" class="wb-btn wb-btn--onDark" data-act="proj-next"' + (P0.idx >= P0.list.length - 1 ? ' disabled' : '') + '>Siguiente' + ICON.right + '</button></div>';
    let el = layer.querySelector('.wb-proj');
    if (el && wasFs) { el.innerHTML = html; return; }
    layer.innerHTML = '<div class="wb-proj" role="dialog" aria-modal="true" aria-label="Dudas para el taller">' + html + '</div>';
    layer.classList.add('is-on');
  }
  function projMove(n) {
    const P0 = S.admin.proj;
    if (!P0) return;
    const i = Math.max(0, Math.min(P0.list.length - 1, P0.idx + n));
    if (i !== P0.idx) { P0.idx = i; renderProjector(); }
  }
  function closeProjector() {
    const cid = S.admin.proj && S.admin.proj.cid;
    S.admin.proj = null;
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => { });
    closeLayer();
    if (cid && route()[2] === cid) adminCohort(cid);
  }

  function setDoubtLocal(cid, doubt) {
    const d = S.admin.detail[cid];
    if (!d) return;
    const i = d.doubts.findIndex((x) => x.id === doubt.id);
    if (i >= 0) d.doubts[i] = Object.assign({}, d.doubts[i], doubt, { current: d.doubts[i].current });
  }
  function refreshDoubts(cid) {
    const sec = view.querySelector('[data-doubts-admin]'), d = S.admin.detail[cid];
    if (sec && d) sec.outerHTML = doubtsAdmin(d);
  }

  /* ---------- Copiloto del facilitador ---------- */
  function fcConv(cid) { return S.admin.fc[cid] || (S.admin.fc[cid] = { scope: 'cohort', pid: '', bps: '', msgs: [], busy: false }); }
  function fcCohortId() {
    const r = route();
    if (r[1] === 'cohorte') return r[2];
    if (r[1] === 'participante') { const w = S.admin.workbooks[r[2]]; return w ? w.participant.cohortId : null; }
    return null;
  }
  function fcPeople(cid) {
    const d = S.admin.detail[cid];
    if (d) return d.participants.filter((p) => p.status === 'Activo');
    const w = Object.keys(S.admin.workbooks).map((k) => S.admin.workbooks[k]).filter((x) => x.participant.cohortId === cid);
    return w.map((x) => x.participant);
  }
  const FC_CHIPS = {
    cohort: [['Prepárame el próximo taller', 'Prepárame el próximo taller: qué patrones veo en sus respuestas, a quién llamar y con qué pregunta, y qué dudas atender primero.'],
      ['¿Quién va atrasado?', '¿Quién va atrasado y qué le digo para que se ponga al día?'],
      ['Mejores respuestas', '¿Cuáles son las 3 mejores respuestas de la cohorte para usarlas como ejemplo en vivo, y por qué?']],
    participant: [['Resumen antes del taller', 'Resúmeme cómo va antes del taller: fortalezas, huecos frente a la rúbrica y qué le preguntaría en vivo.'],
      ['¿Qué le falta?', '¿Qué le falta para terminar sus Blueprints y por dónde debería empezar?']],
    doubts: [['Agrúpalas por tema', 'Agrupa las dudas pendientes por tema y dime en qué orden responderlas en vivo, con una respuesta sugerida para cada grupo.']],
    questions: [['¿Qué les cuesta más?', '¿Qué es lo que más les cuesta según lo que le preguntan al copiloto y qué conviene reforzar en el próximo taller?']]
  };

  function openFc(opts) {
    opts = opts || {};
    const cid = opts.cid || fcCohortId();
    if (!cid) return;
    const conv = fcConv(cid);
    const r = route();
    if (opts.scope && (opts.scope !== conv.scope || (opts.pid || '') !== conv.pid)) { conv.scope = opts.scope; conv.pid = opts.pid || ''; conv.msgs = []; }
    else if (!opts.scope && r[1] === 'participante' && (conv.scope !== 'participant' || conv.pid !== r[2])) { conv.scope = 'participant'; conv.pid = r[2]; conv.msgs = []; }
    S.admin.fcCid = cid;
    const d = S.admin.detail[cid];
    const name = d ? d.cohort.name : (S.admin.workbooks[r[2]] && S.admin.workbooks[r[2]].cohort ? S.admin.workbooks[r[2]].cohort.name : 'Cohorte');
    const layer = root.querySelector('.wb-layer');
    layer.innerHTML = '<div class="wb-overlay" data-act="close-layer"></div><aside class="wb-drawer wb-cop wb-fc" role="dialog" aria-modal="true" aria-label="Copiloto del facilitador">' +
      '<div class="wb-drawer-head"><div><span class="wb-pill wb-pill--lime">' + ICON.spark + 'Copiloto del facilitador</span><h2 class="wb-h2">' + esc(name) + '</h2></div><div class="wb-drawer-btns">' +
      '<button type="button" class="wb-icon" data-act="fc-reset" title="Nueva conversación" aria-label="Nueva conversación">' + ICON.reset + '</button>' +
      '<button type="button" class="wb-icon" data-act="close-layer" aria-label="Cerrar">' + ICON.x + '</button></div></div>' +
      '<div class="wb-cop-body"><div class="wb-fc-scope" data-fc-scope></div><div class="wb-cop-msgs" data-cop-msgs aria-live="polite"></div><div class="wb-cop-chips" data-cop-chips></div>' +
      '<form class="wb-cop-form" data-form="fc" novalidate><textarea class="wb-cop-input wb-fc-input" name="msg" rows="1" maxlength="4000" placeholder="Pregúntale lo que necesites…" aria-label="Escribe tu pregunta"></textarea>' +
      '<button type="submit" class="wb-cop-send" aria-label="Enviar" data-submit>' + ICON.send + '</button></form>' +
      '<p class="wb-cop-note">Usa las respuestas del workbook, las dudas y lo que preguntan al copiloto. Revisa antes de compartir con los participantes.</p></div></aside>';
    layer.classList.add('is-on');
    fcRefresh();
    if (opts.message) fcSend(opts.message);
  }

  function fcRefresh() {
    const layer = root.querySelector('.wb-layer'), cid = S.admin.fcCid;
    if (!layer.querySelector('.wb-fc') || !cid) return;
    const conv = fcConv(cid), people = fcPeople(cid);
    layer.querySelector('[data-fc-scope]').innerHTML =
      '<label class="wb-field"><span>¿Sobre qué?</span><select class="wb-input wb-input--sm" data-act-change="fc-scope">' +
      [['cohort', 'Toda la cohorte'], ['participant', 'Un participante'], ['doubts', 'Dudas para los talleres'], ['questions', 'Lo que preguntan al copiloto']].map((o) =>
        '<option value="' + o[0] + '"' + (conv.scope === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></label>' +
      (conv.scope === 'cohort' ? '<label class="wb-field"><span>Blueprints</span><select class="wb-input wb-input--sm" data-act-change="fc-bps">' +
        '<option value="">Los de la próxima sesión</option>' + BPS.map((bp) => '<option value="' + bp.n + '"' + (conv.bps === String(bp.n) ? ' selected' : '') + '>Blueprint ' + bp.n + ' · ' + esc(bp.title) + '</option>').join('') +
        '<option value="1,2,3,4,5,6,7,8"' + (conv.bps.length > 2 ? ' selected' : '') + '>Los 8 (más resumido)</option></select></label>' : '') +
      (conv.scope === 'participant' ? '<label class="wb-field"><span>Participante</span><select class="wb-input wb-input--sm" data-act-change="fc-pid"><option value="">Elige…</option>' +
        people.map((p) => '<option value="' + esc(p.id) + '"' + (conv.pid === p.id ? ' selected' : '') + '>' + esc(p.name) + '</option>').join('') + '</select></label>' : '');
    const msgs = layer.querySelector('[data-cop-msgs]');
    const intro = { r: 'a', t: 'Pregúntame lo que necesites para preparar los talleres o acompañar a alguien. Elige arriba sobre qué: toda la cohorte, un participante, las dudas o lo que le preguntan al copiloto.' };
    msgs.innerHTML = (conv.msgs.length ? conv.msgs : [intro]).map((m) => m.r === 'a' && m.usd != null ?
      '<div class="wb-msg wb-msg--a"><div class="wb-md">' + md(m.t) + '</div><div class="wb-fc-meta"><span class="wb-muted">' + esc(m.scope || '') + ' · US$' + (m.usd < 0.01 ? '<0.01' : money2(m.usd)) + '</span>' + copyBtn(m.t, 'Copiar') + '</div></div>' :
      copMsgHtml(m)).join('') + (conv.busy ? '<div class="wb-msg wb-msg--a wb-msg--typing"><span class="wb-dots"><i></i><i></i><i></i></span><small>Revisando los datos de la cohorte…</small></div>' : '');
    const ready = !conv.busy && (conv.scope !== 'participant' || conv.pid);
    layer.querySelector('[data-cop-chips]').innerHTML = ready ? (FC_CHIPS[conv.scope] || []).map((c) => '<button type="button" class="wb-chipbtn" data-act="fc-chip" data-msg="' + esc(c[1]) + '">' + esc(c[0]) + '</button>').join('') : '';
    layer.querySelector('.wb-cop-send').disabled = !ready;
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function fcSend(text) {
    const cid = S.admin.fcCid, conv = fcConv(cid);
    text = String(text || '').trim();
    if (!text || conv.busy) return;
    if (conv.scope === 'participant' && !conv.pid) { toast('Elige a un participante'); return; }
    const history = conv.msgs.filter((m) => m.r === 'u' || m.r === 'a').map((m) => ({ r: m.r, t: m.t })).slice(-10);
    conv.msgs.push({ r: 'u', t: text });
    conv.busy = true;
    const inp = root.querySelector('.wb-fc-input'); if (inp) { inp.value = ''; inp.style.height = ''; }
    fcRefresh();
    try {
      const out = await api('admin.copilot.ask', { cohortId: cid, scope: conv.scope, participantId: conv.pid, bps: conv.bps ? conv.bps.split(',').map(Number) : [], question: text, history: history });
      if (out.settings) S.admin.settings = out.settings;
      conv.msgs.push(out.ok ? { r: 'a', t: out.text, usd: out.usd, scope: out.scope } : { r: 'err', t: out.message || 'El copiloto no pudo responder.' });
    } catch (e) {
      if (e.code === 'auth') return;
      conv.msgs.push({ r: 'err', t: 'No pudimos conectar. Intenta de nuevo.' });
    } finally { conv.busy = false; fcRefresh(); }
  }
  function fcSubmit(form) { return fcSend(form.elements.msg.value); }

  async function loadQuestions(t, pid) {
    const cid = pid ? (findPerson(pid) ? findPerson(pid).cohortId : (S.admin.workbooks[pid] && S.admin.workbooks[pid].participant.cohortId)) : route()[2];
    const key = cid + '|' + (pid || '');
    const target = pid ? view.querySelector('[data-questions-inline="' + pid + '"]') : view.querySelector('[data-questions=""] [data-questions-body]');
    if (!target) return;
    if (!S.admin.questions[key]) {
      target.innerHTML = '<p class="wb-muted"><span class="wb-spin"></span> Cargando…</p>';
      try {
        const out = await api('admin.copilot.questions', { cohortId: cid, participantId: pid || '' });
        if (!out.ok) throw new Error(out.error);
        S.admin.questions[key] = out.questions;
      } catch (e) { if (e.code !== 'auth') target.innerHTML = '<p class="wb-bad">No se pudieron cargar.</p>'; return; }
    }
    target.innerHTML = questionsListHtml(S.admin.questions[key], pid);
  }

  async function onChange(e) {
    const t = e.target, act = t.getAttribute('data-act-change');
    if (act === 'proj-names') { if (S.admin.proj) { S.admin.proj.names = t.checked; renderProjector(); } return; }
    if (act === 'fc-scope' || act === 'fc-bps' || act === 'fc-pid') {
      const conv = fcConv(S.admin.fcCid);
      if (act === 'fc-scope') { conv.scope = t.value; conv.msgs = []; if (t.value !== 'participant') conv.pid = ''; }
      if (act === 'fc-bps') conv.bps = t.value;
      if (act === 'fc-pid') { conv.pid = t.value; conv.msgs = []; }
      return fcRefresh();
    }
    const cid = route()[2], d = S.admin.detail[cid];
    if (act === 'cohort-copilot' && d) {
      if (!window.confirm('¿Cambiar el copiloto de toda la cohorte a «' + t.value + '»? Se aplica a todos los participantes (también a las excepciones que hayas hecho).')) { t.value = d.cohort.copilot || d.cohort.copilotDefault; return; }
      try {
        const out = await api('admin.copilot.set', { cohortId: cid, mode: t.value });
        if (!out.ok) { toast(out.message || 'No se pudo cambiar'); return; }
        toast('Copiloto «' + t.value + '» para toda la cohorte');
        S.admin.cohorts = null;
        return adminCohort(cid, true);
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
      return;
    }
    if ((act === 'cohort-reminders' || act === 'cohort-followup') && d) {
      const key = act === 'cohort-reminders' ? 'reminders' : 'followup', data = { id: cid };
      data[key] = t.checked;
      try {
        const out = await api('admin.cohort.update', data);
        if (!out.ok) { toast(out.message || 'No se pudo guardar'); t.checked = !t.checked; return; }
        d.cohort = out.cohort;
        toast(key === 'reminders' ? (t.checked ? 'Recordatorios activados' : 'Recordatorios desactivados') : (t.checked ? 'Seguimiento activado' : 'Seguimiento desactivado'));
      } catch (err) { if (err.code !== 'auth') { toast('No pudimos conectar. Intenta de nuevo.'); t.checked = !t.checked; } }
      return;
    }
    if (act === 'person-copilot') {
      const id = t.getAttribute('data-id');
      try {
        const out = await api('admin.copilot.set', { id: id, mode: t.value });
        if (!out.ok) { toast(out.message || 'No se pudo cambiar'); return; }
        replacePerson(out.participant); S.admin.cohorts = null;
        toast('Copiloto de ' + first(out.participant.name) + ': ' + (t.value || 'como la cohorte'));
        const card = t.closest('.wb-person');
        if (card) card.outerHTML = personCard(out.participant);
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
    }
  }

  async function onAdminExtraClick(e, t, act, id) {
    if (act === 'cop-settings') { S.admin.settingsOpen = !S.admin.settingsOpen; const el = view.querySelector('.wb-copset'); if (el) el.outerHTML = copSettingsHtml(); return true; }
    if (act === 'fc-open') { openFc(); return true; }
    if (act === 'fc-person') {
      const f = findPerson(id), w = S.admin.workbooks[id];
      const cid = f ? f.cohortId : (w ? w.participant.cohortId : null), name = f ? f.p.name : (w ? w.participant.name : '');
      openFc({ cid: cid, scope: 'participant', pid: id, message: 'Resúmeme cómo va ' + first(name) + ' antes del taller: fortalezas, huecos frente a la rúbrica y qué le preguntaría en vivo.' });
      return true;
    }
    if (act === 'fc-questions') { openFc({ scope: 'questions', message: FC_CHIPS.questions[0][1] }); return true; }
    if (act === 'fc-chip') { fcSend(t.getAttribute('data-msg')); return true; }
    if (act === 'fc-reset') { const conv = fcConv(S.admin.fcCid); if (!conv.busy) { conv.msgs = []; fcRefresh(); } return true; }
    if (act === 'load-questions') {
      const pid = t.getAttribute('data-pid') || '';
      if (!pid) { const det = t.closest('details'); if (det && det.open) return true; }   // al cerrar no recarga
      loadQuestions(t, pid);
      return true;
    }
    if (act === 'doubt-filter') { S.admin.doubtFilter = t.getAttribute('data-f'); refreshDoubts(route()[2]); return true; }
    if (act === 'proj-open') { openProjector(route()[2], id); return true; }
    if (act === 'proj-close') { closeProjector(); return true; }
    if (act === 'proj-prev' || act === 'proj-next') { projMove(act === 'proj-next' ? 1 : -1); return true; }
    if (act === 'proj-seen') {
      const P0 = S.admin.proj, did = P0.list[P0.idx];
      try {
        const out = await withBusy(t, 'Guardando…', () => api('admin.doubt.update', { id: did, status: 'Vista en taller' }));
        if (!out.ok) { toast(out.message || 'No se pudo guardar'); return true; }
        setDoubtLocal(P0.cid, out.doubt); S.admin.cohorts = null;
        if (P0.idx < P0.list.length - 1) P0.idx++;
        renderProjector();
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
      return true;
    }
    if (act === 'doubt-status') {
      const cid = route()[2];
      adminAction(t, 'admin.doubt.update', { id: id, status: t.getAttribute('data-status') }, (out) => {
        setDoubtLocal(cid, out.doubt); S.admin.cohorts = null; refreshDoubts(cid); toast('Duda: ' + out.doubt.status.toLowerCase());
      });
      return true;
    }
    if (act === 'doubt-reply') {
      const card = t.closest('.wb-adoubt'), slot = card.querySelector('[data-reply-slot]');
      const x = S.admin.detail[route()[2]].doubts.find((y) => y.id === id);
      slot.innerHTML = '<form class="wb-form wb-replyform" data-form="doubt-reply" data-id="' + esc(id) + '" novalidate>' +
        '<label class="wb-field"><span>Respuesta para ' + esc(first(x.name)) + '</span><textarea class="wb-ta wb-ta--sm" name="reply" rows="3" maxlength="3000">' + esc(x.reply || '') + '</textarea></label>' +
        '<label class="wb-checkline"><input type="checkbox" name="notify" checked><span>Avisarle por correo</span></label>' +
        '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>Guardar respuesta</button>' +
        '<button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
      slot.querySelector('textarea').focus();
      return true;
    }
    if (act === 'person-cop-adjust') {
      const f = findPerson(id), card = t.closest('.wb-person'), slot = card.querySelector('[data-copadj-slot]');
      const c = f.p.copilot || {}, st = c.state || {};
      slot.innerHTML = '<form class="wb-form wb-editp" data-form="cop-adjust" data-id="' + esc(id) + '" novalidate><div class="wb-grid3">' +
        '<label class="wb-field"><span>Disponible hasta <em>(incluye ese día)</em></span><input class="wb-input" name="until" type="date" value="' + esc(c.until || st.until || '') + '"></label>' +
        '<label class="wb-field"><span>Mensajes al día</span><input class="wb-input" name="daily" type="number" min="0" step="1" value="' + esc(c.dailyLimit || '') + '" placeholder="' + esc((S.admin.settings && S.admin.settings.dailyLimit) || 10) + ' (el general)"></label>' +
        '<label class="wb-field"><span>Mensajes en todo el Sprint</span><input class="wb-input" name="limit" type="number" min="0" step="1" value="' + esc(c.limit || '') + '" placeholder="' + esc((S.admin.settings && S.admin.settings.sprintLimit) || 250) + ' (el general)"></label></div>' +
        '<p class="wb-small wb-small--top">Lleva ' + (c.used || 0) + ' mensajes. Deja un campo vacío para usar el valor general; sin fecha, se apaga solo al día siguiente de la última sesión.</p>' +
        '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>Guardar</button>' +
        '<button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
      return true;
    }
    return false;
  }

  /* ===================== EVENTOS ===================== */
  function onKey(e) {
    if (!root || !root.isConnected) return;
    if (TOUR) {
      if (e.key === 'Escape') { e.preventDefault(); return endTour(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); return tourMove(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); return tourMove(-1); }
      return;
    }
    if (e.key === 'Escape') { if (S.admin.proj) return closeProjector(); return closeLayer(); }
    if (S.admin.proj && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) { e.preventDefault(); return projMove(e.key === 'ArrowRight' ? 1 : -1); }
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && e.target.matches('.wb-cop-input, .wb-fc-input')) {
      e.preventDefault();
      const f = e.target.form;
      if (f) f.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  }

  function onInput(e) {
    const t = e.target;
    if (t.matches('.wb-cop-input, .wb-fc-input')) {
      if (t.matches('.wb-cop-input')) S.cop.draft = t.value;
      t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight + 2, 160) + 'px';
      return;
    }
    if (t.matches('textarea[data-field], input[data-field]')) {
      if (t.tagName === 'TEXTAREA') autosize(t);
      if (!ADMIN) {
        const art = t.closest('.wb-section');
        if (art) art.classList.toggle('has-answer', filled(t.value));
        setAnswer(t.getAttribute('data-field'), t.value);
        updateCompanyCount();
        const c = view.querySelector('[data-bpcount]');
        if (c) { const b = bpProgress(BPS[Number(c.getAttribute('data-bpcount')) - 1], S.answers); c.textContent = b.n + '/' + b.total; }
        updatePrepCount();
      }
      return;
    }
    if (t.matches('[data-calc]')) { const tool = t.closest('[data-tool]'); if (tool) computeTool(tool); return; }
    if (t.matches('[data-glossary-search]')) return filterGlossary(t.value);
    if (t.name === 'kickoff' && t.form && t.form.getAttribute('data-form') === 'new-cohort') {
      sessionDefaults().forEach((d, i) => {
        const inp = t.form.elements['s' + (i + 1) + '_date'];
        if (inp && (inp.getAttribute('data-auto') || !inp.value)) { inp.value = t.value ? isoAdd(t.value, d.day || 0) : ''; inp.setAttribute('data-auto', '1'); }
      });
      return;
    }
    if (/^s\d+_date$/.test(t.name || '')) { t.removeAttribute('data-auto'); return; }
    if (t.matches('[data-filter]')) { S.admin.filter = t.value; return filterPeople(); }
    if (t.classList && t.classList.contains('is-error')) t.classList.remove('is-error');
  }

  function updatePrepCount() {
    const el = view.querySelector('[data-prepcount]');
    if (!el) return;
    const p = prepProgress(S.answers);
    el.textContent = p.n + '/' + p.total;
    const b = el.parentNode.querySelector('.wb-bar i'); if (b) b.style.width = p.pct + '%';
  }

  function autosize(t) { t.style.height = 'auto'; t.style.height = Math.max(t.scrollHeight + 2, t.classList.contains('wb-ta--sm') ? 60 : 84) + 'px'; }
  function autosizeAll() { view.querySelectorAll('textarea.wb-ta').forEach(autosize); }

  async function onClick(e) {
    const t = e.target.closest('[data-act]');
    if (!t || !root.contains(t)) return;
    const act = t.getAttribute('data-act');
    const id = t.getAttribute('data-id');
    if (act === 'reload') return start();
    if (act === 'logout') {
      if (!ADMIN && Object.keys(S.pending).length) { clearTimeout(S.saveTimer); await withBusy(t, 'Guardando…', saveNow); }
      return logout();
    }
    if (act === 'glossary') { const r = route(); return openGlossary(r[1] === 'bp' ? Number(r[2]) : 0); }
    if (act === 'close-layer') return closeLayer();
    if (act === 'copy') {
      try { await copyText(t.getAttribute('data-copy')); toast('Copiado'); const lab = t.querySelector('span'); if (lab) { const old = lab.textContent; lab.textContent = 'Copiado'; setTimeout(() => { lab.textContent = old; }, 1600); } }
      catch (err) { toast('No se pudo copiar'); }
      return;
    }
    if (act === 'toggle' && !ADMIN) {
      const f = t.getAttribute('data-field');
      const on = !filled(S.answers[f]);
      setAnswer(f, on ? '1' : '');
      view.querySelectorAll('[data-act=toggle][data-field="' + f + '"]').forEach((b) => { b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', String(on)); });
      if (on && /_TERMINADO$/.test(f)) toast('¡Blueprint terminado!');
      if (/^BP\d_TERMINADO$/.test(f)) {
        const bp = BPS[Number(f.charAt(2)) - 1];
        view.querySelectorAll('[data-nudge="' + bp.n + '"]').forEach((x) => x.remove());
        if (on) view.querySelectorAll('[data-act=toggle][data-field="' + f + '"]').forEach((b) => b.insertAdjacentHTML('afterend', copNudgeHtml(bp)));
      }
      if (on && f === CONTENT.prep.doneId) toast('¡Listo para el kick-off!');
      const m = f.match(/^RUB(\d)_/);
      if (m) {
        const bp = BPS[Number(m[1]) - 1], n = rubricCount(bp);
        view.querySelectorAll('[data-rubcount="' + bp.n + '"]').forEach((x) => { x.textContent = n + '/5'; });
        view.querySelectorAll('[data-rubtab="' + bp.n + '"]').forEach((x) => { x.textContent = n + '/5'; });
        if (on && n === 5) toast('¡Pasaste la rúbrica completa!');
      }
      updatePrepCount();
      return;
    }
    if (act === 'tool-insert') {
      const tool = t.closest('[data-tool]');
      computeTool(tool);
      return insertIntoAnswer(tool.getAttribute('data-target'), tool._text);
    }
    if (act === 'template-insert') {
      const bp = BPS[Number(t.getAttribute('data-bp')) - 1], tpl = bp.kit.template;
      const cur = S.answers[tpl.target] || '';
      if (cur.indexOf(tpl.rows[0]) >= 0) { S.focusSection = tpl.target; return go('wb/bp/' + bp.n); }
      return insertIntoAnswer(tpl.target, tpl.rows.map((r) => r + ': ').join('\n'));
    }
    if (act === 'scroll-video') {
      const v = view.querySelector('#wb-guide-video');
      if (v) try { v.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (err) { v.scrollIntoView(); }
      return;
    }
    if (act === 'seek') {
      const fr = view.querySelector('iframe[data-video]');
      if (fr) { fr.src = videoEmbed(t.getAttribute('data-url'), Number(t.getAttribute('data-t'))); try { fr.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { } }
      return;
    }
    if (act === 'pdf') return downloadPdf(t, { profile: S.me.profile, cohort: S.me.cohort, answers: S.answers });
    if (!ADMIN) return onParticipantClick(e, t, act);

    // ---- Admin ----
    if (await onAdminExtraClick(e, t, act, id)) return;
    if (act === 'refresh') {
      S.admin.cohorts = null; S.admin.detail = {}; S.admin.workbooks = {}; S.admin.questions = {};
      return renderAdmin();
    }
    if (act === 'new-cohort') { const slot = view.querySelector('[data-newcohort]'); slot.innerHTML = cohortForm(null); slot.querySelector('input').focus(); return; }
    if (act === 'edit-cohort') { const slot = view.querySelector('[data-editcohort]'); slot.innerHTML = cohortForm(S.admin.detail[route()[2]].cohort); slot.querySelector('input').focus(); return; }
    if (act === 'cancel-form') { const f = t.closest('form'); if (f) f.remove(); return; }
    if (act === 'edit-session') {
      const c = S.admin.detail[route()[2]].cohort, n = Number(t.getAttribute('data-n'));
      const s = c.sessions[n - 1], slot = t.parentNode.querySelector('[data-sess-slot]');
      view.querySelectorAll('[data-sess-slot]').forEach((x) => { if (x !== slot) x.innerHTML = ''; });
      slot.innerHTML = '<form class="wb-form wb-sessform" data-form="edit-session" data-n="' + n + '" novalidate>' +
        sessionFields('', s, { recording: true }) +
        '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>Guardar sesión</button>' +
        '<button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
      const focus = slot.querySelector(sessionInfo(s, Date.now()).state === 'ended' ? '[name=recording]' : '[name=meet]');
      if (focus) focus.focus();
      return;
    }
    if (act === 'toggle-cohort') {
      const c = S.admin.detail[route()[2]].cohort;
      const status = c.status === 'Cerrada' ? 'Activa' : 'Cerrada';
      if (status === 'Cerrada' && !window.confirm('¿Cerrar «' + c.name + '»? Los participantes podrán seguir entrando a su workbook; solo cambia su estado en el panel.')) return;
      return adminAction(t, 'admin.cohort.update', { id: c.id, status: status }, (out) => { S.admin.detail[c.id].cohort = out.cohort; S.admin.cohorts = null; adminCohort(c.id); });
    }
    if (act === 'add-mode') {
      S.admin.addMode = t.getAttribute('data-mode');
      const panel = view.querySelector('.wb-add'), d = S.admin.detail[route()[2]];
      if (panel && d) { panel.outerHTML = addPanel(d.cohort); const i = view.querySelector('.wb-add .wb-input, .wb-add textarea'); if (i) i.focus(); }
      return;
    }
    if (act === 'pin-toggle') {
      S.admin.showPins[id] = !S.admin.showPins[id];
      const f = findPerson(id), code = t.parentNode.querySelector('code');
      if (f && code) code.textContent = S.admin.showPins[id] ? f.p.pin : '••••••';
      t.setAttribute('aria-label', S.admin.showPins[id] ? 'Ocultar PIN' : 'Mostrar PIN');
      return;
    }
    if (act === 'resend') {
      const f = findPerson(id);
      if (!window.confirm('¿Reenviar el acceso a ' + f.p.name + ' (' + f.p.email + ')?')) return;
      return adminAction(t, 'admin.participant.resend', { id: id }, (out) => { replacePerson(out.participant); toast('Acceso reenviado a ' + out.participant.email); adminCohort(route()[2]); });
    }
    if (act === 'remove') {
      const f = findPerson(id);
      if (!window.confirm('¿Quitar a ' + f.p.name + ' de la cohorte? Ya no podrá entrar, pero sus respuestas se conservan y puedes reactivarlo cuando quieras.')) return;
      return adminAction(t, 'admin.participant.setActive', { id: id, active: false }, (out) => { replacePerson(out.participant); S.admin.cohorts = null; toast('Participante quitado'); adminCohort(route()[2]); });
    }
    if (act === 'reactivate') {
      return adminAction(t, 'admin.participant.setActive', { id: id, active: true }, (out) => { replacePerson(out.participant); S.admin.cohorts = null; toast('Participante reactivado'); adminCohort(route()[2]); });
    }
    if (act === 'edit-person') {
      const f = findPerson(id), card = t.closest('.wb-person'), slot = card.querySelector('[data-edit-slot]');
      slot.innerHTML = '<form class="wb-form wb-editp" data-form="edit-person" data-id="' + esc(id) + '" novalidate><div class="wb-grid3">' +
        '<label class="wb-field"><span>Nombre</span><input class="wb-input" name="name" maxlength="80" value="' + esc(f.p.name) + '"></label>' +
        '<label class="wb-field"><span>Correo</span><input class="wb-input" name="email" type="email" maxlength="120" value="' + esc(f.p.email) + '"></label>' +
        '<label class="wb-field"><span>Empresa</span><input class="wb-input" name="company" maxlength="80" value="' + esc(f.p.company) + '"></label></div>' +
        '<p class="wb-small">El PIN no cambia. Si corriges el correo, la persona entra con el correo nuevo y el mismo PIN.</p>' +
        '<p class="wb-err" data-err></p><div class="wb-actions"><button class="wb-btn wb-btn--sm" type="submit" data-submit>Guardar</button>' +
        '<button class="wb-btn wb-btn--sm wb-btn--ghost" type="button" data-act="cancel-form">Cancelar</button></div></form>';
      return;
    }
    if (act === 'admin-pdf') {
      try {
        const w = await withBusy(t, 'Preparando…', () => getWorkbook(id));
        return downloadPdf(t, { profile: w.participant, cohort: w.cohort, answers: w.answers });
      } catch (err) { if (err.code !== 'auth') toast('No se pudo cargar su workbook'); }
    }
  }

  async function onParticipantClick(e, t, act) {
    if (act === 'tour') return startTour();
    if (act === 'tour-next') return tourMove(1);
    if (act === 'tour-prev') return tourMove(-1);
    if (act === 'tour-end') return endTour();
    if (act === 'tour-dismiss') { store.set(tourKey(), '1'); const inv = view.querySelector('[data-tourinvite]'); if (inv) inv.remove(); return; }
    if (act === 'emp-chip') {
      const f = t.getAttribute('data-field'), v = t.getAttribute('data-value');
      const on = S.answers[f] !== v;
      setAnswer(f, on ? v : '');
      t.parentNode.querySelectorAll('[data-act=emp-chip]').forEach((b) => { const sel = on && b === t; b.classList.toggle('is-on', sel); b.setAttribute('aria-checked', String(sel)); });
      return updateCompanyCount();
    }
    if (act === 'copy-context') {
      try { await copyText(companyContextText()); toast('Contexto copiado: pégalo antes de tu prompt'); } catch (err) { toast('No se pudo copiar'); }
      return;
    }
    if (act === 'cop-open') return openCopilot();
    if (act === 'cop') { if (copOn()) copFromButton(t); return; }
    if (act === 'cop-reset') {
      if (!S.cop.thread || !S.cop.thread.length || S.cop.busy) return;
      if (!window.confirm('¿Empezar una conversación nueva? La anterior ya no la verás aquí.')) return;
      try {
        const out = await api('copilot.reset');
        if (out.ok) { S.cop.thread = []; S.cop.applied = {}; S.cop.doubtSent = {}; copRefresh(); }
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
      return;
    }
    if (act === 'cop-apply') return applyProposal(Number(t.getAttribute('data-i')), Number(t.getAttribute('data-j')), t.getAttribute('data-mode'));
    if (act === 'cop-goto') {
      e.preventDefault();
      const f = t.getAttribute('data-field');
      if (sectionById(f)) S.focusSection = f;
      if (window.innerWidth < 900) closeLayer();
      return go(t.getAttribute('href').slice(1));
    }
    if (act === 'cop-link') { if (window.innerWidth < 900) closeLayer(); return; }
    if (act === 'cop-doubt') {
      const i = Number(t.getAttribute('data-i'));
      const ta = root.querySelector('[data-doubt-text="' + i + '"]');
      const text = ta ? ta.value.trim() : '';
      if (!text) return;
      const prev = (S.cop.thread || []).find((x) => x.i === i - 1 && x.r === 'u');
      try {
        const out = await withBusy(t, 'Enviando…', () => api('doubt.create', { text: text, field: prev && prev.f || '' }));
        if (!out.ok) { toast(out.message || 'No se pudo enviar'); return; }
        S.doubts = out.doubts;
        const dm = (S.cop.thread || []).find((x) => x.i === i && x.r === 'a');
        S.cop.doubtSent[(dm && dm.ts) || i] = 'Enviada. ' + (out.session ? 'La verá ' + S.facilitator + ' en el ' + sessionShort(out.session) + '.' : 'La verá ' + S.facilitator + '.');
        copRefresh();
        const home = view.querySelector('[data-doubts-home]'); if (home) home.outerHTML = doubtsHomeHtml();
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
      return;
    }
    if (act === 'nudge-off') { store.set(nudgeKey(t.getAttribute('data-n')), '1'); const n = t.closest('.wb-copnudge'); if (n) n.remove(); return; }
    if (act === 'doubt-open') {
      const f = t.getAttribute('data-field') || '';
      const slot = view.querySelector('[data-doubt-slot="' + f + '"]');
      if (!slot) return;
      slot.innerHTML = doubtForm(f);
      const ta = slot.querySelector('textarea'); if (ta) try { ta.focus({ preventScroll: false }); } catch (err) { }
      return;
    }
    if (act === 'doubt-withdraw') {
      if (!window.confirm('¿Retirar esta duda?')) return;
      try {
        const out = await withBusy(t, 'Un momento…', () => api('doubt.withdraw', { id: t.getAttribute('data-id') }));
        if (!out.ok) { toast(out.message || 'No se pudo retirar'); return; }
        S.doubts = out.doubts;
        const home = view.querySelector('[data-doubts-home]'); if (home) home.outerHTML = doubtsHomeHtml();
        toast('Duda retirada');
      } catch (err) { if (err.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
      return;
    }
    if (act === 'ics') { const s = (S.me.cohort.sessions || [])[Number(t.getAttribute('data-n')) - 1]; if (s) downloadIcs(s); return; }
    if (act === 'fu-status') {
      const f = t.getAttribute('data-field'), v = t.getAttribute('data-value');
      setAnswer(f, v);
      t.parentNode.querySelectorAll('[data-act=fu-status]').forEach((b) => { const on = b === t; b.classList.toggle('is-on', on); b.setAttribute('aria-checked', String(on)); });
      return;
    }
    if (act === 'fu-send') {
      const n = t.getAttribute('data-n');
      if (!filled(S.answers['SEG' + n + '_ESTADO'])) { toast('Elige cómo te fue con tu objetivo'); return; }
      setAnswer('SEG' + n + '_ENVIADO', mxToday());
      clearTimeout(S.saveTimer);
      await withBusy(t, 'Enviando…', saveNow);
      toast('¡Gracias! Tu check-in llegó al equipo de Agora');
      return renderFollowup(n);
    }
  }

  async function withBusy(btn, label, fn) {
    const html = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="wb-spin"></span> ' + esc(label);
    try { return await fn(); } finally { btn.disabled = false; btn.innerHTML = html; }
  }

  async function adminAction(btn, action, data, onOk) {
    try {
      const out = await withBusy(btn, 'Un momento…', () => api(action, data));
      if (!out.ok) { toast(out.message || 'No se pudo completar (' + out.error + ')'); return; }
      onOk(out);
    } catch (e) { if (e.code !== 'auth') toast('No pudimos conectar. Intenta de nuevo.'); }
  }

  async function submitDoubt(form) {
    const err = form.querySelector('[data-err]'), btn = form.querySelector('[data-submit]');
    const text = form.elements.text.value.trim(), field = form.getAttribute('data-field') || '';
    err.textContent = '';
    if (text.length < 3) { err.textContent = 'Escribe tu duda.'; return; }
    try {
      const out = await withBusy(btn, 'Enviando…', () => api('doubt.create', { text: text, field: field }));
      if (!out.ok) { err.textContent = out.message || 'No se pudo enviar.'; return; }
      S.doubts = out.doubts;
      const msg = 'Duda enviada. ' + (out.session ? 'La verá ' + S.facilitator + ' en el ' + sessionShort(out.session) + '.' : 'La verá ' + S.facilitator + '.');
      const home = view.querySelector('[data-doubts-home]');
      if (home && !field) { home.outerHTML = doubtsHomeHtml(); toast(msg); return; }
      form.outerHTML = '<p class="wb-ok wb-doubt-ok">' + ICON.check + esc(msg) + '</p>';
    } catch (e) { if (e.code !== 'auth') err.textContent = 'No pudimos conectar. Intenta de nuevo.'; }
  }

  function parseList(text) {
    return String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((line) => {
      const parts = line.split(/\t|;|,/).map((x) => x.trim()).filter(Boolean);
      const ei = parts.findIndex((x) => /@/.test(x));
      const email = ei >= 0 ? parts[ei].replace(/[<>]/g, '') : '';
      const rest = parts.filter((_, i) => i !== ei);
      return { name: rest[0] || '', email: email, company: rest.slice(1).join(', ') };
    });
  }

  async function onSubmit(e) {
    const form = e.target;
    if (!form.matches('form[data-form]')) return;
    e.preventDefault();
    const kind = form.getAttribute('data-form');
    if (kind === 'login') return doLogin(form);
    if (kind === 'cop') { const v = form.elements.msg.value; return copSend(v, { kind: 'chat' }); }
    if (kind === 'fc') return fcSubmit(form);
    if (kind === 'doubt') return submitDoubt(form);
    const err = form.querySelector('[data-err]');
    const btn = form.querySelector('[data-submit]');
    err.textContent = '';
    const F = form.elements;
    let action, data, after;
    if (kind === 'new-cohort' || kind === 'edit-cohort') {
      const name = F.name.value.trim(), kickoff = F.kickoff.value;
      if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(kickoff)) { err.textContent = 'Escribe el nombre y elige la fecha del kick-off.'; return; }
      if (kind === 'new-cohort') {
        const sessions = sessionDefaults().map((d, i) => readSessionForm(F, 's' + (i + 1) + '_'));
        const bad = sessions.findIndex((s) => s.start && s.end && s.end <= s.start);
        if (bad >= 0) { err.textContent = 'Sesión ' + (bad + 1) + ': la hora de fin debe ser después de la de inicio.'; return; }
        action = 'admin.cohort.create'; data = { name: name, kickoff: kickoff, sessions: sessions };
        after = (out) => { S.admin.cohorts = null; go('wb/cohorte/' + out.cohort.id); };
      } else {
        const id = route()[2];
        action = 'admin.cohort.update'; data = { id: id, name: name, kickoff: kickoff };
        after = (out) => { S.admin.detail[id].cohort = out.cohort; S.admin.cohorts = null; toast('Cohorte actualizada'); adminCohort(id); };
      }
    } else if (kind === 'edit-session') {
      const id = route()[2], n = Number(form.getAttribute('data-n'));
      const s = readSessionForm(F, ''); s.n = n;
      if (s.start && s.end && s.end <= s.start) { err.textContent = 'La hora de fin debe ser después de la de inicio.'; return; }
      action = 'admin.cohort.update'; data = { id: id, sessions: [s] };
      after = (out) => { S.admin.detail[id].cohort = out.cohort; S.admin.cohorts = null; toast('Sesión ' + n + ' actualizada'); adminCohort(id); };
    } else if (kind === 'add') {
      const id = route()[2];
      const list = S.admin.addMode === 'one' ? [{ name: F.name.value.trim(), email: F.email.value.trim(), company: F.company.value.trim() }] : parseList(F.list.value);
      if (!list.length || (S.admin.addMode === 'one' && (!list[0].name || !list[0].email))) { err.textContent = S.admin.addMode === 'one' ? 'Escribe al menos el nombre y el correo.' : 'Pega al menos una persona.'; return; }
      action = 'admin.participant.add'; data = { cohortId: id, participants: list, sendEmail: !!F.send.checked };
      after = (out) => {
        S.admin.lastAdd = { cohortId: id, added: out.added, skipped: out.skipped };
        S.admin.cohorts = null;
        adminCohort(id, true);
      };
    } else if (kind === 'cop-settings') {
      const budget = Number(F.budget.value);
      if (!(budget >= 0)) { err.textContent = 'Escribe un tope válido en dólares.'; return; }
      const daily = Math.round(Number(F.daily.value)), sprint = Math.round(Number(F.sprint.value));
      if (!(daily >= 1) || !(sprint >= 1)) { err.textContent = 'Los límites de mensajes deben ser de 1 o más.'; return; }
      action = 'admin.settings.set'; data = { enabled: !!F.enabled.checked, budget: budget, dailyLimit: daily, sprintLimit: sprint };
      after = (out) => { S.admin.settings = out.settings; S.admin.settingsOpen = false; toast('Ajustes del copiloto guardados'); const el = view.querySelector('.wb-copset'); if (el) el.outerHTML = copSettingsHtml(); };
    } else if (kind === 'doubt-reply') {
      const did = form.getAttribute('data-id'), cid = route()[2];
      const x = S.admin.detail[cid].doubts.find((y) => y.id === did);
      action = 'admin.doubt.update'; data = { id: did, reply: F.reply.value.trim(), notify: !!F.notify.checked };
      if (x && x.status === 'Pendiente' && F.reply.value.trim()) data.status = 'Resuelta';
      after = (out) => { setDoubtLocal(cid, out.doubt); S.admin.cohorts = null; refreshDoubts(cid); toast(out.mailed ? 'Respuesta guardada y enviada por correo' : 'Respuesta guardada'); };
    } else if (kind === 'cop-adjust') {
      const pid = form.getAttribute('data-id');
      action = 'admin.copilot.set'; data = { id: pid, until: F.until.value, limit: Number(F.limit.value) || 0, dailyLimit: Number(F.daily.value) || 0 };
      after = (out) => { replacePerson(out.participant); toast('Copiloto ajustado'); const card = form.closest('.wb-person'); if (card) card.outerHTML = personCard(out.participant); };
    } else if (kind === 'edit-person') {
      const pid = form.getAttribute('data-id');
      action = 'admin.participant.update'; data = { id: pid, name: F.name.value, email: F.email.value, company: F.company.value };
      after = (out) => { replacePerson(out.participant); delete S.admin.workbooks[pid]; toast('Datos actualizados'); adminCohort(route()[2]); };
    } else return;
    try {
      const out = await withBusy(btn, 'Guardando…', () => api(action, data));
      if (!out.ok) { err.textContent = out.message || 'No se pudo guardar (' + out.error + ').'; return; }
      after(out);
    } catch (e2) { if (e2.code !== 'auth') err.textContent = 'No pudimos conectar. Intenta de nuevo.'; }
  }

  /* ===================== PDF ===================== */
  const FONT_FILES = [['DMSans-Regular.ttf', 'DMSans', 'normal'], ['DMSans-Bold.ttf', 'DMSans', 'bold'], ['DMSerifDisplay-Regular.ttf', 'DMSerif', 'normal']];
  let fontCache = null;
  async function loadFonts() {
    if (fontCache) return fontCache;
    const toB64 = (buf) => { let s = ''; const b = new Uint8Array(buf); for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); };
    fontCache = await Promise.all(FONT_FILES.map(async (f) => {
      const res = await fetch(CFG.assetsBase + 'fonts/' + f[0]);
      if (!res.ok) throw new Error('font ' + f[0]);
      return [f[0], f[1], f[2], toB64(await res.arrayBuffer())];
    }));
    return fontCache;
  }

  // Quita caracteres que las fuentes del PDF no tienen (emojis, flechas…).
  function pdfText(s) {
    return String(s || '').replace(/\r/g, '').replace(/[→⇒➜]/g, '->').replace(/[✓✔]/g, '-')
      .replace(/[^\u0009\u000A -ɏ‐-‧‰-›€™×÷]/g, '');
  }

  async function downloadPdf(btn, data) {
    try {
      await withBusy(btn, 'Generando PDF…', () => buildPdf(data));
      toast('PDF listo');
    } catch (e) { console.error('[AG WB]', e); toast('No se pudo generar el PDF. Intenta de nuevo.'); }
  }

  async function buildPdf(data) {
    await loadScript(CFG.libs.jspdf);
    let fonts = null;
    try { fonts = await loadFonts(); } catch (e) { fonts = null; }
    const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4', compress: true });
    let SANS = 'helvetica', SERIF = 'times';
    if (fonts) {
      fonts.forEach((f) => { doc.addFileToVFS(f[0], f[3]); doc.addFont(f[0], f[1], f[2]); });
      SANS = 'DMSans'; SERIF = 'DMSerif';
    }
    const ans = data.answers || {}, prof = data.profile || {}, coh = data.cohort || {};
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    const M = 50, CW = W - 2 * M, BOTTOM = H - 64;
    const C = { ink: [0, 9, 25], blue: [26, 17, 247], deep: [0, 8, 109], lime: [203, 255, 139], limeSoft: [223, 249, 191], muted: [91, 95, 106], line: [214, 214, 214], bg: [246, 246, 248], white: [255, 255, 255], red: [197, 34, 31] };
    let y = M;
    const color = (c) => doc.setTextColor(c[0], c[1], c[2]);
    const fill = (c) => doc.setFillColor(c[0], c[1], c[2]);
    const draw = (c) => doc.setDrawColor(c[0], c[1], c[2]);
    const font = (fam, style, size) => { doc.setFont(fam, style || 'normal'); doc.setFontSize(size); };
    const newPage = () => { doc.addPage(); y = M; };
    const ensure = (h) => { if (y + h > BOTTOM) newPage(); };
    const lines = (txt, width) => doc.splitTextToSize(pdfText(txt), width);
    function para(txt, opt) {
      font(opt.font || SANS, opt.style, opt.size); color(opt.color || C.ink);
      const lh = opt.size * (opt.lh || 1.4);
      lines(txt, opt.width || CW).forEach((ln) => { ensure(lh); doc.text(ln, opt.x || M, y + opt.size * 0.8); y += lh; });
    }
    function pill(text, x, yy, bg, fg) {
      font(SANS, 'bold', 7.5);
      const w = doc.getTextWidth(text) + text.length * 0.9 + 16;
      fill(bg); doc.roundedRect(x, yy, w, 18, 9, 9, 'F');
      color(fg); doc.text(text, x + 8, yy + 12.2, { charSpace: 0.9 });
      return w;
    }
    // Alto que ocupará una caja de respuesta (para no dejar títulos huérfanos).
    function boxH(txt) {
      if (!filled(txt)) return 30 + 16;
      font(SANS, 'normal', 10.5);
      return lines(String(txt).trim(), CW - 22).length * 15 + 18 + 16;
    }
    const USABLE = BOTTOM - M;
    function keep(h) { if (h <= USABLE) ensure(h); else ensure(Math.min(h, 160)); }
    function answerBox(txt) {
      const pad = 11, size = 10.5, lh = 15;
      if (!filled(txt)) {
        ensure(34); fill(C.bg); draw(C.line); doc.setLineWidth(0.6); doc.roundedRect(M, y, CW, 30, 6, 6, 'FD');
        font(SANS, 'normal', 9.5); color(C.muted); doc.text('Sin respuesta todavía.', M + pad, y + 19); y += 30 + 16; return;
      }
      font(SANS, 'normal', size);
      const ls = lines(String(txt).trim(), CW - 2 * pad);
      let i = 0;
      while (i < ls.length) {
        let n = Math.floor((BOTTOM - y - 2 * pad) / lh);
        if (n < 2) { newPage(); continue; }
        n = Math.min(n, ls.length - i);
        const h = n * lh + 2 * pad - 4;
        fill(C.bg); draw(C.line); doc.setLineWidth(0.6); doc.roundedRect(M, y, CW, h, 6, 6, 'FD');
        font(SANS, 'normal', size); color(C.ink);
        ls.slice(i, i + n).forEach((ln, j) => doc.text(ln, M + pad, y + pad + size * 0.82 + j * lh));
        y += h; i += n;
        if (i < ls.length) newPage();
      }
      y += 16;
    }

    // ---- Portada ----
    const pr = progress(ans);
    fill(C.deep); doc.rect(0, 0, W, 318, 'F');
    try { doc.addImage(LOGO_WHITE, 'PNG', M, 46, 150, 38.2); } catch (e) { }
    pill(('Sprint Ejecutivo' + (coh.name ? ' · ' + coh.name : '')).toUpperCase(), M, 118, C.lime, C.ink);
    font(SERIF, 'normal', 32); color(C.white);
    y = 150;
    lines(CONTENT.title, CW).forEach((ln) => { doc.text(ln, M, y + 26); y += 36; });
    font(SANS, 'normal', 14); color([201, 203, 245]);
    doc.text(pdfText(prof.name || ''), M, y + 18);
    if (prof.company) { font(SANS, 'normal', 11); doc.text(pdfText(prof.company), M, y + 38); }
    y = 360;
    font(SERIF, 'normal', 56); color(C.blue); doc.text(pr.pct + '%', M, y + 40);
    const pw = doc.getTextWidth(pr.pct + '%');
    font(SANS, 'bold', 12); color(C.ink); doc.text('de tu workbook completo', M + pw + 14, y + 22);
    font(SANS, 'normal', 10.5); color(C.muted);
    doc.text(pr.answered + ' de ' + pr.total + ' secciones · ' + pr.done.length + ' de 8 Blueprints terminados · Plan de 90 días: ' + pr.plan + '/9', M + pw + 14, y + 39);
    y += 66;
    fill(C.line); doc.rect(M, y, CW, 0.8, 'F'); y += 22;
    font(SANS, 'bold', 8); color(C.blue); doc.text('CONTENIDO', M, y, { charSpace: 1.2 }); y += 18;
    BPS.forEach((bp) => {
      const b = bpProgress(bp, ans);
      font(SANS, 'bold', 11); color(C.ink); doc.text('Blueprint ' + bp.n + ' · ' + bp.title, M, y);
      font(SANS, 'normal', 10); color(b.done ? C.blue : C.muted);
      doc.text(b.done ? 'Terminado · ' + b.n + '/' + b.total : b.n + '/' + b.total + ' secciones', W - M, y, { align: 'right' });
      y += 22;
    });
    font(SANS, 'bold', 11); color(C.ink); doc.text(CONTENT.plan.title, M, y);
    font(SANS, 'normal', 10); color(C.muted); doc.text(pr.plan + '/9 campos', W - M, y, { align: 'right' });
    y += 34;
    font(SANS, 'normal', 9.5); color(C.muted); doc.text('Generado el ' + longDate(new Date()), M, y);

    // ---- Mi empresa ----
    const cmp = companyFields().filter((f) => !/^PREP_/.test(f.id) && filled(ans[f.id]));
    if (cmp.length) {
      newPage();
      font(SANS, 'bold', 8); color(C.blue); doc.text('MI EMPRESA', M, y + 6, { charSpace: 1.2 }); y += 18;
      para(String(ans.EMP_NOMBRE || prof.company || 'Mi empresa'), { font: SERIF, size: 26, lh: 1.15 }); y += 2;
      para('El contexto de tu negocio que usan tu copiloto y tus prompts.', { size: 11, color: C.muted }); y += 12;
      cmp.forEach((f) => {
        keep(16 + boxH(ans[f.id]));
        font(SANS, 'bold', 10); color(C.ink); doc.text(pdfText(f.label), M, y + 8); y += 16;
        answerBox(ans[f.id]);
      });
    }

    // ---- Preparación antes del kick-off ----
    const prepFields = [];
    CONTENT.prep.groups.forEach((g) => (g.fields || []).forEach((f) => prepFields.push(f)));
    if (prepFields.some((f) => filled(ans[f.id]))) {
      newPage();
      font(SANS, 'bold', 8); color(C.blue); doc.text('ANTES DEL KICK-OFF', M, y + 6, { charSpace: 1.2 }); y += 18;
      para('Tu preparación', { font: SERIF, size: 26, lh: 1.15 }); y += 2;
      para('Tus segmentos y tus números de partida, de la guía previa al Sprint.', { size: 11, color: C.muted }); y += 12;
      prepFields.forEach((f) => {
        keep(16 + boxH(ans[f.id]));
        font(SANS, 'bold', 10); color(C.ink); doc.text(pdfText(f.label), M, y + 8); y += 16;
        answerBox(ans[f.id]);
      });
    }

    // ---- Blueprints ----
    BPS.forEach((bp) => {
      newPage();
      font(SANS, 'bold', 8); color(C.blue); doc.text(('Blueprint ' + bp.n + ' de 8').toUpperCase(), M, y + 6, { charSpace: 1.2 }); y += 18;
      para(bp.title + (bp.subtitle ? ' (' + bp.subtitle + ')' : ''), { font: SERIF, size: 26, lh: 1.15 });
      y += 2; para(bp.tagline, { size: 11, color: C.muted }); y += 8;
      font(SANS, 'normal', 10);
      const tl = lines('Qué te llevas: ' + bp.takeaway, CW - 24);
      const th = tl.length * 14 + 18;
      fill(C.limeSoft); doc.roundedRect(M, y, CW, th, 6, 6, 'F');
      color(C.ink); tl.forEach((ln, j) => doc.text(ln, M + 12, y + 15 + j * 14));
      y += th + 12;
      if (bp.callout) {
        font(SANS, 'normal', 9.5);
        const cl = lines(bp.callout.text, CW - 24);
        const ch = cl.length * 13 + 32;
        ensure(ch);
        draw(C.blue); doc.setLineWidth(1); doc.roundedRect(M, y, CW, ch, 6, 6, 'S');
        font(SANS, 'bold', 8); color(C.blue); doc.text(pdfText(bp.callout.title).toUpperCase(), M + 12, y + 15, { charSpace: 0.8 });
        font(SANS, 'normal', 9.5); color(C.ink); cl.forEach((ln, j) => doc.text(ln, M + 12, y + 29 + j * 13));
        y += ch + 8;
      }
      y += 8;
      bp.sections.forEach((s) => {
        font(SANS, 'bold', 12.5); const th = lines(s.title, CW - 28).length * 16;
        font(SANS, 'normal', 9.5); const qh = lines(s.question, CW).length * 9.5 * 1.38;
        keep(th + 6 + qh + 6 + boxH(ans[s.id]));
        fill(C.blue); doc.circle(M + 9, y + 8, 9, 'F');
        font(SANS, 'bold', 9.5); color(C.white); doc.text(String(s.n), M + 9, y + 11.4, { align: 'center' });
        const titleY = y;
        font(SANS, 'bold', 12.5); color(C.ink);
        lines(s.title, CW - 28).forEach((ln, j) => { doc.text(ln, M + 26, titleY + 12 + j * 16); y = titleY + 16 * (j + 1); });
        y += 6;
        para(s.question, { size: 9.5, color: C.muted, lh: 1.38 });
        y += 6;
        answerBox(ans[s.id]);
      });
      if (filled(ans[bp.doneId])) { ensure(26); pill('BLUEPRINT ' + bp.n + ' TERMINADO', M, y, C.lime, C.ink); y += 30; }
    });

    // ---- Plan de 90 días ----
    newPage();
    font(SANS, 'bold', 8); color(C.blue); doc.text('CIERRE DEL SPRINT', M, y + 6, { charSpace: 1.2 }); y += 18;
    para(CONTENT.plan.title, { font: SERIF, size: 26, lh: 1.15 }); y += 2;
    para(CONTENT.plan.intro, { size: 11, color: C.muted }); y += 12;
    CONTENT.plan.periods.forEach((p) => {
      keep(38 + CONTENT.plan.fields.reduce((h, f) => h + 16 + boxH(ans['PLAN_' + p.id + '_' + f.id]), 0));
      fill(C.ink); doc.roundedRect(M, y, CW, 26, 6, 6, 'F');
      font(SANS, 'bold', 10); color(C.lime); doc.text(p.label.toUpperCase(), M + 12, y + 17, { charSpace: 1 }); y += 38;
      CONTENT.plan.fields.forEach((f) => {
        keep(16 + boxH(ans['PLAN_' + p.id + '_' + f.id]));
        font(SANS, 'bold', 10); color(C.ink); doc.text(f.label, M, y + 8); y += 16;
        answerBox(ans['PLAN_' + p.id + '_' + f.id]);
      });
    });

    // ---- Pies de página ----
    const total = doc.getNumberOfPages();
    for (let i = 2; i <= total; i++) {
      doc.setPage(i);
      fill(C.line); doc.rect(M, H - 42, CW, 0.6, 'F');
      font(SANS, 'normal', 8.5); color(C.muted);
      doc.text(pdfText(CONTENT.title + ' · ' + (prof.name || '')), M, H - 28);
      doc.text('agoragrowth.com · ' + i + '/' + total, W - M, H - 28, { align: 'right' });
    }
    doc.setProperties({ title: CONTENT.title + ' · ' + (prof.name || ''), author: 'Agora Growth', subject: 'Sprint Ejecutivo', creator: 'agoragrowth.com' });
    doc.save('Workbook-Sistema-de-Ingresos' + (prof.name ? '-' + slug(prof.name) : '') + '.pdf');
  }

  /* ===================== ESTILOS ===================== */
  const CSS = "#ag-wb{--ink:#000919;--blue:#1a11f7;--blue-h:#1209c9;--deep:#00086d;--lime:#cbff8b;--lime-soft:#dff9bf;--lime-line:#b8ec7a;--bg:#f3f3f3;--card:#fafafa;--line:#d6d6d6;--muted:#5b5f6a;--faint:#e3e3e6;--red:#c5221f;font-family:\"DM Sans\",system-ui,-apple-system,\"Segoe UI\",sans-serif;color:var(--ink);background:var(--bg);border-radius:24px;padding:28px 20px 40px;max-width:1000px;margin:0 auto;text-align:left;line-height:1.5;font-size:16px;-webkit-font-smoothing:antialiased;position:relative}#ag-wb *,#ag-wb *::before,#ag-wb *::after{box-sizing:border-box}#ag-wb [hidden]{display:none!important}#ag-wb h1,#ag-wb h2,#ag-wb h3,#ag-wb h4,#ag-wb p,#ag-wb ul,#ag-wb figure{margin:0}#ag-wb ul{padding-left:20px}#ag-wb label{margin:0;font-weight:inherit}#ag-wb a{color:var(--blue)}#ag-wb svg{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}#ag-wb button{font-family:inherit;margin:0}#ag-wb code{font:700 15px/1 ui-monospace,\"SFMono-Regular\",Menlo,Consolas,monospace;letter-spacing:.08em}#ag-wb .wb-h1{font:400 40px/1.06 \"DM Serif Display\",Georgia,serif;margin:14px 0 0;color:var(--ink);letter-spacing:0}#ag-wb .wb-h1 span{color:var(--blue)}#ag-wb .wb-h1 .wb-sub{font-size:.6em;color:var(--muted)}#ag-wb .wb-h1--light{color:#fff}#ag-wb .wb-h2{font:400 28px/1.15 \"DM Serif Display\",Georgia,serif;color:var(--ink);margin-top:12px}#ag-wb .wb-h3{font:700 18px/1.3 \"DM Sans\",sans-serif;color:var(--ink)}#ag-wb .wb-lead{font-size:17px;color:var(--muted);margin-top:12px;max-width:40em}#ag-wb .wb-muted{color:var(--muted)}#ag-wb .wb-small{font-size:13px;color:var(--muted);margin-top:14px}#ag-wb .wb-mt{margin-top:12px}#ag-wb .wb-note{margin-top:16px;padding:12px 14px;border-radius:12px;background:var(--lime-soft);font-size:14px}#ag-wb .wb-err{min-height:0;color:var(--red);font-size:14px;font-weight:500}#ag-wb .wb-err:empty{display:none}#ag-wb .wb-ok{color:#1d7a3a;font-weight:700}#ag-wb .wb-bad{color:var(--red);font-weight:700}#ag-wb .wb-label{font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:16px 0 8px}#ag-wb .wb-label--top{margin-top:0}#ag-wb .wb-kicker{display:block;font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}#ag-wb .wb-pill{display:inline-block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:8px 13px;border-radius:999px;background:var(--blue);color:#fff}#ag-wb .wb-pill--lime{background:var(--lime);color:var(--ink)}#ag-wb .wb-pill--ink{background:var(--ink);color:var(--lime)}#ag-wb .wb-chip{display:inline-flex;align-items:center;gap:4px;font:700 12px/1 \"DM Sans\",sans-serif;padding:6px 10px;border-radius:999px;background:#e8e7ff;color:var(--blue);white-space:nowrap}#ag-wb .wb-chip svg{width:13px;height:13px;stroke-width:3}#ag-wb .wb-chip--done{background:var(--lime);color:var(--ink)}#ag-wb .wb-chip--muted{background:var(--faint);color:var(--muted)}#ag-wb .wb-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 22px;border:0;border-radius:999px;background:var(--blue);color:#fff;font:700 15px/1.2 \"DM Sans\",sans-serif;cursor:pointer;text-decoration:none;transition:background .15s,opacity .15s;-webkit-appearance:none;appearance:none;text-align:center;white-space:nowrap}#ag-wb .wb-btn:hover{background:var(--blue-h);color:#fff}#ag-wb .wb-btn:disabled{opacity:.6;cursor:progress}#ag-wb .wb-btn--full{display:flex;width:100%;min-height:54px;font-size:16px}#ag-wb .wb-btn--lime{background:var(--lime);color:var(--ink);margin-top:20px}#ag-wb .wb-btn--lime:hover{background:#b9f26d;color:var(--ink)}#ag-wb .wb-btn--ghost{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--line)}#ag-wb .wb-btn--ghost:hover{background:#fff;color:var(--blue);box-shadow:inset 0 0 0 1.5px var(--blue)}#ag-wb .wb-btn--danger{background:#fff;color:var(--red);box-shadow:inset 0 0 0 1.5px #f0c4c3}#ag-wb .wb-btn--danger:hover{background:#fff5f5;color:var(--red)}#ag-wb .wb-btn--sm{min-height:36px;padding:8px 14px;font-size:13px}#ag-wb .wb-btn svg{width:17px;height:17px}#ag-wb .wb-icon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:0;background:transparent;color:var(--ink);cursor:pointer;padding:0}#ag-wb .wb-icon:hover{background:var(--faint)}#ag-wb .wb-btn:focus-visible,#ag-wb .wb-icon:focus-visible,#ag-wb .wb-tool:focus-visible,#ag-wb a:focus-visible,#ag-wb .wb-route:focus-visible,#ag-wb .wb-done:focus-visible,#ag-wb .wb-copy:focus-visible,#ag-wb summary:focus-visible,#ag-wb .wb-tabs button:focus-visible{outline:3px solid var(--blue);outline-offset:2px}#ag-wb .wb-form{display:grid;gap:14px}#ag-wb .wb-field{display:grid;gap:7px}#ag-wb .wb-field>span{font:700 14px/1.2 \"DM Sans\",sans-serif;color:var(--ink)}#ag-wb .wb-field em{font-style:normal;font-weight:400;color:var(--muted)}#ag-wb .wb-input{display:block;width:100%;height:50px;padding:0 15px;border:1.5px solid var(--line);border-radius:14px;background:#fff;font:400 16px/1.2 \"DM Sans\",sans-serif;color:var(--ink);margin:0;box-shadow:none;-webkit-appearance:none;appearance:none}#ag-wb .wb-input:focus,#ag-wb .wb-ta:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 4px rgba(26,17,247,.14)}#ag-wb .wb-pin{font:700 22px/1 ui-monospace,\"SFMono-Regular\",Menlo,Consolas,monospace;letter-spacing:.4em}#ag-wb .wb-ta{display:block;width:100%;min-height:84px;padding:13px 15px;border:1.5px solid var(--line);border-radius:14px;background:#fff;font:400 16px/1.55 \"DM Sans\",sans-serif;color:var(--ink);resize:vertical;margin:0;box-shadow:none;overflow:hidden;-webkit-appearance:none;appearance:none}#ag-wb .wb-ta::placeholder,#ag-wb .wb-input::placeholder{color:#9a9ea9}#ag-wb .wb-ta--list{min-height:130px;overflow:auto;font-size:15px}#ag-wb .wb-checkline{display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}#ag-wb .wb-checkline input{width:18px;height:18px;margin:0;accent-color:var(--blue)}#ag-wb .wb-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}#ag-wb .wb-grid2,#ag-wb .wb-grid3{display:grid;gap:14px}#ag-wb .wb-screen{animation:agwbIn .25s ease}@keyframes agwbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}#ag-wb .wb-center{display:grid;justify-items:center;gap:14px;text-align:center;padding:70px 10px;color:var(--muted)}#ag-wb .wb-spin{display:inline-block;width:18px;height:18px;border-radius:50%;border:2.5px solid rgba(26,17,247,.2);border-top-color:var(--blue);animation:agwbSpin .8s linear infinite;vertical-align:-3px}#ag-wb .wb-center .wb-spin{width:30px;height:30px;border-width:3px}#ag-wb .wb-spin--light{border-color:rgba(255,255,255,.35);border-top-color:#fff}@keyframes agwbSpin{to{transform:rotate(360deg)}}#ag-wb .wb-sec{margin-top:36px}#ag-wb .wb-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:14px}#ag-wb .wb-row-sm{display:flex;justify-content:space-between;gap:10px;font-size:14px}#ag-wb .wb-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:20px}#ag-wb .wb-empty{display:grid;gap:4px;padding:26px 20px;border:1.5px dashed var(--line);border-radius:18px;text-align:center;color:var(--muted);margin-top:14px}#ag-wb .wb-empty strong{color:var(--ink)}#ag-wb .wb-login{max-width:440px;margin:24px auto 10px}#ag-wb .wb-login-logo{display:block;height:34px;width:auto;margin-bottom:30px}#ag-wb .wb-login .wb-form{margin-top:24px}#ag-wb .wb-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:18px;margin-bottom:22px;border-bottom:1px solid var(--line)}#ag-wb .wb-hello strong{display:block;font:400 24px/1.2 \"DM Serif Display\",Georgia,serif;margin-top:4px}#ag-wb .wb-tools{display:flex;gap:8px;flex-wrap:wrap}#ag-wb .wb-tool{display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 14px;border-radius:999px;border:0;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--ink);font:700 14px/1 \"DM Sans\",sans-serif;cursor:pointer}#ag-wb .wb-tool:hover{box-shadow:inset 0 0 0 1.5px var(--blue);color:var(--blue)}#ag-wb .wb-tool:disabled{opacity:.6;cursor:progress}#ag-wb .wb-tool--ghost{background:transparent;box-shadow:none;color:var(--muted)}#ag-wb .wb-hero{border-radius:24px;padding:28px 22px 26px;color:#fff;background:linear-gradient(160deg,var(--deep) 0%,#0000d8 100%);position:relative;overflow:hidden}#ag-wb .wb-hero::after{content:\"\";position:absolute;right:-90px;top:-90px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(203,255,139,.22),transparent 70%);pointer-events:none}#ag-wb .wb-hero .wb-h1{font-size:32px;margin-top:14px;max-width:16em}#ag-wb .wb-hero-stats{display:flex;flex-wrap:wrap;align-items:flex-end;gap:6px 18px;margin-top:18px}#ag-wb .wb-big{font:400 64px/1 \"DM Serif Display\",Georgia,serif;color:var(--lime)}#ag-wb .wb-big small{font-size:.5em}#ag-wb .wb-hero-stats p{color:#c9cbf5;font-size:15px;max-width:30em;padding-bottom:8px}#ag-wb .wb-bar{height:8px;border-radius:99px;background:var(--faint);overflow:hidden;margin-top:10px}#ag-wb .wb-bar i{display:block;height:100%;background:var(--blue);border-radius:99px;transition:width .4s ease}#ag-wb .wb-bar--hero{background:rgba(255,255,255,.18);margin-top:16px}#ag-wb .wb-bar--hero i{background:var(--lime)}#ag-wb .wb-steps{display:grid;gap:10px;margin-top:14px}#ag-wb .wb-step{display:grid;grid-template-columns:34px 1fr;gap:2px 12px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:16px}#ag-wb .wb-step b{grid-row:span 2;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--lime);font:700 15px/1 \"DM Sans\",sans-serif}#ag-wb .wb-step span{font-size:14px;color:var(--muted)}#ag-wb .wb-routes{display:grid;gap:10px;margin-top:16px}#ag-wb .wb-route{display:grid;grid-template-columns:1fr 30px;grid-template-areas:\"when check\" \"text check\";gap:6px 14px;align-items:center;width:100%;text-align:left;padding:14px 16px;border-radius:16px;border:1.5px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;font:400 15px/1.45 \"DM Sans\",sans-serif;transition:border-color .15s,background .15s}#ag-wb .wb-route:hover{border-color:var(--blue)}#ag-wb .wb-route-when{grid-area:when;display:flex;flex-wrap:wrap;align-items:center;gap:8px;font:700 13px/1.2 \"DM Sans\",sans-serif;color:var(--blue)}#ag-wb .wb-route-when small{font-weight:500;color:var(--muted);font-size:13px}#ag-wb .wb-route-when em{font-style:normal;font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:var(--ink);color:var(--lime);padding:4px 8px;border-radius:99px}#ag-wb .wb-route-text{grid-area:text}#ag-wb .wb-check{grid-area:check;width:28px;height:28px;border-radius:9px;border:1.5px solid var(--line);display:inline-flex;align-items:center;justify-content:center;background:#fff;color:transparent;flex:0 0 28px}#ag-wb .wb-check svg{width:16px;height:16px;stroke-width:3}#ag-wb .wb-route.is-on{background:#f6fdee;border-color:var(--lime-line)}#ag-wb .wb-route.is-on .wb-check,#ag-wb .wb-done.is-on .wb-check{background:var(--lime);border-color:var(--lime-line);color:var(--ink)}#ag-wb .wb-route.is-on .wb-route-text{color:var(--muted)}#ag-wb .wb-callout{display:grid;gap:4px;margin-top:14px;padding:16px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line);font-size:14px}#ag-wb .wb-bpgrid{display:grid;gap:12px;margin-top:16px}#ag-wb .wb-bpcard{display:flex;gap:14px;padding:16px;border-radius:18px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);transition:border-color .15s,transform .15s}#ag-wb .wb-bpcard:hover{border-color:var(--blue);transform:translateY(-1px);color:var(--ink)}#ag-wb .wb-bpcard.is-done{border-color:var(--lime-line);background:#fbfff6}#ag-wb .wb-bpnum{flex:0 0 40px;width:40px;height:40px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font:400 20px/1 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-bpcard.is-done .wb-bpnum{background:var(--lime);color:var(--ink)}#ag-wb .wb-bpbody{display:block;flex:1;min-width:0}#ag-wb .wb-bpbody strong{display:block;font:700 17px/1.25 \"DM Sans\",sans-serif}#ag-wb .wb-bpbody small{display:block;font-size:13px;color:var(--muted);margin-top:2px}#ag-wb .wb-bpmeta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px;font-size:13px}#ag-wb .wb-two{display:grid;gap:12px}#ag-wb .wb-card--link{display:grid;gap:8px;position:relative;text-decoration:none;color:var(--ink);padding-right:50px;transition:border-color .15s}#ag-wb .wb-card--link .wb-pill{justify-self:start}#ag-wb .wb-card--link:hover{border-color:var(--blue);color:var(--ink)}#ag-wb .wb-card--link>svg{position:absolute;right:18px;top:50%;margin-top:-11px;width:22px;height:22px;color:var(--blue)}#ag-wb .wb-crumbs{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:16px;font-size:14px}#ag-wb .wb-crumbs a{display:inline-flex;align-items:center;gap:4px;font-weight:700;text-decoration:none;color:var(--ink)}#ag-wb .wb-crumbs a:hover{color:var(--blue)}#ag-wb .wb-bphead{margin-bottom:22px}#ag-wb .wb-take{padding:16px 18px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line)}#ag-wb .wb-take span{display:block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}#ag-wb .wb-vs{display:grid;gap:10px}#ag-wb .wb-vs>div{padding:16px;border-radius:16px;font-size:15px}#ag-wb .wb-vs b{display:block;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}#ag-wb .wb-vs-bad{background:#fff;border:1.5px solid #f0c4c3}#ag-wb .wb-vs-bad b{color:var(--red)}#ag-wb .wb-vs-good{background:#fff;border:1.5px solid var(--lime-line)}#ag-wb .wb-vs-good b{color:#1d7a3a}#ag-wb .wb-master{margin-top:22px;padding:18px;border-radius:18px;background:var(--ink);color:#e9eaf2}#ag-wb .wb-master p{font-size:14px;line-height:1.6;white-space:pre-line}#ag-wb .wb-prompt-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}#ag-wb .wb-prompt-head>span{font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--lime)}#ag-wb .wb-copy{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:0;background:var(--lime);color:var(--ink);font:700 13px/1 \"DM Sans\",sans-serif;cursor:pointer;white-space:nowrap}#ag-wb .wb-copy:hover{background:#b9f26d}#ag-wb .wb-copy svg{width:15px;height:15px}#ag-wb .wb-section{margin-top:18px;padding:20px 18px;border-radius:20px;background:#fff;border:1px solid var(--line);scroll-margin-top:90px}#ag-wb .wb-section-head{display:flex;align-items:flex-start;gap:12px}#ag-wb .wb-num{flex:0 0 30px;width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font:700 14px/1 \"DM Sans\",sans-serif;margin-top:-2px}#ag-wb .wb-q{margin-top:10px;font-size:15px;color:var(--muted)}#ag-wb .wb-prompt{margin-top:14px;padding:14px;border-radius:14px;background:var(--bg)}#ag-wb .wb-prompt .wb-prompt-head>span{color:var(--blue)}#ag-wb .wb-prompt p{font-size:14px;line-height:1.55;color:var(--muted)}#ag-wb .wb-answer{padding:13px 15px;border-radius:14px;background:var(--card);border:1px solid var(--line);white-space:pre-wrap;font-size:15px;overflow-wrap:anywhere}#ag-wb .wb-answer.is-empty{color:#9a9ea9;font-style:italic}#ag-wb .wb-faqs{display:grid;gap:8px;margin-top:14px}#ag-wb .wb-faq{background:#fff;border:1px solid var(--line);border-radius:14px;padding:0 16px}#ag-wb .wb-faq summary{cursor:pointer;padding:14px 0;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px}#ag-wb .wb-faq summary::-webkit-details-marker{display:none}#ag-wb .wb-faq summary::after{content:\"+\";font:400 22px/1 \"DM Sans\",sans-serif;color:var(--blue)}#ag-wb .wb-faq[open] summary::after{content:\"–\"}#ag-wb .wb-faq p{padding-bottom:14px;color:var(--muted);font-size:15px}#ag-wb .wb-res{display:grid;gap:4px;justify-items:start;margin-top:12px;padding:16px;border-radius:16px;background:#fff;border:1px solid var(--line);font-size:14px}#ag-wb .wb-res strong{font-size:16px}#ag-wb .wb-res a{word-break:break-all}#ag-wb .wb-done{display:flex;align-items:center;gap:14px;width:100%;margin-top:32px;padding:18px;border-radius:18px;border:1.5px dashed var(--blue);background:#fff;color:var(--ink);font:700 16px/1.35 \"DM Sans\",sans-serif;text-align:left;cursor:pointer}#ag-wb .wb-done .wb-check{width:32px;height:32px;flex-basis:32px}#ag-wb .wb-done.is-on{border-style:solid;border-color:var(--lime-line);background:var(--lime-soft)}#ag-wb .wb-pager{display:grid;gap:10px;margin-top:28px}#ag-wb .wb-pager a{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:16px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);font-weight:700}#ag-wb .wb-pager a:hover{border-color:var(--blue)}#ag-wb .wb-pager a.is-next{justify-content:flex-end;text-align:right;background:var(--blue);border-color:var(--blue);color:#fff}#ag-wb .wb-pager small{display:block;font-weight:500;font-size:12px;opacity:.75}#ag-wb .wb-period{margin-top:18px;padding:18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-period-head{display:inline-block;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:9px 14px;border-radius:999px;background:var(--ink);color:var(--lime)}#ag-wb .wb-save{position:fixed;left:16px;bottom:16px;z-index:2147482000;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;background:var(--ink);color:#fff;font:700 13px/1 \"DM Sans\",sans-serif;box-shadow:0 8px 24px rgba(0,9,25,.2);opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}#ag-wb .wb-save.is-on{opacity:1;transform:none}#ag-wb .wb-save svg{width:15px;height:15px;stroke:var(--lime);stroke-width:3}#ag-wb .wb-dot{width:8px;height:8px;border-radius:50%;background:#ffc94d}#ag-wb .wb-save.is-saving .wb-dot{background:var(--lime);animation:agwbPulse 1s ease infinite}#ag-wb .wb-save.is-offline{background:var(--red)}#ag-wb .wb-save.is-offline .wb-dot{background:#fff}@keyframes agwbPulse{50%{opacity:.3}}#ag-wb .wb-toast{position:fixed;left:50%;bottom:16px;z-index:2147482700;transform:translate(-50%,16px);padding:12px 18px;border-radius:999px;background:var(--lime);color:var(--ink);font:700 14px/1.2 \"DM Sans\",sans-serif;box-shadow:0 8px 24px rgba(0,9,25,.2);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:calc(100vw - 32px);text-align:center}#ag-wb .wb-toast.is-on{opacity:1;transform:translate(-50%,0)}#ag-wb .wb-layer{display:none}#ag-wb .wb-layer.is-on{display:block}#ag-wb .wb-overlay{position:fixed;inset:0;z-index:2147482500;background:rgba(0,9,25,.45)}#ag-wb .wb-drawer{position:fixed;top:0;right:0;bottom:0;z-index:2147482501;width:min(480px,100vw);background:var(--bg);display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,9,25,.25);animation:agwbDrawer .25s ease}@keyframes agwbDrawer{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}#ag-wb .wb-drawer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 20px 12px}#ag-wb .wb-drawer-head .wb-h2{font-size:24px;margin-top:10px}#ag-wb .wb-search{display:flex;align-items:center;gap:8px;margin:0 20px 10px;padding:0 14px;height:46px;border-radius:14px;background:#fff;border:1.5px solid var(--line);color:var(--muted)}#ag-wb .wb-search:focus-within{border-color:var(--blue)}#ag-wb .wb-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;font:400 16px/1 \"DM Sans\",sans-serif;color:var(--ink);padding:0;margin:0;box-shadow:none;-webkit-appearance:none;appearance:none}#ag-wb .wb-search--inline{margin:0;flex:1 1 260px;max-width:360px}#ag-wb .wb-gloss{flex:1;overflow-y:auto;padding:4px 20px 30px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}#ag-wb .wb-gloss-group{margin-top:16px}#ag-wb .wb-gloss-group h3{font:700 11px/1.3 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}#ag-wb .wb-gloss-group.is-current h3{color:var(--blue)}#ag-wb .wb-term{padding:12px 14px;border-radius:14px;background:#fff;border:1px solid var(--line);margin-bottom:8px}#ag-wb .wb-gloss-group.is-current .wb-term{border-color:#c9c6ff}#ag-wb .wb-term p{font-size:14px;color:var(--muted);margin-top:3px}#ag-wb .wb-gloss-empty{padding:30px 0;text-align:center;color:var(--muted)}#ag-wb .wb-tip{display:grid;gap:4px;margin-top:18px;padding:14px;border-radius:14px;background:var(--lime-soft);font-size:14px}#ag-wb .wb-cohorts{display:grid;gap:12px}#ag-wb .wb-cohort{display:grid;gap:6px;padding:18px;border-radius:20px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);transition:border-color .15s}#ag-wb .wb-cohort:hover{border-color:var(--blue);color:var(--ink)}#ag-wb .wb-cohort.is-closed{background:var(--card)}#ag-wb .wb-cohort-head{display:flex;justify-content:space-between;align-items:center;gap:10px}#ag-wb .wb-cohort-head strong{font:400 22px/1.2 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-cohort-stats{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px;color:var(--muted);margin-top:6px}#ag-wb .wb-cohort-stats b{color:var(--ink)}#ag-wb [data-newcohort],#ag-wb [data-editcohort]{margin-bottom:16px}#ag-wb .wb-add{margin-bottom:6px}#ag-wb .wb-add .wb-form{margin-top:16px}#ag-wb .wb-tabs{display:inline-flex;padding:4px;border-radius:999px;background:var(--bg)}#ag-wb .wb-tabs button{border:0;background:transparent;padding:8px 16px;border-radius:999px;font:700 14px/1 \"DM Sans\",sans-serif;color:var(--muted);cursor:pointer}#ag-wb .wb-tabs button[aria-selected=\"true\"]{background:var(--ink);color:#fff}#ag-wb .wb-result{margin-top:16px;padding:16px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line);display:grid;gap:8px;justify-items:start;font-size:14px}#ag-wb .wb-result ul{display:grid;gap:4px}#ag-wb .wb-result code{font-size:14px}#ag-wb .wb-people{display:grid;gap:12px;margin-top:14px}#ag-wb .wb-person{display:grid;gap:14px;padding:18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-person.is-inactive{background:var(--card);opacity:.85}#ag-wb .wb-person-main strong{display:block;font-size:17px}#ag-wb .wb-person-main span{font-size:14px;overflow-wrap:anywhere}#ag-wb .wb-person-pin{display:flex;align-items:center;gap:6px}#ag-wb .wb-person-pin .wb-label{margin:0 6px 0 0}#ag-wb .wb-person-pin code{min-width:72px}#ag-wb .wb-bpdots{display:flex;gap:5px;margin-top:10px}#ag-wb .wb-bpdots i{width:24px;height:24px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;font:700 11px/1 \"DM Sans\",sans-serif;font-style:normal;background:var(--faint);color:var(--muted)}#ag-wb .wb-bpdots i.on{background:var(--lime);color:var(--ink)}#ag-wb .wb-person-meta{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:13px;color:var(--muted)}#ag-wb .wb-person-actions{display:flex;flex-wrap:wrap;gap:8px}#ag-wb .wb-editp{padding-top:14px;border-top:1px solid var(--line)}#ag-wb [data-edit-slot]:empty{display:none}#ag-wb .wb-inactive{margin-top:22px}#ag-wb .wb-inactive summary{cursor:pointer;font-weight:700;color:var(--muted)}#ag-wb .wb-statrow{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}#ag-wb .wb-statrow div{padding:14px;border-radius:16px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-statrow b{display:block;font:400 28px/1.1 \"DM Serif Display\",Georgia,serif;color:var(--blue)}#ag-wb .wb-statrow span{font-size:13px;color:var(--muted)}#ag-wb .wb-ro{margin-top:10px;border-radius:18px;background:#fff;border:1px solid var(--line);padding:0 16px}#ag-wb .wb-ro>summary{display:flex;align-items:center;gap:12px;padding:14px 0;cursor:pointer;list-style:none}#ag-wb .wb-ro>summary::-webkit-details-marker{display:none}#ag-wb .wb-ro>summary strong{display:block}#ag-wb .wb-ro>summary small{display:block;font-size:13px;color:var(--muted)}#ag-wb .wb-ro .wb-bpnum{flex-basis:36px;width:36px;height:36px;font-size:17px}#ag-wb .wb-ro-item{padding:14px 0;border-top:1px solid var(--faint)}#ag-wb .wb-ro-item h4{font:700 15px/1.3 \"DM Sans\",sans-serif}#ag-wb .wb-ro-item .wb-q{font-size:14px;margin:4px 0 10px}#ag-wb .wb-ro .wb-period{border:0;padding:0 0 16px;margin-top:6px}#ag-wb .wb-sessions{display:grid;gap:12px;margin-top:16px}#ag-wb .wb-session{display:flex;flex-direction:column;gap:6px;padding:18px;border-radius:20px;background:#fff;border:1.5px solid var(--line)}#ag-wb .wb-session.is-next{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,17,247,.08)}#ag-wb .wb-session.is-live,#ag-wb .wb-session.is-soon{border-color:transparent;background:linear-gradient(160deg,var(--deep) 0%,#0000d8 100%);color:#fff}#ag-wb .wb-session.is-live .wb-kicker,#ag-wb .wb-session.is-soon .wb-kicker,#ag-wb .wb-session.is-live .wb-session-when,#ag-wb .wb-session.is-soon .wb-session-when{color:#c9cbf5}#ag-wb .wb-session.is-live .wb-small,#ag-wb .wb-session.is-soon .wb-small{color:#c9cbf5}#ag-wb .wb-session.is-ended{background:var(--card)}#ag-wb .wb-session-top{display:flex;justify-content:space-between;align-items:center;gap:8px;min-height:24px}#ag-wb .wb-session-title{display:block;font:400 22px/1.2 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-session-when{font-size:15px;color:var(--muted)}#ag-wb .wb-session-when small{font-size:12px;font-weight:700;letter-spacing:.04em;white-space:nowrap}#ag-wb .wb-session-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:auto;padding-top:10px}#ag-wb .wb-session-actions .wb-small{margin:0}#ag-wb .wb-chip--live{background:#ff3b30;color:#fff}#ag-wb .wb-chip--live i{width:7px;height:7px;border-radius:50%;background:#fff;animation:agwbPulse 1s ease infinite}#ag-wb .wb-h4{font:700 16px/1.3 \"DM Sans\",sans-serif;color:var(--ink)}#ag-wb .wb-h4 .wb-muted{font-weight:400;font-size:14px}#ag-wb .wb-sessnew{display:grid;gap:12px;margin-top:6px}#ag-wb .wb-sessnew .wb-small{margin-top:0}#ag-wb .wb-fieldset{display:grid;gap:12px;margin:0;padding:14px 14px 16px;border:1px solid var(--line);border-radius:16px;background:var(--card);min-width:0}#ag-wb .wb-fieldset legend{padding:0 6px;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}#ag-wb .wb-grid4{display:grid;grid-template-columns:1fr 1fr;gap:12px}#ag-wb .wb-grid4>label:first-child,#ag-wb .wb-grid4>label:nth-child(2){grid-column:span 2}#ag-wb .wb-warn{display:inline-block;font:700 12px/1.2 \"DM Sans\",sans-serif;color:#8a4b00;background:#fff1d6;border-radius:999px;padding:4px 9px}#ag-wb .wb-cohort-next{display:flex;flex-wrap:wrap;align-items:center;gap:6px;font-size:14px;color:var(--ink)}#ag-wb .wb-sessadmin{margin-bottom:16px}#ag-wb .wb-sessadmin>.wb-row{align-items:center;margin-bottom:4px}#ag-wb .wb-small0{font-size:13px}#ag-wb .wb-sessrow{display:grid;gap:10px;padding:14px 0;border-top:1px solid var(--faint)}#ag-wb .wb-sessadmin>.wb-row+.wb-sessrow{border-top:0}#ag-wb .wb-sessrow-main{display:grid;gap:2px;min-width:0}#ag-wb .wb-sessrow-main strong{font-size:16px}#ag-wb .wb-sessrow-main .wb-muted{font-size:14px}#ag-wb .wb-sessrow>.wb-btn{justify-self:start}#ag-wb .wb-sesslinks{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;font-size:14px}#ag-wb .wb-sesslinks a{display:inline-flex;align-items:center;gap:5px;font-weight:700;text-decoration:none}#ag-wb .wb-sesslinks svg{width:16px;height:16px}#ag-wb .wb-sessform{padding:14px;border-radius:16px;background:var(--card);border:1px solid var(--line)}#ag-wb [data-sess-slot]:empty{display:none}#ag-wb .wb-clock{display:grid;gap:18px;margin-bottom:16px;padding:22px;border-radius:24px;background:var(--ink);color:#fff;position:relative;overflow:hidden}#ag-wb .wb-clock::after{content:\"\";position:absolute;left:-60px;bottom:-80px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(26,17,247,.45),transparent 70%);pointer-events:none}#ag-wb .wb-clock>div{position:relative;z-index:1}#ag-wb .wb-clock .wb-kicker{color:#8a90a2}#ag-wb .wb-clock-main{display:grid;gap:8px;align-content:start}#ag-wb .wb-clock-side{display:grid;gap:10px;align-content:start;padding:18px;border-radius:18px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1)}#ag-wb .wb-clock-side .wb-pill{justify-self:start}#ag-wb .wb-clock-side .wb-h3{color:#fff}#ag-wb .wb-clock-side p{font-size:14px;color:#c9cbf5}#ag-wb .wb-clock-side .wb-btn{justify-self:start}#ag-wb .wb-clock-side .wb-bar{margin-top:2px}#ag-wb .wb-clock-meta{font-size:13px;color:#c9cbf5}#ag-wb .wb-clock-title{font:400 26px/1.15 \"DM Serif Display\",Georgia,serif;color:#fff}#ag-wb .wb-clock-sub{font-size:14px;color:#c9cbf5}#ag-wb .wb-clock-main .wb-btn{justify-self:start;margin-top:6px}#ag-wb .wb-count{display:flex;flex-wrap:wrap;gap:8px}#ag-wb .wb-count>span{display:flex;align-items:baseline;gap:3px;padding:8px 12px;border-radius:14px;background:rgba(255,255,255,.08)}#ag-wb .wb-count b{font:400 42px/1 \"DM Serif Display\",Georgia,serif;color:var(--lime);font-variant-numeric:tabular-nums}#ag-wb .wb-count small{font-size:13px;color:#c9cbf5}#ag-wb .wb-count--inline{display:inline;font-weight:700;color:var(--lime)}#ag-wb .wb-today{list-style:none;padding:0;margin:0;display:grid;gap:8px}#ag-wb .wb-today li{display:flex;gap:9px;font-size:14px;line-height:1.45;color:#e9eaf2}#ag-wb .wb-today li svg{flex:0 0 20px;width:20px;height:20px;padding:3px;border-radius:6px;background:rgba(255,255,255,.12);color:transparent;stroke-width:3;margin-top:1px}#ag-wb .wb-today li.is-on svg{background:var(--lime);color:var(--ink)}#ag-wb .wb-today li.is-on span{color:#8a90a2;text-decoration:line-through}#ag-wb .wb-today b{color:#fff}#ag-wb .wb-clock-contest{display:flex;gap:10px;align-items:flex-start;margin-top:4px;padding-top:12px;border-top:1px solid rgba(255,255,255,.12);font-size:14px;color:#e9eaf2}#ag-wb .wb-clock-contest svg{flex:0 0 22px;width:22px;height:22px;color:var(--lime)}#ag-wb .wb-clock-contest small{display:block;font-size:12px;color:#8a90a2;margin-top:3px}#ag-wb .wb-three{display:grid;gap:12px}#ag-wb .wb-card--guide{border-color:var(--blue)}#ag-wb .wb-tabs2{display:flex;gap:4px;padding:4px;margin:4px 0 8px;border-radius:16px;background:#e6e6ea;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none}#ag-wb .wb-tabs2::-webkit-scrollbar{display:none}#ag-wb .wb-tab{flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 14px;border-radius:12px;text-decoration:none;color:var(--muted);font:700 14px/1.1 \"DM Sans\",sans-serif;white-space:nowrap}#ag-wb .wb-tab:hover{color:var(--ink)}#ag-wb .wb-tab small{font-size:11px;font-weight:700;padding:3px 7px;border-radius:99px;background:rgba(0,9,25,.08)}#ag-wb .wb-tab.is-on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(0,9,25,.12)}#ag-wb .wb-tab.is-on small{background:var(--lime)}#ag-wb .wb-sec--first{margin-top:22px}#ag-wb .wb-bpcallout{display:flex;gap:12px;margin:16px 0 4px;padding:16px;border-radius:16px;background:#ecebff;border:1px solid #c9c6ff}#ag-wb .wb-bpcallout svg{flex:0 0 24px;width:24px;height:24px;color:var(--blue);margin-top:1px}#ag-wb .wb-bpcallout strong{display:block;font-size:15px}#ag-wb .wb-bpcallout p{font-size:14px;color:#2b2f3a;margin-top:3px}#ag-wb .wb-kitcta{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:28px;padding:18px;border-radius:18px;background:var(--ink);color:#fff;text-decoration:none}#ag-wb .wb-kitcta>span{display:grid;gap:3px}#ag-wb .wb-kitcta .wb-kicker{color:var(--lime)}#ag-wb .wb-kitcta strong{font-size:17px}#ag-wb .wb-kitcta .wb-muted{color:#c9cbf5;font-size:14px}#ag-wb .wb-kitcta>svg{width:26px;height:26px;color:var(--lime);flex:0 0 26px}#ag-wb .wb-kitcta:hover{color:#fff;background:#0b1430}#ag-wb .wb-kitcta+.wb-done{margin-top:12px}#ag-wb .wb-prepref{margin-top:12px;padding:12px 14px;border-radius:14px;background:#f6fdee;border:1px dashed var(--lime-line);font-size:14px}#ag-wb .wb-prepref-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}#ag-wb .wb-prepref-head span{font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1d7a3a}#ag-wb .wb-prepref-head a{font-size:13px;font-weight:700}#ag-wb .wb-prepref p{white-space:pre-line;margin-top:3px}#ag-wb .wb-section.is-flash{animation:agwbFlash 1.8s ease}@keyframes agwbFlash{0%,40%{box-shadow:0 0 0 4px var(--lime)}100%{box-shadow:0 0 0 0 transparent}}#ag-wb .wb-kit{margin-top:22px}#ag-wb .wb-kit-head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px}#ag-wb .wb-kit .wb-lead{font-size:16px}#ag-wb .wb-case{margin-top:14px;padding:16px;border-radius:16px;background:#fff;border-left:4px solid var(--blue)}#ag-wb .wb-case span{display:block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:6px}#ag-wb .wb-kit-howto{display:grid;gap:8px;margin-top:14px}#ag-wb .wb-kit-howto>div{display:flex;gap:10px;align-items:flex-start;padding:12px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:14px}#ag-wb .wb-kit-howto b{flex:0 0 26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:var(--lime);font-size:13px}#ag-wb .wb-kit-sec{margin-top:26px}#ag-wb .wb-kit-sec>.wb-h3{display:flex;align-items:center;gap:10px;margin-bottom:12px}#ag-wb .wb-kit-sec>.wb-h3 .wb-num{margin:0}#ag-wb .wb-compare{display:grid;gap:10px}#ag-wb .wb-compare>div{padding:14px 16px;border-radius:14px;font-size:15px}#ag-wb .wb-compare span{display:block;font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:6px}#ag-wb .wb-compare-l{background:#fff;border:1.5px dashed var(--line);color:var(--muted)}#ag-wb .wb-compare-r{background:#fff;border:1.5px solid var(--lime-line)}#ag-wb .wb-compare-r span{color:#1d7a3a}#ag-wb .wb-changes{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:baseline;margin-top:10px;font-size:14px}#ag-wb .wb-changes b{font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue)}#ag-wb .wb-changes ol{display:contents;counter-reset:ch}#ag-wb .wb-changes li{list-style:none;counter-increment:ch}#ag-wb .wb-changes li::before{content:counter(ch);display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;margin-right:5px;border-radius:50%;background:var(--blue);color:#fff;font:700 11px/1 \"DM Sans\",sans-serif}#ag-wb .wb-table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:14px;border:1px solid var(--line);background:#fff}#ag-wb .wb-table{width:100%;border-collapse:collapse;font-size:14px}#ag-wb .wb-table.is-wide{min-width:540px}#ag-wb .wb-table th,#ag-wb .wb-table td{padding:10px 12px;text-align:left;vertical-align:top;border-top:1px solid var(--faint)}#ag-wb .wb-table thead th{border-top:0;background:var(--bg);font:700 12px/1.3 \"DM Sans\",sans-serif;color:var(--muted)}#ag-wb .wb-table tbody th{font-weight:700}#ag-wb .wb-table.has-total tbody tr:last-child{background:#f6fdee;font-weight:700}#ag-wb .wb-note2{margin-top:8px;font-size:13px;color:var(--muted)}#ag-wb .wb-flow{display:flex;flex-wrap:wrap;align-items:center;gap:6px}#ag-wb .wb-flow-step{padding:9px 12px;border-radius:12px;background:#fff;border:1px solid var(--line);font-size:14px;font-weight:700}#ag-wb .wb-flow-step:first-child{background:var(--ink);border-color:var(--ink);color:#fff}#ag-wb .wb-flow i{font-style:normal;color:var(--blue);font-weight:700}#ag-wb .wb-template ul{list-style:none;padding:0;margin:0 0 12px;display:grid;gap:6px}#ag-wb .wb-template li{padding:10px 12px;border-radius:12px;background:#fff;border:1px dashed var(--line);font-size:14px}#ag-wb .wb-template li::after{content:\" ______\";color:#b4b8c2}#ag-wb .wb-rubric>.wb-row{align-items:center}#ag-wb .wb-rubcount{font:400 26px/1 \"DM Serif Display\",Georgia,serif;color:var(--blue)}#ag-wb .wb-checkrow{display:flex;align-items:flex-start;gap:12px;width:100%;margin-top:8px;padding:13px 14px;border-radius:14px;border:1.5px solid var(--line);background:#fff;color:var(--ink);font:500 15px/1.45 \"DM Sans\",sans-serif;text-align:left;cursor:pointer;transition:border-color .15s,background .15s}#ag-wb .wb-checkrow:hover{border-color:var(--blue)}#ag-wb .wb-checkrow .wb-check{flex:0 0 26px;width:26px;height:26px}#ag-wb .wb-checkrow.is-on{background:#f6fdee;border-color:var(--lime-line)}#ag-wb .wb-checkrow.is-on .wb-check{background:var(--lime);border-color:var(--lime-line);color:var(--ink)}#ag-wb .wb-checkrow.wb-done{margin-top:16px;font-weight:700;border-style:dashed;border-color:var(--blue)}#ag-wb .wb-checkrow.wb-done.is-on{border-style:solid;border-color:var(--lime-line);background:var(--lime-soft)}#ag-wb .wb-checkrow:focus-visible{outline:3px solid var(--blue);outline-offset:2px}#ag-wb .wb-errors{display:grid;gap:8px}#ag-wb .wb-error{display:flex;gap:10px;padding:13px 14px;border-radius:14px;background:#fff;border:1px solid #f0c4c3;font-size:14px}#ag-wb .wb-error svg{flex:0 0 20px;width:20px;height:20px;color:var(--red);margin-top:1px}#ag-wb .wb-kprompt{display:grid;gap:10px;justify-items:start;padding:12px 0;border-top:1px solid rgba(255,255,255,.12)}#ag-wb .wb-kprompt:first-of-type{border-top:0;padding-top:0}#ag-wb .wb-kprompt p{font-size:14px;line-height:1.55}#ag-wb .wb-variant{padding:16px;border-radius:16px;background:#ecebff}#ag-wb .wb-variant span{display:block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:6px}#ag-wb .wb-variant p{font-size:14px}#ag-wb .wb-tool-card{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;margin-top:14px;padding:18px;border-radius:18px;background:#fff;border:2px solid var(--blue);box-shadow:0 6px 18px rgba(26,17,247,.08)}#ag-wb .wb-tool-head{display:flex;gap:12px;align-items:flex-start}#ag-wb .wb-tool-head svg{flex:0 0 36px;width:36px;height:36px;padding:7px;border-radius:10px;background:var(--blue);color:#fff}#ag-wb .wb-tool-head strong{display:block;font-size:16px}#ag-wb .wb-tool-head span{display:block;font-size:13px;color:var(--muted)}#ag-wb .wb-calc-inputs{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}#ag-wb .wb-input{min-width:0}#ag-wb .wb-tool-card .wb-btn,#ag-wb .wb-template .wb-btn{white-space:normal;text-align:left;line-height:1.3}#ag-wb .wb-field .wb-hint{color:var(--muted);font-weight:400}#ag-wb .wb-input--sm{height:44px;font-size:15px;padding:0 12px;border-radius:12px}#ag-wb select.wb-input--sm{padding-right:8px;background:#fff;-webkit-appearance:menulist;appearance:menulist}#ag-wb .wb-field em{font-style:normal;font-weight:500;color:#1d7a3a}#ag-wb .wb-tool-rows{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}#ag-wb .wb-tool-rows>div{padding:10px 12px;border-radius:12px;background:var(--bg)}#ag-wb .wb-tool-rows span{display:block;font-size:12px;color:var(--muted)}#ag-wb .wb-tool-rows b{font:400 22px/1.2 \"DM Serif Display\",Georgia,serif;color:var(--blue)}#ag-wb .wb-tool-card>.wb-btn{justify-self:start}#ag-wb .wb-score{display:grid;gap:8px}#ag-wb .wb-score-row{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:center;font-size:14px}#ag-wb .wb-score-total{font-weight:700}#ag-wb .wb-score-total b{font:400 24px/1 \"DM Serif Display\",Georgia,serif;color:var(--blue);text-align:center}#ag-wb .wb-sliders{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}#ag-wb .wb-slider{display:grid;grid-template-columns:minmax(0,1fr) 34px;min-width:0;gap:4px 10px;align-items:center;padding:10px 12px;border-radius:12px;background:var(--bg);font-size:14px}#ag-wb .wb-slider span{grid-column:1 / -1;font-weight:700}#ag-wb .wb-slider input{width:100%;accent-color:var(--blue);margin:0}#ag-wb .wb-slider b{font:400 22px/1 \"DM Serif Display\",Georgia,serif;color:var(--blue);text-align:right}#ag-wb .wb-slider.is-low{background:#fff1d6;outline:2px solid #f5c26b}#ag-wb .wb-slider.is-low input{accent-color:#c77700}#ag-wb .wb-slider.is-low b{color:#8a4b00}#ag-wb .wb-mats{display:grid;gap:10px;margin-top:14px}#ag-wb .wb-mat{display:grid;grid-template-columns:42px 1fr;gap:6px 12px;padding:14px;border-radius:16px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-mat-icon svg{width:42px;height:42px;padding:9px;border-radius:12px;background:#ecebff;color:var(--blue)}#ag-wb .wb-mat-body strong{display:block;font-size:15px}#ag-wb .wb-mat-body p{font-size:13px;color:var(--muted);margin-top:2px}#ag-wb .wb-mat-type{display:inline-block;margin-top:6px;font:700 10px/1 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}#ag-wb .wb-mat-actions{grid-column:2;display:flex;flex-wrap:wrap;gap:8px}#ag-wb .wb-stack-list{display:grid;gap:6px;padding-bottom:14px}#ag-wb .wb-stack-tool{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 12px;border-radius:12px;background:var(--bg);text-decoration:none;color:var(--ink)}#ag-wb .wb-stack-tool:hover{background:#ecebff;color:var(--ink)}#ag-wb .wb-stack-tool span{grid-column:1;font-size:13px;color:var(--muted)}#ag-wb .wb-stack-tool em{grid-row:1 / span 2;grid-column:2;align-self:center;font:700 11px/1 \"DM Sans\",sans-serif;font-style:normal;padding:5px 9px;border-radius:99px;background:var(--ink);color:#fff}#ag-wb .wb-stack-tool em.is-min{background:var(--lime);color:var(--ink)}#ag-wb .wb-gchoice{margin-bottom:18px}#ag-wb .wb-gopts{display:grid;gap:10px;margin-top:10px}#ag-wb .wb-gopt{display:flex;align-items:center;gap:14px;width:100%;padding:16px 18px;border-radius:18px;border:1.5px solid var(--line);background:#fff;color:var(--ink);text-decoration:none;text-align:left;cursor:pointer;font-family:inherit;transition:border-color .15s,box-shadow .15s}#ag-wb .wb-gopt:hover{border-color:var(--blue);color:var(--ink);box-shadow:0 6px 18px rgba(26,17,247,.1)}#ag-wb .wb-gopt svg{flex:0 0 44px;width:44px;height:44px;padding:10px;border-radius:12px;background:var(--blue);color:#fff}#ag-wb .wb-gopt:nth-child(2) svg{background:var(--ink);color:var(--lime)}#ag-wb .wb-gopt:nth-child(3) svg{background:var(--lime);color:var(--ink)}#ag-wb .wb-gopt span{display:grid;gap:2px}#ag-wb .wb-gopt strong{font-size:16px}#ag-wb .wb-gopt small{font-size:13px;color:var(--muted)}#ag-wb .wb-gopt:focus-visible{outline:3px solid var(--blue);outline-offset:2px}#ag-wb .wb-video{display:grid;gap:12px;margin-bottom:18px}#ag-wb .wb-video-frame{position:relative;padding-top:56.25%;border-radius:18px;overflow:hidden;background:var(--ink)}#ag-wb .wb-video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}#ag-wb .wb-chapters{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}#ag-wb .wb-chapter{display:inline-flex;gap:6px;align-items:center;padding:7px 11px;border-radius:99px;border:1px solid var(--line);background:#fff;font:500 13px/1.2 \"DM Sans\",sans-serif;color:var(--ink);cursor:pointer}#ag-wb .wb-chapter b{color:var(--blue);font-variant-numeric:tabular-nums}#ag-wb .wb-chapter:hover{border-color:var(--blue)}#ag-wb .wb-prepcta{display:flex;align-items:center;gap:16px;padding:18px;border-radius:20px;background:#fff;border:2px solid var(--blue);text-decoration:none;color:var(--ink)}#ag-wb .wb-prepcta>span{flex:1;display:grid;gap:4px}#ag-wb .wb-prepcta .wb-kicker{color:var(--blue)}#ag-wb .wb-prepcta .wb-muted{font-size:14px}#ag-wb .wb-prepcta-n{font:400 40px/1 \"DM Serif Display\",Georgia,serif;color:var(--blue)}#ag-wb .wb-prepcta-n small{font-size:.45em;color:var(--muted)}#ag-wb .wb-prepcta:hover{color:var(--ink);box-shadow:0 6px 18px rgba(26,17,247,.12)}#ag-wb .wb-gchs{display:grid;gap:8px;margin-top:14px}#ag-wb .wb-gch{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:16px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink)}#ag-wb .wb-gch:hover{border-color:var(--blue);color:var(--ink)}#ag-wb .wb-gch.is-read{background:var(--card)}#ag-wb .wb-gch.is-prep{border-color:var(--blue)}#ag-wb .wb-gch-n{flex:0 0 34px;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--ink);color:var(--lime);font:400 18px/1 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-gch.is-read .wb-gch-n{background:var(--lime);color:var(--ink)}#ag-wb .wb-gch-body{flex:1;display:grid;gap:3px;justify-items:start}#ag-wb .wb-gch-body small{font-size:12px;color:var(--muted);font-weight:700;letter-spacing:.06em;text-transform:uppercase}#ag-wb .wb-gch-body strong{font-size:16px;line-height:1.3}#ag-wb .wb-gch>svg{color:var(--blue)}#ag-wb .wb-gchapter{max-width:720px}#ag-wb .wb-gp{font-size:17px;line-height:1.65;margin-top:16px;color:#1d2130}#ag-wb .wb-gh3{margin-top:28px}#ag-wb .wb-gcallout{margin-top:18px;padding:16px 18px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line);font:400 20px/1.35 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-quote{margin:22px 0 0;padding:22px;border-radius:18px;background:var(--ink);color:#fff}#ag-wb .wb-quote p{font:400 24px/1.3 \"DM Serif Display\",Georgia,serif;color:var(--lime)}#ag-wb .wb-quote cite{display:block;margin-top:10px;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;font-style:normal;color:#8a90a2}#ag-wb .wb-gchecks{margin-top:20px;padding:18px;border-radius:18px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-gchecks ul,#ag-wb .wb-symptoms{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:8px}#ag-wb .wb-gchecks li,#ag-wb .wb-symptoms li{display:flex;gap:10px;font-size:15px}#ag-wb .wb-gchecks li svg{flex:0 0 22px;width:22px;height:22px;padding:4px;border-radius:7px;background:var(--lime);stroke-width:3}#ag-wb .wb-symptoms{margin-top:14px}#ag-wb .wb-symptoms li{padding:12px 14px;border-radius:14px;background:#fff;border:1px solid #f0c4c3}#ag-wb .wb-symptoms li svg{flex:0 0 20px;width:20px;height:20px;color:var(--red)}#ag-wb .wb-glist{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:8px}#ag-wb .wb-glist li{display:grid;gap:6px;justify-items:start;padding:14px 16px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:15px}#ag-wb .wb-gnum{list-style:none;padding:0;margin:14px 0 0;display:grid;gap:8px}#ag-wb .wb-gnum li{display:flex;gap:12px;padding:14px 16px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:15px}#ag-wb .wb-gnum b{flex:0 0 28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font-size:14px}#ag-wb .wb-chain,#ag-wb .wb-concepts{display:grid;gap:8px;margin-top:16px}#ag-wb .wb-chain-item,#ag-wb .wb-concept{border-radius:16px;background:#fff;border:1px solid var(--line);padding:0 16px}#ag-wb .wb-chain-item>summary,#ag-wb .wb-concept>summary{display:flex;align-items:center;gap:12px;padding:14px 0;cursor:pointer;list-style:none}#ag-wb .wb-chain-item>summary::-webkit-details-marker,#ag-wb .wb-concept>summary::-webkit-details-marker{display:none}#ag-wb .wb-chain-item>summary::after,#ag-wb .wb-concept>summary::after{content:\"+\";margin-left:auto;font:400 22px/1 \"DM Sans\",sans-serif;color:var(--blue)}#ag-wb .wb-chain-item[open]>summary::after,#ag-wb .wb-concept[open]>summary::after{content:\"–\"}#ag-wb .wb-chain-item summary strong{display:block}#ag-wb .wb-chain-item summary small{display:block;font-size:14px;color:var(--muted)}#ag-wb .wb-chain-item .wb-bpnum,#ag-wb .wb-concept .wb-bpnum{flex:0 0 36px;width:36px;height:36px;font-size:18px}#ag-wb .wb-chain-body{display:grid;gap:8px;padding:0 0 16px 48px;font-size:14px}#ag-wb .wb-chain-skip{color:#8a2420}#ag-wb .wb-chain-body a{display:inline-flex;align-items:center;gap:4px;font-weight:700;text-decoration:none}#ag-wb .wb-chain-body a svg{width:16px;height:16px}#ag-wb .wb-concept summary small{font-size:13px;color:var(--muted)}#ag-wb .wb-cterm{padding:12px 0;border-top:1px solid var(--faint);font-size:14px}#ag-wb .wb-cterm strong{font-size:15px}#ag-wb .wb-why{margin-top:4px;color:#1d7a3a}#ag-wb .wb-week{display:grid;gap:8px;margin-top:16px}#ag-wb .wb-day{padding:12px 14px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:13px}#ag-wb .wb-day.is-live{border-color:var(--blue)}#ag-wb .wb-day-name{display:block;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}#ag-wb .wb-day p{margin-top:6px}#ag-wb .wb-day p b{display:block;font-size:12px;color:var(--muted)}#ag-wb .wb-day p.is-live{padding:8px 10px;border-radius:10px;background:var(--ink);color:#fff}#ag-wb .wb-day p.is-live b{color:var(--lime)}#ag-wb .wb-prepbar{display:flex;align-items:center;gap:12px;margin-top:20px;padding:14px 16px;border-radius:16px;background:var(--ink);color:#fff;font-weight:700}#ag-wb .wb-prepbar .wb-bar{flex:1;margin:0;background:rgba(255,255,255,.18)}#ag-wb .wb-prepbar .wb-bar i{background:var(--lime)}#ag-wb .wb-prepbar b{color:var(--lime)}#ag-wb .wb-prepgroup{display:grid;gap:12px;margin-top:22px;padding:18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-prepgroup .wb-checkrow{margin-top:0}#ag-wb .wb-prepfield>span{font-size:15px}#ag-wb .wb-hint{display:block;font-style:normal;font-size:13px;color:var(--muted);margin-top:-3px}#ag-wb .wb-ta--sm{min-height:60px;font-size:15px}#ag-wb .wb-attitude{display:flex;gap:12px;font-size:15px}#ag-wb .wb-attitude b{flex:0 0 28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--lime)}#ag-wb .wb-small--top{margin-top:0}#ag-wb .wb-ro-check{font-size:14px;padding:4px 0}#ag-wb .wb-ro-prep .wb-prepgroup{margin:0 0 12px;padding:0;border:0}#ag-wb .wb-prepline{margin-top:6px}#ag-wb .wb-fab-slot:empty{display:none}#ag-wb .wb-fab{position:fixed;right:16px;bottom:16px;z-index:2147482400;display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 20px 0 16px;border:0;border-radius:999px;background:var(--blue);color:#fff;font:700 15px/1 \"DM Sans\",sans-serif;cursor:pointer;box-shadow:0 10px 30px rgba(26,17,247,.35);transition:transform .15s,background .15s}#ag-wb .wb-fab:hover{background:var(--blue-h);transform:translateY(-1px)}#ag-wb .wb-fab svg{width:20px;height:20px;stroke:var(--lime)}#ag-wb .wb-fab--locked{background:var(--ink);box-shadow:0 10px 30px rgba(0,9,25,.25)}#ag-wb .wb-fab--locked svg{stroke:#9aa0b4}#ag-wb .wb-fab:focus-visible{outline:3px solid var(--lime);outline-offset:3px}#ag-wb .wb-pill svg{width:13px;height:13px;vertical-align:-2px;margin-right:5px}#ag-wb .wb-drawer-btns{display:flex;gap:4px}#ag-wb .wb-cop{width:min(520px,100vw)}#ag-wb .wb-cop-body{flex:1;min-height:0;display:flex;flex-direction:column;padding:0 16px 12px}#ag-wb .wb-cop-status{font-size:13px;color:var(--muted);padding:0 4px 10px;margin:0}#ag-wb .wb-cop-status b{color:var(--ink)}#ag-wb .wb-cop-status.is-warn{color:#8a4b00;background:#fff1d6;border-radius:12px;padding:10px 12px;margin-bottom:10px}#ag-wb .wb-cop-msgs{flex:1;min-height:0;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:4px 4px 12px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}#ag-wb .wb-msg{max-width:92%;font-size:15px;line-height:1.55}#ag-wb .wb-msg--u{align-self:flex-end;background:var(--blue);color:#fff;padding:10px 14px;border-radius:18px 18px 4px 18px}#ag-wb .wb-msg--a{align-self:flex-start;background:#fff;border:1px solid var(--line);padding:12px 14px;border-radius:18px 18px 18px 4px;width:92%}#ag-wb .wb-msg--err{align-self:stretch;display:flex;gap:8px;align-items:flex-start;background:#fff5f5;color:var(--red);border-radius:14px;padding:10px 12px;font-size:14px;max-width:none}#ag-wb .wb-md p,#ag-wb .wb-md ul,#ag-wb .wb-md ol{margin:0 0 8px}#ag-wb .wb-md>*:last-child{margin-bottom:0}#ag-wb .wb-md ul,#ag-wb .wb-md ol{padding-left:20px}#ag-wb .wb-md li{margin:3px 0}#ag-wb .wb-md h4{font:700 15px/1.3 \"DM Sans\",sans-serif;margin:12px 0 6px}#ag-wb .wb-md h4:first-child{margin-top:0}#ag-wb .wb-md code{font:600 13px/1.3 ui-monospace,Menlo,monospace;letter-spacing:0;background:var(--bg);padding:1px 5px;border-radius:6px}#ag-wb .wb-md hr{border:0;border-top:1px solid var(--line);margin:10px 0}#ag-wb .wb-msg--typing{display:flex;align-items:center;gap:10px;color:var(--muted);width:auto}#ag-wb .wb-msg--typing small{font-size:13px}#ag-wb .wb-dots{display:inline-flex;gap:4px}#ag-wb .wb-dots i{width:7px;height:7px;border-radius:50%;background:var(--blue);animation:agwbDot 1.2s infinite ease-in-out}#ag-wb .wb-dots i:nth-child(2){animation-delay:.15s}#ag-wb .wb-dots i:nth-child(3){animation-delay:.3s}@keyframes agwbDot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}#ag-wb .wb-prop{margin-top:12px;padding:12px;border-radius:14px;background:var(--lime-soft);border:1px solid var(--lime-line)}#ag-wb .wb-prop-head{display:grid;gap:2px;margin-bottom:8px}#ag-wb .wb-prop-head strong{font-size:14px}#ag-wb .wb-prop-text{white-space:pre-wrap;font-size:14.5px;line-height:1.5;background:#fff;border-radius:10px;padding:10px 12px;overflow-wrap:anywhere}#ag-wb .wb-prop-actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px;font-size:14px}#ag-wb .wb-prop-actions .wb-ok{display:inline-flex;align-items:center;gap:5px}#ag-wb .wb-prop-actions .wb-ok svg{width:16px;height:16px}#ag-wb .wb-prop--doubt{background:#efeeff;border-color:#d3d0ff}#ag-wb .wb-prop--doubt .wb-ta{min-height:60px;font-size:14.5px}#ag-wb .wb-prop--doubt .wb-ok{display:flex;gap:6px;align-items:flex-start;font-size:14px;margin:0}#ag-wb .wb-cop-chips{display:flex;flex-wrap:wrap;gap:6px;padding:4px 0 8px}#ag-wb .wb-cop-chips:empty{display:none}#ag-wb .wb-cop-form{display:flex;align-items:flex-end;gap:8px;padding:8px;border-radius:18px;background:#fff;border:1.5px solid var(--line)}#ag-wb .wb-cop-form:focus-within{border-color:var(--blue);box-shadow:0 0 0 4px rgba(26,17,247,.12)}#ag-wb .wb-cop-input{flex:1;min-width:0;border:0;outline:none;resize:none;background:transparent;font:400 16px/1.45 \"DM Sans\",sans-serif;color:var(--ink);padding:8px 6px;max-height:160px;min-height:40px;margin:0}#ag-wb .wb-cop-input:disabled{background:transparent;color:var(--muted)}#ag-wb .wb-cop-send{flex:0 0 42px;width:42px;height:42px;border:0;border-radius:50%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}#ag-wb .wb-cop-send:disabled{background:var(--faint);color:var(--muted);cursor:default}#ag-wb .wb-cop-send svg{width:19px;height:19px}#ag-wb .wb-cop-note{font-size:12px;color:var(--muted);margin:8px 4px 0;line-height:1.4}#ag-wb .wb-cop-locked{display:grid;gap:10px;padding:10px 6px;justify-items:start}#ag-wb .wb-cop-locked>svg{width:34px;height:34px;color:var(--muted)}#ag-wb .wb-cop-locked p{color:var(--muted)}#ag-wb .wb-cop-locked ul{display:grid;gap:6px;font-size:14px;color:var(--muted)}#ag-wb .wb-chipbtn{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:6px 12px;border-radius:999px;border:1.5px solid #c9c6ff;background:#fff;color:var(--blue);font:700 13px/1.2 \"DM Sans\",sans-serif;cursor:pointer;text-align:left}#ag-wb .wb-chipbtn:hover{border-color:var(--blue);background:#f6f5ff}#ag-wb .wb-chipbtn svg{width:15px;height:15px}#ag-wb .wb-chipbtn--ghost{border-color:var(--line);color:var(--ink)}#ag-wb .wb-chipbtn--ghost:hover{border-color:var(--ink);background:#fff}#ag-wb .wb-chipbtn.is-on{background:var(--ink);border-color:var(--ink);color:#fff}#ag-wb .wb-chipbtn:focus-visible,#ag-wb .wb-linkbtn:focus-visible{outline:3px solid var(--blue);outline-offset:2px}#ag-wb .wb-secbar{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:10px}#ag-wb .wb-secbar--top{margin:18px 0 6px}#ag-wb .wb-secbar-label{display:inline-flex;align-items:center;gap:5px;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-right:2px}#ag-wb .wb-secbar-label svg{width:15px;height:15px}#ag-wb .wb-section:not(.has-answer) .is-filled-only,#ag-wb .wb-section.has-answer .is-empty-only{display:none}#ag-wb .wb-prompt-btns{display:inline-flex;flex-wrap:wrap;gap:6px;justify-content:flex-end}#ag-wb .wb-copy--cop{background:var(--blue);color:#fff}#ag-wb .wb-copy--cop:hover{background:var(--blue-h);color:#fff}#ag-wb .wb-copy--cop svg{stroke:var(--lime)}#ag-wb .wb-kprompt .wb-prompt-btns{margin-top:8px}#ag-wb .wb-copnudge{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;align-items:start;margin-top:12px;padding:14px;border-radius:16px;background:#efeeff;border:1px solid #d3d0ff}#ag-wb .wb-copnudge>svg{width:22px;height:22px;color:var(--blue);margin-top:2px}#ag-wb .wb-copnudge span{display:block;font-size:14px;color:var(--muted);margin-top:2px}#ag-wb .wb-copnudge .wb-actions{grid-column:2}#ag-wb .wb-linkbtn{border:0;background:none;padding:0;color:var(--blue);font:700 13px/1.2 \"DM Sans\",sans-serif;cursor:pointer;text-decoration:underline;text-underline-offset:3px}#ag-wb [data-doubt-slot]:empty{display:none}#ag-wb .wb-doubtform{display:grid;gap:10px;margin-top:12px;padding:14px;border-radius:16px;background:var(--bg)}#ag-wb .wb-doubt-ok{display:flex;gap:6px;align-items:flex-start;margin-top:10px;font-size:14px}#ag-wb .wb-doubts{display:grid;gap:10px;margin-top:14px}#ag-wb .wb-doubt,#ag-wb .wb-adoubt{display:grid;gap:8px;padding:14px 16px;border-radius:16px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-doubt-top{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;font-size:13px}#ag-wb .wb-doubt p,#ag-wb .wb-adoubt-text{font-size:15px;white-space:pre-wrap;overflow-wrap:anywhere}#ag-wb .wb-doubt-reply{padding:10px 12px;border-radius:12px;background:var(--lime-soft);font-size:14px}#ag-wb .wb-doubt-reply b{font-size:11px;letter-spacing:.1em;text-transform:uppercase}#ag-wb .wb-doubt-reply p{margin-top:4px;white-space:pre-wrap}#ag-wb .wb-doubt .wb-linkbtn{justify-self:start}#ag-wb .wb-doubt-group{font:700 12px/1.3 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin:22px 0 10px}#ag-wb .wb-adoubt{margin-bottom:10px}#ag-wb .wb-adoubt-text{font-size:16px;font-weight:500}#ag-wb .wb-adoubt-ans summary{cursor:pointer;font-size:13px;font-weight:700;color:var(--blue)}#ag-wb .wb-adoubt-ans p{margin-top:6px;font-size:14px;color:var(--muted);white-space:pre-wrap}#ag-wb [data-reply-slot]:empty{display:none}#ag-wb .wb-replyform{padding-top:10px;border-top:1px solid var(--line)}#ag-wb .wb-session-cal{display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;margin-top:10px;padding-top:10px;border-top:1px solid var(--faint);font-size:13px;color:var(--muted)}#ag-wb .wb-session-cal svg{width:15px;height:15px}#ag-wb .wb-session-cal a,#ag-wb .wb-session-cal button{border:0;background:none;padding:0;font:700 13px/1.2 \"DM Sans\",sans-serif;color:var(--blue);cursor:pointer;text-decoration:underline;text-underline-offset:3px}#ag-wb .wb-session.is-live .wb-session-cal,#ag-wb .wb-session.is-soon .wb-session-cal{border-color:rgba(255,255,255,.18);color:#c9cbf5}#ag-wb .wb-session.is-live .wb-session-cal a,#ag-wb .wb-session.is-live .wb-session-cal button,#ag-wb .wb-session.is-soon .wb-session-cal a,#ag-wb .wb-session.is-soon .wb-session-cal button{color:var(--lime)}#ag-wb .wb-btn--flat{margin-top:0}#ag-wb .wb-fus{display:grid;gap:14px;margin-top:22px}#ag-wb .wb-fu{display:grid;gap:14px}#ag-wb .wb-fu.is-open{border-color:var(--blue);box-shadow:0 0 0 3px rgba(26,17,247,.08)}#ag-wb .wb-fu-goal{padding:12px 14px;border-radius:14px;background:var(--bg);display:grid;gap:4px;font-size:14.5px}#ag-wb .wb-fu-status{display:flex;flex-wrap:wrap;gap:6px}#ag-wb .wb-fu .wb-checkrow{margin-top:0}#ag-wb .wb-fu .wb-ok{display:inline-flex;gap:6px;align-items:center;font-size:14px}#ag-wb .wb-fu-table th small{display:block;font-weight:400;color:var(--muted);font-size:12px}#ag-wb .wb-fu-table td{vertical-align:top}#ag-wb .wb-fu-table .wb-warn{display:inline-flex;align-items:center;gap:4px;margin-top:4px}#ag-wb .wb-fu-table .wb-warn svg{width:13px;height:13px}#ag-wb .wb-copset{margin-top:18px;display:grid;gap:10px}#ag-wb .wb-copset .wb-bar{margin-top:0}#ag-wb .wb-copset-main{display:grid;gap:2px}#ag-wb .wb-copset-main .wb-kicker svg,#ag-wb .wb-auto-row strong svg,#ag-wb .wb-label svg{width:13px;height:13px;vertical-align:-2px;margin-right:4px}#ag-wb .wb-copset-main strong{font-size:18px}#ag-wb .wb-copset-form{padding-top:12px;border-top:1px solid var(--line)}#ag-wb .wb-bar--warn i{background:#e08a00}#ag-wb .wb-warnline{display:flex;gap:8px;align-items:flex-start;font-size:14px;color:#8a4b00;background:#fff1d6;border-radius:12px;padding:10px 12px;margin:0}#ag-wb .wb-warnline svg{margin-top:1px}#ag-wb .wb-auto{display:grid;gap:12px;margin-top:18px}#ag-wb .wb-auto-row{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px 16px;padding-top:12px;border-top:1px solid var(--faint)}#ag-wb .wb-auto-row>div{display:grid;gap:2px;min-width:0;flex:1 1 260px}#ag-wb .wb-auto-row .wb-muted{font-size:14px}#ag-wb label.wb-auto-row{justify-content:flex-start;align-items:flex-start}#ag-wb label.wb-auto-row input{margin-top:3px}#ag-wb label.wb-auto-row>span{display:grid;gap:2px}#ag-wb .wb-select{width:auto;min-width:150px;padding-right:34px;background:#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%23000919' stroke-width='2'/%3E%3C/svg%3E\") no-repeat right 12px center}#ag-wb .wb-input--sm{height:40px;font-size:15px;padding:0 12px;border-radius:12px}#ag-wb .wb-linkline{display:inline-flex;align-items:center;gap:6px;font-weight:700;font-size:14px}#ag-wb .wb-cohort-extra{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:13px;color:var(--muted);margin-top:4px}#ag-wb .wb-cohort-extra span{display:inline-flex;align-items:center;gap:5px}#ag-wb .wb-cohort-extra svg{width:14px;height:14px}#ag-wb .wb-person-cop{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px}#ag-wb .wb-person-cop .wb-label{margin:0;display:inline-flex;align-items:center;color:var(--blue)}#ag-wb .wb-small0{font-size:13px}#ag-wb [data-copadj-slot]:empty{display:none}#ag-wb .wb-questions [data-questions-body]{padding:4px 0 6px}#ag-wb .wb-qlist{list-style:none;padding:0;margin:12px 0 0;display:grid;gap:8px}#ag-wb .wb-qlist li{padding:10px 12px;border-radius:12px;background:var(--bg)}#ag-wb .wb-qlist p{font-size:14px;margin-top:4px;white-space:pre-wrap;overflow-wrap:anywhere}#ag-wb .wb-fc-scope{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;padding:0 4px 10px}#ag-wb .wb-fc-scope .wb-field>span{font-size:12px;color:var(--muted)}#ag-wb .wb-fc-meta{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-top:10px;padding-top:8px;border-top:1px solid var(--faint);font-size:12px}#ag-wb .wb-fc .wb-msg--a{width:100%;max-width:100%}#ag-wb .wb-proj{position:fixed;inset:0;z-index:2147482600;display:grid;grid-template-rows:auto 1fr auto;gap:20px;padding:24px clamp(20px,5vw,72px) 28px;background:linear-gradient(160deg,var(--deep) 0%,#0000c8 100%);color:#fff;overflow-y:auto}#ag-wb .wb-proj-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;font:700 13px/1.2 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#c9cbf5}#ag-wb .wb-proj-top>span{display:inline-flex;align-items:center;gap:8px}#ag-wb .wb-checkline--light{color:#fff;text-transform:none;letter-spacing:0;font-weight:500}#ag-wb .wb-icon--light{color:#fff}#ag-wb .wb-icon--light:hover{background:rgba(255,255,255,.12)}#ag-wb .wb-proj-main{align-self:center;display:grid;gap:22px;max-width:1100px;width:100%;margin:0 auto}#ag-wb .wb-proj-kicker{display:inline-block;justify-self:start;background:var(--lime);color:var(--ink);font:700 14px/1 \"DM Sans\",sans-serif;letter-spacing:.06em;padding:9px 14px;border-radius:999px}#ag-wb .wb-proj-q{font:400 clamp(30px,4.4vw,58px)/1.15 \"DM Serif Display\",Georgia,serif;color:#fff;white-space:pre-wrap;overflow-wrap:anywhere}#ag-wb .wb-proj-who{font-size:20px;color:var(--lime);font-weight:700}#ag-wb .wb-proj-ans{padding:18px 22px;border-radius:18px;background:rgba(0,9,25,.35);display:grid;gap:8px}#ag-wb .wb-proj-ans span{font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#c9cbf5}#ag-wb .wb-proj-ans p{font-size:clamp(17px,1.6vw,22px);line-height:1.5;color:#fff;white-space:pre-wrap;overflow-wrap:anywhere;max-height:30vh;overflow-y:auto}#ag-wb .wb-proj-nav{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:12px}#ag-wb .wb-btn--onDark{background:rgba(255,255,255,.12);color:#fff}#ag-wb .wb-btn--onDark:hover{background:rgba(255,255,255,.22);color:#fff}#ag-wb .wb-btn--onDark:disabled{opacity:.35}#ag-wb .wb-proj-done{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:var(--lime)}#ag-wb .wb-tool{text-decoration:none;position:relative}#ag-wb .wb-tool--company.is-todo{box-shadow:inset 0 0 0 1.5px var(--blue);color:var(--blue)}#ag-wb .wb-tool--company.is-todo::after{content:\"\";position:absolute;top:4px;right:6px;width:8px;height:8px;border-radius:50%;background:#ff6b3d;box-shadow:0 0 0 2px #fff}#ag-wb .wb-cmpcard{display:grid;gap:16px;margin:0 0 16px;padding:22px;border-radius:24px;background:var(--ink);color:#fff;text-decoration:none;position:relative;overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(203,255,139,.3);transition:box-shadow .15s}#ag-wb .wb-cmpcard::before{content:\"\";position:absolute;right:-70px;top:-90px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(26,17,247,.6) 0%,rgba(26,17,247,0) 70%);pointer-events:none}#ag-wb .wb-cmpcard>*{position:relative}#ag-wb .wb-cmpcard:hover{color:#fff;box-shadow:inset 0 0 0 1.5px var(--lime),0 12px 28px rgba(0,9,25,.25)}#ag-wb .wb-cmpcard-main{display:grid;gap:8px;justify-items:start}#ag-wb .wb-cmpcard-main .wb-h3{color:#fff;font-size:20px}#ag-wb .wb-cmpcard-main>span:last-child{color:#c9cbf5;font-size:15px}#ag-wb .wb-cmpcard-side{display:grid;gap:6px;align-content:center}#ag-wb .wb-cmpcard-side b{font:400 44px/1 \"DM Serif Display\",Georgia,serif;color:var(--lime)}#ag-wb .wb-cmpcard-side b small{font-size:20px;color:#8a90a2}#ag-wb .wb-cmpcard-side .wb-muted{color:#8a90a2;font-size:14px}#ag-wb .wb-cmpcard-side .wb-bar{margin-top:2px;background:rgba(255,255,255,.16)}#ag-wb .wb-cmpcard-side .wb-bar i{background:var(--lime)}#ag-wb .wb-cmpcard-side .wb-btn{justify-self:start;margin-top:6px;background:var(--lime);color:var(--ink)}#ag-wb .wb-cmpcard:hover .wb-cmpcard-side .wb-btn{background:#b9f26d}#ag-wb .wb-cmpbar{display:grid;gap:8px;margin-top:22px;padding:16px 18px;border-radius:18px;background:var(--ink);color:#fff}#ag-wb .wb-cmpbar>div:first-child{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px}#ag-wb .wb-cmpbar b{font:400 30px/1 \"DM Serif Display\",Georgia,serif;color:var(--lime)}#ag-wb .wb-cmpbar span{font-size:14px;color:#c9cbf5}#ag-wb .wb-cmpbar .wb-bar{margin:0;background:rgba(255,255,255,.16)}#ag-wb .wb-cmpbar .wb-bar i{background:var(--lime)}#ag-wb .wb-cmpwhy{display:grid;gap:14px;margin-top:16px;padding:20px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-cmpwhy p{color:var(--muted);margin-top:6px}#ag-wb .wb-cmpvs{display:grid;gap:10px}#ag-wb .wb-cmpvs>div{padding:12px 14px;border-radius:14px;background:#fff5f5;border:1px solid #f3cfcf}#ag-wb .wb-cmpvs>div.wb-cmpvs-good{background:#f6fdee;border-color:var(--lime-line)}#ag-wb .wb-cmpvs span{display:block;font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;color:var(--red)}#ag-wb .wb-cmpvs .wb-cmpvs-good span{color:#1d7a3a}#ag-wb .wb-cmpvs p{margin-top:6px;font-size:15px}#ag-wb .wb-cmpgroup{display:grid;gap:14px;margin-top:16px;padding:20px 18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-cmpgroup .wb-h3{display:flex;align-items:center;gap:10px}#ag-wb .wb-cmpfield>span{font:700 15px/1.3 \"DM Sans\",sans-serif}#ag-wb .wb-shared{display:inline-block;font:700 11px/1 \"DM Sans\",sans-serif;font-style:normal;color:var(--blue);background:#efeeff;border-radius:999px;padding:4px 8px;margin-left:4px;vertical-align:2px}#ag-wb .wb-cmpcopy{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding:16px 18px;border-radius:18px;background:var(--lime-soft)}#ag-wb .wb-cmpcopy>div{display:grid;gap:2px}#ag-wb .wb-cmpcopy span{font-size:14px;color:var(--muted)}#ag-wb .wb-cmpro{display:grid;gap:10px;padding:4px 0 8px}#ag-wb .wb-cmpro span{display:block;font:700 12px/1.3 \"DM Sans\",sans-serif;color:var(--muted)}#ag-wb .wb-cmpro p{font-size:15px;white-space:pre-wrap;overflow-wrap:anywhere}#ag-wb .wb-copy--ctx{background:#fff;box-shadow:inset 0 0 0 1.5px var(--line)}#ag-wb .wb-copy--ctx:hover{background:#fff;box-shadow:inset 0 0 0 1.5px var(--blue);color:var(--blue)}#ag-wb .wb-cop-ctx{display:flex;gap:10px;align-items:flex-start;margin:0 0 10px;padding:12px 14px;border-radius:14px;background:#efeeff;border:1px solid #d3d0ff;color:var(--ink);text-decoration:none;font-size:14px;line-height:1.45}#ag-wb .wb-cop-ctx svg{color:var(--blue);margin-top:1px}#ag-wb .wb-cop-ctx:hover{border-color:var(--blue);color:var(--ink)}#ag-wb [data-cop-ctx]:empty{display:none}#ag-wb .wb-tourinvite{display:grid;grid-template-columns:auto 1fr;gap:6px 14px;align-items:start;margin-bottom:18px;padding:16px 18px;border-radius:18px;background:var(--ink);color:#fff}#ag-wb .wb-tourinvite>svg{width:26px;height:26px;color:var(--lime);margin-top:2px}#ag-wb .wb-tourinvite strong{display:block;font-size:16px}#ag-wb .wb-tourinvite span{display:block;font-size:14px;color:#c9cbf5;margin-top:2px}#ag-wb .wb-tourinvite .wb-actions{grid-column:2;margin-top:6px}#ag-wb .wb-tourinvite .wb-btn{background:var(--lime);color:var(--ink)}#ag-wb .wb-tourinvite .wb-linkbtn{color:#c9cbf5}#ag-wb .wb-tour{position:fixed;inset:0;z-index:2147482800}#ag-wb .wb-tour-shade{position:absolute;inset:0}#ag-wb .wb-tour.is-center .wb-tour-shade{background:rgba(0,9,25,.62)}#ag-wb .wb-tour-hole{position:fixed;display:none;border-radius:16px;box-shadow:0 0 0 3px var(--lime),0 0 0 9999px rgba(0,9,25,.62);pointer-events:none;transition:top .25s ease,left .25s ease,width .25s ease,height .25s ease}#ag-wb .wb-tour-card{position:fixed;display:grid;gap:10px;padding:18px 18px 16px;border-radius:20px;background:#fff;color:var(--ink);box-shadow:0 22px 60px rgba(0,9,25,.4);width:min(400px,calc(100vw - 32px))}#ag-wb .wb-tour.is-center .wb-tour-card{top:50%;left:50%;transform:translate(-50%,-50%);width:min(460px,calc(100vw - 32px))}#ag-wb .wb-tour-top{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:-6px -6px 0 0}#ag-wb .wb-tour-top .wb-kicker{color:var(--blue)}#ag-wb .wb-tour-title{font:400 23px/1.2 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-tour-card p{font-size:15px;line-height:1.55;color:#3a3f4b}#ag-wb .wb-tour-bar{height:4px;border-radius:99px;background:var(--faint);overflow:hidden}#ag-wb .wb-tour-bar i{display:block;height:100%;background:var(--blue)}#ag-wb .wb-tour-nav{display:flex;justify-content:space-between;align-items:center;gap:8px}@media (min-width:640px){#ag-wb{padding:36px 36px 48px}#ag-wb .wb-h1{font-size:48px}#ag-wb .wb-hero{padding:36px 34px 32px}#ag-wb .wb-hero .wb-h1{font-size:40px}#ag-wb .wb-steps{grid-template-columns:repeat(2,1fr)}#ag-wb .wb-bpgrid,#ag-wb .wb-two,#ag-wb .wb-vs,#ag-wb .wb-grid2,#ag-wb .wb-pager{grid-template-columns:repeat(2,1fr)}#ag-wb .wb-pager a.is-next{grid-column:2}#ag-wb .wb-section{padding:24px}#ag-wb .wb-statrow{grid-template-columns:repeat(3,1fr)}#ag-wb .wb-clock{grid-template-columns:1.05fr 1fr;padding:28px;gap:22px}#ag-wb .wb-three{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}#ag-wb .wb-kit-howto{grid-template-columns:repeat(3,1fr)}#ag-wb .wb-compare{grid-template-columns:1fr 1fr}#ag-wb .wb-calc-inputs{grid-template-columns:repeat(2,minmax(0,1fr))}#ag-wb .wb-sliders{grid-template-columns:repeat(2,minmax(0,1fr))}#ag-wb .wb-mat{grid-template-columns:42px 1fr auto;align-items:center}#ag-wb .wb-mat-actions{grid-column:3}#ag-wb .wb-week{grid-template-columns:repeat(5,1fr)}#ag-wb .wb-gopts{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}#ag-wb .wb-gopt{flex-direction:column;align-items:flex-start}#ag-wb .wb-count b{font-size:52px}#ag-wb .wb-cohorts{grid-template-columns:repeat(2,1fr)}#ag-wb .wb-sessions{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}#ag-wb .wb-grid4{grid-template-columns:2fr 1.3fr 1fr 1fr}#ag-wb .wb-grid4>label:first-child,#ag-wb .wb-grid4>label:nth-child(2){grid-column:auto}#ag-wb .wb-cmpcard{grid-template-columns:1fr 220px;align-items:center;padding:24px}#ag-wb .wb-cmpwhy{grid-template-columns:1fr 1.2fr;align-items:start}#ag-wb .wb-cmpgroup{padding:24px}}@media (min-width:900px){#ag-wb .wb-grid3{grid-template-columns:1.1fr 1.3fr 1fr}#ag-wb .wb-person{grid-template-columns:1.3fr auto 1.2fr;grid-template-areas:\"main pin prog\" \"meta meta meta\" \"cop cop cop\" \"act act act\" \"copadj copadj copadj\" \"edit edit edit\";align-items:center;column-gap:22px}#ag-wb .wb-person-cop{grid-area:cop}#ag-wb [data-copadj-slot]{grid-area:copadj}#ag-wb .wb-person-main{grid-area:main;min-width:0}#ag-wb .wb-person-pin{grid-area:pin}#ag-wb .wb-person-prog{grid-area:prog}#ag-wb .wb-person-meta{grid-area:meta}#ag-wb .wb-person-actions{grid-area:act}#ag-wb [data-edit-slot]{grid-area:edit}#ag-wb .wb-sessrow{grid-template-columns:1.3fr 1.2fr auto;align-items:center;column-gap:20px}#ag-wb .wb-sessrow>.wb-btn{justify-self:end}#ag-wb .wb-sessform-slot{grid-column:1 / -1}}@media (max-width:639px){#ag-wb .wb-toast{bottom:78px}#ag-wb .wb-fab{right:12px;bottom:12px;height:48px;padding:0 16px 0 13px}#ag-wb .wb-cop .wb-drawer-head{padding:14px 14px 8px}#ag-wb .wb-cop .wb-drawer-head .wb-h2{font-size:21px;margin-top:8px}#ag-wb .wb-cop-body{padding:0 10px 10px}#ag-wb .wb-msg{max-width:96%}#ag-wb .wb-msg--a{width:96%}#ag-wb .wb-proj{padding:16px 16px 20px}}@media (max-width:560px){#ag-wb .wb-tl{display:none}#ag-wb .wb-tools{gap:6px}#ag-wb .wb-tool{padding:0 11px}#ag-wb .wb-tour-card,#ag-wb .wb-tour.is-center .wb-tour-card{top:auto!important;left:10px!important;right:10px;bottom:10px;transform:none;width:auto!important;max-height:52vh;overflow-y:auto;padding:16px}#ag-wb .wb-tour-card.is-top{top:10px!important;bottom:auto}#ag-wb .wb-tour-title{font-size:20px}#ag-wb .wb-tour-card p{font-size:14.5px}}@media (max-width:480px){#ag-wb .wb-tab-long{display:none}#ag-wb .wb-tab{padding:10px 8px;gap:5px;font-size:13px}}@media (max-width:420px){#ag-wb{border-radius:18px;padding:22px 16px 32px}#ag-wb .wb-h1{font-size:34px}#ag-wb .wb-tool{padding:0 12px;font-size:13px}}@media print{#ag-wb .wb-save,#ag-wb .wb-toast,#ag-wb .wb-layer{display:none}}@media (prefers-reduced-motion:reduce){#ag-wb *,#ag-wb *::before,#ag-wb *::after{animation:none!important;transition:none!important}}";

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.AG_WB = { version: '1.8', mount: mount };
})();
