# Om Mahesh Sakhare — Data Engineering & Analytics Portfolio

> **Production-grade, zero-backend portfolio website engineered for GitHub Pages deployment.**
> Crafted using the design systems and anti-slop guidelines of **Impeccable Style**, **Taste Skill**, **Hallmark**, **UI-UX Pro Max**, **Hue**, and **Jakub Krehel's Skills**.

[![GitHub Pages](https://img.shields.io/badge/Deployable-GitHub%20Pages-brightgreen?logo=github)](https://github.com/arch-bytes)
[![Runtime](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20CSS3%20%7C%20HTML5-blue)](https://arch-bytes.github.io)
[![Data Quality](https://img.shields.io/badge/Data%20Quality%20Index-99.4%25-cyan)](https://arch-bytes.github.io)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

---

## 🌟 Overview

This portfolio website showcases **Om Mahesh Sakhare's** technical competencies across **Data Engineering**, **ETL/ELT Pipeline Design**, **SQL Query Optimization**, and **Autonomous Data Cleansing**. 

Instead of static, generic cards or templates, this portfolio embodies the authentic medium of data engineering:
- **Interactive Live Pipeline DAG Simulator**: Visualizes multi-stage ETL streams (Ingest -> Validate -> Cleanse -> Aggregate -> Analytical Store) with live throughput, latency, sample JSON/Arrow schemas, and batch trigger simulation.
- **Client-Side In-Browser SQL Studio**: A SQLite-compatible query runtime loaded with Om's actual project datasets (`bullbot_trades`, `crop_chain_pricing`, `data_washing_metrics`). Visitors and recruiters can run real SQL queries with sub-millisecond execution times and instant tabular outputs.
- **Codeverse 2026 Autonomous ML Data Cleaning Testbed**: An interactive demonstration of Om's state-level hackathon project. Test how messy raw records (corrupt delimiters, null prices, duplicate hashes, malformed states) are autonomously sanitized into pristine tables with a 99.4% Data Quality Index.
- **Embedded Developer CLI Terminal (`Ctrl+K` or `~`)**: A Unix-style interactive command line supporting commands like `help`, `bio`, `skills`, `projects`, `sql`, `hackathons`, `theatre`, and `contact`.
- **The Data Storyteller Advantage**: Highlights Om's unique differentiator—his background directing theatre scripts and stage performance, translating dense technical telemetry into persuasive executive narratives.
- **Printable Clean Resume Engine**: Includes publication-grade print styles (`window.print()` / `Ctrl+P`) that automatically formats the entire portfolio into a clean, 2-page black-and-white resume for hiring managers.

---

## 🚀 Instant Deployment to GitHub Pages (3 Steps)

Because this website is built with pure, modern frontend technologies (vanilla ES6+, semantic HTML5, zero external build tools or npm dependencies):

1. **Initialize Git Repository and Commit**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of data engineering portfolio"
   ```

2. **Push to your GitHub repository** (`arch-bytes.github.io` or `portfolio`):
   ```bash
   git remote add origin https://github.com/arch-bytes/portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings on GitHub: **Settings** -> **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select branch **`main`** and folder **`/ (root)`**, then click **Save**.
   - Your portfolio will be live at `https://arch-bytes.github.io/portfolio/` (or `https://arch-bytes.github.io/`) in under 60 seconds!

---

## 📂 Project Structure

```text
Portfolio/
├── index.html                   # Semantic, accessible, SEO & OpenGraph optimized layout
├── README.md                    # Deployment guide and technical specifications
├── css/
│   ├── main.css                 # Design tokens, typography, dark/light theme variables
│   ├── components.css           # Header, DAG nodes, SQL studio, cleaner demo, cards, terminal
│   └── animations.css           # Telemetry pulses, keyframes, and print-ready stylesheet
├── js/
│   ├── data.js                  # Single source of truth: profile, metrics, projects, datasets
│   ├── sql-engine.js            # Client-side SQL parser & query execution engine
│   ├── pipeline-visualizer.js   # Interactive DAG node visualizer & batch runner
│   ├── data-cleaner-demo.js     # Codeverse 2026 data cleaning interactive testbed
│   ├── terminal.js              # Embedded interactive developer CLI modal
│   └── app.js                   # Application coordinator, scroll spy, IST clock, theme switcher
└── assets/
    └── img/                     # Graphics, icons, and media assets
```

---

## 🎨 Design Philosophy & Skills Applied

This project incorporates the design intelligence and anti-slop guidelines of the industry's top AI agent design skills:

1. **Impeccable Style (`impeccable.style`)**:
   - Replaced generic gradients and template cards with purposeful visual hierarchy.
   - Refined typography pairings: **JetBrains Mono** for code/telemetry, **Plus Jakarta Sans** for display headings, and **Inter** for prose readability.
   - Micro-spacing, subtle borders (`rgba(255, 255, 255, 0.08)`), and crisp contrast ratios.

2. **Taste Skill (`Leonxlnx/taste-skill`)**:
   - Domain-specific aesthetics: Built specifically for Data Engineering & Analytics (deep obsidian surfaces, cyber cyan queries, emerald health pings, amber warning anomalies).
   - High-taste art direction and tactile UI feedback.

3. **Hallmark (`nutlope/hallmark`)**:
   - Opinionated layout architecture avoiding "AI slop".
   - Bespoke interactive widgets (SQL editor with line numbers, DAG node inspector, and before/after dataset comparison).

4. **UI-UX Pro Max (`ui-ux-pro-max-skill`)**:
   - WCAG AA/AAA compliant color contrast.
   - Keyboard accessible navigation (`Ctrl+K` for CLI, accessible skip targets).
   - Fluid responsive breakpoints across mobile (320px), tablet (768px), and ultra-wide desktops.

5. **Hue (`hueapp.io`)**:
   - Cohesive OKLCH/Hex color token system with seamless toggle between **Obsidian Dark Mode** and **Refined Crisp Light Mode**.

6. **Jakub Krehel Skills (`jakubkrehel/skills`)**:
   - Micro-copy polish, interactive toast alerts, live Mumbai IST clock, and one-click copy buttons.

---

## 👨‍💻 Candidate Profile

**Om Mahesh Sakhare**  
- **Email**: [omsakhare023@gmail.com](mailto:omsakhare023@gmail.com)  
- **Phone**: [+91 7559186306](tel:+917559186306)  
- **LinkedIn**: [linkedin.com/in/om-sakhare](https://www.linkedin.com/in/om-sakhare)  
- **GitHub**: [github.com/arch-bytes](https://github.com/arch-bytes)  
- **Academic Foundation**:
  - B.Tech in CSE (Data Science) — *Vidyavardhini's College of Engineering & Technology, University of Mumbai* [Pursuing]
  - Diploma in Computer Engineering — *Viva College of Engineering & Technology (MSBTE)* — **85.43% (Distinction)**
  - ITI in Information Technology — *NCVT* — **84.89% (First Class)**
- **Hackathon Recognitions**:
  - **Codeverse 2026**: Autonomous ML Raw Data Washing Machine (State Level)
  - **Nirman 25 (Amity & Odoo)**: Crop-Chain Smart Agricultural Supply Chain (National Level)
  - **Codeverse 2023**: Augmented Reality Real-Time Spatial Application (State Level)
- **Key Certifications**:
  - Oracle Database Foundation (Completed)
  - Data Science Specialization (Pursuing)
  - RedHat Python Fundamentals (Pursuing)

---

## 📄 License

MIT License — Feel free to use and adapt this portfolio template for personal use.
