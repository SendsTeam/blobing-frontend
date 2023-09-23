import './Count.css'
import { Transition } from 'vue'
import request from '../../utils/request.js'
import { showDialog } from 'vant'
import ReturnBtn from '../ReturnBtn/ReturnBtn.jsx'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      count: 0,
      transitionName: 'slide-up',
      showLog: false,
      log: {}
    }
  },
  methods: {
    async updateCount() {
      const result = await request.getCount()
      if (result === 0) {
        this.transitionName = 'slide-down'
        this.count = result
        showDialog({
          message: '今日次数已用完，投掷将不再记录。点击左上角骰子图标查看 [ 我的战绩 ], 点击右上角 [ 转发分享 ]获得额外投掷次数！',
          theme: 'round-button'
        })
      } else if (result !== null) {
        if (result > this.count) {
          this.transitionName = 'slide-up'
          this.count = result
        } else if (result < this.count) {
          this.transitionName = 'slide-down'
          this.count = result
        }
      }
    },
    async justUpdateCount() {
      const result = await request.getCount()
      if (result === 0) {
        this.transitionName = 'slide-down'
        this.count = result
        // showNotify({ type: 'warning', message: '今日次数已用完，投掷将不再记录' })
      } else if (result !== null) {
        if (result > this.count) {
          this.transitionName = 'slide-up'
          this.count = result
        } else if (result < this.count) {
          this.transitionName = 'slide-down'
          this.count = result
        }
      }
    },
    clickHandle() {
      this.showLog = true
      this.updateRecord()
    },
    closeLog() {
      this.showLog = false
    },
    async updateRecord() {
      const result = await request.record()
      if (result.maps) {
        // 将对象转换为数组，并按值进行降序排序
        const sortedArray = Object.entries(result.maps).sort((a, b) => b[1] - a[1])
        // 将排序后的数组转换回对象
        const sortedObject = Object.fromEntries(sortedArray)
        this.log = sortedObject
      }
      console.log(this.log)
    }
  },
  async mounted() {
    await request.init()
    this.updateCount()
    setInterval(() => {
      this.justUpdateCount()
    }, 500)
    // console.log(await request.record())
    this.updateCount()
  },
  render() {
    return (
      <div>
        <div className={'absolute text-xl ' + this.className}>
          <button onClick={this.clickHandle}>
            <img className="inline-block" src="/icon/dice.svg" alt="dice" />
          </button>
          <Transition name={this.transitionName}>
            <div className=" relative inline-block h-[18px]" key={this.count}>
              <span className=" absolute whitespace-nowrap">{this.count}</span>
            </div>
          </Transition>
        </div>
        <Transition name="fade">
          <div
            v-show={this.showLog}
            className="wrapper rank-container top-0 bottom-0 left-0 right-0 absolute backdrop-blur-md z-20"
          >
            <div>
              <div className="rank-title w-full text-center mt-24 md:mt-28 text-6xl md:text-7xl mb-4">
                <div className="inline-block mx-4">我的战绩</div>
              </div>
              <div className="rank-item-container w-full absolute top-44 md:top-52 max-w-md bottom-24 px-16">
                {Object.keys(this.log).map((key) => {
                  const number = this.log[key]
                  return (
                    <div className="w-full h-[52px] rank-item mb-2 rounded-[18px]">
                      <div className="w-1/2 h-full text-center rank-points inline-block">{key}</div>
                      <div className="w-1/2 h-full text-center rank-name  inline-block">
                        {number} 次
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Transition>
        <ReturnBtn
          v-show={this.showLog}
          className="rule-zoom-in-ani top-5 left-5 z-40"
          onReturn={this.closeLog}
        ></ReturnBtn>
      </div>
    )
  }
}
