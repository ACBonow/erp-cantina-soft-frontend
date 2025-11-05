import type { User } from '../entities/User'

export interface LoginDTO {
  email: string
  password: string
}

export interface RegisterDTO {
  name: string
  email: string
  password: string
  cpf: string
  phone: string
  role: 'admin' | 'manager' | 'responsible' | 'customer'
}

export interface AuthResponse {
  user: User
  token: string
  expiresIn: string
}

export interface IAuthRepository {
  login(credentials: LoginDTO): Promise<AuthResponse>
  register(data: RegisterDTO): Promise<AuthResponse>
  verifyToken(token: string): Promise<{ valid: boolean; user?: User }>
  logout(): void
}
