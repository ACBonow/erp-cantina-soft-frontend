import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/pages/HomePage.vue'),
    meta: {
      title: 'Início',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/presentation/pages/LoginPage.vue'),
    meta: {
      title: 'Login',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'CantinaSoft'} - CantinaSoft`
  next()
})

export default router
