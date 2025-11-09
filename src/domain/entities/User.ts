export type UserRole = 'admin' | 'manager' | 'responsible' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  cpf?: string
  phone?: string
  role: UserRole
  createdAt: string | Date
  updatedAt: string | Date
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: UserRole,
    public createdAt: string | Date,
    public updatedAt: string | Date,
    public cpf?: string,
    public phone?: string,
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin'
  }

  isManager(): boolean {
    return this.role === 'manager'
  }

  isResponsible(): boolean {
    return this.role === 'responsible'
  }

  isCustomer(): boolean {
    return this.role === 'customer'
  }

  canManageProducts(): boolean {
    return this.role === 'admin' || this.role === 'manager'
  }

  canManageSales(): boolean {
    return this.role === 'admin' || this.role === 'manager'
  }

  canManageInventory(): boolean {
    return this.role === 'admin' || this.role === 'manager'
  }

  canViewReports(): boolean {
    return this.role === 'admin' || this.role === 'manager'
  }
}
