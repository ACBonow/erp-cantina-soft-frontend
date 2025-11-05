import type { Sale, CreateSaleDTO, SalesSummary, SaleStatus } from '../entities/Sale'
import type { PaginatedResponse, PaginationParams, DateRangeParams } from '@/shared/types/api'

export interface SaleQueryParams extends PaginationParams, DateRangeParams {
  customerId?: string
  status?: SaleStatus
}

export interface ISaleRepository {
  getAll(params?: SaleQueryParams): Promise<PaginatedResponse<Sale>>
  getById(id: string): Promise<Sale>
  create(data: CreateSaleDTO): Promise<Sale>
  cancel(id: string): Promise<Sale>
  getSummary(params: DateRangeParams): Promise<SalesSummary>
}
