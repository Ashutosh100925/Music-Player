document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     SIDE PANEL ELEMENTS
  =============================== */
  const sidePanel = document.getElementById("sidePanel");
  const openBtn = document.getElementById("openBtn");
  const closeBtn = document.getElementById("closeBtn");
  const resizeHandle = document.getElementById("resizeHandle");
  const sideRail = document.getElementById("sideRail");

  const sideAlbumImg = document.getElementById("sideAlbumImg");
  const sideAlbumTitle = document.getElementById("sideAlbumTitle");
  const sideAlbumArtists = document.getElementById("sideAlbumArtists");

  /* ===============================
     SIDE PANEL LOGIC
  =============================== */
  if (sidePanel && openBtn && closeBtn && resizeHandle) {

    document.documentElement.classList.add("panel-preload");

    const isOpen = localStorage.getItem("sidePanelOpen") === "true";
    if (isOpen) {
      sidePanel.classList.add("open");
      sidePanel.style.width = "";
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove("panel-preload");
      });
    });

    openBtn.addEventListener("click", () => {
      sidePanel.classList.add("open");
      localStorage.setItem("sidePanelOpen", "true");
      sidePanel.style.width = "";
    });

    sideRail?.addEventListener("click", () => {
      sidePanel.classList.add("open");
      localStorage.setItem("sidePanelOpen", "true");
      sidePanel.style.width = "";
    });

    closeBtn.addEventListener("click", () => {
      sidePanel.classList.remove("open");
      localStorage.setItem("sidePanelOpen", "false");
    });

    let isResizing = false;

    resizeHandle.addEventListener("mousedown", () => {
      isResizing = true;
      sidePanel.classList.add("no-transition");
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 240 && newWidth <= 500) {
        sidePanel.style.width = `${newWidth}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (!isResizing) return;
      isResizing = false;
      sidePanel.classList.remove("no-transition");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    });
  }

  /* ===============================
     ALBUM CARD NAVIGATION
  =============================== */
  document.querySelectorAll(".album-card").forEach(card => {
    card.addEventListener("click", () => {
      const albumId = card.dataset.albumId;
      if (!albumId) return;
      window.location.href = `album.html?album=${albumId}`;
    });
  });

  /* ===============================
     RESTORE TRACK ON REFRESH
  =============================== */
  const savedTrack = localStorage.getItem("currentTrack");

  if (savedTrack && sideAlbumImg && sideAlbumTitle && sideAlbumArtists) {
    const track = JSON.parse(savedTrack);

    sideAlbumImg.src = track.albumImage;
    sideAlbumTitle.textContent = track.title;
    sideAlbumArtists.textContent = track.artists;

    requestAnimationFrame(() => {
      enableScrollIfNeeded(".album-title-wrapper", ".album-title");
      enableScrollIfNeeded(".album-artists-wrapper", ".album-artists");
    });
  }

  /* ===============================
     TRACK CLICK → SIDE PANEL UPDATE
  =============================== */
  const trackList = document.getElementById("trackList");

  if (trackList && sideAlbumImg && sideAlbumTitle && sideAlbumArtists) {

    const params = new URLSearchParams(window.location.search);
    const albumKey = params.get("album")?.toLowerCase();
    const album = window.albumData?.[albumKey];
    if (!album) return;

    trackList.addEventListener("click", (e) => {
      const row = e.target.closest(".track-row");
      if (!row) return;

      const titleEl = row.querySelector(".track-title");
      const artistEl = row.querySelector(".track-artist");
      if (!titleEl || !artistEl) return;

      sideAlbumImg.src = album.image;
      sideAlbumTitle.textContent = titleEl.textContent;
      sideAlbumArtists.textContent = artistEl.textContent;

      localStorage.setItem("currentTrack", JSON.stringify({
        albumImage: album.image,
        title: titleEl.textContent,
        artists: artistEl.textContent
      }));

      requestAnimationFrame(() => {
        enableScrollIfNeeded(".album-title-wrapper", ".album-title");
        enableScrollIfNeeded(".album-artists-wrapper", ".album-artists");
      });

      sidePanel.classList.add("open");
      localStorage.setItem("sidePanelOpen", "true");
    });
  }
});

/* ===============================
   SCROLLING TEXT HELPER
=============================== */
function enableScrollIfNeeded(wrapperSelector, textSelector) {
  const wrapper = document.querySelector(wrapperSelector);
  const text = document.querySelector(textSelector);
  if (!wrapper || !text) return;

  text.classList.remove("scroll");
  text.removeAttribute("data-text");

  if (text.scrollWidth > wrapper.clientWidth) {
    text.classList.add("scroll");
    text.setAttribute("data-text", text.textContent.trim());
  }
}
