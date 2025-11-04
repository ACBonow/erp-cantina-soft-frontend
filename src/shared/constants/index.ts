export const APP_NAME = 'CantinaSoft'
export const APP_VERSION = '1.0.0'

export const ROLES = {
  ADMIN: 'admin',
  OPERATOR: 'operator',
  USER: 'user',
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCTS: '/produtos',
  SALES: '/vendas',
  CUSTOMERS: '/clientes',
  REPORTS: '/relatorios',
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: '/users',
  PRODUCTS: '/products',
  SALES: '/sales',
  CUSTOMERS: '/customers',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const
