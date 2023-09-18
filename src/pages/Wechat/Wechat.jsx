import './Wechat.css'

export default {
  render() {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center">
        <div className='text-center max-w-md'>
          <img src="/img/qrcode.png" alt="qrcode" />
          <div className='wechat-tips text-3xl'>~微信扫码，快来玩耍～</div>
        </div>
      </div>
    )
  }
}
