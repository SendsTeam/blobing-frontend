import axios from "axios"
const URL = import.meta.env.VITE_APP_APIBASE
const axiosInstance = axios.create({
    baseURL: URL,
    timeout: 3000,
    crossDomain: true
})

axiosInstance.interceptors.request.use(
    config => {
        const user = getUser()
        if (user) {
            config.headers.token = user.token
        }
        return config
    },
    error => {
        console.log(error)
        toast.error(error.toString())
        return Promise.error(error)
    }
)

axiosInstance.interceptors.response.use(
    response => {
        console.log(response)
        return response
    },
    error => {
        if (error.response.data.code) {
            toast.error(error.response.data.desc)
            if (error.response.data.code == 401) {
                setUser('')
                router.push('/login')
            }
        } else {
            if (error.code === 'ECONNABORTED' || error.message === "Network Error" || error.message.includes("timeout")) {
                toast.error('请求超时或网络错误')
            } else
                toast.error(error.toString())
        }
        console.log(error)
        return Promise.error(error)
    }
)

const request = {}