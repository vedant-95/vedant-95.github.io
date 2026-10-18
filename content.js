// Everything on the site lives here. To add a new thing, add an entry to FOLDERS.
const ROLES = ["data scientist", "builder", "musician", "ex-Immortal", "trader", "human"];

const STATUS = `Vedant is building ML products at <b>EXL</b> in the Bay Area.<br><br>
<b>Mood:</b> writing a status message is harder than training a model.`;

const REVIEWS = [
  { name: "Name Here", role: "Director @ Company", text: "A short quote from a LinkedIn recommendation goes here." },
  { name: "Name Here", role: "VP @ Company", text: "Another kind thing someone said about working with Vedant." }
];

const FOLDERS = [
  { id: "work", label: "work", icon: "briefcase", title: "work",
    html: `
      <p>8 years in data science across payments, lending and fraud. I measure whether marketing actually works, run experiments, and build models that make money.</p>
      <div class="stats">
        <div><b>$45M</b>extra loans from my uplift models</div>
        <div><b>$20M</b>more from one A/B test</div>
        <div><b>$50M+</b>yearly revenue on a VISA platform I owned</div>
      </div>
      <ul class="jobs">
        <li><span>2026-now</span><b>EXL</b> Senior Data Scientist. Self-serve ML platform for enterprise marketing teams.</li>
        <li><span>2025</span><b>LendingClub</b> Led 3 analysts on the partner channel, 30% of company revenue.</li>
        <li><span>2022-24</span><b>VISA</b> Owned the Merchant Data Platform. Built dashboards the CEO used.</li>
        <li><span>2021-22</span><b>PNC Bank</b> Automated check-fraud detection, avoiding $4M/month in fines.</li>
        <li><span>2020</span><b>Experian</b> Credit default models on 9M customers.</li>
        <li><span>2017-18</span><b>Standard Chartered</b> Credit model for people with no credit history.</li>
      </ul>
      <p class="small">M.S. Business Analytics, UC Irvine · B.Tech, VIT Vellore</p>` },

  { id: "builds", label: "things I built", icon: "gear", title: "things I built",
    html: `
      <div class="item"><div class="thumb">TenantPin</div><div><b><a href="https://www.tenantpin.com/" target="_blank">TenantPin</a></b><br>AI roommate matching for Bay Area renters. AI scores every match overnight.</div></div>
      <div class="item"><div class="thumb">SpoilerGuard</div><div><b><a href="https://github.com/vedant-95/spoilerguard" target="_blank">SpoilerGuard</a></b><br>Chrome extension that hides YouTube spoilers for shows and matches you haven't seen yet.</div></div>
      <div class="item"><div class="thumb">Claude</div><div><b><a href="https://www.credly.com/badges/f9aba080-01d4-4efb-86f8-f0de5037b60b/public_url" target="_blank">Claude Certified Architect</a></b><br>Anthropic certified, Professional and Foundations.</div></div>` },

  { id: "music", label: "music videos", icon: "note", title: "music videos",
    html: `
      <p>A line about the music you make and why.</p>
      <div class="video">your music video here</div>
      <div class="video">another one</div>
      <p class="todo">Placeholder: send me the YouTube links.</p>` },

  { id: "gaming", label: "gaming", icon: "controller", title: "gaming",
    html: `
      <div class="rank">IMMORTAL</div>
      <p><b>Peak rank: Immortal.</b> Top ~1% of players.</p>
      <p>A line about the grind, your main, your best moment. Clips and tracker link go here.</p>
      <p class="todo">Placeholder: which game, and any clips?</p>` },

  { id: "markets", label: "stock trades", icon: "chart", title: "stock trades",
    html: `
      <p>The trades I'm proud of, the ones I'm not, and what I learned.</p>
      <table class="trades"><tr><th>ticker</th><th>side</th><th>result</th></tr>
        <tr><td>XXXX</td><td>long</td><td class="up">+00%</td></tr>
        <tr><td>YYYY</td><td>short</td><td class="down">-00%</td></tr></table>
      <p class="todo">Placeholder: how do you want trades shown?</p>` },

  { id: "me", label: "about me", icon: "heart", title: "about me",
    html: `
      <ul>
        <li>Born in Nagpur, India</li>
        <li>Lives in the Bay Area</li>
        <li>Fun fact #1</li>
        <li>Fun fact #2</li>
        <li>Currently into...</li>
      </ul>
      <div class="photos"><div>photo</div><div>photo</div><div>photo</div></div>` },

  { id: "resume", label: "resume.pdf", icon: "doc", title: "resume.pdf",
    html: `
      <p>Senior Data Scientist. Marketing measurement, causal inference, experimentation, and LLM systems.</p>
      <p><a class="btn" href="#" onclick="return false">download resume.pdf</a></p>` }
];
