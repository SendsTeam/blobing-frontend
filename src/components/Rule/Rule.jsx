import './Rule.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    openRule() {
      console.log(6)
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
        {/* <div className="container w-full h-full absolute "></div> */}
      </div>
    )
  }
}
