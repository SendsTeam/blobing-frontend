import { showDialog } from 'vant'
import 'vant/es/dialog/style'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  methods: {
    clickHandle() {
      showDialog({
        title: '快喊上小伙伴一起玩耍吧~',
        message: '点击右上角分享到朋友圈、QQ空间或分享给微信、QQ好友, 投掷次数将 +1 (每日限3次)',
        theme: 'round-button'
      })
    }
  },
  mounted() {},
  render() {
    return (
      <div className={'absolute text-xl ' + this.className}>
        <button onClick={this.clickHandle}>
          <img className="inline-block" src="https://cdn.sends.cc/blobing/icon/relay.svg" alt="relay" />
        </button>
      </div>
    )
  }
}
