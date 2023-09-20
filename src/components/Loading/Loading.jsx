import './Loading.css'
import { Transition, TransitionGroup } from 'vue'
import { showNotify } from 'vant'

export default {
  data() {
    return {
      isLoading: true,
      loadingMsg: '加载中......'
    }
  },
  methods: {
    setMsg(msg) {
      this.loadingMsg = msg
    },
    finish() {
      this.isLoading = false
      // this.setMsg('加载中......')
    },
    begin() {
      this.setMsg('加载中......')
      this.isLoading = true
    }
  },
  mounted() {
    showNotify({ type: 'success', message: '首次加载较久，请耐心等待！' })
  },
  render() {
    return (
      <Transition mode="out-in" name="fade">
        <div v-show={this.isLoading} className="absolute w-full h-full backdrop-blur-md z-50">
          <div className="loader"></div>
          <TransitionGroup name="list">
            <div
              key={this.loadingMsg}
              className="relative w-full text-center top-[50%] mt-5  text-lg font-bold text-white"
            >
              {this.loadingMsg}
            </div>
          </TransitionGroup>
        </div>
      </Transition>
    )
  }
}
