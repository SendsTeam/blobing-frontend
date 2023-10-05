import { Dialog } from 'vant'
import './Notice.css'

export default {
  props: {
    loadFinish: {
      type: Boolean,
      required: true,
      default: false
    },
    able: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showFlag: false
    }
  },
  watch: {
    loadFinish(n, o) {
      if (n && !o) {
        this.showFlag = true
      }
    }
  },
  render() {
    return (
      <div>
        <Dialog theme="round-button" v-model:show={this.showFlag} close-on-click-overlay>
          <div className="relay-title w-full h-8 mt-4 mb-2 text-center text-xl">
            活动公告
          </div>
          <div className="w-full text-center p-2">
            各位博友们好，线上博饼总积分榜将于 10月6日 12：00 结算，届时将在此公布30位线下博饼名额和参与通道，敬请期待！
          </div>
          {/* <div className=" aspect-square w-full p-2">
            <img src="/img/qrcode.png" className=" rounded-2xl" alt="qrcode" />
          </div> */}
        </Dialog>
      </div>
    )
  }
}
