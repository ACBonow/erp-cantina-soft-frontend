export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'operator' | 'user'
  createdAt: Date
  updatedAt: Date
}

export class UserEntity implements User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public role: 'admin' | 'operator' | 'user',
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin'
  }

  canManageProducts(): boolean {
    return this.role === 'admin' || this.role === 'operator'
  }
}
