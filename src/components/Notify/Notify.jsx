import './Notify.css'

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
          'notify absolute w-full max-w-md h-[40px] md:rounded-xl text-center flex justify-center items-center ' +
          this.className
        }
      >
        <div className="normal-para">
          幸运用户 <span className="user">燕博远</span> 掷出{' '}
          <span className="level">状元插金花</span> !
        </div>
      </div>
    )
  }
}
