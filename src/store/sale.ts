import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Sale, CreateSaleDTO, SalesSummary } from '@/domain/entities/Sale'
import type { SaleQueryParams } from '@/domain/repositories/ISaleRepository'
import type { DateRangeParams } from '@/shared/types/api'
import { saleRepository } from '@/infrastructure/repositories/SaleRepository'

export const useSaleStore = defineStore('sale', () => {
  // State
  const sales = ref<Sale[]>([])
  const currentSale = ref<Sale | null>(null)
  const summary = ref<SalesSummary | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Actions
  async function fetchSales(params?: SaleQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await saleRepository.getAll(params)
      sales.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar vendas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSaleById(id: string) {
    loading.value = true
    error.value = null
    try {
      const sale = await saleRepository.getById(id)
      currentSale.value = sale
      return sale
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar venda'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createSale(data: CreateSaleDTO) {
    loading.value = true
    error.value = null
    try {
      const sale = await saleRepository.create(data)
      sales.value.unshift(sale)
      return sale
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar venda'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelSale(id: string) {
    loading.value = true
    error.value = null
    try {
      const sale = await saleRepository.cancel(id)
      const index = sales.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        sales.value[index] = sale
      }
      if (currentSale.value?.id === id) {
        currentSale.value = sale
      }
      return sale
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao cancelar venda'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchSalesSummary(params: DateRangeParams) {
    loading.value = true
    error.value = null
    try {
      summary.value = await saleRepository.getSummary(params)
      return summary.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar resumo de vendas'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    sales,
    currentSale,
    summary,
    loading,
    error,
    pagination,
    // Actions
    fetchSales,
    fetchSaleById,
    createSale,
    cancelSale,
    fetchSalesSummary,
  }
})
