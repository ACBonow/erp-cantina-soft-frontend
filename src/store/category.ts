import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@/domain/entities/Product'
import { categoryRepository } from '@/infrastructure/repositories/ProductRepository'
import type { CategoryQueryParams } from '@/domain/repositories/IProductRepository'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const page = ref(1)
  const limit = ref(10)
  const total = ref(0)
  const totalPages = ref(0)

  async function fetchCategories(params?: CategoryQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await categoryRepository.getAll(params || { page: page.value, limit: limit.value })
      categories.value = response.data
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar categorias'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCategoryById(id: string) {
    loading.value = true
    error.value = null
    try {
      const category = await categoryRepository.getById(id)
      currentCategory.value = category
      return category
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data: CreateCategoryDTO) {
    loading.value = true
    error.value = null
    try {
      const category = await categoryRepository.create(data)
      categories.value.push(category)
      return category
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: string, data: UpdateCategoryDTO) {
    loading.value = true
    error.value = null
    try {
      const category = await categoryRepository.update(id, data)
      const index = categories.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        categories.value[index] = category
      }
      if (currentCategory.value?.id === id) {
        currentCategory.value = category
      }
      return category
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string) {
    loading.value = true
    error.value = null
    try {
      await categoryRepository.delete(id)
      categories.value = categories.value.filter((c) => c.id !== id)
      if (currentCategory.value?.id === id) {
        currentCategory.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    categories,
    currentCategory,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
