export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost: number
  categoryId: string
  active: boolean
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  description?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateProductDTO {
  name: string
  description?: string
  price: number
  cost: number
  categoryId: string
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  cost?: number
  categoryId?: string
  active?: boolean
}

export interface CreateCategoryDTO {
  name: string
  description?: string
}

export interface UpdateCategoryDTO {
  name?: string
  description?: string
  active?: boolean
}
