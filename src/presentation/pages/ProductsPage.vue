<template>
  <v-container fluid class="pa-6">
    <!-- Header -->
    <v-row align="center" class="mb-6">
      <v-col>
        <h1 class="text-h4 font-weight-bold">Produtos</h1>
        <p class="text-subtitle-1 text-medium-emphasis mt-2">
          Gerencie o catálogo de produtos
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          @click="openCreateDialog"
        >
          Novo Produto
        </v-btn>
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
              v-model="selectedCategoryId"
              :items="categoryOptions"
              label="Categoria"
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="activeFilter"
              :items="activeFilterOptions"
              label="Status"
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
        :items="filteredProducts"
        :loading="productStore.loading"
        :items-per-page="10"
        class="elevation-0"
      >
        <!-- Name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon class="mr-2" color="primary">mdi-package-variant</v-icon>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-medium-emphasis">{{ item.description }}</div>
            </div>
          </div>
        </template>

        <!-- Category -->
        <template #item.categoryName="{ item }">
          <v-chip size="small" color="secondary" variant="flat">
            {{ item.categoryName || 'Sem categoria' }}
          </v-chip>
        </template>

        <!-- Price -->
        <template #item.price="{ item }">
          <span class="font-weight-bold text-primary">
            {{ formatCurrency(item.price) }}
          </span>
        </template>

        <!-- Barcode -->
        <template #item.barcode="{ item }">
          <span class="text-caption">{{ item.barcode || '-' }}</span>
        </template>

        <!-- Active -->
        <template #item.active="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </v-chip>
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
          <div class="text-center pa-8">
            <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
            <p class="text-h6 mt-4">Nenhum produto encontrado</p>
            <v-btn color="primary" class="mt-2" @click="openCreateDialog">
              Criar Primeiro Produto
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-6">
          {{ isEdit ? 'Editar Produto' : 'Novo Produto' }}
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-6">
          <v-form ref="form" @submit.prevent="saveProduct">
            <v-text-field
              v-model="formData.name"
              label="Nome *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <v-textarea
              v-model="formData.description"
              label="Descrição"
              variant="outlined"
              density="comfortable"
              rows="2"
              class="mb-4"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.price"
                  label="Preço *"
                  :rules="[rules.required, rules.positive]"
                  variant="outlined"
                  density="comfortable"
                  type="number"
                  step="0.01"
                  prefix="R$"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.barcode"
                  label="Código de Barras"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>
            </v-row>

            <v-select
              v-model="formData.categoryId"
              :items="categoryOptions"
              label="Categoria *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
              class="mb-4"
            />

            <!-- Stock Alert Section -->
            <v-card class="mb-4" elevation="0" variant="outlined">
              <v-card-title class="text-subtitle-1 pa-4">
                <v-icon start>mdi-package-variant-closed</v-icon>
                Controle de Estoque
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.minStockAlert"
                      label="Estoque Mínimo"
                      hint="Alertar quando estoque chegar neste valor"
                      persistent-hint
                      variant="outlined"
                      density="comfortable"
                      type="number"
                      min="0"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.maxStockAlert"
                      label="Estoque Máximo"
                      hint="Quantidade máxima recomendada"
                      persistent-hint
                      variant="outlined"
                      density="comfortable"
                      type="number"
                      min="0"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model.number="formData.reorderQuantity"
                      label="Qtd. Reposição"
                      hint="Quantidade sugerida para pedido"
                      persistent-hint
                      variant="outlined"
                      density="comfortable"
                      type="number"
                      min="1"
                    />
                  </v-col>
                </v-row>

                <v-alert
                  v-if="formData.minStockAlert && formData.maxStockAlert && formData.minStockAlert > formData.maxStockAlert"
                  type="warning"
                  variant="tonal"
                  class="mt-4"
                >
                  O estoque mínimo não pode ser maior que o máximo
                </v-alert>
              </v-card-text>
            </v-card>

            <v-switch
              v-model="formData.active"
              label="Produto ativo"
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
            :disabled="productStore.loading"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="saveProduct"
            :loading="productStore.loading"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <confirm-dialog
      v-model="deleteDialog"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
      :loading="productStore.loading"
      @confirm="deleteProduct"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product'
import { useCategoryStore } from '@/store/category'
import { useNotification } from '@/composables/useNotification'
import type { Product, CreateProductDTO } from '@/domain/entities/Product'
import { formatCurrency } from '@/shared/utils/formatters'
import ConfirmDialog from '@/presentation/components/ConfirmDialog.vue'

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const { success, error: showError } = useNotification()

// State
const dialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const currentProduct = ref<Product | null>(null)
const search = ref('')
const selectedCategoryId = ref<string | null>(null)
const activeFilter = ref('all')
const form = ref<any>(null)

const formData = ref<CreateProductDTO & { active: boolean }>({
  name: '',
  description: '',
  price: 0,
  cost: 0,
  categoryId: '',
  barcode: '',
  minStockAlert: 10,
  maxStockAlert: 100,
  reorderQuantity: 50,
  active: true,
})

// Validation rules
const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
  positive: (v: number) => v > 0 || 'Valor deve ser maior que zero',
}

// Filter options
const activeFilterOptions = [
  { title: 'Todos', value: 'all' },
  { title: 'Ativos', value: 'active' },
  { title: 'Inativos', value: 'inactive' },
]

const categoryOptions = computed(() => {
  return categoryStore.categories.map((c) => ({
    title: c.name,
    value: c.id,
  }))
})

// Headers
const headers = [
  { title: 'Produto', key: 'name', sortable: true },
  { title: 'Categoria', key: 'categoryName', sortable: true },
  { title: 'Preço', key: 'price', sortable: true },
  { title: 'Código', key: 'barcode', sortable: false },
  { title: 'Status', key: 'active', sortable: true, align: 'center' as const },
  { title: 'Ações', key: 'actions', sortable: false, align: 'center' as const },
]

// Computed
const filteredProducts = computed(() => {
  let products = productStore.products

  // Filter by search
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.barcode?.toLowerCase().includes(searchLower),
    )
  }

  // Filter by category
  if (selectedCategoryId.value) {
    products = products.filter((p) => p.categoryId === selectedCategoryId.value)
  }

  // Filter by active status
  if (activeFilter.value === 'active') {
    products = products.filter((p) => p.active)
  } else if (activeFilter.value === 'inactive') {
    products = products.filter((p) => !p.active)
  }

  return products
})

// Methods
function openCreateDialog() {
  isEdit.value = false
  formData.value = {
    name: '',
    description: '',
    price: 0,
    cost: 0,
    categoryId: '',
    barcode: '',
    minStockAlert: 10,
    maxStockAlert: 100,
    reorderQuantity: 50,
    active: true,
  }
  dialog.value = true
}

function openEditDialog(product: Product) {
  isEdit.value = true
  currentProduct.value = product
  formData.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    cost: product.cost || 0,
    categoryId: product.categoryId,
    barcode: product.barcode || '',
    minStockAlert: product.minStockAlert || 10,
    maxStockAlert: product.maxStockAlert || 100,
    reorderQuantity: product.reorderQuantity || 50,
    active: product.active,
  }
  dialog.value = true
}

function closeDialog() {
  dialog.value = false
  form.value?.reset()
  currentProduct.value = null
}

async function saveProduct() {
  const valid = await form.value?.validate()
  if (!valid?.valid) return

  try {
    if (isEdit.value && currentProduct.value) {
      await productStore.updateProduct(currentProduct.value.id, formData.value)
      success('Produto atualizado com sucesso!')
    } else {
      await productStore.createProduct(formData.value)
      success('Produto criado com sucesso!')
    }
    closeDialog()
  } catch (err: any) {
    showError(err.message || 'Erro ao salvar produto')
  }
}

function confirmDelete(product: Product) {
  currentProduct.value = product
  deleteDialog.value = true
}

async function deleteProduct() {
  if (!currentProduct.value) return

  try {
    await productStore.deleteProduct(currentProduct.value.id)
    success('Produto deletado com sucesso!')
    deleteDialog.value = false
    currentProduct.value = null
  } catch (err: any) {
    showError(err.message || 'Erro ao deletar produto')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchProducts({ limit: 100 }),
      categoryStore.fetchCategories({ limit: 100 }),
    ])
  } catch (err: any) {
    showError(err.message || 'Erro ao carregar dados')
  }
})
</script>
