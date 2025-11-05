import { ref } from 'vue'
import type { Ref } from 'vue'

export interface UseApiOptions<T> {
  immediate?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: any) => void
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<T>,
  options: UseApiOptions<T> = {},
) {
  const data: Ref<T | null> = ref(null)
  const loading = ref(false)
  const error: Ref<string | null> = ref(null)

  const execute = async (...args: any[]): Promise<T | null> => {
    loading.value = true
    error.value = null
    try {
      const result = await apiCall(...args)
      data.value = result
      options.onSuccess?.(result)
      return result
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao processar requisição'
      error.value = errorMessage
      options.onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  if (options.immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    execute,
  }
}
