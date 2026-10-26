// Everything on the site lives here. To add a new thing, add an entry to FOLDERS.
const ROLES = ["data scientist", "builder", "musician", "ex-Immortal", "trader", "human"];

const STATUS = `Vedant is building ML products at <b>EXL</b> in the Bay Area.<br><br>
<b>Mood:</b> writing a status message is harder than training a model.`;

const REVIEWS = [
  { name: "Name Here", role: "Director @ Company", text: "A short quote from a LinkedIn recommendation goes here." },
  { name: "Name Here", role: "VP @ Company", text: "Another kind thing someone said about working with Vedant." }
];

const CREDLY = id => `https://www.credly.com/badges/${id}/public_url`;
const GH = "https://github.com/vedant-95/";
const JOBS = [
  { co: "Standard Chartered", years: "2017-18", from: 2017.42, to: 2018.8, color: "#38b48b", what: "Data Analyst. Built a credit model for people with no credit history." },
  { co: "UC Irvine", years: "2019-20", from: 2019.6, to: 2020.95, color: "#ffc93c", school: true, what: `M.S. Business Analytics. Projects: <a href="${GH}Superbowl-Winner-Prediction" target="_blank">Super Bowl winner prediction</a> (<a href="https://www.latimes.com/socal/daily-pilot/sports/story/2020-01-18/uc-irvine-student-uses-analytics-to-predict-nfl-playoffs" target="_blank">featured in the LA Times</a>) and <a href="${GH}Twitter-Hate-Speech-Detection" target="_blank">Twitter hate speech detection</a>.` },
  { co: "Experian", years: "2020", from: 2020, to: 2020.5, color: "#a06cf2", what: "Data Science Intern. Credit default models on 9M customers." },
  { co: "PNC Bank", years: "2021-22", from: 2021.17, to: 2022.2, color: "#ff8a3d", client: true, badge: "$4M/mo", what: "Data Scientist II. Automated check-fraud detection, avoiding $4M a month in regulatory fines." },
  { co: "VISA", years: "2022-24", from: 2022.2, to: 2024.97, color: "#3b4bd8", client: true, badge: "$50M+", what: "Owned the Merchant Data Platform, used by businesses making $50M+ a year. Built dashboards the CEO used." },
  { co: "LendingClub", years: "2025", from: 2025, to: 2025.97, color: "#2f8f1f", client: true, what: "Led 3 analysts on the partner channel, 30% of company revenue." },
  { co: "EXL", years: "2021-now", from: 2021.17, to: 2026.8, band: true, color: "#1a3cff", what: "Senior Data Scientist. Building a self-serve ML platform for enterprise marketing teams." },
  { co: "Claude Certified Architect - Foundations", years: "Aug 2026", at: 2027, dx: -60, cert: "f9aba080-01d4-4efb-86f8-f0de5037b60b", color: "#b87900", what: "Anthropic certification. Click the medal to see the badge." },
  { co: "Claude Certified Architect - Professional", years: "Sep 2026", at: 2027, dx: -20, cert: "74ca2ed9-8360-4b84-af15-a70b4ccecffb", color: "#b87900", what: "Anthropic certification. Click the medal to see the badge." }
];
const pct = y => ((y - 2017) * 10).toFixed(1) + "%";
const ROWS = JOBS.filter(j => !j.band && !j.cert).reverse();
const WORK_HTML = `
  <p>8 years in data science across payments, lending and fraud.</p>
  <div class="stats">
    <div><b>$45M</b>extra loans from my uplift models</div>
    <div><b>$20M</b>lift from an A/B test</div>
    <div><b>$50M+</b>yearly revenue on a VISA platform I owned</div>
  </div>
  <div class="chart">
    ${JOBS.map((j, i) => j.band ? `<div class="job band" data-i="${i}" style="--l:${pct(j.from)};--w:${pct(2017 + j.to - j.from)};--h:${ROWS.filter(r => r.client).length * 36}px"><span><b>${j.co}</b> ${j.years}</span></div>` : "").join("")}
    ${ROWS.map(j => `<div class="track"><div class="job${j.to > 2023.5 ? " flip" : ""}${j.school ? " school" : ""}" data-i="${JOBS.indexOf(j)}" style="--l:${pct(j.from)};--w:${pct(2017 + j.to - j.from)};--c:${j.color}"><span><b>${j.co}</b> ${j.years}${j.badge ? ` <em>${j.badge}</em>` : ""}</span></div></div>`).join("")}
    ${JOBS.map((j, i) => j.cert ? `<a class="job cert" data-i="${i}" href="${CREDLY(j.cert)}" target="_blank" style="--l:${pct(j.at)};--dx:${j.dx}px"><img src="img/builds/claude.webp" alt="${j.co}"></a>` : "").join("")}
    <div class="axis">${[2017,2018,2019,2020,2021,2022,2023,2024,2025,2026].map(y => `<span style="left:${pct(y + .5)}">${y}</span>`).join("")}</div>
  </div>
  <div class="tl-info">Hover a bar to see what I did there.</div>`;

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
  { id: "work", label: "work", icon: "briefcase", img: "img/icons/work.webp", title: "work", width: 700,
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

  { id: "markets", label: "stock trades", icon: "chart", img: "img/icons/markets.webp", title: "stock trades",
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
