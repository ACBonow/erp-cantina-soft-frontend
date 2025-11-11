import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Inventory,
  CreateInventoryDTO,
  UpdateInventoryDTO,
  InventoryMovement,
  InventoryMovementDTO,
  InventoryReport,
  LowStockItem,
} from '@/domain/entities/Inventory'
import type { PaginationParams } from '@/shared/types/api'
import { inventoryRepository } from '@/infrastructure/repositories/InventoryRepository'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const inventoryItems = ref<Inventory[]>([])
  const currentInventory = ref<Inventory | null>(null)
  const lowStockItems = ref<LowStockItem[]>([])
  const movements = ref<InventoryMovement[]>([])
  const report = ref<InventoryReport | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Helper function to calculate status
  function calculateStatus(item: Inventory): 'low' | 'sufficient' | 'excess' {
    if (item.quantity <= item.minQuantity) {
      return 'low'
    } else if (item.quantity >= item.maxQuantity) {
      return 'excess'
    }
    return 'sufficient'
  }

  // Actions
  async function fetchInventory(params?: PaginationParams) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryRepository.getAll(params)
      // Add status to each item
      inventoryItems.value = response.data.map(item => ({
        ...item,
        status: calculateStatus(item)
      }))
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchInventoryByProductId(productId: string) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.getByProductId(productId)
      currentInventory.value = inventory
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchLowStockItems() {
    loading.value = true
    error.value = null
    try {
      lowStockItems.value = await inventoryRepository.getLowStockItems()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar itens com estoque baixo'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addStock(data: any) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.addStock(data)
      const inventoryWithStatus = {
        ...inventory,
        status: calculateStatus(inventory)
      }
      const index = inventoryItems.value.findIndex((i) => i.productId === data.productId)
      if (index !== -1) {
        inventoryItems.value[index] = inventoryWithStatus
      } else {
        inventoryItems.value.unshift(inventoryWithStatus)
      }
      if (currentInventory.value?.productId === data.productId) {
        currentInventory.value = inventoryWithStatus
      }
      return inventoryWithStatus
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao adicionar estoque'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchInventoryReport() {
    loading.value = true
    error.value = null
    try {
      report.value = await inventoryRepository.getReport()
      return report.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar relatório'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createInventory(data: CreateInventoryDTO) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.create(data)
      inventoryItems.value.unshift(inventory)
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateInventory(id: string, data: UpdateInventoryDTO) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.update(id, data)
      const index = inventoryItems.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        inventoryItems.value[index] = inventory
      }
      if (currentInventory.value?.id === id) {
        currentInventory.value = inventory
      }
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function restockInventory(data: InventoryMovementDTO) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.restock(data)
      const index = inventoryItems.value.findIndex((i) => i.id === data.inventoryId)
      if (index !== -1) {
        inventoryItems.value[index] = inventory
      }
      if (currentInventory.value?.id === data.inventoryId) {
        currentInventory.value = inventory
      }
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao reabastecer inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function adjustInventory(data: InventoryMovementDTO) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.adjust(data)
      const index = inventoryItems.value.findIndex((i) => i.id === data.inventoryId)
      if (index !== -1) {
        inventoryItems.value[index] = inventory
      }
      if (currentInventory.value?.id === data.inventoryId) {
        currentInventory.value = inventory
      }
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao ajustar inventário'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function registerLoss(data: InventoryMovementDTO) {
    loading.value = true
    error.value = null
    try {
      const inventory = await inventoryRepository.registerLoss(data)
      const index = inventoryItems.value.findIndex((i) => i.id === data.inventoryId)
      if (index !== -1) {
        inventoryItems.value[index] = inventory
      }
      if (currentInventory.value?.id === data.inventoryId) {
        currentInventory.value = inventory
      }
      return inventory
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao registrar perda'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMovements(inventoryId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryRepository.getMovements(inventoryId)
      movements.value = response.movements
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar movimentações'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    inventoryItems,
    currentInventory,
    lowStockItems,
    movements,
    report,
    loading,
    error,
    pagination,
    // Actions
    fetchInventory,
    fetchInventoryByProductId,
    fetchLowStockItems,
    fetchInventoryReport,
    createInventory,
    updateInventory,
    addStock,
    restockInventory,
    adjustInventory,
    registerLoss,
    fetchMovements,
  }
})
