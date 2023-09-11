import './PlayBtn.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickHandle() {
      this.$emit('btnClick')
    }
  },
  render() {
    return (
      <div className={'absolute w-full flex justify-center ' + this.className}>
        <button className="playBtn rounded-[30px] bg-black relative" onClick={this.clickHandle}>
          <div className="mountain w-full h-full flex flex-col justify-center rounded-[30px]">
            <div>博一把</div>
          </div>
          <div className="rabbit"></div>
        </button>
      </div>
    )
  }
}
