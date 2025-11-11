export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost: number
  categoryId: string
  categoryName?: string
  barcode?: string
  active: boolean
  // Stock alert fields
  minStockAlert?: number
  maxStockAlert?: number
  reorderQuantity?: number
  createdAt: string
  updatedAt: string
  category?: Category
}

export interface ProductWithStock extends Product {
  currentStock?: number
  stockStatus?: 'low' | 'ok' | 'high' | 'out'
  needsReorder?: boolean
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
  barcode?: string
  minStockAlert?: number
  maxStockAlert?: number
  reorderQuantity?: number
}

export interface UpdateProductDTO {
  name?: string
  description?: string
  price?: number
  cost?: number
  categoryId?: string
  barcode?: string
  active?: boolean
  minStockAlert?: number
  maxStockAlert?: number
  reorderQuantity?: number
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
