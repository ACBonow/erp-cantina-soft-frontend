import type { I18n } from 'vue-i18n'

/**
 * Maps backend error messages to i18n translation keys
 * Uses exact match first, then partial match
 */
export function getErrorMessageKey(errorMessage: string): string {
  // Normalize message for comparison
  const normalizedMessage = errorMessage.toLowerCase().trim()

  // Exact match mapping (case-insensitive)
  const exactMatchMap: Record<string, string> = {
    // Authentication errors
    'email already registered': 'error.emailAlreadyRegistered',
    'invalid credentials': 'error.invalidCredentials',
    'authentication token not provided': 'error.tokenNotProvided',
    'invalid token': 'error.invalidToken',
    'token expired': 'error.tokenExpired',
    'unauthorized': 'error.unauthorized',
    'forbidden': 'error.forbidden',
    'insufficient permissions': 'error.insufficientPermissions',

    // People/Person errors
    'cannot delete person with dependents. please reassign or remove dependents first.': 'error.cannotDeleteWithDependents',
    'cannot delete person with dependents': 'error.cannotDeleteWithDependents',
    'person not found': 'error.personNotFound',
    'cpf already exists': 'error.cpfAlreadyExists',
    'cpf already registered': 'error.cpfAlreadyExists',
    'invalid cpf': 'error.invalidCpf',

    // Customer errors
    'customer not found': 'error.customerNotFound',
    'insufficient balance': 'error.insufficientBalance',

    // Product errors
    'product not found': 'error.productNotFound',
    'product already exists': 'error.productAlreadyExists',

    // Category errors
    'category not found': 'error.categoryNotFound',
    'category already exists': 'error.categoryAlreadyExists',
    'cannot delete category with products': 'error.cannotDeleteCategoryWithProducts',

    // Sale errors
    'sale not found': 'error.saleNotFound',
    'cannot cancel completed sale': 'error.cannotCancelCompletedSale',

    // Inventory errors
    'inventory not found': 'error.inventoryNotFound',
    'insufficient stock': 'error.insufficientStock',

    // Validation errors
    'invalid data': 'error.invalidData',
    'validation failed': 'error.validationFailed',
    'invalid email format': 'error.invalidEmail',
    'invalid phone format': 'error.invalidPhone',
    'password must be at least 6 characters': 'error.passwordTooShort',

    // Generic errors
    'resource not found': 'error.notFound',
    'internal server error': 'error.serverError',
    'bad request': 'error.badRequest',
  }

  // Check for exact match (case-insensitive)
  if (exactMatchMap[normalizedMessage]) {
    return exactMatchMap[normalizedMessage]
  }

  // Partial match mapping (for messages that contain specific keywords)
  const partialMatchMap: Record<string, string> = {
    'already registered': 'error.alreadyRegistered',
    'already exists': 'error.alreadyExists',
    'not found': 'error.notFound',
    'invalid': 'error.invalidData',
    'forbidden': 'error.forbidden',
    'unauthorized': 'error.unauthorized',
    'insufficient': 'error.insufficientBalance',
    'cannot delete': 'error.cannotDelete',
    'validation': 'error.validationFailed',
  }

  // Check for partial match
  for (const [key, value] of Object.entries(partialMatchMap)) {
    if (normalizedMessage.includes(key)) {
      return value
    }
  }

  // Default to generic error
  return 'error.generic'
}

/**
 * Translates backend error message to user-friendly message
 */
export function translateError(error: any, t: I18n['global']['t']): string {
  // Extract error message
  let errorMessage = error?.message || error?.error || 'Unknown error'

  // If it's an axios error, try to get the backend message
  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message
  }

  // Get translation key
  const translationKey = getErrorMessageKey(errorMessage)

  // Return translated message
  return t(translationKey)
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error?.code === 'ECONNABORTED' || error?.message?.includes('Network Error')
}

/**
 * Gets user-friendly error message with fallback
 */
export function getUserFriendlyError(error: any, t: I18n['global']['t']): string {
  if (isNetworkError(error)) {
    return t('error.network')
  }

  return translateError(error, t)
}
