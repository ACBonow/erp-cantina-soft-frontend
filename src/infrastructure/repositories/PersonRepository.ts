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

    const response = await httpClient.get<PersonApiResponse<PersonListResponse>>(
      `/api/v1/people?${params}`,
    )

    return response.data
  }

  async getById(id: string): Promise<Person> {
    const response = await httpClient.get<PersonApiResponse<Person>>(`/api/v1/people/${id}`)
    return response.data
  }

  async getByCpf(cpf: string): Promise<Person> {
    // Remove formatting from CPF
    const cleanCpf = cpf.replace(/[^\d]/g, '')
    const response = await httpClient.get<PersonApiResponse<Person>>(`/api/v1/people/cpf/${cleanCpf}`)
    return response.data
  }

  async search(query: string, page: number = 1, limit: number = 10): Promise<PersonListResponse> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    })

    const response = await httpClient.get<PersonApiResponse<PersonListResponse>>(
      `/api/v1/people/search?${params}`,
    )

    return response.data
  }

  async create(data: CreatePersonDTO): Promise<Person> {
    const response = await httpClient.post<PersonApiResponse<Person>>('/api/v1/people', data)
    return response.data
  }

  async update(id: string, data: UpdatePersonDTO): Promise<Person> {
    const response = await httpClient.put<PersonApiResponse<Person>>(`/api/v1/people/${id}`, data)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/api/v1/people/${id}`)
  }

  async getDependents(responsibleId: string): Promise<Person[]> {
    const response = await httpClient.get<PersonApiResponse<Person[]>>(
      `/api/v1/people/${responsibleId}/dependents`,
    )
    return response.data
  }
}

export const personRepository = new PersonRepository()
