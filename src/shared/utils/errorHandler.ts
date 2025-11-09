import type { I18n } from 'vue-i18n'

/**
 * Maps backend error messages to i18n translation keys
 */
export function getErrorMessageKey(errorMessage: string): string {
  const errorMap: Record<string, string> = {
    // People/Person errors
    'Cannot delete person with dependents': 'error.cannotDeleteWithDependents',
    'Person not found': 'error.personNotFound',
    'CPF already exists': 'error.cpfAlreadyExists',
    'CPF already registered': 'error.cpfAlreadyExists',

    // Generic errors
    'Invalid data': 'error.invalidData',
    'Validation failed': 'error.invalidData',
    'Resource not found': 'error.notFound',
    'Unauthorized': 'error.unauthorized',
    'Forbidden': 'error.unauthorized',
    'Internal server error': 'error.serverError',
  }

  // Check if error message contains any of the mapped keys
  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.includes(key)) {
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
