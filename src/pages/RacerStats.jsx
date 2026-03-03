import React, { useEffect, useRef } from "react";

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Racer Analytics Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root {
      --bg: #060c1a;
      --bg-deep: #030810;
      --panel: #0a1628;
      --panel-border: #0f2040;
      --panel-hover: #0d1e38;
      --accent: #00d4ff;
      --accent2: #7c3aed;
      --accent3: #10b981;
      --accent4: #f59e0b;
      --danger: #ef4444;
      --accent-glow: rgba(0,212,255,0.15);
      --accent2-glow: rgba(124,58,237,0.15);
      --text: #e2e8f0;
      --text-muted: #64748b;
      --text-dim: #94a3b8;
      --mono: 'JetBrains Mono', 'Courier New', monospace;
      --sans: 'Inter', system-ui, sans-serif;
      --radius: 10px;
      --radius-sm: 6px;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body { height: 100%; background: var(--bg-deep); }

    body {
      font-family: var(--sans);
      background:
        radial-gradient(ellipse at 10% 0%, rgba(0,212,255,0.05) 0%, transparent 55%),
        radial-gradient(ellipse at 90% 100%, rgba(124,58,237,0.07) 0%, transparent 55%),
        var(--bg-deep);
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }

    /* ===== SCROLLBAR ===== */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: var(--bg-deep); }
    ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 99px; }
    ::-webkit-scrollbar-thumb:hover { background: #2a4f7c; }

    /* ===== SHELL ===== */
    .shell {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px 40px;
    }

    /* ===== TOP NAV ===== */
    .topnav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 58px;
      background: rgba(6,12,26,0.95);
      border-bottom: 1px solid var(--panel-border);
      backdrop-filter: blur(20px);
      position: sticky;
      top: 0;
      z-index: 100;
      gap: 16px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .nav-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, #00d4ff 0%, #0090cc 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
      color: #000;
      letter-spacing: -1px;
      flex-shrink: 0;
      box-shadow: 0 0 20px rgba(0,212,255,0.4);
    }

    .nav-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--text);
      letter-spacing: 0.01em;
    }

    .nav-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 1px;
    }

    .nav-center {
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: linear-gradient(90deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px rgba(16,185,129,0.7);
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.85); }
    }

    .status-text {
      font-size: 11px;
      color: #10b981;
      font-weight: 500;
    }

    /* ===== UPLOAD SECTION ===== */
    #uploadSection {
      padding: 80px 0;
    }

    .upload-zone {
      max-width: 580px;
      margin: 0 auto;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 48px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
    }

    .upload-zone::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 30% 20%, rgba(0,212,255,0.08) 0%, transparent 60%),
        radial-gradient(circle at 80% 80%, rgba(124,58,237,0.08) 0%, transparent 60%);
      pointer-events: none;
    }

    .upload-zone.drag-over {
      border-color: var(--accent);
      transform: scale(1.01);
    }

    .upload-icon-wrap {
      width: 72px;
      height: 72px;
      margin: 0 auto 24px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, rgba(0,212,255,0.25), rgba(0,212,255,0.05));
      border: 1px solid rgba(0,212,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 0 30px rgba(0,212,255,0.15);
    }

    .upload-heading {
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--text);
    }

    .upload-desc {
      font-size: 13px;
      color: var(--text-muted);
      margin-bottom: 28px;
      line-height: 1.6;
    }

    .upload-desc code {
      font-family: var(--mono);
      color: var(--accent);
      font-size: 12px;
    }

    .upload-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 28px;
      background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05));
      border: 1px solid rgba(0,212,255,0.5);
      border-radius: 99px;
      color: var(--accent);
      font-family: var(--sans);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.01em;
    }

    .upload-btn:hover {
      background: linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,212,255,0.1));
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(0,212,255,0.2);
      transform: translateY(-1px);
    }

    .upload-note {
      margin-top: 16px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .upload-hidden-input { display: none; }

    /* ===== DASHBOARD ===== */
    #dashboard { display: none; }

    /* ===== DASH HEADER ===== */
    .dash-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid var(--panel-border);
      margin-bottom: 16px;
    }

    .racer-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 99px;
      background: linear-gradient(90deg, rgba(0,212,255,0.12), rgba(124,58,237,0.08));
      border: 1px solid rgba(0,212,255,0.25);
      font-size: 12px;
      color: var(--accent);
      font-family: var(--mono);
    }

    .racer-badge-label {
      color: var(--text-muted);
      font-family: var(--sans);
      font-size: 11px;
    }

    .live-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 99px;
      border: 1px solid rgba(16,185,129,0.35);
      background: rgba(16,185,129,0.08);
      font-size: 11px;
      color: #10b981;
    }

    /* ===== FILTER BAR ===== */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      align-items: flex-end;
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius);
      padding: 12px 16px;
      margin-bottom: 16px;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 130px;
      flex: 1 1 130px;
    }

    .filter-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
    }

    select,
    input[type="date"],
    input[type="search"] {
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius-sm);
      color: var(--text);
      font-size: 12px;
      font-family: var(--sans);
      padding: 7px 10px;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      min-height: 34px;
    }

    select:focus,
    input:focus {
      border-color: rgba(0,212,255,0.5);
      box-shadow: 0 0 0 2px rgba(0,212,255,0.1);
    }

    select option { background: #0a1628; }

    .btn-reset {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 7px 14px;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: var(--radius-sm);
      color: #ef4444;
      font-size: 11px;
      font-family: var(--sans);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .btn-reset:hover {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.5);
    }

    /* ===== SUMMARY STAT CARDS ===== */
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius);
      padding: 14px 14px 12px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s, transform 0.2s;
      cursor: default;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), transparent);
      opacity: 0.6;
    }

    .stat-card:nth-child(2)::before { background: linear-gradient(90deg, #10b981, transparent); }
    .stat-card:nth-child(3)::before { background: linear-gradient(90deg, #f59e0b, transparent); }
    .stat-card:nth-child(4)::before { background: linear-gradient(90deg, var(--accent2), transparent); }
    .stat-card:nth-child(5)::before { background: linear-gradient(90deg, #ef4444, transparent); }
    .stat-card:nth-child(6)::before { background: linear-gradient(90deg, #06b6d4, transparent); }
    .stat-card:nth-child(7)::before { background: linear-gradient(90deg, #84cc16, transparent); }

    .stat-card:hover {
      border-color: rgba(0,212,255,0.3);
      transform: translateY(-2px);
    }

    .stat-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 800;
      color: var(--text);
      line-height: 1;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
      font-family: var(--mono);
    }

    .stat-sub {
      font-size: 10px;
      color: var(--text-muted);
    }

    .stat-icon {
      position: absolute;
      top: 12px;
      right: 12px;
      font-size: 18px;
      opacity: 0.25;
    }

    /* ===== SECTION PANELS ===== */
    .section {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: var(--radius);
      overflow: hidden;
      transition: border-color 0.2s;
    }

    .section:hover {
      border-color: #132040;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid var(--panel-border);
      background: rgba(0,0,0,0.15);
    }

    .section-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
    }

    .section-subtitle {
      font-size: 11px;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .section-badge {
      font-size: 10px;
      padding: 3px 8px;
      border-radius: 99px;
      background: rgba(0,212,255,0.1);
      border: 1px solid rgba(0,212,255,0.2);
      color: var(--accent);
      font-weight: 600;
    }

    .section-body {
      padding: 14px 16px;
    }

    /* ===== GRID LAYOUTS ===== */
    .grid-2 {
      display: grid;
      grid-template-columns: minmax(0,1.3fr) minmax(0,1fr);
      gap: 12px;
      margin-bottom: 12px;
    }

    .grid-equal {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    /* ===== CHART ===== */
    .chart-container {
      width: 100%;
      height: 200px;
    }

    /* ===== TABLES ===== */
    .table-wrapper { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th {
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 8px 10px;
      border-bottom: 1px solid var(--panel-border);
      white-space: nowrap;
      background: rgba(0,0,0,0.1);
    }

    td {
      padding: 7px 10px;
      border-bottom: 1px solid rgba(15,32,64,0.7);
      color: var(--text-dim);
      white-space: nowrap;
    }

    tbody tr:hover { background: var(--panel-hover); }

    tbody tr:last-child td { border-bottom: none; }

    .sortable { cursor: pointer; user-select: none; }
    .sortable:hover { color: var(--accent); }

    .sortable span.indicator { margin-left: 4px; opacity: 0.4; }

    /* Placement rank bars */
    .rank-bar-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .rank-bar {
      height: 6px;
      border-radius: 99px;
      background: linear-gradient(90deg, var(--accent), rgba(0,212,255,0.3));
      min-width: 4px;
      transition: width 0.4s;
    }

    /* Position badge */
    .pos-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 20px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      font-family: var(--mono);
    }

    .pos-1 { background: rgba(251,191,36,0.2); color: #fbbf24; border: 1px solid rgba(251,191,36,0.3); }
    .pos-2 { background: rgba(148,163,184,0.15); color: #94a3b8; border: 1px solid rgba(148,163,184,0.2); }
    .pos-3 { background: rgba(180,83,9,0.2); color: #d97706; border: 1px solid rgba(180,83,9,0.3); }
    .pos-other { background: rgba(100,116,139,0.1); color: var(--text-muted); border: 1px solid rgba(100,116,139,0.15); }

    /* ===== ACCORDION / BREAKDOWNS ===== */
    .accordion-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    details.breakdown {
      border-radius: var(--radius-sm);
      border: 1px solid var(--panel-border);
      background: rgba(0,0,0,0.2);
      overflow: hidden;
      transition: border-color 0.15s;
    }

    details.breakdown[open] {
      border-color: rgba(0,212,255,0.25);
      background: rgba(0,0,0,0.3);
    }

    details.breakdown > summary {
      list-style: none;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      transition: background 0.15s;
    }

    details.breakdown > summary:hover { background: rgba(0,212,255,0.04); }
    details.breakdown > summary::-webkit-details-marker { display: none; }

    .breakdown-title {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-dim);
    }

    .breakdown-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    .breakdown-meta span {
      font-size: 10px;
      color: var(--text-muted);
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      border-radius: 4px;
      padding: 2px 7px;
    }

    .breakdown-meta strong { color: var(--accent); }

    .breakdown-chevron {
      font-size: 11px;
      color: var(--text-muted);
      flex-shrink: 0;
      transition: transform 0.2s;
    }

    details[open] .breakdown-chevron { transform: rotate(180deg); }

    .breakdown-content {
      padding: 0 12px 10px;
      animation: fadeSlide 0.15s ease-out;
    }

    @keyframes fadeSlide {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .metric-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 8px 0; }

    .metric-pill {
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      font-size: 10px;
      color: var(--text-muted);
    }

    .metric-pill strong { color: var(--accent); }

    /* ===== HEATMAP ===== */
    .heatmap-grid { display: flex; flex-wrap: wrap; gap: 2px; margin-top: 8px; }

    .heat-cell {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background: rgba(0,212,255,0.05);
    }

    .heat-cell[data-level="1"] { background: rgba(0,212,255,0.2); }
    .heat-cell[data-level="2"] { background: rgba(0,212,255,0.4); }
    .heat-cell[data-level="3"] { background: rgba(0,212,255,0.65); }
    .heat-cell[data-level="4"] { background: rgba(0,212,255,0.9); box-shadow: 0 0 4px rgba(0,212,255,0.5); }

    .heatmap-legend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 6px;
    }

    /* ===== RACE LOG ===== */
    .log-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }

    .log-search {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .log-search input {
      width: 240px;
    }

    .pagination {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--text-muted);
    }

    .pagination button {
      padding: 4px 10px;
      background: rgba(0,0,0,0.3);
      border: 1px solid var(--panel-border);
      border-radius: 4px;
      color: var(--text-dim);
      font-family: var(--sans);
      font-size: 11px;
      cursor: pointer;
      transition: border-color 0.15s;
    }

    .pagination button:hover:not(:disabled) {
      border-color: rgba(0,212,255,0.4);
      color: var(--accent);
    }

    .pagination button:disabled { opacity: 0.3; cursor: default; }

    /* ===== MISC ===== */
    .mono { font-family: var(--mono); }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .muted { color: var(--text-muted); }
    .accent { color: var(--accent); }

    .empty-state {
      padding: 20px;
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
    }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 1100px) {
      .summary-grid { grid-template-columns: repeat(4, 1fr); }
    }

    @media (max-width: 820px) {
      .grid-2, .grid-equal { grid-template-columns: 1fr; }
      .summary-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .summary-grid { grid-template-columns: 1fr 1fr; }
      .log-search input { width: 180px; }
    }

    /* ===== DIVIDER ===== */
    .section-divider {
      height: 1px;
      background: linear-gradient(90deg, rgba(0,212,255,0.15), transparent);
      margin: 16px 0;
    }
  </style>
</head>
<body>

<!-- Top Nav -->
<nav class="topnav">
  <div class="nav-brand">
    <div class="nav-logo">R</div>
    <div>
      <div class="nav-title">RacerStats</div>
      <div class="nav-subtitle">Performance Analytics</div>
    </div>
  </div>
  <div class="nav-center">Race Data Dashboard</div>
  <div class="nav-right">
    <div class="status-dot"></div>
    <span class="status-text">Client-side · No server</span>
  </div>
</nav>

<div class="shell">

  <!-- Upload Section -->
  <section id="uploadSection">
    <div class="upload-zone" id="uploadBox">
      <div class="upload-icon-wrap">🏎</div>
      <h2 class="upload-heading">Load Your Race Data</h2>
      <p class="upload-desc">
        Drag &amp; drop your <code>racer_profile.json</code> file here, or click below to browse.<br/>
        All processing happens locally — your data never leaves this tab.
      </p>
      <button class="upload-btn" type="button" id="uploadButton">
        ↑ &nbsp;Select racer_profile.json
      </button>
      <p class="upload-note">JSON must contain a top-level <code class="mono" style="color:var(--accent);font-size:11px;">racer_id</code> and <code class="mono" style="color:var(--accent);font-size:11px;">races</code> array.</p>
      <input class="upload-hidden-input" type="file" id="fileInput" accept=".json,application/json"/>
    </div>
  </section>

  <!-- Dashboard -->
  <section id="dashboard">

    <!-- Dash Header -->
    <div class="dash-header">
      <div class="racer-badge">
        <span class="racer-badge-label">RACER ID</span>
        <span id="racerIdText" class="mono">—</span>
      </div>
      <div class="live-chip">
        <span style="width:6px;height:6px;border-radius:50%;background:#10b981;display:inline-block;"></span>
        Live Filters Active
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">Track</span>
        <select id="filterTrack"><option value="">All Tracks</option></select>
      </div>
      <div class="filter-group">
        <span class="filter-label">Car / Vehicle</span>
        <select id="filterCar"><option value="">All Cars</option></select>
      </div>
      <div class="filter-group">
        <span class="filter-label">From Date</span>
        <input type="date" id="filterDateFrom"/>
      </div>
      <div class="filter-group">
        <span class="filter-label">To Date</span>
        <input type="date" id="filterDateTo"/>
      </div>
      <div style="display:flex;align-items:flex-end;">
        <button class="btn-reset" type="button" id="resetFiltersBtn">✕ Reset</button>
      </div>
    </div>

    <!-- Summary KPI Cards -->
    <div class="summary-grid" id="summaryCards"></div>

    <!-- Row 1: Placement + Activity -->
    <div class="grid-2">
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Placement Distribution</div>
            <div class="section-subtitle">Finishes by position — count &amp; percentage</div>
          </div>
          <span class="section-badge">Bar Chart</span>
        </div>
        <div class="section-body">
          <div class="chart-container"><canvas id="placementChart"></canvas></div>
          <div class="table-wrapper" style="margin-top:10px;" id="placementTableWrapper"></div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Race Activity by Day</div>
            <div class="section-subtitle">Volume over time · <span id="mostActiveMonth" class="mono accent"></span></div>
          </div>
          <span class="section-badge">Timeline</span>
        </div>
        <div class="section-body">
          <div class="chart-container"><canvas id="activityChart"></canvas></div>
          <div style="margin-top:10px;">
            <div class="section-subtitle" style="margin-bottom:6px;">Activity Heatmap</div>
            <div class="heatmap-grid" id="activityHeatmap"></div>
            <div class="heatmap-legend">
              <span>Less</span>
              <span class="heat-cell" data-level="1"></span>
              <span class="heat-cell" data-level="2"></span>
              <span class="heat-cell" data-level="3"></span>
              <span class="heat-cell" data-level="4"></span>
              <span>More</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Row 2: Avg by Track / Car -->
    <div class="grid-equal">
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Avg Placement by Track</div>
            <div class="section-subtitle">Best to worst performance</div>
          </div>
          <span class="section-badge">Ranked</span>
        </div>
        <div class="section-body table-wrapper" id="avgByTrackTable"></div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Avg Placement by Car</div>
            <div class="section-subtitle">Best to worst performance</div>
          </div>
          <span class="section-badge">Ranked</span>
        </div>
        <div class="section-body table-wrapper" id="avgByCarTable"></div>
      </section>
    </div>

    <!-- Row 3: Track & Car Breakdowns -->
    <div class="grid-equal">
      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Track Breakdown</div>
            <div class="section-subtitle">Per-track stats &amp; race logs</div>
          </div>
        </div>
        <div class="section-body">
          <div class="accordion-list" id="trackBreakdown"></div>
        </div>
      </section>

      <section class="section">
        <div class="section-header">
          <div>
            <div class="section-title">Car Breakdown</div>
            <div class="section-subtitle">Per-vehicle stats &amp; race logs</div>
          </div>
        </div>
        <div class="section-body">
          <div class="accordion-list" id="carBreakdown"></div>
        </div>
      </section>
    </div>

    <!-- Row 4: Combo Analytics -->
    <section class="section" style="margin-bottom:12px;">
      <div class="section-header">
        <div>
          <div class="section-title">Track + Car Combo Analytics</div>
          <div class="section-subtitle">Sortable combinations ranked by usage and performance</div>
        </div>
        <span class="section-badge">Sortable</span>
      </div>
      <div class="section-body table-wrapper" id="comboAnalytics"></div>
    </section>

    <!-- Row 5: Full Race Log -->
    <section class="section">
      <div class="section-header">
        <div>
          <div class="section-title">Full Race Log</div>
          <div class="section-subtitle">Searchable · Sortable · Paginated</div>
        </div>
        <span class="section-badge">Log</span>
      </div>
      <div class="section-body">
        <div class="log-header">
          <div class="log-search">
            <span class="filter-label">Search</span>
            <input type="search" id="logSearchInput" placeholder="Track, car, weather, ID…"/>
          </div>
          <div class="pagination" id="logPagination"></div>
        </div>
        <div class="table-wrapper" id="raceLogTableWrapper"></div>
      </div>
    </section>

  </section><!-- /dashboard -->
</div><!-- /shell -->

<script>
  let allRaces = [];
  let rawProfile = null;
  const filters = { track:"", car:"", from:"", to:"" };
  const chartState = { placementChart:null, activityChart:null };
  const raceLogState = { sortKey:"race_datetime", sortDir:"desc", page:1, pageSize:25, search:"" };

  const $ = id => document.getElementById(id);

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return dateStr.split(" ")[0];
  }

  function monthKey(dateStr) {
    const d = new Date(dateStr.replace(" ","T"));
    if (Number.isNaN(d.getTime())) return "";
    return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0");
  }

  function niceMonthLabel(key) {
    if (!key) return "—";
    const [y,m] = key.split("-");
    return new Date(+y,+m-1,1).toLocaleString(undefined,{month:"short",year:"numeric"});
  }

  function getFilteredRaces() {
    return allRaces.filter(r => {
      if (filters.track && r.track !== filters.track) return false;
      if (filters.car && r.vehicle_name !== filters.car) return false;
      const d = r.race_datetime.split(" ")[0];
      if (filters.from && d < filters.from) return false;
      if (filters.to && d > filters.to) return false;
      return true;
    });
  }

  function aggregateBasics(races) {
    const total = races.length;
    if (!total) return { total,avgPlacement:0,best:null,worst:null,placements:{},tracks:{},cars:{},combos:{},weather:{},days:{},combosDetail:{} };
    let sumPos=0, best=Infinity, worst=-Infinity;
    const placements={}, tracks={}, cars={}, combos={}, combosDetail={}, weather={}, days={};
    for (const r of races) {
      const pos = Number(r.position);
      sumPos += pos;
      if (pos<best) best=pos;
      if (pos>worst) worst=pos;
      placements[pos] = (placements[pos]||0)+1;
      tracks[r.track] = (tracks[r.track]||0)+1;
      cars[r.vehicle_name] = (cars[r.vehicle_name]||0)+1;
      weather[r.weather] = (weather[r.weather]||0)+1;
      const ck = r.track+"__"+r.vehicle_name;
      combos[ck] = (combos[ck]||0)+1;
      if (!combosDetail[ck]) combosDetail[ck]={track:r.track,car:r.vehicle_name,count:0,sumPos:0,best:Infinity};
      const cd = combosDetail[ck];
      cd.count+=1; cd.sumPos+=pos;
      if (pos<cd.best) cd.best=pos;
      const day = r.race_datetime.split(" ")[0];
      days[day] = (days[day]||0)+1;
    }
    return { total,avgPlacement:sumPos/total,best,worst,placements,tracks,cars,combos,weather,days,combosDetail };
  }

  function topKey(map) {
    const e = Object.entries(map||{});
    if (!e.length) return null;
    return e.sort((a,b)=>b[1]-a[1])[0][0];
  }

  function posClass(p) {
    if (p===1) return 'pos-1';
    if (p===2) return 'pos-2';
    if (p===3) return 'pos-3';
    return 'pos-other';
  }

  // ---- Summary Cards ----
  function renderSummary(races) {
    const el = $("summaryCards");
    const b = aggregateBasics(races);
    if (!b.total) { el.innerHTML='<div class="empty-state">No races match current filters.</div>'; return; }

    const mostTrack = topKey(b.tracks)||"—";
    const mostCar = topKey(b.cars)||"—";
    const mostWeather = topKey(b.weather)||"—";
    const mostDay = topKey(b.days)||"—";
    let topCombo="—";
    if (Object.keys(b.combos).length) {
      const [ck]=Object.entries(b.combos).sort((a,c)=>c[1]-a[1])[0];
      const [t,c]=ck.split("__");
      topCombo=t+" / "+c;
    }

    const cards = [
      { label:"Total Races", val:b.total.toLocaleString(), sub:"All filtered races", icon:"🏁" },
      { label:"Avg Placement", val:b.avgPlacement.toFixed(2), sub:"Best: "+b.best+" · Worst: "+b.worst, icon:"📊" },
      { label:"Top Track", val:mostTrack, sub:"Most raced location", icon:"🗺" },
      { label:"Top Vehicle", val:mostCar, sub:"Primary ride", icon:"🚗" },
      { label:"Best Combo", val:topCombo, sub:"Highest-used pairing", icon:"⚡" },
      { label:"Weather", val:mostWeather, sub:"Most common conditions", icon:"🌤" },
      { label:"Peak Day", val:mostDay, sub:"Most active date", icon:"📅" },
    ];

    el.innerHTML = cards.map(c=>\`
      <div class="stat-card">
        <div class="stat-label">\${c.label}</div>
        <div class="stat-value mono">\${c.val}</div>
        <div class="stat-sub">\${c.sub}</div>
        <div class="stat-icon">\${c.icon}</div>
      </div>
    \`).join("");
  }

  // ---- Placement Chart ----
  function renderPlacementAnalytics(races) {
    const wrapper = $("placementTableWrapper");
    const b = aggregateBasics(races);
    if (!b.total) {
      wrapper.innerHTML='<div class="empty-state">No data.</div>';
      if (chartState.placementChart) { chartState.placementChart.data.labels=[]; chartState.placementChart.data.datasets[0].data=[]; chartState.placementChart.update(); }
      return;
    }
    const entries = Object.entries(b.placements).map(([pos,count])=>({pos:+pos,count})).sort((a,c)=>a.pos-c.pos);
    const labels = entries.map(e=>e.pos);
    const counts = entries.map(e=>e.count);
    const maxPct = Math.max(...counts);

    const ctx = $("placementChart").getContext("2d");
    const grad = ctx.createLinearGradient(0,0,0,200);
    grad.addColorStop(0,"rgba(0,212,255,0.8)");
    grad.addColorStop(1,"rgba(0,212,255,0.15)");

    if (!chartState.placementChart) {
      chartState.placementChart = new Chart(ctx, {
        type:"bar",
        data:{ labels, datasets:[{ label:"Finishes", data:counts, backgroundColor:grad, borderRadius:5, maxBarThickness:30 }] },
        options:{
          responsive:true, maintainAspectRatio:false,
          plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label(c){ const cnt=c.parsed.y||0; return cnt+" finishes ("+((cnt/b.total)*100).toFixed(1)+"%)"; } } } },
          scales:{
            x:{ grid:{display:false}, ticks:{color:"#475569",font:{size:10,family:"JetBrains Mono"}} },
            y:{ grid:{color:"rgba(15,32,64,0.8)"}, ticks:{color:"#475569",font:{size:10},precision:0} }
          }
        }
      });
    } else {
      chartState.placementChart.data.labels=labels;
      chartState.placementChart.data.datasets[0].data=counts;
      chartState.placementChart.update();
    }

    const rows = entries.map(e=>{
      const pct=((e.count/b.total)*100).toFixed(1);
      const barW=Math.max(4,Math.round((e.count/maxPct)*80));
      return \`<tr>
        <td class="text-center"><span class="pos-badge \${posClass(e.pos)}">\${e.pos}</span></td>
        <td class="mono text-right">\${e.count.toLocaleString()}</td>
        <td><div class="rank-bar-wrap"><div class="rank-bar" style="width:\${barW}px"></div><span class="mono" style="font-size:10px;color:var(--text-muted)">\${pct}%</span></div></td>
      </tr>\`;
    }).join("");

    wrapper.innerHTML=\`<table>
      <thead><tr><th class="text-center">Pos</th><th class="text-right">Count</th><th>Share</th></tr></thead>
      <tbody>\${rows}</tbody>
    </table>\`;
  }

  // ---- Avg Placement Tables ----
  function renderAvgPlacementTables(races) {
    const byTrack={}, byCar={};
    for (const r of races) {
      const pos=+r.position;
      if (!byTrack[r.track]) byTrack[r.track]={name:r.track,count:0,sum:0};
      if (!byCar[r.vehicle_name]) byCar[r.vehicle_name]={name:r.vehicle_name,count:0,sum:0};
      byTrack[r.track].count+=1; byTrack[r.track].sum+=pos;
      byCar[r.vehicle_name].count+=1; byCar[r.vehicle_name].sum+=pos;
    }

    const tracksArr=Object.values(byTrack).map(t=>({...t,avg:t.sum/t.count})).sort((a,b)=>a.avg-b.avg);
    const carsArr=Object.values(byCar).map(t=>({...t,avg:t.sum/t.count})).sort((a,b)=>a.avg-b.avg);
    const maxT = tracksArr.length ? Math.max(...tracksArr.map(t=>t.count)) : 1;
    const maxC = carsArr.length ? Math.max(...carsArr.map(t=>t.count)) : 1;

    const mkRows = (arr,max,isTrack)=>arr.map((t,i)=>
      \`<tr>
        <td style="font-size:10px;color:var(--text-muted);width:24px">\${i+1}</td>
        <td>\${t.name}</td>
        <td class="mono text-right" style="color:var(--accent)">\${t.avg.toFixed(2)}</td>
        <td><div class="rank-bar-wrap"><div class="rank-bar" style="width:\${Math.max(4,Math.round((t.count/max)*60))}px;background:linear-gradient(90deg,#7c3aed,rgba(124,58,237,0.2))"></div><span class="mono" style="font-size:10px;color:var(--text-muted)">\${t.count}</span></div></td>
      </tr>\`
    ).join("");

    const makeTable=(arr,max,label1)=> arr.length===0
      ? '<div class="empty-state">No data.</div>'
      : \`<table><thead><tr><th>#</th><th>\${label1}</th><th class="text-right">Avg Fin.</th><th>Races</th></tr></thead><tbody>\${mkRows(arr,max)}</tbody></table>\`;

    $("avgByTrackTable").innerHTML=makeTable(tracksArr,maxT,"Track");
    $("avgByCarTable").innerHTML=makeTable(carsArr,maxC,"Car");
  }

  // ---- Breakdown Accordions ----
  function computeGroupStats(races) {
    let best=Infinity, worst=-Infinity, sum=0;
    const carCounts={}, trackCounts={};
    for (const r of races) {
      const pos=+r.position;
      sum+=pos;
      if(pos<best)best=pos;
      if(pos>worst)worst=pos;
      carCounts[r.vehicle_name]=(carCounts[r.vehicle_name]||0)+1;
      trackCounts[r.track]=(trackCounts[r.track]||0)+1;
    }
    return {
      total:races.length,
      avg:races.length?sum/races.length:0,
      best:Number.isFinite(best)?best:null,
      worst:Number.isFinite(worst)?worst:null,
      mostCar:topKey(carCounts),
      mostTrack:topKey(trackCounts)
    };
  }

  function buildAccordion(container, groupMap, groupKeys, innerRows, extraMetaFn) {
    const frag=document.createDocumentFragment();
    for (const key of groupKeys) {
      const groupRaces=groupMap[key].slice().sort((a,b)=>a.race_datetime>b.race_datetime?-1:1);
      const stats=computeGroupStats(groupRaces);
      const det=document.createElement("details");
      det.className="breakdown";
      const sum_el=document.createElement("summary");
      sum_el.innerHTML=\`
        <div class="breakdown-title">\${key}</div>
        <div class="breakdown-meta">
          <span>Races: <strong>\${stats.total.toLocaleString()}</strong></span>
          <span>Avg: <strong>\${stats.avg.toFixed(2)}</strong></span>
          <span>Best: <strong>\${stats.best??"—"}</strong></span>
          <span>Worst: <strong>\${stats.worst??"—"}</strong></span>
        </div>
        <div class="breakdown-chevron">▾</div>
      \`;
      const content=document.createElement("div");
      content.className="breakdown-content";
      content.innerHTML=\`
        <div class="metric-row">\${extraMetaFn(stats)}</div>
        <div class="table-wrapper">
          <table>
            <thead><tr>\${innerRows.headers}</tr></thead>
            <tbody>\${groupRaces.map(r=>innerRows.row(r)).join("")}</tbody>
          </table>
        </div>
      \`;
      det.appendChild(sum_el);
      det.appendChild(content);
      frag.appendChild(det);
    }
    container.innerHTML="";
    container.appendChild(frag);
  }

  function renderTrackBreakdown(races) {
    const container=$("trackBreakdown");
    const byTrack={};
    for (const r of races) { if(!byTrack[r.track])byTrack[r.track]=[]; byTrack[r.track].push(r); }
    const keys=Object.keys(byTrack).sort((a,b)=>a.localeCompare(b));
    if (!keys.length) { container.innerHTML='<div class="empty-state">No tracks.</div>'; return; }
    buildAccordion(container, byTrack, keys,
      {
        headers:\`<th>Date</th><th>Car</th><th class="text-right">Pos</th><th class="text-right">Time</th><th>Weather</th>\`,
        row:r=>\`<tr>
          <td class="mono">\${formatDate(r.race_datetime)}</td>
          <td>\${r.vehicle_name}</td>
          <td class="text-right"><span class="pos-badge \${posClass(+r.position)}">\${r.position}</span></td>
          <td class="text-right mono">\${r.time||"—"}</td>
          <td>\${r.weather}</td>
        </tr>\`
      },
      stats=>\`<div class="metric-pill">Top car: <strong>\${stats.mostCar||"—"}</strong></div>\`
    );
  }

  function renderCarBreakdown(races) {
    const container=$("carBreakdown");
    const byCar={};
    for (const r of races) { if(!byCar[r.vehicle_name])byCar[r.vehicle_name]=[]; byCar[r.vehicle_name].push(r); }
    const keys=Object.keys(byCar).sort((a,b)=>a.localeCompare(b));
    if (!keys.length) { container.innerHTML='<div class="empty-state">No cars.</div>'; return; }
    buildAccordion(container, byCar, keys,
      {
        headers:\`<th>Date</th><th>Track</th><th class="text-right">Pos</th><th class="text-right">Time</th><th>Weather</th>\`,
        row:r=>\`<tr>
          <td class="mono">\${formatDate(r.race_datetime)}</td>
          <td>\${r.track}</td>
          <td class="text-right"><span class="pos-badge \${posClass(+r.position)}">\${r.position}</span></td>
          <td class="text-right mono">\${r.time||"—"}</td>
          <td>\${r.weather}</td>
        </tr>\`
      },
      stats=>\`<div class="metric-pill">Top track: <strong>\${stats.mostTrack||"—"}</strong></div>\`
    );
  }

  // ---- Combo Table ----
  function renderComboAnalytics(races) {
    const b=aggregateBasics(races);
    const combos=Object.values(b.combosDetail);
    if (!combos.length) { $("comboAnalytics").innerHTML='<div class="empty-state">No data.</div>'; return; }
    combos.sort((a,c)=>c.count-a.count);
    const maxC=Math.max(...combos.map(c=>c.count));

    const rows=combos.map((c,i)=>\`<tr>
      <td style="color:var(--text-muted);font-size:10px;width:24px">\${i+1}</td>
      <td>\${c.track}</td>
      <td>\${c.car}</td>
      <td class="text-right"><div class="rank-bar-wrap" style="justify-content:flex-end"><span class="mono" style="font-size:10px;color:var(--text-muted)">\${c.count}</span><div class="rank-bar" style="width:\${Math.max(4,Math.round((c.count/maxC)*50))}px"></div></div></td>
      <td class="text-right mono accent">\${(c.sumPos/c.count).toFixed(2)}</td>
      <td class="text-right mono">\${c.best}</td>
    </tr>\`).join("");

    $("comboAnalytics").innerHTML=\`<table data-table-id="combo">
      <thead><tr>
        <th>#</th>
        <th class="sortable" data-col="track">Track <span class="indicator">⇅</span></th>
        <th class="sortable" data-col="car">Car <span class="indicator">⇅</span></th>
        <th class="sortable text-right" data-col="count">Races <span class="indicator">⇅</span></th>
        <th class="sortable text-right" data-col="avg">Avg Pos <span class="indicator">⇅</span></th>
        <th class="sortable text-right" data-col="best">Best <span class="indicator">⇅</span></th>
      </tr></thead>
      <tbody>\${rows}</tbody>
    </table>\`;

    const table=$("comboAnalytics").querySelector("table");
    let cs={col:"count",dir:"desc"};
    Array.from(table.querySelectorAll("th.sortable")).forEach(th=>{
      th.addEventListener("click",()=>{
        const col=th.getAttribute("data-col");
        cs.dir=cs.col===col&&cs.dir==="asc"?"desc":"asc"; cs.col=col;
        const ra=Array.from(table.tBodies[0].rows);
        const ci=Array.from(th.parentNode.children).indexOf(th);
        ra.sort((a,b)=>{
          const av=a.cells[ci].innerText, bv=b.cells[ci].innerText;
          const na=parseFloat(av.replace(/,/g,"")), nb=parseFloat(bv.replace(/,/g,""));
          const cmp=!isNaN(na)&&!isNaN(nb)?na-nb:av.localeCompare(bv);
          return cs.dir==="asc"?cmp:-cmp;
        });
        const tb=table.tBodies[0]; tb.innerHTML=""; ra.forEach(r=>tb.appendChild(r));
      });
    });
  }

  // ---- Activity Chart ----
  function renderTimeAnalytics(races) {
    const b=aggregateBasics(races);
    const dayEntries=Object.entries(b.days).sort((a,c)=>a[0]<c[0]?-1:a[0]>c[0]?1:0);
    const labels=dayEntries.map(e=>e[0]);
    const counts=dayEntries.map(e=>e[1]);
    const ctx=$("activityChart").getContext("2d");
    const grad=ctx.createLinearGradient(0,0,0,200);
    grad.addColorStop(0,"rgba(124,58,237,0.75)");
    grad.addColorStop(1,"rgba(124,58,237,0.1)");

    if (!chartState.activityChart) {
      chartState.activityChart=new Chart(ctx,{
        type:"bar",
        data:{ labels, datasets:[{label:"Races",data:counts,backgroundColor:grad,borderRadius:4,maxBarThickness:22}] },
        options:{
          responsive:true,maintainAspectRatio:false,
          plugins:{legend:{display:false}},
          scales:{
            x:{grid:{display:false},ticks:{color:"#475569",font:{size:labels.length>14?8:10,family:"JetBrains Mono"},maxRotation:45,minRotation:0}},
            y:{grid:{color:"rgba(15,32,64,0.8)"},ticks:{color:"#475569",font:{size:10},precision:0}}
          }
        }
      });
    } else {
      chartState.activityChart.data.labels=labels;
      chartState.activityChart.data.datasets[0].data=counts;
      chartState.activityChart.update();
    }

    const monthCounts={};
    for (const [d,c] of dayEntries) { const mk=monthKey(d); monthCounts[mk]=(monthCounts[mk]||0)+c; }
    const mkTop=topKey(monthCounts);
    $("mostActiveMonth").textContent=mkTop?niceMonthLabel(mkTop)+" ("+monthCounts[mkTop]+")":"—";

    const hm=$("activityHeatmap");
    hm.innerHTML="";
    if (!dayEntries.length) return;
    let mx=0; for (const [,c] of dayEntries) if(c>mx)mx=c;
    const frag=document.createDocumentFragment();
    for (const [d,c] of dayEntries) {
      const lv=c/mx;
      let b=1; if(lv>0.75)b=4; else if(lv>0.5)b=3; else if(lv>0.25)b=2;
      const cell=document.createElement("div");
      cell.className="heat-cell"; cell.dataset.level=String(b);
      cell.title=d+": "+c+" race"+(c!==1?"s":"");
      frag.appendChild(cell);
    }
    hm.appendChild(frag);
  }

  // ---- Race Log ----
  function applySearch(races) {
    const term=raceLogState.search.trim().toLowerCase();
    if (!term) return races;
    return races.filter(r=>[String(r.race_id),r.track,r.vehicle_name,String(r.position),r.time||"",r.weather,r.race_datetime].some(f=>f.toLowerCase().includes(term)));
  }

  function renderRaceLog(races) {
    const wrapper=$("raceLogTableWrapper");
    let set=applySearch(races);
    const total=set.length;
    const {sortKey,sortDir}=raceLogState;
    set=set.slice().sort((a,b)=>{
      let av=a[sortKey], bv=b[sortKey];
      if(sortKey==="race_id"||sortKey==="position"){av=+av;bv=+bv;return sortDir==="asc"?av-bv:bv-av;}
      if(sortKey==="race_datetime"){return sortDir==="asc"?(av<bv?-1:1):av>bv?-1:1;}
      const sa=String(av).toLowerCase(), sb=String(bv).toLowerCase();
      return sortDir==="asc"?sa.localeCompare(sb):sb.localeCompare(sa);
    });
    const ps=raceLogState.pageSize, maxPg=Math.max(1,Math.ceil(total/ps));
    raceLogState.page=Math.min(raceLogState.page,maxPg);
    const pg=Math.max(1,raceLogState.page), start=(pg-1)*ps, end=start+ps;
    const items=set.slice(start,end);

    const rows=items.map(r=>\`<tr>
      <td class="mono" style="color:var(--text-muted)">\${r.race_id}</td>
      <td class="mono">\${formatDate(r.race_datetime)}</td>
      <td>\${r.track}</td>
      <td>\${r.vehicle_name}</td>
      <td class="text-right"><span class="pos-badge \${posClass(+r.position)}">\${r.position}</span></td>
      <td class="text-right mono">\${r.time||"—"}</td>
      <td>\${r.weather}</td>
    </tr>\`).join("");

    wrapper.innerHTML=total===0
      ?'<div class="empty-state">No races match current search / filters.</div>'
      :\`<table id="raceLogTable"><thead><tr>
        <th class="sortable" data-sort="race_id">ID <span class="indicator">⇅</span></th>
        <th class="sortable" data-sort="race_datetime">Date <span class="indicator">⇅</span></th>
        <th class="sortable" data-sort="track">Track <span class="indicator">⇅</span></th>
        <th class="sortable" data-sort="vehicle_name">Car <span class="indicator">⇅</span></th>
        <th class="sortable text-right" data-sort="position">Pos <span class="indicator">⇅</span></th>
        <th class="text-right">Time</th>
        <th class="sortable" data-sort="weather">Weather <span class="indicator">⇅</span></th>
      </tr></thead><tbody>\${rows}</tbody></table>\`;

    const from=total===0?0:start+1, to=total===0?0:Math.min(end,total);
    $("logPagination").innerHTML=\`
      <span>\${from.toLocaleString()}–\${to.toLocaleString()} / \${total.toLocaleString()}</span>
      <button type="button" \${pg===1?"disabled":""} data-page="prev">← Prev</button>
      <button type="button" \${pg>=maxPg?"disabled":""} data-page="next">Next →</button>
      <span style="color:var(--text-muted)">Pg \${pg}/\${maxPg}</span>
    \`;

    const t=$("raceLogTable");
    if (t) {
      Array.from(t.querySelectorAll("th.sortable")).forEach(th=>{
        th.addEventListener("click",()=>{
          const k=th.getAttribute("data-sort");
          if(!k)return;
          raceLogState.sortDir=raceLogState.sortKey===k&&raceLogState.sortDir==="asc"?"desc":"asc";
          raceLogState.sortKey=k; raceLogState.page=1; renderRaceLog(races);
        });
      });
    }
    Array.from($("logPagination").querySelectorAll("button[data-page]")).forEach(btn=>{
      btn.addEventListener("click",()=>{
        const d=btn.getAttribute("data-page");
        if(d==="prev"&&raceLogState.page>1)raceLogState.page--;
        if(d==="next"&&raceLogState.page<maxPg)raceLogState.page++;
        renderRaceLog(races);
      });
    });
  }

  // ---- Filters ----
  function populateFilterOptions() {
    const ts=new Set(), cs=new Set();
    for (const r of allRaces) { ts.add(r.track); cs.add(r.vehicle_name); }
    $("filterTrack").innerHTML='<option value="">All Tracks</option>'+Array.from(ts).sort((a,b)=>a.localeCompare(b)).map(t=>\`<option value="\${t}">\${t}</option>\`).join("");
    $("filterCar").innerHTML='<option value="">All Cars</option>'+Array.from(cs).sort((a,b)=>a.localeCompare(b)).map(c=>\`<option value="\${c}">\${c}</option>\`).join("");
  }

  function renderDashboard() {
    const f=getFilteredRaces();
    renderSummary(f);
    renderPlacementAnalytics(f);
    renderAvgPlacementTables(f);
    renderTrackBreakdown(f);
    renderCarBreakdown(f);
    renderComboAnalytics(f);
    renderTimeAnalytics(f);
    raceLogState.page=1;
    renderRaceLog(f);
  }

  function resetFilters() {
    filters.track=filters.car=filters.from=filters.to="";
    $("filterTrack").value=""; $("filterCar").value=""; $("filterDateFrom").value=""; $("filterDateTo").value="";
    renderDashboard();
  }

  function handleFileContent(text) {
    let obj;
    try { obj=JSON.parse(text); } catch(e) { alert("Invalid JSON file."); return; }
    if (!obj||!Array.isArray(obj.races)) { alert("JSON must have a top-level 'races' array."); return; }
    rawProfile=obj;
    allRaces=obj.races.map(r=>({race_id:r.race_id,track:r.track,weather:r.weather,vehicle_code:r.vehicle_code,vehicle_name:r.vehicle_name,race_datetime:r.race_datetime,position:r.position,time:r.time}));
    $("racerIdText").textContent=obj.racer_id||"Unknown";
    populateFilterOptions();
    $("uploadSection").style.display="none";
    $("dashboard").style.display="block";
    renderDashboard();
  }

  (function init() {
    const fi=$("fileInput"), ub=$("uploadBox"), ubtn=$("uploadButton");
    ubtn.addEventListener("click",()=>fi.click());
    fi.addEventListener("change",e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>handleFileContent(r.result);r.readAsText(f);});
    ["dragenter","dragover"].forEach(ev=>ub.addEventListener(ev,e=>{e.preventDefault();e.stopPropagation();ub.classList.add("drag-over");}));
    ["dragleave","dragend","drop"].forEach(ev=>ub.addEventListener(ev,e=>{e.preventDefault();e.stopPropagation();ub.classList.remove("drag-over");}));
    ub.addEventListener("drop",e=>{const f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];if(!f)return;const r=new FileReader();r.onload=()=>handleFileContent(r.result);r.readAsText(f);});
    $("filterTrack").addEventListener("change",e=>{filters.track=e.target.value||"";renderDashboard();});
    $("filterCar").addEventListener("change",e=>{filters.car=e.target.value||"";renderDashboard();});
    $("filterDateFrom").addEventListener("change",e=>{filters.from=e.target.value||"";renderDashboard();});
    $("filterDateTo").addEventListener("change",e=>{filters.to=e.target.value||"";renderDashboard();});
    $("resetFiltersBtn").addEventListener("click",resetFilters);
    $("logSearchInput").addEventListener("input",e=>{raceLogState.search=e.target.value||"";raceLogState.page=1;renderRaceLog(getFilteredRaces());});
  })();
</script>
</body>
</html>`;

export default function RacerStats() {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      doc.open();
      doc.write(HTML_CONTENT);
      doc.close();
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
      title="Racer Analytics Dashboard"
    />
  );
}
