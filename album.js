document.addEventListener("DOMContentLoaded", () => {
  const trackList = document.getElementById("trackList");
  if (!trackList) {
    console.error("trackList not found");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const albumKey = params.get("album")?.toLowerCase();

  const album = window.albumData?.[albumKey];
  if (!album) {
    console.error("Album not found:", albumKey);
    return;
  }

  trackList.innerHTML = "";

  album.tracks.forEach((track, i) => {
    const row = document.createElement("div");
    row.className = "tracks-grid track-row";

    row.innerHTML = `
      <div class="left">
        <span class="track-index">${i + 1}</span>

        <div class="track-title-block">
          <div class="track-title">${track.title}</div>
          <div class="track-artist">${track.artist}</div>
        </div>
      </div>

      <div class="right">
        <span class="track-time">${track.duration}</span>
      </div>
    `;

    trackList.appendChild(row);
  });
});
