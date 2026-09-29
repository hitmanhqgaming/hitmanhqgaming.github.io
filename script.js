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
const HITMAN_HQ_API =
  "https://hitman-hq-api.uikeyshiva14.workers.dev";
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const FEED_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
// RSSHub exposes the channel with Shorts included when filterShorts=false.
// We compare that feed with the default feed (which filters Shorts) to identify the newest Short.
const SHORTS_RSS_URL = `https://rsshub.app/youtube/channel/${CHANNEL_ID}?filterShorts=false`;
const SHORTS_FEED_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SHORTS_RSS_URL)}`;

// Make webhook is intentionally NOT called from the public site yet.
// Calling the incoming Make webhook from every visitor would consume Make credits.
// Keep this disabled until the Make endpoint is changed to a proper read-only API.
const MAKE_READ_ENDPOINT = "";

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

function youtubeId(item) {
  if (item.guid && item.guid.includes("yt:video:")) return item.guid.split(":").pop();
  if (item.link && item.link.includes("v=")) {
    try { return new URL(item.link).searchParams.get("v") || ""; } catch (_) {}
  }
  return "";
}

function videoUrl(item) {
  const id = youtubeId(item);
  return id ? `https://www.youtube.com/watch?v=${id}` : (item.link || CHANNEL_URL);
}

function isLive(item) {
  const title = (item.title || "").toLowerCase();
  return /\b(live|stream)\b/.test(title) && item.pubDate &&
    (Date.now() - new Date(item.pubDate).getTime()) < 1000 * 60 * 60 * 24 * 2;
}

function contentBadge(item) {
  if (isLive(item)) return "LIVE";
  return /short/i.test(item.title || "") ? "SHORTS" : "YOUTUBE";
}

function renderCard(item) {
  const id = youtubeId(item);
  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  const url = videoUrl(item);
  return `
    <article class="content-card">
      <a class="thumb" href="${url}" target="_blank" rel="noopener">
        ${thumb ? `<img src="${thumb}" alt="" loading="lazy">` : `<div class="thumb-placeholder">HQ</div>`}
      </a>
      <div class="body">
        <span class="platform-badge">${contentBadge(item)}</span>
        <h3>${escapeHTML(item.title || "Untitled")}</h3>
        <p>${formatDate(item.pubDate)}</p>
        <a class="watch-link" href="${url}" target="_blank" rel="noopener">WATCH →</a>
      </div>
    </article>`;
}

function renderFeed(items) {
  if (!items.length) throw new Error("No content");

  const latest = items[0];
  const id = youtubeId(latest);
  const thumb = id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : "";
  featuredThumb.innerHTML = thumb
    ? `<img src="${thumb}" alt="${escapeHTML(latest.title || "Latest Hitman HQ content")}">`
    : `<div class="thumb-placeholder">HQ</div>`;
  featuredTitle.textContent = latest.title || "Latest Hitman HQ content";
  featuredDate.textContent = formatDate(latest.pubDate);
  featuredWatch.href = videoUrl(latest);
  featuredBadge.textContent = contentBadge(latest);

  contentGrid.innerHTML = items.slice(1, 4).map(renderCard).join("") ||
    `<div class="loading-card">MORE CONTENT COMING SOON</div>`;

  const liveItem = items.find(isLive);
  if (liveItem) {
    heroLiveBadge.hidden = false;
    liveStatus.textContent = "LIVE NOW";
    liveStatus.classList.add("live");
    liveTitle.textContent = liveItem.title;
    liveMessage.textContent = "Hitman HQ is currently live on YouTube.";
    liveButton.href = videoUrl(liveItem);
  } else {
    heroLiveBadge.hidden = true;
    liveStatus.textContent = "OFFLINE";
    liveStatus.classList.remove("live");
    liveTitle.textContent = "No live stream detected";
    liveMessage.textContent = "Follow Hitman HQ on YouTube to catch the next stream.";
    liveButton.href = "https://www.youtube.com/@HitmanHQGaming/live";
  }
}

function renderFeaturedShort(item) {
  if (!item) return;
  const id = youtubeId(item);
  if (id && featuredShortThumb) {
    featuredShortThumb.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
    featuredShortThumb.alt = item.title || "Latest Hitman HQ YouTube Short";
  }
  if (featuredShortTitle) featuredShortTitle.textContent = item.title || "Latest Hitman HQ Short";
  if (featuredShortDescription) featuredShortDescription.textContent = `Latest Short • ${formatDate(item.pubDate)}`;
  if (featuredShortWatch) featuredShortWatch.href = id ? `https://www.youtube.com/shorts/${id}` : (item.link || "https://www.youtube.com/@HitmanHQGaming/shorts");
}

async function loadLatestShort() {
  try {
    const response = await fetch(HITMAN_HQ_API, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("HITMAN HQ API unavailable");
    }

    const data = await response.json();
    const latest = data.latest;

    if (!latest || !latest.video_id) {
      throw new Error("No latest YouTube video found");
    }

    const item = {
      videoId: latest.video_id,
      title: latest.title,
      link: latest.url,
      thumbnail: latest.thumbnail,
      pubDate: latest.published_at
    };

    renderFeaturedShort(item);

    if (featuredShortDescription) {
      featuredShortDescription.textContent =
        `Latest YouTube upload • ${formatDate(latest.published_at)}`;
    }

  } catch (_) {
    // Keep the existing featured Short usable if the API is temporarily unavailable.
    const fallbackId = "SsQA8Lw4Ztk";

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(
          `https://www.youtube.com/shorts/${fallbackId}`
        )}&format=json`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();

        if (featuredShortTitle && data.title) {
          featuredShortTitle.textContent = data.title;
        }

        if (featuredShortDescription) {
          featuredShortDescription.textContent =
            "Featured YouTube Short";
        }

        if (featuredShortWatch) {
          featuredShortWatch.href =
            `https://www.youtube.com/shorts/${fallbackId}`;
        }

        return;
      }
    } catch (_) {}

    if (featuredShortTitle) {
      featuredShortTitle.textContent = "LATEST YOUTUBE SHORT";
    }

    if (featuredShortDescription) {
      featuredShortDescription.textContent =
        "Open the Shorts feed to see the latest Hitman HQ Short.";
    }

    if (featuredShortWatch) {
      featuredShortWatch.href =
        "https://www.youtube.com/@HitmanHQGaming/shorts";
    }
  }
}

async function loadYouTube() {
  try {
    // Optional future read-only endpoint. Disabled by default to avoid Make credit usage.
    if (MAKE_READ_ENDPOINT) {
      const apiResponse = await fetch(MAKE_READ_ENDPOINT, { cache: "no-store" });
      if (apiResponse.ok) {
        const record = await apiResponse.json();
        if (record && record.video_id) {
          renderFeed([{
            guid: `yt:video:${record.video_id}`,
            link: record.url,
            title: record.title,
            pubDate: record.published_at
          }]);
          return;
        }
      }
    }

    const response = await fetch(FEED_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Feed unavailable");
    const data = await response.json();
    renderFeed((data.items || []).slice(0, 6));
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
