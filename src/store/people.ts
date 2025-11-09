import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Person } from '@/domain/entities/Person'
import type { CreatePersonDTO, UpdatePersonDTO } from '@/domain/repositories/IPersonRepository'
import { personRepository } from '@/infrastructure/repositories/PersonRepository'

export const usePeopleStore = defineStore('people', () => {
  // State
  const people = ref<Person[]>([])
  const currentPerson = ref<Person | null>(null)
  const dependents = ref<Person[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const total = ref(0)
  const page = ref(1)
  const limit = ref(10)
  const totalPages = ref(0)

  // Getters
  const activePeople = computed(() => people.value.filter((p) => p.active))
  const inactivePeople = computed(() => people.value.filter((p) => !p.active))
  const hasError = computed(() => !!error.value)

  // Actions
  async function fetchPeople(pageNum: number = 1, pageLimit: number = 10, activeOnly: boolean = true) {
    loading.value = true
    error.value = null

    try {
      const response = await personRepository.getAll(pageNum, pageLimit, activeOnly)
      people.value = response.people
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar pessoas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPersonById(id: string) {
    loading.value = true
    error.value = null

    try {
      currentPerson.value = await personRepository.getById(id)
      return currentPerson.value
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar pessoa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchPersonByCpf(cpf: string) {
    loading.value = true
    error.value = null

    try {
      currentPerson.value = await personRepository.getByCpf(cpf)
      return currentPerson.value
    } catch (err: any) {
      error.value = err.message || 'Pessoa não encontrada'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function searchPeople(query: string, pageNum: number = 1, pageLimit: number = 10) {
    loading.value = true
    error.value = null

    try {
      const response = await personRepository.search(query, pageNum, pageLimit)
      people.value = response.people
      total.value = response.total
      page.value = response.page
      limit.value = response.limit
      totalPages.value = response.totalPages
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar pessoas'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createPerson(data: CreatePersonDTO) {
    loading.value = true
    error.value = null

    try {
      const newPerson = await personRepository.create(data)
      people.value.unshift(newPerson)
      total.value++
      return newPerson
    } catch (err: any) {
      error.value = err.message || 'Erro ao criar pessoa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePerson(id: string, data: UpdatePersonDTO) {
    loading.value = true
    error.value = null

    try {
      const updatedPerson = await personRepository.update(id, data)
      const index = people.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        people.value[index] = updatedPerson
      }
      if (currentPerson.value?.id === id) {
        currentPerson.value = updatedPerson
      }
      return updatedPerson
    } catch (err: any) {
      error.value = err.message || 'Erro ao atualizar pessoa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePerson(id: string) {
    loading.value = true
    error.value = null

    try {
      await personRepository.delete(id)
      people.value = people.value.filter((p) => p.id !== id)
      total.value--
      if (currentPerson.value?.id === id) {
        currentPerson.value = null
      }
    } catch (err: any) {
      error.value = err.message || 'Erro ao deletar pessoa'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDependents(responsibleId: string) {
    loading.value = true
    error.value = null

    try {
      dependents.value = await personRepository.getDependents(responsibleId)
      return dependents.value
    } catch (err: any) {
      error.value = err.message || 'Erro ao carregar dependentes'
      throw err
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentPerson() {
    currentPerson.value = null
  }

  function clearDependents() {
    dependents.value = []
  }

  function resetState() {
    people.value = []
    currentPerson.value = null
    dependents.value = []
    loading.value = false
    error.value = null
    total.value = 0
    page.value = 1
    limit.value = 10
    totalPages.value = 0
  }

  return {
    // State
    people,
    currentPerson,
    dependents,
    loading,
    error,
    total,
    page,
    limit,
    totalPages,

    // Getters
    activePeople,
    inactivePeople,
    hasError,

    // Actions
    fetchPeople,
    fetchPersonById,
    fetchPersonByCpf,
    searchPeople,
    createPerson,
    updatePerson,
    deletePerson,
    fetchDependents,
    clearError,
    clearCurrentPerson,
    clearDependents,
    resetState,
  }
})
