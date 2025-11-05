export const APP_NAME = 'CantinaSoft'
export const APP_VERSION = '1.0.0'

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
export const API_TIMEOUT = 30000

// Pagination
export const DEFAULT_PAGE = 1
export const DEFAULT_LIMIT = 10
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  RESPONSIBLE: 'responsible',
  CUSTOMER: 'customer',
} as const

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.MANAGER]: 'Gerente',
  [USER_ROLES.RESPONSIBLE]: 'Responsável',
  [USER_ROLES.CUSTOMER]: 'Cliente',
} as const

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT: 'credit',
  CASH: 'cash',
  PIX: 'pix',
  CARD: 'card',
} as const

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CREDIT]: 'Crédito',
  [PAYMENT_METHODS.CASH]: 'Dinheiro',
  [PAYMENT_METHODS.PIX]: 'PIX',
  [PAYMENT_METHODS.CARD]: 'Cartão',
} as const

// Sale Status
export const SALE_STATUS = {
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const

export const SALE_STATUS_LABELS = {
  [SALE_STATUS.COMPLETED]: 'Completa',
  [SALE_STATUS.CANCELLED]: 'Cancelada',
  [SALE_STATUS.PENDING]: 'Pendente',
} as const

export const SALE_STATUS_COLORS = {
  [SALE_STATUS.COMPLETED]: 'success',
  [SALE_STATUS.CANCELLED]: 'error',
  [SALE_STATUS.PENDING]: 'warning',
} as const

// Inventory Movement Types
export const MOVEMENT_TYPES = {
  RESTOCK: 'restock',
  ADJUSTMENT: 'adjustment',
  LOSS: 'loss',
  SALE: 'sale',
} as const

export const MOVEMENT_TYPE_LABELS = {
  [MOVEMENT_TYPES.RESTOCK]: 'Reabastecimento',
  [MOVEMENT_TYPES.ADJUSTMENT]: 'Ajuste',
  [MOVEMENT_TYPES.LOSS]: 'Perda',
  [MOVEMENT_TYPES.SALE]: 'Venda',
} as const

// Balance History Types
export const BALANCE_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
} as const

export const BALANCE_TYPE_LABELS = {
  [BALANCE_TYPES.CREDIT]: 'Crédito',
  [BALANCE_TYPES.DEBIT]: 'Débito',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CUSTOMERS: '/customers',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  SALES: '/sales',
  INVENTORY: '/inventory',
  REPORTS: '/reports',
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const
