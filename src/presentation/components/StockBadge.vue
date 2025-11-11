<template>
  <v-chip
    :color="statusColor"
    :prepend-icon="statusIcon"
    size="small"
    variant="flat"
    :title="`Estoque: ${currentStock || 0} unidades`"
  >
    {{ statusLabel }} ({{ currentStock || 0 }})
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentStock?: number
  minStockAlert?: number
  maxStockAlert?: number
}

const props = withDefaults(defineProps<Props>(), {
  currentStock: 0,
  minStockAlert: 10,
  maxStockAlert: 100,
})

const statusColor = computed(() => {
  if (!props.currentStock || props.currentStock === 0) {
    return 'error'
  }

  if (props.currentStock <= props.minStockAlert) {
    return 'warning'
  }

  if (props.currentStock >= props.maxStockAlert) {
    return 'info'
  }

  return 'success'
})

const statusIcon = computed(() => {
  if (!props.currentStock || props.currentStock === 0) {
    return 'mdi-close-circle'
  }

  if (props.currentStock <= props.minStockAlert) {
    return 'mdi-alert'
  }

  if (props.currentStock >= props.maxStockAlert) {
    return 'mdi-package-variant'
  }

  return 'mdi-check-circle'
})

const statusLabel = computed(() => {
  if (!props.currentStock || props.currentStock === 0) {
    return 'Sem Estoque'
  }

  if (props.currentStock <= props.minStockAlert) {
    return 'Estoque Baixo'
  }

  if (props.currentStock >= props.maxStockAlert) {
    return 'Estoque Alto'
  }

  return 'Estoque OK'
})
</script>
