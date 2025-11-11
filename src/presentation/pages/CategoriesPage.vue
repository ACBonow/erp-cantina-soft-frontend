<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">{{ $t('categories.title') }}</h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          {{ $t('categories.subtitle') }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          @click="openCreateDialog"
        >
          {{ $t('categories.actions.create') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :label="$t('common.search')"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="activeFilter"
              :items="activeFilterOptions"
              :label="$t('common.status')"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredCategories"
        :loading="categoryStore.loading"
        :items-per-page="10"
        class="elevation-0"
      >
        <!-- Name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-tag</v-icon>
            <span class="font-weight-medium">{{ item.name }}</span>
          </div>
        </template>

        <!-- Description -->
        <template #item.description="{ item }">
          <span class="text-medium-emphasis">{{ item.description || '-' }}</span>
        </template>

        <!-- Active Status -->
        <template #item.active="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            {{ item.active ? $t('common.active') : $t('common.inactive') }}
          </v-chip>
        </template>

        <!-- Created At -->
        <template #item.createdAt="{ item }">
          <span class="text-caption text-medium-emphasis">
            {{ formatDate(item.createdAt) }}
          </span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            color="primary"
            @click="openEditDialog(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click="confirmDelete(item)"
          />
        </template>

        <!-- Loading -->
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <!-- No data -->
        <template #no-data>
          <v-empty-state
            icon="mdi-tag-off"
            :title="$t('categories.emptyState.title')"
            :text="$t('categories.emptyState.text')"
          >
            <template #actions>
              <v-btn color="primary" @click="openCreateDialog">
                {{ $t('categories.actions.create') }}
              </v-btn>
            </template>
          </v-empty-state>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-6">
          {{ isEdit ? $t('categories.dialog.edit') : $t('categories.dialog.create') }}
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-form ref="form" @submit.prevent="saveCategory">
            <v-text-field
              v-model="formData.name"
              :label="$t('categories.fields.name') + ' *'"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <v-textarea
              v-model="formData.description"
              :label="$t('categories.fields.description')"
              variant="outlined"
              density="comfortable"
              rows="3"
              class="mb-4"
            />

            <v-switch
              v-model="formData.active"
              :label="$t('categories.fields.active')"
              color="primary"
              density="comfortable"
              hide-details
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDialog"
            :disabled="categoryStore.loading"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveCategory"
            :loading="categoryStore.loading"
          >
            {{ $t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <confirm-dialog
      v-model="deleteDialog"
      :title="$t('categories.delete.title')"
      :message="$t('categories.delete.message')"
      :loading="categoryStore.loading"
      @confirm="deleteCategory"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCategoryStore } from '@/store/category'
import { useNotification } from '@/composables/useNotification'
import { useI18n } from 'vue-i18n'
import type { Category, CreateCategoryDTO } from '@/domain/entities/Product'
import { formatDate } from '@/shared/utils/formatters'
import ConfirmDialog from '@/presentation/components/ConfirmDialog.vue'

const { t } = useI18n()
const categoryStore = useCategoryStore()
const { success, error: showError } = useNotification()

// State
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const currentCategory = ref<Category | null>(null)
const search = ref('')
const activeFilter = ref('all')
const form = ref<any>(null)

const formData = ref<CreateCategoryDTO & { active: boolean }>({
  name: '',
  description: '',
  active: true,
})

// Validation rules
const rules = {
  required: (v: string) => !!v || t('validation.required'),
}

// Filter options
const activeFilterOptions = computed(() => [
  { title: t('common.all'), value: 'all' },
  { title: t('common.active'), value: 'active' },
  { title: t('common.inactive'), value: 'inactive' },
])

// Headers
const headers = computed(() => [
  { title: t('categories.fields.name'), key: 'name', sortable: true },
  { title: t('categories.fields.description'), key: 'description', sortable: false },
  { title: t('common.status'), key: 'active', sortable: true, align: 'center' as const },
  { title: t('common.createdAt'), key: 'createdAt', sortable: true },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'center' as const },
])

// Computed
const filteredCategories = computed(() => {
  let categories = categoryStore.categories

  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    categories = categories.filter(
      (c) =>
        c.name.toLowerCase().includes(searchLower) ||
        c.description?.toLowerCase().includes(searchLower),
    )
  }

  // Filter by active status
  if (activeFilter.value === 'active') {
    categories = categories.filter((c) => c.active)
  } else if (activeFilter.value === 'inactive') {
    categories = categories.filter((c) => !c.active)
  }

  return categories
})

// Methods
function openCreateDialog() {
  isEdit.value = false
  formData.value = {
    name: '',
    description: '',
    active: true,
  }
  dialog.value = true
}

function openEditDialog(category: Category) {
  isEdit.value = true
  currentCategory.value = category
  formData.value = {
    name: category.name,
    description: category.description || '',
    active: category.active,
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  form.value?.reset()
  currentCategory.value = null
}

async function saveCategory() {
  const valid = await form.value?.validate()
  if (!valid?.valid) return

  try {
    if (isEdit.value && currentCategory.value) {
      await categoryStore.updateCategory(currentCategory.value.id, formData.value)
      success(t('categories.messages.updated'))
    } else {
      await categoryStore.createCategory(formData.value)
      success(t('categories.messages.created'))
    }
    closeDialog()
  } catch (err: any) {
    showError(err.message || t('common.error'))
  }
}

function confirmDelete(category: Category) {
  currentCategory.value = category
  deleteDialog.value = true
}

async function deleteCategory() {
  if (!currentCategory.value) return

  try {
    await categoryStore.deleteCategory(currentCategory.value.id)
    success(t('categories.messages.deleted'))
    deleteDialog.value = false
    currentCategory.value = null
  } catch (err: any) {
    showError(err.message || t('common.error'))
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await categoryStore.fetchCategories()
  } catch (err: any) {
    showError(err.message || t('common.error'))
  }
})
</script>

<style scoped>
.v-empty-state {
  padding: 48px 24px;
}
</style>
