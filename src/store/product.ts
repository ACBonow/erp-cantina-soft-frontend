import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/domain/entities/Product'
import type { ProductQueryParams, CategoryQueryParams } from '@/domain/repositories/IProductRepository'
import {
  productRepository,
  categoryRepository,
} from '@/infrastructure/repositories/ProductRepository'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentCategory = ref<Category | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const productPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const categoryPagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Product Actions
  async function fetchProducts(params?: ProductQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await productRepository.getAll(params)
      products.value = response.data
      productPagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar produtos'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(id: string) {
    loading.value = true
    error.value = null
    try {
      const product = await productRepository.getById(id)
      currentProduct.value = product
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar produto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createProduct(data: CreateProductDTO) {
    loading.value = true
    error.value = null
    try {
      const product = await productRepository.create(data)
      products.value.unshift(product)
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar produto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: string, data: UpdateProductDTO) {
    loading.value = true
    error.value = null
    try {
      const product = await productRepository.update(id, data)
      const index = products.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        products.value[index] = product
      }
      if (currentProduct.value?.id === id) {
        currentProduct.value = product
      }
      return product
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar produto'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: string) {
    loading.value = true
    error.value = null
    try {
      await productRepository.delete(id)
      products.value = products.value.filter((p) => p.id !== id)
      if (currentProduct.value?.id === id) {
        currentProduct.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao deletar produto'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Category Actions
  async function fetchCategories(params?: CategoryQueryParams) {
    loading.value = true
    error.value = null
    try {
      const response = await categoryRepository.getAll(params)
      categories.value = response.data
      categoryPagination.value = {
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao buscar categorias'
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
      error.value = err.response?.data?.message || 'Erro ao buscar categoria'
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
      categories.value.unshift(category)
      return category
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar categoria'
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
      error.value = err.response?.data?.message || 'Erro ao atualizar categoria'
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
      error.value = err.response?.data?.message || 'Erro ao deletar categoria'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    categories,
    currentProduct,
    currentCategory,
    loading,
    error,
    productPagination,
    categoryPagination,
    // Product Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    // Category Actions
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
