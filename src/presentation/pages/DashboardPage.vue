<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ t('dashboard.welcome') }}, {{ authStore.user?.name }}!
        </h1>
      </v-col>
    </v-row>

    <!-- Stats Cards -->
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="primary" size="56">
                <v-icon size="32">mdi-cash-multiple</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ formatCurrency(todaySales) }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('dashboard.todaySales') }}
                </div>
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
                <v-icon size="32">mdi-account-group</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ totalCustomers }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('dashboard.totalCustomers') }}
                </div>
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
                <div class="text-caption text-medium-emphasis">
                  {{ t('dashboard.lowStockItems') }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center">
              <v-avatar color="info" size="56">
                <v-icon size="32">mdi-cart</v-icon>
              </v-avatar>
              <div class="ml-4">
                <div class="text-h6">{{ totalSalesToday }}</div>
                <div class="text-caption text-medium-emphasis">
                  {{ t('dashboard.recentSales') }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card>
          <v-card-title>{{ t('dashboard.quickActions') }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn block color="primary" size="large" to="/pdv">
                  <v-icon start>mdi-cash-register</v-icon>
                  Abrir PDV
                </v-btn>
              </v-col>
              <v-col v-if="authStore.canManageProducts" cols="12" sm="6" md="3">
                <v-btn block color="secondary" size="large" to="/products">
                  <v-icon start>mdi-package-variant</v-icon>
                  Produtos
                </v-btn>
              </v-col>
              <v-col v-if="authStore.canManageInventory" cols="12" sm="6" md="3">
                <v-btn block color="warning" size="large" to="/inventory">
                  <v-icon start>mdi-warehouse</v-icon>
                  Estoque
                </v-btn>
              </v-col>
              <v-col v-if="authStore.canManageProducts" cols="12" sm="6" md="3">
                <v-btn block color="success" size="large" to="/people">
                  <v-icon start>mdi-account-group</v-icon>
                  Pessoas
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Sales -->
    <v-row v-if="authStore.canManageSales" class="mt-4">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>{{ t('dashboard.recentSales') }}</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="salesHeaders"
              :items="recentSales"
              :loading="loading"
              :items-per-page="5"
              density="comfortable"
            >
              <template #item.total="{ item }">
                {{ formatCurrency(item.totalAmount) }}
              </template>
              <template #item.createdAt="{ item }">
                {{ formatDateTime(item.createdAt) }}
              </template>
              <template #item.status="{ item }">
                <v-chip :color="getStatusColor(item.status)" size="small">
                  {{ t(`saleStatus.${item.status}`) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Low Stock Items -->
      <v-col v-if="authStore.canManageInventory" cols="12" md="4">
        <v-card>
          <v-card-title>{{ t('inventory.lowStock') }}</v-card-title>
          <v-card-text>
            <v-list v-if="lowStockItems.length > 0">
              <v-list-item
                v-for="item in lowStockItems"
                :key="item.productId"
                :title="item.productName"
                :subtitle="`${t('inventory.quantity')}: ${item.quantity}`"
              >
                <template #prepend>
                  <v-icon color="warning">mdi-alert</v-icon>
                </template>
              </v-list-item>
            </v-list>
            <v-alert v-else type="success">
              {{ t('common.noData') }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/store/auth'
import { useSaleStore } from '@/store/sale'
import { useCustomerStore } from '@/store/customer'
import { useInventoryStore } from '@/store/inventory'
import { formatCurrency, formatDateTime } from '@/shared/utils/formatters'
import { SALE_STATUS_COLORS } from '@/shared/constants'

const { t } = useI18n()
const authStore = useAuthStore()
const saleStore = useSaleStore()
const customerStore = useCustomerStore()
const inventoryStore = useInventoryStore()

const loading = ref(false)
const todaySales = ref(0)
const totalCustomers = ref(0)
const lowStockCount = ref(0)
const totalSalesToday = ref(0)

const recentSales = computed(() => saleStore.sales.slice(0, 5))
const lowStockItems = computed(() => inventoryStore.lowStockItems.slice(0, 5))

const salesHeaders = [
  { title: t('sale.customer'), key: 'customerName' },
  { title: t('sale.total'), key: 'total' },
  { title: t('sale.date'), key: 'createdAt' },
  { title: t('sale.status'), key: 'status' },
]

function getStatusColor(status: string) {
  return SALE_STATUS_COLORS[status as keyof typeof SALE_STATUS_COLORS]
}

onMounted(async () => {
  loading.value = true
  try {
    // Carregar dados do dashboard
    if (authStore.canManageSales) {
      await saleStore.fetchSales({ page: 1, limit: 10 })
      totalSalesToday.value = saleStore.pagination.total

      // Calcular total de vendas de hoje
      const today = new Date().toISOString().split('T')[0]
      const todaySalesData = saleStore.sales.filter((s) =>
        s.createdAt.startsWith(today),
      )
      todaySales.value = todaySalesData.reduce((acc, s) => acc + s.totalAmount, 0)
    }

    if (authStore.canManageProducts) {
      await customerStore.fetchCustomers({ page: 1, limit: 1 })
      totalCustomers.value = customerStore.pagination.total
    }

    if (authStore.canManageInventory) {
      await inventoryStore.fetchLowStockItems()
      lowStockCount.value = inventoryStore.lowStockItems.length
    }
  } finally {
    loading.value = false
  }
})
</script>
