import { createRouter, createWebHashHistory } from 'vue-router'
import { isInWechat } from '../utils/tokenAndWxlogin.js'
import Wechat from '../pages/Wechat/Wechat.jsx'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: import('../pages/Game/Game.jsx')
    },
    {
      path: '/wechat',
      name: 'wechat',
      component: Wechat
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/wechat' || isInWechat()) next()
  else router.push('/wechat')
})
export default router
