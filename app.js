/* ═══════════════════════════════════════════════════════════════
   Bike Rental App — jericho.bike/pozicovna
   ═══════════════════════════════════════════════════════════════ */

// Inject CSS
(function() {
  if (document.getElementById('bike-rental-styles')) return;
  const s = document.createElement('style');
  s.id = 'bike-rental-styles';
  s.textContent = `/* ── JERICHO.BIKE DESIGN SYSTEM ── */
  :root {
    --green:   #2ECC71;
    --red:     #cd433d;
    --bg:      #f4f4f4;
    --dark:    #1d1d1b;
    --accent:  #cd433d;      /* červená – akcentová farba jericho.bike */
    --accent2: #a8332e;      /* tmavšia červená pre hover */
    --card:    #ffffff;
    --border:  #e0e0e0;
    --text:    #1d1d1b;
    --muted:   #757575;
    --shadow:  0 1px 4px rgba(0,0,0,0.10);
    --radius:  4px;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', Arial, sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; font-size: 14px; line-height: 1.55; }

  /* ── LOADING ── */
  #loading-screen {
    position: fixed; inset: 0; background: var(--dark);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    z-index: 9999; transition: opacity 0.3s;
  }
  #loading-screen.hidden { opacity: 0; pointer-events: none; }
  .loading-logo { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 6px; letter-spacing: -0.3px; }
  .loading-logo span { color: var(--accent); }
  .loading-sub { color: rgba(255,255,255,0.45); font-size: 0.85rem; margin-bottom: 28px; }
  .spinner { width: 32px; height: 32px; border: 3px solid rgba(255,255,255,0.1); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.75s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── API CONFIG BANNER ── */
  #config-banner {
    background: #fff8e1; border-bottom: 2px solid #ffc107;
    padding: 12px 24px; display: none; align-items: center;
    gap: 12px; font-size: 0.84rem; color: #795548;
  }
  #config-banner.show { display: flex; }
  #config-banner input {
    flex: 1; padding: 7px 11px; border: 1px solid #ffc107;
    border-radius: var(--radius); font-family: inherit; font-size: 0.84rem;
    background: #fff; outline: none;
  }
  #config-banner button { padding: 7px 14px; background: var(--accent); color: #fff; border: none; border-radius: var(--radius); cursor: pointer; font-size: 0.84rem; font-weight: 600; white-space: nowrap; }
  #config-banner button:hover { background: var(--accent2); }

  /* ── HEADER — matches jericho.bike dark top bar ── */
  header {
    background: var(--dark);
    color: #fff;
    padding: 0 32px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 2px solid var(--accent);
  }
  header .logo {
    display: flex; align-items: center; gap: 10px;
    font-size: 1.15rem; font-weight: 700; color: #fff; letter-spacing: -0.2px;
  }
  header .logo img { height: 32px; width: auto; }
  header .nav-btns { display: flex; gap: 8px; align-items: center; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 8px 18px; border-radius: var(--radius); border: none;
    cursor: pointer; font-family: inherit; font-size: 0.84rem;
    font-weight: 600; transition: background 0.15s, color 0.15s;
    text-decoration: none; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent2); }
  .btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
  .btn-outline { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.35); }
  .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
  .btn-dark { background: var(--dark); color: #fff; }
  .btn-dark:hover { background: #333; }
  .btn-ghost { background: #fff; color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-green { background: var(--green); color: #fff; }
  .btn-red { background: var(--red); color: #fff; }
  .btn-red:hover { background: #a8332e; }
  .btn-sm { padding: 6px 12px; font-size: 0.78rem; }

  /* ── VIEWS ── */
  .view { display: none; }
  .view.active { display: block; }

  /* ── CUSTOMER ── */
  .customer-wrap { max-width: 960px; margin: 0 auto; padding: 32px 20px; }
  .section-title { font-size: 1.5rem; font-weight: 700; color: var(--dark); margin-bottom: 6px; letter-spacing: -0.3px; }
  .section-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 28px; }

  /* CALENDAR */
  .calendar-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 24px; margin-bottom: 32px; border: 1px solid var(--border); }
  .cal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .cal-title { font-size: 1.05rem; font-weight: 700; color: var(--dark); }
  .cal-nav { display: flex; gap: 6px; }
  .cal-nav button {
    width: 32px; height: 32px; border-radius: var(--radius);
    border: 1px solid var(--border); background: #fff;
    cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
    color: var(--text);
  }
  .cal-nav button:hover { border-color: var(--accent); color: var(--accent); background: #fff5f5; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .cal-dow { text-align: center; font-size: 0.7rem; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.6px; padding: 6px 0 8px; }
  .cal-day {
    border-radius: var(--radius); padding: 6px 3px;
    cursor: pointer; transition: all 0.14s; text-align: center;
    border: 1px solid transparent; min-height: 66px;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: #fff;
  }
  .cal-day:hover:not(.past):not(.empty) { border-color: var(--accent); background: #fff5f5; }
  .cal-day.past { opacity: 0.3; cursor: default; pointer-events: none; background: #fafafa; }
  .cal-day.empty { cursor: default; pointer-events: none; background: transparent; }
  .cal-day.today { background: #fff5f5; border-color: var(--accent); }
  .cal-day .day-num { font-size: 0.88rem; font-weight: 600; color: var(--dark); line-height: 1; }
  .cal-day.past .day-num { color: #bbb; }
  .dots { display: flex; gap: 3px; justify-content: center; flex-wrap: wrap; margin-top: 2px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; }
  .dot.avail { background: var(--green); }
  .dot.busy { background: var(--red); }
  .legend { display: flex; gap: 18px; margin-top: 14px; font-size: 0.78rem; color: var(--muted); }
  .legend-item { display: flex; align-items: center; gap: 5px; }

  /* ── OVERLAY & MODAL ── */
  .overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200; overflow-y: auto; padding: 32px 16px; }
  .overlay.open { display: flex; align-items: flex-start; justify-content: center; }
  .modal {
    background: var(--card); border-radius: var(--radius);
    padding: 28px 32px; max-width: 660px; width: 100%;
    position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    animation: slideUp 0.22s ease; border-top: 3px solid var(--accent);
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .modal-close {
    position: absolute; top: 14px; right: 14px;
    width: 30px; height: 30px; border-radius: var(--radius);
    border: 1px solid var(--border); background: #fff;
    cursor: pointer; font-size: 1rem;
    display: flex; align-items: center; justify-content: center;
    color: var(--muted); transition: all 0.15s;
  }
  .modal-close:hover { background: var(--dark); color: #fff; border-color: var(--dark); }
  .modal-title { font-size: 1.2rem; font-weight: 700; color: var(--dark); margin-bottom: 4px; }
  .modal-sub { color: var(--muted); font-size: 0.84rem; margin-bottom: 20px; }

  /* BIKE CARDS IN FORM */
  .bikes-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  @media(max-width:600px) { .bikes-grid { grid-template-columns: 1fr; } }
  .bike-card {
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 12px; cursor: pointer; transition: all 0.15s; position: relative;
    background: #fff;
  }
  .bike-card:hover { border-color: var(--accent); background: #fff5f5; }
  .bike-card.selected { border-color: var(--accent); background: #fff5f5; border-width: 2px; }
  .bike-card.unavailable { opacity: 0.38; cursor: not-allowed; pointer-events: none; }
  .bike-card img { width: 100%; height: 85px; object-fit: cover; border-radius: 2px; margin-bottom: 8px; background: var(--bg); }
  .bike-img-placeholder {
    width: 100%; height: 85px; border-radius: 2px; margin-bottom: 8px;
    background: #f0f0f0; display: flex; align-items: center;
    justify-content: center; font-size: 2rem;
  }
  .bike-name { font-size: 0.84rem; font-weight: 700; color: var(--dark); margin-bottom: 2px; }
  .bike-size { font-size: 0.72rem; color: var(--muted); margin-bottom: 3px; }
  .bike-spec { font-size: 0.7rem; color: var(--muted); line-height: 1.4; margin-bottom: 6px; }
  .bike-price { font-size: 0.82rem; font-weight: 700; color: var(--accent2); }
  .bike-pricelist-link { font-size: 0.68rem; color: var(--muted); cursor: pointer; background: none; border: none; padding: 0; text-decoration: underline; text-underline-offset: 2px; display: block; margin-top: 3px; text-align: left; }
  .bike-pricelist-link:hover { color: var(--accent); }
  /* Cenník — fixný panel nad všetkým, nie vnorený v kartičke */
  #pricelist-modal {
    display: none; position: fixed; inset: 0; z-index: 500;
    align-items: center; justify-content: center;
  }
  #pricelist-modal.open { display: flex; }
  #pricelist-modal-backdrop {
    position: absolute; inset: 0; background: rgba(0,0,0,0.35);
  }
  #pricelist-modal-box {
    position: relative; background: var(--dark); color: #fff;
    border-radius: var(--radius); padding: 22px 24px; min-width: 260px; max-width: 340px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.35); z-index: 1;
    animation: slideUp 0.18s ease;
  }
  #pricelist-modal-box .pl-bike-name {
    font-size: 0.92rem; font-weight: 700; color: #fff; margin-bottom: 14px;
    padding-right: 24px; line-height: 1.3;
  }
  #pricelist-modal-box .pl-close {
    position: absolute; top: 12px; right: 12px;
    width: 26px; height: 26px; border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.2); background: transparent;
    color: rgba(255,255,255,0.6); cursor: pointer; font-size: 0.9rem;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  #pricelist-modal-box .pl-close:hover { background: rgba(255,255,255,0.12); color: #fff; }
  #pricelist-modal-box table { width: 100%; border-collapse: collapse; }
  #pricelist-modal-box tr { border-bottom: 1px solid rgba(255,255,255,0.08); }
  #pricelist-modal-box tr:last-child { border: none; }
  #pricelist-modal-box td { padding: 7px 0; font-size: 0.84rem; color: rgba(255,255,255,0.8); }
  #pricelist-modal-box td:last-child { text-align: right; font-weight: 700; color: #fff; white-space: nowrap; }
  #pricelist-modal-box tr:hover td { background: transparent; }
  .bike-check {
    position: absolute; top: 8px; right: 8px;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--accent); color: #fff;
    display: none; align-items: center; justify-content: center; font-size: 0.7rem;
  }
  .bike-card.selected .bike-check { display: flex; }

  /* FORM */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  @media(max-width:500px) { .form-row { grid-template-columns: 1fr; } }
  .form-group { display: flex; flex-direction: column; gap: 4px; }
  .form-group.full { grid-column: 1/-1; }
  label { font-size: 0.78rem; font-weight: 600; color: var(--dark); text-transform: uppercase; letter-spacing: 0.4px; }
  input, select, textarea {
    padding: 9px 12px; border: 1px solid var(--border);
    border-radius: var(--radius); font-family: inherit;
    font-size: 0.88rem; color: var(--text);
    background: #fff; outline: none; transition: border-color 0.15s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 2px rgba(205,67,61,0.12); }
  textarea { resize: vertical; min-height: 80px; }

  .price-box {
    background: var(--dark); color: #fff;
    border-radius: var(--radius); padding: 16px 20px;
    margin-bottom: 18px; display: flex; align-items: center;
    justify-content: space-between; border-left: 4px solid var(--accent);
  }
  .price-label { font-size: 0.8rem; color: rgba(255,255,255,0.55); }
  .price-total { font-size: 1.7rem; font-weight: 700; color: #fff; }
  .price-detail { font-size: 0.75rem; color: rgba(255,255,255,0.45); margin-top: 1px; }
  .info-links { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .info-link {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.82rem; color: var(--accent2); text-decoration: none;
    font-weight: 500; cursor: pointer; background: none; border: none;
    padding: 0; width: fit-content;
  }
  .info-link:hover { text-decoration: underline; color: var(--accent); }
  .form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }

  /* CONDITIONS */
  .conditions-content { max-height: 58vh; overflow-y: auto; padding-right: 6px; }
  .conditions-content h4 { font-size: 0.92rem; font-weight: 700; margin: 14px 0 6px; color: var(--dark); }
  .conditions-content p { font-size: 0.84rem; line-height: 1.7; color: var(--text); }

  /* THANK YOU */
  .thankyou-wrap { max-width: 520px; margin: 64px auto; text-align: center; padding: 20px; }
  .thankyou-icon {
    width: 72px; height: 72px; background: var(--accent);
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 2rem; margin: 0 auto 20px;
    animation: popIn 0.45s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes popIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .thankyou-title { font-size: 1.8rem; font-weight: 700; color: var(--dark); margin-bottom: 10px; }
  .thankyou-text { color: var(--muted); line-height: 1.7; margin-bottom: 28px; font-size: 0.9rem; }
  .thankyou-details { background: var(--card); border-radius: var(--radius); padding: 20px; text-align: left; margin-bottom: 24px; box-shadow: var(--shadow); border: 1px solid var(--border); }
  .detail-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--border); font-size: 0.86rem; gap: 12px; }
  .detail-row:last-child { border: none; }
  .detail-row .dk { color: var(--muted); }
  .detail-row .dv { font-weight: 600; color: var(--dark); text-align: right; }

  /* ── ADMIN ── */
  .admin-wrap { display: flex; min-height: calc(100vh - 58px); }
  .admin-sidebar { width: 220px; background: var(--dark); color: #fff; padding: 20px 12px; flex-shrink: 0; }
  .admin-sidebar h3 {
    font-size: 0.68rem; font-weight: 700; letter-spacing: 1.4px;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    margin: 18px 0 8px; padding-left: 10px;
  }
  .admin-sidebar h3:first-child { margin-top: 0; }
  .sidebar-item {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 10px; border-radius: var(--radius);
    cursor: pointer; font-size: 0.85rem;
    color: rgba(255,255,255,0.65); transition: all 0.15s; margin-bottom: 1px;
  }
  .sidebar-item:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .sidebar-item.active { background: var(--accent); color: #fff; }
  .admin-content { flex: 1; padding: 28px; overflow-y: auto; background: var(--bg); }
  .admin-panel { display: none; }
  .admin-panel.active { display: block; }
  .admin-title { font-size: 1.35rem; font-weight: 700; color: var(--dark); margin-bottom: 3px; }
  .admin-sub { color: var(--muted); font-size: 0.84rem; margin-bottom: 22px; }
  .tab-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }

  /* TABLE */
  .table-wrap { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; border: 1px solid var(--border); }
  table { width: 100%; border-collapse: collapse; }
  th { background: #2d2d2b; color: rgba(255,255,255,0.75); font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; padding: 11px 14px; text-align: left; }
  td { padding: 11px 14px; font-size: 0.84rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border: none; }
  tr:hover td { background: #fff5f5; }
  .badge { display: inline-flex; align-items: center; padding: 2px 9px; border-radius: 3px; font-size: 0.72rem; font-weight: 700; }
  .badge-green { background: #ffebee; color: #c62828; }
  .badge-red { background: #ffebee; color: #c62828; }
  .badge-blue { background: #e3f2fd; color: #1565c0; }

  /* BIKES ADMIN */
  .bikes-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
  .bike-admin-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); overflow: hidden; border: 1px solid var(--border); }
  .bike-admin-img { width: 100%; height: 140px; object-fit: cover; background: var(--bg); }
  .bike-admin-img-placeholder { width: 100%; height: 140px; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; }
  .bike-admin-body { padding: 16px; }
  .bike-admin-name { font-size: 0.98rem; font-weight: 700; color: var(--dark); margin-bottom: 3px; }
  .bike-admin-detail { font-size: 0.78rem; color: var(--muted); margin-bottom: 10px; line-height: 1.5; }
  .bike-admin-actions { display: flex; gap: 6px; }

  /* PRICING */
  .pricing-card { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 20px; border: 1px solid var(--border); }
  .pricing-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 14px; color: var(--dark); }
  .pricing-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid var(--border); gap: 10px; }
  .pricing-row:last-child { border: none; }
  .pricing-row label { font-size: 0.84rem; color: var(--dark); font-weight: 500; min-width: 150px; }
  .pricing-row .price-input-wrap { display: flex; align-items: center; gap: 7px; }
  .pricing-row input { width: 85px; }
  .pricing-row span { font-size: 0.78rem; color: var(--muted); }

  /* ADMIN CALENDAR */
  .admin-cal-wrap { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
  .bike-selector { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
  .bike-tab {
    padding: 6px 14px; border-radius: var(--radius);
    border: 1px solid var(--border); background: #fff;
    cursor: pointer; font-family: inherit; font-size: 0.82rem; transition: all 0.15s;
  }
  .bike-tab.active { background: var(--dark); color: #fff; border-color: var(--dark); }
  .mini-res-list { background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 16px; border: 1px solid var(--border); }
  .mini-res-list h4 { font-weight: 700; font-size: 0.92rem; margin-bottom: 12px; color: var(--dark); }
  .mini-res-item { font-size: 0.78rem; padding: 7px 0; border-bottom: 1px solid var(--border); }
  .mini-res-item:last-child { border: none; }
  .mini-res-name { font-weight: 600; color: var(--dark); }
  .mini-res-dates { color: var(--muted); }

  /* EDIT FORM */
  .edit-form { display: flex; flex-direction: column; gap: 12px; }
  .edit-form .form-row { margin: 0; }

  /* CHECKBOX */
  .checkbox-label { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem; cursor: pointer; color: var(--text); line-height: 1.5; }
  .checkbox-label input[type=checkbox] { width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px; accent-color: var(--accent); }

  /* ADMIN LOGIN */
  .login-wrap { max-width: 380px; margin: 80px auto; padding: 36px; background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); text-align: center; border: 1px solid var(--border); border-top: 3px solid var(--accent); }
  .login-wrap h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 6px; }
  .login-wrap p { color: var(--muted); font-size: 0.84rem; margin-bottom: 20px; }
  .login-form { display: flex; flex-direction: column; gap: 12px; }
  .error-msg { color: var(--red); font-size: 0.82rem; }

  /* SYNCING INDICATOR */
  .sync-indicator {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.74rem; color: rgba(255,255,255,0.55);
  }
  .sync-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); }
  .sync-dot.syncing { background: #ffc107; animation: pulse 0.9s infinite; }
  .sync-dot.error { background: var(--red); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

  /* Skry hlavičku ak je stránka načítaná v iframe */
  .in-iframe header { display: none !important; }
  .in-iframe #config-banner { display: none !important; }

  /* ── EMBED MÓD (?embed=1) — skryje hlavičku ── */
  body.embed header,
  body.embed #config-banner { display: none !important; }
  body.embed { background: transparent; }
  body.embed .customer-wrap { padding-top: 16px; }

  @media(max-width:640px) {
    header { padding: 0 14px; }
    .customer-wrap, .admin-content { padding: 18px 14px; }
    .modal { padding: 20px 16px; }
    .admin-sidebar { display: none; }
    .admin-cal-wrap { grid-template-columns: 1fr; }
  }`;
  document.head.appendChild(s);
})();

// Spusti po načítaní DOM
function bikeRentalInit() {
  // Inject modal HTML ak Shoptet orezal obsah stránky
  if (!document.getElementById('overlay-reservation')) {
    const mc = document.createElement('div');
    mc.id = 'bike-rental-modals';
    mc.innerHTML = `<!-- RESERVATION FORM -->
<div class="overlay" id="overlay-reservation">
  <div class="modal">
    <button class="modal-close" onclick="closeOverlay('overlay-reservation')">✕</button>
    <div class="modal-title">Rezervácia bicykla</div>
    <div class="modal-sub" id="res-modal-sub">Vyberte bicykel a vyplňte kontaktné údaje</div>
    <div class="bikes-grid" id="res-bikes-grid"></div>
    <div class="form-row">
      <div class="form-group"><label>Dátum OD</label><input type="date" id="res-from" onchange="onResDateChange()"></div>
      <div class="form-group"><label>Dátum DO</label><input type="date" id="res-to" onchange="onResDateChange()"></div>
    </div>
    <div class="price-box">
      <div><div class="price-label">Celková cena</div><div class="price-detail" id="res-price-detail">Vyberte bicykel a termín</div></div>
      <div class="price-total" id="res-price-total">0 €</div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Meno</label><input type="text" id="res-name" placeholder="Meno"></div>
      <div class="form-group"><label>Priezvisko</label><input type="text" id="res-surname" placeholder="Priezvisko"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Telefón</label><input type="tel" id="res-phone" placeholder="+421..."></div>
      <div class="form-group"><label>E-mail</label><input type="email" id="res-email" placeholder="vas@email.sk"></div>
    </div>
    <div class="info-links">
      <button class="info-link" onclick="openDocument('conditions')">ℹ️ Čo by ste mali vedieť pred požičaním bicykla</button>
      <button class="info-link" onclick="openDocument('contract')">📄 Zmluva o vypožičaní bicykla – náhľad</button>
      <button class="info-link" onclick="openDocument('gdpr')">🔒 Ochrana osobných údajov</button>
    </div>
    <div class="form-actions">
      <button class="btn btn-ghost" onclick="closeOverlay('overlay-reservation')">Zrušiť</button>
      <button class="btn btn-primary" id="submit-res-btn" onclick="submitReservation()">Odoslať rezerváciu →</button>
    </div>
  </div>
</div>

<!-- DOCUMENT VIEWER MODAL (dynamický — podmienky / zmluva / GDPR) -->
<div class="overlay" id="overlay-document">
  <div class="modal">
    <button class="modal-close" onclick="closeOverlay('overlay-document')">✕</button>
    <div class="modal-title" id="doc-modal-title"></div>
    <div class="conditions-content" id="doc-modal-content"></div>
    <div style="margin-top:20px;text-align:right"><button class="btn btn-dark" onclick="closeOverlay('overlay-document')">Rozumiem</button></div>
  </div>
</div>

<!-- EDIT BIKE -->
<div class="overlay" id="overlay-edit-bike">
  <div class="modal">
    <button class="modal-close" onclick="closeOverlay('overlay-edit-bike')">✕</button>
    <div class="modal-title" id="edit-bike-title">Upraviť bicykel</div>
    <div class="edit-form" id="edit-bike-form"></div>
    <div style="margin-top:20px;display:flex;gap:12px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeOverlay('overlay-edit-bike')">Zrušiť</button>
      <button class="btn btn-primary" id="save-bike-btn" onclick="saveBike()">Uložiť zmeny</button>
    </div>
  </div>
</div>

<!-- ADMIN RESERVATION -->
<div class="overlay" id="overlay-admin-res">
  <div class="modal">
    <button class="modal-close" onclick="closeOverlay('overlay-admin-res')">✕</button>
    <div class="modal-title" id="admin-res-title">Pridať rezerváciu</div>
    <div class="edit-form" id="admin-res-form"></div>
    <div style="margin-top:20px;display:flex;gap:12px;justify-content:flex-end">
      <button class="btn btn-ghost" onclick="closeOverlay('overlay-admin-res')">Zrušiť</button>
      <button class="btn btn-primary" id="save-admin-res-btn" onclick="saveAdminReservation()">Uložiť</button>
    </div>
  </div>
</div>

<script>
// ═══════════════════════════════════════════════════════════════════
//  KONFIGURÁCIA
// ═══════════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = 'admin123';
const API_URL_KEY    = 'bikeRentalApiUrl';

let API_URL = 'https://script.google.com/macros/s/AKfycbwCS6E8GhIDKL5O1jEJbTbJuNX1IWBBzg69aI5HtGzsZJ_gqR2LYZaxqxYbS9Zklyqb/exec';

// ═══════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════

let bikes        = [];
let reservations = [];
let documents    = {};  // { conditions: {id,title,content}, contract: {...}, gdpr: {...} }

let selectedBikeIds      = [];
let editingReservationId = null;
let editingBikeId        = null;

const today    = new Date();
const todayStr = ymd(today);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();

let adminCalYear   = today.getFullYear();
let adminCalMonth  = today.getMonth();
let adminCalBikeId = null;

// ═══════════════════════════════════════════════════════════════════
//  API KOMUNIKÁCIA
// ═══════════════════════════════════════════════════════════════════

function setSyncState(state) {
  const dot   = document.getElementById('sync-dot');
  const label = document.getElementById('sync-label');
  dot.className   = 'sync-dot ' + (state === 'syncing' ? 'syncing' : state === 'error' ? 'error' : '');
  label.textContent = state === 'syncing' ? 'Synchronizujem...' : state === 'error' ? 'Chyba spojenia' : 'Online';
}

async function apiCall(action, data = {}) {
  if (!API_URL) throw new Error('API URL nie je nastavené');
  setSyncState('syncing');
  try {
    // Apps Script CORS neumožňuje preflight — všetko posielame ako GET
    // JSON payload idú ako ?payload=... query parameter (zakódovaný)
    const payload = encodeURIComponent(JSON.stringify({ action, ...data }));
    const url     = API_URL + '?payload=' + payload;
    const resp    = await fetch(url, { method: 'GET' });
    const json    = await resp.json();
    if (!json.ok) throw new Error(json.error || 'Chyba servera');
    setSyncState('online');
    return json.data;
  } catch (err) {
    setSyncState('error');
    throw err;
  }
}

async function refreshData() {
  try {
    const data = await apiCall('getAll');
    bikes = (data.bikes || []).map(b => {
      if (typeof b.pricing === 'string') {
        try { b.pricing = JSON.parse(b.pricing); } catch { b.pricing = []; }
      }
      if (!Array.isArray(b.pricing) || !b.pricing.length) b.pricing = defaultPricingTiers();
      return b;
    });
    reservations = data.reservations || [];
    documents    = data.documents    || getDefaultDocuments();
    renderCalendar();
  } catch (e) {
    console.warn('Chyba načítania:', e.message);
  }
}

function defaultPricingTiers() {
  return [
    { label:'1 deň',       minDays:1,  maxDays:1,    pricePerDay:45 },
    { label:'2 dni',       minDays:2,  maxDays:2,    pricePerDay:40 },
    { label:'3 – 5 dní',   minDays:3,  maxDays:5,    pricePerDay:35 },
    { label:'6 – 7 dní',   minDays:6,  maxDays:7,    pricePerDay:30 },
    { label:'8 – 15 dní',  minDays:8,  maxDays:15,   pricePerDay:27 },
    { label:'15 – 30 dní', minDays:15, maxDays:30,   pricePerDay:25 },
    { label:'30+ dní',     minDays:31, maxDays:9999,  pricePerDay:23 }
  ];
}

function getDefaultDocuments() {
  return {
    conditions: {
      id: 'conditions',
      title: 'Čo by ste mali vedieť pred požičaním bicykla',
      content: '<h4>1. Prevzatie bicykla</h4><p>Zákazník je povinný skontrolovať stav bicykla pri prevzatí. Akékoľvek poškodenia musia byť nahlásené pred odchodom.</p><h4>2. Zodpovednosť za škody</h4><p>V prípade poškodenia, straty alebo odcudzenia bicykla je zákazník povinný uhradiť plnú náhradu škody.</p><h4>3. Vrátenie bicykla</h4><p>Bicykel musí byť vrátený v rovnakom stave ako pri prevzatí, včas podľa dohodnutého termínu. Za oneskorené vrátenie si požičovňa vyhradzuje právo účtovať príplatok.</p><h4>4. Pravidlá používania</h4><p>Bicykel je dovolené používať iba na bežnú cestnú a turistickú jazdu. Je zakázané používať bicykel na extrémne športy alebo ho prenajímať ďalším osobám.</p><h4>5. Bezpečnosť</h4><p>Zákazník je povinný jazdiť s prílbou a dodržiavať všetky pravidlá cestnej premávky.</p><h4>6. Stornovanie</h4><p>Pri stornovaní menej ako 24 hodín pred termínom môže byť účtovaný storno poplatok vo výške 20% z celkovej ceny.</p>'
    },
    contract: {
      id: 'contract',
      title: 'Zmluva o vypožičaní bicykla',
      content: '<h4>Zmluvné strany</h4><p>Požičovňa bicyklov (ďalej len „Prenajímateľ") a zákazník (ďalej len „Nájomca") uzatvárajú túto zmluvu o vypožičaní bicykla.</p><h4>Predmet zmluvy</h4><p>Prenajímateľ odovzdáva Nájomcovi do dočasného užívania bicykel v stave zodpovedajúcom bežnému opotrebeniu. Nájomca sa zaväzuje vrátiť bicykel v rovnakom stave v dohodnutom termíne.</p><h4>Cena a platba</h4><p>Cena za prenájom je stanovená podľa aktuálneho cenníka požičovne. Platba prebieha pri prevzatí bicykla.</p><h4>Zodpovednosť</h4><p>Nájomca preberá plnú zodpovednosť za bicykel od momentu prevzatia až do jeho vrátenia. V prípade poškodenia alebo straty je Nájomca povinný uhradiť škodu v plnej výške.</p><h4>Záverečné ustanovenia</h4><p>Odoslaním rezervácie Nájomca potvrdzuje, že sa oboznámil s podmienkami tejto zmluvy a súhlasí s nimi.</p>'
    },
    gdpr: {
      id: 'gdpr',
      title: 'Ochrana osobných údajov',
      content: '<h4>Správca osobných údajov</h4><p>Vaše osobné údaje spracúva požičovňa bicyklov ako správca v súlade s nariadením GDPR a zákonom č. 18/2018 Z.z. o ochrane osobných údajov.</p><h4>Účel spracovania</h4><p>Osobné údaje (meno, priezvisko, telefón, e-mail) spracúvame výlučne za účelom vybavenia rezervácie a prípadnej komunikácie súvisiacej s prenájmom bicykla.</p><h4>Doba uchovávania</h4><p>Osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu, najdlhšie však 3 roky od uskutočnenia prenájmu.</p><h4>Vaše práva</h4><p>Máte právo na prístup k svojim údajom, ich opravu, vymazanie alebo obmedzenie spracovania. Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR.</p><h4>Kontakt</h4><p>V prípade otázok týkajúcich sa spracovania osobných údajov nás kontaktujte prostredníctvom kontaktných údajov požičovne.</p>'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════
//  NAVIGÁCIA
// ═══════════════════════════════════════════════════════════════════

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  if (name === 'customer') {
    renderCalendar();
    refreshData();
  }
}

function openOverlay(id) {
  document.getElementById(id).classList.add('open');
  reportHeight();
}
function closeOverlay(id) {
  document.getElementById(id).classList.remove('open');
  reportHeight();
}

function showAdminEntry() {
  if (sessionStorage.getItem('adminLoggedIn') === '1') {
    showView('admin');
    renderReservationsTable();
  } else {
    showView('admin-login');
  }
}

function adminLogin() {
  if (document.getElementById('admin-pass').value === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', '1');
    document.getElementById('login-error').style.display = 'none';
    showView('admin');
    renderReservationsTable();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function adminLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  showView('customer');
}

function showAdminPanel(name, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (el) el.classList.add('active');
  if (name === 'reservations') renderReservationsTable();
  if (name === 'bikes')        renderBikesAdmin();
  if (name === 'calendar')     renderAdminCalendar();
  if (name === 'documents')    renderDocumentsEditor();
}

function showApiConfig() {
  const banner = document.getElementById('config-banner');
  banner.classList.toggle('show');
  if (API_URL) document.getElementById('api-url-input').value = API_URL;
}

function saveApiUrl() {
  const val = document.getElementById('api-url-input').value.trim();
  if (!val) return alert('Zadajte URL.');
  API_URL = val;
  localStorage.setItem(API_URL_KEY, val);
  document.getElementById('config-banner').classList.remove('show');
  // Detekcia iframe — skry hlavičku
if (window.self !== window.top) {
  document.body.classList.add('in-iframe');
}

init();
}

// ═══════════════════════════════════════════════════════════════════
//  POMOCNÉ FUNKCIE
// ═══════════════════════════════════════════════════════════════════

function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('sk-SK', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function ymd(d) {
  const dt = typeof d === 'string' ? new Date(d + 'T12:00:00') : d;
  return dt.toISOString().slice(0, 10);
}
function datesInRange(from, to) {
  const dates = [];
  let cur = new Date(from + 'T12:00:00');
  const end = new Date(to + 'T12:00:00');
  while (cur <= end) { dates.push(ymd(cur)); cur.setDate(cur.getDate() + 1); }
  return dates;
}

function getBikePricing(bikeId) {
  const b = bikes.find(x => x.id === bikeId);
  return (b && b.pricing && b.pricing.length) ? b.pricing : defaultPricingTiers();
}

function getMinPricePerDay(bikeId) {
  const p = getBikePricing(bikeId);
  return p.length ? Math.min(...p.map(t => t.pricePerDay)) : 0;
}

function getPricePerDayForBike(days, bikeId) {
  const p = getBikePricing(bikeId);
  for (const tier of p) {
    if (days >= tier.minDays && days <= tier.maxDays) return tier.pricePerDay;
  }
  return p.length ? p[p.length - 1].pricePerDay : 0;
}

function calcTotal(bikeIds, from, to) {
  if (!bikeIds.length || !from || !to) return { total: 0, days: 0, ppd: 0, breakdown: [] };
  const d1   = new Date(from + 'T12:00:00');
  const d2   = new Date(to   + 'T12:00:00');
  const days = Math.round((d2 - d1) / 86400000);
  if (days <= 0) return { total: 0, days: 0, ppd: 0, breakdown: [] };

  // Každý bicykel má vlastnú cenu/deň
  let total = 0;
  const breakdown = [];
  bikeIds.forEach(bid => {
    const ppd = getPricePerDayForBike(days, bid);
    total += ppd * days;
    breakdown.push({ bikeId: bid, ppd, subtotal: ppd * days });
  });
  // ppd = priemer pre zobrazenie (ak je len 1 bicykel, je to presné)
  const ppd = bikeIds.length === 1 ? breakdown[0].ppd : Math.round(total / days / bikeIds.length);
  return { total, days, ppd, breakdown };
}

function getBusyBikes(dateStr, excludeResId = null) {
  const busy = new Set();
  for (const r of reservations) {
    if (excludeResId && r.id == excludeResId) continue;
    if (datesInRange(r.from, r.to).includes(dateStr)) {
      r.bikeIds.forEach(id => busy.add(id));
    }
  }
  return busy;
}

// ═══════════════════════════════════════════════════════════════════
//  KALENDÁR (ZÁKAZNÍK)
// ═══════════════════════════════════════════════════════════════════

const MONTHS_SK = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const DAYS_SK   = ['Po','Ut','St','Št','Pi','So','Ne'];

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('cal-month-label').textContent = \`\${MONTHS_SK[calMonth]} \${calYear}\`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAYS_SK.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(calYear, calMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dtStr  = \`\${calYear}-\${String(calMonth+1).padStart(2,'0')}-\${String(day).padStart(2,'0')}\`;
    const isPast = dtStr < todayStr;
    const busySet = getBusyBikes(dtStr);

    const el = document.createElement('div');
    el.className = 'cal-day' + (isPast ? ' past' : '') + (dtStr === todayStr ? ' today' : '');

    const numEl = document.createElement('div');
    numEl.className = 'day-num';
    numEl.textContent = day;
    el.appendChild(numEl);

    const dots = document.createElement('div');
    dots.className = 'dots';
    bikes.forEach(b => {
      const dot = document.createElement('div');
      dot.className = 'dot ' + (busySet.has(b.id) ? 'busy' : 'avail');
      dot.title = b.name + ': ' + (busySet.has(b.id) ? 'Obsadené' : 'K dispozícii');
      dots.appendChild(dot);
    });
    el.appendChild(dots);

    if (!isPast) el.onclick = () => openReservationModal(dtStr);
    grid.appendChild(el);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  REZERVAČNÝ FORMULÁR
// ═══════════════════════════════════════════════════════════════════

function openReservationModal(dateStr) {
  selectedBikeIds      = [];
  editingReservationId = null;
  document.getElementById('res-from').value    = dateStr;
  document.getElementById('res-from').min      = todayStr;
  document.getElementById('res-to').value      = '';
  document.getElementById('res-to').min        = dateStr;
  document.getElementById('res-name').value    = '';
  document.getElementById('res-surname').value = '';
  document.getElementById('res-phone').value   = '';
  document.getElementById('res-email').value   = '';
  document.getElementById('res-modal-sub').textContent = \`Vybratý dátum: \${fmtDate(dateStr)}\`;
  renderResBikesGrid();
  recalcPrice();
  openOverlay('overlay-reservation');
}

function renderResBikesGrid() {
  const grid    = document.getElementById('res-bikes-grid');
  const fromStr = document.getElementById('res-from').value;
  const toStr   = document.getElementById('res-to').value;
  grid.innerHTML = '';

  const busyForRange = new Set();
  // Ak je zadané aspoň OD, skontroluj obsadenosť od toho dátumu.
  // Ak je zadané aj DO, skontroluj celý rozsah. Ak nie, stačí samotný FROM deň.
  if (fromStr) {
    const effectiveTo = (toStr && toStr >= fromStr) ? toStr : fromStr;
    datesInRange(fromStr, effectiveTo).forEach(d => {
      getBusyBikes(d, editingReservationId).forEach(id => busyForRange.add(id));
    });
  }

  bikes.forEach(b => {
    // Ak bol bicykel už vybraný zákazníkom, neskrývame ho (môže ho odznačiť)
    const unavail = busyForRange.has(b.id) && !selectedBikeIds.includes(b.id);
    const sel     = selectedBikeIds.includes(b.id);
    const card    = document.createElement('div');
    card.className = 'bike-card' + (sel ? ' selected' : '') + (unavail ? ' unavailable' : '');

    const imgHtml = b.image
      ? \`<img src="\${b.image}" alt="\${b.name}">\`
      : \`<div class="bike-img-placeholder">\${b.emoji || '🚲'}</div>\`;

    card.innerHTML = \`
      \${imgHtml}
      <div class="bike-name">\${b.name}</div>
      <div class="bike-size">Veľkosť: \${b.size}</div>
      <div class="bike-spec">\${b.spec}</div>
      <div class="bike-price">Cena od \${getMinPricePerDay(b.id)} €/deň</div>
      <button class="bike-pricelist-link" onclick="openPriceListModal(event, \${b.id})">Zobraziť kompletný cenník</button>
      <div class="bike-check">✓</div>
    \`;
    if (!unavail) card.onclick = () => toggleBike(b.id);
    grid.appendChild(card);
  });
}

function openPriceListModal(e, bikeId) {
  e.stopPropagation();
  const b = bikes.find(x => x.id === bikeId);
  if (!b) return;
  const tiers = getBikePricing(bikeId);
  document.getElementById('pricelist-modal-name').textContent = b.name + ' – cenník';
  document.getElementById('pricelist-modal-table').innerHTML = tiers.map(t =>
    \`<tr><td>\${t.label}</td><td>\${t.pricePerDay} €/deň</td></tr>\`
  ).join('');
  document.getElementById('pricelist-modal').classList.add('open');
}

function closePriceListModal() {
  document.getElementById('pricelist-modal').classList.remove('open');
}

function toggleBike(id) {
  const idx = selectedBikeIds.indexOf(id);
  if (idx >= 0) selectedBikeIds.splice(idx, 1);
  else selectedBikeIds.push(id);
  renderResBikesGrid();
  recalcPrice();
}

function onResDateChange() {
  const from = document.getElementById('res-from').value;
  const to   = document.getElementById('res-to').value;
  if (from) document.getElementById('res-to').min = from;
  if (to && to < from) document.getElementById('res-to').value = '';
  renderResBikesGrid();
  recalcPrice();
}

function recalcPrice() {
  const from = document.getElementById('res-from').value;
  const to   = document.getElementById('res-to').value;
  const { total, days, ppd, breakdown } = calcTotal(selectedBikeIds, from, to);
  document.getElementById('res-price-total').textContent = total > 0 ? total + ' €' : '0 €';

  if (total > 0) {
    if (breakdown.length === 1) {
      document.getElementById('res-price-detail').textContent =
        \`\${days} \${days === 1 ? 'deň' : 'dní'} × \${ppd} €/deň\`;
    } else {
      // Viac bicyklov — ukáž súčet za každý ak majú rôznu cenu
      const allSame = breakdown.every(b => b.ppd === breakdown[0].ppd);
      if (allSame) {
        document.getElementById('res-price-detail').textContent =
          \`\${days} \${days === 1 ? 'deň' : 'dní'} × \${breakdown.length} bicykle × \${ppd} €/deň\`;
      } else {
        const detail = breakdown.map(b => {
          const name = bikes.find(x => x.id === b.bikeId)?.name || b.bikeId;
          return \`\${name}: \${b.ppd} €/deň\`;
        }).join(' + ');
        document.getElementById('res-price-detail').textContent =
          \`\${days} \${days === 1 ? 'deň' : 'dní'} · \${detail}\`;
      }
    }
  } else {
    document.getElementById('res-price-detail').textContent = 'Vyberte bicykel a termín';
  }
}

async function submitReservation() {
  const from    = document.getElementById('res-from').value;
  const to      = document.getElementById('res-to').value;
  const name    = document.getElementById('res-name').value.trim();
  const surname = document.getElementById('res-surname').value.trim();
  const phone   = document.getElementById('res-phone').value.trim();
  const email   = document.getElementById('res-email').value.trim();

  if (!selectedBikeIds.length) return alert('Vyberte aspoň jeden bicykel.');
  if (!from || !to)            return alert('Vyberte termín OD a DO.');
  if (from > to)               return alert('Termín OD musí byť skôr ako DO.');
  if (!name || !surname)       return alert('Vyplňte meno a priezvisko.');
  if (!phone && !email)        return alert('Vyplňte telefón alebo e-mail.');

  const { total, days } = calcTotal(selectedBikeIds, from, to);

  const btn = document.getElementById('submit-res-btn');
  btn.disabled     = true;
  btn.textContent  = 'Odosielam...';

  try {
    const result = await apiCall('addReservation', {
      name, surname, phone, email,
      bikeIds: selectedBikeIds,
      from, to, days, total
    });

    const res = { id: result.id, name, surname, phone, email, bikeIds: [...selectedBikeIds], from, to, days, total };
    // Pridaj lokálne okamžite — kalendár sa prekreslí so správnymi bodkami
    // bez čakania na ďalší sieťový požiadavok
    reservations.push(res);
    renderCalendar();

    closeOverlay('overlay-reservation');
    showThankyou(res);
    // Sync na pozadí — aktualizuje dáta zo Sheets (neblokuje UI)
    refreshData();
  } catch (e) {
    alert('Chyba pri odosielaní: ' + e.message);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Odoslať rezerváciu →';
  }
}

function showThankyou(res) {
  const bikeNames = res.bikeIds.map(id => bikes.find(b => b.id === id)?.name || id).join(', ');
  document.getElementById('thankyou-details').innerHTML = \`
    <div class="detail-row"><span class="dk">Zákazník</span><span class="dv">\${res.name} \${res.surname}</span></div>
    <div class="detail-row"><span class="dk">Bicykle</span><span class="dv">\${bikeNames}</span></div>
    <div class="detail-row"><span class="dk">Od</span><span class="dv">\${fmtDate(res.from)}</span></div>
    <div class="detail-row"><span class="dk">Do</span><span class="dv">\${fmtDate(res.to)}</span></div>
    <div class="detail-row"><span class="dk">Počet dní</span><span class="dv">\${res.days}</span></div>
    <div class="detail-row"><span class="dk">Celková cena</span><span class="dv">\${res.total} €</span></div>
    \${res.phone ? \`<div class="detail-row"><span class="dk">Telefón</span><span class="dv">\${res.phone}</span></div>\` : ''}
    \${res.email ? \`<div class="detail-row"><span class="dk">E-mail</span><span class="dv">\${res.email}</span></div>\` : ''}
  \`;
  showView('thankyou');
}

// ═══════════════════════════════════════════════════════════════════
//  DOKUMENTY (zákazník)
// ═══════════════════════════════════════════════════════════════════

function openDocument(id) {
  const doc = documents[id] || getDefaultDocuments()[id];
  if (!doc) return;
  document.getElementById('doc-modal-title').textContent  = doc.title;
  document.getElementById('doc-modal-content').innerHTML  = doc.content;
  openOverlay('overlay-document');
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — REZERVÁCIE
// ═══════════════════════════════════════════════════════════════════

function renderReservationsTable() {
  const tbody = document.getElementById('reservations-tbody');
  tbody.innerHTML = '';
  if (!reservations.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:32px">Žiadne rezervácie</td></tr>';
    return;
  }
  const sorted = [...reservations].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  sorted.forEach((r, i) => {
    const bikeNames = r.bikeIds.map(id => bikes.find(x => x.id === id)?.name || 'Neznámy').join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = \`
      <td><span class="badge badge-blue">#\${i+1}</span></td>
      <td><strong>\${r.name} \${r.surname}</strong></td>
      <td style="font-size:0.8rem">\${r.phone || ''}<br>\${r.email || ''}</td>
      <td style="font-size:0.8rem">\${bikeNames}</td>
      <td style="font-size:0.8rem">\${fmtDate(r.from)}<br>→ \${fmtDate(r.to)}</td>
      <td>\${r.days}</td>
      <td><strong>\${r.total} €</strong></td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="editReservation('\${r.id}')">✏️</button>
        <button class="btn btn-red btn-sm" onclick="deleteReservation('\${r.id}')">🗑</button>
      </div></td>
    \`;
    tbody.appendChild(tr);
  });
}

async function deleteReservation(id) {
  if (!confirm('Naozaj chcete vymazať túto rezerváciu?')) return;
  try {
    await apiCall('deleteReservation', { id });
    reservations = reservations.filter(r => r.id != id);
    renderReservationsTable();
  } catch (e) { alert('Chyba: ' + e.message); }
}

function editReservation(id) {
  const r = reservations.find(x => x.id == id);
  if (!r) return;
  openAdminResModal(r);
}

function openAddReservationModal() { openAdminResModal(null); }

// ID práve editovanej rezervácie v admin formulári (null = nová)
let adminResEditId = null;

function openAdminResModal(res) {
  adminResEditId = res ? res.id : null;
  document.getElementById('admin-res-title').textContent = res ? 'Upraviť rezerváciu' : 'Pridať rezerváciu';

  document.getElementById('admin-res-form').innerHTML = \`
    <input type="hidden" id="arf-id" value="\${res ? res.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>Dátum OD</label><input type="date" id="arf-from" value="\${res ? res.from : ''}" onchange="renderAdminBikeCheckboxes()"></div>
      <div class="form-group"><label>Dátum DO</label><input type="date" id="arf-to" value="\${res ? res.to : ''}" onchange="renderAdminBikeCheckboxes()"></div>
    </div>
    <div style="font-weight:600;font-size:0.88rem;margin-bottom:6px">Bicykle</div>
    <div id="arf-bikes-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>
    <div class="form-row">
      <div class="form-group"><label>Meno</label><input type="text" id="arf-name" value="\${res ? res.name : ''}"></div>
      <div class="form-group"><label>Priezvisko</label><input type="text" id="arf-surname" value="\${res ? res.surname : ''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Telefón</label><input type="tel" id="arf-phone" value="\${res ? res.phone : ''}"></div>
      <div class="form-group"><label>E-mail</label><input type="email" id="arf-email" value="\${res ? res.email : ''}"></div>
    </div>
  \`;

  // Predvyplň checkboxy podľa existujúcej rezervácie
  renderAdminBikeCheckboxes(res ? res.bikeIds : []);
  openOverlay('overlay-admin-res');
}

function renderAdminBikeCheckboxes(preselected) {
  const fromStr  = document.getElementById('arf-from')?.value || '';
  const toStr    = document.getElementById('arf-to')?.value   || '';
  const list     = document.getElementById('arf-bikes-list');
  if (!list) return;

  // Zachovaj aktuálne zaškrtnuté hodnoty (ak preselected nie je zadané)
  const currentChecked = preselected !== undefined
    ? preselected
    : [...document.querySelectorAll('input[name="admin-bike"]:checked')].map(el => parseInt(el.value));

  // Zisti obsadené bicykle pre daný rozsah (vylúč práve editovanú rezerváciu)
  const busyInRange = new Set();
  if (fromStr) {
    const effectiveTo = (toStr && toStr >= fromStr) ? toStr : fromStr;
    datesInRange(fromStr, effectiveTo).forEach(d => {
      getBusyBikes(d, adminResEditId).forEach(id => busyInRange.add(id));
    });
  }

  list.innerHTML = '';
  bikes.forEach(b => {
    const isBusy    = busyInRange.has(b.id);
    const isChecked = currentChecked.includes(b.id);
    // Ak je bicykel obsadený a nebol pôvodne v tejto rezervácii, odznač ho
    const checked   = isChecked && !isBusy;

    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-label';
    wrapper.style.cssText = isBusy
      ? 'opacity:0.45; cursor:not-allowed;'
      : 'cursor:pointer;';

    wrapper.innerHTML = \`
      <input type="checkbox" name="admin-bike" value="\${b.id}"
        \${checked ? 'checked' : ''}
        \${isBusy  ? 'disabled title="Bicykel je obsadený v tomto termíne"' : ''}>
      \${b.emoji || '🚲'} \${b.name} (\${b.size})
      \${isBusy ? '<span style="color:var(--red);font-size:0.78rem;margin-left:4px">— obsadený</span>' : ''}
    \`;
    list.appendChild(wrapper);
  });
}

async function saveAdminReservation() {
  const id      = document.getElementById('arf-id').value;
  const name    = document.getElementById('arf-name').value.trim();
  const surname = document.getElementById('arf-surname').value.trim();
  const phone   = document.getElementById('arf-phone').value.trim();
  const email   = document.getElementById('arf-email').value.trim();
  const from    = document.getElementById('arf-from').value;
  const to      = document.getElementById('arf-to').value;
  const bikeIds = [...document.querySelectorAll('input[name="admin-bike"]:checked')].map(el => parseInt(el.value));

  if (!name || !surname) return alert('Vyplňte meno a priezvisko.');
  if (!bikeIds.length)   return alert('Vyberte aspoň jeden bicykel.');
  if (!from || !to)      return alert('Vyberte termín.');
  if (from > to)         return alert('Termín OD musí byť skôr ako DO.');

  // Záverečná kontrola konfliktov — ochrana pred race condition
  const busyInRange = new Set();
  datesInRange(from, to).forEach(d => {
    getBusyBikes(d, adminResEditId).forEach(bid => busyInRange.add(bid));
  });
  const conflicting = bikeIds.filter(bid => busyInRange.has(bid));
  if (conflicting.length) {
    const names = conflicting.map(bid => bikes.find(b => b.id === bid)?.name || bid).join(', ');
    return alert(\`Bicykel \${names} je už obsadený v zadanom termíne. Vyberte iný termín alebo iný bicykel.\`);
  }

  const { total, days } = calcTotal(bikeIds, from, to);
  const btn = document.getElementById('save-admin-res-btn');
  btn.disabled = true; btn.textContent = 'Ukladám...';

  try {
    if (id) {
      await apiCall('updateReservation', { id, name, surname, phone, email, bikeIds, from, to, days, total });
      const idx = reservations.findIndex(r => r.id == id);
      if (idx >= 0) reservations[idx] = { ...reservations[idx], name, surname, phone, email, bikeIds, from, to, days, total };
    } else {
      const result = await apiCall('addReservation', { name, surname, phone, email, bikeIds, from, to, days, total });
      reservations.push({ id: result.id, name, surname, phone, email, bikeIds, from, to, days, total, createdAt: new Date().toISOString() });
    }
    closeOverlay('overlay-admin-res');
    renderReservationsTable();
  } catch (e) { alert('Chyba: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = 'Uložiť'; }
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — BICYKLE
// ═══════════════════════════════════════════════════════════════════

function renderBikesAdmin() {
  const grid = document.getElementById('bikes-admin-grid');
  grid.innerHTML = '';
  bikes.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bike-admin-card';
    const imgHtml = b.image
      ? \`<img class="bike-admin-img" src="\${b.image}" alt="\${b.name}">\`
      : \`<div class="bike-admin-img-placeholder">\${b.emoji || '🚲'}</div>\`;
    card.innerHTML = \`
      \${imgHtml}
      <div class="bike-admin-body">
        <div class="bike-admin-name">\${b.name}</div>
        <div class="bike-admin-detail"><strong>Veľkosť:</strong> \${b.size}<br>\${b.spec}</div>
        <div style="font-size:0.78rem;color:var(--accent);font-weight:600;margin-top:4px">Cena od \${getMinPricePerDay(b.id)} €/deň</div>
        <div class="bike-admin-actions">
          <button class="btn btn-ghost btn-sm" onclick="editBike(\${b.id})">✏️ Upraviť</button>
        </div>
      </div>
    \`;
    grid.appendChild(card);
  });
}

function editBike(id) {
  editingBikeId = id;
  const b = bikes.find(x => x.id === id);
  document.getElementById('edit-bike-title').textContent = 'Upraviť: ' + b.name;

  // Cenník bicykla — vlastný alebo kópia globálneho
  const bikePricing = (b.pricing && b.pricing.length) ? b.pricing : defaultPricingTiers();

  const pricingRows = bikePricing.map((tier) => \`
    <div class="pricing-row">
      <label>\${tier.label}</label>
      <div class="price-input-wrap">
        <input type="number" value="\${tier.pricePerDay}" min="0" style="width:80px"
          class="eb-price-input"
          data-label="\${tier.label}"
          data-min="\${tier.minDays}"
          data-max="\${tier.maxDays}">
        <span>€ / deň</span>
      </div>
    </div>
  \`).join('');

  document.getElementById('edit-bike-form').innerHTML = \`
    <div class="form-group"><label>Názov modelu</label><input type="text" id="eb-name" value="\${b.name}"></div>
    <div class="form-group"><label>Veľkosť</label><input type="text" id="eb-size" value="\${b.size}"></div>
    <div class="form-group"><label>Špecifikácia</label><textarea id="eb-spec">\${b.spec}</textarea></div>
    <div class="form-group"><label>Emoji ikona</label><input type="text" id="eb-emoji" value="\${b.emoji || '🚲'}"></div>
    <div class="form-group"><label>URL fotografie (voliteľné)</label><input type="text" id="eb-image" value="\${b.image || ''}" placeholder="https://..."></div>
    <div style="margin-top:4px">
      <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--dark);margin-bottom:10px">
        Cenník tohto bicykla
        <span style="font-weight:400;color:var(--muted);text-transform:none;letter-spacing:0">— ukladá sa samostatne pre tento bicykel v Google Sheets</span>
      </div>
      <div style="background:#f9f9f9;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px">
        \${pricingRows}
      </div>
    </div>
  \`;
  openOverlay('overlay-edit-bike');
}

async function saveBike() {
  const b = bikes.find(x => x.id === editingBikeId);
  if (!b) return alert('Bicykel nenájdený.');

  // Čítaj cenník priamo z DOM — každý riadok má data-label, data-min, data-max, value
  const priceInputs = document.querySelectorAll('#edit-bike-form .eb-price-input');
  if (!priceInputs.length) return alert('Cenník nenájdený vo formulári.');

  const bikePricingData = Array.from(priceInputs).map(inp => ({
    label:       inp.dataset.label,
    minDays:     Number(inp.dataset.min),
    maxDays:     Number(inp.dataset.max),
    pricePerDay: parseFloat(inp.value) || 0
  }));

  const data = {
    id:      b.id,
    name:    document.getElementById('eb-name').value.trim(),
    size:    document.getElementById('eb-size').value.trim(),
    spec:    document.getElementById('eb-spec').value.trim(),
    emoji:   document.getElementById('eb-emoji').value.trim(),
    image:   document.getElementById('eb-image').value.trim(),
    pricing: bikePricingData
  };

  const btn = document.getElementById('save-bike-btn');
  btn.disabled = true; btn.textContent = 'Ukladám...';
  try {
    const result = await apiCall('updateBike', data);
    if (!result || result.updated === false) throw new Error('Bicykel nebol nájdený v Sheets.');
    Object.assign(b, { ...data });
    closeOverlay('overlay-edit-bike');
    renderBikesAdmin();
  } catch (e) { alert('Chyba pri ukladaní: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = 'Uložiť zmeny'; }
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — DOKUMENTY
// ═══════════════════════════════════════════════════════════════════

function renderDocumentsEditor() {
  const wrap = document.getElementById('documents-editor');
  wrap.innerHTML = '';
  const docs = Object.keys(documents).length ? documents : getDefaultDocuments();

  const labels = {
    conditions: { icon: 'ℹ️', label: 'Čo by ste mali vedieť pred požičaním bicykla' },
    contract:   { icon: '📄', label: 'Zmluva o vypožičaní bicykla' },
    gdpr:       { icon: '🔒', label: 'Ochrana osobných údajov' }
  };

  Object.entries(docs).forEach(([key, doc]) => {
    const meta  = labels[key] || { icon: '📄', label: doc.title };
    const card  = document.createElement('div');
    card.style.cssText = 'background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px;margin-bottom:20px;';
    card.innerHTML = \`
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-family:Syne,sans-serif;font-size:1.05rem;font-weight:700;color:var(--dark)">\${meta.icon} \${meta.label}</div>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:2px">ID: <code>\${key}</code> — obsah sa zobrazuje zákazníkovi pri kliknutí na odkaz</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="saveDocument('\${key}', this)">💾 Uložiť</button>
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label>Nadpis dokumentu</label>
        <input type="text" id="doc-title-\${key}" value="\${doc.title.replace(/"/g, '&quot;')}">
      </div>
      <div class="form-group">
        <label>Obsah (HTML je povolené — napr. &lt;h4&gt;Nadpis&lt;/h4&gt;&lt;p&gt;Text&lt;/p&gt;)</label>
        <textarea id="doc-content-\${key}" style="min-height:180px;font-family:monospace;font-size:0.82rem">\${doc.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      </div>
      <div style="margin-top:10px">
        <button class="btn btn-ghost btn-sm" onclick="previewDocument('\${key}')">👁 Náhľad</button>
      </div>
    \`;
    wrap.appendChild(card);
  });
}

async function saveDocument(key, btn) {
  const title   = document.getElementById('doc-title-' + key).value.trim();
  const content = document.getElementById('doc-content-' + key).value;
  if (!title) return alert('Vyplňte nadpis dokumentu.');

  btn.disabled = true; btn.textContent = 'Ukladám...';
  try {
    await apiCall('updateDocument', { id: key, title, content });
    documents[key] = { id: key, title, content };
    alert('Dokument bol uložený!');
  } catch (e) { alert('Chyba: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = '💾 Uložiť'; }
}

function previewDocument(key) {
  const title   = document.getElementById('doc-title-' + key).value;
  const content = document.getElementById('doc-content-' + key).value;
  document.getElementById('doc-modal-title').textContent = title;
  document.getElementById('doc-modal-content').innerHTML = content;
  openOverlay('overlay-document');
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — KALENDÁR
// ═══════════════════════════════════════════════════════════════════

function renderAdminCalendar() {
  adminCalYear  = today.getFullYear();
  adminCalMonth = today.getMonth();
  const tabs    = document.getElementById('admin-bike-tabs');
  tabs.innerHTML = '';
  bikes.forEach((b, i) => {
    const tab = document.createElement('button');
    tab.className = 'bike-tab' + (i === 0 ? ' active' : '');
    tab.textContent = (b.emoji || '🚲') + ' ' + b.name;
    tab.onclick = () => {
      document.querySelectorAll('.bike-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      adminCalBikeId = b.id;
      renderAdminCal();
    };
    tabs.appendChild(tab);
  });
  adminCalBikeId = bikes[0]?.id;
  renderAdminCal();
}

function adminChangeMonth(delta) {
  adminCalMonth += delta;
  if (adminCalMonth > 11) { adminCalMonth = 0; adminCalYear++; }
  if (adminCalMonth < 0)  { adminCalMonth = 11; adminCalYear--; }
  renderAdminCal();
}

function renderAdminCal() {
  document.getElementById('admin-cal-month-label').textContent = \`\${MONTHS_SK[adminCalMonth]} \${adminCalYear}\`;
  const grid = document.getElementById('admin-cal-grid');
  grid.innerHTML = '';

  DAYS_SK.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(adminCalYear, adminCalMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  const daysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dtStr  = \`\${adminCalYear}-\${String(adminCalMonth+1).padStart(2,'0')}-\${String(day).padStart(2,'0')}\`;
    const isBusy = getBusyBikes(dtStr).has(adminCalBikeId);
    const el     = document.createElement('div');
    el.className = 'cal-day';
    el.style.cursor = 'default';
    el.innerHTML = \`<div class="day-num">\${day}</div><div class="dots"><div class="dot \${isBusy ? 'busy' : 'avail'}"></div></div>\`;
    grid.appendChild(el);
  }

  // Sidebar rezervácie
  const list     = document.getElementById('admin-cal-res-list');
  list.innerHTML = '';
  const monthRes = reservations.filter(r => {
    if (!r.bikeIds.includes(adminCalBikeId)) return false;
    const rf = new Date(r.from + 'T12:00:00');
    return rf.getFullYear() === adminCalYear && rf.getMonth() === adminCalMonth;
  });
  if (!monthRes.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:0.85rem">Žiadne rezervácie</div>';
  } else {
    monthRes.forEach(r => {
      const item = document.createElement('div');
      item.className = 'mini-res-item';
      item.innerHTML = \`
        <div class="mini-res-name">\${r.name} \${r.surname}</div>
        <div class="mini-res-dates">\${fmtDate(r.from)} – \${fmtDate(r.to)}</div>
        <div class="mini-res-dates">\${r.total} € · \${r.phone || r.email}</div>
      \`;
      list.appendChild(item);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

async function init() {
  const loadingEl = document.getElementById('loading-screen');

  // Embed mód — ak je ?embed=1 v URL, skry hlavičku
  if (new URLSearchParams(window.location.search).get('embed') === '1') {
    document.body.classList.add('embed');
  }
  if (!API_URL) {
    // Žiadna URL — zobraz banner a použij demo dáta
    // config banner disabled
    const dp = defaultPricingTiers();
    bikes = [
      { id:1, name:'Trek Marlin 7',    size:'M (17")', spec:'Horský bicykel, 29" kolesá, hydraulické kotúčové brzdy', emoji:'🚵', image:'', pricing: JSON.parse(JSON.stringify(dp)) },
      { id:2, name:'Scott Aspect 970', size:'L (19")', spec:'Cross-country bicykel, 29" kolesá, mechanické kotúčové brzdy', emoji:'🚴', image:'', pricing: JSON.parse(JSON.stringify(dp)) },
      { id:3, name:'Giant Escape 3',   size:'M (17")', spec:'Mestský bicykel, 700c kolesá, hliníkový rám', emoji:'🚲', image:'', pricing: JSON.parse(JSON.stringify(dp)) }
    ];
    reservations = [];
    documents    = getDefaultDocuments();
    setSyncState('error');
  } else {
    try { await refreshData(); }
    catch (e) { console.warn('Init error:', e); }
  }
  renderCalendar();
  loadingEl.classList.add('hidden');
  setTimeout(() => loadingEl.style.display = 'none', 400);
}

init();

// Dynamická výška iframu — iframe nikdy nemá vlastný scroll
function reportHeight() {
  const anyOpen = document.querySelector('.overlay.open');
  const h = anyOpen
    ? Math.max(document.documentElement.scrollHeight, window.screen.height)
    : document.documentElement.scrollHeight;
  window.parent.postMessage({ type: 'bikeRentalHeight', height: h }, '*');
}
const _ro = new ResizeObserver(reportHeight);
_ro.observe(document.documentElement);
reportHeight();
</script>
<!-- PRICELIST MODAL -->
<div id="pricelist-modal">
  <div id="pricelist-modal-backdrop" onclick="closePriceListModal()"></div>
  <div id="pricelist-modal-box">
    <button class="pl-close" onclick="closePriceListModal()">✕</button>
    <div class="pl-bike-name" id="pricelist-modal-name"></div>
    <table id="pricelist-modal-table"></table>
  </div>
</div>`;
    document.body.appendChild(mc);
  }

  // Skontroluj admin prístup
  if (typeof checkAdminAccess === 'function') checkAdminAccess();
  
  // Spusti hlavnú aplikáciu
  init();
}

// ═══════════════════════════════════════════════════════════════════
//  KONFIGURÁCIA
// ═══════════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = 'admin123';
const API_URL_KEY    = 'bikeRentalApiUrl';

let API_URL = 'https://script.google.com/macros/s/AKfycbwCS6E8GhIDKL5O1jEJbTbJuNX1IWBBzg69aI5HtGzsZJ_gqR2LYZaxqxYbS9Zklyqb/exec';

// ═══════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════

let bikes        = [];
let reservations = [];
let documents    = {};  // { conditions: {id,title,content}, contract: {...}, gdpr: {...} }

let selectedBikeIds      = [];
let editingReservationId = null;
let editingBikeId        = null;

const today    = new Date();
const todayStr = ymd(today);

let calYear  = today.getFullYear();
let calMonth = today.getMonth();

let adminCalYear   = today.getFullYear();
let adminCalMonth  = today.getMonth();
let adminCalBikeId = null;

// ═══════════════════════════════════════════════════════════════════
//  API KOMUNIKÁCIA
// ═══════════════════════════════════════════════════════════════════

function setSyncState(state) {
  const dot   = document.getElementById('sync-dot');
  const label = document.getElementById('sync-label');
  if (dot) dot.className = 'sync-dot ' + (state === 'syncing' ? 'syncing' : state === 'error' ? 'error' : '');
  if (label) label.textContent = state === 'syncing' ? 'Synchronizujem...' : state === 'error' ? 'Chyba spojenia' : 'Online';
}

async function apiCall(action, data = {}) {
  if (!API_URL) throw new Error('API URL nie je nastavené');
  setSyncState('syncing');
  try {
    // Apps Script CORS neumožňuje preflight — všetko posielame ako GET
    // JSON payload idú ako ?payload=... query parameter (zakódovaný)
    const payload = encodeURIComponent(JSON.stringify({ action, ...data }));
    const url     = API_URL + '?payload=' + payload;
    const resp    = await fetch(url, { method: 'GET' });
    const json    = await resp.json();
    if (!json.ok) throw new Error(json.error || 'Chyba servera');
    setSyncState('online');
    return json.data;
  } catch (err) {
    setSyncState('error');
    throw err;
  }
}

async function refreshData() {
  try {
    const data = await apiCall('getAll');
    bikes = (data.bikes || []).map(b => {
      if (typeof b.pricing === 'string') {
        try { b.pricing = JSON.parse(b.pricing); } catch { b.pricing = []; }
      }
      if (!Array.isArray(b.pricing) || !b.pricing.length) b.pricing = defaultPricingTiers();
      return b;
    });
    reservations = data.reservations || [];
    documents    = data.documents    || getDefaultDocuments();
    renderCalendar();
  } catch (e) {
    console.warn('Chyba načítania:', e.message);
  }
}

function defaultPricingTiers() {
  return [
    { label:'1 deň',       minDays:1,  maxDays:1,    pricePerDay:45 },
    { label:'2 dni',       minDays:2,  maxDays:2,    pricePerDay:40 },
    { label:'3 – 5 dní',   minDays:3,  maxDays:5,    pricePerDay:35 },
    { label:'6 – 7 dní',   minDays:6,  maxDays:7,    pricePerDay:30 },
    { label:'8 – 15 dní',  minDays:8,  maxDays:15,   pricePerDay:27 },
    { label:'15 – 30 dní', minDays:15, maxDays:30,   pricePerDay:25 },
    { label:'30+ dní',     minDays:31, maxDays:9999,  pricePerDay:23 }
  ];
}

function getDefaultDocuments() {
  return {
    conditions: {
      id: 'conditions',
      title: 'Čo by ste mali vedieť pred požičaním bicykla',
      content: '<h4>1. Prevzatie bicykla</h4><p>Zákazník je povinný skontrolovať stav bicykla pri prevzatí. Akékoľvek poškodenia musia byť nahlásené pred odchodom.</p><h4>2. Zodpovednosť za škody</h4><p>V prípade poškodenia, straty alebo odcudzenia bicykla je zákazník povinný uhradiť plnú náhradu škody.</p><h4>3. Vrátenie bicykla</h4><p>Bicykel musí byť vrátený v rovnakom stave ako pri prevzatí, včas podľa dohodnutého termínu. Za oneskorené vrátenie si požičovňa vyhradzuje právo účtovať príplatok.</p><h4>4. Pravidlá používania</h4><p>Bicykel je dovolené používať iba na bežnú cestnú a turistickú jazdu. Je zakázané používať bicykel na extrémne športy alebo ho prenajímať ďalším osobám.</p><h4>5. Bezpečnosť</h4><p>Zákazník je povinný jazdiť s prílbou a dodržiavať všetky pravidlá cestnej premávky.</p><h4>6. Stornovanie</h4><p>Pri stornovaní menej ako 24 hodín pred termínom môže byť účtovaný storno poplatok vo výške 20% z celkovej ceny.</p>'
    },
    contract: {
      id: 'contract',
      title: 'Zmluva o vypožičaní bicykla',
      content: '<h4>Zmluvné strany</h4><p>Požičovňa bicyklov (ďalej len „Prenajímateľ") a zákazník (ďalej len „Nájomca") uzatvárajú túto zmluvu o vypožičaní bicykla.</p><h4>Predmet zmluvy</h4><p>Prenajímateľ odovzdáva Nájomcovi do dočasného užívania bicykel v stave zodpovedajúcom bežnému opotrebeniu. Nájomca sa zaväzuje vrátiť bicykel v rovnakom stave v dohodnutom termíne.</p><h4>Cena a platba</h4><p>Cena za prenájom je stanovená podľa aktuálneho cenníka požičovne. Platba prebieha pri prevzatí bicykla.</p><h4>Zodpovednosť</h4><p>Nájomca preberá plnú zodpovednosť za bicykel od momentu prevzatia až do jeho vrátenia. V prípade poškodenia alebo straty je Nájomca povinný uhradiť škodu v plnej výške.</p><h4>Záverečné ustanovenia</h4><p>Odoslaním rezervácie Nájomca potvrdzuje, že sa oboznámil s podmienkami tejto zmluvy a súhlasí s nimi.</p>'
    },
    gdpr: {
      id: 'gdpr',
      title: 'Ochrana osobných údajov',
      content: '<h4>Správca osobných údajov</h4><p>Vaše osobné údaje spracúva požičovňa bicyklov ako správca v súlade s nariadením GDPR a zákonom č. 18/2018 Z.z. o ochrane osobných údajov.</p><h4>Účel spracovania</h4><p>Osobné údaje (meno, priezvisko, telefón, e-mail) spracúvame výlučne za účelom vybavenia rezervácie a prípadnej komunikácie súvisiacej s prenájmom bicykla.</p><h4>Doba uchovávania</h4><p>Osobné údaje uchovávame po dobu nevyhnutnú na splnenie účelu, najdlhšie však 3 roky od uskutočnenia prenájmu.</p><h4>Vaše práva</h4><p>Máte právo na prístup k svojim údajom, ich opravu, vymazanie alebo obmedzenie spracovania. Máte tiež právo podať sťažnosť na Úrad na ochranu osobných údajov SR.</p><h4>Kontakt</h4><p>V prípade otázok týkajúcich sa spracovania osobných údajov nás kontaktujte prostredníctvom kontaktných údajov požičovne.</p>'
    }
  };
}

// ═══════════════════════════════════════════════════════════════════
//  NAVIGÁCIA
// ═══════════════════════════════════════════════════════════════════

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');
  if (name === 'customer') {
    renderCalendar();
    refreshData();
  }
}

function openOverlay(id) {
  document.getElementById(id).classList.add('open');
  reportHeight();
}
function closeOverlay(id) {
  document.getElementById(id).classList.remove('open');
  reportHeight();
}

function checkAdminAccess() {
  const btn = document.getElementById('admin-header-btn');
  if (!btn) return;
  if (window.location.hash === '#admin-jericho' || sessionStorage.getItem('adminLoggedIn') === '1') {
    btn.style.display = 'inline-flex';
  } else {
    btn.style.display = 'none';
  }
}
window.addEventListener('hashchange', checkAdminAccess);

function showAdminEntry() {
  if (sessionStorage.getItem('adminLoggedIn') === '1') {
    showView('admin');
    renderReservationsTable();
  } else {
    showView('admin-login');
  }
}

function adminLogin() {
  if (document.getElementById('admin-pass').value === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLoggedIn', '1');
    document.getElementById('login-error').style.display = 'none';
    showView('admin');
    renderReservationsTable();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function adminLogout() {
  sessionStorage.removeItem('adminLoggedIn');
  showView('customer');
}

function showAdminPanel(name, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  document.getElementById('panel-' + name).classList.add('active');
  if (el) el.classList.add('active');
  if (name === 'reservations') renderReservationsTable();
  if (name === 'bikes')        renderBikesAdmin();
  if (name === 'calendar')     renderAdminCalendar();
  if (name === 'documents')    renderDocumentsEditor();
}

function showApiConfig() {
  const banner = document.getElementById('config-banner');
  banner.classList.toggle('show');
  if (API_URL) document.getElementById('api-url-input').value = API_URL;
}

function saveApiUrl() {
  const val = document.getElementById('api-url-input').value.trim();
  if (!val) return alert('Zadajte URL.');
  API_URL = val;
  localStorage.setItem(API_URL_KEY, val);
  document.getElementById('config-banner').classList.remove('show');
  // Detekcia iframe — skry hlavičku
if (window.self !== window.top) {
  document.body.classList.add('in-iframe');
}

init();
}

// ═══════════════════════════════════════════════════════════════════
//  POMOCNÉ FUNKCIE
// ═══════════════════════════════════════════════════════════════════

function fmtDate(d) {
  if (!d) return '';
  return new Date(d + 'T12:00:00').toLocaleDateString('sk-SK', { day:'2-digit', month:'2-digit', year:'numeric' });
}
function ymd(d) {
  const dt = typeof d === 'string' ? new Date(d + 'T12:00:00') : d;
  return dt.toISOString().slice(0, 10);
}
function datesInRange(from, to) {
  const dates = [];
  let cur = new Date(from + 'T12:00:00');
  const end = new Date(to + 'T12:00:00');
  while (cur <= end) { dates.push(ymd(cur)); cur.setDate(cur.getDate() + 1); }
  return dates;
}

function getBikePricing(bikeId) {
  const b = bikes.find(x => x.id === bikeId);
  return (b && b.pricing && b.pricing.length) ? b.pricing : defaultPricingTiers();
}

function getMinPricePerDay(bikeId) {
  const p = getBikePricing(bikeId);
  return p.length ? Math.min(...p.map(t => t.pricePerDay)) : 0;
}

function getPricePerDayForBike(days, bikeId) {
  const p = getBikePricing(bikeId);
  for (const tier of p) {
    if (days >= tier.minDays && days <= tier.maxDays) return tier.pricePerDay;
  }
  return p.length ? p[p.length - 1].pricePerDay : 0;
}

function calcTotal(bikeIds, from, to) {
  if (!bikeIds.length || !from || !to) return { total: 0, days: 0, ppd: 0, breakdown: [] };
  const d1   = new Date(from + 'T12:00:00');
  const d2   = new Date(to   + 'T12:00:00');
  const days = Math.round((d2 - d1) / 86400000);
  if (days <= 0) return { total: 0, days: 0, ppd: 0, breakdown: [] };

  // Každý bicykel má vlastnú cenu/deň
  let total = 0;
  const breakdown = [];
  bikeIds.forEach(bid => {
    const ppd = getPricePerDayForBike(days, bid);
    total += ppd * days;
    breakdown.push({ bikeId: bid, ppd, subtotal: ppd * days });
  });
  // ppd = priemer pre zobrazenie (ak je len 1 bicykel, je to presné)
  const ppd = bikeIds.length === 1 ? breakdown[0].ppd : Math.round(total / days / bikeIds.length);
  return { total, days, ppd, breakdown };
}

function getBusyBikes(dateStr, excludeResId = null) {
  const busy = new Set();
  for (const r of reservations) {
    if (excludeResId && r.id == excludeResId) continue;
    if (datesInRange(r.from, r.to).includes(dateStr)) {
      r.bikeIds.forEach(id => busy.add(id));
    }
  }
  return busy;
}

// ═══════════════════════════════════════════════════════════════════
//  KALENDÁR (ZÁKAZNÍK)
// ═══════════════════════════════════════════════════════════════════

const MONTHS_SK = ['Január','Február','Marec','Apríl','Máj','Jún','Júl','August','September','Október','November','December'];
const DAYS_SK   = ['Po','Ut','St','Št','Pi','So','Ne'];

function changeMonth(delta) {
  calMonth += delta;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('cal-month-label').textContent = `${MONTHS_SK[calMonth]} ${calYear}`;
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  DAYS_SK.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(calYear, calMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dtStr  = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isPast = dtStr < todayStr;
    const busySet = getBusyBikes(dtStr);

    const el = document.createElement('div');
    el.className = 'cal-day' + (isPast ? ' past' : '') + (dtStr === todayStr ? ' today' : '');

    const numEl = document.createElement('div');
    numEl.className = 'day-num';
    numEl.textContent = day;
    el.appendChild(numEl);

    const dots = document.createElement('div');
    dots.className = 'dots';
    bikes.forEach(b => {
      const dot = document.createElement('div');
      dot.className = 'dot ' + (busySet.has(b.id) ? 'busy' : 'avail');
      dot.title = b.name + ': ' + (busySet.has(b.id) ? 'Obsadené' : 'K dispozícii');
      dots.appendChild(dot);
    });
    el.appendChild(dots);

    if (!isPast) el.onclick = () => openReservationModal(dtStr);
    grid.appendChild(el);
  }
}

// ═══════════════════════════════════════════════════════════════════
//  REZERVAČNÝ FORMULÁR
// ═══════════════════════════════════════════════════════════════════

function openReservationModal(dateStr) {
  selectedBikeIds      = [];
  editingReservationId = null;
  document.getElementById('res-from').value    = dateStr;
  document.getElementById('res-from').min      = todayStr;
  document.getElementById('res-to').value      = '';
  document.getElementById('res-to').min        = dateStr;
  document.getElementById('res-name').value    = '';
  document.getElementById('res-surname').value = '';
  document.getElementById('res-phone').value   = '';
  document.getElementById('res-email').value   = '';
  document.getElementById('res-modal-sub').textContent = `Vybratý dátum: ${fmtDate(dateStr)}`;
  renderResBikesGrid();
  recalcPrice();
  openOverlay('overlay-reservation');
}

function renderResBikesGrid() {
  const grid    = document.getElementById('res-bikes-grid');
  const fromStr = document.getElementById('res-from').value;
  const toStr   = document.getElementById('res-to').value;
  grid.innerHTML = '';

  const busyForRange = new Set();
  // Ak je zadané aspoň OD, skontroluj obsadenosť od toho dátumu.
  // Ak je zadané aj DO, skontroluj celý rozsah. Ak nie, stačí samotný FROM deň.
  if (fromStr) {
    const effectiveTo = (toStr && toStr >= fromStr) ? toStr : fromStr;
    datesInRange(fromStr, effectiveTo).forEach(d => {
      getBusyBikes(d, editingReservationId).forEach(id => busyForRange.add(id));
    });
  }

  bikes.forEach(b => {
    // Ak bol bicykel už vybraný zákazníkom, neskrývame ho (môže ho odznačiť)
    const unavail = busyForRange.has(b.id) && !selectedBikeIds.includes(b.id);
    const sel     = selectedBikeIds.includes(b.id);
    const card    = document.createElement('div');
    card.className = 'bike-card' + (sel ? ' selected' : '') + (unavail ? ' unavailable' : '');

    const imgHtml = b.image
      ? `<img src="${b.image}" alt="${b.name}">`
      : `<div class="bike-img-placeholder">${b.emoji || '🚲'}</div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="bike-name">${b.name}</div>
      <div class="bike-size">Veľkosť: ${b.size}</div>
      <div class="bike-spec">${b.spec}</div>
      <div class="bike-price">Cena od ${getMinPricePerDay(b.id)} €/deň</div>
      <button class="bike-pricelist-link" onclick="openPriceListModal(event, ${b.id})">Zobraziť kompletný cenník</button>
      <div class="bike-check">✓</div>
    `;
    if (!unavail) card.onclick = () => toggleBike(b.id);
    grid.appendChild(card);
  });
}

function openPriceListModal(e, bikeId) {
  e.stopPropagation();
  const b = bikes.find(x => x.id === bikeId);
  if (!b) return;
  const tiers = getBikePricing(bikeId);
  document.getElementById('pricelist-modal-name').textContent = b.name + ' – cenník';
  document.getElementById('pricelist-modal-table').innerHTML = tiers.map(t =>
    `<tr><td>${t.label}</td><td>${t.pricePerDay} €/deň</td></tr>`
  ).join('');
  document.getElementById('pricelist-modal').classList.add('open');
}

function closePriceListModal() {
  document.getElementById('pricelist-modal').classList.remove('open');
}

function toggleBike(id) {
  const idx = selectedBikeIds.indexOf(id);
  if (idx >= 0) selectedBikeIds.splice(idx, 1);
  else selectedBikeIds.push(id);
  renderResBikesGrid();
  recalcPrice();
}

function onResDateChange() {
  const from = document.getElementById('res-from').value;
  const to   = document.getElementById('res-to').value;
  if (from) document.getElementById('res-to').min = from;
  if (to && to < from) document.getElementById('res-to').value = '';
  renderResBikesGrid();
  recalcPrice();
}

function recalcPrice() {
  const from = document.getElementById('res-from').value;
  const to   = document.getElementById('res-to').value;
  const { total, days, ppd, breakdown } = calcTotal(selectedBikeIds, from, to);
  document.getElementById('res-price-total').textContent = total > 0 ? total + ' €' : '0 €';

  if (total > 0) {
    if (breakdown.length === 1) {
      document.getElementById('res-price-detail').textContent =
        `${days} ${days === 1 ? 'deň' : 'dní'} × ${ppd} €/deň`;
    } else {
      // Viac bicyklov — ukáž súčet za každý ak majú rôznu cenu
      const allSame = breakdown.every(b => b.ppd === breakdown[0].ppd);
      if (allSame) {
        document.getElementById('res-price-detail').textContent =
          `${days} ${days === 1 ? 'deň' : 'dní'} × ${breakdown.length} bicykle × ${ppd} €/deň`;
      } else {
        const detail = breakdown.map(b => {
          const name = bikes.find(x => x.id === b.bikeId)?.name || b.bikeId;
          return `${name}: ${b.ppd} €/deň`;
        }).join(' + ');
        document.getElementById('res-price-detail').textContent =
          `${days} ${days === 1 ? 'deň' : 'dní'} · ${detail}`;
      }
    }
  } else {
    document.getElementById('res-price-detail').textContent = 'Vyberte bicykel a termín';
  }
}

async function submitReservation() {
  const from    = document.getElementById('res-from').value;
  const to      = document.getElementById('res-to').value;
  const name    = document.getElementById('res-name').value.trim();
  const surname = document.getElementById('res-surname').value.trim();
  const phone   = document.getElementById('res-phone').value.trim();
  const email   = document.getElementById('res-email').value.trim();

  if (!selectedBikeIds.length) return alert('Vyberte aspoň jeden bicykel.');
  if (!from || !to)            return alert('Vyberte termín OD a DO.');
  if (from > to)               return alert('Termín OD musí byť skôr ako DO.');
  if (!name || !surname)       return alert('Vyplňte meno a priezvisko.');
  if (!phone && !email)        return alert('Vyplňte telefón alebo e-mail.');

  const { total, days } = calcTotal(selectedBikeIds, from, to);

  const btn = document.getElementById('submit-res-btn');
  btn.disabled     = true;
  btn.textContent  = 'Odosielam...';

  try {
    const result = await apiCall('addReservation', {
      name, surname, phone, email,
      bikeIds: selectedBikeIds,
      from, to, days, total
    });

    const res = { id: result.id, name, surname, phone, email, bikeIds: [...selectedBikeIds], from, to, days, total };
    // Pridaj lokálne okamžite — kalendár sa prekreslí so správnymi bodkami
    // bez čakania na ďalší sieťový požiadavok
    reservations.push(res);
    renderCalendar();

    closeOverlay('overlay-reservation');
    showThankyou(res);
    // Sync na pozadí — aktualizuje dáta zo Sheets (neblokuje UI)
    refreshData();
  } catch (e) {
    alert('Chyba pri odosielaní: ' + e.message);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Odoslať rezerváciu →';
  }
}

function showThankyou(res) {
  const bikeNames = res.bikeIds.map(id => bikes.find(b => b.id === id)?.name || id).join(', ');
  document.getElementById('thankyou-details').innerHTML = `
    <div class="detail-row"><span class="dk">Zákazník</span><span class="dv">${res.name} ${res.surname}</span></div>
    <div class="detail-row"><span class="dk">Bicykle</span><span class="dv">${bikeNames}</span></div>
    <div class="detail-row"><span class="dk">Od</span><span class="dv">${fmtDate(res.from)}</span></div>
    <div class="detail-row"><span class="dk">Do</span><span class="dv">${fmtDate(res.to)}</span></div>
    <div class="detail-row"><span class="dk">Počet dní</span><span class="dv">${res.days}</span></div>
    <div class="detail-row"><span class="dk">Celková cena</span><span class="dv">${res.total} €</span></div>
    ${res.phone ? `<div class="detail-row"><span class="dk">Telefón</span><span class="dv">${res.phone}</span></div>` : ''}
    ${res.email ? `<div class="detail-row"><span class="dk">E-mail</span><span class="dv">${res.email}</span></div>` : ''}
  `;
  showView('thankyou');
}

// ═══════════════════════════════════════════════════════════════════
//  DOKUMENTY (zákazník)
// ═══════════════════════════════════════════════════════════════════

function openDocument(id) {
  const doc = documents[id] || getDefaultDocuments()[id];
  if (!doc) return;
  document.getElementById('doc-modal-title').textContent  = doc.title;
  document.getElementById('doc-modal-content').innerHTML  = doc.content;
  openOverlay('overlay-document');
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — REZERVÁCIE
// ═══════════════════════════════════════════════════════════════════

function renderReservationsTable() {
  const tbody = document.getElementById('reservations-tbody');
  tbody.innerHTML = '';
  if (!reservations.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:32px">Žiadne rezervácie</td></tr>';
    return;
  }
  const sorted = [...reservations].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  sorted.forEach((r, i) => {
    const bikeNames = r.bikeIds.map(id => bikes.find(x => x.id === id)?.name || 'Neznámy').join(', ');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><span class="badge badge-blue">#${i+1}</span></td>
      <td><strong>${r.name} ${r.surname}</strong></td>
      <td style="font-size:0.8rem">${r.phone || ''}<br>${r.email || ''}</td>
      <td style="font-size:0.8rem">${bikeNames}</td>
      <td style="font-size:0.8rem">${fmtDate(r.from)}<br>→ ${fmtDate(r.to)}</td>
      <td>${r.days}</td>
      <td><strong>${r.total} €</strong></td>
      <td><div style="display:flex;gap:6px">
        <button class="btn btn-ghost btn-sm" onclick="editReservation('${r.id}')">✏️</button>
        <button class="btn btn-red btn-sm" onclick="deleteReservation('${r.id}')">🗑</button>
      </div></td>
    `;
    tbody.appendChild(tr);
  });
}

async function deleteReservation(id) {
  if (!confirm('Naozaj chcete vymazať túto rezerváciu?')) return;
  try {
    await apiCall('deleteReservation', { id });
    reservations = reservations.filter(r => r.id != id);
    renderReservationsTable();
  } catch (e) { alert('Chyba: ' + e.message); }
}

function editReservation(id) {
  const r = reservations.find(x => x.id == id);
  if (!r) return;
  openAdminResModal(r);
}

function openAddReservationModal() { openAdminResModal(null); }

// ID práve editovanej rezervácie v admin formulári (null = nová)
let adminResEditId = null;

function openAdminResModal(res) {
  adminResEditId = res ? res.id : null;
  document.getElementById('admin-res-title').textContent = res ? 'Upraviť rezerváciu' : 'Pridať rezerváciu';

  document.getElementById('admin-res-form').innerHTML = `
    <input type="hidden" id="arf-id" value="${res ? res.id : ''}">
    <div class="form-row">
      <div class="form-group"><label>Dátum OD</label><input type="date" id="arf-from" value="${res ? res.from : ''}" onchange="renderAdminBikeCheckboxes()"></div>
      <div class="form-group"><label>Dátum DO</label><input type="date" id="arf-to" value="${res ? res.to : ''}" onchange="renderAdminBikeCheckboxes()"></div>
    </div>
    <div style="font-weight:600;font-size:0.88rem;margin-bottom:6px">Bicykle</div>
    <div id="arf-bikes-list" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px"></div>
    <div class="form-row">
      <div class="form-group"><label>Meno</label><input type="text" id="arf-name" value="${res ? res.name : ''}"></div>
      <div class="form-group"><label>Priezvisko</label><input type="text" id="arf-surname" value="${res ? res.surname : ''}"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Telefón</label><input type="tel" id="arf-phone" value="${res ? res.phone : ''}"></div>
      <div class="form-group"><label>E-mail</label><input type="email" id="arf-email" value="${res ? res.email : ''}"></div>
    </div>
  `;

  // Predvyplň checkboxy podľa existujúcej rezervácie
  renderAdminBikeCheckboxes(res ? res.bikeIds : []);
  openOverlay('overlay-admin-res');
}

function renderAdminBikeCheckboxes(preselected) {
  const fromStr  = document.getElementById('arf-from')?.value || '';
  const toStr    = document.getElementById('arf-to')?.value   || '';
  const list     = document.getElementById('arf-bikes-list');
  if (!list) return;

  // Zachovaj aktuálne zaškrtnuté hodnoty (ak preselected nie je zadané)
  const currentChecked = preselected !== undefined
    ? preselected
    : [...document.querySelectorAll('input[name="admin-bike"]:checked')].map(el => parseInt(el.value));

  // Zisti obsadené bicykle pre daný rozsah (vylúč práve editovanú rezerváciu)
  const busyInRange = new Set();
  if (fromStr) {
    const effectiveTo = (toStr && toStr >= fromStr) ? toStr : fromStr;
    datesInRange(fromStr, effectiveTo).forEach(d => {
      getBusyBikes(d, adminResEditId).forEach(id => busyInRange.add(id));
    });
  }

  list.innerHTML = '';
  bikes.forEach(b => {
    const isBusy    = busyInRange.has(b.id);
    const isChecked = currentChecked.includes(b.id);
    // Ak je bicykel obsadený a nebol pôvodne v tejto rezervácii, odznač ho
    const checked   = isChecked && !isBusy;

    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-label';
    wrapper.style.cssText = isBusy
      ? 'opacity:0.45; cursor:not-allowed;'
      : 'cursor:pointer;';

    wrapper.innerHTML = `
      <input type="checkbox" name="admin-bike" value="${b.id}"
        ${checked ? 'checked' : ''}
        ${isBusy  ? 'disabled title="Bicykel je obsadený v tomto termíne"' : ''}>
      ${b.emoji || '🚲'} ${b.name} (${b.size})
      ${isBusy ? '<span style="color:var(--red);font-size:0.78rem;margin-left:4px">— obsadený</span>' : ''}
    `;
    list.appendChild(wrapper);
  });
}

async function saveAdminReservation() {
  const id      = document.getElementById('arf-id').value;
  const name    = document.getElementById('arf-name').value.trim();
  const surname = document.getElementById('arf-surname').value.trim();
  const phone   = document.getElementById('arf-phone').value.trim();
  const email   = document.getElementById('arf-email').value.trim();
  const from    = document.getElementById('arf-from').value;
  const to      = document.getElementById('arf-to').value;
  const bikeIds = [...document.querySelectorAll('input[name="admin-bike"]:checked')].map(el => parseInt(el.value));

  if (!name || !surname) return alert('Vyplňte meno a priezvisko.');
  if (!bikeIds.length)   return alert('Vyberte aspoň jeden bicykel.');
  if (!from || !to)      return alert('Vyberte termín.');
  if (from > to)         return alert('Termín OD musí byť skôr ako DO.');

  // Záverečná kontrola konfliktov — ochrana pred race condition
  const busyInRange = new Set();
  datesInRange(from, to).forEach(d => {
    getBusyBikes(d, adminResEditId).forEach(bid => busyInRange.add(bid));
  });
  const conflicting = bikeIds.filter(bid => busyInRange.has(bid));
  if (conflicting.length) {
    const names = conflicting.map(bid => bikes.find(b => b.id === bid)?.name || bid).join(', ');
    return alert(`Bicykel ${names} je už obsadený v zadanom termíne. Vyberte iný termín alebo iný bicykel.`);
  }

  const { total, days } = calcTotal(bikeIds, from, to);
  const btn = document.getElementById('save-admin-res-btn');
  btn.disabled = true; btn.textContent = 'Ukladám...';

  try {
    if (id) {
      await apiCall('updateReservation', { id, name, surname, phone, email, bikeIds, from, to, days, total });
      const idx = reservations.findIndex(r => r.id == id);
      if (idx >= 0) reservations[idx] = { ...reservations[idx], name, surname, phone, email, bikeIds, from, to, days, total };
    } else {
      const result = await apiCall('addReservation', { name, surname, phone, email, bikeIds, from, to, days, total });
      reservations.push({ id: result.id, name, surname, phone, email, bikeIds, from, to, days, total, createdAt: new Date().toISOString() });
    }
    closeOverlay('overlay-admin-res');
    renderReservationsTable();
  } catch (e) { alert('Chyba: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = 'Uložiť'; }
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — BICYKLE
// ═══════════════════════════════════════════════════════════════════

function renderBikesAdmin() {
  const grid = document.getElementById('bikes-admin-grid');
  grid.innerHTML = '';
  bikes.forEach(b => {
    const card = document.createElement('div');
    card.className = 'bike-admin-card';
    const imgHtml = b.image
      ? `<img class="bike-admin-img" src="${b.image}" alt="${b.name}">`
      : `<div class="bike-admin-img-placeholder">${b.emoji || '🚲'}</div>`;
    card.innerHTML = `
      ${imgHtml}
      <div class="bike-admin-body">
        <div class="bike-admin-name">${b.name}</div>
        <div class="bike-admin-detail"><strong>Veľkosť:</strong> ${b.size}<br>${b.spec}</div>
        <div style="font-size:0.78rem;color:var(--accent);font-weight:600;margin-top:4px">Cena od ${getMinPricePerDay(b.id)} €/deň</div>
        <div class="bike-admin-actions">
          <button class="btn btn-ghost btn-sm" onclick="editBike(${b.id})">✏️ Upraviť</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function editBike(id) {
  editingBikeId = id;
  const b = bikes.find(x => x.id === id);
  document.getElementById('edit-bike-title').textContent = 'Upraviť: ' + b.name;

  // Cenník bicykla — vlastný alebo kópia globálneho
  const bikePricing = (b.pricing && b.pricing.length) ? b.pricing : defaultPricingTiers();

  const pricingRows = bikePricing.map((tier) => `
    <div class="pricing-row">
      <label>${tier.label}</label>
      <div class="price-input-wrap">
        <input type="number" value="${tier.pricePerDay}" min="0" style="width:80px"
          class="eb-price-input"
          data-label="${tier.label}"
          data-min="${tier.minDays}"
          data-max="${tier.maxDays}">
        <span>€ / deň</span>
      </div>
    </div>
  `).join('');

  document.getElementById('edit-bike-form').innerHTML = `
    <div class="form-group"><label>Názov modelu</label><input type="text" id="eb-name" value="${b.name}"></div>
    <div class="form-group"><label>Veľkosť</label><input type="text" id="eb-size" value="${b.size}"></div>
    <div class="form-group"><label>Špecifikácia</label><textarea id="eb-spec">${b.spec}</textarea></div>
    <div class="form-group"><label>Emoji ikona</label><input type="text" id="eb-emoji" value="${b.emoji || '🚲'}"></div>
    <div class="form-group"><label>URL fotografie (voliteľné)</label><input type="text" id="eb-image" value="${b.image || ''}" placeholder="https://..."></div>
    <div style="margin-top:4px">
      <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.4px;color:var(--dark);margin-bottom:10px">
        Cenník tohto bicykla
        <span style="font-weight:400;color:var(--muted);text-transform:none;letter-spacing:0">— ukladá sa samostatne pre tento bicykel v Google Sheets</span>
      </div>
      <div style="background:#f9f9f9;border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px">
        ${pricingRows}
      </div>
    </div>
  `;
  openOverlay('overlay-edit-bike');
}

async function saveBike() {
  const b = bikes.find(x => x.id === editingBikeId);
  if (!b) return alert('Bicykel nenájdený.');

  // Čítaj cenník priamo z DOM — každý riadok má data-label, data-min, data-max, value
  const priceInputs = document.querySelectorAll('#edit-bike-form .eb-price-input');
  if (!priceInputs.length) return alert('Cenník nenájdený vo formulári.');

  const bikePricingData = Array.from(priceInputs).map(inp => ({
    label:       inp.dataset.label,
    minDays:     Number(inp.dataset.min),
    maxDays:     Number(inp.dataset.max),
    pricePerDay: parseFloat(inp.value) || 0
  }));

  const data = {
    id:      b.id,
    name:    document.getElementById('eb-name').value.trim(),
    size:    document.getElementById('eb-size').value.trim(),
    spec:    document.getElementById('eb-spec').value.trim(),
    emoji:   document.getElementById('eb-emoji').value.trim(),
    image:   document.getElementById('eb-image').value.trim(),
    pricing: bikePricingData
  };

  const btn = document.getElementById('save-bike-btn');
  btn.disabled = true; btn.textContent = 'Ukladám...';
  try {
    const result = await apiCall('updateBike', data);
    if (!result || result.updated === false) throw new Error('Bicykel nebol nájdený v Sheets.');
    Object.assign(b, { ...data });
    closeOverlay('overlay-edit-bike');
    renderBikesAdmin();
  } catch (e) { alert('Chyba pri ukladaní: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = 'Uložiť zmeny'; }
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — DOKUMENTY
// ═══════════════════════════════════════════════════════════════════

function renderDocumentsEditor() {
  const wrap = document.getElementById('documents-editor');
  wrap.innerHTML = '';
  const docs = Object.keys(documents).length ? documents : getDefaultDocuments();

  const labels = {
    conditions: { icon: 'ℹ️', label: 'Čo by ste mali vedieť pred požičaním bicykla' },
    contract:   { icon: '📄', label: 'Zmluva o vypožičaní bicykla' },
    gdpr:       { icon: '🔒', label: 'Ochrana osobných údajov' }
  };

  Object.entries(docs).forEach(([key, doc]) => {
    const meta  = labels[key] || { icon: '📄', label: doc.title };
    const card  = document.createElement('div');
    card.style.cssText = 'background:var(--card);border-radius:var(--radius);box-shadow:var(--shadow);padding:24px;margin-bottom:20px;';
    card.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <div style="font-family:Syne,sans-serif;font-size:1.05rem;font-weight:700;color:var(--dark)">${meta.icon} ${meta.label}</div>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:2px">ID: <code>${key}</code> — obsah sa zobrazuje zákazníkovi pri kliknutí na odkaz</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="saveDocument('${key}', this)">💾 Uložiť</button>
      </div>
      <div class="form-group" style="margin-bottom:10px">
        <label>Nadpis dokumentu</label>
        <input type="text" id="doc-title-${key}" value="${doc.title.replace(/"/g, '&quot;')}">
      </div>
      <div class="form-group">
        <label>Obsah (HTML je povolené — napr. &lt;h4&gt;Nadpis&lt;/h4&gt;&lt;p&gt;Text&lt;/p&gt;)</label>
        <textarea id="doc-content-${key}" style="min-height:180px;font-family:monospace;font-size:0.82rem">${doc.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
      </div>
      <div style="margin-top:10px">
        <button class="btn btn-ghost btn-sm" onclick="previewDocument('${key}')">👁 Náhľad</button>
      </div>
    `;
    wrap.appendChild(card);
  });
}

async function saveDocument(key, btn) {
  const title   = document.getElementById('doc-title-' + key).value.trim();
  const content = document.getElementById('doc-content-' + key).value;
  if (!title) return alert('Vyplňte nadpis dokumentu.');

  btn.disabled = true; btn.textContent = 'Ukladám...';
  try {
    await apiCall('updateDocument', { id: key, title, content });
    documents[key] = { id: key, title, content };
    alert('Dokument bol uložený!');
  } catch (e) { alert('Chyba: ' + e.message); }
  finally { btn.disabled = false; btn.textContent = '💾 Uložiť'; }
}

function previewDocument(key) {
  const title   = document.getElementById('doc-title-' + key).value;
  const content = document.getElementById('doc-content-' + key).value;
  document.getElementById('doc-modal-title').textContent = title;
  document.getElementById('doc-modal-content').innerHTML = content;
  openOverlay('overlay-document');
}

// ═══════════════════════════════════════════════════════════════════
//  ADMIN — KALENDÁR
// ═══════════════════════════════════════════════════════════════════

function renderAdminCalendar() {
  adminCalYear  = today.getFullYear();
  adminCalMonth = today.getMonth();
  const tabs    = document.getElementById('admin-bike-tabs');
  tabs.innerHTML = '';
  bikes.forEach((b, i) => {
    const tab = document.createElement('button');
    tab.className = 'bike-tab' + (i === 0 ? ' active' : '');
    tab.textContent = (b.emoji || '🚲') + ' ' + b.name;
    tab.onclick = () => {
      document.querySelectorAll('.bike-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      adminCalBikeId = b.id;
      renderAdminCal();
    };
    tabs.appendChild(tab);
  });
  adminCalBikeId = bikes[0]?.id;
  renderAdminCal();
}

function adminChangeMonth(delta) {
  adminCalMonth += delta;
  if (adminCalMonth > 11) { adminCalMonth = 0; adminCalYear++; }
  if (adminCalMonth < 0)  { adminCalMonth = 11; adminCalYear--; }
  renderAdminCal();
}

function renderAdminCal() {
  document.getElementById('admin-cal-month-label').textContent = `${MONTHS_SK[adminCalMonth]} ${adminCalYear}`;
  const grid = document.getElementById('admin-cal-grid');
  grid.innerHTML = '';

  DAYS_SK.forEach(d => {
    const el = document.createElement('div');
    el.className = 'cal-dow';
    el.textContent = d;
    grid.appendChild(el);
  });

  const firstDay    = new Date(adminCalYear, adminCalMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  for (let i = 0; i < startOffset; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day empty';
    grid.appendChild(el);
  }

  const daysInMonth = new Date(adminCalYear, adminCalMonth + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dtStr  = `${adminCalYear}-${String(adminCalMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const isBusy = getBusyBikes(dtStr).has(adminCalBikeId);
    const el     = document.createElement('div');
    el.className = 'cal-day';
    el.style.cursor = 'default';
    el.innerHTML = `<div class="day-num">${day}</div><div class="dots"><div class="dot ${isBusy ? 'busy' : 'avail'}"></div></div>`;
    grid.appendChild(el);
  }

  // Sidebar rezervácie
  const list     = document.getElementById('admin-cal-res-list');
  list.innerHTML = '';
  const monthRes = reservations.filter(r => {
    if (!r.bikeIds.includes(adminCalBikeId)) return false;
    const rf = new Date(r.from + 'T12:00:00');
    return rf.getFullYear() === adminCalYear && rf.getMonth() === adminCalMonth;
  });
  if (!monthRes.length) {
    list.innerHTML = '<div style="color:var(--muted);font-size:0.85rem">Žiadne rezervácie</div>';
  } else {
    monthRes.forEach(r => {
      const item = document.createElement('div');
      item.className = 'mini-res-item';
      item.innerHTML = `
        <div class="mini-res-name">${r.name} ${r.surname}</div>
        <div class="mini-res-dates">${fmtDate(r.from)} – ${fmtDate(r.to)}</div>
        <div class="mini-res-dates">${r.total} € · ${r.phone || r.email}</div>
      `;
      list.appendChild(item);
    });
  }
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════

async function init() {
  const loadingEl = document.getElementById('loading-screen');

  // Embed mód — ak je ?embed=1 v URL, skry hlavičku
  if (new URLSearchParams(window.location.search).get('embed') === '1') {
    document.body.classList.add('embed');
  }
  if (!API_URL) {
    // Žiadna URL — zobraz banner a použij demo dáta
    // config banner disabled
    const dp = defaultPricingTiers();
    bikes = [
      { id:1, name:'Trek Marlin 7',    size:'M (17")', spec:'Horský bicykel, 29" kolesá, hydraulické kotúčové brzdy', emoji:'🚵', image:'', pricing: JSON.parse(JSON.stringify(dp)) },
      { id:2, name:'Scott Aspect 970', size:'L (19")', spec:'Cross-country bicykel, 29" kolesá, mechanické kotúčové brzdy', emoji:'🚴', image:'', pricing: JSON.parse(JSON.stringify(dp)) },
      { id:3, name:'Giant Escape 3',   size:'M (17")', spec:'Mestský bicykel, 700c kolesá, hliníkový rám', emoji:'🚲', image:'', pricing: JSON.parse(JSON.stringify(dp)) }
    ];
    reservations = [];
    documents    = getDefaultDocuments();
    setSyncState('error');
  } else {
    try { await refreshData(); }
    catch (e) { console.warn('Init error:', e); }
  }
  renderCalendar();
  const loadingEl = document.getElementById('loading-screen');
  if (loadingEl) { loadingEl.classList.add('hidden'); setTimeout(() => loadingEl.style.display = 'none', 400); }
}

init();

// Dynamická výška iframu — iframe nikdy nemá vlastný scroll
function reportHeight() {
  const anyOpen = document.querySelector('.overlay.open');
  const h = anyOpen
    ? Math.max(document.documentElement.scrollHeight, window.screen.height)
    : document.documentElement.scrollHeight;
  window.parent.postMessage({ type: 'bikeRentalHeight', height: h }, '*');
}
const _ro = new ResizeObserver(reportHeight);
_ro.observe(document.documentElement);
reportHeight();

// Spusti keď je DOM pripravený
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bikeRentalInit);
} else {
  // DOM je už pripravený
  bikeRentalInit();
}
