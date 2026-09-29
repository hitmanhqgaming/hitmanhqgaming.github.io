const CHANNEL_ID = "UCClntt9HBQirLO6m0klTY4g";
const CHANNEL_HANDLE = "@HitmanHQGaming";
const CHANNEL_URL = "https://www.youtube.com/@HitmanHQGaming";

// RSS2JSON is used only to read the public YouTube RSS feed from a static GitHub Pages site.
// No private API key is stored in this project.
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const FEED_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

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

function escapeHTML(value="") {
  return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function formatDate(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
}

function youtubeId(item) {
  if (item.guid && item.guid.includes("yt:video:")) return item.guid.split(":").pop();
  if (item.link && item.link.includes("v=")) return new URL(item.link).searchParams.get("v");
  return "";
}

function videoUrl(item) {
  const id = youtubeId(item);
  return id ? `https://www.youtube.com/watch?v=${id}` : (item.link || CHANNEL_URL);
}

function isLive(item) {
  const title = (item.title || "").toLowerCase();
  return /live|stream/.test(title) && item.pubDate &&
    (Date.now() - new Date(item.pubDate).getTime()) < 1000 * 60 * 60 * 24 * 2;
}

function renderCard(item) {
  const id = youtubeId(item);
  const thumb = id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
  const live = isLive(item);
  const badge = live ? "LIVE" : (title => /short/i.test(title) ? "SHORTS" : "YOUTUBE")(item.title || "");
  return `
    <article class="content-card">
      <a class="thumb" href="${videoUrl(item)}" target="_blank" rel="noopener">
        ${thumb ? `<img src="${thumb}" alt="">` : `<div class="thumb-placeholder">HQ</div>`}
      </a>
      <div class="body">
        <span class="platform-badge">${badge}</span>
        <h3>${escapeHTML(item.title || "Untitled")}</h3>
        <p>${formatDate(item.pubDate)}</p>
        <a class="watch-link" href="${videoUrl(item)}" target="_blank" rel="noopener">WATCH →</a>
      </div>
    </article>`;
}

async function loadYouTube() {
  try {
    const response = await fetch(FEED_URL);
    if (!response.ok) throw new Error("Feed unavailable");
    const data = await response.json();
    const items = (data.items || []).slice(0, 6);

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
    featuredBadge.textContent = isLive(latest) ? "LIVE" : (/short/i.test(latest.title || "") ? "SHORTS" : "YOUTUBE");

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
      liveTitle.textContent = "No live stream detected";
      liveMessage.textContent = "Follow Hitman HQ on YouTube to catch the next stream.";
      liveButton.href = "https://www.youtube.com/@HitmanHQGaming/live";
    }
  } catch (error) {
    featuredTitle.textContent = "Hitman HQ Gaming";
    featuredDate.textContent = "YouTube feed unavailable right now";
    featuredThumb.innerHTML = `<div class="thumb-placeholder">YOUTUBE</div>`;
    contentGrid.innerHTML = `
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>
      <div class="loading-card">OPEN YOUTUBE FOR LATEST CONTENT</div>`;
    liveStatus.textContent = "CHECK YOUTUBE";
    liveMessage.textContent = "The static site could not read the public feed. The YouTube channel remains available below.";
  }
}

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
document.querySelectorAll(".nav-links a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

loadYouTube();
setInterval(loadYouTube, 5 * 60 * 1000);
