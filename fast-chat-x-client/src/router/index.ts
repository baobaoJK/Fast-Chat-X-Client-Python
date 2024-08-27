import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/login'
      // component: IndexView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/IndexView.vue')
    },
    {
      path: '/forget',
      name: '/login',
      component: () => import('@/views/forget/IndexView.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/chat/IndexView.vue')
    }
  ]
})

export default router
