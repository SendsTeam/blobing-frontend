import './Wechat.css'
import { Barrage } from 'vant'

export default {
  data() {
    return {
      counter: 0,
      fakeMessage: [],
      fakeMessagePool: [
        '好好好, 真好玩捏！🥹',
        '怎么还不打开微信扫一扫？👋',
        '哇塞，我在桑梓博饼小程序博到了MATE60 PRO，遥遥领先！🤣',
        '帅气学长在线女装',
        '性感荷官，在线博饼',
        '状元插金花!!!',
        '中秋快乐！！！',
        '桑梓yyds',
        '欢迎报考华侨大学信息安全专业！',
        '后端BUG终于修完了',
        '好好好，博饼小游戏终于上线了！'
      ],
      timer: null
    }
  },
  methods: {
    randomPushFakeMessage() {
      const randomIndex = Math.floor(Math.random() * this.fakeMessagePool.length)
      return this.fakeMessagePool[randomIndex]
    }
  },
  mounted() {
    this.timer = setInterval(() => {
      this.fakeMessage.push({ id: this.counter++, text: this.randomPushFakeMessage() })
    }, 100)
  },
  beforeUnmount() {
    clearInterval(this.timer)
  },
  render() {
    return (
      <div>
        <div className="absolute w-screen h-screen z-50">
          <Barrage className="notify-text" v-model={this.fakeMessage} rows={25} duration={8000}>
            <div className="absolute w-screen h-screen"></div>
          </Barrage>
        </div>
        <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center z-[999]">
          <div className="text-center max-w-md  rounded-[36px] overflow-hidden m-4 shadow-lg">
            <img src="/img/qrcode.png" alt="qrcode" />
            {/* <div className="wechat-tips text-3xl">~微信扫码，快来玩耍～</div> */}
          </div>
        </div>
      </div>
    )
  }
}
