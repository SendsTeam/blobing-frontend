import './Progress.css'

export default {
  props: {
    className: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      progressBar: null
    }
  },
  methods: {
    getThrowForceScale() {
      if (this.$refs.progress) {
        const styles = window.getComputedStyle(this.$refs.progress, '::before')
        let value = styles.getPropertyValue('inset').split(' ')[1].split('px')[0]
        if (!Number(value)) value = 0
        else
          value =
            1 -
            value /
              window.getComputedStyle(this.$refs.progress).getPropertyValue('width').split('px')[0]
        return value
      } else return 0
    }
  },
  render() {
    return (
      <div className={'flex justify-center relative ' + this.className}>
        <div ref="progress" className="progress"></div>
        <div className="absolute font-semibold text-xl text-white ">投掷力度</div>
      </div>
    )
  }
}
