import { getWechatCode, isLogin, wxRedirect } from '../../utils/tokenAndWxlogin.js'
import request from '../../utils/request.js'
import { showNotify, closeNotify } from 'vant'

export default {
  async mounted() {
    showNotify({ message: '跳转中......', type: 'success' })
    if (!isLogin()) {
      const wechatCode = getWechatCode()
      if (wechatCode) {
        console.log(wechatCode)
        if (await request.login(wechatCode)) {
          this.$router.push('/game')
        }
      } else {
        wxRedirect()
      }
    } else {
      this.$router.push('/game')
    }
  },
  beforeUnmount() {
    closeNotify()
  },
  render() {
    return <div></div>
  }
}
