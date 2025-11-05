import { ref } from 'vue'

export interface Notification {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout?: number
}

const notifications = ref<Notification[]>([])
let notificationId = 0

export function useNotification() {
  function notify(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    timeout = 3000,
  ) {
    const id = ++notificationId
    const notification: Notification = {
      id,
      message,
      type,
      timeout,
    }

    notifications.value.push(notification)

    if (timeout > 0) {
      setTimeout(() => {
        remove(id)
      }, timeout)
    }

    return id
  }

  function remove(id: number) {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function success(message: string, timeout = 3000) {
    return notify(message, 'success', timeout)
  }

  function error(message: string, timeout = 5000) {
    return notify(message, 'error', timeout)
  }

  function warning(message: string, timeout = 4000) {
    return notify(message, 'warning', timeout)
  }

  function info(message: string, timeout = 3000) {
    return notify(message, 'info', timeout)
  }

  return {
    notifications,
    notify,
    remove,
    success,
    error,
    warning,
    info,
  }
}
