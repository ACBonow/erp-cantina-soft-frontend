export interface Inventory {
  id: string
  productId: string
  productName?: string
  quantity: number
  minQuantity: number
  maxQuantity: number
  lastRestockDate?: string
  status?: 'low' | 'sufficient' | 'excess'
  createdAt: string
  updatedAt: string
}

export interface InventoryMovement {
  id: string
  inventoryId: string
  productId: string
  productName: string
  type: MovementType
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  userId: string
  userName: string
  createdAt: string
}

export type MovementType = 'restock' | 'adjustment' | 'loss' | 'sale'

export interface CreateInventoryDTO {
  productId: string
  quantity: number
  minQuantity: number
  maxQuantity: number
}

export interface UpdateInventoryDTO {
  quantity?: number
  minQuantity?: number
  maxQuantity?: number
}

export interface InventoryMovementDTO {
  inventoryId: string
  type: MovementType
  quantity: number
  reason?: string
}

export interface InventoryReport {
  totalProducts: number
  totalValue: number
  lowStockCount: number
  outOfStockCount: number
  lowStockItems: LowStockItem[]
}

export interface LowStockItem {
  productId: string
  productName: string
  quantity: number
  minQuantity: number
  deficit?: number
}
