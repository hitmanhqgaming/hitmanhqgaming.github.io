const HQ_GAMES = [
  // EDIT THIS LIST to add/remove/update games in the future.
  { name: "RESIDENT EVIL", genre: "Horror • Survival", label: "VILLAGE", url: "https://www.residentevil.com/village/", art: "https://cdn.akamai.steamstatic.com/steam/apps/1196590/header.jpg" },
  { name: "GOD OF WAR", genre: "Action • Adventure", label: "GOD OF WAR", url: "https://www.playstation.com/en-in/games/god-of-war/", art: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600-fbdf3cbc2980749091d52751ffabb7b7" },
  { name: "BGMI", genre: "Battle Royale • Shooter", label: "BGMI", url: "https://www.battlegroundsmobileindia.com/", art: "https://akm-img-a-in.tosshub.com/sites/itgaming/resources/202412/unnamed271224011520.png?size=1200%3A675" },
  { name: "ROBLOX", genre: "Adventure • Multiplayer", label: "ROBLOX", url: "https://www.roblox.com/", art: "https://cms-media.roblox.com/assets/93732cb0-db70-1bdc-923c-f7526dc7086c.webp" }
];

function renderGames() {
  const grid = document.getElementById("gameGrid");
  if (!grid) return;
  grid.innerHTML = HQ_GAMES.map(game => {
    const name = escapeHTML(game.name);
    const genre = escapeHTML(game.genre);
    const label = escapeHTML(game.label || game.name);
    const url = escapeHTML(game.url);
    const art = String(game.art || "").replace(/'/g, "%27");
    return `<a class="game-card" href="${url}" target="_blank" rel="noopener">
      <div class="game-art" role="img" aria-label="${name} official artwork" style="background-image:linear-gradient(180deg,rgba(0,0,0,.08) 15%,rgba(0,0,0,.82) 100%),linear-gradient(90deg,rgba(0,0,0,.45),transparent),url('${art}')">
        <span>${label}</span>
      </div>
      <div><h3>${name}</h3><p>${genre}</p></div>
    </a>`;
  }).join("");
}

const CHANNEL_ID = "UCClntt9HBQirLO6m0klTY4g";
const CHANNEL_URL = "https://www.youtube.com/@HitmanHQGaming";
const HITMAN_HQ_API = "https://hitman-hq-api.uikeyshiva14.workers.dev";

const heroLiveBadge = document.getElementById("heroLiveBadge");
const featuredThumb = document.getElementById("featuredThumb");
const featuredTitle = document.getElementById("featuredTitle");
const featuredDate = document.getElementById("featuredDate");
const featuredWatch = document.getElementById("featuredWatch");
const featuredBadge = document.getElementById("featuredBadge");
const contentGrid = document.getElementById("contentGrid");
const liveStatus = document.getElementById("liveStatus");
const liveTitle = document.getElementById("liveTitle");
const liveMessage = document.getElementById("liveMessage");
const liveButton = document.getElementById("liveButton");
const featuredShortThumb = document.getElementById("featuredShortThumb");
const featuredShortTitle = document.getElementById("featuredShortTitle");
const featuredShortDescription = document.getElementById("featuredShortDescription");
const featuredShortWatch = document.getElementById("featuredShortWatch");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[c]));
}

function formatDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function youtubeId(item = {}) {
  if (item.videoId) return item.videoId;
  if (item.video_id) return item.video_id;
  if (item.guid && item.guid.includes("yt:video:")) return item.guid.split(":").pop();
  const link = item.link || item.url || "";
  if (link) {
    try {
      const url = new URL(link);
      if (url.searchParams.get("v")) return url.searchParams.get("v");
      const match = url.pathname.match(/\/(?:shorts|live)\/([A-Za-z0-9_-]{6,})/);
      if (match) return match[1];
    } catch (_) {}
  }
  return "";
}

function videoUrl(item = {}) {
  const id = youtubeId(item);
  if (item.url && /youtube\.com\/shorts\//i.test(item.url)) return item.url;
  if (item.url) return item.url;
  return id ? `https://www.youtube.com/watch?v=${id}` : (item.link || CHANNEL_URL);
}

function normalizeApiItem(item) {
  if (!item) return null;
  return {
    video_id: item.video_id || item.videoId || youtubeId(item),
    videoId: item.video_id || item.videoId || youtubeId(item),
    title: item.title || "",
    url: item.url || item.link || CHANNEL_URL,
    link: item.url || item.link || CHANNEL_URL,
    thumbnail: item.thumbnail || "",
    published_at: item.published_at || item.pubDate || "",
    pubDate: item.published_at || item.pubDate || "",
    content_type: item.content_type || "YouTube"
  };
}

function isShort(item = {}) {
  return /(?:#shorts\b|\bshorts\b)/i.test(item.title || "") || /youtube\.com\/shorts\//i.test(item.url || item.link || "");
}

function isLive(item = {}) {
  if (!item) return false;
  if (item.is_live === true || item.live_status === "live") return true;
  const title = (item.title || "").toLowerCase();
  return /\b(live|stream)\b/.test(title) && item.pubDate &&
    (Date.now() - new Date(item.pubDate).getTime()) < 1000 * 60 * 60 * 24;
}

function contentBadge(item) {
  if (isLive(item)) return "LIVE";
  return isShort(item) ? "SHORTS" : "YOUTUBE";
}

function renderCard(item) {
  const id = youtubeId(item);
  const thumb = item.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
  const url = videoUrl(item);
  return `
    <article class="content-card">
      <a class="thumb" href="${escapeHTML(url)}" target="_blank" rel="noopener">
        ${thumb ? `<img src="${escapeHTML(thumb)}" alt="" loading="lazy">` : `<div class="thumb-placeholder">HQ</div>`}
      </a>
      <div class="body">
        <span class="platform-badge">${contentBadge(item)}</span>
        <h3>${escapeHTML(item.title || "Untitled")}</h3>
        <p>${formatDate(item.pubDate)}</p>
        <a class="watch-link" href="${escapeHTML(url)}" target="_blank" rel="noopener">WATCH →</a>
      </div>
    </article>`;
}

function renderFeed(items) {
  if (!items.length) throw new Error("No content");

  const latest = items[0];
  const id = youtubeId(latest);
  const thumb = latest.thumbnail || (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : "");
  featuredThumb.innerHTML = thumb
    ? `<img src="${escapeHTML(thumb)}" alt="${escapeHTML(latest.title || "Latest Hitman HQ content")}">`
    : `<div class="thumb-placeholder">HQ</div>`;
  featuredTitle.textContent = latest.title || "Latest Hitman HQ content";
  featuredDate.textContent = formatDate(latest.pubDate);
  featuredWatch.href = videoUrl(latest);
  featuredBadge.textContent = contentBadge(latest);

  contentGrid.innerHTML = items.slice(1, 4).map(renderCard).join("") ||
    `<div class="loading-card">MORE CONTENT COMING SOON</div>`;
}

function renderLiveState(live) {
  const active = live && live.is_live === true;
  if (active) {
    const item = normalizeApiItem(live);
    heroLiveBadge.hidden = false;
    liveStatus.textContent = "LIVE NOW";
    liveStatus.classList.add("live");
    liveTitle.textContent = item.title || "Hitman HQ is live";
    liveMessage.textContent = "Hitman HQ is currently live on YouTube.";
    liveButton.href = item.url || CHANNEL_URL + "/live";
    return;
  }
  heroLiveBadge.hidden = true;
  liveStatus.textContent = "OFFLINE";
  liveStatus.classList.remove("live");
  liveTitle.textContent = "No live stream detected";
  liveMessage.textContent = "Follow Hitman HQ on YouTube to catch the next stream.";
  liveButton.href = CHANNEL_URL + "/live";
}

function renderFeaturedShort(item) {
  const normalized = normalizeApiItem(item);
  if (!normalized) return;
  const id = youtubeId(normalized);
  if (id && featuredShortThumb) {
    featuredShortThumb.src = normalized.thumbnail || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    featuredShortThumb.alt = normalized.title || "Latest Hitman HQ YouTube Short";
  }
  if (featuredShortTitle) featuredShortTitle.textContent = normalized.title || "Latest Hitman HQ Short";
  if (featuredShortDescription) featuredShortDescription.textContent = `Latest Short • ${formatDate(normalized.pubDate)}`;
  if (featuredShortWatch) featuredShortWatch.href = normalized.url || `https://www.youtube.com/shorts/${id}`;
}

async function loadHQApi() {
  const response = await fetch(`${HITMAN_HQ_API}?t=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("HITMAN HQ API unavailable");
  const data = await response.json();
  if (!data || data.status !== "online") throw new Error("HITMAN HQ API offline");
  return data;
}

async function loadYouTube() {
  try {
    const data = await loadHQApi();
    const latest = normalizeApiItem(data.latest);
    if (!latest) throw new Error("No latest content");
    renderFeed([latest, ...(Array.isArray(data.recent) ? data.recent.map(normalizeApiItem).filter(Boolean) : [])]);
    renderLiveState(data.live);
  } catch (_) {
    featuredTitle.textContent = "Hitman HQ Gaming";
    featuredDate.textContent = "Open YouTube for the latest content";
    featuredThumb.innerHTML = `<div class="thumb-placeholder">YOUTUBE</div>`;
    featuredWatch.href = CHANNEL_URL;
    contentGrid.innerHTML = `
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>`;
    liveStatus.textContent = "CHECK YOUTUBE";
    liveStatus.classList.remove("live");
    liveTitle.textContent = "YouTube status unavailable";
    liveMessage.textContent = "The channel is still available below while the public feed reconnects.";
    liveButton.href = CHANNEL_URL;
  }
}

async function loadLatestShort() {
  try {
    const data = await loadHQApi();
    const latestShort = data.latest_short || (data.latest && isShort(data.latest) ? data.latest : null);
    if (!latestShort) throw new Error("No Short found");
    renderFeaturedShort(latestShort);
  } catch (_) {
    if (featuredShortTitle) featuredShortTitle.textContent = "LATEST YOUTUBE SHORT";
    if (featuredShortDescription) featuredShortDescription.textContent = "Open the Shorts feed to see the latest Hitman HQ Short.";
    if (featuredShortWatch) featuredShortWatch.href = "https://www.youtube.com/@HitmanHQGaming/shorts";
  }
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(a =>
  a.addEventListener("click", () => nav.classList.remove("open"))
);

renderGames();
loadYouTube();
loadLatestShort();

// HQ Easter egg: FIND → ACTIVATE → CLASSIFIED ACCESS → AGENT ACTIVATED.
(() => {
  const target = document.getElementById("hqSecretTarget");
  if (!target) return;
  let clicks = 0;
  let timer;
  target.addEventListener("click", () => {
    clicks += 1;
    clearTimeout(timer);
    timer = setTimeout(() => { clicks = 0; }, 1800);
    if (clicks < 3) return;
    clicks = 0;

    const overlay = document.createElement("div");
    overlay.className = "agent-easter-egg";
    overlay.innerHTML = `<div class="agent-easter-box">
      <div class="agent-easter-target"></div>
      <div class="agent-easter-kicker">HITMAN HEADQUARTERS // CLASSIFIED</div>
      <div class="agent-easter-title">ACCESS GRANTED</div>
      <div class="agent-easter-copy" id="agentEasterCopy">Verifying clearance...</div>
      <div class="agent-easter-status" id="agentEasterStatus">INITIALIZING AGENT PROTOCOL</div>
    </div>`;
    document.body.appendChild(overlay);

    const copy = overlay.querySelector("#agentEasterCopy");
    const status = overlay.querySelector("#agentEasterStatus");
    const steps = [
      ["IDENTITY: UNKNOWN", "SECURITY CHECK COMPLETE"],
      ["IDENTITY: VERIFIED", "CLEARANCE: RECRUIT"],
      ["AGENT STATUS: ACTIVATED", "MISSION PROTOCOL ONLINE"],
      ["AGENT, YOU HAVE BEEN SELECTED.", "MISSION: PLAY. HUNT. CONQUER."],
      ["OBJECTIVE: ENTER THE HEADQUARTERS.", "STATUS: MISSION ACTIVE"],
      ["🏆 ACHIEVEMENT UNLOCKED — YOU FOUND THE HQ SECRET", "WELCOME TO HITMAN HEADQUARTERS"]
    ];
    let i = 0;
    const show = () => {
      const [a,b] = steps[i];
      copy.textContent = a;
      status.textContent = b;
      i += 1;
      if (i < steps.length) setTimeout(show, 950);
    };
    show();
    setTimeout(() => overlay.remove(), 6200);
  });
})();

// Copy the primary UPI ID without exposing the user's email address.
document.querySelectorAll(".support-copy-btn").forEach(button => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy || "";
    try {
      await navigator.clipboard.writeText(value);
      const old = button.textContent;
      button.textContent = "COPIED ✓";
      setTimeout(() => button.textContent = old, 1400);
    } catch (_) {
      window.prompt("Copy UPI ID:", value);
    }
  });
});
