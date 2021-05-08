/*
    1.Render Song
    2.Scroll Top
    3.Play / Pause / Seek
    4.CD rotate
    5.Next / Prev
    6.Random
*/
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const btnRandom = $('.btn-random')

const app = {

    currentIndex: 0,
    isPlaying: false,
    songs : [
        {
          name: "Đừng Hẹn Kiếp Sau",
          singer: "Đình Dũng, ACV",
          path: "/asset/src/DanhMatEm.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2021/04/27/f/2/1/d/1619515696259_500.jpg"
        },
        {
          name: "Đừng Đùa Với Lửa",
          singer: "Lena",
          path: "/asset/src/DungDuaVoiLua.mp3",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2021/05/01/c/e/c/3/1619848955202_500.jpg"
        },
        {
          name: "Một Đời Là Quá Dài",
          singer: "Tường Vi",
          path: "/asset/src/MotDoiLaQuaDai.mp3",
          image: "https://stc-id.nixcdn.com/v11/html5/nct-player-mp3/images/default_inner_player_80.png"
        },
        {
          name: "Đánh Mất Em",
          singer: "Quang Đăng Trần",
          path: "/asset/src/DanhMatEm.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Đừng Hẹn Kiếp Sau",
          singer: "Đình Dũng, ACV",
          path: "/asset/src/DanhMatEm.mp3",
          image: "https://avatar-ex-swe.nixcdn.com/song/2021/04/27/f/2/1/d/1619515696259_500.jpg"
        },
        {
          name: "Đừng Đùa Với Lửa",
          singer: "Lena",
          path: "/asset/src/DungDuaVoiLua.mp3",
          image:
            "https://avatar-ex-swe.nixcdn.com/song/2021/05/01/c/e/c/3/1619848955202_500.jpg"
        },
        {
          name: "Một Đời Là Quá Dài",
          singer: "Tường Vi",
          path: "/asset/src/MotDoiLaQuaDai.mp3",
          image: "https://stc-id.nixcdn.com/v11/html5/nct-player-mp3/images/default_inner_player_80.png"
        },
        {
          name: "Đánh Mất Em",
          singer: "Quang Đăng Trần",
          path: "/asset/src/DanhMatEm.mp3",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        }
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('');
    },
    defineProperties: function () {
        Object.defineProperty(this,'currentSong', {
          get: function() {
            return this.songs[this.currentIndex]
          }
        })
    },
    handleEvents: function() {
      const cdWidth  = cd.offsetWidth
      const _this = this
      //const isRandom = false

      //Xử lý CD quay / dừng
      const cdThumbAnimate =  cdThumb.animate([
          { transform: 'rotate(360deg)'}
      ],{
          duration: 10000, // 10 seconds
          interations: Infinity
      })
      cdThumbAnimate.pause();
      //Xử lý phóng to / thu nhỏ CD
      document.onscroll = function () {
        const scrollTop =  window.scrollY || document.documentElement.scrollTop
        const newCdWidth = cdWidth - scrollTop
        
        cd.style.width = newCdWidth > 0  ?  newCdWidth + 'px' : 0
        cd.style.opacity  = newCdWidth/ cdWidth
      }

      //Xử lý khi click play
      playBtn.onclick = function() {
        if(_this.isPlaying){
          audio.pause();
        }
        else {
          audio.play();
        }
       
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play();
        }

        // Khi song bị pause
         audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause();
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
        } 

        // Xử lý khi tua
        progress.onchange = function(e) {
            const seekTime = audio.duration * e.target.value / 100
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        btnNext.onclick = function() {
          if(_this.isRandom) {
            _this.ranDomSong();
          } else {
            _this.nextSong();
          }
          audio.play()
        }

         // Khi prev bài hát
         btnPrev.onclick = function() {
          if(_this.isRandom) {
            _this.ranDomSong();
          } else {
            _this.prevSong();
          }
          audio.play()
        }

        //Bật tắt random
        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active',  _this.isRandom)
        }

        //Xử lý next khi audio ended
        audio.onended = function() {
          btnNext.click()
        }
        
      }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },

    prevSong: function () {
      this.currentIndex--
      if(this.currentIndex < 0){
        this.currentIndex = this.songs.length - 1
      }
      this.loadCurrentSong()
    },

    ranDomSong: function() {
      let newIndex
      do {
            newIndex = Math.floor(Math.random() * this.songs.length)
      } while(newIndex === this.currentIndex)
      console.log(newIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },

  

    start: function() {
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()

        
        //Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên ra UI
        this.loadCurrentSong()

        //Render playlist
        this.render()
    } 

}
app.start()



