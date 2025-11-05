<template>
  <v-app>
    <DefaultLayout v-if="isAuthenticated" />
    <router-view v-else />
  </v-app>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useTheme } from '@/composables/useTheme'
import DefaultLayout from '@/presentation/layouts/DefaultLayout.vue'

const authStore = useAuthStore()
const { isDark } = useTheme()
const appError = ref<string | null>(null)

// Inicializar autenticação do localStorage
onMounted(() => {
  try {
    authStore.initializeFromStorage()
  } catch (error) {
    console.error('Error initializing app:', error)
    appError.value = 'Erro ao inicializar a aplicação'
  }
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style>
/* Global styles */
html {
  overflow-y: auto;
}

.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
