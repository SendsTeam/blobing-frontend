import './Binding.css'
import { bindRedirect } from '../../utils/tokenAndWxlogin.js'

export default {
  render() {
    return (
      <div className="wechat-tips fixed w-full h-full flex flex-col justify-center items-center text-4xl">
        <div className="mb-8">
          您还未绑定身份
          <br />
          请点击下面绑定
        </div>
        <button className="bindingBtn" onClick={bindRedirect}>
          去绑定
        </button>
      </div>
    )
  }
}
