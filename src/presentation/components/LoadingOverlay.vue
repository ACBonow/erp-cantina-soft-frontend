<template>
  <v-overlay v-model="model" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" indeterminate size="64" />
    <div v-if="message" class="text-h6 mt-4">{{ message }}</div>
  </v-overlay>
</template>

<script setup lang="ts">
interface Props {
  message?: string
}

defineProps<Props>()

const model = defineModel<boolean>({ default: false })
</script>
