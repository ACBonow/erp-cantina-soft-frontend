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
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/login',
      credentials,
    )

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await httpClient.post<ApiResponse<AuthResponse>>(
      '/api/v1/auth/register',
      data,
    )

    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
  }

  async verifyToken(): Promise<{ valid: boolean; user?: User }> {
    try {
      const storedToken = localStorage.getItem('token')
      if (!storedToken) {
        return { valid: false }
      }

      const response = await httpClient.post<ApiResponse<VerifyTokenResponse>>(
        '/api/v1/auth/verify',
      )

      // Convert VerifyTokenResponse to User format
      const user: User = {
        id: response.data.userId,
        email: response.data.email,
        role: response.data.role as 'admin' | 'manager' | 'responsible' | 'customer',
        name: response.data.name || '',
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
