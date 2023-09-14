import './PlayBtn.css'

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
  methods: {
    clickHandle() {
      this.$emit('btnClick')
    }
  },
  render() {
    return (
      <div
        className={
          (this.loadFinish ? 'bgm-fade-in-ani ' : '') +
          'absolute w-full flex justify-center playBtnContainer ' +
          this.className
        }
      >
        <button className="playBtn rounded-[30px] bg-black relative" onClick={this.clickHandle}>
          <div className="mountain w-full h-full flex flex-col justify-center rounded-[30px]">
            <div>博一把</div>
          </div>
          <div className="rabbit rabbit-shake-ani"></div>
        </button>
      </div>
    )
  }
}
