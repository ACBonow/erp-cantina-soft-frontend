<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              <span class="text-h5">{{ t('person.title') }}</span>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              {{ t('person.new') }}
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Search Bar -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  :label="t('person.searchPlaceholder')"
                  clearable
                  @update:model-value="handleSearch"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterActive"
                  :items="activeFilters"
                  item-title="title"
                  item-value="value"
                  :label="t('person.filterByStatus')"
                  @update:model-value="fetchPeople"
                />
              </v-col>
            </v-row>

            <!-- Loading State -->
            <v-progress-linear v-if="peopleStore.loading" indeterminate color="primary" />

            <!-- Error Alert -->
            <v-alert
              v-if="peopleStore.hasError"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
              @click:close="peopleStore.clearError()"
            >
              {{ peopleStore.error }}
            </v-alert>

            <!-- People Table -->
            <v-data-table
              :headers="headers"
              :items="peopleStore.people"
              :loading="peopleStore.loading"
              :items-per-page="peopleStore.limit"
              hide-default-footer
            >
              <template #item.cpf="{ item }">
                {{ formatCpf(item.cpf) }}
              </template>

              <template #item.phone="{ item }">
                {{ item.phone ? formatPhoneNumber(item.phone) : '-' }}
              </template>

              <template #item.active="{ item }">
                <v-chip :color="item.active ? 'success' : 'error'" size="small">
                  {{ item.active ? t('common.active') : t('common.inactive') }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn icon size="small" variant="text" @click="viewDependents(item)">
                  <v-icon>mdi-account-multiple</v-icon>
                  <v-tooltip activator="parent">{{ t('person.viewDependents') }}</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" @click="editPerson(item)">
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent">{{ t('common.edit') }}</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent">{{ t('common.delete') }}</v-tooltip>
                </v-btn>
              </template>

              <template #no-data>
                <div class="text-center py-8">
                  <v-icon size="64" color="grey">mdi-account-off</v-icon>
                  <p class="text-h6 mt-4">{{ t('common.noData') }}</p>
                </div>
              </template>
            </v-data-table>

            <!-- Pagination -->
            <div v-if="peopleStore.totalPages > 1" class="d-flex justify-center mt-4">
              <v-pagination
                v-model="currentPage"
                :length="peopleStore.totalPages"
                @update:model-value="handlePageChange"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? t('person.edit') : t('person.new') }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.name"
              :label="`${t('person.name')} *`"
              :rules="[rules.required]"
              required
            />

            <v-text-field
              v-model="formData.cpf"
              :label="`${t('person.cpf')} *`"
              :rules="[rules.required, rules.cpf]"
              :disabled="isEditing"
              required
              hint="Ex: 123.456.789-01 ou 12345678901"
            />

            <v-text-field
              v-model="formData.email"
              :label="t('person.email')"
              type="email"
              :rules="[rules.email]"
            />

            <v-text-field
              v-model="formData.phone"
              :label="t('person.phone')"
              :rules="[rules.phone]"
              hint="Ex: (11) 99999-9999"
            />

            <v-text-field
              v-model="formData.birthDate"
              :label="t('person.birthDate')"
              type="date"
            />

            <v-switch
              v-if="isEditing"
              v-model="formData.active"
              :label="t('common.active')"
              color="success"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">{{ t('common.cancel') }}</v-btn>
          <v-btn color="primary" :loading="peopleStore.loading" @click="savePerson">
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dependents Dialog -->
    <v-dialog v-model="dependentsDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ t('person.dependents') }} - {{ selectedPerson?.name }}</span>
        </v-card-title>

        <v-card-text>
          <v-progress-linear v-if="peopleStore.loading" indeterminate color="primary" />

          <v-list v-else-if="peopleStore.dependents.length > 0">
            <v-list-item
              v-for="dependent in peopleStore.dependents"
              :key="dependent.id"
              :title="dependent.name"
              :subtitle="`${t('person.cpf')}: ${formatCpf(dependent.cpf)}`"
            >
              <template #prepend>
                <v-avatar color="primary">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </template>
              <template #append>
                <v-chip :color="dependent.active ? 'success' : 'error'" size="small">
                  {{ dependent.active ? t('common.active') : t('common.inactive') }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" variant="tonal">
            {{ t('person.noDependents') }}
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dependentsDialog = false">{{ t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>{{ t('common.confirm') }}</v-card-title>
        <v-card-text>
          {{ t('person.deleteConfirm') }}
          <br />
          <strong>{{ selectedPerson?.name }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" :loading="peopleStore.loading" @click="deletePerson">
            {{ t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePeopleStore } from '@/store/people'
import type { Person } from '@/domain/entities/Person'
import { isValidCPF, isValidEmail, isValidPhone } from '@/shared/utils/validators'
import { formatCPF, formatPhone } from '@/shared/utils/formatters'
import { getUserFriendlyError } from '@/shared/utils/errorHandler'

const { t } = useI18n()
const peopleStore = usePeopleStore()

// State
const searchQuery = ref('')
const filterActive = ref('active')
const currentPage = ref(1)
const dialog = ref(false)
const dependentsDialog = ref(false)
const deleteDialog = ref(false)
const isEditing = ref(false)
const selectedPerson = ref<Person | null>(null)
const formRef = ref()

const formData = ref({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  birthDate: '',
  active: true,
})

const activeFilters = computed(() => [
  { title: t('person.all'), value: 'all' },
  { title: t('person.active'), value: 'active' },
  { title: t('person.inactive'), value: 'inactive' },
])

const headers = computed(() => [
  { title: t('person.name'), key: 'name', sortable: true },
  { title: t('person.cpf'), key: 'cpf', sortable: true },
  { title: t('person.email'), key: 'email', sortable: true },
  { title: t('person.phone'), key: 'phone', sortable: false },
  { title: t('common.status'), key: 'active', sortable: true },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'end' },
])

// Validation rules
const rules = {
  required: (v: string) => !!v || t('validation.required'),
  email: (v: string) => !v || isValidEmail(v) || t('validation.email'),
  cpf: (v: string) => isValidCPF(v) || t('validation.cpf'),
  phone: (v: string) => !v || isValidPhone(v) || t('validation.phone'),
}

// Methods
function formatCpf(cpf: string): string {
  return formatCPF(cpf)
}

function formatPhoneNumber(phone: string): string {
  return formatPhone(phone)
}

async function fetchPeople() {
  const activeOnly =
    filterActive.value === 'active' ? true : filterActive.value === 'inactive' ? false : undefined
  await peopleStore.fetchPeople(currentPage.value, 10, activeOnly as boolean)
}

async function handleSearch() {
  if (searchQuery.value && searchQuery.value.length >= 2) {
    await peopleStore.searchPeople(searchQuery.value, currentPage.value, 10)
  } else if (!searchQuery.value) {
    await fetchPeople()
  }
}

function handlePageChange(page: number) {
  currentPage.value = page
  if (searchQuery.value) {
    handleSearch()
  } else {
    fetchPeople()
  }
}

function openCreateDialog() {
  isEditing.value = false
  formData.value = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: '',
    active: true,
  }
  dialog.value = true
}

function editPerson(person: Person) {
  isEditing.value = true
  selectedPerson.value = person
  formData.value = {
    name: person.name,
    cpf: person.cpf,
    email: person.email || '',
    phone: person.phone || '',
    birthDate: person.birthDate ? person.birthDate.split('T')[0] : '',
    active: person.active,
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  formData.value = {
    name: '',
    cpf: '',
    email: '',
    phone: '',
    birthDate: '',
    active: true,
  }
  selectedPerson.value = null
}

async function savePerson() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  try {
    if (isEditing.value && selectedPerson.value) {
      await peopleStore.updatePerson(selectedPerson.value.id, {
        name: formData.value.name,
        email: formData.value.email || undefined,
        phone: formData.value.phone || undefined,
        birthDate: formData.value.birthDate || undefined,
        active: formData.value.active,
      })
    } else {
      await peopleStore.createPerson({
        name: formData.value.name,
        cpf: formData.value.cpf,
        email: formData.value.email || undefined,
        phone: formData.value.phone || undefined,
        birthDate: formData.value.birthDate || undefined,
      })
    }
    closeDialog()
    await fetchPeople()
  } catch (error: any) {
    // Error is already set in the store with user-friendly message
    console.error('Error saving person:', error)
  }
}

async function viewDependents(person: Person) {
  selectedPerson.value = person
  await peopleStore.fetchDependents(person.id)
  dependentsDialog.value = true
}

function confirmDelete(person: Person) {
  selectedPerson.value = person
  deleteDialog.value = true
}

async function deletePerson() {
  if (!selectedPerson.value) return

  try {
    await peopleStore.deletePerson(selectedPerson.value.id)
    deleteDialog.value = false
    selectedPerson.value = null
    await fetchPeople()
  } catch (error: any) {
    // Keep dialog open to show error message
    console.error('Error deleting person:', error)
    // Error message is already displayed in the alert
  }
}

onMounted(() => {
  fetchPeople()
})
</script>

<style scoped lang="scss">
.v-data-table {
  min-height: 400px;
}
</style>
