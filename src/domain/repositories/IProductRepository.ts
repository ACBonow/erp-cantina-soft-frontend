import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  Category,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../entities/Product'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/api'

export interface ProductQueryParams extends PaginationParams {
  categoryId?: string
  active?: boolean
}

export interface CategoryQueryParams extends PaginationParams {
  active?: boolean
}

export interface IProductRepository {
  getAll(params?: ProductQueryParams): Promise<PaginatedResponse<Product>>
  getById(id: string): Promise<Product>
  create(data: CreateProductDTO): Promise<Product>
  update(id: string, data: UpdateProductDTO): Promise<Product>
  delete(id: string): Promise<void>
}

export interface ICategoryRepository {
  getAll(params?: CategoryQueryParams): Promise<PaginatedResponse<Category>>
  getById(id: string): Promise<Category>
  create(data: CreateCategoryDTO): Promise<Category>
  update(id: string, data: UpdateCategoryDTO): Promise<Category>
  delete(id: string): Promise<void>
}
