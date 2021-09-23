/** Các chức năng cần thực hiện:
 *  Render songs -> Oke
 *  Scroll top -> Oke
 *  Play / Pause / Seek -> Oke 
 *  CD rotate -> Oke 
 *  Next / Prev -> Oke
 *  Random -> Oke
 *  Next / Repeat when ended -> Oke 
 *  Active song -> Oke
 *  Scroll active song into view -> Oke
 *  Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOREAGE_KEY = 'Music-Player';

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STOREAGE_KEY)) || {},
    songs: [{
            name: "Bông hoa đẹp nhất",
            singer: "Quân AP",
            path: "./assets/music/BongHoaDepNhat-QuanAP-6607955.mp3",
            image: "./assets/image/BHDN.jpg",
        },
        {
            name: "3102-2",
            singer: "Dương x Nâu x W/N",
            path: "./assets/music/31072-DuonggNauWn-6937818.mp3",
            image: "./assets/image/3107.jpg",
        },
        {
            name: "Chúng ta sau này",
            singer: "T.R.I",
            path: "./assets/music/ChungTaSauNay-TRI-6929586.mp3",
            image: "./assets/image/CTSN.jpg",
        },
        {
            name: "Cưới đi",
            singer: "ChangC",
            path: "./assets/music/CuoiDi-2TChangC-6560962.mp3",
            image: "./assets/image/Cuoi-di.jpg",
        },
        {
            name: "Độ tộc 2",
            singer: "Độ Mixi",
            path: "./assets/music/DoToc2-MasewDoMixiPhucDuPhao-7064730.mp3",
            image: "./assets/image/Do-Toc2.jpg",
        },
        {
            name: "Gác lại âu lo",
            singer: "Dalab ft. Miu Lê",
            path: "./assets/music/GacLaiAuLo-DaLABMiuLe-6360815.mp3",
            image: "./assets/image/GLAL.jpg",
        },
        {
            name: "Nàng thơ",
            singer: "Hoàng Dũng",
            path: "./assets/music/NangTho-HoangDung-6413381.mp3",
            image: "./assets/image/Nang-tho.jpg",
        },
        {
            name: "Phải chăng em đã yêu",
            singer: "Juky San Ft.Redt",
            path: "./assets/music/PhaiChangEmDaYeu-JukySanRedT-6940932.mp3",
            image: "./assets/image/PCEDY.jpg",
        },
        {
            name: "Sài gòn đau lòng quá",
            singer: "Kim Tuyên & Hoàng Duyên",
            path: "./assets/music/SaiGonDauLongQua-HuaKimTuyenHoangDuyen-6992977.mp3",
            image: "./assets/image/SGDLQ.jpg",
        },
        {
            name: "Trên tình bạn, Dưới tình yêu",
            singer: "Min",
            path: "./assets/music/TrenTinhBanDuoiTinhYeu-MIN-6802163.mp3",
            image: "./assets/image/TTB-DTY.jpg",
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOREAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class = "song ${index === this.currentIndex ? 'active' : ''}" data-index = ${index}>
                    <div class="thumb" style = "background-image: url('${song.image}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xu ly phong to thu nho CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth / cdWidth;
        }

        // Xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Khi bai hat duoc chay
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        // Khi bai hat bi dung lai
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // Khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // Xu ly khi tua bai hat
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
            progress.onmouseup = function() {
                audio.currentTime = seekTime;
            }
        }

        // Next song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollIntoView();
        }

        // Prev song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollIntoView();
        }

        // Random song bat / tat
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
            repeatBtn.classList.remove('active');
        }

        // Xu ly next song khi ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xu ly repeat song 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
            randomBtn.classList.remove('active');
        }

        // Lang nghe hanh vi click vao playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xu ly khi click vao bai hat
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xu ly khi click vao option icon
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollIntoView: function() {
        setTimeout(() => {
            if (this.currentIndex >= 3) {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            } else {
                $('.song.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 200)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gan cau hinh tu config vao
        this.loadConfig();

        // Dinh nghia cac property cho object
        this.defineProperties();

        // Lang nghe va xu ly cac su kien
        this.handleEvents();

        // Tai thong tin bai hat dau tien vao UI khi chay
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hien thi trang thai ban dau cua btn repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }
};

app.start();