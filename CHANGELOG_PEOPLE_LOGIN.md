# 🔄 Changelog - Integração de Pessoas e Login com CPF

## 📅 Data: 2025-11-08

## 📝 Resumo das Mudanças

Este documento descreve as alterações implementadas para integrar o módulo de Pessoas (People) e permitir login com CPF ou Email.

---

## ✨ Novas Funcionalidades

### 1. Módulo de Pessoas (People)

Implementação completa do módulo de gerenciamento de pessoas, incluindo responsáveis e dependentes.

#### Arquivos Criados:

**Domain Layer:**
- `src/domain/entities/Person.ts` - Entidade Person com métodos úteis
- `src/domain/repositories/IPersonRepository.ts` - Interface do repositório

**Infrastructure Layer:**
- `src/infrastructure/repositories/PersonRepository.ts` - Implementação do repositório

**Presentation Layer:**
- `src/store/people.ts` - Store do Pinia para gerenciar estado de pessoas

#### Funcionalidades Implementadas:

- ✅ Listar todas as pessoas (com paginação)
- ✅ Buscar pessoa por ID
- ✅ Buscar pessoa por CPF
- ✅ Pesquisar pessoas por termo (nome, CPF, email)
- ✅ Criar nova pessoa
- ✅ Atualizar dados de pessoa
- ✅ Deletar pessoa (soft delete)
- ✅ Listar dependentes de um responsável

---

### 2. Login com CPF ou Email

O sistema agora permite que usuários façam login usando CPF ou Email.

#### Arquivos Modificados:

**Validators:**
- `src/shared/utils/validators.ts`
  - Adicionada função `isValidEmailOrCPF()` que valida automaticamente se o valor é CPF ou Email

**Login Page:**
- `src/presentation/pages/LoginPage.vue`
  - Campo de email alterado para "Email ou CPF"
  - Validação adaptada para aceitar ambos os formatos
  - Ícone alterado para `mdi-account` (mais genérico)
  - Adicionado hint "Digite seu email ou CPF"

---

## 🔧 Detalhes Técnicos

### Entidade Person

```typescript
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
```

**Métodos úteis:**
- `isActive()` - Verifica se a pessoa está ativa
- `hasResponsible()` - Verifica se possui responsável
- `hasEmail()` - Verifica se possui email
- `hasPhone()` - Verifica se possui telefone
- `getAge()` - Calcula idade baseada na data de nascimento
- `isMinor()` - Verifica se é menor de 18 anos
- `formatCpf()` - Formata CPF (123.456.789-01)
- `formatPhone()` - Formata telefone ((11) 99999-9999)

### Store do Pinia - People

**State:**
- `people` - Lista de pessoas
- `currentPerson` - Pessoa atualmente selecionada
- `dependents` - Lista de dependentes
- `loading` - Estado de carregamento
- `error` - Mensagem de erro
- `total`, `page`, `limit`, `totalPages` - Dados de paginação

**Getters:**
- `activePeople` - Filtra apenas pessoas ativas
- `inactivePeople` - Filtra apenas pessoas inativas
- `hasError` - Verifica se há erro

**Actions:**
- `fetchPeople()` - Buscar todas as pessoas
- `fetchPersonById()` - Buscar por ID
- `fetchPersonByCpf()` - Buscar por CPF
- `searchPeople()` - Pesquisar pessoas
- `createPerson()` - Criar nova pessoa
- `updatePerson()` - Atualizar pessoa
- `deletePerson()` - Deletar pessoa
- `fetchDependents()` - Buscar dependentes
- `clearError()`, `clearCurrentPerson()`, `clearDependents()`, `resetState()` - Utilitários

### Validação de Login

A função `isValidEmailOrCPF()` funciona da seguinte forma:

1. Remove todos os caracteres não numéricos
2. Se tiver exatamente 11 dígitos → valida como CPF
3. Caso contrário → valida como Email

```typescript
export function isValidEmailOrCPF(value: string): boolean {
  const cleanValue = value.replace(/\D/g, '')

  // Se tiver exatamente 11 dígitos, valida como CPF
  if (cleanValue.length === 11) {
    return isValidCPF(value)
  }

  // Caso contrário, valida como email
  return isValidEmail(value)
}
```

---

## 🌐 Integração com Backend

### Endpoint de Login

O endpoint `/auth/login` aceita CPF ou Email no campo `email`:

```typescript
// Login com Email
await authStore.login({
  email: 'usuario@example.com',
  password: 'senha123'
})

// Login com CPF (com ou sem formatação)
await authStore.login({
  email: '12345678901',
  password: 'senha123'
})

await authStore.login({
  email: '123.456.789-01',
  password: 'senha123'
})
```

### Endpoints de Pessoas

Todos os endpoints estão implementados conforme a documentação da API:

- `GET /people` - Listar pessoas
- `GET /people/:id` - Buscar por ID
- `GET /people/cpf/:cpf` - Buscar por CPF
- `GET /people/search?q=termo` - Pesquisar
- `POST /people` - Criar pessoa
- `PUT /people/:id` - Atualizar pessoa
- `DELETE /people/:id` - Deletar pessoa
- `GET /people/:id/dependents` - Listar dependentes

---

## 📋 Como Usar

### Exemplo: Usar a Store de Pessoas

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { usePeopleStore } from '@/store/people'

const peopleStore = usePeopleStore()

onMounted(async () => {
  // Buscar todas as pessoas (página 1, 20 por página, apenas ativas)
  await peopleStore.fetchPeople(1, 20, true)

  // Pesquisar por termo
  await peopleStore.searchPeople('João')

  // Buscar por CPF
  const person = await peopleStore.fetchPersonByCpf('12345678901')

  // Criar nova pessoa
  await peopleStore.createPerson({
    name: 'Maria Silva',
    cpf: '98765432100',
    email: 'maria@example.com',
    phone: '11999999999',
    birthDate: '2010-05-15'
  })
})
</script>

<template>
  <div>
    <div v-if="peopleStore.loading">Carregando...</div>
    <div v-else-if="peopleStore.error">{{ peopleStore.error }}</div>
    <ul v-else>
      <li v-for="person in peopleStore.people" :key="person.id">
        {{ person.name }} - {{ person.cpf }}
      </li>
    </ul>
  </div>
</template>
```

### Exemplo: Login com CPF ou Email

O usuário pode digitar CPF ou Email no campo de login:

```
Email: usuario@example.com → Válido ✓
CPF: 12345678901 → Válido ✓
CPF: 123.456.789-01 → Válido ✓
Inválido: abc123 → Inválido ✗
```

---

## ✅ Testes Realizados

- ✅ Build de produção executado com sucesso
- ✅ TypeScript sem erros de compilação
- ✅ Validação de CPF funcionando
- ✅ Validação de Email funcionando
- ✅ Validação híbrida (Email ou CPF) funcionando

---

## 🚀 Próximos Passos

Para completar a integração do módulo de Pessoas, considere implementar:

1. **Página de Gerenciamento de Pessoas**
   - Lista de pessoas com tabela
   - Formulário de criação/edição
   - Busca e filtros
   - Visualização de dependentes

2. **Integração com Clientes**
   - Vincular cliente a uma pessoa via CPF
   - Sincronização de dados pessoais

3. **Validações Adicionais**
   - Verificar se CPF já existe antes de criar
   - Validar data de nascimento
   - Validar telefone brasileiro

4. **Melhorias de UX**
   - Máscara de CPF no campo de login
   - Auto-completar dados ao buscar CPF
   - Indicador visual de CPF vs Email

---

## 📚 Referências

- [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md) - Documentação completa da API
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/introduction.html)
- [Vuetify 3](https://vuetifyjs.com/)

---

**Desenvolvido com:** Vue 3 + TypeScript + Vuetify 3 + Pinia
**Arquitetura:** Clean Architecture
**Status:** ✅ Implementado e Testado
