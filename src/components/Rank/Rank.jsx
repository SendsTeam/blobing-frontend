import './Rank.css'
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
      showRank: true,
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
            'rank inline-block absolute w-full text-center text-2xl md:text-3xl ' + this.className
          }
        >
          <button onClick={this.openRank}>排行榜</button>
        </div>
        <div
          v-show={this.showRank}
          className="wrapper rank-container top-0 bottom-0 left-0 right-0 absolute backdrop-blur-md z-20"
        >
          <div className="rank-title w-full text-center mt-24 md:mt-28 text-6xl md:text-7xl mb-4">
            <button className="rank-arrow-left" onClick={this.leftClick}>
              <img src="/icon/arrow-left-b.svg" alt="arrow-left" />
            </button>
            <div className="inline-block mx-4"> {this.rankOption[this.rankIndex]} </div>
            <button className="rank-arrow-right" onClick={this.rightClick}>
              <img src="/icon/arrow-right-b.svg" alt="arrow-right" />
            </button>
          </div>
          <div className="rank-item-container w-full absolute top-44 md:top-52 max-w-md bottom-20 px-8">
            <div className="rank-item w-full my-2 h-[52px] rounded-[18px] flex justify-between items-center px-4">
              <span className="rank-number">第一名</span>
              <span className="rank-name max-w-[64px]">一只修勾勾哦</span>
              <span className="rank-points">81分</span>
            </div>
          </div>
          <div className="rank-about-me w-full absolute h-20 bottom-0 max-w-md"></div>
        </div>
        <ReturnBtn
          v-show={this.showRank}
          className="top-5 left-5 z-40"
          onReturn={this.closeRank}
        ></ReturnBtn>
      </div>
    )
  }
}
