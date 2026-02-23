<template>
  <v-container fluid class="pa-4 pa-md-6">
    <!-- Header -->
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h5 font-weight-bold">{{ t('customer.title') }}</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ t('customer.list') }}
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          v-if="authStore.canManageProducts"
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          {{ t('customer.new') }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- Search + Filter -->
    <v-card class="mb-4" elevation="1">
      <v-card-text class="py-3">
        <v-row dense align="center">
          <v-col cols="12" sm="8" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              :placeholder="t('person.searchPlaceholder')"
              variant="outlined"
              density="compact"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" sm="4" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              item-title="label"
              item-value="value"
              :label="t('person.filterByStatus')"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Table -->
    <v-card elevation="1">
      <v-data-table
        :headers="headers"
        :items="filteredCustomers"
        :loading="customerStore.loading"
        :loading-text="t('common.loading')"
        :no-data-text="t('common.noData')"
        :items-per-page="10"
        class="elevation-0"
      >
        <!-- Balance chip -->
        <template #item.balance="{ item }">
          <v-chip
            :color="item.balance > 0 ? 'success' : item.balance < 0 ? 'error' : 'grey'"
            size="small"
            variant="tonal"
          >
            {{ formatCurrency(item.balance || 0) }}
          </v-chip>
        </template>

        <!-- Status chip -->
        <template #item.active="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'grey'"
            size="small"
            variant="tonal"
          >
            {{ item.active ? t('common.active') : t('common.inactive') }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex ga-1 justify-end">
            <v-tooltip :text="t('customer.addCredit')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-cash-plus"
                  size="small"
                  color="success"
                  variant="tonal"
                  @click="openAddCreditDialog(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="t('customer.balanceHistory')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-history"
                  size="small"
                  color="info"
                  variant="tonal"
                  @click="openHistoryDialog(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip v-if="authStore.canManageProducts" :text="t('common.edit')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  color="warning"
                  variant="tonal"
                  @click="openEditDialog(item)"
                />
              </template>
            </v-tooltip>

            <v-tooltip v-if="authStore.canManageProducts" :text="t('common.delete')" location="top">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  variant="tonal"
                  @click="openDeleteDialog(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- ─── Add Credit Dialog ─── -->
    <v-dialog v-model="creditDialog" max-width="460" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-success text-white">
          <v-icon class="mr-2">mdi-cash-plus</v-icon>
          {{ t('customer.addCredit') }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-alert type="info" variant="tonal" density="compact" class="mb-4">
            <span class="font-weight-medium">{{ selectedCustomer?.name }}</span>
            &nbsp;—&nbsp;
            {{ t('customer.balance') }}:
            <strong>{{ formatCurrency(selectedCustomer?.balance || 0) }}</strong>
          </v-alert>

          <v-form ref="creditFormRef" @submit.prevent="submitAddCredit">
            <v-text-field
              v-model.number="creditForm.amount"
              :label="`${t('customer.amount')} (R$)`"
              type="number"
              min="0.01"
              step="0.01"
              variant="outlined"
              prepend-inner-icon="mdi-currency-brl"
              :rules="[rules.required, rules.positive]"
              class="mb-3"
            />
            <v-text-field
              v-model="creditForm.description"
              :label="`${t('customer.description')} (${t('common.details').toLowerCase()})`"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              placeholder="Ex: Recarga de créditos"
            />
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="closeCreditDialog">{{ t('common.cancel') }}</v-btn>
          <v-btn
            color="success"
            variant="flat"
            :loading="customerStore.loading"
            @click="submitAddCredit"
          >
            {{ t('customer.addCredit') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Balance History Dialog ─── -->
    <v-dialog v-model="historyDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4 bg-info text-white d-flex align-center">
          <v-icon class="mr-2">mdi-history</v-icon>
          {{ t('customer.balanceHistory') }}
          <span v-if="selectedCustomer" class="text-body-1 ml-2 opacity-80">
            — {{ selectedCustomer.name }}
          </span>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-alert
            v-if="selectedCustomer"
            type="info"
            variant="tonal"
            density="compact"
            class="ma-4 mb-0"
          >
            {{ t('customer.balance') }}:
            <strong>{{ formatCurrency(selectedCustomer.balance || 0) }}</strong>
          </v-alert>

          <div v-if="customerStore.loading" class="d-flex justify-center pa-8">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <div
            v-else-if="customerStore.balanceHistory.length === 0"
            class="text-center pa-8 text-medium-emphasis"
          >
            <v-icon size="48" class="mb-3">mdi-history</v-icon>
            <p>{{ t('common.noData') }}</p>
          </div>

          <v-list v-else lines="two" class="pa-2">
            <v-list-item
              v-for="tx in customerStore.balanceHistory"
              :key="tx.id"
              :prepend-icon="tx.type === 'credit' ? 'mdi-arrow-up-circle' : 'mdi-arrow-down-circle'"
              :base-color="tx.type === 'credit' ? 'success' : 'error'"
              class="rounded mb-1"
            >
              <template #title>
                <span :class="tx.type === 'credit' ? 'text-success' : 'text-error'">
                  {{ tx.type === 'credit' ? '+' : '-' }}
                  {{ formatCurrency(Math.abs(tx.amount)) }}
                </span>
              </template>
              <template #subtitle>
                <span>{{ tx.description || '—' }}</span>
                <span class="ml-3 text-medium-emphasis">{{ formatDate(tx.createdAt) }}</span>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="historyDialog = false">{{ t('common.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Create / Edit Dialog ─── -->
    <v-dialog v-model="formDialog" max-width="520" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white">
          <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-account-plus' }}</v-icon>
          {{ isEditing ? t('customer.edit') : t('customer.new') }}
        </v-card-title>

        <v-card-text class="pa-4">
          <v-form ref="formRef" @submit.prevent="submitForm">
            <v-row dense>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  :label="t('customer.name')"
                  variant="outlined"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.cpf"
                  :label="t('customer.cpf')"
                  variant="outlined"
                  :disabled="isEditing"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.studentId"
                  :label="t('customer.studentId')"
                  variant="outlined"
                  :rules="isEditing ? [] : [rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  :label="t('customer.email')"
                  type="email"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.phone"
                  :label="t('customer.phone')"
                  variant="outlined"
                />
              </v-col>
              <v-col v-if="!isEditing" cols="12" sm="6">
                <v-text-field
                  v-model.number="form.initialBalance"
                  :label="`${t('customer.balance')} inicial (R$)`"
                  type="number"
                  min="0"
                  step="0.01"
                  variant="outlined"
                  prepend-inner-icon="mdi-currency-brl"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0">
          <v-spacer />
          <v-btn variant="text" @click="closeFormDialog">{{ t('common.cancel') }}</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="customerStore.loading"
            @click="submitForm"
          >
            {{ t('common.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ─── Delete Confirm Dialog ─── -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-4">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          {{ t('customer.delete') }}
        </v-card-title>
        <v-card-text>
          {{ t('customer.deleteConfirm') }}
          <strong v-if="selectedCustomer"> {{ selectedCustomer.name }}</strong>?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">{{ t('common.cancel') }}</v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="customerStore.loading"
            @click="confirmDelete"
          >
            {{ t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomerStore } from '@/store/customer'
import { useAuthStore } from '@/store/auth'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/shared/utils/formatters'
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/domain/entities/Customer'

const { t } = useI18n()
const customerStore = useCustomerStore()
const authStore = useAuthStore()
const { success, error: showError } = useNotification()

// ─── Table ───────────────────────────────────────────────────────────────────
const search = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')

const statusOptions = computed(() => [
  { label: t('person.all'), value: 'all' },
  { label: t('common.active'), value: 'active' },
  { label: t('common.inactive'), value: 'inactive' },
])

const headers = computed(() => [
  { title: t('customer.name'), key: 'name', sortable: true },
  { title: t('customer.studentId'), key: 'studentId', sortable: false },
  { title: t('customer.cpf'), key: 'cpf', sortable: false },
  { title: t('customer.balance'), key: 'balance', sortable: true, align: 'end' as const },
  { title: t('common.status'), key: 'active', sortable: true, align: 'center' as const },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'end' as const },
])

const filteredCustomers = computed(() => {
  let items = customerStore.customers

  if (statusFilter.value === 'active') items = items.filter((c) => c.active)
  else if (statusFilter.value === 'inactive') items = items.filter((c) => !c.active)

  if (!search.value) return items

  const q = search.value.toLowerCase()
  return items.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.cpf?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.studentId?.toLowerCase().includes(q),
  )
})

// ─── Add Credit ──────────────────────────────────────────────────────────────
const creditDialog = ref(false)
const creditFormRef = ref()
const selectedCustomer = ref<Customer | null>(null)
const creditForm = ref({ amount: null as number | null, description: '' })

function openAddCreditDialog(customer: Customer) {
  selectedCustomer.value = customer
  creditForm.value = { amount: null, description: '' }
  creditDialog.value = true
}

function closeCreditDialog() {
  creditDialog.value = false
  selectedCustomer.value = null
}

async function submitAddCredit() {
  const { valid } = await creditFormRef.value?.validate()
  if (!valid) return
  if (!selectedCustomer.value || !creditForm.value.amount) return

  try {
    await customerStore.addCredit(selectedCustomer.value.id, {
      amount: creditForm.value.amount,
      description: creditForm.value.description || undefined,
    })
    success(t('customer.creditAddSuccess'))
    closeCreditDialog()
    await customerStore.fetchCustomers({ limit: 100 })
  } catch (err: any) {
    showError(err.message || t('error.generic'))
  }
}

// ─── Balance History ─────────────────────────────────────────────────────────
const historyDialog = ref(false)

async function openHistoryDialog(customer: Customer) {
  selectedCustomer.value = customer
  historyDialog.value = true
  try {
    await customerStore.fetchBalanceHistory(customer.id)
  } catch (err: any) {
    showError(err.message || t('error.generic'))
  }
}

// ─── Create / Edit ────────────────────────────────────────────────────────────
const formDialog = ref(false)
const formRef = ref()
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const form = ref<{
  name: string
  cpf: string
  email: string
  phone: string
  studentId: string
  initialBalance: number | null
}>({
  name: '',
  cpf: '',
  email: '',
  phone: '',
  studentId: '',
  initialBalance: null,
})

function openCreateDialog() {
  isEditing.value = false
  editingId.value = null
  form.value = { name: '', cpf: '', email: '', phone: '', studentId: '', initialBalance: null }
  formDialog.value = true
}

function openEditDialog(customer: Customer) {
  isEditing.value = true
  editingId.value = customer.id
  form.value = {
    name: customer.name,
    cpf: customer.cpf,
    email: customer.email || '',
    phone: customer.phone || '',
    studentId: customer.studentId,
    initialBalance: null,
  }
  formDialog.value = true
}

function closeFormDialog() {
  formDialog.value = false
}

async function submitForm() {
  const { valid } = await formRef.value?.validate()
  if (!valid) return

  try {
    if (isEditing.value && editingId.value) {
      const updateData: UpdateCustomerDTO = {
        name: form.value.name,
        email: form.value.email || undefined,
        phone: form.value.phone || undefined,
        studentId: form.value.studentId,
      }
      await customerStore.updateCustomer(editingId.value, updateData)
      success(t('customer.updateSuccess'))
    } else {
      const createData: CreateCustomerDTO = {
        name: form.value.name,
        cpf: form.value.cpf,
        email: form.value.email,
        phone: form.value.phone,
        studentId: form.value.studentId,
        initialBalance: form.value.initialBalance ?? undefined,
      }
      await customerStore.createCustomer(createData)
      success(t('customer.createSuccess'))
    }
    closeFormDialog()
  } catch (err: any) {
    showError(err.message || t('error.generic'))
  }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteDialog = ref(false)

function openDeleteDialog(customer: Customer) {
  selectedCustomer.value = customer
  deleteDialog.value = true
}

async function confirmDelete() {
  if (!selectedCustomer.value) return
  try {
    await customerStore.deleteCustomer(selectedCustomer.value.id)
    success(t('customer.deleteSuccess'))
    deleteDialog.value = false
  } catch (err: any) {
    showError(err.message || t('error.generic'))
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────
const rules = {
  required: (v: any) => !!v || t('validation.required'),
  positive: (v: number) => v > 0 || t('validation.positive'),
}

// ─── Formatters ──────────────────────────────────────────────────────────────
function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    await customerStore.fetchCustomers({ limit: 100 })
  } catch (err: any) {
    showError(err.message || t('error.generic'))
  }
})
</script>
