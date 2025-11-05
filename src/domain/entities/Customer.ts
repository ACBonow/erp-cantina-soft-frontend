export interface Customer {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  studentId: string
  balance: number
  responsibleId?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateCustomerDTO {
  name: string
  email: string
  cpf: string
  phone: string
  studentId: string
  responsibleId?: string
  initialBalance?: number
}

export interface UpdateCustomerDTO {
  name?: string
  email?: string
  cpf?: string
  phone?: string
  studentId?: string
  responsibleId?: string
  active?: boolean
}
