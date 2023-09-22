import { Dialog } from 'vant'
import './Relay.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  methods: {
    clickHandle() {
      this.showFlag = true
    }
  },
  mounted() {},
  render() {
    return (
      <div className={'absolute text-xl ' + this.className}>
        <button onClick={this.clickHandle}>
          <img className="inline-block" src="/icon/relay.svg" alt="relay" />
        </button>
        <Dialog theme="round-button" v-model:show={this.showFlag} close-on-click-overlay>
          <div className="relay-title w-full h-8 mt-4 mb-2 text-center text-xl">
            快喊上小伙伴一起玩耍吧~
          </div>
          <div className="w-full text-center p-2">
            点击右上角或长按图片分享到朋友圈、QQ空间或分享给微信、QQ好友, 投掷次数+1 <br />
            (每日限3次)
          </div>
          <div className=" aspect-square w-full p-2">
            <img src="/img/qrcode.png" className=' rounded-2xl' alt="qrcode" />
          </div>
        </Dialog>
      </div>
    )
  }
}
