export interface Account {
  id: string
  customerId: string
  balance: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface AccountTransaction {
  id: string
  accountId: string
  customerId: string
  amount: number
  type: 'credit' | 'debit'
  description: string
  userName?: string
  createdAt: string
}

export interface AddCreditDTO {
  customerId: string
  amount: number
  description?: string
}
