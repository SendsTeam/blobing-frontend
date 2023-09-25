import './RankItem.css'

export default {
  props: {
    txb: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      date: null
    }
  },
  methods: {
    formatTimestamp(stamp) {
      const date = new Date(stamp * 1000) // 将时间戳转换为毫秒

      const month = (date.getMonth() + 1).toString().padStart(2, '0') // 获取月份，并补齐两位
      const day = date.getDate().toString().padStart(2, '0') // 获取日期，并补齐两位
      const hours = date.getHours().toString().padStart(2, '0') // 获取小时，并补齐两位
      const minutes = date.getMinutes().toString().padStart(2, '0') // 获取分钟，并补齐两位
      const seconds = date.getSeconds().toString().padStart(2, '0') // 获取秒，并补齐两位

      const formatted = `${month}-${day} ${hours}:${minutes}:${seconds}`
      return formatted
    }
  },
  mounted() {
    if (this.txb) this.date = this.formatTimestamp(this.item.time.seconds)
  },
  render() {
    return (
      <div>
        {this.txb ? (
          <div className="rank-item w-full mb-2 h-[104px] rounded-[18px] px-4">
            <div className="rank-points w-full h-1/2 text-center">{this.date}</div>
            <div className="w-full h-1/2 flex justify-around items-center">
              <span className="rank-name max-w-[50%] overflow-hidden rounded-3xl w-1/2 h-full text-center">
                <div className="w-full whitespace-nowrap text-ellipsis overflow-hidden">
                  {this.item.nickName}
                </div>
              </span>
              <span className="rank-points w-1/2 h-full text-center">{this.item.types}</span>
            </div>
          </div>
        ) : (
          <div className="rank-item w-full mb-2 h-[52px] rounded-[18px] flex justify-between items-center px-4">
            <span className="rank-number">
              第{this.index !== null ? this.index + 1 : this.item.rank}名
            </span>
            <span className="rank-name max-w-[50%] overflow-hidden rounded-3xl">
              <div className="w-full whitespace-nowrap text-ellipsis overflow-hidden">
                {this.item.nickName}
              </div>
            </span>
            <span className="rank-points">{this.item.score ? this.item.score : 0}分</span>
          </div>
        )}
      </div>
    )
  }
}
