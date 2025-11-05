import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '@/domain/entities/Product'
import type {
  IProductRepository,
  ICategoryRepository,
  ProductQueryParams,
  CategoryQueryParams,
} from '@/domain/repositories/IProductRepository'
import type { PaginatedResponse } from '@/shared/types/api'
import { httpClient } from '../http/httpClient'

export class ProductRepository implements IProductRepository {
  async getAll(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId)
    if (params?.active !== undefined) queryParams.append('active', params.active.toString())

    const response = await httpClient.get<{
      products: Product[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/products?${queryParams.toString()}`)

    return {
      data: response.products,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
  }

  async getById(id: string): Promise<Product> {
    return httpClient.get<Product>(`/products/${id}`)
  }

  async create(data: CreateProductDTO): Promise<Product> {
    return httpClient.post<Product>('/products', data)
  }

  async update(id: string, data: UpdateProductDTO): Promise<Product> {
    return httpClient.put<Product>(`/products/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/products/${id}`)
  }
}

export class CategoryRepository implements ICategoryRepository {
  async getAll(params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.active !== undefined) queryParams.append('active', params.active.toString())

    const response = await httpClient.get<{
      categories: Category[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/categories?${queryParams.toString()}`)

    return {
      data: response.categories,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
  }

  async getById(id: string): Promise<Category> {
    return httpClient.get<Category>(`/categories/${id}`)
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    return httpClient.post<Category>('/categories', data)
  }

  async update(id: string, data: UpdateCategoryDTO): Promise<Category> {
    return httpClient.put<Category>(`/categories/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/categories/${id}`)
  }
}

export const productRepository = new ProductRepository()
export const categoryRepository = new CategoryRepository()
