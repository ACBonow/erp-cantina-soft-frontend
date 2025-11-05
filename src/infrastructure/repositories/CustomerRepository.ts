import type {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from '@/domain/entities/Customer'
import type { BalanceHistory, AddCreditDTO, DebitCreditDTO } from '@/domain/entities/Balance'
import type { Sale } from '@/domain/entities/Sale'
import type { ICustomerRepository } from '@/domain/repositories/ICustomerRepository'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/api'
import { httpClient } from '../http/httpClient'

export class CustomerRepository implements ICustomerRepository {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())

    const response = await httpClient.get<{
      customers: Customer[]
      total: number
      page: number
      limit: number
      totalPages: number
    }>(`/customers?${queryParams.toString()}`)

    return {
      data: response.customers,
      total: response.total,
      page: response.page,
      limit: response.limit,
      totalPages: response.totalPages,
    }
  }

  async getById(id: string): Promise<Customer> {
    return httpClient.get<Customer>(`/customers/${id}`)
  }

  async create(data: CreateCustomerDTO): Promise<Customer> {
    return httpClient.post<Customer>('/customers', data)
  }

  async update(id: string, data: UpdateCustomerDTO): Promise<Customer> {
    return httpClient.put<Customer>(`/customers/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/customers/${id}`)
  }

  async addCredit(id: string, data: AddCreditDTO): Promise<Customer> {
    return httpClient.post<Customer>(`/customers/${id}/credit/add`, data)
  }

  async debitCredit(id: string, data: DebitCreditDTO): Promise<Customer> {
    return httpClient.post<Customer>(`/customers/${id}/credit/debit`, data)
  }

  async getBalanceHistory(id: string): Promise<BalanceHistory[]> {
    const response = await httpClient.get<{ history: BalanceHistory[] }>(
      `/customers/${id}/balance-history`,
    )
    return response.history
  }

  async getSales(id: string): Promise<{
    customerId: string
    customerName: string
    totalPurchases: number
    totalSpent: number
    sales: Sale[]
  }> {
    return httpClient.get(`/customers/${id}/sales`)
  }
}

export const customerRepository = new CustomerRepository()
