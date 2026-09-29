const HITMAN_HQ_API = "https://hitman-hq-api.uikeyshiva14.workers.dev";

const HQ_GAMES = [
  {
    name: "RESIDENT EVIL",
    description: "Survival horror, intense encounters and story-driven gameplay.",
    image: "assets/games/resident-evil.jpg"
  },
  {
    name: "GOD OF WAR",
    description: "Kratos, brutal combat, puzzles and legendary adventures.",
    image: "assets/games/god-of-war.jpg"
  },
  {
    name: "BGMI",
    description: "Battles, squad gameplay and competitive action.",
    image: "assets/games/bgmi.jpg"
  },
  {
    name: "ROBLOX",
    description: "Different worlds, challenges and unexpected adventures.",
    image: "assets/games/roblox.jpg"
  }
];

function youtubeId(item) {
  if (!item) return "";

  if (item.videoId) return item.videoId;
  if (item.video_id) return item.video_id;

  const text = String(item.url || item.link || item.id || "");

  const ytIdMatch = text.match(/yt:video:([A-Za-z0-9_-]+)/);
  if (ytIdMatch) return ytIdMatch[1];

  const vMatch = text.match(/[?&]v=([A-Za-z0-9_-]+)/);
  if (vMatch) return vMatch[1];

  const shortsMatch = text.match(/\/shorts\/([A-Za-z0-9_-]+)/);
  if (shortsMatch) return shortsMatch[1];

  const liveMatch = text.match(/\/live\/([A-Za-z0-9_-]+)/);
  if (liveMatch) return liveMatch[1];

  return "";
}

function normalizeApiItem(item) {
  if (!item) return null;

  const id = youtubeId(item);

  return {
    ...item,
    video_id: id,
    title: item.title || "Untitled",
    url:
      item.url ||
      (id ? `https://www.youtube.com/watch?v=${id}` : ""),
    thumbnail:
      item.thumbnail ||
      (id
        ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
        : ""),
    published_at: item.published_at || "",
    content_type: item.content_type || "YouTube"
  };
}

function isShort(item) {
  if (!item) return false;

  const text =
    `${item.title || ""} ${item.url || ""}`.toLowerCase();

  return (
    text.includes("#shorts") ||
    text.includes("shorts") ||
    text.includes("/shorts/")
  );
}

function isLive(item) {
  if (!item) return false;

  if (item.is_live === true) return true;
  if (item.live_status === "live") return true;

  const title = (item.title || "").toLowerCase();

  if (
    (title.includes("live") || title.includes("stream")) &&
    item.published_at
  ) {
    const published = new Date(item.published_at).getTime();
    const age = Date.now() - published;

    return age >= 0 && age <= 24 * 60 * 60 * 1000;
  }

  return false;
}

async function loadHQApi() {
  try {
    const response = await fetch(
      `${HITMAN_HQ_API}?t=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("HITMAN HQ API error:", error);
    return null;
  }
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function renderFeatured(item) {
  const thumb = document.getElementById("featuredThumb");
  const title = document.getElementById("featuredTitle");
  const date = document.getElementById("featuredDate");
  const watch = document.getElementById("featuredWatch");
  const badge = document.getElementById("featuredBadge");

  if (!item) return;

  if (thumb) {
    thumb.innerHTML = `
      <img
        src="${item.thumbnail}"
        alt="${item.title}"
        loading="lazy"
      >
    `;
  }

  if (title) title.textContent = item.title;

  if (date) date.textContent = formatDate(item.published_at);

  if (watch) {
    watch.href = item.url || "#";
  }

  if (badge) {
    badge.textContent = item.content_type || "YOUTUBE";
  }
}

function renderFeed(items) {
  const grid = document.getElementById("contentGrid");

  if (!grid) return;

  if (!items || !items.length) {
    grid.innerHTML = `
      <div class="loading-card">
        No recent HQ content found.
      </div>
    `;
    return;
  }

  grid.innerHTML = items
    .map((item) => {
      const id = youtubeId(item);
      const thumbnail =
        item.thumbnail ||
        (id
          ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
          : "");

      return `
        <article class="content-card">
          <a
            class="content-thumb"
            href="${item.url || "#"}"
            target="_blank"
            rel="noopener"
          >
            ${
              thumbnail
                ? `<img src="${thumbnail}" alt="${item.title || "YouTube content"}" loading="lazy">`
                : ""
            }
          </a>

          <div class="content-card-body">
            <span class="platform-badge">
              ${item.content_type || "YOUTUBE"}
            </span>

            <h3>${item.title || "Untitled"}</h3>

            <p>${formatDate(item.published_at)}</p>

            <a
              class="text-link"
              href="${item.url || "#"}"
              target="_blank"
              rel="noopener"
            >
              WATCH →
            </a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderFeaturedShort(item) {
  const thumb = document.getElementById("featuredShortThumb");
  const title = document.getElementById("featuredShortTitle");
  const description = document.getElementById(
    "featuredShortDescription"
  );
  const watch = document.getElementById("featuredShortWatch");

  if (!item) return;

  if (thumb) {
    thumb.src = item.thumbnail || "";
    thumb.alt = item.title || "Latest Hitman HQ YouTube Short";
  }

  if (title) {
    title.textContent = item.title || "Latest Hitman HQ Short";
  }

  if (description) {
    description.textContent =
      "The latest Hitman HQ YouTube Short is featured here automatically.";
  }

  if (watch) {
    watch.href =
      item.url ||
      "https://www.youtube.com/@HitmanHQGaming/shorts";
  }
}

function renderLiveState(liveData) {
  const status = document.getElementById("liveStatus");
  const title = document.getElementById("liveTitle");
  const message = document.getElementById("liveMessage");
  const button = document.getElementById("liveButton");
  const heroBadge = document.getElementById("heroLiveBadge");

  const live = liveData && liveData.is_live === true;

  if (status) {
    status.textContent = live
      ? "LIVE NOW"
      : "OFFLINE";
  }

  if (title) {
    title.textContent = live
      ? liveData.title || "HITMAN HQ IS LIVE!"
      : "No live stream detected";
  }

  if (message) {
    message.textContent = live
      ? "HITMAN HQ is live on YouTube. Join the stream now!"
      : "The HQ is currently offline. Check back when the next livestream starts.";
  }

  if (button) {
    button.href =
      live && liveData.url
        ? liveData.url
        : "https://www.youtube.com/@HitmanHQGaming/live";

    button.textContent = live
      ? "WATCH LIVE →"
      : "OPEN YOUTUBE →";
  }

  if (heroBadge) {
    heroBadge.hidden = !live;
  }
}

async function loadYouTube() {
  const data = await loadHQApi();

  if (!data) return;

  const latest = normalizeApiItem(data.latest);

  const recent = (data.recent || [])
    .map(normalizeApiItem)
    .filter(Boolean);

  const live = data.live || {
    is_live: false
  };

  if (latest) {
    renderFeatured(latest);
  }

  renderFeed(recent);

  renderLiveState(live);
}

async function loadLatestShort() {
  const data = await loadHQApi();

  if (!data) return;

  let item = normalizeApiItem(data.latest_short);

  if (!item && data.latest && isShort(data.latest)) {
    item = normalizeApiItem(data.latest);
  }

  if (item) {
    renderFeaturedShort(item);
  }
}

function renderGames() {
  const grid = document.getElementById("gameGrid");

  if (!grid) return;

  grid.innerHTML = HQ_GAMES.map(
    (game) => `
      <article class="game-card">
        <div class="game-card-image">
          <img
            src="${game.image}"
            alt="${game.name}"
            loading="lazy"
          >
        </div>

        <div class="game-card-body">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
        </div>
      </article>
    `
  ).join("");
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.dataset.copy;

      try {
        await navigator.clipboard.writeText(value);

        const original = button.textContent;

        button.textContent = "COPIED ✓";

        setTimeout(() => {
          button.textContent = original;
        }, 1500);
      } catch (error) {
        console.error("Copy failed:", error);
      }
    });
  });
}

function setupSecretTarget() {
  const target = document.getElementById("hqSecretTarget");

  if (!target) return;

  target.addEventListener("click", () => {
    document.body.classList.toggle("hq-secret-active");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenu();
  setupCopyButtons();
  setupSecretTarget();
  renderGames();

  loadYouTube();
  loadLatestShort();
});
