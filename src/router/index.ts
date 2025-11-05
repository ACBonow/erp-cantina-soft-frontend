import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/pages/HomePage.vue'),
    meta: {
      title: 'Início',
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/presentation/pages/LoginPage.vue'),
    meta: {
      title: 'Login',
      requiresAuth: false,
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/presentation/pages/DashboardPage.vue'),
    meta: {
      title: 'Dashboard',
      requiresAuth: true,
    },
  },
  // TODO: Descomentar quando as páginas forem criadas
  // {
  //   path: '/customers',
  //   name: 'customers',
  //   component: () => import('@/presentation/pages/customers/CustomersPage.vue'),
  //   meta: {
  //     title: 'Clientes',
  //     requiresAuth: true,
  //     roles: ['admin', 'manager'],
  //   },
  // },
  // {
  //   path: '/products',
  //   name: 'products',
  //   component: () => import('@/presentation/pages/products/ProductsPage.vue'),
  //   meta: {
  //     title: 'Produtos',
  //     requiresAuth: true,
  //     roles: ['admin', 'manager'],
  //   },
  // },
  // {
  //   path: '/sales',
  //   name: 'sales',
  //   component: () => import('@/presentation/pages/sales/SalesPage.vue'),
  //   meta: {
  //     title: 'Vendas',
  //     requiresAuth: true,
  //     roles: ['admin', 'manager'],
  //   },
  // },
  // {
  //   path: '/inventory',
  //   name: 'inventory',
  //   component: () => import('@/presentation/pages/inventory/InventoryPage.vue'),
  //   meta: {
  //     title: 'Inventário',
  //     requiresAuth: true,
  //     roles: ['admin', 'manager'],
  //   },
  // },
  // {
  //   path: '/reports',
  //   name: 'reports',
  //   component: () => import('@/presentation/pages/reports/ReportsPage.vue'),
  //   meta: {
  //     title: 'Relatórios',
  //     requiresAuth: true,
  //     roles: ['admin', 'manager'],
  //   },
  // },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, _from, next) => {
  // Update document title
  document.title = `${to.meta.title || 'CantinaSoft'} - CantinaSoft`

  const authStore = useAuthStore()

  // Initialize auth from storage if not already initialized
  if (!authStore.isAuthenticated) {
    authStore.initializeFromStorage()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Not authenticated, redirect to login
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // Check if route requires specific roles
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = authStore.user?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        // User doesn't have required role, redirect to dashboard
        next({ name: 'dashboard' })
        return
      }
    }
  }

  // If authenticated and trying to access login, redirect to dashboard
  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})

export default router
