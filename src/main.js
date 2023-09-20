import { createApp } from 'vue'
import App from './App.jsx'
import router from './router'
import { initSdk } from './utils/wxSdk.js'


import 'vant/es/notify/style'
import 'vant/es/barrage/style'

const app = createApp(App)

app.use(router)

app.mount('#app')

try {
    initSdk()
} catch (e) {
    console.log(e)
}

