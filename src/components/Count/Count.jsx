import './Count.css'
import { Transition } from 'vue'
import request from '../../utils/request.js'
import { showNotify } from 'vant'

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
      transitionName: 'slide-up'
    }
  },
  methods: {
    async updateCount() {
      const result = await request.getCount()
      if (result === 0) {
        this.transitionName = 'slide-down'
        this.count = result
        showNotify({ type: 'warning', message: '今日次数已用完，投掷将不再记录' })
      } else if (result !== null) {
        if (result > this.count) {
          this.transitionName = 'slide-up'
          this.count = result
        } else if (result < this.count) {
          this.transitionName = 'slide-down'
          this.count = result
        }
      }
    }
  },
  async mounted() {
    await request.init()
    this.updateCount()
    setInterval(() => {
      this.updateCount()
    }, 500)
  },
  render() {
    return (
      <div className={'absolute text-xl ' + this.className}>
        <span>
          <img className="inline-block" src="/icon/dice.svg" alt="dice" />
        </span>
        <Transition name={this.transitionName}>
          <div className=" relative inline-block h-[18px]" key={this.count}>
            <span className=" absolute whitespace-nowrap">{this.count}</span>
          </div>
        </Transition>
      </div>
    )
  }
}
