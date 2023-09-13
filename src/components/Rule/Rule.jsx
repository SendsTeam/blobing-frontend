import './Rule.css'
import ReturnBtn from '../ReturnBtn/ReturnBtn.jsx'

export default {
  props: {
    className: {
      type: String,
      default: ''
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
            'absolute w-full text-center text-white underline text-xl flex justify-center ' +
            this.className
          }
        >
          <div onClick={this.openRule} className="cursor-pointer">
            了解规则
          </div>
        </div>
        <div
          v-show={this.showRule}
          className="wrapper top-0 bottom-0 left-0 right-0 absolute flex justify-center items-center backdrop-blur-sm"
        >
          <div className="scroll relative pointer-events-none">
            <div className="absolute w-1/2 h-full left-0 -z-0"></div>
            <div className="absolute w-1/2 h-full right-0 -z-0"></div>
            <img className="z-10 relative" src="/img/scroll.png" alt="scroll" />
          </div>
        </div>
        <ReturnBtn
          v-show={this.showRule}
          className="top-5 left-5 z-40"
          onReturn={this.closeRule}
        ></ReturnBtn>
      </div>
    )
  }
}
