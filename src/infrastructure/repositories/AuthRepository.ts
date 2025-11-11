import type {
  IAuthRepository,
  LoginDTO,
  RegisterDTO,
  AuthResponse,
  ApiResponse,
  VerifyTokenResponse,
} from '@/domain/repositories/IAuthRepository'
import type { User } from '@/domain/entities/User'
import { httpClient } from '../http/httpClient'

export class AuthRepository implements IAuthRepository {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    const response = await httpClient.post<AuthResponse>('/auth/login', credentials)

    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }

    return response
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    const response = await httpClient.post<AuthResponse>('/auth/register', data)

    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
    }

    return response
  }

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        return { valid: false }
      }

      // httpClient already unwraps { status: 'success', data: {...} } to just {...}
      const response = await httpClient.post<VerifyTokenResponse>('/auth/verify')

      // Convert VerifyTokenResponse to User format
      const user: User = {
        id: response.userId,
        email: response.email,
        role: response.role as 'admin' | 'manager' | 'responsible' | 'customer',
        name: response.name || '',
        cpf: '', // Not returned by verify endpoint
        phone: '', // Not returned by verify endpoint
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return { valid: true, user }
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
