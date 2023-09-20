import './Cloud.css'

export default {
  props: {
    /**
     * Description
     */
    loadFinish: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  render() {
    return (
      <div className="pointer-events-none">
        <img
          src="/img/cloud_left_top.png"
          className={'cloud-left absolute top-0 left-0' + (this.loadFinish ? ' left-in-ani' : '')}
        ></img>
        <img
          src="/img/cloud_left_bottom.png"
          className={
            'cloud-left absolute bottom-0 left-0 ' + (this.loadFinish ? ' left-in-ani' : '')
          }
        ></img>
        <img
          src="/img/cloud_right_top.png"
          className={
            'cloud-right absolute top-0 right-0 ' + (this.loadFinish ? ' right-in-ani' : '')
          }
        ></img>
        <img
          src="/img/cloud_right_bottom.png"
          className={
            'cloud-right absolute bottom-0 right-0 pointer-events-none ' + (this.loadFinish ? ' right-in-ani' : '')
          }
        ></img>
      </div>
    )
  }
}
