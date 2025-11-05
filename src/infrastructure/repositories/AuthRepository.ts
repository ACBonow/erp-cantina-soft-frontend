import type {
  IAuthRepository,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
} from '@/domain/repositories/IAuthRepository'
import type { User } from '@/domain/entities/User'
import { httpClient } from '../http/httpClient'

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials)
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    return response
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await httpClient.post<AuthResponse>('/auth/register', data)
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }
    return response
  }

  async verifyToken(token: string): Promise<{ valid: boolean; user?: User }> {
    try {
      const response = await httpClient.post<{ valid: boolean; user?: User }>(
        '/auth/verify',
        { token },
      )
      return response
    } catch (error) {
      return { valid: false }
    }
  }

  logout(): void {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const authRepository = new AuthRepository()
