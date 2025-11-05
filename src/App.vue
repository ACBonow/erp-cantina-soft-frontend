<template>
  <DefaultLayout v-if="isAuthenticated" />
  <router-view v-else />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useTheme } from '@/composables/useTheme'
import DefaultLayout from '@/presentation/layouts/DefaultLayout.vue'

const authStore = useAuthStore()
const { isDark } = useTheme()

// Inicializar autenticação do localStorage
onMounted(() => {
  authStore.initializeFromStorage()
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
