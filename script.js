function setup() {
  const allEpisodes = getAllEpisodes();
  renderEpisodes(allEpisodes);
}

function renderEpisodes(episodeList) {
  const episodesContainer = document.getElementById("root");
  episodesContainer.classList.add("grid-container");

  episodeList.forEach((episode) => {
    const episodeDiv = document.createElement("div");
    episodeDiv.classList.add("episode-box");

    const episodeCode = formatEpisodeCode(episode.season, episode.number);

    episodeDiv.innerHTML = `
      <h2 class="episode-name">${episode.name} (${episodeCode})</h2>
      <p>Season ${episode.season}, Episode ${episode.number}</p>
      <img class="episode-image" src="${episode.image.medium}" alt="${episode.name}" />
      <p class="episode-summary">${episode.summary}</p>
      <p>Source: <a class="episode-link" href="${episode.url}" target="_blank">TVMaze.com</a></p>
    `;

    episodesContainer.appendChild(episodeDiv);
  });

  episodesContainer.insertAdjacentHTML(
    "beforebegin",
    `<p>Got ${episodeList.length} episode(s)</p>`
  );
}

function formatEpisodeCode(season, number) {
  return `S${season.toString().padStart(2, "0")}E${number
    .toString()
    .padStart(2, "0")}`;
}

window.onload = setup;
