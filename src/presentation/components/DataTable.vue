<template>
  <v-card>
    <v-card-title v-if="title">
      <div class="d-flex justify-space-between align-center">
        <span>{{ title }}</span>
        <slot name="title-actions" />
      </div>
    </v-card-title>

    <v-card-text>
      <!-- Search -->
      <v-text-field
        v-if="searchable"
        v-model="search"
        :label="t('common.search')"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        class="mb-4"
        clearable
      />

      <!-- Table -->
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :search="search"
        :items-per-page="itemsPerPage"
        :page="page"
        density="comfortable"
      >
        <template v-for="(_, slot) in $slots" #[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>

        <template #item.actions="{ item }">
          <v-btn
            v-if="showView"
            icon
            variant="text"
            size="small"
            @click="$emit('view', item)"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn
            v-if="showEdit"
            icon
            variant="text"
            size="small"
            @click="$emit('edit', item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            v-if="showDelete"
            icon
            variant="text"
            size="small"
            color="error"
            @click="$emit('delete', item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  title?: string
  headers: any[]
  items: any[]
  loading?: boolean
  searchable?: boolean
  itemsPerPage?: number
  page?: number
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
  searchable: true,
  itemsPerPage: 10,
  page: 1,
  showView: false,
  showEdit: true,
  showDelete: true,
})

defineEmits(['view', 'edit', 'delete'])

const { t } = useI18n()
const search = ref('')
</script>
