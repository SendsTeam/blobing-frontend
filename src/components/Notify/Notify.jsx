import './Notify.css'
import { NoticeBar } from 'vant'
import 'vant/es/notice-bar/style'

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
      message: ['1', '2']
    }
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
