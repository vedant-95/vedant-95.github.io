let z = 1000;
const front = w => { w.style.zIndex = ++z; };
const mobile = () => window.innerWidth <= 768;

function draggable(win) {
  const handle = win.querySelector("header");
  win.addEventListener("pointerdown", () => front(win));
  handle.addEventListener("pointerdown", e => {
    if (mobile() || e.target.tagName === "BUTTON") return;
    const r = win.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    if (win.parentElement.classList.contains("left")) {          // detach from the column on first drag
      win.style.position = "absolute"; win.style.left = r.left + "px"; win.style.top = r.top + "px";
      document.querySelector(".desktop").appendChild(win);
    }
    const move = ev => {
      const maxY = window.innerHeight - 40 - 30;
      win.style.left = Math.max(-win.offsetWidth + 60, Math.min(window.innerWidth - 60, ev.clientX - dx)) + "px";
      win.style.top = Math.max(0, Math.min(maxY, ev.clientY - dy)) + "px";
    };
    const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
  });
  win.querySelector(".min")?.addEventListener("click", () => win.classList.toggle("minimized"));
}

let opened = 0;
function openFolder(f) {
  let win = document.getElementById("f-" + f.id);
  if (!win) {
    win = document.createElement("section");
    win.className = "window folder"; win.id = "f-" + f.id;
    win.innerHTML = `<header style="--bar:#1a3cff"><button class="min">-</button><span>${f.title}</span><button class="x" aria-label="close">x</button></header><div class="body">${f.html}</div>`;
    const n = opened++ % 6;
    win.style.left = Math.max(20, window.innerWidth / 2 - 220 + (n - 2) * 36) + "px";
    win.style.top = (60 + n * 30) + "px";
    win.querySelector(".x").onclick = () => win.remove();
    document.querySelector(".desktop").appendChild(win);
    draggable(win);
  }
  win.classList.remove("minimized");
  front(win);
}

document.getElementById("icons").innerHTML = FOLDERS.map(f =>
  `<button class="icon" data-id="${f.id}">${ICONS[f.icon]}<span>${f.label}</span></button>`).join("");
document.querySelectorAll(".icon").forEach(b => b.onclick = () => openFolder(FOLDERS.find(f => f.id === b.dataset.id)));

document.getElementById("status").innerHTML = STATUS;
document.getElementById("reviews").innerHTML = REVIEWS.map(r =>
  `<div class="review"><div class="face">${r.name[0]}</div><div><b>${r.name}</b>, <em>${r.role}</em><p>${r.text}</p></div></div>`).join("");
document.querySelectorAll(".left .window").forEach(draggable);

let ri = 0; const role = document.getElementById("role");
setInterval(() => { role.style.opacity = 0; setTimeout(() => { role.textContent = ROLES[++ri % ROLES.length]; role.style.opacity = 1; }, 300); }, 2200);

document.getElementById("me").onclick = e => e.currentTarget.classList.toggle("open");
document.getElementById("open-all").onclick = () => FOLDERS.forEach(openFolder);
document.getElementById("tidy").onclick = () => { document.querySelectorAll(".folder").forEach(w => w.remove()); opened = 0; };

const skies = ["day", "sunset", "night"], labels = { day: "sunset mode", sunset: "night mode", night: "day mode" };
document.getElementById("sky-btn").onclick = e => {
  const next = skies[(skies.indexOf(document.body.className) + 1) % skies.length];
  document.body.className = next; e.target.textContent = labels[next];
};
