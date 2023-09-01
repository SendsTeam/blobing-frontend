import './Loading.css'
import { Transition, TransitionGroup } from 'vue'

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
  render() {
    return (
      <>
        <Transition mode="out-in" name="fade">
          <div v-show={this.isLoading} className="fixed w-full h-full backdrop-blur-md">
            <div className="loader"></div>
            <TransitionGroup name="list">
              <div
                key={this.loadingMsg}
                className="relative w-full text-center top-[50%] mt-5 select-none text-lg font-bold text-white"
              >
                {this.loadingMsg}
              </div>
            </TransitionGroup>
          </div>
        </Transition>
      </>
    )
  }
}
