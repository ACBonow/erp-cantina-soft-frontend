<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              <span class="text-h5">Gerenciar Pessoas</span>
            </div>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
              Nova Pessoa
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Search Bar -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="searchQuery"
                  prepend-inner-icon="mdi-magnify"
                  label="Buscar por nome, CPF ou email"
                  clearable
                  @update:model-value="handleSearch"
                />
              </v-col>
              <v-col cols="12" md="3">
                <v-select
                  v-model="filterActive"
                  :items="activeFilters"
                  label="Filtrar por status"
                  @update:model-value="fetchPeople"
                />
              </v-col>
            </v-row>

            <!-- Loading State -->
            <v-progress-linear v-if="peopleStore.loading" indeterminate color="primary" />

            <!-- Error Alert -->
            <v-alert v-if="peopleStore.hasError" type="error" variant="tonal" closable class="mb-4" @click:close="peopleStore.clearError()">
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
                {{ item.phone ? formatPhone(item.phone) : '-' }}
              </template>

              <template #item.active="{ item }">
                <v-chip :color="item.active ? 'success' : 'error'" size="small">
                  {{ item.active ? 'Ativo' : 'Inativo' }}
                </v-chip>
              </template>

              <template #item.actions="{ item }">
                <v-btn icon size="small" variant="text" @click="viewDependents(item)">
                  <v-icon>mdi-account-multiple</v-icon>
                  <v-tooltip activator="parent">Ver Dependentes</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" @click="editPerson(item)">
                  <v-icon>mdi-pencil</v-icon>
                  <v-tooltip activator="parent">Editar</v-tooltip>
                </v-btn>
                <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
                  <v-icon>mdi-delete</v-icon>
                  <v-tooltip activator="parent">Deletar</v-tooltip>
                </v-btn>
              </template>
            </v-data-table>

            <!-- Pagination -->
            <div class="d-flex justify-center mt-4">
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
          <span class="text-h5">{{ isEditing ? 'Editar Pessoa' : 'Nova Pessoa' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="formRef">
            <v-text-field
              v-model="formData.name"
              label="Nome Completo *"
              :rules="[(v) => !!v || 'Nome é obrigatório']"
              required
            />

            <v-text-field
              v-model="formData.cpf"
              label="CPF *"
              :rules="[(v) => !!v || 'CPF é obrigatório', (v) => isValidCPF(v) || 'CPF inválido']"
              :disabled="isEditing"
              required
            />

            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              :rules="[(v) => !v || isValidEmail(v) || 'Email inválido']"
            />

            <v-text-field
              v-model="formData.phone"
              label="Telefone"
              :rules="[(v) => !v || isValidPhone(v) || 'Telefone inválido']"
            />

            <v-text-field
              v-model="formData.birthDate"
              label="Data de Nascimento"
              type="date"
            />

            <v-switch
              v-if="isEditing"
              v-model="formData.active"
              label="Ativo"
              color="success"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="savePerson">
            {{ isEditing ? 'Salvar' : 'Criar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dependents Dialog -->
    <v-dialog v-model="dependentsDialog" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Dependentes de {{ selectedPerson?.name }}</span>
        </v-card-title>

        <v-card-text>
          <v-progress-linear v-if="peopleStore.loading" indeterminate color="primary" />

          <v-list v-else-if="peopleStore.dependents.length > 0">
            <v-list-item
              v-for="dependent in peopleStore.dependents"
              :key="dependent.id"
              :title="dependent.name"
              :subtitle="`CPF: ${formatCpf(dependent.cpf)}`"
            >
              <template #prepend>
                <v-avatar color="primary">
                  <v-icon>mdi-account</v-icon>
                </v-avatar>
              </template>
            </v-list-item>
          </v-list>

          <v-alert v-else type="info" variant="tonal">
            Esta pessoa não possui dependentes cadastrados.
          </v-alert>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dependentsDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir <strong>{{ selectedPerson?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deletePerson">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePeopleStore } from '@/store/people'
import type { Person } from '@/domain/entities/Person'
import { isValidCPF, isValidEmail, isValidPhone } from '@/shared/utils/validators'
import { formatCpf as formatCpfUtil, formatPhone as formatPhoneUtil } from '@/shared/utils/formatters'

const peopleStore = usePeopleStore()

// State
const searchQuery = ref('')
const filterActive = ref('all')
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

const activeFilters = [
  { title: 'Todos', value: 'all' },
  { title: 'Ativos', value: 'active' },
  { title: 'Inativos', value: 'inactive' },
]

const headers = [
  { title: 'Nome', key: 'name', sortable: true },
  { title: 'CPF', key: 'cpf', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Telefone', key: 'phone', sortable: false },
  { title: 'Status', key: 'active', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'end' },
]

// Methods
function formatCpf(cpf: string): string {
  return formatCpfUtil(cpf)
}

function formatPhone(phone: string): string {
  return formatPhoneUtil(phone)
}

async function fetchPeople() {
  const activeOnly = filterActive.value === 'active' ? true : filterActive.value === 'inactive' ? false : undefined
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error deleting person:', error)
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
