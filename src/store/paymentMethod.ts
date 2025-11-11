import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentMethod } from '@/domain/entities/PaymentMethod'
import { paymentMethodRepository } from '@/infrastructure/repositories/PaymentMethodRepository'

export const usePaymentMethodStore = defineStore('paymentMethod', () => {
  const paymentMethods = ref<PaymentMethod[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPaymentMethods() {
    loading.value = true
    error.value = null
    try {
      paymentMethods.value = await paymentMethodRepository.getAll()
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar métodos de pagamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      return await paymentMethodRepository.getById(id)
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar método de pagamento'
      throw err
    } finally {
      loading.value = false
    }
  }

  function getPaymentMethodByName(name: string): PaymentMethod | undefined {
    return paymentMethods.value.find((pm) => pm.name === name)
  }

  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    fetchById,
    getPaymentMethodByName,
  }
})
