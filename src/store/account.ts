import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AccountTransaction, AddCreditDTO } from '@/domain/entities/Account'
import { accountRepository } from '@/infrastructure/repositories/AccountRepository'

export const useAccountStore = defineStore('account', () => {
  const transactions = ref<AccountTransaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function addCredit(data: AddCreditDTO) {
    loading.value = true
    error.value = null
    try {
      const transaction = await accountRepository.addCredit(data)
      return transaction
    } catch (err: any) {
      error.value = err.message || 'Erro ao adicionar crédito'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchHistory(customerId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await accountRepository.getHistory(customerId)
      transactions.value = response.transactions
      return response.transactions
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar histórico'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getAccountByCustomerId(customerId: string) {
    loading.value = true
    error.value = null
    try {
      return await accountRepository.getByCustomerId(customerId)
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar conta'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    addCredit,
    fetchHistory,
    getAccountByCustomerId,
  }
})
