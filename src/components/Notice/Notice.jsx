import { Dialog, showImagePreview } from 'vant'
import 'vant/es/image-preview/style'
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
        this.$parent.$refs.fireworks.reset()
        this.$parent.$refs.fireworks.play()
      }
    }
  },
  methods: {
    showRank() {
      showImagePreview(['/img/final_rank.jpg'])
    },
    showQQqrcode() {
      showImagePreview(['/img/QQqrcode.jpg'])
    }
  },
  render() {
    return (
      <div>
        <Dialog theme="round-button" v-model:show={this.showFlag} close-on-click-overlay>
          <div className=" text-3xl text-red-600 w-full h-8 mt-4 mb-2 text-center">总榜结算通知</div>
          <div className="w-full text-center p-2">
            截至<span className="text-red-600">10月6日12:00</span> <br />
            线上博饼总积分榜最终结果和活动群二维码如下，
            <span className="text-red-600">请点开查看</span>。
            <br />
            有请榜上人员赶紧加群！
          </div>

          <div className=" aspect-[17/5] w-full p-2 overflow-scroll rounded-2xl">
            <img src="/img/final_rank.jpg" alt="qrcode" onClick={this.showRank} />
          </div>
          <div className="w-full text-center text-red-600">排行榜</div>

          <div className=" aspect-[3/1] w-full p-2 overflow-scroll rounded-2xl">
            <img src="/img/QQqrcode.jpg" alt="qrcode" onClick={this.showQQqrcode} />
          </div>
          <div className="w-full text-center text-red-600">活动群</div>
        </Dialog>
      </div>
    )
  }
}
