import './Rule.css'
import ReturnBtn from '../ReturnBtn/ReturnBtn.jsx'
import { Transition } from 'vue'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    loadFinish: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      showRule: false
    }
  },
  methods: {
    openRule() {
      this.showRule = true
    },
    closeRule() {
      this.showRule = false
    }
  },
  render() {
    return (
      <div>
        <div
          className={
            (this.loadFinish ? 'bgm-fade-in-ani ' : '') +
            'absolute opacity-0 w-full text-center text-white underline text-xl flex justify-center ' +
            this.className
          }
        >
          <div onClick={this.openRule} className="cursor-pointer">
            了解规则
          </div>
        </div>

        <Transition name="fade">
          <div
            v-show={this.showRule}
            className="wrapper top-0 bottom-0 left-0 right-0 absolute flex justify-center items-center backdrop-blur-sm"
          >
            <div className="scroll relative  pointer-events-none">
              <img className="z-10 rule-zoom-in-ani relative" src="/img/scroll.png" alt="scroll" />
            </div>
          </div>
        </Transition>

        <ReturnBtn
          v-show={this.showRule}
          className="rule-zoom-in-ani top-5 left-5 z-40"
          onReturn={this.closeRule}
        ></ReturnBtn>
      </div>
    )
  }
}
