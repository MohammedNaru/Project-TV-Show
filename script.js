let allEpisodes = [];

function setup() {
  allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes);
  populateEpisodeSelect(allEpisodes);
  setupSearch();
  setupEpisodeSelect();
}

function renderEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach(episode => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode-box");

    const episodeCode = `S${episode.season
      .toString()
      .padStart(2, "0")}E${episode.number.toString().padStart(2, "0")}`;

    episodeDiv.innerHTML = `
      <h2 class="episode-name">${episode.name} (${episodeCode})</h2>
      <p>Season ${episode.season}, Episode ${episode.number}</p>
      <img class="episode-image" src="${episode.image.medium}" alt="${episode.name}" />
      <p class="episode-summary">${episode.summary}</p>
      <p>Source: <a class="episode-link" href="${episode.url}" target="_blank">TVMaze.com</a></p>
    `;

    rootElem.appendChild(episodeDiv);
  });

  updateEpisodeCount(episodeList.length);
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredEpisodes = allEpisodes.filter(episode => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        episode.summary.toLowerCase().includes(searchTerm)
      );
    });

    renderEpisodes(filteredEpisodes);
  });
}

function populateEpisodeSelect(episodes) {
  const select = document.getElementById("episode-select");

  episodes.forEach(episode => {
    const option = document.createElement("option");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");
    const code = `S${season}E${number}`;

    option.value = episode.id;
    option.textContent = `${code} - ${episode.name}`;

    select.appendChild(option);
  });
}

function setupEpisodeSelect() {
  const select = document.getElementById("episode-select");

  select.addEventListener("change", () => {
    if (select.value === "") {
      renderEpisodes(allEpisodes);
      return;
    }

    const selectedEpisode = allEpisodes.find(
      episode => episode.id.toString() === select.value
    );

    renderEpisodes([selectedEpisode]);
  });
}

function updateEpisodeCount(count) {
  const countElement = document.getElementById("episode-count");
  countElement.textContent = `Showing ${count} episode(s)`;
}

window.onload = setup;
