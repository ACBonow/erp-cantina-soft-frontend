export interface PaymentMethod {
  id: string
  name: string
  displayName: string
  requiresAccount: boolean
  active: boolean
  createdAt?: string
  updatedAt?: string
}
