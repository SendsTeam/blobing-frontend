import './Result.css'

export default {
  props: {
    resultText: {
      type: String,
      default: '中秋博饼'
    },
    className: {
      type: String,
      default: ''
    },
    loadFinish: {
      type: Boolean,
      default: false
    }
  },
  render() {
    return (
      <div
        className={
          (this.loadFinish ? 'result-zoom-in-ani ' : '') +
          'result absolute w-full text-center font-normal text-7xl md:text-8xl ' +
          this.className
        }
      >
        <span className=''>{this.resultText}</span>
      </div>
    )
  }
}
