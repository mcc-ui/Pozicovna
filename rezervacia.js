/* ============================================================
   JERICHO:BIKE — Rezervačný systém
   Vložte do Shoptet > Nastavenia > Vlastné skripty > pred </body>
   na stránke /pozicovna/ alebo kde chcete zobraziť widget
   ============================================================ */
(function() {
  'use strict';

  const API = 'https://script.google.com/macros/s/AKfycbwCS6E8GhIDKL5O1jEJbTbJuNX1IWBBzg69aI5HtGzsZJ_gqR2LYZaxqxYbS9Zklyqb/exec';
  const ADMIN_HASH = '#admin-jericho';
  const ADMIN_PASS = 'admin123';

  // ── Spusti len na požičovňa stránke ─────────────────────────────
  const isRezervaciaPage = window.location.pathname.includes('pozicovna') ||
                           window.location.pathname.includes('test');
  if (!isRezervaciaPage) return;

  // ── Stav ────────────────────────────────────────────────────────
  let state = {
    bikes: [], reservations: [], pricing: [], documents: {},
    loading: true, error: null
  };

  // ── Pomocné funkcie ──────────────────────────────────────────────
  function ymd(d) {
    const dt = d instanceof Date ? d : new Date(d + 'T12:00:00');
    return dt.toISOString().slice(0, 10);
  }
  function today() { return ymd(new Date()); }
  function fmtSK(d) {
    if (!d) return '';
    return new Date(d + 'T12:00:00').toLocaleDateString('sk-SK', {day:'2-digit',month:'2-digit',year:'numeric'});
  }
  function datesInRange(from, to) {
    const dates = [], end = new Date(to + 'T12:00:00');
    let cur = new Date(from + 'T12:00:00');
    while (cur <= end) { dates.push(ymd(cur)); cur.setDate(cur.getDate()+1); }
    return dates;
  }
  function getBusyBikes(dateStr, excludeId) {
    const busy = new Set();
    state.reservations.forEach(r => {
      if (excludeId && r.id == excludeId) return;
      if (datesInRange(r.from, r.to).includes(dateStr)) r.bikeIds.forEach(id => busy.add(id));
    });
    return busy;
  }
  function getPricePerDay(bikeId, days) {
    const bike = state.bikes.find(b => b.id === bikeId);
    const tiers = (bike && bike.pricing && bike.pricing.length) ? bike.pricing : state.pricing;
    for (const t of tiers) if (days >= t.minDays && days <= t.maxDays) return t.pricePerDay;
    return tiers.length ? tiers[tiers.length-1].pricePerDay : 0;
  }
  function getMinPrice(bikeId) {
    const bike = state.bikes.find(b => b.id === bikeId);
    const tiers = (bike && bike.pricing && bike.pricing.length) ? bike.pricing : state.pricing;
    return tiers.length ? Math.min(...tiers.map(t => t.pricePerDay)) : 0;
  }
  function calcTotal(bikeIds, from, to) {
    if (!bikeIds.length || !from || !to) return {total:0, days:0};
    // OD=DO = 1 deň, OD 25 DO 26 = 2 dni
    const days = Math.round((new Date(to+'T12:00:00') - new Date(from+'T12:00:00')) / 86400000) + 1;
    if (days <= 0) return {total:0, days:0};
    const total = bikeIds.reduce((sum, id) => sum + getPricePerDay(id, days) * days, 0);
    return {total, days};
  }

  // ── API volanie ──────────────────────────────────────────────────
  async function apiCall(action, data = {}) {
    const payload = encodeURIComponent(JSON.stringify({action, ...data}));
    const r = await fetch(API + '?payload=' + payload);
    const json = await r.json();
    if (!json.ok) throw new Error(json.error || 'Chyba');
    return json.data;
  }

  async function loadData() {
    try {
      const data = await apiCall('getAll');
      state.bikes = data.bikes || [];
      state.pricing = data.pricing || [];
      state.reservations = (data.reservations || []).map(r => ({
        ...r,
        bikeIds: Array.isArray(r.bikeIds) ? r.bikeIds : (r.bikeIds ? String(r.bikeIds).split(',').map(Number) : [])
      }));
      state.documents = data.documents || {};
      state.loading = false;
      render();
    } catch(e) {
      state.error = e.message;
      state.loading = false;
      render();
    }
  }

  // ── CSS ──────────────────────────────────────────────────────────
  const CSS = `
  #jb-rez { font-family: inherit; color: #111; font-size: 16px !important; }
  #jb-rez * { box-sizing: border-box; }
  #jb-rez a { color: inherit; }

  /* Kalendár */
  .jb-cal-wrap { background:#fff; border:1px solid #e5e5e5; border-radius:12px; padding:20px; margin-bottom:24px; }
  .jb-cal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .jb-cal-title { font-size:1.25rem; font-weight:700; }
  .jb-cal-nav { display:flex; gap:6px; }
  .jb-cal-nav button { width:32px; height:32px; border:1px solid #e5e5e5; border-radius:6px; background:#fff; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center; transition:.15s; }
  .jb-cal-nav button:hover { border-color:#cd433d; color:#cd433d; }
  .jb-cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:3px; }
  .jb-cal-dow { text-align:center; font-size:.8rem; font-weight:700; color:#777; text-transform:uppercase; padding:8px 0 10px; }
  .jb-cal-day { border-radius:8px; padding:10px 4px; text-align:center; border:1px solid transparent; min-height:80px; display:flex; flex-direction:column; align-items:center; gap:5px; cursor:pointer; transition:.15s; background:#fff; }
  .jb-cal-day:hover:not(.jb-past):not(.jb-empty) { border-color:#cd433d; background:#fff5f5; }
  .jb-cal-day.jb-today { background:#fff5f5; border-color:#cd433d; }
  .jb-cal-day.jb-past { opacity:.3; cursor:default; pointer-events:none; }
  .jb-cal-day.jb-empty { cursor:default; pointer-events:none; }
  .jb-cal-day .jb-dn { font-size:1.15rem; font-weight:700; color:#111; line-height:1; }
  .jb-dots { display:flex; gap:3px; justify-content:center; }
  .jb-dot-g { width:9px; height:9px; border-radius:50%; background:#22c55e; }
  .jb-dot-r { width:9px; height:9px; border-radius:50%; background:#ef4444; }
  .jb-legend { display:flex; gap:16px; margin-top:14px; font-size:14px; color:#555; }
  .jb-legend-item { display:flex; align-items:center; gap:5px; }

  /* Modal overlay */
  .jb-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:99999; overflow-y:auto; padding:24px 16px; }
  .jb-overlay.open { display:flex; align-items:flex-start; justify-content:center; }
  .jb-modal { background:#fff; border-radius:14px; padding:32px 36px; max-width:760px; width:100%; position:relative; box-shadow:0 20px 60px rgba(0,0,0,.2); animation:jbSlide .2s ease; margin:auto; }
  @keyframes jbSlide { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .jb-modal-close { position:absolute; top:14px; right:14px; width:30px; height:30px; border-radius:6px; border:1px solid #e5e5e5; background:#fff; cursor:pointer; font-size:1rem; display:flex; align-items:center; justify-content:center; color:#777; transition:.15s; }
  .jb-modal-close:hover { background:#111; color:#fff; }
  .jb-modal-title { font-size:22px; font-weight:700; margin-bottom:6px; }
  .jb-modal-sub { font-size:15px; color:#666; margin-bottom:20px; }

  /* Bicykle výber */
  .jb-bikes-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:18px; }
  @media(max-width:500px) { .jb-bikes-grid { grid-template-columns:1fr; } }
  .jb-bike-card { border:1px solid #e5e5e5; border-radius:10px; padding:12px; cursor:pointer; transition:.15s; position:relative; background:#fff; }
  .jb-bike-card:hover { border-color:#cd433d; }
  .jb-bike-card.sel { border-color:#cd433d; border-width:2px; background:#fff5f5; }
  .jb-bike-card.unavail { opacity:.35; cursor:not-allowed; pointer-events:none; }
  .jb-bike-card img { width:100%; height:110px; object-fit:contain; border-radius:6px; margin-bottom:8px; background:#f8f8f8; padding:4px; }
  .jb-bike-ph { width:100%; height:110px; border-radius:6px; margin-bottom:8px; background:#f5f5f5; display:flex; align-items:center; justify-content:center; font-size:1.8rem; }
  .jb-bike-name { font-size:15px; font-weight:700; color:#111; margin-bottom:3px; }
  .jb-bike-size { font-size:13px; color:#666; margin-bottom:4px; }
  .jb-bike-price { font-size:14px; font-weight:700; color:#cd433d; }
  .jb-bike-check { position:absolute; top:8px; right:8px; width:20px; height:20px; border-radius:50%; background:#cd433d; color:#fff; display:none; align-items:center; justify-content:center; font-size:.7rem; }
  .jb-bike-card.sel .jb-bike-check { display:flex; }

  /* Formulár */
  .jb-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; }
  @media(max-width:480px) { .jb-form-row { grid-template-columns:1fr; } }
  .jb-fg { display:flex; flex-direction:column; gap:4px; }
  .jb-fg label { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.3px; color:#222; }
  .jb-fg input { padding:11px 14px; border:1px solid #e5e5e5; border-radius:8px; font-size:15px; font-family:inherit; color:#111; background:#fff; outline:none; transition:.15s; width:100%; }
  .jb-fg input:focus { border-color:#cd433d; box-shadow:0 0 0 2px rgba(205,67,61,.1); }
  .jb-price-box { background:#111; color:#fff; border-radius:10px; padding:14px 18px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; }
  .jb-price-total { font-size:32px; font-weight:700; }
  .jb-price-detail { font-size:13px; color:rgba(255,255,255,.6); margin-top:2px; }
  .jb-doc-links { display:flex; flex-direction:column; gap:5px; margin-bottom:14px; }
  .jb-doc-link { font-size:14px; color:#cd433d; background:none; border:none; padding:0; cursor:pointer; text-decoration:underline; text-align:left; }
  .jb-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:4px; }
  .jb-btn { display:inline-flex; align-items:center; gap:5px; padding:10px 20px; border-radius:8px; border:none; cursor:pointer; font-family:inherit; font-size:15px; font-weight:600; transition:.15s; text-decoration:none; }
  .jb-btn-primary { background:#cd433d; color:#fff; }
  .jb-btn-primary:hover { background:#a8332e; }
  .jb-btn-primary:disabled { opacity:.55; cursor:not-allowed; }
  .jb-btn-ghost { background:#fff; color:#555; border:1px solid #e5e5e5; }
  .jb-btn-ghost:hover { border-color:#cd433d; color:#cd433d; }

  /* Ďakovná strana */
  .jb-ty { text-align:center; padding:20px 0; }
  .jb-ty-icon { width:72px; height:72px; background:#22c55e; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 20px; }
  .jb-ty h2 { font-size:28px; font-weight:700; margin-bottom:10px; color:#111; }
  .jb-ty p { color:#555; font-size:16px; line-height:1.7; margin-bottom:24px; }
  .jb-ty-details { background:#f9f9f9; border-radius:10px; padding:18px; text-align:left; margin-bottom:24px; }
  .jb-ty-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #e5e5e5; font-size:15px; }
  .jb-ty-row:last-child { border:none; }
  .jb-ty-row .k { color:#777; }
  .jb-ty-row .v { font-weight:600; color:#111; }

  /* Admin */
  .jb-admin-wrap { display:flex; min-height:400px; }
  .jb-admin-sidebar { width:180px; background:#111; border-radius:10px 0 0 10px; padding:16px 10px; flex-shrink:0; }
  .jb-admin-menu-item { padding:8px 10px; border-radius:6px; cursor:pointer; font-size:.84rem; color:rgba(255,255,255,.65); margin-bottom:2px; transition:.15s; }
  .jb-admin-menu-item:hover { background:rgba(255,255,255,.08); color:#fff; }
  .jb-admin-menu-item.active { background:#cd433d; color:#fff; }
  .jb-admin-content { flex:1; padding:20px; background:#f9f9f9; border-radius:0 10px 10px 0; overflow:auto; }
  .jb-table { width:100%; border-collapse:collapse; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 1px 4px rgba(0,0,0,.08); font-size:.82rem; }
  .jb-table th { background:#111; color:rgba(255,255,255,.8); padding:10px 12px; text-align:left; font-size:.7rem; text-transform:uppercase; letter-spacing:.5px; }
  .jb-table td { padding:10px 12px; border-bottom:1px solid #f0f0f0; vertical-align:middle; }
  .jb-table tr:last-child td { border:none; }
  .jb-table tr:hover td { background:#fafafa; }

  /* Loading / Error */
  .jb-loading { text-align:center; padding:40px; color:#777; font-size:.9rem; }
  .jb-spinner { width:28px; height:28px; border:2px solid #e5e5e5; border-top-color:#cd433d; border-radius:50%; animation:jbSpin .7s linear infinite; margin:0 auto 12px; }
  @keyframes jbSpin { to{transform:rotate(360deg)} }

  /* Dokument modal */
  .jb-doc-content { max-height:55vh; overflow-y:auto; padding-right:6px; font-size:16px; line-height:1.8; color:#222; }
.jb-pricing-tiers { margin-top:8px; border-top:1px solid #f0f0f0; padding-top:7px; display:flex; flex-direction:column; gap:3px; }
.jb-price-tier { display:flex; justify-content:space-between; align-items:center; font-size:12px; color:#555; padding:2px 0; }
.jb-pt-label { color:#777; }
.jb-pt-price { font-weight:600; color:#111; }
  .jb-doc-content h4 { font-size:18px; font-weight:700; margin:14px 0 6px; color:#111; }
  `;

  // ── Injekt CSS ────────────────────────────────────────────────────
  if (!document.getElementById('jb-styles')) {
    const s = document.createElement('style');
    s.id = 'jb-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ── Nájdi alebo vytvor kontajner ─────────────────────────────────
  let container = document.getElementById('jb-rez');
  if (!container) {
    // Skús nájsť vhodné miesto na stránke
    const mainContent = document.querySelector('.page-content, main, .content, #content, article');
    if (!mainContent) return;
    container = document.createElement('div');
    container.id = 'jb-rez';
    mainContent.appendChild(container);
  }

  // ── STAV WIDGETU ─────────────────────────────────────────────────
  let calYear = new Date().getFullYear();
  let calMonth = new Date().getMonth();
  let selectedBikeIds = [];
  let resFrom = '';
  let resTo = '';
  let editResId = null;
  let adminPanel = 'reservations';
  let adminLoggedIn = sessionStorage.getItem('jb_admin') === '1';

  const MONTHS = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
  const DAYS = ['Po','Ut','St','Št','Pi','So','Ne'];

  // ── RENDER hlavný ─────────────────────────────────────────────────
  function render() {
    if (state.loading) {
      container.innerHTML = `<div class="jb-loading"><div class="jb-spinner"></div>Načítavam...</div>`;
      return;
    }
    if (state.error) {
      container.innerHTML = `<div class="jb-loading" style="color:#cd433d">⚠️ Chyba spojenia: ${state.error}</div>`;
      return;
    }
    container.innerHTML = renderCalendar() + renderOverlays();
    bindEvents();
    checkAdminBtn();
  }

  // ── KALENDÁR ─────────────────────────────────────────────────────
  function renderCalendar() {
    const firstDay = new Date(calYear, calMonth, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
    const todayStr = today();

    let days = DAYS.map(d => `<div class="jb-cal-dow">${d}</div>`).join('');

    for (let i = 0; i < offset; i++) days += `<div class="jb-cal-day jb-empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const isPast = dStr < todayStr;
      const busy = getBusyBikes(dStr);
      const dots = state.bikes.map(b =>
        `<div class="${busy.has(b.id) ? 'jb-dot-r' : 'jb-dot-g'}" title="${b.name}"></div>`
      ).join('');
      const cls = ['jb-cal-day', isPast ? 'jb-past' : '', dStr === todayStr ? 'jb-today' : ''].filter(Boolean).join(' ');
      days += `<div class="${cls}" data-date="${dStr}"><div class="jb-dn">${d}</div><div class="jb-dots">${dots}</div></div>`;
    }

    const adminBtn = `<button id="jb-admin-btn" style="display:none;float:right" class="jb-btn jb-btn-primary" onclick="window._jbAdmin()">Admin</button>`;

    return `
    <div style="clear:both">${adminBtn}</div>
    <div class="jb-cal-wrap">
      <div class="jb-cal-header">
        <div class="jb-cal-title">${MONTHS[calMonth]} ${calYear}</div>
        <div class="jb-cal-nav">
          <button id="jb-prev">‹</button>
          <button id="jb-next">›</button>
        </div>
      </div>
      <div class="jb-cal-grid">${days}</div>
      <div class="jb-legend">
        <div class="jb-legend-item"><div class="jb-dot-g"></div> K dispozícii</div>
        <div class="jb-legend-item"><div class="jb-dot-r"></div> Obsadené</div>
      </div>
    </div>`;
  }

  // ── OVERLAY HTML ─────────────────────────────────────────────────
  function renderOverlays() {
    return `
    <!-- Rezervačný formulár -->
    <div class="jb-overlay" id="jb-res-modal">
      <div class="jb-modal">
        <button class="jb-modal-close" id="jb-res-close">✕</button>
        <div class="jb-modal-title">Rezervácia bicykla</div>
        <div class="jb-modal-sub" id="jb-res-sub"></div>
        <div class="jb-bikes-grid" id="jb-bikes-grid"></div>
        <div class="jb-form-row">
          <div class="jb-fg"><label>Dátum OD</label><input type="date" id="jb-from"></div>
          <div class="jb-fg"><label>Dátum DO</label><input type="date" id="jb-to"></div>
        </div>
        <div class="jb-price-box" id="jb-price-box">
          <div><div style="font-size:.8rem;color:rgba(255,255,255,.55)">Celková cena</div><div class="jb-price-detail" id="jb-price-detail">Vyberte bicykel a termín</div></div>
          <div class="jb-price-total" id="jb-price-total">0 €</div>
        </div>
        <div class="jb-form-row">
          <div class="jb-fg"><label>Meno</label><input type="text" id="jb-name" placeholder="Meno"></div>
          <div class="jb-fg"><label>Priezvisko</label><input type="text" id="jb-surname" placeholder="Priezvisko"></div>
        </div>
        <div class="jb-form-row">
          <div class="jb-fg"><label>Telefón</label><input type="tel" id="jb-phone" placeholder="+421..."></div>
          <div class="jb-fg"><label>E-mail</label><input type="email" id="jb-email" placeholder="vas@email.sk"></div>
        </div>
        <div class="jb-doc-links">
          <button class="jb-doc-link" data-doc="conditions">ℹ️ Čo by ste mali vedieť pred požičaním</button>
          <button class="jb-doc-link" data-doc="contract">📄 Zmluva o vypožičaní bicykla</button>
          <button class="jb-doc-link" data-doc="gdpr">🔒 Ochrana osobných údajov</button>
        </div>
        <div class="jb-actions">
          <button class="jb-btn jb-btn-ghost" id="jb-res-cancel">Zrušiť</button>
          <button class="jb-btn jb-btn-primary" id="jb-res-submit">Odoslať rezerváciu →</button>
        </div>
      </div>
    </div>

    <!-- Ďakovná strana -->
    <div class="jb-overlay" id="jb-ty-modal">
      <div class="jb-modal">
        <div class="jb-ty">
          <div class="jb-ty-icon">✓</div>
          <h2>🎉 Rezervácia bola prijatá!</h2>
          <p>Ďakujeme! Vašu rezerváciu sme úspešne zaznamenali. Čoskoro vás budeme kontaktovať na zadanom telefóne alebo e-maile a potvrdíme vám termín.</p>
          <div class="jb-ty-details" id="jb-ty-details"></div>
          <button class="jb-btn jb-btn-primary" id="jb-ty-close" style="font-size:15px;padding:12px 24px">← Späť na kalendár</button>
        </div>
      </div>
    </div>

    <!-- Dokument modal -->
    <div class="jb-overlay" id="jb-doc-modal">
      <div class="jb-modal">
        <button class="jb-modal-close" id="jb-doc-close">✕</button>
        <div class="jb-modal-title" id="jb-doc-title"></div>
        <div class="jb-doc-content" id="jb-doc-content"></div>
        <div style="margin-top:16px;text-align:right">
          <button class="jb-btn jb-btn-ghost" id="jb-doc-ok" style="font-size:15px;padding:10px 20px">Rozumiem</button>
        </div>
      </div>
    </div>

    <!-- Admin login -->
    <div class="jb-overlay" id="jb-admin-login-modal">
      <div class="jb-modal" style="max-width:380px">
        <button class="jb-modal-close" id="jb-admin-login-close">✕</button>
        <div style="text-align:center;padding:10px 0">
          <div style="font-size:2rem;margin-bottom:8px">🔐</div>
          <div class="jb-modal-title">Admin prístup</div>
          <div style="display:flex;flex-direction:column;gap:12px;margin-top:16px">
            <div class="jb-fg"><label>Heslo</label><input type="password" id="jb-admin-pass" placeholder="Heslo"></div>
            <div id="jb-admin-err" style="color:#cd433d;font-size:.82rem;display:none">Nesprávne heslo.</div>
            <button class="jb-btn jb-btn-primary" id="jb-admin-login-btn" style="justify-content:center">Prihlásiť sa</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin panel -->
    <div class="jb-overlay" id="jb-admin-modal">
      <div class="jb-modal" style="max-width:900px;padding:0;overflow:hidden">
        <button class="jb-modal-close" style="z-index:1" id="jb-admin-close">✕</button>
        <div class="jb-admin-wrap">
          <div class="jb-admin-sidebar">
            <div style="font-size:.7rem;color:rgba(255,255,255,.35);text-transform:uppercase;letter-spacing:1px;padding:0 4px 8px">Menu</div>
            <div class="jb-admin-menu-item ${adminPanel==='reservations'?'active':''}" data-panel="reservations">📋 Rezervácie</div>
            <div class="jb-admin-menu-item ${adminPanel==='bikes'?'active':''}" data-panel="bikes">🚲 Bicykle</div>
            <div class="jb-admin-menu-item ${adminPanel==='pricing'?'active':''}" data-panel="pricing">💰 Cenník</div>
            <div class="jb-admin-menu-item" id="jb-admin-logout">🚪 Odhlásiť</div>
          </div>
          <div class="jb-admin-content" id="jb-admin-content">
            ${renderAdminPanel()}
          </div>
        </div>
      </div>
    </div>`;
  }

  // ── ADMIN PANELY ─────────────────────────────────────────────────
  function renderAdminPanel() {
    if (adminPanel === 'reservations') return renderAdminReservations();
    if (adminPanel === 'bikes') return renderAdminBikes();
    if (adminPanel === 'pricing') return renderAdminPricing();
    return '';
  }

  function renderAdminReservations() {
    const rows = state.reservations.length ? state.reservations
      .sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
      .map((r,i) => {
        const names = (r.bikeIds||[]).map(id => state.bikes.find(b=>b.id===id)?.name||id).join(', ');
        return `<tr>
          <td><strong>${r.name} ${r.surname}</strong><br><span style="color:#777;font-size:.75rem">${r.phone||''} ${r.email||''}</span></td>
          <td style="font-size:.8rem">${names}</td>
          <td style="font-size:.8rem">${fmtSK(r.from)} – ${fmtSK(r.to)}</td>
          <td><strong>${r.total} €</strong></td>
          <td>
            <button class="jb-btn jb-btn-ghost" style="padding:4px 8px;font-size:.75rem" data-edit-res="${r.id}">✏️</button>
            <button class="jb-btn" style="padding:4px 8px;font-size:.75rem;background:#ef4444;color:#fff" data-del-res="${r.id}">🗑</button>
          </td>
        </tr>`;
      }).join('') : `<tr><td colspan="5" style="text-align:center;color:#999;padding:24px">Žiadne rezervácie</td></tr>`;

    return `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="font-size:1.1rem;font-weight:700">Rezervácie</div>
      <button class="jb-btn jb-btn-primary" style="font-size:.78rem" id="jb-add-res-btn">+ Pridať</button>
    </div>
    <table class="jb-table">
      <thead><tr><th>Zákazník</th><th>Bicykle</th><th>Termín</th><th>Cena</th><th>Akcie</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  function renderAdminBikes() {
    return `
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:14px">Bicykle</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
      ${state.bikes.map(b => `
      <div style="background:#fff;border:1px solid #e5e5e5;border-radius:10px;overflow:hidden">
        ${b.image ? `<img src="${b.image}" style="width:100%;height:120px;object-fit:cover">` : `<div style="width:100%;height:120px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:2.5rem">${b.emoji||'🚲'}</div>`}
        <div style="padding:14px">
          <div style="font-weight:700;margin-bottom:3px">${b.name}</div>
          <div style="font-size:.78rem;color:#777;margin-bottom:10px">Veľkosť: ${b.size}<br>od ${getMinPrice(b.id)} €/deň</div>
          <button class="jb-btn jb-btn-ghost" style="font-size:.75rem;padding:5px 10px;width:100%" data-edit-bike="${b.id}">✏️ Upraviť</button>
        </div>
      </div>`).join('')}
    </div>`;
  }

  function renderAdminPricing() {
    const tiers = state.pricing;
    return `
    <div style="font-size:1.1rem;font-weight:700;margin-bottom:14px">Globálny cenník (fallback)</div>
    <div style="background:#fff;border:1px solid #e5e5e5;border-radius:10px;padding:16px;max-width:420px">
      ${tiers.map((t,i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0f0f0">
        <span style="font-size:.85rem">${t.label}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <input type="number" value="${t.pricePerDay}" min="0" style="width:70px;padding:5px 8px;border:1px solid #e5e5e5;border-radius:6px;font-size:.84rem" data-tier="${i}">
          <span style="font-size:.78rem;color:#777">€/deň</span>
        </div>
      </div>`).join('')}
      <button class="jb-btn jb-btn-primary" id="jb-save-pricing" style="margin-top:14px;font-size:.82rem">💾 Uložiť cenník</button>
    </div>`;
  }

  // ── BIKES GRID v formulári ────────────────────────────────────────
  function renderBikesGrid() {
    const grid = document.getElementById('jb-bikes-grid');
    if (!grid) return;
    const from = document.getElementById('jb-from')?.value || resFrom;
    const to = document.getElementById('jb-to')?.value || resTo;

    const busyInRange = new Set();
    if (from) {
      const eTo = (to && to >= from) ? to : from;
      datesInRange(from, eTo).forEach(d => getBusyBikes(d, editResId).forEach(id => busyInRange.add(id)));
    }

    grid.innerHTML = state.bikes.map(b => {
      const unavail = busyInRange.has(b.id) && !selectedBikeIds.includes(b.id);
      const sel = selectedBikeIds.includes(b.id);
      const img = b.image ? `<img src="${b.image}" alt="${b.name}">` : `<div class="jb-bike-ph">${b.emoji||'🚲'}</div>`;
      const tiers = (b.pricing && b.pricing.length) ? b.pricing : state.pricing;
      const pricingHtml = tiers.map(t =>
        `<div class="jb-price-tier"><span class="jb-pt-label">${t.label}</span><span class="jb-pt-price">${t.pricePerDay} €/deň</span></div>`
      ).join('');
      return `<div class="jb-bike-card ${sel?'sel':''} ${unavail?'unavail':''}" data-bike="${b.id}">
        ${img}
        <div class="jb-bike-name">${b.name}</div>
        <div class="jb-bike-size">Veľkosť: ${b.size}</div>
        <div class="jb-pricing-tiers">${pricingHtml}</div>
        <div class="jb-bike-check">✓</div>
      </div>`;
    }).join('');
  }

  function recalcPrice() {
    const from = document.getElementById('jb-from')?.value;
    const to = document.getElementById('jb-to')?.value;
    const {total, days} = calcTotal(selectedBikeIds, from, to);
    const el = document.getElementById('jb-price-total');
    const det = document.getElementById('jb-price-detail');
    if (el) el.textContent = total > 0 ? total + ' €' : '0 €';
    if (det) det.textContent = total > 0 ? `${days} dní × ${selectedBikeIds.length} bicykel = ${total} €` : 'Vyberte bicykel a termín';
  }

  // ── BIND EVENTS ───────────────────────────────────────────────────
  function bindEvents() {
    // Navigácia kalendára
    document.getElementById('jb-prev')?.addEventListener('click', () => {
      calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; }
      render();
    });
    document.getElementById('jb-next')?.addEventListener('click', () => {
      calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; }
      render();
    });

    // Klik na deň
    container.querySelectorAll('.jb-cal-day:not(.jb-past):not(.jb-empty)').forEach(el => {
      el.addEventListener('click', () => openResModal(el.dataset.date));
    });

    // Overlay zatvorenie
    document.getElementById('jb-res-close')?.addEventListener('click', () => closeModal('jb-res-modal'));
    document.getElementById('jb-res-cancel')?.addEventListener('click', () => closeModal('jb-res-modal'));
    document.getElementById('jb-ty-close')?.addEventListener('click', () => { closeModal('jb-ty-modal'); render(); });
    document.getElementById('jb-doc-close')?.addEventListener('click', () => closeModal('jb-doc-modal'));
    document.getElementById('jb-doc-ok')?.addEventListener('click', () => closeModal('jb-doc-modal'));
    document.getElementById('jb-admin-login-close')?.addEventListener('click', () => closeModal('jb-admin-login-modal'));
    document.getElementById('jb-admin-close')?.addEventListener('click', () => closeModal('jb-admin-modal'));
    document.getElementById('jb-admin-logout')?.addEventListener('click', () => {
      sessionStorage.removeItem('jb_admin'); adminLoggedIn = false;
      closeModal('jb-admin-modal'); render();
    });

    // Rezervačný formulár — date zmena
    document.getElementById('jb-from')?.addEventListener('change', () => {
      const f = document.getElementById('jb-from').value;
      const toEl = document.getElementById('jb-to');
      if (toEl) { toEl.min = f; if (toEl.value && toEl.value < f) toEl.value = ''; }
      renderBikesGrid(); recalcPrice();
    });
    document.getElementById('jb-to')?.addEventListener('change', () => { renderBikesGrid(); recalcPrice(); });

    // Výber bicykla
    document.getElementById('jb-bikes-grid')?.addEventListener('click', e => {
      const card = e.target.closest('.jb-bike-card');
      if (!card) return;
      const id = Number(card.dataset.bike);
      const idx = selectedBikeIds.indexOf(id);
      if (idx >= 0) selectedBikeIds.splice(idx, 1); else selectedBikeIds.push(id);
      renderBikesGrid(); recalcPrice();
    });

    // Odoslanie rezervácie
    document.getElementById('jb-res-submit')?.addEventListener('click', submitReservation);

    // Dokumenty
    document.querySelectorAll('.jb-doc-link').forEach(btn => {
      btn.addEventListener('click', () => openDoc(btn.dataset.doc));
    });

    // Admin
    document.getElementById('jb-admin-login-btn')?.addEventListener('click', adminLogin);
    document.getElementById('jb-admin-pass')?.addEventListener('keydown', e => { if (e.key === 'Enter') adminLogin(); });

    // Admin menu
    document.querySelectorAll('[data-panel]').forEach(el => {
      el.addEventListener('click', () => {
        adminPanel = el.dataset.panel;
        document.getElementById('jb-admin-content').innerHTML = renderAdminPanel();
        document.querySelectorAll('.jb-admin-menu-item').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
        bindAdminEvents();
      });
    });
    bindAdminEvents();

    // Admin btn
    window._jbAdmin = () => {
      if (adminLoggedIn) { openModal('jb-admin-modal'); }
      else { openModal('jb-admin-login-modal'); }
    };
  }

  function bindAdminEvents() {
    // Vymazanie rezervácie
    document.querySelectorAll('[data-del-res]').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Vymazať rezerváciu?')) return;
        btn.disabled = true;
        try {
          await apiCall('deleteReservation', { id: btn.dataset.delRes });
          state.reservations = state.reservations.filter(r => r.id != btn.dataset.delRes);
          document.getElementById('jb-admin-content').innerHTML = renderAdminPanel();
          bindAdminEvents();
        } catch(e) { alert('Chyba: ' + e.message); }
      });
    });

    // Editácia rezervácie
    document.querySelectorAll('[data-edit-res]').forEach(btn => {
      btn.addEventListener('click', () => {
        const r = state.reservations.find(x => x.id == btn.dataset.editRes);
        if (r) openResModal(r.from, r);
      });
    });

    // Editácia bicykla
    document.querySelectorAll('[data-edit-bike]').forEach(btn => {
      btn.addEventListener('click', () => openEditBike(Number(btn.dataset.editBike)));
    });

    // Uloženie cenníka
    document.getElementById('jb-save-pricing')?.addEventListener('click', async () => {
      const inputs = document.querySelectorAll('[data-tier]');
      inputs.forEach(inp => {
        const i = Number(inp.dataset.tier);
        if (state.pricing[i]) state.pricing[i].pricePerDay = parseFloat(inp.value) || 0;
      });
      const btn = document.getElementById('jb-save-pricing');
      btn.disabled = true; btn.textContent = 'Ukladám...';
      try {
        await apiCall('updatePricing', { pricing: state.pricing });
        alert('Cenník uložený!');
      } catch(e) { alert('Chyba: ' + e.message); }
      btn.disabled = false; btn.textContent = '💾 Uložiť cenník';
    });

    // Pridať rezerváciu
    document.getElementById('jb-add-res-btn')?.addEventListener('click', () => {
      closeModal('jb-admin-modal');
      openResModal(today(), null, true);
    });
  }

  // ── MODÁLY ────────────────────────────────────────────────────────
  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function openResModal(dateStr, existingRes, fromAdmin) {
    selectedBikeIds = existingRes ? [...(existingRes.bikeIds||[])] : [];
    editResId = existingRes ? existingRes.id : null;
    resFrom = dateStr || today();
    resTo = existingRes ? existingRes.to : '';

    const sub = document.getElementById('jb-res-sub');
    if (sub) sub.textContent = existingRes ? `Editácia rezervácie` : `Vybratý dátum: ${fmtSK(dateStr)}`;

    const fromEl = document.getElementById('jb-from');
    const toEl = document.getElementById('jb-to');
    if (fromEl) { fromEl.value = resFrom; fromEl.min = today(); }
    if (toEl) { toEl.value = resTo; toEl.min = resFrom; }

    // Vyplň kontaktné údaje ak editujeme
    ['name','surname','phone','email'].forEach(f => {
      const el = document.getElementById('jb-' + f);
      if (el) el.value = existingRes ? (existingRes[f]||'') : '';
    });

    renderBikesGrid();
    recalcPrice();
    openModal('jb-res-modal');
  }

  function openDoc(key) {
    const defaults = {
      conditions: { title: 'Čo by ste mali vedieť', content: '<h4>Prevzatie bicykla</h4><p>Zákazník je povinný skontrolovať stav bicykla pri prevzatí.</p><h4>Zodpovednosť</h4><p>Nájomca zodpovedá za bicykel počas prenájmu.</p><h4>Vrátenie</h4><p>Bicykel musí byť vrátený v dohodnutom termíne.</p>' },
      contract: { title: 'Zmluva o vypožičaní', content: '<h4>Predmet</h4><p>Prenajímateľ odovzdáva bicykel do dočasného užívania.</p><h4>Zodpovednosť</h4><p>Nájomca preberá plnú zodpovednosť.</p>' },
      gdpr: { title: 'Ochrana osobných údajov', content: '<h4>Účel</h4><p>Údaje spracúvame výlučne za účelom vybavenia rezervácie.</p>' }
    };
    const doc = state.documents[key] || defaults[key] || { title: key, content: '' };
    const t = document.getElementById('jb-doc-title');
    const c = document.getElementById('jb-doc-content');
    if (t) t.textContent = doc.title;
    if (c) c.innerHTML = doc.content;
    openModal('jb-doc-modal');
  }

  function openEditBike(bikeId) {
    const b = state.bikes.find(x => x.id === bikeId);
    if (!b) return;

    // Vytvor inline edit formulár
    const tiers = (b.pricing && b.pricing.length) ? b.pricing : state.pricing;
    const pricingRows = tiers.map((t, i) => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid #f0f0f0">
        <span style="font-size:.82rem">${t.label}</span>
        <div style="display:flex;gap:5px;align-items:center">
          <input type="number" value="${t.pricePerDay}" min="0" style="width:65px;padding:4px 8px;border:1px solid #e5e5e5;border-radius:5px;font-size:.82rem" class="jb-bike-tier" data-ti="${i}">
          <span style="font-size:.75rem;color:#777">€/deň</span>
        </div>
      </div>`).join('');

    // Zobraz ako modal
    const overlay = document.createElement('div');
    overlay.className = 'jb-overlay open';
    overlay.innerHTML = `
      <div class="jb-modal" style="max-width:500px">
        <button class="jb-modal-close" id="jb-eb-close">✕</button>
        <div class="jb-modal-title">Upraviť: ${b.name}</div>
        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px">
          <div class="jb-fg"><label>Názov</label><input type="text" id="jb-eb-name" value="${b.name}"></div>
          <div class="jb-fg"><label>Veľkosť</label><input type="text" id="jb-eb-size" value="${b.size}"></div>
          <div class="jb-fg"><label>URL fotografie</label><input type="text" id="jb-eb-image" value="${b.image||''}" placeholder="https://..."></div>
          <div class="jb-fg"><label>Emoji</label><input type="text" id="jb-eb-emoji" value="${b.emoji||'🚲'}"></div>
        </div>
        <div style="font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.3px;margin-bottom:8px">Cenník tohto bicykla</div>
        <div style="background:#f9f9f9;border-radius:8px;padding:10px 14px;margin-bottom:14px">${pricingRows}</div>
        <div class="jb-actions">
          <button class="jb-btn jb-btn-ghost" id="jb-eb-cancel">Zrušiť</button>
          <button class="jb-btn jb-btn-primary" id="jb-eb-save">Uložiť</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    overlay.querySelector('#jb-eb-close').onclick = () => overlay.remove();
    overlay.querySelector('#jb-eb-cancel').onclick = () => overlay.remove();
    overlay.querySelector('#jb-eb-save').onclick = async () => {
      const tierInputs = overlay.querySelectorAll('.jb-bike-tier');
      const newTiers = tiers.map((t,i) => ({...t, pricePerDay: parseFloat(tierInputs[i]?.value)||t.pricePerDay}));
      const data = {
        id: b.id,
        name: overlay.querySelector('#jb-eb-name').value,
        size: overlay.querySelector('#jb-eb-size').value,
        spec: b.spec,
        emoji: overlay.querySelector('#jb-eb-emoji').value,
        image: overlay.querySelector('#jb-eb-image').value,
        pricing: newTiers
      };
      const btn = overlay.querySelector('#jb-eb-save');
      btn.disabled = true; btn.textContent = 'Ukladám...';
      try {
        await apiCall('updateBike', data);
        Object.assign(b, data);
        overlay.remove();
        document.getElementById('jb-admin-content').innerHTML = renderAdminPanel();
        bindAdminEvents();
      } catch(e) { alert('Chyba: ' + e.message); btn.disabled=false; btn.textContent='Uložiť'; }
    };
  }

  // ── ODOSLANIE REZERVÁCIE ─────────────────────────────────────────
  async function submitReservation() {
    const from = document.getElementById('jb-from')?.value;
    const to = document.getElementById('jb-to')?.value;
    const name = document.getElementById('jb-name')?.value.trim();
    const surname = document.getElementById('jb-surname')?.value.trim();
    const phone = document.getElementById('jb-phone')?.value.trim();
    const email = document.getElementById('jb-email')?.value.trim();

    if (!selectedBikeIds.length) return alert('Vyberte aspoň jeden bicykel.');
    if (!from || !to) return alert('Vyberte termín OD a DO.');
    if (to < from) return alert('Dátum DO nemôže byť pred dátumom OD.');
    if (!name || !surname) return alert('Vyplňte meno a priezvisko.');
    if (!phone && !email) return alert('Vyplňte telefón alebo e-mail.');

    // Overenie konfliktu
    const busyCheck = new Set();
    datesInRange(from, to).forEach(d => getBusyBikes(d, editResId).forEach(id => busyCheck.add(id)));
    const conflict = selectedBikeIds.filter(id => busyCheck.has(id));
    if (conflict.length) {
      const names = conflict.map(id => state.bikes.find(b=>b.id===id)?.name||id).join(', ');
      return alert(`Bicykel "${names}" je obsadený v zvolenom termíne.`);
    }

    const {total, days} = calcTotal(selectedBikeIds, from, to);
    const btn = document.getElementById('jb-res-submit');
    btn.disabled = true; btn.textContent = 'Odosielam...';

    try {
      const result = editResId
        ? await apiCall('updateReservation', {id:editResId, name, surname, phone, email, bikeIds:selectedBikeIds, from, to, days, total})
        : await apiCall('addReservation', {name, surname, phone, email, bikeIds:selectedBikeIds, from, to, days, total});

      // Aktualizuj lokálny stav
      if (editResId) {
        const idx = state.reservations.findIndex(r => r.id == editResId);
        if (idx >= 0) state.reservations[idx] = {...state.reservations[idx], name, surname, phone, email, bikeIds:selectedBikeIds, from, to, days, total};
      } else {
        state.reservations.push({id: result.id, name, surname, phone, email, bikeIds:selectedBikeIds, from, to, days, total, createdAt: new Date().toISOString()});
      }

      closeModal('jb-res-modal');
      // Refresh dát z databázy aby všetky zariadenia videli aktuálnu dostupnosť
      loadData();

      // Zobraziť ďakovnú stránku
      const bikeNames = selectedBikeIds.map(id => state.bikes.find(b=>b.id===id)?.name||id).join(', ');
      document.getElementById('jb-ty-details').innerHTML = `
        <div class="jb-ty-row"><span class="k">Zákazník</span><span class="v">${name} ${surname}</span></div>
        <div class="jb-ty-row"><span class="k">Bicykle</span><span class="v">${bikeNames}</span></div>
        <div class="jb-ty-row"><span class="k">Od</span><span class="v">${fmtSK(from)}</span></div>
        <div class="jb-ty-row"><span class="k">Do</span><span class="v">${fmtSK(to)}</span></div>
        <div class="jb-ty-row"><span class="k">Cena</span><span class="v">${total} €</span></div>
        ${phone ? `<div class="jb-ty-row"><span class="k">Telefón</span><span class="v">${phone}</span></div>` : ''}
        ${email ? `<div class="jb-ty-row"><span class="k">E-mail</span><span class="v">${email}</span></div>` : ''}
      `;
      openModal('jb-ty-modal');
      // render() sa zavolá až keď zákazník klikne "Späť na kalendár"
      // (nie tu - inak by prekreslil DOM a zatvoril modal)
    } catch(e) {
      alert('Chyba pri odoslaní: ' + e.message);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = 'Odoslať rezerváciu →'; }
    }
  }

  // ── ADMIN LOGIN ───────────────────────────────────────────────────
  function adminLogin() {
    const pass = document.getElementById('jb-admin-pass')?.value;
    if (pass === ADMIN_PASS) {
      sessionStorage.setItem('jb_admin', '1');
      adminLoggedIn = true;
      closeModal('jb-admin-login-modal');
      openModal('jb-admin-modal');
    } else {
      const err = document.getElementById('jb-admin-err');
      if (err) err.style.display = 'block';
    }
  }

  function checkAdminBtn() {
    const btn = document.getElementById('jb-admin-btn');
    if (!btn) return;
    const showAdmin = window.location.hash === ADMIN_HASH || adminLoggedIn;
    btn.style.display = showAdmin ? 'inline-flex' : 'none';
  }

  window.addEventListener('hashchange', checkAdminBtn);

  // ── ŠTART ─────────────────────────────────────────────────────────
  render(); // Zobraz loading stav
  loadData(); // Načítaj dáta

})();
