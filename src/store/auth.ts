import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/domain/entities/User'
import type { LoginDTO, RegisterDTO } from '@/domain/repositories/IAuthRepository'
import { authRepository } from '@/infrastructure/repositories/AuthRepository'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isManager = computed(() => user.value?.role === 'manager')
  const canManageProducts = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'manager',
  )
  const canManageSales = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'manager',
  )
  const canManageInventory = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'manager',
  )
  const canViewReports = computed(
    () => user.value?.role === 'admin' || user.value?.role === 'manager',
  )

  // Actions
  async function login(credentials: LoginDTO) {
    loading.value = true
    error.value = null
    try {
      const response = await authRepository.login(credentials)
      user.value = response.user
      token.value = response.token
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer login'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterDTO) {
    loading.value = true
    error.value = null
    try {
      const response = await authRepository.register(data)
      user.value = response.user
      token.value = response.token
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao fazer registro'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function verifyToken() {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) return false

    try {
      const response = await authRepository.verifyToken(storedToken)
      if (response.valid && response.user) {
        token.value = storedToken
        user.value = response.user
        return true
      }
      return false
    } catch (err) {
      logout()
      return false
    }
  }

  function logout() {
    authRepository.logout()
    user.value = null
    token.value = null
    error.value = null
  }

  function initializeFromStorage() {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    isAdmin,
    isManager,
    canManageProducts,
    canManageSales,
    canManageInventory,
    canViewReports,
    // Actions
    login,
    register,
    verifyToken,
    logout,
    initializeFromStorage,
  }
})
