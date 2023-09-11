import './Rank.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  render() {
    return (
      <div
        className={
          'rank inline-block absolute w-full text-center text-2xl md:text-3xl ' + this.className
        }
      >
        排行榜
      </div>
    )
  }
}
