export type UserRole = 'admin' | 'manager' | 'responsible' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: UserRole,
    public createdAt: string,
    public updatedAt: string,
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
