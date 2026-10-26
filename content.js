// Everything on the site lives here. To add a new thing, add an entry to FOLDERS.
const ROLES = ["data scientist", "builder", "musician", "ex-Immortal", "trader", "human"];

const STATUS = `Vedant is building ML products at <b>EXL Services</b> in the Bay Area.<br><br>
<b>Mood:</b> writing a status message is harder than training a model.`;

const REVIEWS = [
  { name: "Name Here", role: "Director @ Company", text: "A short quote from a LinkedIn recommendation goes here." },
  { name: "Name Here", role: "VP @ Company", text: "Another kind thing someone said about working with Vedant." }
];

const CREDLY = id => `https://www.credly.com/badges/${id}/public_url`;
const GH = "https://github.com/vedant-95/";
const JOBS = [
  { co: "Standard Chartered", title: "Data Analyst", years: "2017-18", dates: "Jun 2017 - Oct 2018 · Chennai", from: 2017.42, to: 2018.8, color: "#38b48b",
    pts: ["Built an ML credit risk model for borrowers with no credit history: 15% more loans issued.", "Sorted unread SWIFT messages into categories with TF-IDF and clustering."] },
  { co: "UC Irvine", title: "M.S. Business Analytics (Data Science)", years: "2019-20", dates: "Jul 2019 - Jun 2020", from: 2019.5, to: 2020.45, color: "#ffc93c", school: true,
    pts: [`<a href="${GH}Superbowl-Winner-Prediction" target="_blank">Super Bowl winner prediction</a>, <a href="https://www.latimes.com/socal/daily-pilot/sports/story/2020-01-18/uc-irvine-student-uses-analytics-to-predict-nfl-playoffs" target="_blank">featured in the LA Times</a>.`,
      `<a href="${GH}Twitter-Hate-Speech-Detection" target="_blank">Twitter hate speech detection</a> with NLP.`] },
  { co: "Experian", title: "Data Science Intern", years: "2020", dates: "Jan - Jun 2020 · Costa Mesa", from: 2020, to: 2020.5, color: "#a06cf2",
    pts: ["XGBoost and LightGBM default models on 9M customers: 2% lift in recall.", "Picked features from 200+ credit report attributes (WoE, SHAP)."] },
  { co: "PNC Bank", title: "Data Scientist II", years: "2021-22", dates: "Mar 2021 - Mar 2022 · Pittsburgh", from: 2021.17, to: 2022.2, color: "#ff8a3d", client: true, badge: "$4M/mo",
    pts: ["Built a fully automated pipeline that flags check fraud needing a regulatory (SAR) filing.", "20% better than the old process, avoiding $4M a month in fines."] },
  { co: "VISA", title: "Senior Data Scientist", years: "2022-24", dates: "Mar 2022 - Dec 2024 · Foster City", from: 2022.2, to: 2024.97, color: "#3b4bd8", client: true, badge: "$50M+",
    pts: ["Owned the Merchant Data Platform, the merchant data behind $50M+ a year in revenue.", "Built its first validation and alerting system: top-priority incidents went from 3 a quarter to 0.",
      "Technical lead for 15+ analysts and data scientists. Represented VISA with Stripe and Worldpay.", "Built Tableau dashboards for the CEO. The data was cited on earnings calls."] },
  { co: "LendingClub", title: "Senior Data Scientist", years: "2025", dates: "Jan - Dec 2025 · San Francisco", from: 2025, to: 2025.97, color: "#2f8f1f", client: true, badge: "$45M",
    pts: ["Led 3 analysts owning the partner marketing channel, 30% of LendingClub's revenue.", "Uplift models (T-learners) that found persuadable borrowers: $45M in incremental loans.",
      "A/B test on the biggest partner's application form: $20M lift.", "Kept weekly loan issuances within 2% of forecast."] },
  { co: "ML platform", title: "Senior Data Scientist", years: "2026-now", dates: "Jan 2026 - now · Foster City", from: 2026, to: 2026.8, color: "#ff4fa3", client: true, now: true,
    pts: ["Leading product development of a self-serve ML platform on AWS (S3, SageMaker). Enterprise marketing teams use it to build their own propensity models.",
      "Cross-sell and up-sell response models (XGBoost, Random Forest) that pick campaign audiences.", "Built a performance dashboard suite for leadership, end to end."] },
  { co: "EXL Services", title: "Consulting", years: "2021-now", dates: "Mar 2021 - now", from: 2021.17, to: 2026.8, band: true, color: "#1a3cff",
    pts: ["My employer since 2021. Every project from PNC onward was through EXL Services."] },
  { co: "Claude Certified Architect - Foundations", title: "Anthropic", years: "Aug 2026", dates: "Aug 2026 · score 815/1000", at: 2027, dx: -60, cert: "f9aba080-01d4-4efb-86f8-f0de5037b60b", color: "#b87900",
    pts: ["Agentic architecture, tool design and MCP, prompt engineering, Claude Code.", "Click the medal to see the badge."] },
  { co: "Claude Certified Architect - Professional", title: "Anthropic", years: "Sep 2026", dates: "Sep 2026 · score 855/1000", at: 2027, dx: -20, cert: "74ca2ed9-8360-4b84-af15-a70b4ccecffb", color: "#b87900",
    pts: ["Enterprise-scale Claude deployment, integration design and governance.", "Click the medal to see the badge."] }
];
const jobInfo = j => `<b style="color:${j.color}">${j.co}</b> · ${j.title} <span class="small">${j.dates}</span><ul>${j.pts.map(p => `<li>${p}</li>`).join("")}</ul>`;
const SKILLS = ["Causal inference", "Uplift modeling", "A/B testing", "Marketing measurement", "Propensity models", "XGBoost / LightGBM", "LLM and agentic systems", "SQL", "Python", "PySpark", "AWS SageMaker", "Tableau"];
const pct = y => ((y - 2017) * 10).toFixed(1) + "%";
const ROWS = JOBS.filter(j => !j.band && !j.cert).reverse();
const WORK_HTML = `
  <p><b>Senior Data Scientist</b>, 8 years in payments, lending and fraud. I measure what actually works (causal inference, A/B tests, uplift models) and build the ML that acts on it.</p>
  <div class="stats">
    <div><b>$45M</b>incremental loans from my uplift models</div>
    <div><b>$20M</b>lift from an A/B test</div>
    <div><b>$50M+</b>yearly revenue on a VISA platform I owned</div>
    <div><b>15+</b>analysts and data scientists I led technically</div>
  </div>
  <div class="chart">
    ${JOBS.map((j, i) => j.band ? `<div class="job band" data-i="${i}" style="--l:${pct(j.from)};--w:${pct(2017 + j.to - j.from)};--h:${ROWS.filter(r => r.client).length * 36}px"><span><b>${j.co}</b> ${j.years}</span></div>` : "").join("")}
    ${ROWS.map(j => `<div class="track"><div class="job${j.to - j.from > 2 ? " inside" : j.to > 2023.5 ? " flip" : ""}${j.school ? " school" : ""}${j.now ? " on" : ""}" data-i="${JOBS.indexOf(j)}" style="--l:${pct(j.from)};--w:${pct(2017 + j.to - j.from)};--c:${j.color}"><span><b>${j.co}</b> ${j.years}${j.badge ? ` <em>${j.badge}</em>` : ""}</span></div></div>`).join("")}
    ${JOBS.map((j, i) => j.cert ? `<a class="job cert" data-i="${i}" href="${CREDLY(j.cert)}" target="_blank" style="--l:${pct(j.at)};--dx:${j.dx}px"><img src="img/builds/claude.webp" alt="${j.co}"></a>` : "").join("")}
    <div class="axis">${[2017,2018,2019,2020,2021,2022,2023,2024,2025,2026].map(y => `<span style="left:${pct(y + .5)}">${y}</span>`).join("")}</div>
  </div>
  <div class="tl-info">${jobInfo(JOBS.find(j => j.now))}</div>
  <p class="small">Hover or tap any bar or medal for details.</p>
  <div class="chips">${SKILLS.map(s => `<span>${s}</span>`).join("")}</div>
  <p class="small">Education: M.S. Business Analytics, UC Irvine · B.Tech, VIT Vellore. <a href="https://www.linkedin.com/in/vedant-kshirsagar" target="_blank">LinkedIn</a></p>`;

const BUILDS = [
  { name: "TenantPin", url: "https://www.tenantpin.com/", icon: "img/builds/tenantpin.svg", video: "img/builds/tenantpin.mp4",
    text: "AI roommate matching for Bay Area renters. AI scores every match overnight." },
  { name: "SpoilerGuard", url: "https://chromewebstore.google.com/detail/spoilerguard-for-youtube/oaklphlkgaehjdgbpgedhgjobdooogmg", icon: "img/builds/spoilerguard.png", video: "img/builds/spoilerguard.mp4",
    text: "Chrome extension that hides YouTube spoilers for shows and matches you haven't seen yet." },
  { name: "Integral Psychedelic Community", label: "IPC website", url: "https://integralpsychedeliccommunity.com/index.html", icon: "img/builds/ipc.png", video: "img/builds/ipc.mp4",
    text: "Website for a Bay Area community: events calendar that syncs from Eventbrite, community leads and partners." },
  { name: "What's This Charge?", url: "https://github.com/vedant-95/whats-this-charge", icon: "img/builds/wtc.webp", video: "img/builds/wtc.mp4",
    text: "Hackathon project: an iMessage bot for confusing bank and card charges. Text it the line from your statement and it replies with the real business, its website and how sure it is." }
];
const BUILDS_HTML = `<div class="tiles">${BUILDS.map((b, i) =>
  `<a class="tile" href="${b.url}" target="_blank" data-i="${i}"><img src="${b.icon}" alt=""><span>${b.label || b.name}</span><small>${b.text}</small></a>`).join("")}</div>`;

const FOLDERS = [
  { id: "work", label: "work", icon: "briefcase", img: "img/icons/work.webp", title: "work", width: 760,
    html: WORK_HTML },

  { id: "builds", label: "things I built", icon: "gear", img: "img/icons/builds.webp", title: "things I built", width: 520,
    html: BUILDS_HTML },

  { id: "music", label: "music", icon: "note", img: "img/icons/music.webp", title: "music",
    html: `
      <p>A line about the music you make and why.</p>
      <div class="video">your music video here</div>
            <p class="todo">Placeholder: upload the videos to YouTube (Public or Unlisted) and send me the links. They will play right here.</p>` },

  { id: "gaming", label: "gaming", icon: "controller", img: "img/icons/gaming.webp", title: "gaming",
    html: `
      <div class="rank">IMMORTAL</div>
      <p><b>Peak rank: Immortal.</b> Top ~1% of players.</p>
      <p>A line about the grind, your main, your best moment. Clips and tracker link go here.</p>
      <p class="todo">Placeholder: which game, and any clips?</p>` },

  { id: "markets", label: "financial markets", icon: "chart", img: "img/icons/markets.webp", title: "financial markets",
    html: `
      <p>The trades I'm proud of, the ones I'm not, and what I learned.</p>
      <table class="trades"><tr><th>ticker</th><th>side</th><th>result</th></tr>
        <tr><td>XXXX</td><td>long</td><td class="up">+00%</td></tr>
        <tr><td>YYYY</td><td>short</td><td class="down">-00%</td></tr></table>
      <p class="todo">Placeholder: how do you want trades shown?</p>` },


  { id: "resume", label: "resume.pdf", icon: "doc", img: "img/icons/resume.webp", title: "resume.pdf",
    html: `
      <p>Senior Data Scientist. Marketing measurement, causal inference, experimentation, and LLM systems.</p>
      <p><a class="btn" href="#" onclick="return false">download resume.pdf</a></p>` }
];
