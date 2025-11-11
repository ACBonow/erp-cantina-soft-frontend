import type {
  Inventory,
  CreateInventoryDTO,
  UpdateInventoryDTO,
  InventoryMovement,
  InventoryMovementDTO,
  InventoryReport,
  LowStockItem,
} from '../entities/Inventory'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/api'

export interface IInventoryRepository {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Inventory>>
  getByProductId(productId: string): Promise<Inventory>
  getLowStockItems(): Promise<LowStockItem[]>
  getReport(): Promise<InventoryReport>
  create(data: CreateInventoryDTO): Promise<Inventory>
  update(id: string, data: UpdateInventoryDTO): Promise<Inventory>
  addStock(data: InventoryMovementDTO): Promise<Inventory>
  restock(data: InventoryMovementDTO): Promise<Inventory>
  adjust(data: InventoryMovementDTO): Promise<Inventory>
  registerLoss(data: InventoryMovementDTO): Promise<Inventory>
  getMovements(inventoryId: string): Promise<{ movements: InventoryMovement[] }>
}
