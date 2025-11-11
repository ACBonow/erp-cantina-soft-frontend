import type {
  IPersonRepository,
  CreatePersonDTO,
  UpdatePersonDTO,
  PersonListResponse,
  PersonApiResponse,
} from '@/domain/repositories/IPersonRepository'
import type { Person } from '@/domain/entities/Person'
import { httpClient } from '../http/httpClient'

export class PersonRepository implements IPersonRepository {
  async getAll(
    page: number = 1,
    limit: number = 10,
    activeOnly: boolean = true,
  ): Promise<PersonListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      activeOnly: activeOnly.toString(),
    })

    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.get<PersonListResponse>(`/people?${params}`)
  }

  async getById(id: string): Promise<Person> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.get<Person>(`/people/${id}`)
  }

  async getByCpf(cpf: string): Promise<Person> {
    // Remove formatting from CPF
    const cleanCpf = cpf.replace(/[^\d]/g, '')
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.get<Person>(`/people/cpf/${cleanCpf}`)
  }

  async search(query: string, page: number = 1, limit: number = 10): Promise<PersonListResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })

    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.get<PersonListResponse>(`/people/search?${params}`)
  }

  async create(data: CreatePersonDTO): Promise<Person> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.post<Person>('/people', data)
  }

  async update(id: string, data: UpdatePersonDTO): Promise<Person> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.put<Person>(`/people/${id}`, data)
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/people/${id}`)
  }

  async getDependents(responsibleId: string): Promise<Person[]> {
    // httpClient already unwraps { status: 'success', data: {...} } to just {...}
    return httpClient.get<Person[]>(`/people/${responsibleId}/dependents`)
  }
}

export const personRepository = new PersonRepository()
