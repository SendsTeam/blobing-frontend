import lottie from 'lottie-web'
import './Fireworks.css'
export default {
  data() {
    return {
      lottieInstance: null
    }
  },
  methods: {
    play() {
      this.lottieInstance.play()
    },
    reset() {
      this.lottieInstance.stop()
      this.lottieInstance.goToAndStop(0)
    }
  },
  mounted() {
    this.lottieInstance = lottie.loadAnimation({
      container: this.$refs.lottieRef,
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: '/lottie/fireworks.json'
    })
  },
  beforeUnmount() {
    if (!this.lottieInstance) return
    this.lottieInstance.destroy()
    this.lottieInstance = null
  },
  render() {
    return (
      <div className="fireworks fixed bottom-0 top-0 left-0 right-0 flex z-50 justify-center items-center pointer-events-none">
        <div ref="lottieRef"></div>
      </div>
    )
  }
}
