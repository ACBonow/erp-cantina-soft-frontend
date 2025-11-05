export interface ApiResponse<T> {
  status: 'success' | 'error'
  message?: string
  data?: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiError {
  status: 'error'
  message: string
  errors?: ValidationError[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface DateRangeParams {
  startDate?: string
  endDate?: string
}
