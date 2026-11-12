/**
 * Main Application Controller - Om Mahesh Sakhare Portfolio
 * Coordinates components, themes, animations, interactive SQL studio, and views
 */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initClock();
    initNavigation();
    initMetrics();
    initSkills();
    initProjects();
    initSqlStudio();
    initPipelineSimulator();
    initCleanerDemo();
    initHackathons();
    initEducation();
    initCertifications();
    initTerminal();
    initCopyButtons();
  });

  // 1. Theme Management (Obsidian Dark default, Clean Crisp Light toggle)
  function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('om_portfolio_theme') || 'dark';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('om_portfolio_theme', nextTheme);
        updateThemeIcon(nextTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    const iconContainer = document.getElementById('theme-icon');
    if (!iconContainer) return;
    if (theme === 'dark') {
      // Show sun icon to toggle to light
      iconContainer.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    } else {
      // Show moon icon to toggle to dark
      iconContainer.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
    }
  }

  // 2. Real-time Mumbai Time Indicator
  function initClock() {
    const clockEl = document.getElementById('ist-clock');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // Formatter for IST (UTC+5:30)
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
      clockEl.textContent = `${timeStr} IST`;
    }

    update();
    setInterval(update, 1000);
  }

  // 3. Navigation & Mobile Menu & Scroll Spy
  function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const header = document.getElementById('site-header');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('nav-open');
        navToggle.classList.toggle('active');
      });

      // Close menu on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('nav-open');
          navToggle.classList.remove('active');
        });
      });
    }

    // Header blur on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header && header.classList.add('scrolled');
      } else {
        header && header.classList.remove('scrolled');
      }
    });

    // Active Section Highlight
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link && link.classList.add('active');
        } else {
          link && link.classList.remove('active');
        }
      });
    });
  }

  // 4. Metrics Ingestion
  function initMetrics() {
    const metricsContainer = document.getElementById('metrics-grid');
    if (!metricsContainer || !window.PORTFOLIO_DATA) return;

    const metrics = window.PORTFOLIO_DATA.metrics;
    metricsContainer.innerHTML = metrics.map(m => `
      <div class="metric-card">
        <div class="metric-top">
          <span class="metric-label">${m.label}</span>
          <span class="metric-change">${m.change}</span>
        </div>
        <div class="metric-value">${m.value}</div>
      </div>
    `).join('');
  }

  // 5. Skills Matrix with Tab Filter
  function initSkills() {
    const tabsContainer = document.getElementById('skill-tabs');
    const contentContainer = document.getElementById('skills-content');
    if (!tabsContainer || !contentContainer || !window.PORTFOLIO_DATA) return;

    const categories = window.PORTFOLIO_DATA.skills.categories;
    let activeCatId = categories[0].id;

    function renderTabs() {
      tabsContainer.innerHTML = categories.map(cat => `
        <button class="tab-btn ${cat.id === activeCatId ? 'active' : ''}" data-cat="${cat.id}">
          ${cat.name}
        </button>
      `).join('');

      tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCatId = btn.dataset.cat;
          renderTabs();
          renderContent();
        });
      });
    }

    function renderContent() {
      const category = categories.find(c => c.id === activeCatId);
      if (!category) return;

      contentContainer.innerHTML = `
        <div class="skills-category-view">
          <div class="cat-header">
            <h4 class="cat-title">${category.name}</h4>
            <p class="cat-desc text-muted">${category.description}</p>
          </div>
          <div class="skills-items-grid">
            ${category.skills.map(s => `
              <div class="skill-item-card">
                <div class="skill-item-header">
                  <span class="skill-name font-mono">${s.name}</span>
                  <span class="skill-level badge badge-sm">${s.level}</span>
                </div>
                <div class="skill-bar-track">
                  <div class="skill-bar-fill" style="width: ${s.proficiency}%"></div>
                </div>
                <div class="skill-tags">
                  ${s.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    renderTabs();
    renderContent();
  }

  // 6. Projects Matrix with Filterable Tags
  function initProjects() {
    const projectsContainer = document.getElementById('projects-grid');
    const filterContainer = document.getElementById('project-filters');
    if (!projectsContainer || !window.PORTFOLIO_DATA) return;

    const projects = window.PORTFOLIO_DATA.projects;
    let currentFilter = 'all';

    const filters = [
      { id: 'all', label: 'All Projects' },
      { id: 'data-eng', label: 'Data Engineering & ETL' },
      { id: 'analytics', label: 'Analytics & AI' }
    ];

    if (filterContainer) {
      filterContainer.innerHTML = filters.map(f => `
        <button class="filter-pill ${f.id === currentFilter ? 'active' : ''}" data-filter="${f.id}">
          ${f.label}
        </button>
      `).join('');

      filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentFilter = btn.dataset.filter;
          renderList();
        });
      });
    }

    function renderList() {
      const filtered = currentFilter === 'all' 
        ? projects 
        : projects.filter(p => p.category === currentFilter);

      projectsContainer.innerHTML = filtered.map(p => `
        <div class="project-card ${p.featured ? 'featured' : ''}">
          <div class="project-header">
            <div class="project-meta-top">
              ${p.badge ? `<span class="badge badge-accent">${p.badge}</span>` : `<span class="badge">${p.status}</span>`}
              <span class="project-cat font-mono">${p.category.toUpperCase()}</span>
            </div>
            <h3 class="project-title">${p.title}</h3>
            <div class="project-subtitle text-muted">${p.subtitle}</div>
          </div>

          <p class="project-summary">${p.summary}</p>

          <div class="project-architecture">
            <div class="arch-heading font-mono text-cyan">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
              Pipeline Architecture
            </div>
            <ul class="arch-steps">
              ${p.architecture.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>

          <div class="project-metrics-row">
            ${p.metrics.map(m => `
              <div class="p-metric">
                <span class="p-metric-val font-mono">${m.value}</span>
                <span class="p-metric-lbl">${m.label}</span>
              </div>
            `).join('')}
          </div>

          <div class="project-tags">
            ${p.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="project-footer">
            ${p.sqlQuery ? `
              <button class="btn btn-sm btn-outline btn-load-sql" data-sql="${encodeURIComponent(p.sqlQuery)}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                Query In SQL Studio
              </button>
            ` : ''}
            <a href="${p.github}" target="_blank" class="btn btn-sm btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              Repository
            </a>
          </div>
        </div>
      `).join('');

      // Bind query in studio buttons
      projectsContainer.querySelectorAll('.btn-load-sql').forEach(btn => {
        btn.addEventListener('click', () => {
          const sql = decodeURIComponent(btn.dataset.sql);
          const sqlInput = document.getElementById('sql-query-input');
          const sqlStudio = document.getElementById('sql-studio');
          if (sqlInput && sqlStudio) {
            sqlInput.value = sql;
            sqlStudio.scrollIntoView({ behavior: 'smooth' });
            document.getElementById('btn-execute-sql')?.click();
          }
        });
      });
    }

    renderList();
  }

  // 7. Interactive SQL Studio
  function initSqlStudio() {
    const container = document.getElementById('sql-studio-container');
    if (!container || !window.SqlEngine || !window.PORTFOLIO_DATA.sqlSandbox) return;

    const data = window.PORTFOLIO_DATA.sqlSandbox;
    const engine = new window.SqlEngine(data.tables);

    container.innerHTML = `
      <div class="sql-studio-card">
        <div class="sql-studio-topbar">
          <div class="sql-meta">
            <span class="badge badge-accent">IN-BROWSER SQL RUNNER</span>
            <span class="text-xs text-muted font-mono">SQLite-compatible query runtime loaded with Om's production datasets</span>
          </div>
          <div class="sql-presets-dropdown">
            <span class="text-xs text-muted">Presets:</span>
            ${data.presets.map((preset, idx) => `
              <button class="btn-preset-pill ${idx === 0 ? 'active' : ''}" data-sql="${encodeURIComponent(preset.sql)}">
                ${preset.name}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="sql-editor-container">
          <div class="sql-gutter">1<br>2<br>3</div>
          <textarea id="sql-query-input" class="sql-textarea font-mono" rows="3" spellcheck="false">${data.presets[0].sql}</textarea>
        </div>

        <div class="sql-action-bar">
          <div class="sql-tables-list font-mono text-xs">
            <span class="text-muted">Available Tables:</span>
            <span class="table-tag text-cyan">bullbot_trades</span>
            <span class="table-tag text-cyan">crop_chain_pricing</span>
            <span class="table-tag text-cyan">data_washing_metrics</span>
          </div>
          <button class="btn btn-primary" id="btn-execute-sql">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Execute Query
          </button>
        </div>

        <div class="sql-results-wrapper" id="sql-results-wrapper">
          <!-- Populated by run -->
        </div>
      </div>
    `;

    const input = document.getElementById('sql-query-input');
    const runBtn = document.getElementById('btn-execute-sql');
    const resultsContainer = document.getElementById('sql-results-wrapper');
    const presetPills = container.querySelectorAll('.btn-preset-pill');

    function execute(query) {
      const res = engine.execute(query);
      if (!res.success) {
        resultsContainer.innerHTML = `
          <div class="sql-error-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span>${res.error}</span>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div class="sql-telemetry-header">
            <span class="text-emerald font-mono text-xs">✓ ${res.rowCount} row(s) returned</span>
            <span class="text-muted font-mono text-xs">Query latency: ${res.executionTimeMs}ms</span>
          </div>
          <div class="table-responsive">
            <table class="data-table font-mono text-xs">
              <thead>
                <tr>
                  ${res.columns.map(c => `<th>${c}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${res.rows.map(row => `
                  <tr>
                    ${res.columns.map(c => {
                      const val = row[c];
                      const isNum = typeof val === 'number';
                      return `<td class="${isNum ? 'text-right' : ''}">${val !== null ? val : '<span class="text-muted">NULL</span>'}</td>`;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `;
      }
    }

    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        presetPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const sql = decodeURIComponent(pill.dataset.sql);
        input.value = sql;
        execute(sql);
      });
    });

    runBtn.addEventListener('click', () => {
      execute(input.value);
    });

    // Run first preset on initial render
    execute(data.presets[0].sql);
  }

  // 8. Pipeline Simulator
  function initPipelineSimulator() {
    if (window.PipelineVisualizer && window.PORTFOLIO_DATA.pipelineNodes) {
      new window.PipelineVisualizer('pipeline-simulator-container', window.PORTFOLIO_DATA.pipelineNodes);
    }
  }

  // 9. Cleaner Demo
  function initCleanerDemo() {
    if (window.DataCleanerDemo) {
      new window.DataCleanerDemo('cleaner-demo-container');
    }
  }

  // 10. Hackathons Showcase
  function initHackathons() {
    const container = document.getElementById('hackathons-grid');
    if (!container || !window.PORTFOLIO_DATA) return;

    const hacks = window.PORTFOLIO_DATA.hackathons;
    container.innerHTML = hacks.map(h => `
      <div class="hackathon-card">
        <div class="hack-header">
          <div class="hack-meta">
            <span class="hack-badge font-mono">${h.year}</span>
            <span class="hack-level text-muted text-xs">${h.level}</span>
          </div>
          <h4 class="hack-title">${h.name}</h4>
          <div class="hack-org text-cyan text-xs">${h.organizer}</div>
        </div>
        <div class="hack-project">
          <div class="hack-proj-name font-mono">Project: ${h.project}</div>
          <p class="hack-achievement text-muted text-xs">${h.achievement}</p>
        </div>
        <div class="hack-tech">
          ${h.tech.map(t => `<span class="skill-tag">${t}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  // 11. Education Timeline
  function initEducation() {
    const container = document.getElementById('education-timeline');
    if (!container || !window.PORTFOLIO_DATA) return;

    const edu = window.PORTFOLIO_DATA.education;
    container.innerHTML = edu.map((e, idx) => `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-meta">
            <span class="timeline-period font-mono">${e.period}</span>
            <span class="badge ${e.status === 'Completed' ? 'badge-success' : 'badge-accent'}">${e.status}</span>
            <span class="timeline-score font-mono text-cyan">${e.score}</span>
          </div>
          <h4 class="timeline-title">${e.degree}</h4>
          <div class="timeline-institution text-muted text-sm">${e.institution} (${e.university})</div>
          <p class="timeline-details text-xs mt-1 text-muted">${e.details}</p>
        </div>
      </div>
    `).join('');
  }

  // 12. Certifications
  function initCertifications() {
    const container = document.getElementById('certifications-grid');
    if (!container || !window.PORTFOLIO_DATA) return;

    const certs = window.PORTFOLIO_DATA.certifications;
    container.innerHTML = certs.map(c => `
      <div class="cert-card">
        <div class="cert-header">
          <div class="cert-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
          </div>
          <span class="badge ${c.badge === 'Verified' ? 'badge-success' : 'badge-accent'}">${c.badge}</span>
        </div>
        <h4 class="cert-title">${c.title}</h4>
        <div class="cert-issuer text-muted text-xs">${c.issuer}</div>
        <p class="cert-focus text-xs text-muted mt-2">${c.focus}</p>
      </div>
    `).join('');
  }

  // 13. Terminal Init
  function initTerminal() {
    if (window.PortfolioTerminal) {
      window.terminalInstance = new window.PortfolioTerminal('terminal-modal', 'terminal-output', 'terminal-input');
      
      const openBtn = document.getElementById('btn-open-terminal');
      if (openBtn) {
        openBtn.addEventListener('click', () => {
          window.terminalInstance.openModal();
        });
      }

      const quickTermBtn = document.getElementById('quick-terminal-pill');
      if (quickTermBtn) {
        quickTermBtn.addEventListener('click', () => {
          window.terminalInstance.openModal();
        });
      }
    }
  }

  // 14. Clipboard Copy Utilities
  function initCopyButtons() {
    const copyTriggers = document.querySelectorAll('.copy-trigger');
    copyTriggers.forEach(el => {
      el.addEventListener('click', () => {
        const text = el.dataset.copyText || el.textContent;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied to clipboard: ${text}`);
        });
      });
    });
  }

  function showToast(message) {
    let toast = document.getElementById('portfolio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'portfolio-toast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  window.showToast = showToast;
})();
