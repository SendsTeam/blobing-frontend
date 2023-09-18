import './Notify.css'
import { NoticeBar } from 'vant'
import 'vant/es/notice-bar/style'
import request from '../../utils/request.js'
import { getToken } from '../../utils/tokenAndWxlogin.js'

export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    loadFinish: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      message: [],
      wsInstance: null,
      connectFlag: false
    }
  },
  watch: {
    connectFlag(value) {
      if (!value) {
        this.ws()
      }
    }
  },
  methods: {
    sendMsg(ciphertext, name, type) {
      const param = {
        ciphertext,
        message: JSON.stringify({
          name,
          type
        }),
        token: getToken()
      }
      console.log(param)
      this.wsInstance.send(param)
    },
    ws() {
      this.wsInstance = null
      this.connectFlag = false
      this.wsInstance = request.broadcast()
      // console.log(this.wsInstance)
      this.wsInstance.onopen = () => {
        this.connectFlag = true
        console.log('ws connect')
      }
      this.wsInstance.onclose = () => {
        this.connectFlag = false
        console.log('ws disconnect')
        this.wsInstance = null
      }
      this.wsInstance.onerror = (error) => {
        this.wsInstance.close()
        console.log('ws error', error)
        this.wsInstance = null
        this.connectFlag = false
      }
      this.wsInstance.onmessage = (msg) => {
        this.message.push(msg)
        console.log(msg)
      }
    }
  },
  mounted() {
    this.ws()
  },
  render() {
    return (
      <div
        className={
          (this.loadFinish ? 'bgm-fade-in-ani ' : '') +
          'notify absolute w-full max-w-md h-[40px] md:rounded-full text-center flex justify-center items-center opacity-0 overflow-hidden ' +
          this.className
        }
      >
        <NoticeBar className="w-full h-full" scrollable>
          <div className="normal-para font-semibold md:font-medium">
            恭喜幸运用户 <span className="user">燕博远</span> 运气大爆发 掷出{' '}
            <span className="level">状元插金花</span> !
          </div>
        </NoticeBar>
      </div>
    )
  }
}
