<template>
  <v-container
    fluid
    class="pdv-page pa-0"
    :style="mdAndUp ? 'height: 100vh; overflow: hidden;' : ''"
  >
    <!-- ═══════════════════════════════════════════════════════════════
         DESKTOP LAYOUT (md+): products left | cart right
    ═══════════════════════════════════════════════════════════════ -->
    <v-row v-if="mdAndUp" no-gutters style="height: 100%">
      <!-- Products Grid -->
      <v-col cols="12" md="8" class="pa-4" style="height: 100%; overflow-y: auto">
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

        <v-row v-if="filteredProducts.length > 0">
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="6"
            sm="4"
            md="4"
            lg="3"
          >
            <v-card class="product-card" elevation="2" hover @click="addToCart(product)">
              <v-card-text class="text-center pa-3">
                <v-icon size="40" color="primary" class="mb-2">mdi-package-variant</v-icon>
                <div class="text-subtitle-2 font-weight-bold mb-1 text-truncate">
                  {{ product.name }}
                </div>
                <div class="text-h6 text-primary">
                  {{ formatCurrency(product.price) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card v-else class="text-center pa-8" elevation="0">
          <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
          <p class="text-h6 mt-4">Nenhum produto encontrado</p>
        </v-card>
      </v-col>

      <!-- Cart (Desktop) -->
      <v-col cols="12" md="4" class="cart-section">
        <v-card class="fill-height d-flex flex-column" elevation="4" rounded="0">
          <v-card-title class="text-h6 pa-4 bg-primary text-white flex-grow-0">
            <v-icon class="mr-2">mdi-cart</v-icon>
            Carrinho
            <v-badge
              v-if="totalItems > 0"
              :content="totalItems"
              color="white"
              text-color="primary"
              inline
              class="ml-2"
            />
          </v-card-title>

          <v-divider />

          <!-- Cart Items -->
          <v-card-text class="flex-grow-1 pa-0" style="overflow-y: auto; min-height: 0">
            <div v-if="cart.length === 0" class="text-center pa-8">
              <v-icon size="56" color="grey">mdi-cart-off</v-icon>
              <p class="text-subtitle-1 mt-4 text-medium-emphasis">Carrinho vazio</p>
            </div>
            <v-list v-else lines="two">
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
                  {{ formatCurrency(item.unitPrice) }} × {{ item.quantity }} =
                  {{ formatCurrency(item.unitPrice * item.quantity) }}
                </v-list-item-subtitle>
                <template #append>
                  <div class="d-flex align-center ga-1">
                    <v-btn
                      icon="mdi-minus"
                      size="x-small"
                      variant="tonal"
                      @click="decreaseQuantity(index)"
                    />
                    <span class="mx-1 font-weight-bold">{{ item.quantity }}</span>
                    <v-btn
                      icon="mdi-plus"
                      size="x-small"
                      variant="tonal"
                      @click="increaseQuantity(index)"
                    />
                    <v-btn
                      icon="mdi-delete"
                      size="x-small"
                      variant="tonal"
                      color="error"
                      class="ml-1"
                      @click="removeFromCart(index)"
                    />
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider />

          <div class="flex-grow-0">
            <!-- Customer -->
            <v-card-text class="pa-3">
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
                    <template #subtitle>
                      Saldo: {{ formatCurrency(item.raw.balance || 0) }}
                    </template>
                  </v-list-item>
                </template>
              </v-autocomplete>
            </v-card-text>

            <!-- Payment Method -->
            <v-card-text class="pa-3 pt-0">
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
              />
            </v-card-text>

            <!-- Total -->
            <v-card-text class="pa-3 pt-0 bg-grey-lighten-4">
              <div class="d-flex justify-space-between align-center">
                <span class="text-subtitle-1 font-weight-medium">Total:</span>
                <span class="text-h5 text-primary font-weight-bold">
                  {{ formatCurrency(total) }}
                </span>
              </div>
            </v-card-text>

            <!-- Actions -->
            <v-card-actions class="pa-3 pt-2 ga-2">
              <v-btn
                color="error"
                variant="outlined"
                :disabled="cart.length === 0"
                class="flex-1-1"
                @click="clearCart"
              >
                Limpar
              </v-btn>
              <v-btn
                color="success"
                variant="flat"
                :disabled="cart.length === 0 || !selectedPaymentMethodId"
                :loading="saleStore.loading"
                class="flex-1-1"
                @click="finalizeSale"
              >
                Finalizar
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ═══════════════════════════════════════════════════════════════
         MOBILE LAYOUT (sm-): scrollable products + FAB
    ═══════════════════════════════════════════════════════════════ -->
    <div v-else class="mobile-layout">
      <!-- Search -->
      <div class="pa-3 pb-2">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar produtos..."
          variant="outlined"
          density="comfortable"
          hide-details
          clearable
        />
      </div>

      <!-- Products Grid -->
      <div class="pa-3 pt-1">
        <v-row v-if="filteredProducts.length > 0" dense>
          <v-col v-for="product in filteredProducts" :key="product.id" cols="6" sm="4">
            <v-card class="product-card" elevation="2" hover @click="addToCart(product)">
              <v-card-text class="text-center pa-3">
                <v-icon size="36" color="primary" class="mb-1">mdi-package-variant</v-icon>
                <div class="text-caption font-weight-bold mb-1 text-truncate">
                  {{ product.name }}
                </div>
                <div class="text-subtitle-1 text-primary font-weight-bold">
                  {{ formatCurrency(product.price) }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card v-else class="text-center pa-6" elevation="0">
          <v-icon size="48" color="grey">mdi-package-variant-closed</v-icon>
          <p class="text-subtitle-1 mt-3">Nenhum produto encontrado</p>
        </v-card>

        <!-- Bottom spacer so FAB doesn't cover last product -->
        <div style="height: 90px" />
      </div>

      <!-- FAB: open cart sheet -->
      <v-btn
        position="fixed"
        location="bottom center"
        size="large"
        color="success"
        rounded="pill"
        elevation="6"
        class="mobile-cart-fab"
        @click="cartSheet = true"
      >
        <v-icon class="mr-2">mdi-cart</v-icon>
        <span v-if="cart.length === 0">Carrinho vazio</span>
        <span v-else>
          {{ totalItems }} {{ totalItems === 1 ? 'item' : 'itens' }}
          &nbsp;·&nbsp;
          {{ formatCurrency(total) }}
        </span>
      </v-btn>
    </div>

    <!-- ═══════════════════════════════════════════════════════════════
         MOBILE CART — Bottom Sheet
    ═══════════════════════════════════════════════════════════════ -->
    <v-bottom-sheet v-if="!mdAndUp" v-model="cartSheet" max-height="92dvh">
      <v-card class="d-flex flex-column" style="max-height: 92dvh">
        <!-- Header -->
        <v-card-title class="pa-4 bg-primary text-white flex-grow-0 d-flex align-center">
          <v-icon class="mr-2">mdi-cart</v-icon>
          Carrinho
          <v-badge
            v-if="totalItems > 0"
            :content="totalItems"
            color="white"
            text-color="primary"
            inline
            class="ml-2"
          />
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="text"
            color="white"
            size="small"
            @click="cartSheet = false"
          />
        </v-card-title>

        <v-divider />

        <!-- Cart Items -->
        <v-card-text class="pa-0 flex-grow-1" style="overflow-y: auto; min-height: 0">
          <div v-if="cart.length === 0" class="text-center pa-8">
            <v-icon size="56" color="grey">mdi-cart-off</v-icon>
            <p class="text-subtitle-1 mt-4 text-medium-emphasis">Carrinho vazio</p>
          </div>
          <v-list v-else lines="two">
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
                {{ formatCurrency(item.unitPrice) }} × {{ item.quantity }} =
                {{ formatCurrency(item.unitPrice * item.quantity) }}
              </v-list-item-subtitle>
              <template #append>
                <div class="d-flex align-center ga-1">
                  <v-btn
                    icon="mdi-minus"
                    size="x-small"
                    variant="tonal"
                    @click="decreaseQuantity(index)"
                  />
                  <span class="mx-1 font-weight-bold">{{ item.quantity }}</span>
                  <v-btn
                    icon="mdi-plus"
                    size="x-small"
                    variant="tonal"
                    @click="increaseQuantity(index)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="x-small"
                    variant="tonal"
                    color="error"
                    class="ml-1"
                    @click="removeFromCart(index)"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider />

        <!-- Customer + Payment + Total + Actions -->
        <div class="flex-grow-0">
          <v-card-text class="pa-3">
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
                  <template #subtitle>
                    Saldo: {{ formatCurrency(item.raw.balance || 0) }}
                  </template>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-card-text>

          <v-card-text class="pa-3 pt-0">
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
            />
          </v-card-text>

          <v-card-text class="pa-3 pt-0 bg-grey-lighten-4">
            <div class="d-flex justify-space-between align-center">
              <span class="text-subtitle-1 font-weight-medium">Total:</span>
              <span class="text-h5 text-primary font-weight-bold">
                {{ formatCurrency(total) }}
              </span>
            </div>
          </v-card-text>

          <v-card-actions class="pa-3 pt-2 ga-2">
            <v-btn
              color="error"
              variant="outlined"
              :disabled="cart.length === 0"
              class="flex-1-1"
              @click="clearCart"
            >
              Limpar
            </v-btn>
            <v-btn
              color="success"
              variant="flat"
              size="large"
              :disabled="cart.length === 0 || !selectedPaymentMethodId"
              :loading="saleStore.loading"
              class="flex-1-1"
              @click="finalizeSale"
            >
              Finalizar Venda
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useProductStore } from '@/store/product'
import { useCustomerStore } from '@/store/customer'
import { usePaymentMethodStore } from '@/store/paymentMethod'
import { useSaleStore } from '@/store/sale'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/shared/utils/formatters'
import type { Product } from '@/domain/entities/Product'

// ─── Responsiveness ──────────────────────────────────────────────────────────
const { mdAndUp } = useDisplay()
const cartSheet = ref(false)

// ─── Stores ──────────────────────────────────────────────────────────────────
const productStore = useProductStore()
const customerStore = useCustomerStore()
const paymentMethodStore = usePaymentMethodStore()
const saleStore = useSaleStore()
const { success, error: showError } = useNotification()

// ─── State ───────────────────────────────────────────────────────────────────
const search = ref('')
const cart = ref<
  Array<{
    productId: string
    productName: string
    unitPrice: number
    quantity: number
  }>
>([])
const selectedCustomerId = ref<string | null>(null)
const selectedPaymentMethodId = ref<string>('')

// ─── Computed ─────────────────────────────────────────────────────────────────
const filteredProducts = computed(() => {
  if (!search.value) return productStore.products
  const q = search.value.toLowerCase()
  return productStore.products.filter((p) => p.name.toLowerCase().includes(q))
})

const customers = computed(() => customerStore.customers || [])

const availablePaymentMethods = computed(() => {
  const methods = paymentMethodStore.paymentMethods || []
  return selectedCustomerId.value ? methods : methods.filter((pm) => !pm.requiresAccount)
})

const total = computed(() =>
  cart.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
)

const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))

// ─── Cart actions ─────────────────────────────────────────────────────────────
function addToCart(product: Product) {
  const existing = cart.value.find((i) => i.productId === product.id)
  if (existing) {
    existing.quantity++
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

// ─── Finalize sale ────────────────────────────────────────────────────────────
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
    if (selectedCustomerId.value) {
      saleData.customerId = selectedCustomerId.value
    }

    await saleStore.createSale(saleData)
    success(`Venda realizada! Total: ${formatCurrency(total.value)}`)
    clearCart()
    selectedPaymentMethodId.value = ''
    cartSheet.value = false
  } catch (err: any) {
    showError(err.message || 'Erro ao finalizar venda')
  }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchProducts({ limit: 100 }),
      customerStore.fetchCustomers({ limit: 100 }),
      paymentMethodStore.fetchPaymentMethods(),
    ])

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
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.14) !important;
}

.cart-section {
  background: white;
  border-left: 1px solid #e0e0e0;
  height: 100%;
  overflow: hidden;
}

.cart-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

/* Mobile */
.mobile-layout {
  min-height: 100svh;
  background: #f5f5f5;
}

.mobile-cart-fab {
  bottom: 16px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  min-width: 220px;
}
</style>
