<template>
  <v-navigation-drawer v-model="model" :rail="rail" permanent>
    <v-list-item :title="rail ? undefined : t('app.name')" nav>
      <template #prepend>
        <v-icon v-if="rail">mdi-food</v-icon>
      </template>
      <template #append>
        <v-btn icon variant="text" size="small" @click="rail = !rail">
          <v-icon>{{ rail ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
        </v-btn>
      </template>
    </v-list-item>

    <v-divider />

    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="t(item.title)"
        :value="item.to"
        :to="item.to"
        color="primary"
      />
    </v-list>

    <template v-if="authStore.canViewReports" #append>
      <v-divider />
      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-chart-bar"
          :title="t('nav.reports')"
          value="reports"
          to="/reports"
          color="primary"
        />
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'

const model = defineModel<boolean>({ default: true })

const { t } = useI18n()
const authStore = useAuthStore()
const rail = ref(false)

const menuItems = computed(() => {
  const items = [
    {
      to: '/dashboard',
      icon: 'mdi-view-dashboard',
      title: 'nav.dashboard',
    },
    {
      to: '/pdv',
      icon: 'mdi-cash-register',
      title: 'nav.pdv',
    },
  ]

  if (authStore.canManageProducts) {
    items.push(
      {
        to: '/people',
        icon: 'mdi-account-multiple',
        title: 'nav.people',
      },
      {
        to: '/categories',
        icon: 'mdi-tag-multiple',
        title: 'nav.categories',
      },
    )
  }

  if (authStore.canManageSales) {
    items.push({
      to: '/sales',
      icon: 'mdi-cart',
      title: 'nav.sales',
    })
  }

  if (authStore.canManageInventory) {
    items.push({
      to: '/inventory',
      icon: 'mdi-warehouse',
      title: 'nav.inventory',
    })
  }

  return items
})
</script>
