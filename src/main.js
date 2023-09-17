import { createApp } from 'vue'
import App from './App.jsx'
import router from './router'

import 'vant/es/notify/style'

const app = createApp(App)

app.use(router)

app.mount('#app')
