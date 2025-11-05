export interface Sale {
  id: string
  customerId: string
  customerName: string
  userId: string
  userName: string
  totalAmount: number
  paymentMethod: PaymentMethod
  status: SaleStatus
  createdAt: string
  updatedAt: string
  items: SaleItem[]
}

export interface SaleItem {
  id: string
  saleId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type PaymentMethod = 'credit' | 'cash' | 'pix' | 'card'
export type SaleStatus = 'completed' | 'cancelled' | 'pending'

export interface CreateSaleDTO {
  customerId: string
  paymentMethod: PaymentMethod
  items: CreateSaleItemDTO[]
}

export interface CreateSaleItemDTO {
  productId: string
  quantity: number
}

export interface SalesSummary {
  totalSales: number
  totalAmount: number
  averageTicket: number
  salesByPaymentMethod: SalesByPaymentMethod[]
}

export interface SalesByPaymentMethod {
  paymentMethod: PaymentMethod
  count: number
  total: number
}
