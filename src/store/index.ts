import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false,
    user: null as any,
    isAuthenticated: false,
  }),

  getters: {
    isLoading: (state) => state.loading,
    currentUser: (state) => state.user,
    authenticated: (state) => state.isAuthenticated,
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setUser(user: any) {
      this.user = user
      this.isAuthenticated = !!user
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
    },
  },
})
