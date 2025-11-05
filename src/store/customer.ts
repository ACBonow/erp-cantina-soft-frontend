import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/domain/entities/Customer'
import type { BalanceHistory, AddCreditDTO, DebitCreditDTO } from '@/domain/entities/Balance'
import type { Sale } from '@/domain/entities/Sale'
import type { PaginationParams } from '@/shared/types/api'
import { customerRepository } from '@/infrastructure/repositories/CustomerRepository'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const balanceHistory = ref<BalanceHistory[]>([])
  const customerSales = ref<Sale[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Actions
  async function fetchCustomers(params?: PaginationParams) {
    loading.value = true
    error.value = null
    try {
      const response = await customerRepository.getAll(params)
      customers.value = response.data
      pagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar clientes'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerById(id: string) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerRepository.getById(id)
      currentCustomer.value = customer
      return customer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCustomer(data: CreateCustomerDTO) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerRepository.create(data)
      customers.value.unshift(customer)
      return customer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCustomer(id: string, data: UpdateCustomerDTO) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerRepository.update(id, data)
      const index = customers.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        customers.value[index] = customer
      }
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = customer
      }
      return customer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCustomer(id: string) {
    loading.value = true
    error.value = null
    try {
      await customerRepository.delete(id)
      customers.value = customers.value.filter((c) => c.id !== id)
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao deletar cliente'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addCredit(id: string, data: AddCreditDTO) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerRepository.addCredit(id, data)
      const index = customers.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        customers.value[index] = customer
      }
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = customer
      }
      return customer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao adicionar crédito'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function debitCredit(id: string, data: DebitCreditDTO) {
    loading.value = true
    error.value = null
    try {
      const customer = await customerRepository.debitCredit(id, data)
      const index = customers.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        customers.value[index] = customer
      }
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = customer
      }
      return customer
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao debitar crédito'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchBalanceHistory(id: string) {
    loading.value = true
    error.value = null
    try {
      balanceHistory.value = await customerRepository.getBalanceHistory(id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar histórico'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerSales(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await customerRepository.getSales(id)
      customerSales.value = response.sales
      return response
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar vendas'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    customers,
    currentCustomer,
    balanceHistory,
    customerSales,
    loading,
    error,
    pagination,
    // Actions
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    addCredit,
    debitCredit,
    fetchBalanceHistory,
    fetchCustomerSales,
  }
})
