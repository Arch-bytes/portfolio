/**
 * Interactive Terminal CLI for Om Mahesh Sakhare's Portfolio
 * Triggered via hotkey (Ctrl+K, ~) or interactive UI pill
 */

(function () {
  class PortfolioTerminal {
    constructor(modalId, outputId, inputId) {
      this.modal = document.getElementById(modalId);
      this.output = document.getElementById(outputId);
      this.input = document.getElementById(inputId);
      this.history = [];
      this.historyIndex = -1;
      this.init();
    }

    init() {
      if (!this.input || !this.output) return;
      this.bindEvents();
      this.printWelcome();
    }

    bindEvents() {
      // Global shortcut: Ctrl+K or backtick ~
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey && e.key === 'k') || (e.key === '`' && !this.isTypingInInput(e))) {
          e.preventDefault();
          this.toggleModal();
        } else if (e.key === 'Escape' && this.isOpen()) {
          this.closeModal();
        }
      });

      // Terminal input handling
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const cmd = this.input.value.trim();
          if (cmd) {
            this.history.push(cmd);
            this.historyIndex = this.history.length;
            this.executeCommand(cmd);
            this.input.value = '';
          }
        } else if (e.key === 'ArrowUp') {
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.history[this.historyIndex] || '';
          }
          e.preventDefault();
        } else if (e.key === 'ArrowDown') {
          if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.input.value = this.history[this.historyIndex] || '';
          } else {
            this.historyIndex = this.history.length;
            this.input.value = '';
          }
          e.preventDefault();
        }
      });

      // Close button inside modal
      const closeBtn = document.getElementById('terminal-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }

      // Backdrop click
      if (this.modal) {
        this.modal.addEventListener('click', (e) => {
          if (e.target === this.modal) {
            this.closeModal();
          }
        });
      }
    }

    isTypingInInput(e) {
      const tag = (e.target && e.target.tagName) || '';
      return tag === 'INPUT' || tag === 'TEXTAREA';
    }

    isOpen() {
      return this.modal && this.modal.classList.contains('active');
    }

    toggleModal() {
      if (this.isOpen()) {
        this.closeModal();
      } else {
        this.openModal();
      }
    }

    openModal() {
      if (!this.modal) return;
      this.modal.classList.add('active');
      setTimeout(() => this.input && this.input.focus(), 100);
    }

    closeModal() {
      if (!this.modal) return;
      this.modal.classList.remove('active');
    }

    printWelcome() {
      this.output.innerHTML = `
<div class="term-banner">
  <span class="text-cyan">OM SAKHARE</span> :: DATA ENGINEERING & ANALYTICS CLI v2.4.0
  Type <span class="term-highlight">'help'</span> to see available commands or <span class="term-highlight">'sql'</span> to test query engine.
</div>`;
    }

    executeCommand(rawCmd) {
      this.appendLine(`<div class="term-cmd-line"><span class="term-prompt">om@data-mesh:~$</span> ${this.escapeHtml(rawCmd)}</div>`);

      const parts = rawCmd.trim().split(' ');
      const mainCmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');

      switch (mainCmd) {
        case 'help':
          this.cmdHelp();
          break;
        case 'bio':
        case 'about':
          this.cmdBio();
          break;
        case 'skills':
          this.cmdSkills();
          break;
        case 'projects':
          this.cmdProjects();
          break;
        case 'hackathons':
          this.cmdHackathons();
          break;
        case 'education':
          this.cmdEducation();
          break;
        case 'theatre':
        case 'story':
          this.cmdTheatre();
          break;
        case 'contact':
          this.cmdContact();
          break;
        case 'sql':
          this.cmdSql(args);
          break;
        case 'clear':
          this.output.innerHTML = '';
          break;
        case 'exit':
        case 'quit':
          this.closeModal();
          break;
        default:
          this.appendLine(`<div class="text-danger">Command not found: '${mainCmd}'. Type <span class="term-highlight">'help'</span> for instructions.</div>`);
      }

      this.output.scrollTop = this.output.scrollHeight;
    }

    cmdHelp() {
      this.appendLine(`
<div class="term-help-grid">
  <div><span class="term-cmd">bio</span> - Career background & core focus</div>
  <div><span class="term-cmd">skills</span> - Data engineering & analytics stack</div>
  <div><span class="term-cmd">projects</span> - Production pipelines & projects</div>
  <div><span class="term-cmd">hackathons</span> - Codeverse 2026, Nirman 25 & achievements</div>
  <div><span class="term-cmd">education</span> - Degrees & certifications</div>
  <div><span class="term-cmd">theatre</span> - Stage director & data storytelling edge</div>
  <div><span class="term-cmd">sql [query]</span> - Execute in-browser query</div>
  <div><span class="term-cmd">contact</span> - Email, LinkedIn, GitHub, phone</div>
  <div><span class="term-cmd">clear</span> - Clear terminal output</div>
  <div><span class="term-cmd">exit</span> - Close terminal modal</div>
</div>`);
    }

    cmdBio() {
      const data = window.PORTFOLIO_DATA.profile;
      this.appendLine(`
<div class="term-section">
  <div class="text-cyan font-bold">${data.name} — ${data.role}</div>
  <div class="text-muted">${data.location} | ${data.status.text}</div>
  <p class="mt-1">${data.bio[0]}</p>
  <p class="mt-1">${data.bio[1]}</p>
</div>`);
    }

    cmdSkills() {
      const cats = window.PORTFOLIO_DATA.skills.categories;
      let html = '<div class="term-section"><div class="text-cyan font-bold">CORE SKILL MATRIX</div>';
      cats.forEach(c => {
        html += `<div class="mt-1 text-emerald font-bold">▶ ${c.name}:</div>`;
        c.skills.forEach(s => {
          const bar = '■'.repeat(Math.round(s.proficiency / 10)) + '░'.repeat(10 - Math.round(s.proficiency / 10));
          html += `<div class="font-mono text-xs">  ${s.name.padEnd(30, ' ')} [${bar}] ${s.proficiency}% (${s.level})</div>`;
        });
      });
      html += '</div>';
      this.appendLine(html);
    }

    cmdProjects() {
      const projs = window.PORTFOLIO_DATA.projects;
      let html = '<div class="term-section"><div class="text-cyan font-bold">PRODUCTION PIPELINES & SYSTEMS</div>';
      projs.forEach((p, i) => {
        html += `
<div class="mt-1">
  <span class="text-emerald font-bold">[${i + 1}] ${p.title}</span> <span class="badge badge-accent">${p.status}</span>
  <div class="text-muted text-xs">${p.summary}</div>
  <div class="text-cyan text-xs">Stack: ${p.tags.join(', ')}</div>
</div>`;
      });
      html += '</div>';
      this.appendLine(html);
    }

    cmdHackathons() {
      const hacks = window.PORTFOLIO_DATA.hackathons;
      let html = '<div class="term-section"><div class="text-cyan font-bold">HACKATHONS & COMPETITIVE ACHIEVEMENTS</div>';
      hacks.forEach(h => {
        html += `
<div class="mt-1">
  <span class="text-amber font-bold">🏆 ${h.name} (${h.year})</span> — <span class="text-muted">${h.level}</span>
  <div class="text-xs">Org: ${h.organizer}</div>
  <div class="text-xs text-muted">${h.achievement}</div>
</div>`;
      });
      html += '</div>';
      this.appendLine(html);
    }

    cmdEducation() {
      const edu = window.PORTFOLIO_DATA.education;
      let html = '<div class="term-section"><div class="text-cyan font-bold">ACADEMIC JOURNEY & QUALIFICATIONS</div>';
      edu.forEach(e => {
        html += `
<div class="mt-1">
  <span class="text-emerald font-bold">${e.degree}</span> (${e.period})
  <div class="text-xs">${e.institution} — <span class="text-cyan">${e.score}</span></div>
</div>`;
      });
      html += '</div>';
      this.appendLine(html);
    }

    cmdTheatre() {
      const story = window.PORTFOLIO_DATA.theatreEdge;
      let html = `<div class="term-section"><div class="text-amber font-bold">🎭 ${story.title.toUpperCase()}</div><div class="text-muted text-xs mb-1">${story.subtitle}</div>`;
      story.points.forEach(p => {
        html += `
<div class="mt-1">
  <span class="text-cyan font-bold">◆ ${p.headline}</span>
  <p class="text-xs text-muted">${p.description}</p>
</div>`;
      });
      html += '</div>';
      this.appendLine(html);
    }

    cmdContact() {
      const p = window.PORTFOLIO_DATA.profile;
      this.appendLine(`
<div class="term-section">
  <div class="text-cyan font-bold">DIRECT CONTACT CHANNELS</div>
  <div>Email: <a href="mailto:${p.email}" class="term-link">${p.email}</a></div>
  <div>Phone: <span class="font-mono">${p.phone}</span></div>
  <div>LinkedIn: <a href="${p.linkedin}" target="_blank" class="term-link">${p.linkedin}</a></div>
  <div>GitHub: <a href="${p.github}" target="_blank" class="term-link">${p.github}</a></div>
</div>`);
    }

    cmdSql(query) {
      if (!query) {
        this.appendLine(`<div class="text-muted">Usage: sql SELECT ... FROM bullbot_trades | crop_chain_pricing | data_washing_metrics</div>`);
        this.appendLine(`<div class="text-muted">Example: <span class="term-highlight">sql SELECT ticker, win_rate_pct, pnl_usd FROM bullbot_trades;</span></div>`);
        return;
      }

      if (!window.SqlEngine || !window.PORTFOLIO_DATA.sqlSandbox) {
        this.appendLine('<div class="text-danger">SQL Engine not loaded yet.</div>');
        return;
      }

      const engine = new window.SqlEngine(window.PORTFOLIO_DATA.sqlSandbox.tables);
      const res = engine.execute(query);

      if (!res.success) {
        this.appendLine(`<div class="text-danger">SQL Error: ${res.error}</div>`);
      } else {
        let outputTable = `<div class="term-sql-res text-xs font-mono mt-1"><div class="text-emerald">Query OK, ${res.rowCount} rows returned in ${res.executionTimeMs}ms</div><table class="term-table"><thead><tr>`;
        res.columns.forEach(c => outputTable += `<th>${c}</th>`);
        outputTable += `</tr></thead><tbody>`;
        res.rows.forEach(r => {
          outputTable += `<tr>`;
          res.columns.forEach(c => outputTable += `<td>${r[c]}</td>`);
          outputTable += `</tr>`;
        });
        outputTable += `</tbody></table></div>`;
        this.appendLine(outputTable);
      }
    }

    appendLine(html) {
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = html;
      this.output.appendChild(div);
      this.output.scrollTop = this.output.scrollHeight;
    }

    escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }

  window.PortfolioTerminal = PortfolioTerminal;
})();
