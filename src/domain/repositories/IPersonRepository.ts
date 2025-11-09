import type { Person } from '../entities/Person'

export interface CreatePersonDTO {
  name: string
  cpf: string
  email?: string
  phone?: string
  birthDate?: string
  responsibleId?: string
}

export interface UpdatePersonDTO {
  name?: string
  email?: string
  phone?: string
  birthDate?: string
  responsibleId?: string
  active?: boolean
}

export interface PersonListResponse {
  people: Person[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PersonApiResponse<T> {
  status: 'success' | 'error'
  data: T
  message?: string
}

export interface IPersonRepository {
  // List and search
  getAll(page?: number, limit?: number, activeOnly?: boolean): Promise<PersonListResponse>
  getById(id: string): Promise<Person>
  getByCpf(cpf: string): Promise<Person>
  search(query: string, page?: number, limit?: number): Promise<PersonListResponse>

  // CRUD operations
  create(data: CreatePersonDTO): Promise<Person>
  update(id: string, data: UpdatePersonDTO): Promise<Person>
  delete(id: string): Promise<void>

  // Dependents
  getDependents(responsibleId: string): Promise<Person[]>
}
