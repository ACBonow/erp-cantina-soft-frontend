<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Estoque</h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          Controle de inventário e movimentações
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus-box"
          size="large"
          @click="openAddStockDialog"
        >
          Adicionar Estoque
        </v-btn>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="primary" size="56">
                <v-icon size="32">mdi-package-variant</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ inventoryItems.length }}</div>
                <div class="text-caption text-medium-emphasis">Total de Itens</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="warning" size="56">
                <v-icon size="32">mdi-alert</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ lowStockCount }}</div>
                <div class="text-caption text-medium-emphasis">Estoque Baixo</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="success" size="56">
                <v-icon size="32">mdi-check-circle</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ sufficientStockCount }}</div>
                <div class="text-caption text-medium-emphasis">Estoque OK</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="error" size="56">
                <v-icon size="32">mdi-package-variant-remove</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ excessStockCount }}</div>
                <div class="text-caption text-medium-emphasis">Excesso</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar produtos..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusFilterOptions"
              label="Status do Estoque"
              variant="outlined"
              density="comfortable"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              block
              color="secondary"
              prepend-icon="mdi-alert"
              @click="filterLowStock"
            >
              Ver Estoque Baixo
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredInventory"
        :loading="inventoryStore.loading"
        :items-per-page="15"
        class="elevation-0"
      >
        <!-- Product -->
        <template #item.productName="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-package-variant</v-icon>
            <span class="font-weight-medium">{{ item.productName }}</span>
          </div>
        </template>

        <!-- Quantity -->
        <template #item.quantity="{ item }">
          <v-chip
            :color="getQuantityColor(item)"
            size="small"
            variant="flat"
          >
            {{ item.quantity }}
          </v-chip>
        </template>

        <!-- Min/Max -->
        <template #item.minMax="{ item }">
          <span class="text-caption">
            Min: {{ item.minQuantity }} / Max: {{ item.maxQuantity }}
          </span>
        </template>

        <!-- Stock Alert -->
        <template #item.stockAlert="{ item }">
          <stock-badge
            :current-stock="item.quantity"
            :min-stock-alert="item.minStockAlert"
            :max-stock-alert="item.maxStockAlert"
          />
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            {{ getStatusText(item.status) }}
          </v-chip>
        </template>

        <!-- Updated At -->
        <template #item.updatedAt="{ item }">
          <span class="text-caption">{{ formatDate(item.updatedAt) }}</span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-plus-box"
            size="small"
            variant="text"
            color="success"
            @click="openAddStockDialogFor(item)"
          />
          <v-btn
            icon="mdi-history"
            size="small"
            variant="text"
            color="info"
            @click="viewMovements(item)"
          />
        </template>

        <!-- Loading -->
        <template #loading>
          <v-skeleton-loader type="table-row@5" />
        </template>

        <!-- No data -->
        <template #no-data>
          <div class="text-center pa-8">
            <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
            <p class="text-h6 mt-4">Nenhum item no estoque</p>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add Stock Dialog -->
    <v-dialog v-model="addStockDialog" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Adicionar Estoque
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-form ref="addStockForm">
            <v-autocomplete
              v-model="addStockData.productId"
              :items="productOptions"
              label="Produto *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <v-text-field
              v-model.number="addStockData.quantity"
              label="Quantidade *"
              :rules="[rules.required, rules.positive]"
              variant="outlined"
              density="comfortable"
              type="number"
              min="1"
              class="mb-4"
            />

            <v-textarea
              v-model="addStockData.reason"
              label="Motivo *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              rows="2"
              placeholder="Ex: Compra de fornecedor, Reposição..."
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeAddStockDialog"
            :disabled="inventoryStore.loading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="addStock"
            :loading="inventoryStore.loading"
          >
            Adicionar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Movements Dialog -->
    <v-dialog v-model="movementsDialog" max-width="800">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Histórico de Movimentações
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-list v-if="movements.length > 0">
            <v-list-item
              v-for="(movement, index) in movements"
              :key="index"
              class="mb-2"
            >
              <template #prepend>
                <v-icon :color="movement.type === 'in' ? 'success' : 'error'">
                  {{ movement.type === 'in' ? 'mdi-plus-circle' : 'mdi-minus-circle' }}
                </v-icon>
              </template>

              <v-list-item-title>
                {{ movement.type === 'in' ? 'Entrada' : 'Saída' }} de {{ movement.quantity }} unidades
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ movement.reason }} • {{ formatDate(movement.createdAt) }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
          <v-alert v-else type="info">
            Nenhuma movimentação registrada
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-6">
          <v-spacer />
          <v-btn variant="text" @click="movementsDialog = false">
            Fechar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '@/store/inventory'
import { useProductStore } from '@/store/product'
import { useNotification } from '@/composables/useNotification'
import type { Inventory, InventoryMovement } from '@/domain/entities/Inventory'
import { formatDate } from '@/shared/utils/formatters'
import StockBadge from '@/presentation/components/StockBadge.vue'

const inventoryStore = useInventoryStore()
const productStore = useProductStore()
const { success, error: showError } = useNotification()

// State
const addStockDialog = ref(false)
const movementsDialog = ref(false)
const search = ref('')
const statusFilter = ref('all')
const addStockForm = ref<any>(null)
const movements = ref<InventoryMovement[]>([])

const addStockData = ref({
  productId: '',
  quantity: 1,
  reason: '',
})

// Validation rules
const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  positive: (v: number) => v > 0 || 'Quantidade deve ser maior que zero',
}

// Filter options
const statusFilterOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Estoque Baixo', value: 'low' },
  { title: 'Estoque OK', value: 'sufficient' },
  { title: 'Excesso', value: 'excess' },
]

const productOptions = computed(() => {
  return productStore.products.map((p) => ({
    title: p.name,
    value: p.id,
  }))
})

// Map products with their alert settings
const productsMap = computed(() => {
  const map = new Map()
  productStore.products.forEach(product => {
    map.set(product.id, product)
  })
  return map
})

// Enrich inventory items with product alert data
const enrichedInventoryItems = computed(() => {
  return (inventoryStore.inventoryItems || []).map(item => {
    const product = productsMap.value.get(item.productId)
    return {
      ...item,
      minStockAlert: product?.minStockAlert || 10,
      maxStockAlert: product?.maxStockAlert || 100,
      reorderQuantity: product?.reorderQuantity || 50,
    }
  })
})

// Headers
const headers = [
  { title: 'Produto', key: 'productName', sortable: true },
  { title: 'Quantidade', key: 'quantity', sortable: true },
  { title: 'Min / Max', key: 'minMax', sortable: false },
  { title: 'Alerta Estoque', key: 'stockAlert', sortable: false },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Atualizado em', key: 'updatedAt', sortable: true },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const },
]

// Computed
const inventoryItems = computed(() => inventoryStore.inventoryItems || [])

const filteredInventory = computed(() => {
  let items = enrichedInventoryItems.value

  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    items = items.filter((i) => i.productName?.toLowerCase().includes(searchLower))
  }

  // Filter by status
  if (statusFilter.value !== 'all') {
    items = items.filter((i) => i.status === statusFilter.value)
  }

  return items
})

const lowStockCount = computed(() => {
  return inventoryItems.value.filter((i) => i.status === 'low').length
})

const sufficientStockCount = computed(() => {
  return inventoryItems.value.filter((i) => i.status === 'sufficient').length
})

const excessStockCount = computed(() => {
  return inventoryItems.value.filter((i) => i.status === 'excess').length
})

// Methods
function getQuantityColor(item: Inventory) {
  if (item.quantity <= item.minQuantity) return 'error'
  if (item.quantity >= item.maxQuantity) return 'warning'
  return 'success'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'low': return 'error'
    case 'sufficient': return 'success'
    case 'excess': return 'warning'
    default: return 'grey'
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'low': return 'Baixo'
    case 'sufficient': return 'OK'
    case 'excess': return 'Excesso'
    default: return status
  }
}

function filterLowStock() {
  statusFilter.value = 'low'
}

function openAddStockDialog() {
  addStockData.value = {
    productId: '',
    quantity: 1,
    reason: '',
  }
  addStockDialog.value = true
}

function openAddStockDialogFor(item: Inventory) {
  addStockData.value = {
    productId: item.productId,
    quantity: 1,
    reason: '',
  }
  addStockDialog.value = true
}

function closeAddStockDialog() {
  addStockDialog.value = false
  addStockForm.value?.reset()
}

async function addStock() {
  const valid = await addStockForm.value?.validate()
  if (!valid?.valid) return

  try {
    await inventoryStore.addStock(addStockData.value)
    success('Estoque adicionado com sucesso!')
    closeAddStockDialog()
    await inventoryStore.fetchInventory()
  } catch (err: any) {
    showError(err.message || 'Erro ao adicionar estoque')
  }
}

async function viewMovements(item: Inventory) {
  try {
    const response = await inventoryStore.fetchMovements(item.id)
    movements.value = response.movements || []
    movementsDialog.value = true
  } catch (err: any) {
    showError(err.message || 'Erro ao buscar movimentações')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      inventoryStore.fetchInventory(),
      productStore.fetchProducts({ limit: 100 }),
    ])
  } catch (err: any) {
    showError(err.message || 'Erro ao carregar dados')
  }
})
</script>
