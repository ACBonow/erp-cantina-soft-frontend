import type { PaymentMethod } from '@/domain/entities/PaymentMethod'

export interface IPaymentMethodRepository {
  getAll(): Promise<PaymentMethod[]>
  getById(id: string): Promise<PaymentMethod>
}
