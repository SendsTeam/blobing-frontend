import './RankItem.css'

export default {
  props: {
    txb: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.$refs.name.clientWidth > this.$refs.name.parentNode.clientWidth) {
      this.$refs.name.classList.add('rank-item-roll')
    }
  },
  render() {
    return (
      <div className="rank-item w-full mb-2 h-[52px] rounded-[18px] flex justify-between items-center px-4">
        <span className="rank-number">第1名</span>
        <span className="rank-name max-w-[50%] overflow-hidden rounded-3xl">
          <div ref="name" className="w-fit whitespace-nowrap">
            一只修购12
          </div>
        </span>
        <span className="rank-points">81分</span>
      </div>
    )
  }
}
