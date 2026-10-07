```javascript
/* =========================================================
   HITMAN HQ GAMING — MAIN SITE SCRIPT
   ========================================================= */


/* =========================================================
   GAME DATABASE
   =========================================================
   EDIT ONLY THIS SECTION WHEN YOU WANT TO CHANGE GAMES.
   ========================================================= */

const HQ_GAMES = {

  /* =======================================================
     CURRENTLY PLAYING
  ======================================================= */

  currentlyPlaying: {
    name: "RESIDENT EVIL REQUIEM",
    genre: "Horror • Survival",
    label: "CURRENT OPERATION",
    url: "https://www.residentevil.com/requiem/",
    art: "https://image.api.playstation.com/vulcan/ap/rnd/202509/3015/2f6e2d5c4f9d3f9f1c0a7a7f0e5f1c4d7e4f1f1e.png"
  },


  /* =======================================================
     UP NEXT
  ======================================================= */

  upNext: {
    name: "SEKIRO: SHADOWS DIE TWICE",
    genre: "Action • Soulslike",
    label: "NEXT OPERATION",
    url: "https://www.sekirothegame.com/",
    art: "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg"
  },


  /* =======================================================
     PLAYED ON STREAM
  ======================================================= */

  playedOnStream: [

    {
      name: "RESIDENT EVIL VILLAGE",
      genre: "Horror • Survival",
      label: "RESIDENT EVIL",
      url: "https://www.residentevil.com/village/",
      art: "https://cdn.akamai.steamstatic.com/steam/apps/1196590/header.jpg"
    },

    {
      name: "GOD OF WAR",
      genre: "Action • Adventure",
      label: "GOD OF WAR",
      url: "https://www.playstation.com/en-in/games/god-of-war/",
      art: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S2_1200x1600-fbdf3cbc2980749091d52751ffabb7b7_1200x1600"
    },

    {
      name: "BGMI",
      genre: "Battle Royale • Shooter",
      label: "BGMI",
      url: "https://www.battlegroundsmobileindia.com/",
      art: "https://akm-img-a-in.tosshub.com/sites/itgaming/resources/202412/unnamed271224011520.png?size=1200%3A675"
    },

    {
      name: "ROBLOX",
      genre: "Adventure • Multiplayer",
      label: "ROBLOX",
      url: "https://www.roblox.com/",
      art: "https://cms-media.roblox.com/assets/93732cb0-db70-1bdc-923c-f7526dc7086c.webp"
    },

    {
      name: "GOD OF WAR",
      genre: "Action • Adventure",
      label: "GOD OF WAR (2005)",
      url: "https://www.playstation.com/en-us/games/god-of-war/",
      art: "https://upload.wikimedia.org/wikipedia/en/7/7b/God_of_War_2005_cover.jpg"
    },

    {
      name: "GOD OF WAR: ASCENSION",
      genre: "Action • Adventure",
      label: "ASCENSION",
      url: "https://www.playstation.com/en-us/games/god-of-war-ascension/",
      art: "https://upload.wikimedia.org/wikipedia/en/3/34/God_of_War_-_Ascension_cover.jpg"
    },

    {
      name: "GOD OF WAR: CHAINS OF OLYMPUS",
      genre: "Action • Adventure",
      label: "CHAINS OF OLYMPUS",
      url: "https://www.playstation.com/",
      art: "https://upload.wikimedia.org/wikipedia/en/4/47/God_of_War_-_Chains_of_Olympus_cover.jpg"
    },

    {
      name: "007: FIRST LIGHT",
      genre: "Action • Stealth",
      label: "007: FIRST LIGHT",
      url: "https://www.007firstlight.com/",
      art: "https://image.api.playstation.com/vulcan/ap/rnd/202506/0410/007-first-light.png"
    }

  ]

};


/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function escapeHTML(value = "") {

  return String(value).replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character])
  );

}


function escapeAttribute(value = "") {

  return escapeHTML(value)
    .replace(/`/g, "&#096;");

}


function gameArtwork(game) {

  return String(
    game?.art || ""
  )
    .replace(/'/g, "%27")
    .trim();

}


/* =========================================================
   GAME IMAGE FALLBACK
   ========================================================= */

function createGameArtFallback(element, game) {

  if (!element) return;

  element.classList.add(
    "game-art-fallback"
  );

  /*
    Remove broken background image.
  */

  element.style.backgroundImage =
    "linear-gradient(135deg, #111 0%, #050505 100%)";


  /*
    Add fallback game name.
  */

  const existing =
    element.querySelector(
      ".game-art-fallback-text"
    );

  if (!existing) {

    const fallback =
      document.createElement("div");

    fallback.className =
      "game-art-fallback-text";

    fallback.textContent =
      game?.name || "GAME";

    element.prepend(
      fallback
    );

  }

}


function attachGameImageFallback(element, game) {

  if (!element) return;

  const art =
    gameArtwork(game);

  if (!art) {

    createGameArtFallback(
      element,
      game
    );

    return;

  }

  const image =
    new Image();

  image.onload = () => {

    element.style.backgroundImage =
      element.dataset.originalBackground ||
      element.style.backgroundImage;

  };

  image.onerror = () => {

    createGameArtFallback(
      element,
      game
    );

  };

  image.src = art;

}


/* =========================================================
   CURRENTLY PLAYING
   ========================================================= */

function renderCurrentlyPlaying() {

  const card =
    document.getElementById(
      "currentlyPlayingCard"
    );

  if (!card) return;

  const game =
    HQ_GAMES.currentlyPlaying;


  if (!game) {

    card.innerHTML = `
      <div class="game-feature-empty">
        CURRENTLY PLAYING
      </div>
    `;

    return;

  }


  const name =
    escapeHTML(game.name);

  const genre =
    escapeHTML(game.genre);

  const label =
    escapeHTML(
      game.label ||
      "CURRENT OPERATION"
    );

  const url =
    escapeAttribute(
      game.url ||
      "#"
    );

  const art =
    gameArtwork(game);


  card.innerHTML = `

    <a
      class="game-feature-link"
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open ${name}"
    >

      <div
        class="game-feature-art"
        data-game-art="${escapeAttribute(art)}"
        style="
          background-image:
            linear-gradient(
              90deg,
              rgba(0,0,0,.90) 0%,
              rgba(0,0,0,.55) 48%,
              rgba(0,0,0,.15) 100%
            ),
            linear-gradient(
              180deg,
              rgba(0,0,0,.08) 35%,
              rgba(0,0,0,.82) 100%
            ),
            url('${art}');
        "
      >

        <div class="game-feature-content">

          <span
            class="game-feature-status current-status">

            <span
              class="game-feature-status-dot">
            </span>

            ${label}

          </span>


          <div class="game-feature-index">
            01 // ACTIVE TITLE
          </div>


          <h3>
            ${name}
          </h3>


          <p>
            ${genre}
          </p>


          <span class="game-feature-action">
            VIEW GAME
            <span>→</span>
          </span>

        </div>

      </div>

    </a>

  `;


  const artElement =
    card.querySelector(
      ".game-feature-art"
    );

  attachGameImageFallback(
    artElement,
    game
  );

}


/* =========================================================
   UP NEXT
   ========================================================= */

function renderUpNext() {

  const card =
    document.getElementById(
      "upNextCard"
    );

  if (!card) return;

  const game =
    HQ_GAMES.upNext;


  if (!game) {

    card.innerHTML = `
      <div class="game-feature-empty">
        UP NEXT
      </div>
    `;

    return;

  }


  const name =
    escapeHTML(game.name);

  const genre =
    escapeHTML(game.genre);

  const label =
    escapeHTML(
      game.label ||
      "NEXT OPERATION"
    );

  const url =
    escapeAttribute(
      game.url ||
      "#"
    );

  const art =
    gameArtwork(game);


  card.innerHTML = `

    <a
      class="game-feature-link"
      href="${url}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open ${name}"
    >

      <div
        class="game-feature-art"
        data-game-art="${escapeAttribute(art)}"
        style="
          background-image:
            linear-gradient(
              90deg,
              rgba(0,0,0,.88) 0%,
              rgba(0,0,0,.50) 48%,
              rgba(0,0,0,.15) 100%
            ),
            linear-gradient(
              180deg,
              rgba(0,0,0,.08) 35%,
              rgba(0,0,0,.82) 100%
            ),
            url('${art}');
        "
      >

        <div class="game-feature-content">

          <span
            class="game-feature-status next-status">

            <span
              class="game-feature-status-dot">
            </span>

            ${label}

          </span>


          <div class="game-feature-index">
            02 // NEXT OPERATION
          </div>


          <h3>
            ${name}
          </h3>


          <p>
            ${genre}
          </p>


          <span class="game-feature-action">
            VIEW GAME
            <span>→</span>
          </span>

        </div>

      </div>

    </a>

  `;


  const artElement =
    card.querySelector(
      ".game-feature-art"
    );

  attachGameImageFallback(
    artElement,
    game
  );

}


/* =========================================================
   PLAYED ON STREAM
   ========================================================= */

function renderPlayedGames() {

  const grid =
    document.getElementById(
      "playedGamesGrid"
    );

  if (!grid) return;


  const games =
    Array.isArray(
      HQ_GAMES.playedOnStream
    )
      ? HQ_GAMES.playedOnStream
      : [];


  if (!games.length) {

    grid.innerHTML = `
      <div class="loading-card">
        NO ARCHIVED GAMES
      </div>
    `;

    return;

  }


  grid.innerHTML =
    games.map(
      (game, index) => {

        const name =
          escapeHTML(
            game.name
          );

        const genre =
          escapeHTML(
            game.genre
          );

        const label =
          escapeHTML(
            game.label ||
            game.name
          );

        const url =
          escapeAttribute(
            game.url ||
            "#"
          );

        const art =
          gameArtwork(game);


        return `

          <a
            class="game-compact-card"
            href="${url}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open ${name}"
          >

            <div
              class="game-compact-art"
              data-game-art="${escapeAttribute(art)}"
              style="
                background-image:
                  linear-gradient(
                    180deg,
                    rgba(0,0,0,.05),
                    rgba(0,0,0,.78)
                  ),
                  url('${art}');
              "
            >

              <span class="game-compact-number">
                ${String(index + 1).padStart(2, "0")}
              </span>


              <span class="game-compact-label">
                ${label}
              </span>

            </div>


            <div class="game-compact-info">

              <h3>
                ${name}
              </h3>

              <p>
                ${genre}
              </p>

            </div>


            <span class="game-compact-arrow">
              →
            </span>

          </a>

        `;

      }
    ).join("");


  /*
    Attach image fallback to every archive card.
  */

  grid
    .querySelectorAll(
      ".game-compact-art"
    )
    .forEach(
      (element, index) => {

        attachGameImageFallback(
          element,
          games[index]
        );

      }
    );

}


/* =========================================================
   RENDER ALL GAMES
   ========================================================= */

function renderGames() {

  renderCurrentlyPlaying();

  renderUpNext();

  renderPlayedGames();

}


/* =========================================================
   GAME ARCHIVE
   ========================================================= */

function setupGameArchive() {

  const archive =
    document.querySelector(
      ".games-archive"
    );

  if (!archive) return;


  /*
    Archive is intentionally closed
    when the page first loads.
  */

  archive.removeAttribute(
    "open"
  );

}


/* =========================================================
   YOUTUBE CONFIG
   ========================================================= */

const CHANNEL_ID =
  "UCClntt9HBQirLO6m0klTY4g";

const CHANNEL_URL =
  "https://www.youtube.com/@HitmanHQGaming";

const SHORTS_URL =
  "https://www.youtube.com/@HitmanHQGaming/shorts";


const HITMAN_HQ_API =
  "https://hitman-hq-api.uikeyshiva14.workers.dev";


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const heroLiveBadge =
  document.getElementById(
    "heroLiveBadge"
  );


const featuredThumb =
  document.getElementById(
    "featuredThumb"
  );

const featuredTitle =
  document.getElementById(
    "featuredTitle"
  );

const featuredDate =
  document.getElementById(
    "featuredDate"
  );

const featuredWatch =
  document.getElementById(
    "featuredWatch"
  );

const featuredBadge =
  document.getElementById(
    "featuredBadge"
  );


const contentGrid =
  document.getElementById(
    "contentGrid"
  );


const liveStatus =
  document.getElementById(
    "liveStatus"
  );

const liveTitle =
  document.getElementById(
    "liveTitle"
  );

const liveMessage =
  document.getElementById(
    "liveMessage"
  );

const liveButton =
  document.getElementById(
    "liveButton"
  );


const featuredShortThumb =
  document.getElementById(
    "featuredShortThumb"
  );

const featuredShortTitle =
  document.getElementById(
    "featuredShortTitle"
  );

const featuredShortDescription =
  document.getElementById(
    "featuredShortDescription"
  );

const featuredShortWatch =
  document.getElementById(
    "featuredShortWatch"
  );


/* =========================================================
   YOUTUBE DATE
   ========================================================= */

function formatDate(
  dateString
) {

  if (!dateString) {
    return "";
  }


  const date =
    new Date(dateString);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }


  return date.toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric"
    }
  );

}


/* =========================================================
   YOUTUBE VIDEO ID
   ========================================================= */

function youtubeId(item = {}) {

  if (item.videoId) {
    return item.videoId;
  }


  if (item.video_id) {
    return item.video_id;
  }


  if (
    item.guid &&
    typeof item.guid === "string" &&
    item.guid.includes(
      "yt:video:"
    )
  ) {

    return item.guid
      .split(":")
      .pop();

  }


  const link =
    item.link ||
    item.url ||
    "";


  if (!link) {
    return "";
  }


  try {

    const url =
      new URL(link);


    const videoParameter =
      url.searchParams.get("v");


    if (videoParameter) {
      return videoParameter;
    }


    const match =
      url.pathname.match(
        /\/(?:shorts|live|embed)\/([A-Za-z0-9_-]{6,})/
      );


    if (match) {
      return match[1];
    }

  } catch (_) {}


  return "";

}


/* =========================================================
   YOUTUBE VIDEO URL
   ========================================================= */

function videoUrl(item = {}) {

  const id =
    youtubeId(item);


  if (
    item.url &&
    /youtube\.com\/shorts\//i.test(
      item.url
    )
  ) {
    return item.url;
  }


  if (item.url) {
    return item.url;
  }


  if (item.link) {
    return item.link;
  }


  if (id) {

    return (
      `https://www.youtube.com/watch?v=${id}`
    );

  }


  return CHANNEL_URL;

}


/* =========================================================
   NORMALIZE API ITEM
   ========================================================= */

function normalizeApiItem(
  item
) {

  if (!item) {
    return null;
  }


  const id =
    item.video_id ||
    item.videoId ||
    youtubeId(item);


  return {

    video_id: id,

    videoId: id,


    title:
      item.title ||
      item.name ||
      "",


    url:
      item.url ||
      item.link ||
      (
        id
          ? `https://www.youtube.com/watch?v=${id}`
          : CHANNEL_URL
      ),


    link:
      item.url ||
      item.link ||
      (
        id
          ? `https://www.youtube.com/watch?v=${id}`
          : CHANNEL_URL
      ),


    thumbnail:
      item.thumbnail ||
      item.thumb ||
      item.image ||
      "",


    published_at:
      item.published_at ||
      item.publishedAt ||
      item.pubDate ||
      item.date ||
      "",


    pubDate:
      item.published_at ||
      item.publishedAt ||
      item.pubDate ||
      item.date ||
      "",


    content_type:
      item.content_type ||
      item.contentType ||
      item.type ||
      "YouTube",


    is_live:
      item.is_live === true ||
      item.isLive === true,


    live_status:
      item.live_status ||
      item.liveStatus ||
      ""

  };

}


/* =========================================================
   CONTENT TYPE
   ========================================================= */

function isShort(
  item = {}
) {

  const title =
    item.title ||
    "";

  const url =
    item.url ||
    item.link ||
    "";


  return (
    /(?:#shorts\b|\bshorts\b)/i.test(
      title
    ) ||
    /youtube\.com\/shorts\//i.test(
      url
    )
  );

}


function isLive(
  item = {}
) {

  if (!item) {
    return false;
  }


  return (
    item.is_live === true ||
    item.live_status === "live" ||
    item.live_status === "LIVE"
  );

}


function contentBadge(
  item
) {

  if (isLive(item)) {
    return "LIVE";
  }


  if (isShort(item)) {
    return "SHORTS";
  }


  return "YOUTUBE";

}


/* =========================================================
   CONTENT CARD
   ========================================================= */

function renderCard(
  item
) {

  const id =
    youtubeId(item);


  const thumb =
    item.thumbnail ||
    (
      id
        ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
        : ""
    );


  const url =
    videoUrl(item);


  return `

    <article class="content-card">

      <a
        class="thumb"
        href="${escapeAttribute(url)}"
        target="_blank"
        rel="noopener noreferrer"
      >

        ${
          thumb
            ? `
              <img
                src="${escapeAttribute(thumb)}"
                alt=""
                loading="lazy"
              >
            `
            : `
              <div class="thumb-placeholder">
                HQ
              </div>
            `
        }

      </a>


      <div class="body">

        <span class="platform-badge">
          ${contentBadge(item)}
        </span>


        <h3>
          ${escapeHTML(
            item.title ||
            "Untitled"
          )}
        </h3>


        <p>
          ${formatDate(
            item.pubDate
          )}
        </p>


        <a
          class="watch-link"
          href="${escapeAttribute(url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          WATCH →
        </a>

      </div>

    </article>

  `;

}


/* =========================================================
   RENDER YOUTUBE FEED
   ========================================================= */

function renderFeed(
  items
) {

  const cleanItems =
    items
      .filter(Boolean)
      .map(normalizeApiItem)
      .filter(
        item =>
          item &&
          (
            item.title ||
            youtubeId(item)
          )
      );


  if (!cleanItems.length) {
    throw new Error(
      "No YouTube content available"
    );
  }


  /*
    Remove duplicates.
  */

  const uniqueItems = [];

  const seen =
    new Set();


  cleanItems.forEach(
    item => {

      const id =
        youtubeId(item) ||
        item.url ||
        item.title;


      if (
        seen.has(id)
      ) {
        return;
      }


      seen.add(id);

      uniqueItems.push(
        item
      );

    }
  );


  const latest =
    uniqueItems[0];


  const id =
    youtubeId(latest);


  const thumb =
    latest.thumbnail ||
    (
      id
        ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
        : ""
    );


  if (featuredThumb) {

    featuredThumb.innerHTML =
      thumb
        ? `
          <img
            src="${escapeAttribute(thumb)}"
            alt="${escapeAttribute(
              latest.title ||
              "Latest Hitman HQ Gaming content"
            )}"
          >
        `
        : `
          <div class="thumb-placeholder">
            YOUTUBE
          </div>
        `;

  }


  if (featuredTitle) {

    featuredTitle.textContent =
      latest.title ||
      "Latest Hitman HQ Gaming content";

  }


  if (featuredDate) {

    featuredDate.textContent =
      formatDate(
        latest.pubDate
      );

  }


  if (featuredWatch) {

    featuredWatch.href =
      videoUrl(latest);

  }


  if (featuredBadge) {

    featuredBadge.textContent =
      contentBadge(latest);

  }


  /*
    Display the next three videos.
  */

  const cards =
    uniqueItems
      .slice(1, 4)
      .map(renderCard)
      .join("");


  if (contentGrid) {

    contentGrid.innerHTML =
      cards ||
      `
        <div class="loading-card">
          MORE CONTENT COMING SOON
        </div>
      `;

  }

}


/* =========================================================
   LIVE STATE
   ========================================================= */

function renderLiveState(
  live
) {

  const active =
    live &&
    (
      live.is_live === true ||
      live.isLive === true ||
      live.live_status === "live" ||
      live.live_status === "LIVE"
    );


  if (active) {

    const item =
      normalizeApiItem(
        live
      );


    if (heroLiveBadge) {

      heroLiveBadge.hidden =
        false;

    }


    if (liveStatus) {

      liveStatus.textContent =
        "LIVE NOW";

      liveStatus.classList.add(
        "live"
      );

    }


    if (liveTitle) {

      liveTitle.textContent =
        item.title ||
        "Live on YouTube";

    }


    if (liveMessage) {

      liveMessage.textContent =
        "The channel is currently live.";

    }


    if (liveButton) {

      liveButton.href =
        item.url ||
        `${CHANNEL_URL}/live`;

    }


    return;

  }


  if (heroLiveBadge) {
    heroLiveBadge.hidden = true;
  }


  if (liveStatus) {

    liveStatus.textContent =
      "OFFLINE";

    liveStatus.classList.remove(
      "live"
    );

  }


  if (liveTitle) {

    liveTitle.textContent =
      "No live stream detected";

  }


  if (liveMessage) {

    liveMessage.textContent =
      "Follow the channel to catch the next stream.";

  }


  if (liveButton) {

    liveButton.href =
      `${CHANNEL_URL}/live`;

  }

}


/* =========================================================
   FEATURED SHORT
   ========================================================= */

function renderFeaturedShort(
  item
) {

  const normalized =
    normalizeApiItem(item);


  if (!normalized) {
    return;
  }


  const id =
    youtubeId(normalized);


  if (
    id &&
    featuredShortThumb
  ) {

    featuredShortThumb.src =
      normalized.thumbnail ||
      `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;


    featuredShortThumb.alt =
      normalized.title ||
      "Latest Hitman HQ YouTube Short";

  }


  if (featuredShortTitle) {

    featuredShortTitle.textContent =
      normalized.title ||
      "Latest YouTube Short";

  }


  if (featuredShortDescription) {

    const date =
      formatDate(
        normalized.pubDate
      );


    featuredShortDescription.textContent =
      date
        ? `Latest Short • ${date}`
        : "Latest YouTube Short";

  }


  if (featuredShortWatch) {

    featuredShortWatch.href =
      normalized.url ||
      (
        id
          ? `https://www.youtube.com/shorts/${id}`
          : SHORTS_URL
      );

  }

}


/* =========================================================
   LOAD HQ API
   ========================================================= */

async function loadHQApi() {

  const response =
    await fetch(
      `${HITMAN_HQ_API}?t=${Date.now()}`,
      {
        cache: "no-store",

        headers: {
          "Accept": "application/json"
        }
      }
    );


  if (!response.ok) {

    throw new Error(
      `API returned ${response.status}`
    );

  }


  const data =
    await response.json();


  if (
    !data ||
    typeof data !== "object"
  ) {

    throw new Error(
      "Invalid API response"
    );

  }


  /*
    We intentionally do NOT check:
    data.status === "online"

    This prevents valid API responses
    from being rejected.
  */

  return data;

}


/* =========================================================
   EXTRACT API CONTENT
   ========================================================= */

function extractApiItems(
  data
) {

  if (
    !data ||
    typeof data !== "object"
  ) {

    return [];

  }


  const items = [];


  if (data.latest) {
    items.push(
      data.latest
    );
  }


  if (
    Array.isArray(
      data.recent
    )
  ) {

    items.push(
      ...data.recent
    );

  }


  if (
    Array.isArray(
      data.items
    )
  ) {

    items.push(
      ...data.items
    );

  }


  if (
    Array.isArray(
      data.videos
    )
  ) {

    items.push(
      ...data.videos
    );

  }


  if (
    Array.isArray(
      data.content
    )
  ) {

    items.push(
      ...data.content
    );

  }


  return items
    .map(
      normalizeApiItem
    )
    .filter(Boolean);

}


/* =========================================================
   LOAD YOUTUBE
   ========================================================= */

async function loadYouTube() {

  try {

    const data =
      await loadHQApi();


    const items =
      extractApiItems(data);


    if (!items.length) {

      throw new Error(
        "API returned no YouTube content"
      );

    }


    renderFeed(
      items
    );


    renderLiveState(
      data.live ||
      data.liveStream ||
      data.currentLive ||
      null
    );


    document.documentElement
      .setAttribute(
        "data-youtube-status",
        "online"
      );

  } catch (error) {

    console.warn(
      "YouTube feed unavailable:",
      error
    );


    if (featuredTitle) {

      featuredTitle.textContent =
        "HITMAN HQ GAMING";

    }


    if (featuredDate) {

      featuredDate.textContent =
        "Latest content available on YouTube";

    }


    if (featuredThumb) {

      featuredThumb.innerHTML = `

        <div class="thumb-placeholder">
          YOUTUBE
        </div>

      `;

    }


    if (featuredWatch) {

      featuredWatch.href =
        CHANNEL_URL;

    }


    if (contentGrid) {

      contentGrid.innerHTML = `

        <div class="loading-card">
          YOUTUBE FEED TEMPORARILY UNAVAILABLE
        </div>

        <div class="loading-card">
          OPEN CHANNEL
        </div>

      `;

    }


    renderLiveState(
      null
    );


    document.documentElement
      .setAttribute(
        "data-youtube-status",
        "offline"
      );

  }

}


/* =========================================================
   LOAD LATEST SHORT
   ========================================================= */

async function loadLatestShort() {

  try {

    const data =
      await loadHQApi();


    let latestShort =
      data.latest_short ||
      data.latestShort ||
      null;


    /*
      Fallback:
      Search API content for a Short.
    */

    if (!latestShort) {

      const items =
        extractApiItems(data);


      latestShort =
        items.find(
          isShort
        ) ||
        null;

    }


    if (!latestShort) {

      throw new Error(
        "No Short found"
      );

    }


    renderFeaturedShort(
      latestShort
    );

  } catch (error) {

    console.warn(
      "Latest Short unavailable:",
      error
    );


    if (featuredShortTitle) {

      featuredShortTitle.textContent =
        "LATEST YOUTUBE SHORT";

    }


    if (featuredShortDescription) {

      featuredShortDescription.textContent =
        "Open the Shorts feed to see the latest content.";

    }


    if (featuredShortWatch) {

      featuredShortWatch.href =
        SHORTS_URL;

    }

  }

}


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle =
  document.querySelector(
    ".menu-toggle"
  );


const nav =
  document.querySelector(
    ".nav-links"
  );


if (
  menuToggle &&
  nav
) {

  menuToggle.addEventListener(
    "click",
    () => {

      const open =
        nav.classList.toggle(
          "open"
        );


      menuToggle.setAttribute(
        "aria-expanded",
        String(open)
      );

    }
  );


  document
    .querySelectorAll(
      ".nav-links a"
    )
    .forEach(
      link => {

        link.addEventListener(
          "click",
          () => {

            nav.classList.remove(
              "open"
            );


            menuToggle.setAttribute(
              "aria-expanded",
              "false"
            );

          }
        );

      }
    );

}


/* =========================================================
   SOCIAL UPLINK INTERACTION
   ========================================================= */

function setupSocialInteractions() {

  const socialCards =
    document.querySelectorAll(
      ".social-uplink, .social-tile"
    );


  if (!socialCards.length) {
    return;
  }


  socialCards.forEach(
    card => {

      /*
        Mouse / pointer selection.
      */

      card.addEventListener(
        "pointerdown",
        () => {

          socialCards.forEach(
            item => {

              item.classList.remove(
                "selected"
              );

            }
          );


          card.classList.add(
            "selected"
          );

        }
      );


      /*
        Keyboard focus.
      */

      card.addEventListener(
        "focus",
        () => {

          card.classList.add(
            "selected"
          );

        }
      );


      card.addEventListener(
        "blur",
        () => {

          card.classList.remove(
            "selected"
          );

        }
      );

    }
  );

}


/* =========================================================
   HQ EASTER EGG
   ========================================================= */

(() => {

  const target =
    document.getElementById(
      "hqSecretTarget"
    );


  if (!target) {
    return;
  }


  let clicks = 0;

  let timer;


  target.addEventListener(
    "click",
    () => {

      clicks += 1;


      clearTimeout(
        timer
      );


      timer =
        setTimeout(
          () => {

            clicks = 0;

          },
          1800
        );


      if (clicks < 3) {
        return;
      }


      clicks = 0;


      const overlay =
        document.createElement(
          "div"
        );


      overlay.className =
        "agent-easter-egg";


      overlay.innerHTML = `

        <div class="agent-easter-box">

          <div
            class="agent-easter-target">
          </div>


          <div
            class="agent-easter-kicker">

            HITMAN HEADQUARTERS // CLASSIFIED

          </div>


          <div
            class="agent-easter-title">

            ACCESS GRANTED

          </div>


          <div
            class="agent-easter-copy"
            id="agentEasterCopy">

            Verifying clearance...

          </div>


          <div
            class="agent-easter-status"
            id="agentEasterStatus">

            INITIALIZING AGENT PROTOCOL

          </div>

        </div>

      `;


      document.body.appendChild(
        overlay
      );


      const copy =
        overlay.querySelector(
          "#agentEasterCopy"
        );


      const status =
        overlay.querySelector(
          "#agentEasterStatus"
        );


      const steps = [

        [
          "IDENTITY: UNKNOWN",
          "SECURITY CHECK COMPLETE"
        ],

        [
          "IDENTITY: VERIFIED",
          "CLEARANCE: RECRUIT"
        ],

        [
          "AGENT STATUS: ACTIVATED",
          "MISSION PROTOCOL ONLINE"
        ],

        [
          "AGENT, YOU HAVE BEEN SELECTED.",
          "MISSION: PLAY. HUNT. CONQUER."
        ],

        [
          "OBJECTIVE: ENTER THE HEADQUARTERS.",
          "STATUS: MISSION ACTIVE"
        ],

        [
          "🏆 ACHIEVEMENT UNLOCKED — YOU FOUND THE HQ SECRET",
          "WELCOME TO HITMAN HEADQUARTERS"
        ]

      ];


      let i = 0;


      const show =
        () => {

          const [
            first,
            second
          ] =
            steps[i];


          if (copy) {
            copy.textContent =
              first;
          }


          if (status) {
            status.textContent =
              second;
          }


          i += 1;


          if (
            i <
            steps.length
          ) {

            setTimeout(
              show,
              950
            );

          }

        };


      show();


      setTimeout(
        () => {

          overlay.remove();

        },
        6200
      );

    }
  );

})();


/* =========================================================
   SUPPORT / UPI COPY
   ========================================================= */

document
  .querySelectorAll(
    ".support-copy-btn"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        async () => {

          const value =
            button.dataset.copy ||
            "";


          try {

            await navigator
              .clipboard
              .writeText(
                value
              );


            const old =
              button.textContent;


            button.textContent =
              "COPIED ✓";


            setTimeout(
              () => {

                button.textContent =
                  old;

              },
              1400
            );

          } catch (_) {

            window.prompt(
              "Copy UPI ID:",
              value
            );

          }

        }
      );

    }
  );


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderGames();

    setupGameArchive();

    setupSocialInteractions();

    loadYouTube();

    loadLatestShort();

  }
);
```
