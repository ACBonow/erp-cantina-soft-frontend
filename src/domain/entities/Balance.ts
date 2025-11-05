export interface BalanceHistory {
  id: string
  customerId: string
  amount: number
  type: 'credit' | 'debit'
  description?: string
  userId: string
  createdAt: string
}

export interface AddCreditDTO {
  amount: number
  description?: string
}

export interface DebitCreditDTO {
  amount: number
  description?: string
}
