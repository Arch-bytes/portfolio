/**
 * Interactive Data Cleaner & Anomaly Detection Demo
 * Showcases Om's Codeverse 2026 Hackathon ML Data Cleanser
 */

(function () {
  const RAW_DIRTY_DATASET = [
    { id: "TX-101", crop: "  Tomato Hybrid  ", mandi_price: "1420.00$", state: "MH", status: "DIRTY", issue: "Trailing space, currency symbol" },
    { id: "TX-102", crop: "Onions Red", mandi_price: "null", state: "Maharashtra", status: "DIRTY", issue: "Missing price (Null), state mismatch" },
    { id: "TX-101", crop: "Tomato Hybrid", mandi_price: "1420", state: "MH", status: "DIRTY", issue: "Exact duplicate record ID" },
    { id: "TX-103", crop: "POTATOES TABLE", mandi_price: "-9999.00", state: "UP", status: "DIRTY", issue: "Extreme negative outlier, all-caps" },
    { id: "TX-104", crop: "Basmati  Rice", mandi_price: "3600.50", state: "punjab", status: "DIRTY", issue: "Double space, lower-case state" },
    { id: "TX-105", crop: "Green Chillies", mandi_price: "2800", state: "GJ", status: "CLEAN", issue: "Compliant format" }
  ];

  const CLEANED_TARGET_DATASET = [
    { id: "TX-101", crop: "Tomato (Hybrid)", mandi_price: "1,420.00", state: "Maharashtra", status: "CLEAN", resolution: "Normalized text, stripped '$', deduped" },
    { id: "TX-102", crop: "Onions (Red)", mandi_price: "1,850.00", state: "Maharashtra", status: "CLEAN", resolution: "Imputed via regional KNN median" },
    { id: "TX-103", crop: "Potatoes (Table)", mandi_price: "1,150.00", state: "Uttar Pradesh", status: "CLEAN", resolution: "Outlier clamped to 99th percentile" },
    { id: "TX-104", crop: "Basmati Rice", mandi_price: "3,600.50", state: "Punjab", status: "CLEAN", resolution: "Standardized spacing & Title Case" },
    { id: "TX-105", crop: "Green Chillies", mandi_price: "2,800.00", state: "Gujarat", status: "CLEAN", resolution: "State code mapped to canonical name" }
  ];

  class DataCleanerDemo {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      this.isCleaned = false;
      this.currentData = JSON.parse(JSON.stringify(RAW_DIRTY_DATASET));
      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();
    }

    render() {
      this.container.innerHTML = `
        <div class="cleaner-card">
          <div class="cleaner-topbar">
            <div class="cleaner-meta">
              <span class="badge badge-accent">Codeverse 2026 Showcase</span>
              <h3 class="cleaner-heading">ML Autonomous Raw Data Cleansing Engine</h3>
              <p class="cleaner-subtext">Interactive testbed simulating Om's pipeline for detecting corrupt delimiters, null values, and duplicate records.</p>
            </div>
            <div class="cleaner-actions">
              <button class="btn btn-sm btn-outline" id="btn-reset-cleaner" ${!this.isCleaned ? 'disabled' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Load Raw Dirty Data
              </button>
              <button class="btn btn-sm btn-primary" id="btn-run-cleaner" ${this.isCleaned ? 'disabled' : ''}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4"/><path d="m4.93 4.93 2.83 2.83"/><path d="M2 12h4"/><path d="m4.93 19.07 2.83-2.83"/><path d="M12 18v4"/><path d="m19.07 19.07-2.83-2.83"/><path d="M18 12h4"/><path d="m19.07 4.93-2.83 2.83"/></svg>
                Run ML Cleaning Pipeline
              </button>
            </div>
          </div>

          <!-- Metrics summary row -->
          <div class="cleaner-metrics-bar">
            <div class="cleaner-metric">
              <span class="metric-label">Dataset Health:</span>
              <span class="metric-badge ${this.isCleaned ? 'status-optimal' : 'status-danger'}" id="dqi-score">
                ${this.isCleaned ? '99.4% (Optimal)' : '61.8% (Critical Errors)'}
              </span>
            </div>
            <div class="cleaner-metric">
              <span class="metric-label">Corrupt Delimiters:</span>
              <span class="metric-val" id="delim-count">${this.isCleaned ? '0' : '4 detected'}</span>
            </div>
            <div class="cleaner-metric">
              <span class="metric-label">Missing / Nulls:</span>
              <span class="metric-val" id="null-count">${this.isCleaned ? '0 (Imputed)' : '1 critical'}</span>
            </div>
            <div class="cleaner-metric">
              <span class="metric-label">Duplicate Rows:</span>
              <span class="metric-val" id="dup-count">${this.isCleaned ? '0 (Pruned)' : '1 duplicate'}</span>
            </div>
          </div>

          <!-- Table View -->
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Record ID</th>
                  <th>Commodity / String</th>
                  <th>Mandi Rate (₹/cwt)</th>
                  <th>Canonical State</th>
                  <th>Quality Status</th>
                  <th>${this.isCleaned ? 'Cleaning Resolution' : 'Anomaly Flag'}</th>
                </tr>
              </thead>
              <tbody id="cleaner-table-body">
                ${this.renderRows()}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }

    renderRows() {
      const data = this.isCleaned ? CLEANED_TARGET_DATASET : this.currentData;
      return data.map(row => `
        <tr class="${row.status === 'CLEAN' ? 'row-clean' : 'row-dirty'}">
          <td class="font-mono text-cyan">${row.id}</td>
          <td><code class="${this.isCleaned ? 'text-emerald' : 'text-amber'}">${row.crop}</code></td>
          <td class="font-mono">${row.mandi_price}</td>
          <td>${row.state}</td>
          <td>
            <span class="badge ${row.status === 'CLEAN' ? 'badge-success' : 'badge-danger'}">
              ${row.status}
            </span>
          </td>
          <td class="text-xs text-muted">
            ${this.isCleaned ? `<span class="text-emerald">✓ ${row.resolution}</span>` : `<span class="text-danger">⚠ ${row.issue}</span>`}
          </td>
        </tr>
      `).join('');
    }

    bindEvents() {
      const btnRun = this.container.querySelector('#btn-run-cleaner');
      const btnReset = this.container.querySelector('#btn-reset-cleaner');

      if (btnRun) {
        btnRun.addEventListener('click', () => {
          btnRun.disabled = true;
          btnRun.innerHTML = 'Executing Pipeline...';
          
          setTimeout(() => {
            this.isCleaned = true;
            this.render();
            this.bindEvents();
          }, 600);
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          this.isCleaned = false;
          this.currentData = JSON.parse(JSON.stringify(RAW_DIRTY_DATASET));
          this.render();
          this.bindEvents();
        });
      }
    }
  }

  window.DataCleanerDemo = DataCleanerDemo;
})();
