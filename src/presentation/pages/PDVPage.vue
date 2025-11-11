<template>
  <v-container fluid class="pdv-page pa-0" style="height: 100vh">
    <v-row no-gutters style="height: 100%">
      <!-- Products Grid -->
      <v-col cols="12" md="8" class="pa-4" style="height: 100%; overflow-y: auto">
        <!-- Search Bar -->
        <v-card class="mb-4" elevation="2">
          <v-card-text>
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Buscar produtos..."
              variant="outlined"
              density="comfortable"
              hide-details
              clearable
              autofocus
            />
          </v-card-text>
        </v-card>

        <!-- Products Grid -->
        <v-row v-if="filteredProducts.length > 0">
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="6"
            sm="4"
            md="3"
          >
            <v-card
              class="product-card"
              elevation="2"
              hover
              @click="addToCart(product)"
            >
              <v-card-text class="text-center pa-4">
                <v-icon size="48" color="primary" class="mb-2">
                  mdi-package-variant
                </v-icon>
                <div class="text-subtitle-2 font-weight-bold mb-1">
                  {{ product.name }}
                </div>
                <div class="text-h6 text-primary">
                  {{ formatCurrency(product.price) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- No Products -->
        <v-card v-else class="text-center pa-8" elevation="0">
          <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
          <p class="text-h6 mt-4">Nenhum produto encontrado</p>
        </v-card>
      </v-col>

      <!-- Cart -->
      <v-col cols="12" md="4" class="cart-section">
        <v-card class="fill-height d-flex flex-column" elevation="4">
          <v-card-title class="text-h5 pa-4 bg-primary">
            <v-icon class="mr-2">mdi-cart</v-icon>
            Carrinho
          </v-card-title>

          <v-divider />

          <!-- Cart Items -->
          <v-card-text class="flex-grow-1 pa-0" style="overflow-y: auto">
            <v-list v-if="cart.length > 0" lines="two">
              <v-list-item
                v-for="(item, index) in cart"
                :key="index"
                class="cart-item"
              >
                <template #prepend>
                  <v-icon color="primary">mdi-package-variant</v-icon>
                </template>

                <v-list-item-title>{{ item.productName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatCurrency(item.unitPrice) }} x {{ item.quantity }}
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center">
                    <v-btn
                      icon="mdi-minus"
                      size="x-small"
                      variant="text"
                      @click="decreaseQuantity(index)"
                    />
                    <span class="mx-2 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      size="x-small"
                      variant="text"
                      @click="increaseQuantity(index)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      variant="text"
                      color="error"
                      class="ml-2"
                      @click="removeFromCart(index)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>

            <div v-else class="text-center pa-8">
              <v-icon size="64" color="grey">mdi-cart-off</v-icon>
              <p class="text-subtitle-1 mt-4">Carrinho vazio</p>
            </div>
          </v-card-text>

          <v-divider />

          <!-- Customer Selection -->
          <v-card-text class="pa-4">
            <v-autocomplete
              v-model="selectedCustomerId"
              :items="customers"
              item-title="name"
              item-value="id"
              label="Cliente (opcional)"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              density="comfortable"
              clearable
              hide-details
            >
              <template #item="{ props, item }">
                <v-list-item v-bind="props">
                  <template #prepend>
                    <v-icon>mdi-account</v-icon>
                  </template>
                  <template #subtitle>
                    Saldo: {{ formatCurrency(item.raw.balance || 0) }}
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-card-text>

          <v-divider />

          <!-- Payment Method -->
          <v-card-text class="pa-4">
            <v-select
              v-model="selectedPaymentMethodId"
              :items="availablePaymentMethods"
              item-title="displayName"
              item-value="id"
              label="Método de Pagamento"
              prepend-inner-icon="mdi-credit-card"
              variant="outlined"
              density="comfortable"
              hide-details
              :rules="[rules.required]"
            />
          </v-card-text>

          <v-divider />

          <!-- Total -->
          <v-card-text class="pa-4 bg-grey-lighten-4">
            <div class="d-flex justify-space-between align-center">
              <span class="text-h6">Total:</span>
              <span class="text-h4 text-primary font-weight-bold">
                {{ formatCurrency(total) }}
              </span>
            </div>
          </v-card-text>

          <!-- Actions -->
          <v-card-actions class="pa-4">
            <v-btn
              block
              size="x-large"
              color="error"
              variant="outlined"
              @click="clearCart"
              :disabled="cart.length === 0"
            >
              Limpar
            </v-btn>
            <v-btn
              block
              size="x-large"
              color="success"
              variant="flat"
              @click="finalizeSale"
              :disabled="cart.length === 0 || !selectedPaymentMethodId"
              :loading="saleStore.loading"
            >
              Finalizar Venda
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/store/product'
import { useCustomerStore } from '@/store/customer'
import { usePaymentMethodStore } from '@/store/paymentMethod'
import { useSaleStore } from '@/store/sale'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/shared/utils/formatters'
import type { Product } from '@/domain/entities/Product'

const productStore = useProductStore()
const customerStore = useCustomerStore()
const paymentMethodStore = usePaymentMethodStore()
const saleStore = useSaleStore()
const { success, error: showError } = useNotification()

// State
const search = ref('')
const cart = ref<Array<{
  productId: string
  productName: string
  unitPrice: number
  quantity: number
}>>([])
const selectedCustomerId = ref<string | null>(null)
const selectedPaymentMethodId = ref<string>('')

// Validation
const rules = {
  required: (v: any) => !!v || 'Campo obrigatório',
}

// Computed
const filteredProducts = computed(() => {
  if (!search.value) return productStore.products

  const searchLower = search.value.toLowerCase()
  return productStore.products.filter((p) =>
    p.name.toLowerCase().includes(searchLower),
  )
})

const customers = computed(() => customerStore.customers)

const availablePaymentMethods = computed(() => {
  // If customer is selected, show all methods
  // If no customer, hide "account" method
  if (selectedCustomerId.value) {
    return paymentMethodStore.paymentMethods
  }
  return paymentMethodStore.paymentMethods.filter((pm) => !pm.requiresAccount)
})

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
})

// Methods
function addToCart(product: Product) {
  const existingItem = cart.value.find((item) => item.productId === product.id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: 1,
    })
  }
}

function increaseQuantity(index: number) {
  cart.value[index].quantity++
}

function decreaseQuantity(index: number) {
  if (cart.value[index].quantity > 1) {
    cart.value[index].quantity--
  } else {
    removeFromCart(index)
  }
}

function removeFromCart(index: number) {
  cart.value.splice(index, 1)
}

function clearCart() {
  cart.value = []
  selectedCustomerId.value = null
}

async function finalizeSale() {
  if (cart.value.length === 0) {
    showError('Carrinho vazio')
    return
  }

  if (!selectedPaymentMethodId.value) {
    showError('Selecione um método de pagamento')
    return
  }

  try {
    const saleData: any = {
      paymentMethodId: selectedPaymentMethodId.value,
      items: cart.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    // Add customer if selected
    if (selectedCustomerId.value) {
      saleData.customerId = selectedCustomerId.value
    }

    await saleStore.createSale(saleData)

    success(`Venda realizada com sucesso! Total: ${formatCurrency(total.value)}`)

    // Clear cart and selections
    clearCart()
    selectedPaymentMethodId.value = ''
  } catch (err: any) {
    showError(err.message || 'Erro ao finalizar venda')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchProducts({ limit: 100 }), // Load many products for PDV
      customerStore.fetchCustomers(),
      paymentMethodStore.fetchPaymentMethods(),
    ])

    // Set default payment method (cash)
    const cashMethod = paymentMethodStore.getPaymentMethodByName('cash')
    if (cashMethod) {
      selectedPaymentMethodId.value = cashMethod.id
    }
  } catch (err: any) {
    showError(err.message || 'Erro ao carregar dados')
  }
})
</script>

<style scoped>
.pdv-page {
  background: #f5f5f5;
}

.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
}

.cart-section {
  background: white;
  border-left: 1px solid #e0e0e0;
}

.cart-item {
  border-bottom: 1px solid #e0e0e0;
}
</style>
