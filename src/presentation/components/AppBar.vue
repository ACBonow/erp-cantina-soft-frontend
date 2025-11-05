<template>
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon @click="$emit('toggleDrawer')" />

    <v-toolbar-title class="font-weight-bold">
      {{ t('app.name') }}
    </v-toolbar-title>

    <v-spacer />

    <!-- Language Selector -->
    <v-menu>
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-icon>mdi-translate</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="setLocale('pt-BR')">
          <v-list-item-title>Português (BR)</v-list-item-title>
        </v-list-item>
        <v-list-item @click="setLocale('en-US')">
          <v-list-item-title>English (US)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- Theme Toggle -->
    <v-btn icon @click="toggleTheme">
      <v-icon>{{ isDark ? 'mdi-weather-night' : 'mdi-weather-sunny' }}</v-icon>
    </v-btn>

    <!-- User Menu -->
    <v-menu v-if="authStore.isAuthenticated">
      <template #activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="secondary" size="36">
            <span class="text-white">{{ userInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
          <v-list-item-subtitle>{{ authStore.user?.email }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider />
        <v-list-item @click="handleLogout">
          <template #prepend>
            <v-icon>mdi-logout</v-icon>
          </template>
          <v-list-item-title>{{ t('auth.logout') }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useTheme } from '@/composables/useTheme'
import { useLocale } from '@/composables/useLocale'
import { useNotification } from '@/composables/useNotification'

defineEmits(['toggleDrawer'])

const router = useRouter()
const { t } = useI18n()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { setLocale } = useLocale()
const { success } = useNotification()

const userInitials = computed(() => {
  if (!authStore.user?.name) return '?'
  const names = authStore.user.name.split(' ')
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    : names[0][0].toUpperCase()
})

async function handleLogout() {
  authStore.logout()
  success(t('auth.logoutSuccess'))
  router.push({ name: 'login' })
}
</script>
