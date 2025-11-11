import type { PaymentMethod } from '@/domain/entities/PaymentMethod'
import type { IPaymentMethodRepository } from '@/domain/repositories/IPaymentMethodRepository'
import { httpClient } from '../http/httpClient'

export class PaymentMethodRepository implements IPaymentMethodRepository {
  async getAll(): Promise<PaymentMethod[]> {
    return httpClient.get<PaymentMethod[]>('/payment-methods')
  }

  async getById(id: string): Promise<PaymentMethod> {
    return httpClient.get<PaymentMethod>(`/payment-methods/${id}`)
  }
}

export const paymentMethodRepository = new PaymentMethodRepository()
