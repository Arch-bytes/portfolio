/**
 * Portfolio Data Store - Om Mahesh Sakhare
 * Data Engineer & Analytics Specialist
 */

window.PORTFOLIO_DATA = {
  profile: {
    name: "Om Mahesh Sakhare",
    role: "Data Engineer & Analytics Specialist",
    tagline: "Architecting high-throughput data pipelines, SQL optimization, and predictive analytical systems.",
    location: "Vasai, Mumbai, Maharashtra, India",
    email: "omsakhare023@gmail.com",
    phone: "+91 7559186306",
    github: "https://github.com/arch-bytes",
    githubUsername: "arch-bytes",
    linkedin: "https://www.linkedin.com/in/om-sakhare",
    status: {
      text: "Open to Data Analyst & Data Engineering Roles",
      available: true,
      badge: "AVAILABLE FOR HIRE"
    },
    bio: [
      "I am a Computer Science & Engineering (Data Science) undergraduate at the University of Mumbai with an extensive foundation in systems engineering and data architecture. I specialize in building robust ETL/ELT pipelines, designing relational schemas, statistical market analysis, and transforming noisy, raw datasets into verified analytical assets.",
      "My unique edge lies in the intersection of data engineering and stage storytelling: as a theatre artist and script director, I don't just engineer data tables—I synthesize complex metrics into compelling narratives that business stakeholders and engineering teams can act upon."
    ]
  },

  metrics: [
    { label: "Data Quality Score", value: "99.4%", change: "+14.2% vs raw", icon: "shield-check" },
    { label: "Production Systems", value: "5+", change: "Full-stack & ETL", icon: "cpu" },
    { label: "Hackathons Competed", value: "3", change: "State & National", icon: "trophy" },
    { label: "Diploma Distinction", value: "85.4%", change: "Viva College (MSBTE)", icon: "award" }
  ],

  skills: {
    categories: [
      {
        id: "data-eng",
        name: "Data Engineering & Pipelines",
        icon: "database",
        description: "Building resilient pipelines, data models, and automated transformation routines.",
        skills: [
          { name: "SQL (PostgreSQL / MySQL)", level: "Advanced", proficiency: 92, tags: ["Queries", "Joins", "CTEs", "Window Funcs"] },
          { name: "Python for Data Engineering", level: "Advanced", proficiency: 94, tags: ["ETL", "Pandas", "NumPy", "Scripts"] },
          { name: "Data Cleaning & Preprocessing", level: "Expert", proficiency: 96, tags: ["Deduplication", "Imputation", "Normalization"] },
          { name: "Schema Design & Modeling", level: "Advanced", proficiency: 88, tags: ["3NF", "Star Schema", "Constraints"] },
          { name: "ETL / ELT Pipeline Architecture", level: "Advanced", proficiency: 90, tags: ["Batch", "Stream", "Validation"] },
          { name: "FastAPI / Flask Data Services", level: "Proficient", proficiency: 85, tags: ["REST APIs", "Microservices"] }
        ]
      },
      {
        id: "analytics",
        name: "Analytics, BI & Machine Learning",
        icon: "chart-bar",
        description: "Deriving empirical intelligence, statistical signals, and predictive modeling.",
        skills: [
          { name: "Pandas & Data Wrangling", level: "Expert", proficiency: 95, tags: ["DataFrames", "Aggregations", "Reshaping"] },
          { name: "Data Visualization (Seaborn / Matplotlib)", level: "Advanced", proficiency: 90, tags: ["Heatmaps", "Distributions", "Trends"] },
          { name: "Scikit-Learn & ML Pipelines", level: "Proficient", proficiency: 84, tags: ["Classification", "Regression", "Clustering"] },
          { name: "Algorithmic Trading & Telemetry", level: "Advanced", proficiency: 88, tags: ["RSI", "MACD", "Backtesting"] },
          { name: "Google Gemini AI & LLM Integration", level: "Advanced", proficiency: 90, tags: ["Structured Output", "Prompt Eng"] },
          { name: "TensorFlow & Deep Learning", level: "Foundational", proficiency: 75, tags: ["Neural Nets", "Tensors"] }
        ]
      },
      {
        id: "tools",
        name: "Core Infrastructure & CS Foundations",
        icon: "terminal",
        description: "Foundational computer science, version control, and database administration.",
        skills: [
          { name: "Oracle Database Foundation", level: "Certified", proficiency: 88, tags: ["Admin", "Transactions", "ACID"] },
          { name: "Git & GitHub Version Control", level: "Advanced", proficiency: 90, tags: ["CI/CD", "Branching", "GitOps"] },
          { name: "C++ & Java Core Concepts", level: "Intermediate", proficiency: 80, tags: ["OOP", "Data Structures", "Memory"] },
          { name: "Linux / Bash Shell", level: "Intermediate", proficiency: 82, tags: ["CLI", "Automation", "Cron"] },
          { name: "Web Frontend Basics", level: "Intermediate", proficiency: 85, tags: ["HTML5", "Modern JS", "Tailwind CSS"] }
        ]
      },
      {
        id: "storytelling",
        name: "Executive Communication & Storytelling",
        icon: "sparkles",
        description: "Translating telemetry into business value and executive clarity.",
        skills: [
          { name: "Data Storytelling & Reporting", level: "Distinguished", proficiency: 96, tags: ["Executive Dashboards", "KPIs"] },
          { name: "Theatre Arts & Script Directing", level: "Mastery", proficiency: 95, tags: ["Narrative Flow", "Audience Engagement"] },
          { name: "Audio & Video Production", level: "Advanced", proficiency: 88, tags: ["Editing", "Technical Demos"] },
          { name: "Agile Collaboration & Tech Meetups", level: "Active", proficiency: 90, tags: ["Peer Reviews", "Hackathons"] }
        ]
      }
    ]
  },

  projects: [
    {
      id: "bullbot",
      title: "Bullbot — Algorithmic Trading & Telemetry Engine",
      subtitle: "High-Frequency Technical Analysis & Automated Portfolio Telemetry",
      category: "data-eng",
      tags: ["Python", "FastAPI", "Pandas", "NumPy", "Seaborn", "Financial Analytics"],
      status: "Production Ready",
      featured: true,
      summary: "Engineered a low-latency algorithmic trading telemetry engine that ingests real-time financial market ticks, executes automated indicator calculations (RSI, MACD, Bollinger Bands), and identifies high-probability trade setups with automated drawdown monitoring.",
      architecture: [
        "Inbound WebSocket & REST Tick Ingestion from Exchange APIs",
        "Sliding-window vectorized calculation with NumPy & Pandas (sub-50ms latency)",
        "Strategy evaluation engine with dynamic stop-loss and trailing take-profit",
        "FastAPI reporting layer outputting real-time portfolio telemetry and risk metrics"
      ],
      metrics: [
        { label: "Backtest Sharpe Ratio", value: "2.41" },
        { label: "Analysis Latency", value: "< 42ms" },
        { label: "Win Rate on Setup", value: "68.4%" },
        { label: "Indicators Tracked", value: "12+" }
      ],
      github: "https://github.com/arch-bytes",
      sqlQuery: "SELECT ticker, strategy, win_rate_pct, total_trades, pnl_usd FROM bullbot_trades WHERE win_rate_pct > 60 ORDER BY pnl_usd DESC;"
    },
    {
      id: "crop-chain",
      title: "Crop-Chain — Smart Agricultural Supply Chain & Analytics",
      subtitle: "Disintermediating Agri-Supply Chains with Live Pricing Insights",
      category: "data-eng",
      tags: ["Python", "Flask", "Pandas", "Logistics Analytics", "Nirman 25"],
      status: "Hackathon Finalist",
      featured: true,
      badge: "Showcased at Nirman 25 (Amity & Odoo)",
      summary: "AI-driven agricultural data management network connecting farmers, regional distributors, and direct consumers. Solves exploitative multi-tier middleman price hikes by surfacing real-time mandi price differentials and logistics optimization.",
      architecture: [
        "Distributed pricing registry scraping APMC mandi rates across regional hubs",
        "Elastic pricing engine calculating fair-value index and logistics margins",
        "Direct-match dispatch pipeline minimizing agricultural spoilage rates",
        "Visual analytics dashboard for farmers to time market sales for max yield"
      ],
      metrics: [
        { label: "Middleman Margin Cut", value: "32.5%" },
        { label: "Farmer Realization", value: "+28.4%" },
        { label: "Regional Mandis", value: "48 Hubs" },
        { label: "Spoilage Reduction", value: "19.2%" }
      ],
      github: "https://github.com/arch-bytes",
      sqlQuery: "SELECT commodity, state, mandi_price_cwt, direct_price_cwt, margin_saved_pct FROM crop_chain_pricing ORDER BY margin_saved_pct DESC LIMIT 5;"
    },
    {
      id: "data-washing-machine",
      title: "Codeverse Data Washing Machine — ML Data Quality Pipeline",
      subtitle: "Automated Error Stripping, Schema Inference & Deduplication for Dirty Data",
      category: "data-eng",
      tags: ["Python", "scikit-learn", "Pandas", "Data Cleaning", "Codeverse 2026"],
      status: "Hackathon Winner",
      featured: true,
      badge: "Built for Codeverse 2026 Hackathon",
      summary: "A machine learning and rule-based data cleansing pipeline developed to ingest chaotic, corrupted, and untyped raw datasets. Automatically resolves schema conflicts, strips duplicate records, and imputes missing dimensions before loading into analytical warehouses.",
      architecture: [
        "Type inference engine parsing malformed timestamps, currencies, and mixed delimiters",
        "Phonetic & Levenshtein string matching for cross-row fuzzy deduplication",
        "KNN & Iterative Imputer for contextual null-value resolution",
        "Data Quality Index (DQI) telemetry scoring output tables for compliance"
      ],
      metrics: [
        { label: "Data Quality Score", value: "99.4%" },
        { label: "Corrupted Rows Cleaned", value: "100k+" },
        { label: "Throughput", value: "14,500 rec/sec" },
        { label: "Null Imputation Accuracy", value: "94.8%" }
      ],
      github: "https://github.com/arch-bytes",
      sqlQuery: "SELECT anomaly_type, records_flagged, auto_resolved_pct, avg_latency_ms FROM data_washing_metrics ORDER BY records_flagged DESC;"
    },
    {
      id: "formata",
      title: "Formata — Cryptographic Document Verification Stream",
      subtitle: "Automated Document Ingestion, Digital Signatures & Audit Logs",
      category: "data-eng",
      tags: ["Python", "FastAPI", "SQL", "Audit Telemetry", "Security"],
      status: "Production Ready",
      featured: false,
      summary: "Centralized document verification platform with an automated immutable pipeline for secure document storage, cryptographic authenticity verification, and digital signature workflow orchestration.",
      architecture: [
        "Cryptographic SHA-256 hash hashing of inbound payloads with timestamp anchoring",
        "State machine orchestrating multi-party approval and digital sign-off gates",
        "Relational event ledger tracking state transitions with sub-second audit queries",
        "Role-based API gateway securing document access and verification logs"
      ],
      metrics: [
        { label: "Verification Latency", value: "< 110ms" },
        { label: "Audit Accuracy", value: "100%" },
        { label: "Tamper Detection", value: "Instant" }
      ],
      github: "https://github.com/arch-bytes",
      sqlQuery: "SELECT doc_type, status, verification_latency_ms, signer_count FROM formata_audit_ledger LIMIT 5;"
    },
    {
      id: "gemini-itinerary",
      title: "AI Itinerary Engine — Geospatial & Temporal Travel Analytics",
      subtitle: "LLM-Powered Route Optimizer with Seasonal & Local Event Telemetry",
      category: "analytics",
      tags: ["Google Gemini AI", "FastAPI", "Python", "Geospatial", "GeoJSON"],
      status: "Active Prototype",
      featured: false,
      summary: "Integrated Google Gemini LLM with real-time geospatial travel matrices, seasonal weather historical data, and live event aggregators to generate hyper-optimized, time-feasible travel itineraries.",
      architecture: [
        "Prompt-engineered structured JSON schema extractor powered by Gemini API",
        "Temporal constraint solver optimizing route distance and open-window hours",
        "Seasonal crowd-density predictor based on historical tourism data",
        "Interactive route map rendering with dynamic waypoint reordering"
      ],
      metrics: [
        { label: "Route Efficiency", value: "+38%" },
        { label: "Response Time", value: "1.8s" },
        { label: "Seasonal Accuracy", value: "96.2%" }
      ],
      github: "https://github.com/arch-bytes",
      sqlQuery: "SELECT destination, season, crowd_index, avg_daily_cost_usd, recommended_stay_days FROM travel_analytics_cache ORDER BY avg_daily_cost_usd ASC;"
    }
  ],

  hackathons: [
    {
      name: "Codeverse 2026",
      organizer: "Bhausaheb Vartak College of Diploma Engineering & Technology",
      level: "State Level Hackathon",
      year: "2026",
      project: "ML Raw Data Washing Machine",
      achievement: "Built an autonomous ML-driven data cleaning pipeline that removes corrupt records, duplications, and handles empty records from RAW messy data.",
      tech: ["Python", "Machine Learning", "Pandas", "Data Cleaning"]
    },
    {
      name: "Nirman 25",
      organizer: "Amity University Panvel & Odoo",
      level: "National Level Innovation Challenge",
      year: "2025",
      project: "Crop-Chain Smart Agri Management",
      achievement: "Built & demonstrated an end-to-end supply chain platform connecting farmers with direct consumers and distributors for transparent crop pricing.",
      tech: ["Python", "Flask", "Supply Chain Analytics", "PostgreSQL"]
    },
    {
      name: "Codeverse 2023",
      organizer: "Bhausaheb Vartak College of Diploma Engineering & Technology",
      level: "State Level Hackathon",
      year: "2023",
      project: "Augmented Reality Real-Time Spatial App",
      achievement: "Built an AR application to position and track 3D objects in real time with physics simulation and spatial depth mapping.",
      tech: ["Augmented Reality", "Mobile App", "Spatial Computing"]
    }
  ],

  education: [
    {
      degree: "B.Tech in Computer Science and Engineering (Data Science)",
      institution: "Vidyavardhini's College of Engineering and Technology, Vasai",
      university: "University of Mumbai",
      period: "Pursuing",
      status: "In Progress",
      score: "Undergraduate",
      details: "Specializing in Data Engineering, Relational Database Systems, Machine Learning, Statistical Analysis, and Distributed Systems."
    },
    {
      degree: "Diploma in Computer Engineering",
      institution: "Viva College of Engineering and Technology, Virar",
      university: "Maharashtra State Board of Technical Education (MSBTE)",
      period: "2021 – 2024",
      status: "Completed",
      score: "85.43%",
      details: "Comprehensive coursework in C++, Java, DBMS, Computer Networks, Operating Systems, Data Structures & Algorithms with Distinction."
    },
    {
      degree: "ITI — Information Technology",
      institution: "Industrial Training Institute, Vasai",
      university: "National Council for Vocational Training (NCVT)",
      period: "2019 – 2021",
      status: "Completed",
      score: "84.89%",
      details: "Hands-on foundation in computer hardware, networking protocols, Linux environments, and software tooling with First Class."
    },
    {
      degree: "Secondary School Certificate (SSC)",
      institution: "New English School, Vasai",
      university: "Maharashtra State Board",
      period: "2019",
      status: "Completed",
      score: "62.80%",
      details: "Foundational secondary education in Mathematics, Science, and English."
    }
  ],

  certifications: [
    {
      title: "Oracle Database Foundation",
      issuer: "Oracle University",
      status: "Completed",
      badge: "Verified",
      focus: "Relational Database Design, SQL Fundamentals, DDL/DML, Constraints, and Transaction ACID Properties."
    },
    {
      title: "Data Science Specialization",
      issuer: "Industry Credential",
      status: "Pursuing",
      badge: "Active",
      focus: "Exploratory Data Analysis, Predictive Modeling, Statistical Testing, and Feature Engineering."
    },
    {
      title: "RedHat Python Fundamentals",
      issuer: "Red Hat Enterprise",
      status: "Pursuing",
      badge: "Active",
      focus: "Python Core, Linux Automation, File I/O, Subprocesses, and Enterprise Scripting."
    }
  ],

  theatreEdge: {
    title: "The Data Storyteller Advantage",
    subtitle: "Why A Stage Director Makes A Better Data Engineer",
    points: [
      {
        headline: "Directing the Narrative Arc of Data",
        description: "Raw numbers don't persuade executives—stories do. My background directing theatre scripts taught me how to sequence complex information, establish pacing, and lead technical and non-technical stakeholders to clear, decisive conclusions."
      },
      {
        headline: "High-Pressure Orchestration",
        description: "Directing live theatre requires zero room for error during showtime. I bring this same operational discipline to data engineering: robust exception handling, graceful degradation, and resilient pipeline monitoring."
      },
      {
        headline: "Radical Empathy for the User",
        description: "Just as actors must connect with audiences, data engineers must understand the exact pain points of analysts, executives, and end-users to architect tables and dashboards that are intuitive rather than overwhelming."
      }
    ]
  },

  // Datasets for the interactive SQL Query Runner
  sqlSandbox: {
    tables: {
      bullbot_trades: [
        { ticker: "NVDA", strategy: "Mean Reversion (RSI)", win_rate_pct: 72.4, total_trades: 142, pnl_usd: 8420.50, max_drawdown_pct: 4.8 },
        { ticker: "AAPL", strategy: "MACD Cross + Momentum", win_rate_pct: 65.8, total_trades: 198, pnl_usd: 6310.20, max_drawdown_pct: 3.2 },
        { ticker: "MSFT", strategy: "Bollinger Squeeze", win_rate_pct: 69.1, total_trades: 110, pnl_usd: 7150.00, max_drawdown_pct: 3.9 },
        { ticker: "TSLA", strategy: "Volatility Breakout", win_rate_pct: 58.2, total_trades: 215, pnl_usd: 4890.80, max_drawdown_pct: 8.4 },
        { ticker: "AMZN", strategy: "EMA 20/50 Trend Flow", win_rate_pct: 64.0, total_trades: 134, pnl_usd: 5420.10, max_drawdown_pct: 5.1 },
        { ticker: "ETH-USD", strategy: "VWAP Reclaim", win_rate_pct: 61.5, total_trades: 320, pnl_usd: 9280.00, max_drawdown_pct: 9.2 }
      ],
      crop_chain_pricing: [
        { commodity: "Tomatoes (Hybrid)", state: "Maharashtra", mandi_price_cwt: 1420, direct_price_cwt: 1950, margin_saved_pct: 37.3, volume_tons: 84.5 },
        { commodity: "Onions (Nashik Red)", state: "Maharashtra", mandi_price_cwt: 1850, direct_price_cwt: 2400, margin_saved_pct: 29.7, volume_tons: 142.0 },
        { commodity: "Basmati Rice", state: "Punjab", mandi_price_cwt: 3600, direct_price_cwt: 4450, margin_saved_pct: 23.6, volume_tons: 310.2 },
        { commodity: "Potatoes (Table)", state: "Uttar Pradesh", mandi_price_cwt: 1150, direct_price_cwt: 1620, margin_saved_pct: 40.8, volume_tons: 195.0 },
        { commodity: "Green Chillies", state: "Gujarat", mandi_price_cwt: 2800, direct_price_cwt: 3700, margin_saved_pct: 32.1, volume_tons: 54.8 },
        { commodity: "Soybean", state: "Madhya Pradesh", mandi_price_cwt: 4200, direct_price_cwt: 4950, margin_saved_pct: 17.8, volume_tons: 220.0 }
      ],
      data_washing_metrics: [
        { anomaly_type: "Null / Missing Foreign Keys", records_flagged: 18450, auto_resolved_pct: 96.2, avg_latency_ms: 12.4 },
        { anomaly_type: "Duplicate Hash / Fuzzy Redundant", records_flagged: 34120, auto_resolved_pct: 99.8, avg_latency_ms: 28.1 },
        { anomaly_type: "Malformed Timestamps & ISO Drift", records_flagged: 12900, auto_resolved_pct: 98.4, avg_latency_ms: 8.5 },
        { anomaly_type: "Out-of-Bounds Statistical Outliers", records_flagged: 4520, auto_resolved_pct: 91.0, avg_latency_ms: 44.2 },
        { anomaly_type: "Corrupt Encoding & Delimiter Breaks", records_flagged: 8930, auto_resolved_pct: 97.5, avg_latency_ms: 15.3 }
      ]
    },
    presets: [
      {
        name: "Top Performing Trading Strategies",
        sql: "SELECT ticker, strategy, win_rate_pct, pnl_usd FROM bullbot_trades WHERE win_rate_pct > 64 ORDER BY pnl_usd DESC;"
      },
      {
        name: "Farmer Profit Optimization by Commodity",
        sql: "SELECT commodity, mandi_price_cwt, direct_price_cwt, margin_saved_pct FROM crop_chain_pricing WHERE margin_saved_pct > 25 ORDER BY margin_saved_pct DESC;"
      },
      {
        name: "ML Data Cleansing Efficacy",
        sql: "SELECT anomaly_type, records_flagged, auto_resolved_pct FROM data_washing_metrics ORDER BY auto_resolved_pct DESC;"
      },
      {
        name: "High Volume Agricultural Flow",
        sql: "SELECT commodity, state, volume_tons, margin_saved_pct FROM crop_chain_pricing WHERE volume_tons > 100 ORDER BY volume_tons DESC;"
      }
    ]
  },

  // Interactive Live Pipeline DAG Simulator
  pipelineNodes: [
    {
      id: "ingest",
      name: "Source Ingestion",
      type: "Extract",
      protocol: "REST / Kafka / S3",
      status: "STREAMING",
      throughput: "24,800 evt/s",
      latency: "14ms",
      details: "Consuming raw event logs, exchange tick feeds, and mandi agricultural records."
    },
    {
      id: "validate",
      name: "Schema & Type Gate",
      type: "Validation",
      protocol: "Strict Pydantic / DDL",
      status: "HEALTHY",
      throughput: "24,780 evt/s",
      latency: "8ms",
      details: "Validating column data types, rejecting corrupt JSON payloads, and verifying cryptographic headers."
    },
    {
      id: "cleanse",
      name: "Anomaly & Deduplication",
      type: "Transform",
      protocol: "Codeverse ML Cleaner",
      status: "OPTIMAL",
      throughput: "24,420 evt/s",
      latency: "22ms",
      details: "Deduplicating fuzzy keys, imputing missing dimensions, and removing statistical outliers."
    },
    {
      id: "aggregate",
      name: "Rolling Computations",
      type: "Analytics",
      protocol: "Pandas & Vectorized C++",
      status: "STREAMING",
      throughput: "24,420 evt/s",
      latency: "16ms",
      details: "Calculating 14-period RSI, APMC regional price spreads, and window aggregations."
    },
    {
      id: "gold",
      name: "Analytical Store & Delivery",
      type: "Load",
      protocol: "Parquet / PostgreSQL / API",
      status: "COMMITTED",
      throughput: "24,420 evt/s",
      latency: "6ms",
      details: "Serving sub-second queries to executive dashboards, client UIs, and automated trade execution bots."
    }
  ]
};
