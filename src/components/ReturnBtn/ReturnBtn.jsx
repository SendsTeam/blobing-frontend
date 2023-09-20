export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  methods: {
    clickEmit() {
      this.$emit('return')
    }
  },
  render() {
    return (
      <div>
        <div className={'absolute ' + this.className}>
          <button onClick={this.clickEmit}>
            <img src="/icon/return.svg" alt="return" />
          </button>
        </div>
      </div>
    )
  }
}
