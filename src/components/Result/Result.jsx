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
    }
  },
  render() {
    return (
      <div
        className={
          'result absolute w-full text-center font-normal text-7xl md:text-8xl ' + this.className
        }
      >
        {this.resultText}
      </div>
    )
  }
}
