import wx from 'weixin-js-sdk'
import request from './request.js'
import { isInWechat } from './tokenAndWxlogin.js'
import { showNotify } from 'vant'

const wechatShareConfig = {
    title: '好耶！我在桑梓中秋博饼小游戏里博到了……', // 分享标题
    desc: '快来一起来试试吧！有机会赢取线下博饼机会哦！', // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: import.meta.env.VITE_APP_SHARE_PICTURE, // 分享图标
    success: async function () {
        const result = await request.addCount()
        showNotify({ type: 'warning', message: result })
    },
    cancel: function () {
        showNotify({ type: 'warning', message: '分享失败！' })
    },
    complete: function () {
        console.log('share complete')
    }
}

export function initSdk() {
    if (!isInWechat) return
    // alert(window.location.href.split('#')[0])
    request.jssdk(window.location.href.split('#')[0]).then(res => {
        const sdkConfig = res
        wx.config({
            debug: process.env.NODE_ENV !== 'production',
            appId: sdkConfig.appId, // 必填，公众号的唯一标识
            timestamp: sdkConfig.timestamp, // 必填，生成签名的时间戳
            nonceStr: sdkConfig.nonceStr, // 必填，生成签名的随机串
            signature: sdkConfig.signature,// 必填，签名
            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'checkJsApi'] // 必填，需要使用的JS接口列表
        })

        wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            console.log("微信验证失败", res)
        })

        wx.ready(function () {
            // wx.updateAppMessageShareData(wechatShareConfig)
            // wx.updateTimelineShareData(wechatShareConfig)
            wx.onMenuShareTimeline(wechatShareConfig)
            wx.onMenuShareAppMessage(wechatShareConfig)
            wx.onMenuShareQQ(wechatShareConfig)
            wx.onMenuShareWeibo(wechatShareConfig)
            wx.onMenuShareQZone(wechatShareConfig)
        })
    })
}