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
          'absolute w-full text-center text-white underline cursor-pointer text-xl ' +
          this.className
        }
      >
        了解规则
      </div>
    )
  }
}
