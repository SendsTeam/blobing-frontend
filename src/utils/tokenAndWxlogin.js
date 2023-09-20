const TOKEN_NAME = 'Blobing'

const setToken = (token) => {
    localStorage.setItem(TOKEN_NAME, token)
}

const getToken = () => {
    try {
        return localStorage.getItem(TOKEN_NAME)
    } catch {
        return null
    }
}

const isLogin = () => {
    const token = getToken()
    if (!token || token === '') return false
    console.log("token: ", token)
    return true
}

const wxRedirect = () => {
    window.location.href = `https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent(`${document.location.origin}`)}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`
}

const bindRedirect = () => {
    window.location.replace(`https://apps.hqu.edu.cn/wechat-hqu/wechatauth.html?proxyTo=authoauth&sendUrl=/connect/oauth2/authorize?appid=wxfe035b066fb1158b&redirect_uri=${encodeURIComponent("http://wx.sends.cc")}&encode_flag=Y&response_type=code&scope=snsapi_userinfo#wechat_redirect`)
}

const isInWechat = () => {
    return window.navigator.userAgent.includes('MicroMessenger')
}

const getWechatCode = () => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.get('code')
}



export {
    setToken, getToken, isLogin, wxRedirect, bindRedirect, isInWechat, getWechatCode
}