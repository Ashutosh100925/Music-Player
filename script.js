new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: "0%",
      barWidth: "0%",
      duration: "00:00",
      currentTime: "00:00",
      isTimerPlaying: false,

      tracks: [
        {
          name: "Sitaare",
          artist: "Arijit Singh",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Sitaare.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Sitaare%20Ikkis%20128%20Kbps.mp3",
          url: "https://youtu.be/FSFCxQIn_Gg?si=8wg6UrmbjhsyB-Ab",
          favorited: false
        },
        {
          name: "Tere Liye",
          artist: "Atif Aslam",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Tere%20liye.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Tere%20Liye%20Prince%20320%20Kbps.mp3",
          url: "https://youtu.be/AlvUuGJccKs?si=Lh7UDUKCo6A7lxdL",
          favorited: false
        },
        {
          name: "Tu hi meri Shab hai",
          artist: "Pritam & KK",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/KK-1.png",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Tu%20Hi%20Meri%20Shab%20Hai%20Gangster%20320%20Kbps.mp3",
          url: "https://youtu.be/mWBvudKcByg?si=hqLWfvu_YVuyvxnm",
          favorited: false
        },
        {
          name: "Khamoshiyan",
          artist: "Arijit Singh",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Khamoshiyan.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Khamoshiyan%20Jeet%20Gannguli%20320%20Kbps.mp3",
          url: "https://youtu.be/Mv3SZDP7QUo?si=N0-zlquTmCEN8Vze",
          favorited: false
        }
      ],

      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null
    };
  },

  methods: {
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
      localStorage.setItem("isTimerPlaying", this.isTimerPlaying);
    },

    generateTime() {
      if (!this.audio.duration) return;

      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";

      let durMin = Math.floor(this.audio.duration / 60);
      let durSec = Math.floor(this.audio.duration % 60);
      let curMin = Math.floor(this.audio.currentTime / 60);
      let curSec = Math.floor(this.audio.currentTime % 60);

      this.duration = `${durMin < 10 ? "0" : ""}${durMin}:${durSec < 10 ? "0" : ""}${durSec}`;
      this.currentTime = `${curMin < 10 ? "0" : ""}${curMin}:${curSec < 10 ? "0" : ""}${curSec}`;

      // SAVE STATE
      localStorage.setItem("currentTrackIndex", this.currentTrackIndex);
      localStorage.setItem("currentTime", this.audio.currentTime);
    },

    updateBar(x) {
      let progress = this.$refs.progress;
      let percentage = (100 * (x - progress.offsetLeft)) / progress.offsetWidth;
      percentage = Math.max(0, Math.min(100, percentage));

      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (this.audio.duration * percentage) / 100;
      this.audio.play();
      this.isTimerPlaying = true;
    },

    clickProgress(e) {
      this.audio.pause();
      this.updateBar(e.pageX);
    },

    prevTrack() {
      this.currentTrackIndex =
        this.currentTrackIndex > 0
          ? this.currentTrackIndex - 1
          : this.tracks.length - 1;

      this.switchTrack();
    },

    nextTrack() {
      this.currentTrackIndex =
        this.currentTrackIndex < this.tracks.length - 1
          ? this.currentTrackIndex + 1
          : 0;

      this.switchTrack();
    },

    switchTrack() {
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.audio.src = this.currentTrack.source;
      this.audio.currentTime = 0;

      localStorage.setItem("currentTrackIndex", this.currentTrackIndex);
      localStorage.setItem("currentTime", 0);

      if (this.isTimerPlaying) {
        this.audio.play();
      }
    },

    favorite() {
      this.tracks[this.currentTrackIndex].favorited =
        !this.tracks[this.currentTrackIndex].favorited;
    }
  },

  created() {
    let vm = this;

    // RESTORE SAVED STATE
    const savedIndex = localStorage.getItem("currentTrackIndex");
    const savedTime = localStorage.getItem("currentTime");
    const savedPlaying = localStorage.getItem("isTimerPlaying") === "true";

    this.currentTrackIndex = savedIndex !== null ? Number(savedIndex) : 0;
    this.currentTrack = this.tracks[this.currentTrackIndex];

    this.audio = new Audio(this.currentTrack.source);

    this.audio.onloadedmetadata = function () {
      if (savedTime) {
        vm.audio.currentTime = Number(savedTime);
      }
      vm.generateTime();

      if (savedPlaying) {
        vm.audio.play();
        vm.isTimerPlaying = true;
      }
    };

    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };

    this.audio.onended = function () {
      vm.nextTrack();
      vm.isTimerPlaying = true;
    };

    // PRELOAD COVERS
    this.tracks.forEach(track => {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = track.cover;
      link.as = "image";
      document.head.appendChild(link);
    });
  }
});


// Dark mode
let darkmode = localStorage.getItem('darkmode')
const themeSwitch = document.getElementById('theme-switch')

const enableDarkmode = () => {
  document.body.classList.add('darkmode')
  localStorage.setItem('darkmode', 'active')
}

const disableDarkmode = () => {
  document.body.classList.remove('darkmode')
  localStorage.setItem('darkmode', null)
}

if(darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
  darkmode = localStorage.getItem('darkmode')
  darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})
