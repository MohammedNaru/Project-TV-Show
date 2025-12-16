// -----------------------------
// STATE + CACHE
// -----------------------------
const API_BASE = "https://api.tvmaze.com";

let showsCache = null;
const episodesCache = {};

let currentShowEpisodes = [];

// -----------------------------
// DOM ELEMENTS
// -----------------------------
const showsContainer = document.getElementById("showsContainer");
const episodesContainer = document.getElementById("episodes");

const showSearch = document.getElementById("showSearch");
const episodeSearch = document.getElementById("episodeSearch");
const episodeSelect = document.getElementById("episodeSelect");
const episodeCount = document.getElementById("episodeCount");

const backToShows = document.getElementById("backToShows");
const episodeControls = document.getElementById("episodeControls");
const pageTitle = document.getElementById("pageTitle");

// -----------------------------
// FETCH HELPERS (FETCH ONCE)
// -----------------------------
async function fetchShows() {
  if (showsCache) return showsCache;

  const response = await fetch(`${API_BASE}/shows`);
  showsCache = await response.json();

  showsCache.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  return showsCache;
}

async function fetchEpisodes(showId) {
  if (episodesCache[showId]) return episodesCache[showId];

  const response = await fetch(`${API_BASE}/shows/${showId}/episodes`);
  const episodes = await response.json();

  episodesCache[showId] = episodes;
  return episodes;
}

// -----------------------------
// SHOWS VIEW
// -----------------------------
function renderShows(shows) {
  showsContainer.innerHTML = "";

  shows.forEach(show => {
    const card = document.createElement("div");
    card.className = "episode-box";

    card.innerHTML = `
      <h2 class="episode-name">${show.name}</h2>
      <img class="episode-image" src="${show.image?.medium || ""}">
      <p>${show.summary || ""}</p>
      <p><strong>Genres:</strong> ${show.genres.join(", ")}</p>
      <p><strong>Status:</strong> ${show.status}</p>
      <p><strong>Rating:</strong> ${show.rating.average || "N/A"}</p>
      <p><strong>Runtime:</strong> ${show.runtime} mins</p>
    `;

    card.addEventListener("click", () => loadShowEpisodes(show.id, show.name));
    showsContainer.appendChild(card);
  });
}

// -----------------------------
// EPISODES VIEW
// -----------------------------
function renderEpisodes(episodes) {
  episodesContainer.innerHTML = "";

  episodes.forEach(ep => {
    const card = document.createElement("div");
    card.className = "episode-box";

    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");

    card.innerHTML = `
      <h2 class="episode-name">
        S${season}E${number} - ${ep.name}
      </h2>
      <img class="episode-image" src="${ep.image?.medium || ""}">
      <p class="episode-summary">${ep.summary || ""}</p>
    `;

    episodesContainer.appendChild(card);
  });

  episodeCount.textContent = `Showing ${episodes.length} episodes`;
}

function populateEpisodeSelect(episodes) {
  episodeSelect.innerHTML = `<option value="">Jump to an episode...</option>`;

  episodes.forEach(ep => {
    const option = document.createElement("option");
    option.value = ep.id;

    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");

    option.textContent = `S${season}E${number} - ${ep.name}`;
    episodeSelect.appendChild(option);
  });
}

// -----------------------------
// VIEW SWITCHING
// -----------------------------
async function loadShowEpisodes(showId, showName) {
  const episodes = await fetchEpisodes(showId);
  currentShowEpisodes = episodes;

  pageTitle.textContent = showName;
  showsContainer.style.display = "none";
  showSearch.style.display = "none";
  backToShows.style.display = "inline-block";
  episodeControls.style.display = "block";

  populateEpisodeSelect(episodes);
  renderEpisodes(episodes);
}

backToShows.addEventListener("click", () => {
  pageTitle.textContent = "TV Shows";
  showsContainer.style.display = "grid";
  showSearch.style.display = "block";
  backToShows.style.display = "none";
  episodeControls.style.display = "none";

  episodesContainer.innerHTML = "";
});

// -----------------------------
// SEARCH LOGIC
// -----------------------------
showSearch.addEventListener("input", async () => {
  const term = showSearch.value.toLowerCase();
  const shows = await fetchShows();

  const filtered = shows.filter(show =>
    show.name.toLowerCase().includes(term) ||
    show.summary?.toLowerCase().includes(term) ||
    show.genres.join(" ").toLowerCase().includes(term)
  );

  renderShows(filtered);
});

episodeSearch.addEventListener("input", () => {
  const term = episodeSearch.value.toLowerCase();

  const filtered = currentShowEpisodes.filter(ep =>
    ep.name.toLowerCase().includes(term) ||
    ep.summary?.toLowerCase().includes(term)
  );

  renderEpisodes(filtered);
});

episodeSelect.addEventListener("change", () => {
  const id = episodeSelect.value;

  if (!id) {
    renderEpisodes(currentShowEpisodes);
    return;
  }

  const selected = currentShowEpisodes.find(ep => ep.id.toString() === id);
  renderEpisodes([selected]);
});

// -----------------------------
// APP START
// -----------------------------
fetchShows().then(renderShows);
