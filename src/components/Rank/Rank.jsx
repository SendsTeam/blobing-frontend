import './Rank.css'
import ReturnBtn from '../ReturnBtn/ReturnBtn.jsx'
import RankItem from '../RankItem/RankItem.jsx'
import { Transition, TransitionGroup } from 'vue'
import request from '../../utils/request.js'
import { showToast } from 'vant'
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

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
      showRank: false,
      rankOption: ['积分日榜', '积分总榜', '天选之榜'],
      rankIndex: 0,
      rankData: [
        { all: [], me: [] },
        { all: [], me: [] },
        { all: [], me: [] }
      ]
    }
  },
  methods: {
    openRank() {
      this.showRank = true
      this.rankIndex = 0
      this.updateAll()
      showToast({
        message: '注意：日榜以及骰子次数将在每日早晨8点刷新!',
        // position: 'bottom',
        duration: 5000
      })
    },
    closeRank() {
      this.showRank = false
    },
    leftClick() {
      if (this.rankIndex == 0) {
        this.rankIndex = this.rankOption.length - 1
      } else {
        this.rankIndex--
      }
    },
    rightClick() {
      if (this.rankIndex == this.rankOption.length - 1) {
        this.rankIndex = 0
      } else {
        this.rankIndex++
      }
    },
    async updateDayRank() {
      const result = await request.dayRank()
      if (result && result.boBingRank && result.BingMyRank) {
        this.rankData[0].all = result.boBingRank
        this.rankData[0].me = result.BingMyRank
        this.rankData[0].all.forEach((element, index) => {
          element.id = 'day' + index
          element.index = index
        })
      }
    },
    async updateTop() {
      const result = await request.top()
      if (result && result.boBingRank && result.BingMyRank) {
        this.rankData[1].all = result.boBingRank
        this.rankData[1].me = result.BingMyRank
        this.rankData[1].all.forEach((element, index) => {
          element.id = 'all' + index
          element.index = index
        })
      }
    },
    async updateTianXuan() {
      const result = await request.tianXuan()
      if (result && result.boBingTianXuan) {
        this.rankData[2].all = result.boBingTianXuan
        this.rankData[2].all.forEach((element, index) => {
          element.id = 'tx' + index
          element.index = index
        })
      }
    },
    async updateAll() {
      this.updateDayRank()
      this.updateTianXuan()
      this.updateTop()
    }
  },
  mounted() {
    this.updateAll()
    // setInterval(() => {
    //   if (this.showRank) {
    //     this.updateAll()
    //   }
    // }, 1000)
  },
  render() {
    return (
      <div>
        <div
          className={
            (this.loadFinish ? 'bgm-fade-in-ani ' : '') +
            'rank opacity-0 inline-block absolute w-full text-center text-2xl md:text-3xl ' +
            this.className
          }
        >
          <button className="rank-btn" onClick={this.openRank}>
            排行榜
          </button>
        </div>
        <Transition name="fade">
          <div
            v-show={this.showRank}
            className="wrapper rank-container top-0 bottom-0 left-0 right-0 absolute backdrop-blur-md z-20"
          >
            <div>
              <div className="rank-title w-full text-center mt-24 md:mt-28 text-6xl md:text-7xl mb-4">
                <button className="rank-arrow-left" onClick={this.leftClick}>
                  <img src="/icon/arrow-left-b.svg" alt="arrow-left" />
                </button>
                <Transition name="rankOp">
                  <div className="inline-block mx-4" key={this.rankIndex}>
                    {' '}
                    {this.rankOption[this.rankIndex]}{' '}
                  </div>
                </Transition>
                <button className="rank-arrow-right" onClick={this.rightClick}>
                  <img src="/icon/arrow-right-b.svg" alt="arrow-right" />
                </button>
              </div>
              <div className="rank-item-container w-full absolute top-44 md:top-52 max-w-md bottom-24 px-8">
                {/* <TransitionGroup name="fadeList">
                  {this.rankData[this.rankIndex].all.map((item, index) => {
                    return (
                      <RankItem
                        item={item}
                        index={index}
                        key={this.rankIndex + '-' + index}
                        txb={this.rankIndex === 2 ? true : false}
                      />
                    )
                  })}
                </TransitionGroup> */}
                <RecycleScroller
                  className="h-full"
                  items={this.rankData[this.rankIndex].all}
                  item-size={this.rankIndex === 2 ? 118 : 60}
                  key-field="id"
                  page-mode
                >
                  {({ item }) => {
                    return (
                      <Transition name="fadeList">
                        <RankItem
                          item={item}
                          index={item.index}
                          key={item.id}
                          txb={this.rankIndex === 2 ? true : false}
                        />
                      </Transition>
                    )
                  }}
                </RecycleScroller>
              </div>
              <div className="rank-about-me w-full absolute h-20 bottom-0 max-w-md px-2">
                <Transition name="fade" mode="out-in">
                  {this.rankIndex != 2 && (
                    <RankItem
                      item={this.rankData[this.rankIndex].me}
                      key={this.rankIndex}
                    ></RankItem>
                  )}
                </Transition>
              </div>
            </div>
          </div>
        </Transition>
        <ReturnBtn
          v-show={this.showRank}
          className="rule-zoom-in-ani top-5 left-5 z-40"
          onReturn={this.closeRank}
        ></ReturnBtn>
      </div>
    )
  }
}
