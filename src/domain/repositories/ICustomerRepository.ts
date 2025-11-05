import type {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
} from '../entities/Customer'
import type { BalanceHistory, AddCreditDTO, DebitCreditDTO } from '../entities/Balance'
import type { Sale } from '../entities/Sale'
import type { PaginatedResponse, PaginationParams } from '@/shared/types/api'

export interface ICustomerRepository {
  getAll(params?: PaginationParams): Promise<PaginatedResponse<Customer>>
  getById(id: string): Promise<Customer>
  create(data: CreateCustomerDTO): Promise<Customer>
  update(id: string, data: UpdateCustomerDTO): Promise<Customer>
  delete(id: string): Promise<void>
  addCredit(id: string, data: AddCreditDTO): Promise<Customer>
  debitCredit(id: string, data: DebitCreditDTO): Promise<Customer>
  getBalanceHistory(id: string): Promise<BalanceHistory[]>
  getSales(id: string): Promise<{
    customerId: string
    customerName: string
    totalPurchases: number
    totalSpent: number
    sales: Sale[]
  }>
}
