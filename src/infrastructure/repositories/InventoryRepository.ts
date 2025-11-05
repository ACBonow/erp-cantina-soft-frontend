import type {
  Inventory,
  CreateInventoryDTO,
  UpdateInventoryDTO,
  InventoryMovement,
  InventoryMovementDTO,
  InventoryReport,
  LowStockItem,
} from '@/domain/entities/Inventory'
import type { IInventoryRepository } from '@/domain/repositories/IInventoryRepository'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/api'
import { httpClient } from '../http/httpClient'

export class InventoryRepository implements IInventoryRepository {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Inventory>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await httpClient.get<{
      items: Inventory[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/inventory?${queryParams.toString()}`)

    return {
      data: response.items,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
  }

  async getByProductId(productId: string): Promise<Inventory> {
    return httpClient.get<Inventory>(`/inventory/product/${productId}`)
  }

  async getLowStockItems(): Promise<{ items: LowStockItem[] }> {
    return httpClient.get<{ items: LowStockItem[] }>('/inventory/low-stock')
  }

  async getReport(): Promise<InventoryReport> {
    return httpClient.get<InventoryReport>('/inventory/report')
  }

  async create(data: CreateInventoryDTO): Promise<Inventory> {
    return httpClient.post<Inventory>('/inventory', data)
  }

  async update(id: string, data: UpdateInventoryDTO): Promise<Inventory> {
    return httpClient.put<Inventory>(`/inventory/${id}`, data)
  }

  async restock(data: InventoryMovementDTO): Promise<Inventory> {
    return httpClient.post<Inventory>('/inventory/restock', data)
  }

  async adjust(data: InventoryMovementDTO): Promise<Inventory> {
    return httpClient.post<Inventory>('/inventory/adjust', data)
  }

  async registerLoss(data: InventoryMovementDTO): Promise<Inventory> {
    return httpClient.post<Inventory>('/inventory/loss', data)
  }

  async getMovements(inventoryId: string): Promise<{ movements: InventoryMovement[] }> {
    return httpClient.get<{ movements: InventoryMovement[] }>(
      `/inventory/${inventoryId}/movements`,
    )
  }
}

export const inventoryRepository = new InventoryRepository()
