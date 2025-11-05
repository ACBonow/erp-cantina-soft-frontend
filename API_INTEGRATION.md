# Documentação de Integração com Backend - CantinaSoft

## Estrutura do Projeto

O projeto segue a arquitetura Clean Architecture com as seguintes camadas:

```
src/
├── domain/              # Camada de domínio
│   ├── entities/        # Entidades de negócio
│   └── repositories/    # Interfaces dos repositórios
├── infrastructure/      # Camada de infraestrutura
│   ├── http/           # Cliente HTTP (Axios)
│   └── repositories/   # Implementação dos repositórios
├── store/              # Stores Pinia (gerenciamento de estado)
├── composables/        # Composables reutilizáveis
└── shared/             # Recursos compartilhados
    ├── types/          # Tipos TypeScript
    ├── constants/      # Constantes
    └── utils/          # Utilitários (formatters, validators)
```

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://your-api-domain.com/api/v1
```

### 2. Cliente HTTP

O cliente HTTP está configurado em `src/infrastructure/http/httpClient.ts`:

- Intercepta requisições para adicionar token JWT automaticamente
- Intercepta respostas para tratar erros 401 (redirect para login)
- Timeout padrão: 30 segundos
- Base URL configurada via variável de ambiente

## Uso das Stores

### Auth Store

```typescript
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()

// Login
await authStore.login({ email: 'user@example.com', password: '123456' })

// Verificar autenticação
if (authStore.isAuthenticated) {
  console.log('Usuário logado:', authStore.user)
}

// Verificar permissões
if (authStore.canManageProducts) {
  // Usuário pode gerenciar produtos
}

// Logout
authStore.logout()
```

### Customer Store

```typescript
import { useCustomerStore } from '@/store/customer'

const customerStore = useCustomerStore()

// Buscar clientes com paginação
await customerStore.fetchCustomers({ page: 1, limit: 10 })
console.log(customerStore.customers)

// Buscar cliente por ID
await customerStore.fetchCustomerById('customer-id')
console.log(customerStore.currentCustomer)

// Criar cliente
await customerStore.createCustomer({
  name: 'João Silva',
  email: 'joao@example.com',
  cpf: '12345678901',
  phone: '11999999999',
  studentId: '2024001',
})

// Adicionar crédito
await customerStore.addCredit('customer-id', {
  amount: 50,
  description: 'Recarga mensal',
})

// Buscar histórico de saldo
await customerStore.fetchBalanceHistory('customer-id')
console.log(customerStore.balanceHistory)

// Buscar vendas do cliente
await customerStore.fetchCustomerSales('customer-id')
console.log(customerStore.customerSales)
```

### Product Store

```typescript
import { useProductStore } from '@/store/product'

const productStore = useProductStore()

// Buscar produtos
await productStore.fetchProducts({ page: 1, limit: 10, active: true })

// Filtrar por categoria
await productStore.fetchProducts({ categoryId: 'category-id' })

// Criar produto
await productStore.createProduct({
  name: 'Suco de Laranja',
  description: '300ml',
  price: 5.0,
  cost: 2.5,
  categoryId: 'category-id',
})

// Buscar categorias
await productStore.fetchCategories()

// Criar categoria
await productStore.createCategory({
  name: 'Bebidas',
  description: 'Bebidas naturais e industrializadas',
})
```

### Sale Store

```typescript
import { useSaleStore } from '@/store/sale'

const saleStore = useSaleStore()

// Buscar vendas
await saleStore.fetchSales({ page: 1, limit: 10 })

// Filtrar por cliente
await saleStore.fetchSales({ customerId: 'customer-id' })

// Filtrar por data
await saleStore.fetchSales({
  startDate: '2025-01-01',
  endDate: '2025-12-31',
})

// Criar venda
await saleStore.createSale({
  customerId: 'customer-id',
  paymentMethod: 'credit',
  items: [
    { productId: 'product-id-1', quantity: 2 },
    { productId: 'product-id-2', quantity: 1 },
  ],
})

// Cancelar venda
await saleStore.cancelSale('sale-id')

// Buscar resumo de vendas
await saleStore.fetchSalesSummary({
  startDate: '2025-01-01',
  endDate: '2025-12-31',
})
console.log(saleStore.summary)
```

### Inventory Store

```typescript
import { useInventoryStore } from '@/store/inventory'

const inventoryStore = useInventoryStore()

// Buscar inventário
await inventoryStore.fetchInventory({ page: 1, limit: 10 })

// Buscar por produto
await inventoryStore.fetchInventoryByProductId('product-id')

// Buscar itens com estoque baixo
await inventoryStore.fetchLowStockItems()
console.log(inventoryStore.lowStockItems)

// Buscar relatório
await inventoryStore.fetchInventoryReport()
console.log(inventoryStore.report)

// Reabastecer
await inventoryStore.restockInventory({
  inventoryId: 'inventory-id',
  type: 'restock',
  quantity: 50,
  reason: 'Reabastecimento mensal',
})

// Ajustar estoque
await inventoryStore.adjustInventory({
  inventoryId: 'inventory-id',
  type: 'adjustment',
  quantity: -5,
  reason: 'Ajuste de inventário',
})

// Registrar perda
await inventoryStore.registerLoss({
  inventoryId: 'inventory-id',
  type: 'loss',
  quantity: 3,
  reason: 'Produto vencido',
})

// Buscar movimentações
await inventoryStore.fetchMovements('inventory-id')
console.log(inventoryStore.movements)
```

## Uso dos Composables

### useApi

```typescript
import { useApi } from '@/composables/useApi'
import { customerRepository } from '@/infrastructure/repositories/CustomerRepository'

const { data, loading, error, execute } = useApi(
  () => customerRepository.getAll({ page: 1, limit: 10 }),
  {
    immediate: true, // Executar imediatamente
    onSuccess: (data) => {
      console.log('Sucesso:', data)
    },
    onError: (error) => {
      console.error('Erro:', error)
    },
  },
)

// Executar manualmente
await execute()
```

### useNotification

```typescript
import { useNotification } from '@/composables/useNotification'

const { success, error, warning, info } = useNotification()

// Exibir notificações
success('Cliente cadastrado com sucesso!')
error('Erro ao processar requisição')
warning('Estoque baixo!')
info('Carregando dados...')
```

## Utilitários

### Formatters

```typescript
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  formatCPF,
  formatPhone,
  removeMask,
  truncateText,
} from '@/shared/utils/formatters'

formatDate('2025-01-15T12:30:00') // "15/01/2025"
formatDateTime('2025-01-15T12:30:00') // "15/01/2025 12:30"
formatCurrency(1250.5) // "R$ 1.250,50"
formatCPF('12345678901') // "123.456.789-01"
formatPhone('11999999999') // "(11) 99999-9999"
removeMask('123.456.789-01') // "12345678901"
truncateText('Texto muito longo', 10) // "Texto muit..."
```

### Validators

```typescript
import {
  isValidEmail,
  isValidCPF,
  isValidPhone,
  isValidPassword,
  isPositiveNumber,
  isValidDate,
} from '@/shared/utils/validators'

isValidEmail('user@example.com') // true
isValidCPF('12345678901') // true/false (valida dígitos)
isValidPhone('11999999999') // true
isValidPassword('123456') // true (mínimo 6 caracteres)
isPositiveNumber(10) // true
isValidDate('2025-01-15') // true
```

## Constantes

```typescript
import {
  USER_ROLES,
  USER_ROLE_LABELS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  SALE_STATUS,
  SALE_STATUS_LABELS,
  SALE_STATUS_COLORS,
  MOVEMENT_TYPES,
  MOVEMENT_TYPE_LABELS,
  BALANCE_TYPES,
  BALANCE_TYPE_LABELS,
  ROUTES,
  STORAGE_KEYS,
} from '@/shared/constants'

// Exemplo de uso
const roleLabel = USER_ROLE_LABELS[user.role] // "Administrador"
const paymentLabel = PAYMENT_METHOD_LABELS['credit'] // "Crédito"
const statusColor = SALE_STATUS_COLORS['completed'] // "success"
```

## Gerenciamento de Rotas

As rotas estão configuradas com guards de autenticação e autorização:

```typescript
// Rotas protegidas requerem autenticação
{
  path: '/dashboard',
  meta: { requiresAuth: true }
}

// Rotas com controle de acesso por role
{
  path: '/customers',
  meta: { requiresAuth: true, roles: ['admin', 'manager'] }
}
```

## Tratamento de Erros

Todas as stores já possuem tratamento de erros integrado:

```typescript
try {
  await customerStore.createCustomer(data)
  // Sucesso
} catch (error) {
  // Erro já foi capturado e armazenado em customerStore.error
  console.error(customerStore.error)
}
```

## Estados de Loading

Todas as stores possuem estado de loading:

```vue
<template>
  <div v-if="customerStore.loading">Carregando...</div>
  <div v-else>
    <!-- Conteúdo -->
  </div>
</template>

<script setup>
import { useCustomerStore } from '@/store/customer'
const customerStore = useCustomerStore()
</script>
```

## Exemplo Completo de Componente

```vue
<template>
  <div>
    <h1>Clientes</h1>

    <div v-if="loading">Carregando...</div>

    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <button @click="handleCreate">Novo Cliente</button>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Saldo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ formatCurrency(customer.balance) }}</td>
            <td>
              <button @click="handleEdit(customer)">Editar</button>
              <button @click="handleDelete(customer.id)">Deletar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button :disabled="pagination.page === 1" @click="handlePrevPage">Anterior</button>
        <span>Página {{ pagination.page }} de {{ pagination.totalPages }}</span>
        <button :disabled="pagination.page >= pagination.totalPages" @click="handleNextPage">
          Próxima
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useCustomerStore } from '@/store/customer'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/shared/utils/formatters'

const customerStore = useCustomerStore()
const { success, error: notifyError } = useNotification()

const customers = computed(() => customerStore.customers)
const loading = computed(() => customerStore.loading)
const error = computed(() => customerStore.error)
const pagination = computed(() => customerStore.pagination)

onMounted(async () => {
  await loadCustomers()
})

async function loadCustomers() {
  try {
    await customerStore.fetchCustomers({ page: pagination.value.page, limit: 10 })
  } catch (err) {
    notifyError('Erro ao carregar clientes')
  }
}

function handleCreate() {
  // Abrir modal/dialog para criar cliente
}

function handleEdit(customer) {
  // Abrir modal/dialog para editar cliente
}

async function handleDelete(id: string) {
  if (confirm('Deseja realmente deletar este cliente?')) {
    try {
      await customerStore.deleteCustomer(id)
      success('Cliente deletado com sucesso!')
    } catch (err) {
      notifyError('Erro ao deletar cliente')
    }
  }
}

async function handlePrevPage() {
  await customerStore.fetchCustomers({ page: pagination.value.page - 1, limit: 10 })
}

async function handleNextPage() {
  await customerStore.fetchCustomers({ page: pagination.value.page + 1, limit: 10 })
}
</script>
```

## Próximos Passos

1. Criar os componentes de UI (views) para cada módulo
2. Implementar formulários com validação
3. Adicionar testes unitários
4. Implementar paginação e filtros avançados
5. Adicionar suporte a upload de imagens
6. Implementar relatórios com gráficos
7. Adicionar internacionalização (i18n)
8. Implementar temas customizáveis

## Observações Importantes

- Todas as requisições que requerem autenticação automaticamente incluem o token JWT
- O token é armazenado no localStorage
- Em caso de token expirado (401), o usuário é redirecionado para login automaticamente
- Todos os erros são tratados e armazenados nas stores
- Use os composables para facilitar o desenvolvimento de componentes reativos
- Siga a estrutura de Clean Architecture ao adicionar novos recursos
