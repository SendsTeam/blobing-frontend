import './Menu.css'

export default {
  methods: {
    play() {
      if (this.$parent.game.status === this.$parent.game.STATUS.READY) {
        this.$parent.game.status = this.$parent.game.STATUS.FREE
      } else if (this.$parent.game.status === this.$parent.game.STATUS.FREE) {
        this.$parent.game.status = this.$parent.game.STATUS.READY
      } else {
        this.$parent.game.status = this.$parent.game.STATUS.FREE
      }
    }
  },
  render() {
    return (
      <>
        <button className="btn absolute top-16 select-none" onClick={this.play}>
          {this.$parent.game.status}
        </button>
      </>
    )
  }
}
