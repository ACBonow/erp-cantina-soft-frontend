import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

export class HttpClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }

        // Extract error message from backend response
        if (error.response?.data) {
          const errorData = error.response.data

          // Backend returns { status: 'error', message: '...' }
          if (errorData.message) {
            error.message = errorData.message
          }

          // Handle validation errors
          if (errorData.errors && Array.isArray(errorData.errors)) {
            const validationMessages = errorData.errors
              .map((err: any) => `${err.field}: ${err.message}`)
              .join(', ')
            error.message = validationMessages
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(url, config)
    // Backend returns { status: 'success', data: {...} }
    return response.data.data || response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(url, data, config)
    // Backend returns { status: 'success', data: {...} }
    return response.data.data || response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(url, data, config)
    // Backend returns { status: 'success', data: {...} }
    return response.data.data || response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(url, config)
    // Backend returns { status: 'success', data: {...} }
    return response.data.data || response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch(url, data, config)
    // Backend returns { status: 'success', data: {...} }
    return response.data.data || response.data
  }
}

// Environment-based API URL configuration
const getApiUrl = (): string => {
  const envApiUrl = import.meta.env.VITE_API_URL

  // Validate that API URL is configured
  if (!envApiUrl) {
    console.warn(
      '⚠️  VITE_API_URL not configured. Using default: http://localhost:3001'
    )
    return 'http://localhost:3001'
  }

  // Log the configured API URL in development
  if (import.meta.env.DEV) {
    console.log(`🌐 API URL configured: ${envApiUrl}`)
  }

  return envApiUrl
}

export const httpClient = new HttpClient(getApiUrl())
