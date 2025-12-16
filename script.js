const episodesContainer = document.getElementById("episodes");
const searchInput = document.getElementById("searchInput");
const episodeSelect = document.getElementById("episodeSelect");
const episodeCount = document.getElementById("episodeCount");
const statusMessage = document.getElementById("statusMessage");
const showSelect = document.getElementById("showSelect");

let allShows = [];
let episodesByShowId = {};
let episodes = [];

/* ---------- FETCH SHOWS (ONCE) ---------- */

fetch("https://api.tvmaze.com/shows")
  .then((response) => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then((shows) => {
    allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    showSelect.innerHTML = `<option value="">Select a show...</option>`;

    allShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });
  })
  .catch(() => {
    showSelect.innerHTML = `<option>Error loading shows</option>`;
  });

/* ---------- FETCH EPISODES (ONCE PER SHOW) ---------- */

function loadEpisodesForShow(showId) {
  if (episodesByShowId[showId]) {
    episodes = episodesByShowId[showId];
    renderAfterShowChange();
    return;
  }

  statusMessage.textContent = "Loading episodes…";

  fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
    .then((response) => {
      if (!response.ok) throw new Error();
      return response.json();
    })
    .then((data) => {
      episodesByShowId[showId] = data;
      episodes = data;
      statusMessage.textContent = "";
      renderAfterShowChange();
    })
    .catch(() => {
      statusMessage.textContent = "Failed to load episodes. Please try again.";
    });
}

/* ---------- RENDER ---------- */

function renderAfterShowChange() {
  searchInput.value = "";
  episodeSelect.innerHTML = `<option value="">Jump to an episode...</option>`;
  populateEpisodeSelect(episodes);
  displayEpisodes(episodes);
}

function displayEpisodes(episodeList) {
  episodesContainer.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.classList.add("episode-box");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    card.innerHTML = `
      <h2 class="episode-name">${episode.name} - ${code}</h2>
      <img class="episode-image"
        src="${episode.image ? episode.image.medium : ""}"
        alt="${episode.name}" />
      <p class="episode-summary">${episode.summary || ""}</p>
    `;

    episodesContainer.appendChild(card);
  });

  episodeCount.textContent = `Showing ${episodeList.length} episodes`;
}

/* ---------- SEARCH ---------- */

searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();

  const filtered = episodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(term) ||
      episode.summary?.toLowerCase().includes(term)
  );

  displayEpisodes(filtered);
});

/* ---------- EPISODE SELECT ---------- */

function populateEpisodeSelect(episodeList) {
  episodeList.forEach((episode) => {
    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${code} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

episodeSelect.addEventListener("change", () => {
  const selectedId = episodeSelect.value;

  if (selectedId === "") {
    displayEpisodes(episodes);
    return;
  }

  const selected = episodes.find((ep) => ep.id.toString() === selectedId);

  displayEpisodes([selected]);
});

/* ---------- SHOW SELECT ---------- */

showSelect.addEventListener("change", () => {
  const showId = showSelect.value;
  if (showId) {
    loadEpisodesForShow(showId);
  }
});
