export type Maybe<T> = T | null | undefined

export type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }

export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
