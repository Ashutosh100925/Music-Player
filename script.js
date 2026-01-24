new Vue({
  el: "#app",
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
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
        },
        {
          name: "Baatein ye kabhi na",
          artist: "Arijit Singh",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Khamoshiyan.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Baatein%20Ye%20Kabhi%20Na(KoshalWorld.Com).mp3",
          url: "https://youtu.be/SOessajf_Ik?si=jxAtx4xl7Xizvb0t",
          favorited: false
        },
        {
          name: "Tum Hi Ho",
          artist: "Arijit Singh",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Tum%20hi%20ho.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Tum%20Hi%20Ho(KoshalWorld.Com).mp3",
          url: "https://youtu.be/NUo8CKI34o4?si=a2IspfnC1mB09zmO",
          favorited: false
        },
        {
          name: "Rabba",
          artist: "Mohit Chauhan",
          cover: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/images/Rabba.jpg",
          source: "https://raw.githubusercontent.com/Ashutosh100925/Music-Player/main/mp3%20files/Rabba%20Heropanti%20320%20Kbps.mp3",
          url: "https://youtu.be/o4mHtJLgMLs?si=BL0JHfVb7ggT3hHN",
          favorited: false
        },
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
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "scale-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.resetPlayer();
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    favorite() {
      this.tracks[this.currentTrackIndex].favorited = !this.tracks[
        this.currentTrackIndex
      ].favorited;
    }
  },
  created() {
    let vm = this;
    this.currentTrack = this.tracks[0];
    this.audio = new Audio();
    this.audio.src = this.currentTrack.source;
    this.audio.ontimeupdate = function () {
      vm.generateTime();
    };
    this.audio.onloadedmetadata = function () {
      vm.generateTime();
    };
    this.audio.onended = function () {
      vm.nextTrack();
      this.isTimerPlaying = true;
    };

    // // this is optional (for preload covers)
    for (let index = 0; index < this.tracks.length; index++) {
      const element = this.tracks[index];
      let link = document.createElement('link');
      link.rel = "prefetch";
      link.href = element.cover;
      link.as = "image"
      document.head.appendChild(link)
    }
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
