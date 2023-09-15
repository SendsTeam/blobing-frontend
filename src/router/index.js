import { createRouter, createWebHashHistory } from 'vue-router'
import Game from '../pages/Game/Game.jsx'
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Game
    },
  ]
})

export default router
