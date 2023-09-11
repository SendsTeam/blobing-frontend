export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  render() {
    return (
      <div className={'absolute w-full text-center text-white  text-xs ' + this.className}>
        -华侨大学网络创新实验室制作-
      </div>
    )
  }
}
