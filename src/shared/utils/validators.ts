export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '')

  if (cpf.length !== 11) return false
  if (/^(\d)\1+$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (parseInt(cpf.charAt(9)) !== digit) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (parseInt(cpf.charAt(10)) !== digit) return false

  return true
}

export function isValidPhone(phone: string): boolean {
  phone = phone.replace(/\D/g, '')
  return phone.length === 10 || phone.length === 11
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export function isPositiveNumber(value: number): boolean {
  return typeof value === 'number' && value > 0
}

export function isValidDate(date: string): boolean {
  const d = new Date(date)
  return d instanceof Date && !isNaN(d.getTime())
}

export function isValidEmailOrCPF(value: string): boolean {
  const cleanValue = value.replace(/\D/g, '')

  // Se tiver exatamente 11 dígitos, valida como CPF
  if (cleanValue.length === 11) {
    return isValidCPF(value)
  }

  // Caso contrário, valida como email
  return isValidEmail(value)
}
