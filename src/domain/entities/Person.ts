export interface Person {
  id: string
  name: string
  cpf: string
  email?: string
  phone?: string
  birthDate?: string
  responsibleId?: string
  active: boolean
  createdAt: string
  updatedAt: string
  responsible?: Partial<Person>
}

export class PersonEntity implements Person {
  constructor(
    public id: string,
    public name: string,
    public cpf: string,
    public active: boolean,
    public createdAt: string,
    public updatedAt: string,
    public email?: string,
    public phone?: string,
    public birthDate?: string,
    public responsibleId?: string,
    public responsible?: Partial<Person>,
  ) {}

  isActive(): boolean {
    return this.active
  }

  hasResponsible(): boolean {
    return !!this.responsibleId
  }

  hasEmail(): boolean {
    return !!this.email
  }

  hasPhone(): boolean {
    return !!this.phone
  }

  getAge(): number | null {
    if (!this.birthDate) return null

    const birthDate = new Date(this.birthDate)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  isMinor(): boolean {
    const age = this.getAge()
    return age !== null && age < 18
  }

  formatCpf(): string {
    return this.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  formatPhone(): string | null {
    if (!this.phone) return null

    if (this.phone.length === 11) {
      return this.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (this.phone.length === 10) {
      return this.phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return this.phone
  }
}
