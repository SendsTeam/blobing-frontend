import { createRouter, createWebHashHistory } from 'vue-router'
import { isInWechat, isLogin } from '../utils/tokenAndWxlogin.js'
import Wechat from '../pages/Wechat/Wechat.jsx'
import Binding from '../pages/Binding/Binding.jsx'
import Landing from '../pages/Landing/Landing.jsx'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/landing'
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../pages/Game/Game.jsx'),
      beforeEnter: (to, from, next) => {
        if (isLogin()) next()
        else router.push('/')
      }
    },
    {
      path: '/wechat',
      name: 'wechat',
      component: Wechat
    },
    {
      path: '/binding',
      name: 'binding',
      component: Binding,
      beforeEnter: (to, from, next) => {
        if (isLogin()) router.push('/')
        else next()
      }
    },
    {
      path: '/landing',
      name: 'landing',
      component: Landing
    },
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/wechat' || isInWechat()) next()
  else router.push('/wechat')
})
export default router
