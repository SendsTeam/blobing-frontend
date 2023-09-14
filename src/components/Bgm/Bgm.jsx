import './Bgm.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    loadFinish: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isPlaying: false
    }
  },
  methods: {
    play() {
      this.$refs.bgmController.play()
    },
    pause() {
      this.$refs.bgmController.pause()
    },
    clickHandle() {
      if (!this.$refs.bgmController.paused) {
        this.pause()
      } else {
        this.play()
      }
      this.isPlaying = !this.$refs.bgmController.paused
    }
  },
  mounted() {
    this.$refs.bgmController.volume = 0.1
    this.isPlaying = !this.$refs.bgmController.paused
  },
  render() {
    return (
      <button
        onClick={this.clickHandle}
        className={
          (this.loadFinish ? 'rule-zoom-in-ani ' : 'scale-0 ') + 'inline-block absolute ' + this.className
        }
      >
        <img src={this.isPlaying ? '/icon/music.svg' : '/icon/music_off.svg'} alt="icon" />
        <audio loop autoplay ref="bgmController">
          <source src="/sounds/bgm.mp3" type="audio/mpeg"></source>
        </audio>
      </button>
    )
  }
}
