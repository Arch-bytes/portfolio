/**
 * Interactive ETL Pipeline Visualizer & DAG Simulator
 * Showcases data engineering orchestration, telemetry, and node status
 */

(function () {
  class PipelineVisualizer {
    constructor(containerId, nodes) {
      this.container = document.getElementById(containerId);
      this.nodes = nodes || [];
      this.activeNodeIndex = 0;
      this.isRunning = false;
      this.totalEventsProcessed = 184520;
      this.init();
    }

    init() {
      if (!this.container) return;
      this.render();
      this.bindEvents();
      this.startHeartbeat();
    }

    render() {
      this.container.innerHTML = `
        <div class="pipeline-container">
          <!-- Control Bar -->
          <div class="pipeline-header">
            <div class="pipeline-title-group">
              <span class="pipeline-status-pulse"></span>
              <span class="pipeline-title">LIVE ETL PIPELINE DAG</span>
              <span class="pipeline-mode-badge">PRODUCTION STREAM</span>
            </div>
            <div class="pipeline-controls">
              <button class="btn btn-sm btn-outline" id="btn-inject-anomaly" title="Inject bad schema to test self-healing">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                Inject Anomaly
              </button>
              <button class="btn btn-sm btn-primary" id="btn-trigger-pipeline">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                <span id="pipeline-btn-text">Trigger Batch Run</span>
              </button>
            </div>
          </div>

          <!-- Progress Bar during run -->
          <div class="pipeline-progress-wrapper" id="pipeline-progress-wrapper" style="display: none;">
            <div class="pipeline-progress-bar" id="pipeline-progress-bar" style="width: 0%"></div>
          </div>

          <!-- DAG Nodes Layout -->
          <div class="dag-nodes-grid" id="dag-nodes-grid">
            ${this.nodes.map((node, idx) => `
              <div class="dag-node-card ${idx === this.activeNodeIndex ? 'active' : ''}" data-index="${idx}">
                <div class="dag-node-header">
                  <span class="dag-node-step">0${idx + 1}</span>
                  <span class="dag-node-status status-${node.status.toLowerCase()}">${node.status}</span>
                </div>
                <div class="dag-node-name">${node.name}</div>
                <div class="dag-node-protocol">${node.protocol}</div>
                <div class="dag-node-metrics">
                  <div><span class="text-muted">Rate:</span> <strong>${node.throughput}</strong></div>
                  <div><span class="text-muted">Lat:</span> <strong>${node.latency}</strong></div>
                </div>
                ${idx < this.nodes.length - 1 ? '<div class="dag-connector-arrow">→</div>' : ''}
              </div>
            `).join('')}
          </div>

          <!-- Active Node Detail Panel -->
          <div class="dag-inspector-panel" id="dag-inspector-panel">
            ${this.renderNodeDetail(this.nodes[this.activeNodeIndex])}
          </div>

          <!-- Streaming Pipeline Log -->
          <div class="pipeline-log-console">
            <div class="log-header">
              <span class="log-title">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
                DAG Execution Telemetry Log
              </span>
              <span class="log-counter" id="log-counter">Events Streamed: ${this.totalEventsProcessed.toLocaleString()}</span>
            </div>
            <div class="log-stream" id="dag-log-stream">
              <div class="log-line info"><span class="log-time">[22:15:02]</span> Ingestion stream healthy: 24,800 events/sec from APMC Mandi feeds & Bullbot ticks.</div>
              <div class="log-line success"><span class="log-time">[22:15:08]</span> Validation gate passed: 0 schema rejections in last 50,000 packets.</div>
              <div class="log-line info"><span class="log-time">[22:15:15]</span> Codeverse cleaner: 12 duplicate hashes stripped, 3 null prices imputed via KNN.</div>
              <div class="log-line success"><span class="log-time">[22:15:21]</span> Parquet compaction committed: analytical tables synchronized.</div>
            </div>
          </div>
        </div>
      `;
    }

    renderNodeDetail(node) {
      if (!node) return '';
      return `
        <div class="inspector-grid">
          <div class="inspector-info">
            <div class="inspector-badge">${node.type} Stage</div>
            <h4 class="inspector-title">${node.name}</h4>
            <p class="inspector-desc">${node.details}</p>
            <div class="inspector-stats-row">
              <div class="stat-box">
                <div class="stat-label">Throughput</div>
                <div class="stat-value text-accent">${node.throughput}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Avg Latency</div>
                <div class="stat-value text-emerald">${node.latency}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Protocol</div>
                <div class="stat-value">${node.protocol}</div>
              </div>
              <div class="stat-box">
                <div class="stat-label">Health</div>
                <div class="stat-value text-emerald">100.0%</div>
              </div>
            </div>
          </div>
          <div class="inspector-code">
            <div class="code-label">Sample Payload Schema (JSON / Arrow)</div>
            <pre class="code-preview"><code>${this.getSamplePayload(node.id)}</code></pre>
          </div>
        </div>
      `;
    }

    getSamplePayload(nodeId) {
      switch (nodeId) {
        case 'ingest':
          return `{\n  "event_id": "evt_998124a",\n  "stream": "bullbot_ticks",\n  "timestamp": "${new Date().toISOString()}",\n  "raw_payload": "NVDA,138.45,1500,BUY,L2"\n}`;
        case 'validate':
          return `{\n  "schema_version": "v2.1",\n  "fields_checked": 18,\n  "type_integrity": true,\n  "crypto_signature": "sha256:7f4a...92b"\n}`;
        case 'cleanse':
          return `{\n  "ml_dedup_hash": "a82b9c",\n  "imputed_fields": [],\n  "data_quality_index": 0.994,\n  "outlier_z_score": 0.42\n}`;
        case 'aggregate':
          return `{\n  "metric": "rsi_14_period",\n  "symbol": "NVDA",\n  "computed_val": 64.2,\n  "moving_avg_50": 134.10,\n  "signal": "ACCUMULATE"\n}`;
        case 'gold':
          return `{\n  "target": "parquet_lakehouse://prod/analytics",\n  "rows_committed": 24420,\n  "compression": "SNAPPY",\n  "partition_key": "2026-11-12"\n}`;
        default:
          return `{\n  "status": "OK"\n}`;
      }
    }

    bindEvents() {
      const cards = this.container.querySelectorAll('.dag-node-card');
      cards.forEach(card => {
        card.addEventListener('click', () => {
          cards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          const idx = parseInt(card.dataset.index, 10);
          this.activeNodeIndex = idx;
          const inspector = this.container.querySelector('#dag-inspector-panel');
          if (inspector) {
            inspector.innerHTML = this.renderNodeDetail(this.nodes[idx]);
          }
        });
      });

      const btnTrigger = this.container.querySelector('#btn-trigger-pipeline');
      if (btnTrigger) {
        btnTrigger.addEventListener('click', () => this.triggerPipelineRun());
      }

      const btnAnomaly = this.container.querySelector('#btn-inject-anomaly');
      if (btnAnomaly) {
        btnAnomaly.addEventListener('click', () => this.injectAnomaly());
      }
    }

    triggerPipelineRun() {
      if (this.isRunning) return;
      this.isRunning = true;
      const progressWrapper = this.container.querySelector('#pipeline-progress-wrapper');
      const progressBar = this.container.querySelector('#pipeline-progress-bar');
      const btnText = this.container.querySelector('#pipeline-btn-text');

      progressWrapper.style.display = 'block';
      progressBar.style.width = '0%';
      btnText.textContent = 'Processing Pipeline...';

      this.appendLog('info', 'Batch trigger initiated: Processing 10,000 synthetic micro-batches...');

      const cards = this.container.querySelectorAll('.dag-node-card');
      let currentStep = 0;

      const stepInterval = setInterval(() => {
        if (currentStep < this.nodes.length) {
          cards.forEach((c, idx) => {
            if (idx === currentStep) {
              c.classList.add('processing');
            } else {
              c.classList.remove('processing');
            }
          });

          const pct = Math.round(((currentStep + 1) / this.nodes.length) * 100);
          progressBar.style.width = `${pct}%`;
          
          const node = this.nodes[currentStep];
          this.appendLog('success', `[Stage ${currentStep + 1}] ${node.name} completed: ${node.throughput} @ ${node.latency}`);

          currentStep++;
        } else {
          clearInterval(stepInterval);
          cards.forEach(c => c.classList.remove('processing'));
          progressBar.style.width = '100%';
          this.totalEventsProcessed += 10000;
          const counterEl = this.container.querySelector('#log-counter');
          if (counterEl) counterEl.textContent = `Events Streamed: ${this.totalEventsProcessed.toLocaleString()}`;
          this.appendLog('success', 'Pipeline batch execution committed with 100% data integrity.');
          
          setTimeout(() => {
            progressWrapper.style.display = 'none';
            btnText.textContent = 'Trigger Batch Run';
            this.isRunning = false;
          }, 1200);
        }
      }, 700);
    }

    injectAnomaly() {
      this.appendLog('error', '[ALERT] Injected corrupt payload: Malformed ISO timestamp & NULL foreign key detected in packet stream.');
      
      const cards = this.container.querySelectorAll('.dag-node-card');
      if (cards[1]) cards[1].classList.add('warning');

      setTimeout(() => {
        this.appendLog('info', '[AUTONOMOUS REPAIR] Codeverse Anomaly Cleaner isolated malformed rows (Z-score: 4.8). Imputing median timestamp.');
        if (cards[1]) cards[1].classList.remove('warning');
        if (cards[2]) cards[2].classList.add('success-flash');
        
        setTimeout(() => {
          this.appendLog('success', '[RESOLVED] Cleaned dataset safely committed to Gold Analytics Store. Zero pipeline interruption.');
          if (cards[2]) cards[2].classList.remove('success-flash');
        }, 1200);
      }, 1400);
    }

    appendLog(type, text) {
      const stream = this.container.querySelector('#dag-log-stream');
      if (!stream) return;
      const line = document.createElement('div');
      const timeStr = new Date().toTimeString().split(' ')[0];
      line.className = `log-line ${type}`;
      line.innerHTML = `<span class="log-time">[${timeStr}]</span> ${text}`;
      stream.insertBefore(line, stream.firstChild);
      if (stream.children.length > 8) {
        stream.removeChild(stream.lastChild);
      }
    }

    startHeartbeat() {
      setInterval(() => {
        if (!this.isRunning) {
          const delta = Math.floor(Math.random() * 80) + 20;
          this.totalEventsProcessed += delta;
          const counterEl = this.container.querySelector('#log-counter');
          if (counterEl) counterEl.textContent = `Events Streamed: ${this.totalEventsProcessed.toLocaleString()}`;
        }
      }, 3000);
    }
  }

  window.PipelineVisualizer = PipelineVisualizer;
})();
