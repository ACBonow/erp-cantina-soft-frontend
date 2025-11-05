<template>
  <div class="notification-container">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="notification.visible"
      :color="getColor(notification.type)"
      :timeout="notification.timeout"
      location="top right"
      multi-line
    >
      {{ notification.message }}
      <template #actions>
        <v-btn variant="text" @click="remove(notification.id)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotification } from '@/composables/useNotification'

const { notifications: rawNotifications, remove } = useNotification()

const notifications = ref<Array<any>>([])

watch(
  rawNotifications,
  (newNotifications) => {
    notifications.value = newNotifications.map((n) => ({
      ...n,
      visible: true,
    }))
  },
  { deep: true },
)

function getColor(type: string) {
  const colors = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }
  return colors[type as keyof typeof colors] || 'info'
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
}
</style>
