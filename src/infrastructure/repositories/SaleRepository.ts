import type { Sale, CreateSaleDTO, SalesSummary } from '@/domain/entities/Sale'
import type { ISaleRepository, SaleQueryParams } from '@/domain/repositories/ISaleRepository'
import type { PaginatedResponse, DateRangeParams } from '@/shared/types/api'
import { httpClient } from '../http/httpClient'

export class SaleRepository implements ISaleRepository {
  async getAll(params?: SaleQueryParams): Promise<PaginatedResponse<Sale>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.customerId) queryParams.append('customerId', params.customerId)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.startDate) queryParams.append('startDate', params.startDate)
    if (params?.endDate) queryParams.append('endDate', params.endDate)

    const response = await httpClient.get<{
      sales: Sale[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/sales?${queryParams.toString()}`)

    return {
      data: response.sales,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
  }

  async getById(id: string): Promise<Sale> {
    return httpClient.get<Sale>(`/sales/${id}`)
  }

  async create(data: CreateSaleDTO): Promise<Sale> {
    return httpClient.post<Sale>('/sales', data)
  }

  async cancel(id: string): Promise<Sale> {
    return httpClient.patch<Sale>(`/sales/${id}/cancel`)
  }

  async getSummary(params: DateRangeParams): Promise<SalesSummary> {
    const queryParams = new URLSearchParams()
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    return httpClient.get<SalesSummary>(`/sales/summary?${queryParams.toString()}`)
  }
}

export const saleRepository = new SaleRepository()
