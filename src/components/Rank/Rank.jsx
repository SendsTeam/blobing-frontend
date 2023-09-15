import './Rank.css'
import ReturnBtn from '../ReturnBtn/ReturnBtn.jsx'
import RankItem from '../RankItem/RankItem.jsx'
import { Transition, TransitionGroup } from 'vue'

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
      rankIndex: 0
    }
  },
  methods: {
    openRank() {
      this.showRank = true
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
    }
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
                <TransitionGroup name="rankOp">
                  <div className="inline-block mx-4" key={this.rankIndex}>
                    {' '}
                    {this.rankOption[this.rankIndex]}{' '}
                  </div>
                </TransitionGroup>
                <button className="rank-arrow-right" onClick={this.rightClick}>
                  <img src="/icon/arrow-right-b.svg" alt="arrow-right" />
                </button>
              </div>
              <div className="rank-item-container w-full absolute top-44 md:top-52 max-w-md bottom-24 px-8">
                {Array.from({ length: 100 }).map(() => {
                  return <RankItem></RankItem>
                })}
              </div>
              <div className="rank-about-me w-full absolute h-20 bottom-0 max-w-md px-2">
                <RankItem></RankItem>
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
