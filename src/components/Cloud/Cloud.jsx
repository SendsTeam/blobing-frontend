import './Cloud.css'

export default {
  render() {
    return (
      <div className="pointer-events-none">
        <img src="/img/cloud_left_top.png" className="absolute top-0 left-0"></img>
        <img src="/img/cloud_left_bottom.png" className="absolute bottom-0 left-0"></img>
        <img src="/img/cloud_right_top.png" className="absolute top-0 right-0"></img>
        <img src="/img/cloud_right_bottom.png" className="absolute bottom-0 right-0"></img>
      </div>
    )
  }
}
