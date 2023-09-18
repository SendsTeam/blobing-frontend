import './Notify.css'
import { Barrage } from 'vant'
import 'vant/es/barrage/style'
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
      messageQueue: [],
      wsInstance: null,
      connectFlag: false,
      id: 0
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
    sendMsg(ciphertext, type) {
      const param = {
        ciphertext,
        message: type,
        token: getToken()
      }
      this.wsInstance.send(JSON.stringify(param))
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
      this.wsInstance.onclose = (ev) => {
        this.connectFlag = false
        console.log('ws disconnect: ', ev)
        this.wsInstance = null
      }
      this.wsInstance.onerror = (error) => {
        this.wsInstance.close()
        console.log('ws error', error)
        this.wsInstance = null
        this.connectFlag = false
      }
      this.wsInstance.onmessage = (msg) => {
        this.messageQueue.push({ id: this.id, text: msg.data })
        this.id++
        console.log(msg.data)
        // alert(msg.data)
      }
    }
  },
  mounted() {
    this.ws()
    setInterval(() => {
      if (!this.connectFlag) {
        this.ws()
      }
    }, 2000)
  },
  render() {
    return (
      <div
        className={
          (this.loadFinish ? 'bgm-fade-in-ani ' : '') +
          'notify absolute w-full h-[150px] text-center flex justify-center items-center opacity-0 overflow-hidden ' +
          this.className
        }
      >
        <Barrage className="notify-text" v-model={this.messageQueue} rows={4} duration={8000}>
          <div className=" w-screen h-[150px]"></div>
        </Barrage>
      </div>
    )
  }
}
