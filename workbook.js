/*! Agora Growth · Workbook del Sistema de Ingresos™ · v1.0
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
    assetsBase: 'https://cdn.jsdelivr.net/gh/Agora-Growth/agora-workbook@v1.0/',
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
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>'
  };

  /* ===================== ESTADO ===================== */
  const tokenKey = 'agwb:token:' + (ADMIN ? 'admin' : 'participant');
  const S = {
    token: store.get(tokenKey), me: null, answers: {}, pending: {}, saving: false, saveTimer: null, retry: 0, savedAt: null,
    admin: { me: null, cohorts: null, detail: {}, workbooks: {}, showPins: {}, addMode: 'one', lastAdd: null, filter: '' },
    msg: '', busy: false
  };
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
    root.innerHTML = '<div class="wb-view"></div><div class="wb-save" aria-live="polite"></div><div class="wb-toast" role="status" aria-live="polite"></div><div class="wb-layer"></div>';
    view = root.querySelector('.wb-view');
    saveEl = root.querySelector('.wb-save');
    toastEl = root.querySelector('.wb-toast');
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('submit', onSubmit);
    root.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLayer(); });
    window.addEventListener('hashchange', () => { render(); scrollTop(); });
    window.addEventListener('pagehide', flushBeacon);
    window.addEventListener('beforeunload', (e) => { if (!ADMIN && Object.keys(S.pending).length && !STORE_OK) { e.preventDefault(); e.returnValue = ''; } });
    window.addEventListener('online', () => { if (Object.keys(S.pending).length) scheduleSave(200); });
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
        S.admin.me = me;
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
    if (!S.token) return renderLogin();
    if (ADMIN) return CONTENT ? renderAdmin() : renderLoading('Cargando el panel…');
    if (!S.me) return renderLoading('Cargando tu workbook…');
    const r = route();
    if (r[1] === 'bp' && BPS[Number(r[2]) - 1]) return renderBlueprint(Number(r[2]));
    if (r[1] === 'plan') return renderPlan();
    if (r[1] === 'biblioteca') return renderLibrary();
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
        setContent(me.content); S.admin.me = me;
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
    S.admin = { me: null, cohorts: null, detail: {}, workbooks: {}, showPins: {}, addMode: 'one', lastAdd: null, filter: '' };
    store.del(tokenKey);
    closeLayer();
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
      '<div class="wb-tools">' +
      '<button type="button" class="wb-tool" data-act="glossary">' + ICON.book + '<span>Glosario</span></button>' +
      '<button type="button" class="wb-tool" data-act="pdf">' + ICON.download + '<span>PDF</span></button>' +
      '<button type="button" class="wb-tool wb-tool--ghost" data-act="logout"><span>Salir</span></button>' +
      '</div></div>';
  }

  function renderHome() {
    const pr = progress(S.answers);
    const kick = S.me.cohort ? parseIso(S.me.cohort.kickoff) : null;
    const steps = CONTENT.intro.steps.map((s, i) => '<div class="wb-step"><b>' + (i + 1) + '</b><strong>' + esc(s.t) + '</strong><span>' + esc(s.d) + '</span></div>').join('');
    const route = CONTENT.route.items.map((it) => {
      const on = filled(S.answers[it.id]);
      const d = kick ? shortDate(addDays(kick, it.day)) : 'Día ' + (it.day + 1);
      return '<button type="button" class="wb-route' + (on ? ' is-on' : '') + '" data-act="toggle" data-field="' + it.id + '" aria-pressed="' + on + '">' +
        '<span class="wb-route-when">' + esc(d) + (it.when ? '<small>' + esc(it.when) + '</small>' : '') + (it.live ? '<em>En vivo</em>' : '') + '</span>' +
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
    show(
      topBar() +
      '<div class="wb-hero"><span class="wb-pill wb-pill--lime">Tu avance</span>' +
      '<h1 class="wb-h1 wb-h1--light">' + esc(CONTENT.title) + '</h1>' +
      '<div class="wb-hero-stats"><div class="wb-big">' + pr.pct + '<small>%</small></div>' +
      '<p>' + pr.answered + ' de ' + pr.total + ' secciones respondidas · ' + pr.done.length + ' de 8 Blueprints terminados · Plan de 90 días: ' + pr.plan + '/9</p></div>' +
      bar(pr.pct, 'wb-bar--hero') +
      (pr.answered ? '' : '<a class="wb-btn wb-btn--lime" href="#wb/bp/1">Empezar por el Blueprint 1</a>') +
      '</div>' +
      '<section class="wb-sec"><span class="wb-pill">Cómo usar tu workbook</span><div class="wb-steps">' + steps + '</div></section>' +
      '<section class="wb-sec"><span class="wb-pill">Tu ruta de 5 días</span><h2 class="wb-h2">' + esc(CONTENT.route.intro) + '</h2>' +
      '<div class="wb-routes">' + route + '</div>' +
      '<div class="wb-callout"><strong>' + esc(CONTENT.route.note.t) + '</strong><span>' + esc(CONTENT.route.note.d) + '</span></div></section>' +
      '<section class="wb-sec"><span class="wb-pill">Los 8 Blueprints</span><h2 class="wb-h2">Tu Sistema de Ingresos, un Blueprint a la vez</h2><div class="wb-bpgrid">' + cards + '</div></section>' +
      '<section class="wb-sec wb-two">' +
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
      '<article class="wb-section" id="wb-' + s.id + '">' +
      '<div class="wb-section-head"><span class="wb-num">' + s.n + '</span><h3 class="wb-h3">' + esc(s.title) + '</h3></div>' +
      '<p class="wb-q">' + esc(s.question) + '</p>' +
      '<div class="wb-label">Tu respuesta</div>' + textarea(s.id, 'Escribe aquí tu respuesta (2 a 3 líneas son suficientes)…', readOnly) +
      (readOnly ? '' : '<div class="wb-prompt"><div class="wb-prompt-head"><span>Copiloto IA</span>' + copyBtn(s.prompt) + '</div><p>' + esc(s.prompt) + '</p></div>') +
      '</article>').join('');
    const faqs = bp.faqs.map((f) => '<details class="wb-faq"><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>').join('');
    const res = bp.resources.map(resourceHtml).join('');
    const done = filled(S.answers[bp.doneId]);
    return '<div class="wb-bphead"><span class="wb-pill">Blueprint ' + bp.n + ' de 8</span>' +
      '<h1 class="wb-h1">' + esc(bp.title) + (bp.subtitle ? ' <span class="wb-sub">(' + esc(bp.subtitle) + ')</span>' : '') + '</h1>' +
      '<p class="wb-lead">' + esc(bp.tagline) + '</p></div>' +
      '<div class="wb-take"><span>Qué te llevas</span><p>' + esc(bp.takeaway) + '</p></div>' +
      '<div class="wb-sec"><div class="wb-label wb-label--top">Resultado esperado</div><div class="wb-vs">' +
      '<div class="wb-vs-bad"><b>Mal hecho</b><p>' + esc(bp.bad) + '</p></div>' +
      '<div class="wb-vs-good"><b>Bien hecho</b><p>' + esc(bp.good) + '</p></div></div></div>' +
      (readOnly ? '' : '<div class="wb-master"><div class="wb-prompt-head"><span>Copiloto IA · Prompt maestro</span>' + copyBtn(bp.masterPrompt) + '</div><p>' + esc(bp.masterPrompt) + '</p></div>') +
      '<section class="wb-sec"><span class="wb-pill">Completa cada sección</span><h2 class="wb-h2">' + bp.sections.length + ' secciones</h2>' +
      (readOnly ? '' : '<p class="wb-muted">Con 2 a 3 líneas por respuesta es suficiente; usa el prompt del Copiloto para avanzar más rápido. Todo se guarda solo.</p>') +
      secs + '</section>' +
      (readOnly ? '' :
        '<section class="wb-sec"><span class="wb-pill">Preguntas frecuentes</span><div class="wb-faqs">' + faqs + '</div></section>' +
        '<section class="wb-sec"><span class="wb-pill">Para profundizar</span><p class="wb-muted wb-mt">' + esc(bp.resourcesIntro) + '</p>' + res + '</section>' +
        '<button type="button" class="wb-done' + (done ? ' is-on' : '') + '" data-act="toggle" data-field="' + bp.doneId + '" aria-pressed="' + done + '">' +
        '<span class="wb-check">' + ICON.check + '</span><span>Terminé el Blueprint ' + bp.n + ' y estoy listo para el siguiente.</span></button>');
  }

  function resourceHtml(r) {
    return '<div class="wb-res"><strong>' + esc(r.title) + '</strong><span class="wb-muted">' + esc(r.author) + ' · ' + esc(r.kind.toLowerCase()) + '</span>' +
      (r.featured ? '<span class="wb-chip wb-chip--done">Recomendado para todo el Sprint</span>' : '') +
      '<p><b>Úsalo en:</b> ' + esc(r.use) + '</p>' +
      (r.url ? '<a href="https://' + esc(r.url.replace(/^https?:\/\//, '')) + '" target="_blank" rel="noopener">' + esc(r.url) + '</a>' : '') + '</div>';
  }

  function renderBlueprint(n) {
    const bp = BPS[n - 1];
    const prev = BPS[n - 2], next = BPS[n];
    const b = bpProgress(bp, S.answers);
    show(
      topBar() +
      '<div class="wb-crumbs"><a href="#wb/inicio">' + ICON.left + 'Inicio</a><span class="wb-muted" data-bpcount="' + bp.n + '">' + b.n + '/' + b.total + ' secciones</span></div>' +
      bpHtml(bp, false) +
      '<nav class="wb-pager">' +
      (prev ? '<a href="#wb/bp/' + prev.n + '">' + ICON.left + '<span><small>Anterior</small>' + esc(prev.title) + '</span></a>' : '<a href="#wb/inicio">' + ICON.left + '<span><small>Volver</small>Inicio</span></a>') +
      (next ? '<a class="is-next" href="#wb/bp/' + next.n + '"><span><small>Siguiente</small>' + esc(next.title) + '</span>' + ICON.right + '</a>' :
        '<a class="is-next" href="#wb/plan"><span><small>Siguiente</small>Plan de 90 días</span>' + ICON.right + '</a>') +
      '</nav>'
    );
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
      planHtml(false) +
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
      } catch (e) { if (e.code !== 'auth') renderError(e); return; }
      if (route()[1] !== 'cohortes') return;
    }
    const list = S.admin.cohorts;
    const cards = list.map((c) => {
      const k = parseIso(c.kickoff);
      return '<a class="wb-cohort' + (c.status === 'Cerrada' ? ' is-closed' : '') + '" href="#wb/cohorte/' + esc(c.id) + '">' +
        '<div class="wb-cohort-head"><strong>' + esc(c.name) + '</strong><span class="wb-chip' + (c.status === 'Cerrada' ? ' wb-chip--muted' : ' wb-chip--done') + '">' + esc(c.status) + '</span></div>' +
        '<span class="wb-muted">Kick-off: ' + (k ? esc(shortDate(k) + ' ' + k.getFullYear()) : '—') + '</span>' +
        '<div class="wb-cohort-stats"><span><b>' + c.participants + '</b> ' + (c.participants === 1 ? 'participante' : 'participantes') + '</span><span><b>' + c.avgProgress + '%</b> avance promedio</span><span><b>' + c.finished + '</b> con los 8 Blueprints</span></div>' +
        bar(c.avgProgress) + '</a>';
    }).join('');
    show(
      adminTop() +
      '<div class="wb-bphead wb-row"><div><span class="wb-pill">Cohortes</span><h1 class="wb-h1">Sprint Ejecutivo</h1></div>' +
      '<button type="button" class="wb-btn" data-act="new-cohort">' + ICON.plus + 'Nueva cohorte</button></div>' +
      '<div data-newcohort></div>' +
      (list.length ? '<div class="wb-cohorts">' + cards + '</div>' :
        '<div class="wb-empty"><strong>Todavía no hay cohortes.</strong><span>Crea la primera para empezar a dar de alta participantes.</span></div>')
    );
  }

  function cohortForm(c) {
    return '<form class="wb-card wb-form" data-form="' + (c ? 'edit-cohort' : 'new-cohort') + '" novalidate>' +
      '<h3 class="wb-h3">' + (c ? 'Editar cohorte' : 'Nueva cohorte') + '</h3>' +
      '<div class="wb-grid2"><label class="wb-field"><span>Nombre</span><input class="wb-input" name="name" maxlength="80" value="' + esc(c ? c.name : '') + '" placeholder="Ej. Cohorte Noviembre 2026" required></label>' +
      '<label class="wb-field"><span>Kick-off (lunes)</span><input class="wb-input" name="kickoff" type="date" value="' + esc(c ? c.kickoff : '') + '" required></label></div>' +
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
      addPanel(c) +
      '<section class="wb-sec"><div class="wb-row"><div><span class="wb-pill">Participantes</span></div>' +
      (d.participants.length > 2 ? '<label class="wb-search wb-search--inline">' + ICON.search + '<input type="search" data-filter value="' + esc(S.admin.filter) + '" placeholder="Buscar por nombre, correo o empresa" aria-label="Buscar participante"></label>' : '') +
      '</div>' +
      (active.length ? '<div class="wb-people">' + active.map(personCard).join('') + '</div>' :
        '<div class="wb-empty"><strong>Aún no hay participantes activos.</strong><span>Agrégalos arriba: uno por uno o pegando una lista.</span></div>') +
      '<div class="wb-empty" data-nomatch hidden><strong>Nadie coincide con la búsqueda.</strong></div>' +
      (inactive.length ? '<details class="wb-inactive"><summary>Quitados (' + inactive.length + ')</summary><div class="wb-people">' + inactive.map(personCard).join('') + '</div></details>' : '') +
      '</section>'
    );
    filterPeople();
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
      bar(p.progress) + '<div class="wb-bpdots" aria-label="Blueprints terminados">' + chips + '</div></div>' +
      '<div class="wb-person-meta"><span>' + (p.lastActivity ? 'Última actividad ' + esc(relTime(p.lastActivity)) : (p.lastLogin ? 'Entró ' + esc(relTime(p.lastLogin)) : 'Aún no entra')) + '</span>' +
      '<span>' + (p.sent ? 'Acceso enviado ' + esc(relTime(p.sent)) : 'Acceso no enviado') + '</span></div>' +
      '<div class="wb-person-actions">' +
      (inactive ? '<button type="button" class="wb-btn wb-btn--sm" data-act="reactivate" data-id="' + esc(p.id) + '">Reactivar</button>' :
        '<a class="wb-btn wb-btn--sm" href="#wb/participante/' + esc(p.id) + '">Ver workbook</a>' +
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
    if (i >= 0) d.participants[i] = p;
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
    const html = adminTop() +
      '<div class="wb-crumbs"><a href="#wb/cohorte/' + esc(p.cohortId) + '">' + ICON.left + esc(w.cohort ? w.cohort.name : 'Cohorte') + '</a></div>' +
      '<div class="wb-bphead wb-row"><div><span class="wb-pill">Solo lectura</span><h1 class="wb-h1">' + esc(p.name) + '</h1>' +
      '<p class="wb-lead">' + esc(p.email) + (p.company ? ' · ' + esc(p.company) : '') + (w.updated ? ' · Última actividad ' + esc(relTime(w.updated)) : '') + '</p></div>' +
      '<div class="wb-actions"><button type="button" class="wb-btn" data-act="admin-pdf" data-id="' + esc(p.id) + '">' + ICON.download + 'Descargar PDF</button></div></div>' +
      '<div class="wb-statrow"><div><b>' + pr.pct + '%</b><span>avance</span></div><div><b>' + pr.answered + '/' + pr.total + '</b><span>secciones</span></div>' +
      '<div><b>' + pr.done.length + '/8</b><span>Blueprints terminados</span></div><div><b>' + pr.plan + '/9</b><span>plan de 90 días</span></div></div>' +
      blocks +
      '<details class="wb-ro"' + (pr.plan ? ' open' : '') + '><summary><span class="wb-bpnum">90</span><span><strong>' + esc(CONTENT.plan.title) + '</strong><small>' + pr.plan + '/9 campos</small></span></summary>' + planHtml(true) + '</details>';
    S.answers = saved;
    show(html);
  }

  /* ===================== EVENTOS ===================== */
  function onInput(e) {
    const t = e.target;
    if (t.matches('textarea[data-field]')) {
      autosize(t);
      if (!ADMIN) {
        setAnswer(t.getAttribute('data-field'), t.value);
        const c = view.querySelector('[data-bpcount]');
        if (c) { const b = bpProgress(BPS[Number(c.getAttribute('data-bpcount')) - 1], S.answers); c.textContent = b.n + '/' + b.total + ' secciones'; }
      }
      return;
    }
    if (t.matches('[data-glossary-search]')) return filterGlossary(t.value);
    if (t.matches('[data-filter]')) { S.admin.filter = t.value; return filterPeople(); }
    if (t.classList && t.classList.contains('is-error')) t.classList.remove('is-error');
  }

  function autosize(t) { t.style.height = 'auto'; t.style.height = Math.max(t.scrollHeight + 2, 84) + 'px'; }
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
      t.classList.toggle('is-on', on); t.setAttribute('aria-pressed', String(on));
      if (on && /_TERMINADO$/.test(f)) toast('¡Blueprint terminado!');
      return;
    }
    if (act === 'pdf') return downloadPdf(t, { profile: S.me.profile, cohort: S.me.cohort, answers: S.answers });
    if (!ADMIN) return;

    // ---- Admin ----
    if (act === 'refresh') {
      S.admin.cohorts = null; S.admin.detail = {}; S.admin.workbooks = {};
      return renderAdmin();
    }
    if (act === 'new-cohort') { const slot = view.querySelector('[data-newcohort]'); slot.innerHTML = cohortForm(null); slot.querySelector('input').focus(); return; }
    if (act === 'edit-cohort') { const slot = view.querySelector('[data-editcohort]'); slot.innerHTML = cohortForm(S.admin.detail[route()[2]].cohort); slot.querySelector('input').focus(); return; }
    if (act === 'cancel-form') { const f = t.closest('form'); if (f) f.remove(); return; }
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
    const err = form.querySelector('[data-err]');
    const btn = form.querySelector('[data-submit]');
    err.textContent = '';
    const F = form.elements;
    let action, data, after;
    if (kind === 'new-cohort' || kind === 'edit-cohort') {
      const name = F.name.value.trim(), kickoff = F.kickoff.value;
      if (!name || !/^\d{4}-\d{2}-\d{2}$/.test(kickoff)) { err.textContent = 'Escribe el nombre y elige la fecha del kick-off.'; return; }
      if (kind === 'new-cohort') {
        action = 'admin.cohort.create'; data = { name: name, kickoff: kickoff };
        after = (out) => { S.admin.cohorts = null; go('wb/cohorte/' + out.cohort.id); };
      } else {
        const id = route()[2];
        action = 'admin.cohort.update'; data = { id: id, name: name, kickoff: kickoff };
        after = (out) => { S.admin.detail[id].cohort = out.cohort; S.admin.cohorts = null; toast('Cohorte actualizada'); adminCohort(id); };
      }
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
      y += th + 20;
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
  const CSS = "#ag-wb{--ink:#000919;--blue:#1a11f7;--blue-h:#1209c9;--deep:#00086d;--lime:#cbff8b;--lime-soft:#dff9bf;--lime-line:#b8ec7a;--bg:#f3f3f3;--card:#fafafa;--line:#d6d6d6;--muted:#5b5f6a;--faint:#e3e3e6;--red:#c5221f;font-family:\"DM Sans\",system-ui,-apple-system,\"Segoe UI\",sans-serif;color:var(--ink);background:var(--bg);border-radius:24px;padding:28px 20px 40px;max-width:1000px;margin:0 auto;text-align:left;line-height:1.5;font-size:16px;-webkit-font-smoothing:antialiased;position:relative}#ag-wb *,#ag-wb *::before,#ag-wb *::after{box-sizing:border-box}#ag-wb [hidden]{display:none!important}#ag-wb h1,#ag-wb h2,#ag-wb h3,#ag-wb h4,#ag-wb p,#ag-wb ul,#ag-wb figure{margin:0}#ag-wb ul{padding-left:20px}#ag-wb label{margin:0;font-weight:inherit}#ag-wb a{color:var(--blue)}#ag-wb svg{width:18px;height:18px;flex:0 0 auto;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}#ag-wb button{font-family:inherit;margin:0}#ag-wb code{font:700 15px/1 ui-monospace,\"SFMono-Regular\",Menlo,Consolas,monospace;letter-spacing:.08em}#ag-wb .wb-h1{font:400 40px/1.06 \"DM Serif Display\",Georgia,serif;margin:14px 0 0;color:var(--ink);letter-spacing:0}#ag-wb .wb-h1 span{color:var(--blue)}#ag-wb .wb-h1 .wb-sub{font-size:.6em;color:var(--muted)}#ag-wb .wb-h1--light{color:#fff}#ag-wb .wb-h2{font:400 28px/1.15 \"DM Serif Display\",Georgia,serif;color:var(--ink);margin-top:12px}#ag-wb .wb-h3{font:700 18px/1.3 \"DM Sans\",sans-serif;color:var(--ink)}#ag-wb .wb-lead{font-size:17px;color:var(--muted);margin-top:12px;max-width:40em}#ag-wb .wb-muted{color:var(--muted)}#ag-wb .wb-small{font-size:13px;color:var(--muted);margin-top:14px}#ag-wb .wb-mt{margin-top:12px}#ag-wb .wb-note{margin-top:16px;padding:12px 14px;border-radius:12px;background:var(--lime-soft);font-size:14px}#ag-wb .wb-err{min-height:0;color:var(--red);font-size:14px;font-weight:500}#ag-wb .wb-err:empty{display:none}#ag-wb .wb-ok{color:#1d7a3a;font-weight:700}#ag-wb .wb-bad{color:var(--red);font-weight:700}#ag-wb .wb-label{font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:16px 0 8px}#ag-wb .wb-label--top{margin-top:0}#ag-wb .wb-kicker{display:block;font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted)}#ag-wb .wb-pill{display:inline-block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:8px 13px;border-radius:999px;background:var(--blue);color:#fff}#ag-wb .wb-pill--lime{background:var(--lime);color:var(--ink)}#ag-wb .wb-pill--ink{background:var(--ink);color:var(--lime)}#ag-wb .wb-chip{display:inline-flex;align-items:center;gap:4px;font:700 12px/1 \"DM Sans\",sans-serif;padding:6px 10px;border-radius:999px;background:#e8e7ff;color:var(--blue);white-space:nowrap}#ag-wb .wb-chip svg{width:13px;height:13px;stroke-width:3}#ag-wb .wb-chip--done{background:var(--lime);color:var(--ink)}#ag-wb .wb-chip--muted{background:var(--faint);color:var(--muted)}#ag-wb .wb-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:48px;padding:12px 22px;border:0;border-radius:999px;background:var(--blue);color:#fff;font:700 15px/1.2 \"DM Sans\",sans-serif;cursor:pointer;text-decoration:none;transition:background .15s,opacity .15s;-webkit-appearance:none;appearance:none;text-align:center;white-space:nowrap}#ag-wb .wb-btn:hover{background:var(--blue-h);color:#fff}#ag-wb .wb-btn:disabled{opacity:.6;cursor:progress}#ag-wb .wb-btn--full{display:flex;width:100%;min-height:54px;font-size:16px}#ag-wb .wb-btn--lime{background:var(--lime);color:var(--ink);margin-top:20px}#ag-wb .wb-btn--lime:hover{background:#b9f26d;color:var(--ink)}#ag-wb .wb-btn--ghost{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--line)}#ag-wb .wb-btn--ghost:hover{background:#fff;color:var(--blue);box-shadow:inset 0 0 0 1.5px var(--blue)}#ag-wb .wb-btn--danger{background:#fff;color:var(--red);box-shadow:inset 0 0 0 1.5px #f0c4c3}#ag-wb .wb-btn--danger:hover{background:#fff5f5;color:var(--red)}#ag-wb .wb-btn--sm{min-height:36px;padding:8px 14px;font-size:13px}#ag-wb .wb-btn svg{width:17px;height:17px}#ag-wb .wb-icon{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:0;background:transparent;color:var(--ink);cursor:pointer;padding:0}#ag-wb .wb-icon:hover{background:var(--faint)}#ag-wb .wb-btn:focus-visible,#ag-wb .wb-icon:focus-visible,#ag-wb .wb-tool:focus-visible,#ag-wb a:focus-visible,#ag-wb .wb-route:focus-visible,#ag-wb .wb-done:focus-visible,#ag-wb .wb-copy:focus-visible,#ag-wb summary:focus-visible,#ag-wb .wb-tabs button:focus-visible{outline:3px solid var(--blue);outline-offset:2px}#ag-wb .wb-form{display:grid;gap:14px}#ag-wb .wb-field{display:grid;gap:7px}#ag-wb .wb-field>span{font:700 14px/1.2 \"DM Sans\",sans-serif;color:var(--ink)}#ag-wb .wb-field em{font-style:normal;font-weight:400;color:var(--muted)}#ag-wb .wb-input{display:block;width:100%;height:50px;padding:0 15px;border:1.5px solid var(--line);border-radius:14px;background:#fff;font:400 16px/1.2 \"DM Sans\",sans-serif;color:var(--ink);margin:0;box-shadow:none;-webkit-appearance:none;appearance:none}#ag-wb .wb-input:focus,#ag-wb .wb-ta:focus{outline:none;border-color:var(--blue);box-shadow:0 0 0 4px rgba(26,17,247,.14)}#ag-wb .wb-pin{font:700 22px/1 ui-monospace,\"SFMono-Regular\",Menlo,Consolas,monospace;letter-spacing:.4em}#ag-wb .wb-ta{display:block;width:100%;min-height:84px;padding:13px 15px;border:1.5px solid var(--line);border-radius:14px;background:#fff;font:400 16px/1.55 \"DM Sans\",sans-serif;color:var(--ink);resize:vertical;margin:0;box-shadow:none;overflow:hidden;-webkit-appearance:none;appearance:none}#ag-wb .wb-ta::placeholder,#ag-wb .wb-input::placeholder{color:#9a9ea9}#ag-wb .wb-ta--list{min-height:130px;overflow:auto;font-size:15px}#ag-wb .wb-checkline{display:flex;align-items:center;gap:10px;font-size:14px;cursor:pointer}#ag-wb .wb-checkline input{width:18px;height:18px;margin:0;accent-color:var(--blue)}#ag-wb .wb-actions{display:flex;flex-wrap:wrap;gap:10px;align-items:center}#ag-wb .wb-grid2,#ag-wb .wb-grid3{display:grid;gap:14px}#ag-wb .wb-screen{animation:agwbIn .25s ease}@keyframes agwbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}#ag-wb .wb-center{display:grid;justify-items:center;gap:14px;text-align:center;padding:70px 10px;color:var(--muted)}#ag-wb .wb-spin{display:inline-block;width:18px;height:18px;border-radius:50%;border:2.5px solid rgba(26,17,247,.2);border-top-color:var(--blue);animation:agwbSpin .8s linear infinite;vertical-align:-3px}#ag-wb .wb-center .wb-spin{width:30px;height:30px;border-width:3px}#ag-wb .wb-spin--light{border-color:rgba(255,255,255,.35);border-top-color:#fff}@keyframes agwbSpin{to{transform:rotate(360deg)}}#ag-wb .wb-sec{margin-top:36px}#ag-wb .wb-row{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:14px}#ag-wb .wb-row-sm{display:flex;justify-content:space-between;gap:10px;font-size:14px}#ag-wb .wb-card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:20px}#ag-wb .wb-empty{display:grid;gap:4px;padding:26px 20px;border:1.5px dashed var(--line);border-radius:18px;text-align:center;color:var(--muted);margin-top:14px}#ag-wb .wb-empty strong{color:var(--ink)}#ag-wb .wb-login{max-width:440px;margin:24px auto 10px}#ag-wb .wb-login-logo{display:block;height:34px;width:auto;margin-bottom:30px}#ag-wb .wb-login .wb-form{margin-top:24px}#ag-wb .wb-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-bottom:18px;margin-bottom:22px;border-bottom:1px solid var(--line)}#ag-wb .wb-hello strong{display:block;font:400 24px/1.2 \"DM Serif Display\",Georgia,serif;margin-top:4px}#ag-wb .wb-tools{display:flex;gap:8px;flex-wrap:wrap}#ag-wb .wb-tool{display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 14px;border-radius:999px;border:0;background:#fff;box-shadow:inset 0 0 0 1.5px var(--line);color:var(--ink);font:700 14px/1 \"DM Sans\",sans-serif;cursor:pointer}#ag-wb .wb-tool:hover{box-shadow:inset 0 0 0 1.5px var(--blue);color:var(--blue)}#ag-wb .wb-tool:disabled{opacity:.6;cursor:progress}#ag-wb .wb-tool--ghost{background:transparent;box-shadow:none;color:var(--muted)}#ag-wb .wb-hero{border-radius:24px;padding:28px 22px 26px;color:#fff;background:linear-gradient(160deg,var(--deep) 0%,#0000d8 100%);position:relative;overflow:hidden}#ag-wb .wb-hero::after{content:\"\";position:absolute;right:-90px;top:-90px;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(203,255,139,.22),transparent 70%);pointer-events:none}#ag-wb .wb-hero .wb-h1{font-size:32px;margin-top:14px;max-width:16em}#ag-wb .wb-hero-stats{display:flex;flex-wrap:wrap;align-items:flex-end;gap:6px 18px;margin-top:18px}#ag-wb .wb-big{font:400 64px/1 \"DM Serif Display\",Georgia,serif;color:var(--lime)}#ag-wb .wb-big small{font-size:.5em}#ag-wb .wb-hero-stats p{color:#c9cbf5;font-size:15px;max-width:30em;padding-bottom:8px}#ag-wb .wb-bar{height:8px;border-radius:99px;background:var(--faint);overflow:hidden;margin-top:10px}#ag-wb .wb-bar i{display:block;height:100%;background:var(--blue);border-radius:99px;transition:width .4s ease}#ag-wb .wb-bar--hero{background:rgba(255,255,255,.18);margin-top:16px}#ag-wb .wb-bar--hero i{background:var(--lime)}#ag-wb .wb-steps{display:grid;gap:10px;margin-top:14px}#ag-wb .wb-step{display:grid;grid-template-columns:34px 1fr;gap:2px 12px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:16px}#ag-wb .wb-step b{grid-row:span 2;width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--lime);font:700 15px/1 \"DM Sans\",sans-serif}#ag-wb .wb-step span{font-size:14px;color:var(--muted)}#ag-wb .wb-routes{display:grid;gap:10px;margin-top:16px}#ag-wb .wb-route{display:grid;grid-template-columns:1fr 30px;grid-template-areas:\"when check\" \"text check\";gap:6px 14px;align-items:center;width:100%;text-align:left;padding:14px 16px;border-radius:16px;border:1.5px solid var(--line);background:#fff;color:var(--ink);cursor:pointer;font:400 15px/1.45 \"DM Sans\",sans-serif;transition:border-color .15s,background .15s}#ag-wb .wb-route:hover{border-color:var(--blue)}#ag-wb .wb-route-when{grid-area:when;display:flex;flex-wrap:wrap;align-items:center;gap:8px;font:700 13px/1.2 \"DM Sans\",sans-serif;color:var(--blue)}#ag-wb .wb-route-when small{font-weight:500;color:var(--muted);font-size:13px}#ag-wb .wb-route-when em{font-style:normal;font-size:11px;letter-spacing:.08em;text-transform:uppercase;background:var(--ink);color:var(--lime);padding:4px 8px;border-radius:99px}#ag-wb .wb-route-text{grid-area:text}#ag-wb .wb-check{grid-area:check;width:28px;height:28px;border-radius:9px;border:1.5px solid var(--line);display:inline-flex;align-items:center;justify-content:center;background:#fff;color:transparent;flex:0 0 28px}#ag-wb .wb-check svg{width:16px;height:16px;stroke-width:3}#ag-wb .wb-route.is-on{background:#f6fdee;border-color:var(--lime-line)}#ag-wb .wb-route.is-on .wb-check,#ag-wb .wb-done.is-on .wb-check{background:var(--lime);border-color:var(--lime-line);color:var(--ink)}#ag-wb .wb-route.is-on .wb-route-text{color:var(--muted)}#ag-wb .wb-callout{display:grid;gap:4px;margin-top:14px;padding:16px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line);font-size:14px}#ag-wb .wb-bpgrid{display:grid;gap:12px;margin-top:16px}#ag-wb .wb-bpcard{display:flex;gap:14px;padding:16px;border-radius:18px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);transition:border-color .15s,transform .15s}#ag-wb .wb-bpcard:hover{border-color:var(--blue);transform:translateY(-1px);color:var(--ink)}#ag-wb .wb-bpcard.is-done{border-color:var(--lime-line);background:#fbfff6}#ag-wb .wb-bpnum{flex:0 0 40px;width:40px;height:40px;border-radius:12px;display:inline-flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font:400 20px/1 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-bpcard.is-done .wb-bpnum{background:var(--lime);color:var(--ink)}#ag-wb .wb-bpbody{display:block;flex:1;min-width:0}#ag-wb .wb-bpbody strong{display:block;font:700 17px/1.25 \"DM Sans\",sans-serif}#ag-wb .wb-bpbody small{display:block;font-size:13px;color:var(--muted);margin-top:2px}#ag-wb .wb-bpmeta{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px;font-size:13px}#ag-wb .wb-two{display:grid;gap:12px}#ag-wb .wb-card--link{display:grid;gap:8px;position:relative;text-decoration:none;color:var(--ink);padding-right:50px;transition:border-color .15s}#ag-wb .wb-card--link .wb-pill{justify-self:start}#ag-wb .wb-card--link:hover{border-color:var(--blue);color:var(--ink)}#ag-wb .wb-card--link>svg{position:absolute;right:18px;top:50%;margin-top:-11px;width:22px;height:22px;color:var(--blue)}#ag-wb .wb-crumbs{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:16px;font-size:14px}#ag-wb .wb-crumbs a{display:inline-flex;align-items:center;gap:4px;font-weight:700;text-decoration:none;color:var(--ink)}#ag-wb .wb-crumbs a:hover{color:var(--blue)}#ag-wb .wb-bphead{margin-bottom:22px}#ag-wb .wb-take{padding:16px 18px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line)}#ag-wb .wb-take span{display:block;font:700 11px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px}#ag-wb .wb-vs{display:grid;gap:10px}#ag-wb .wb-vs>div{padding:16px;border-radius:16px;font-size:15px}#ag-wb .wb-vs b{display:block;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}#ag-wb .wb-vs-bad{background:#fff;border:1.5px solid #f0c4c3}#ag-wb .wb-vs-bad b{color:var(--red)}#ag-wb .wb-vs-good{background:#fff;border:1.5px solid var(--lime-line)}#ag-wb .wb-vs-good b{color:#1d7a3a}#ag-wb .wb-master{margin-top:22px;padding:18px;border-radius:18px;background:var(--ink);color:#e9eaf2}#ag-wb .wb-master p{font-size:14px;line-height:1.6;white-space:pre-line}#ag-wb .wb-prompt-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px}#ag-wb .wb-prompt-head>span{font:700 11px/1.2 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--lime)}#ag-wb .wb-copy{display:inline-flex;align-items:center;gap:6px;height:32px;padding:0 12px;border-radius:999px;border:0;background:var(--lime);color:var(--ink);font:700 13px/1 \"DM Sans\",sans-serif;cursor:pointer;white-space:nowrap}#ag-wb .wb-copy:hover{background:#b9f26d}#ag-wb .wb-copy svg{width:15px;height:15px}#ag-wb .wb-section{margin-top:18px;padding:20px 18px;border-radius:20px;background:#fff;border:1px solid var(--line);scroll-margin-top:90px}#ag-wb .wb-section-head{display:flex;align-items:flex-start;gap:12px}#ag-wb .wb-num{flex:0 0 30px;width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--blue);color:#fff;font:700 14px/1 \"DM Sans\",sans-serif;margin-top:-2px}#ag-wb .wb-q{margin-top:10px;font-size:15px;color:var(--muted)}#ag-wb .wb-prompt{margin-top:14px;padding:14px;border-radius:14px;background:var(--bg)}#ag-wb .wb-prompt .wb-prompt-head>span{color:var(--blue)}#ag-wb .wb-prompt p{font-size:14px;line-height:1.55;color:var(--muted)}#ag-wb .wb-answer{padding:13px 15px;border-radius:14px;background:var(--card);border:1px solid var(--line);white-space:pre-wrap;font-size:15px;overflow-wrap:anywhere}#ag-wb .wb-answer.is-empty{color:#9a9ea9;font-style:italic}#ag-wb .wb-faqs{display:grid;gap:8px;margin-top:14px}#ag-wb .wb-faq{background:#fff;border:1px solid var(--line);border-radius:14px;padding:0 16px}#ag-wb .wb-faq summary{cursor:pointer;padding:14px 0;font-weight:700;list-style:none;display:flex;justify-content:space-between;gap:12px}#ag-wb .wb-faq summary::-webkit-details-marker{display:none}#ag-wb .wb-faq summary::after{content:\"+\";font:400 22px/1 \"DM Sans\",sans-serif;color:var(--blue)}#ag-wb .wb-faq[open] summary::after{content:\"–\"}#ag-wb .wb-faq p{padding-bottom:14px;color:var(--muted);font-size:15px}#ag-wb .wb-res{display:grid;gap:4px;justify-items:start;margin-top:12px;padding:16px;border-radius:16px;background:#fff;border:1px solid var(--line);font-size:14px}#ag-wb .wb-res strong{font-size:16px}#ag-wb .wb-res a{word-break:break-all}#ag-wb .wb-done{display:flex;align-items:center;gap:14px;width:100%;margin-top:32px;padding:18px;border-radius:18px;border:1.5px dashed var(--blue);background:#fff;color:var(--ink);font:700 16px/1.35 \"DM Sans\",sans-serif;text-align:left;cursor:pointer}#ag-wb .wb-done .wb-check{width:32px;height:32px;flex-basis:32px}#ag-wb .wb-done.is-on{border-style:solid;border-color:var(--lime-line);background:var(--lime-soft)}#ag-wb .wb-pager{display:grid;gap:10px;margin-top:28px}#ag-wb .wb-pager a{display:flex;align-items:center;gap:10px;padding:14px 16px;border-radius:16px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);font-weight:700}#ag-wb .wb-pager a:hover{border-color:var(--blue)}#ag-wb .wb-pager a.is-next{justify-content:flex-end;text-align:right;background:var(--blue);border-color:var(--blue);color:#fff}#ag-wb .wb-pager small{display:block;font-weight:500;font-size:12px;opacity:.75}#ag-wb .wb-period{margin-top:18px;padding:18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-period-head{display:inline-block;font:700 12px/1 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;padding:9px 14px;border-radius:999px;background:var(--ink);color:var(--lime)}#ag-wb .wb-save{position:fixed;left:16px;bottom:16px;z-index:2147482000;display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:999px;background:var(--ink);color:#fff;font:700 13px/1 \"DM Sans\",sans-serif;box-shadow:0 8px 24px rgba(0,9,25,.2);opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}#ag-wb .wb-save.is-on{opacity:1;transform:none}#ag-wb .wb-save svg{width:15px;height:15px;stroke:var(--lime);stroke-width:3}#ag-wb .wb-dot{width:8px;height:8px;border-radius:50%;background:#ffc94d}#ag-wb .wb-save.is-saving .wb-dot{background:var(--lime);animation:agwbPulse 1s ease infinite}#ag-wb .wb-save.is-offline{background:var(--red)}#ag-wb .wb-save.is-offline .wb-dot{background:#fff}@keyframes agwbPulse{50%{opacity:.3}}#ag-wb .wb-toast{position:fixed;left:50%;bottom:16px;z-index:2147482001;transform:translate(-50%,16px);padding:12px 18px;border-radius:999px;background:var(--lime);color:var(--ink);font:700 14px/1.2 \"DM Sans\",sans-serif;box-shadow:0 8px 24px rgba(0,9,25,.2);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;max-width:calc(100vw - 32px);text-align:center}#ag-wb .wb-toast.is-on{opacity:1;transform:translate(-50%,0)}#ag-wb .wb-layer{display:none}#ag-wb .wb-layer.is-on{display:block}#ag-wb .wb-overlay{position:fixed;inset:0;z-index:2147482500;background:rgba(0,9,25,.45)}#ag-wb .wb-drawer{position:fixed;top:0;right:0;bottom:0;z-index:2147482501;width:min(480px,100vw);background:var(--bg);display:flex;flex-direction:column;box-shadow:-10px 0 40px rgba(0,9,25,.25);animation:agwbDrawer .25s ease}@keyframes agwbDrawer{from{transform:translateX(30px);opacity:0}to{transform:none;opacity:1}}#ag-wb .wb-drawer-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:20px 20px 12px}#ag-wb .wb-drawer-head .wb-h2{font-size:24px;margin-top:10px}#ag-wb .wb-search{display:flex;align-items:center;gap:8px;margin:0 20px 10px;padding:0 14px;height:46px;border-radius:14px;background:#fff;border:1.5px solid var(--line);color:var(--muted)}#ag-wb .wb-search:focus-within{border-color:var(--blue)}#ag-wb .wb-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;font:400 16px/1 \"DM Sans\",sans-serif;color:var(--ink);padding:0;margin:0;box-shadow:none;-webkit-appearance:none;appearance:none}#ag-wb .wb-search--inline{margin:0;flex:1 1 260px;max-width:360px}#ag-wb .wb-gloss{flex:1;overflow-y:auto;padding:4px 20px 30px;-webkit-overflow-scrolling:touch;overscroll-behavior:contain}#ag-wb .wb-gloss-group{margin-top:16px}#ag-wb .wb-gloss-group h3{font:700 11px/1.3 \"DM Sans\",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}#ag-wb .wb-gloss-group.is-current h3{color:var(--blue)}#ag-wb .wb-term{padding:12px 14px;border-radius:14px;background:#fff;border:1px solid var(--line);margin-bottom:8px}#ag-wb .wb-gloss-group.is-current .wb-term{border-color:#c9c6ff}#ag-wb .wb-term p{font-size:14px;color:var(--muted);margin-top:3px}#ag-wb .wb-gloss-empty{padding:30px 0;text-align:center;color:var(--muted)}#ag-wb .wb-tip{display:grid;gap:4px;margin-top:18px;padding:14px;border-radius:14px;background:var(--lime-soft);font-size:14px}#ag-wb .wb-cohorts{display:grid;gap:12px}#ag-wb .wb-cohort{display:grid;gap:6px;padding:18px;border-radius:20px;background:#fff;border:1.5px solid var(--line);text-decoration:none;color:var(--ink);transition:border-color .15s}#ag-wb .wb-cohort:hover{border-color:var(--blue);color:var(--ink)}#ag-wb .wb-cohort.is-closed{background:var(--card)}#ag-wb .wb-cohort-head{display:flex;justify-content:space-between;align-items:center;gap:10px}#ag-wb .wb-cohort-head strong{font:400 22px/1.2 \"DM Serif Display\",Georgia,serif}#ag-wb .wb-cohort-stats{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px;color:var(--muted);margin-top:6px}#ag-wb .wb-cohort-stats b{color:var(--ink)}#ag-wb [data-newcohort],#ag-wb [data-editcohort]{margin-bottom:16px}#ag-wb .wb-add{margin-bottom:6px}#ag-wb .wb-add .wb-form{margin-top:16px}#ag-wb .wb-tabs{display:inline-flex;padding:4px;border-radius:999px;background:var(--bg)}#ag-wb .wb-tabs button{border:0;background:transparent;padding:8px 16px;border-radius:999px;font:700 14px/1 \"DM Sans\",sans-serif;color:var(--muted);cursor:pointer}#ag-wb .wb-tabs button[aria-selected=\"true\"]{background:var(--ink);color:#fff}#ag-wb .wb-result{margin-top:16px;padding:16px;border-radius:16px;background:var(--lime-soft);border:1px solid var(--lime-line);display:grid;gap:8px;justify-items:start;font-size:14px}#ag-wb .wb-result ul{display:grid;gap:4px}#ag-wb .wb-result code{font-size:14px}#ag-wb .wb-people{display:grid;gap:12px;margin-top:14px}#ag-wb .wb-person{display:grid;gap:14px;padding:18px;border-radius:20px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-person.is-inactive{background:var(--card);opacity:.85}#ag-wb .wb-person-main strong{display:block;font-size:17px}#ag-wb .wb-person-main span{font-size:14px;overflow-wrap:anywhere}#ag-wb .wb-person-pin{display:flex;align-items:center;gap:6px}#ag-wb .wb-person-pin .wb-label{margin:0 6px 0 0}#ag-wb .wb-person-pin code{min-width:72px}#ag-wb .wb-bpdots{display:flex;gap:5px;margin-top:10px}#ag-wb .wb-bpdots i{width:24px;height:24px;border-radius:7px;display:inline-flex;align-items:center;justify-content:center;font:700 11px/1 \"DM Sans\",sans-serif;font-style:normal;background:var(--faint);color:var(--muted)}#ag-wb .wb-bpdots i.on{background:var(--lime);color:var(--ink)}#ag-wb .wb-person-meta{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:13px;color:var(--muted)}#ag-wb .wb-person-actions{display:flex;flex-wrap:wrap;gap:8px}#ag-wb .wb-editp{padding-top:14px;border-top:1px solid var(--line)}#ag-wb [data-edit-slot]:empty{display:none}#ag-wb .wb-inactive{margin-top:22px}#ag-wb .wb-inactive summary{cursor:pointer;font-weight:700;color:var(--muted)}#ag-wb .wb-statrow{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:20px}#ag-wb .wb-statrow div{padding:14px;border-radius:16px;background:#fff;border:1px solid var(--line)}#ag-wb .wb-statrow b{display:block;font:400 28px/1.1 \"DM Serif Display\",Georgia,serif;color:var(--blue)}#ag-wb .wb-statrow span{font-size:13px;color:var(--muted)}#ag-wb .wb-ro{margin-top:10px;border-radius:18px;background:#fff;border:1px solid var(--line);padding:0 16px}#ag-wb .wb-ro>summary{display:flex;align-items:center;gap:12px;padding:14px 0;cursor:pointer;list-style:none}#ag-wb .wb-ro>summary::-webkit-details-marker{display:none}#ag-wb .wb-ro>summary strong{display:block}#ag-wb .wb-ro>summary small{display:block;font-size:13px;color:var(--muted)}#ag-wb .wb-ro .wb-bpnum{flex-basis:36px;width:36px;height:36px;font-size:17px}#ag-wb .wb-ro-item{padding:14px 0;border-top:1px solid var(--faint)}#ag-wb .wb-ro-item h4{font:700 15px/1.3 \"DM Sans\",sans-serif}#ag-wb .wb-ro-item .wb-q{font-size:14px;margin:4px 0 10px}#ag-wb .wb-ro .wb-period{border:0;padding:0 0 16px;margin-top:6px}@media (min-width:640px){#ag-wb{padding:36px 36px 48px}#ag-wb .wb-h1{font-size:48px}#ag-wb .wb-hero{padding:36px 34px 32px}#ag-wb .wb-hero .wb-h1{font-size:40px}#ag-wb .wb-steps{grid-template-columns:repeat(2,1fr)}#ag-wb .wb-bpgrid,#ag-wb .wb-two,#ag-wb .wb-vs,#ag-wb .wb-grid2,#ag-wb .wb-pager{grid-template-columns:repeat(2,1fr)}#ag-wb .wb-pager a.is-next{grid-column:2}#ag-wb .wb-section{padding:24px}#ag-wb .wb-statrow{grid-template-columns:repeat(4,1fr)}#ag-wb .wb-cohorts{grid-template-columns:repeat(2,1fr)}}@media (min-width:900px){#ag-wb .wb-grid3{grid-template-columns:1.1fr 1.3fr 1fr}#ag-wb .wb-person{grid-template-columns:1.3fr auto 1.2fr;grid-template-areas:\"main pin prog\" \"meta meta meta\" \"act act act\" \"edit edit edit\";align-items:center;column-gap:22px}#ag-wb .wb-person-main{grid-area:main;min-width:0}#ag-wb .wb-person-pin{grid-area:pin}#ag-wb .wb-person-prog{grid-area:prog}#ag-wb .wb-person-meta{grid-area:meta}#ag-wb .wb-person-actions{grid-area:act}#ag-wb [data-edit-slot]{grid-area:edit}}@media (max-width:639px){#ag-wb .wb-toast{bottom:68px}}@media (max-width:420px){#ag-wb{border-radius:18px;padding:22px 16px 32px}#ag-wb .wb-h1{font-size:34px}#ag-wb .wb-tool{padding:0 12px;font-size:13px}}@media print{#ag-wb .wb-save,#ag-wb .wb-toast,#ag-wb .wb-layer{display:none}}@media (prefers-reduced-motion:reduce){#ag-wb *,#ag-wb *::before,#ag-wb *::after{animation:none!important;transition:none!important}}";

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.AG_WB = { version: '1.0', mount: mount };
})();
