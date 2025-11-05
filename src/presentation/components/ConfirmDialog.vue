<template>
  <v-dialog v-model="model" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h5">
        {{ title || t('common.confirm') }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" variant="text" @click="model = false">
          {{ cancelText || t('common.cancel') }}
        </v-btn>
        <v-btn :color="confirmColor" variant="text" @click="handleConfirm">
          {{ confirmText || t('common.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
}

withDefaults(defineProps<Props>(), {
  confirmColor: 'primary',
})

const emit = defineEmits(['confirm', 'cancel'])

const model = defineModel<boolean>({ default: false })

const { t } = useI18n()

function handleConfirm() {
  emit('confirm')
  model.value = false
}
</script>
