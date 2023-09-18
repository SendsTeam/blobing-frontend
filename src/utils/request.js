import axios from "axios"
import { getToken, setToken, wxRedirect } from "./tokenAndWxlogin.js"
import { showNotify } from 'vant'
import router from '../router/index.js'


const URL = import.meta.env.VITE_APP_APIBASE
const WS = import.meta.env.VITE_APP_WS
const token = getToken()

const axiosInstance = axios.create({
    baseURL: URL,
    timeout: 3000,
    crossDomain: true
})

// 请求拦截器
axiosInstance.interceptors.request.use(
    config => {
        if (token) {
            config.headers.token = token
        }
        return config
    },
    error => {
        console.log(error)
        showNotify({ type: 'danger', message: error.toString() })
        return Promise.error(error)
    }
)

// 响应拦截器
axiosInstance.interceptors.response.use(
    response => {
        if (response.data.code !== 1000) {
            showNotify({ type: 'danger', message: response.data.msg })
        }
        if (response.data.code === 419 || response.data.code === 401) {
            setToken('')
            router.push('/')
        } else if (response.data.code === 403) {
            setToken('')
            router.push('/binding')
        }
        // console.log(response)
        return response
    },
    error => {
        if (error.response.data.code) {
            showNotify({ type: 'danger', message: error.response.data.msg })
            if (error.response.data.code === 401) {
                setToken('')
                router.push('/')
            }
        } else {
            if (error.code === 'ECONNABORTED' || error.message === "Network Error" || error.message.includes("timeout")) {
                showNotify({ type: 'danger', message: '请求超时或网络错误' })
            } else
                showNotify({ type: 'danger', message: error.toString() })
        }
        console.log(error)
        return Promise.error(error)
    }
)

const request = {}


// /user/login
request.login = async function (code) {
    try {
        const result = await axiosInstance.post('/user/login', { code })
        if (result.data.code === 1000) {
            setToken(result.data.data)
            showNotify({ type: 'success', message: '登陆成功!' })
            return true
        } else {
            alert(result.data.msg)
            wxRedirect()
        }
    } catch (error) {
        // alert(code)
        console.log(error)
        wxRedirect()
    }
}

// /boBing/init
request.init = async function () {
    try {
        await axiosInstance.get('/boBing/init')
    } catch (error) {
        console.log(error)
    }
}

// /boBing/getCount
request.getCount = async function () {
    try {
        const result = await axiosInstance.get('/boBing/getCount')
        if (result.data.code === 1000) {
            if (result.data.data.count)
                return result.data.data.count
            else return 0
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/key
request.key = async function () {
    try {
        const result = await axiosInstance.get('/boBing/key')
        if (result.data.code === 1000) {
            return result.data.data.key
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/publish
request.publish = async function (detail, points) {
    try {
        const result = await axiosInstance.post('/boBing/publish', { detail, points })
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/addCount
request.addCount = async function () {
    try {
        const result = await axiosInstance.get('/boBing/addCount')
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/dayRank
request.dayRank = async function () {
    try {
        const result = await axiosInstance.get('/boBing/dayRank')
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}


// /boBing/record
request.record = async function () {
    try {
        const result = await axiosInstance.get('/boBing/record')
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/tianXuan
request.tianXuan = async function () {
    try {
        const result = await axiosInstance.get('/boBing/tianXuan')
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/top
request.top = async function () {
    try {
        const result = await axiosInstance.get('/boBing/top')
        if (result.data.code === 1000) {
            return result.data.data
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

// /boBing/broadcast

// ws
try { const socket = new WebSocket(WS, [token]) }
catch (error) {
    console.log(error)
}



export default request