# Documentação da UI - CantinaSoft

## ✅ Componentes Criados

### 🎨 Layout e Navegação

#### 1. **DefaultLayout.vue** (`src/presentation/layouts/`)
Layout principal da aplicação que contém:
- AppBar no topo
- NavigationDrawer lateral
- Container para conteúdo principal
- Sistema de notificações

#### 2. **AppBar.vue** (`src/presentation/components/`)
Barra de navegação superior com:
- ✅ Toggle do drawer de navegação
- ✅ Logo e nome da aplicação
- ✅ Seletor de idioma (PT-BR / EN-US)
- ✅ Toggle de tema (Dark/Light)
- ✅ Menu do usuário com:
  - Avatar com iniciais
  - Nome e email
  - Perfil
  - Configurações
  - Logout

#### 3. **NavigationDrawer.vue** (`src/presentation/components/`)
Menu lateral com:
- ✅ Modo expandido e contraído (rail)
- ✅ Itens de menu dinâmicos baseados em permissões
- ✅ Ícones para cada seção
- ✅ Highlight do item ativo
- ✅ Totalmente responsivo

**Itens do Menu:**
- Dashboard
- Clientes (admin/manager)
- Produtos (admin/manager)
- Categorias (admin/manager)
- Vendas (admin/manager)
- Inventário (admin/manager)
- Relatórios (admin/manager)

#### 4. **NotificationContainer.vue** (`src/presentation/components/`)
Sistema de notificações toast com:
- ✅ Posicionamento no canto superior direito
- ✅ 4 tipos: success, error, warning, info
- ✅ Cores diferentes por tipo
- ✅ Auto-dismiss configurável
- ✅ Botão para fechar manualmente
- ✅ Suporte a múltiplas notificações

### 📄 Páginas Principais

#### 1. **HomePage.vue** (`src/presentation/pages/`)
Página inicial pública com:
- ✅ Logo grande centralizado
- ✅ Título e descrição do sistema
- ✅ Cards apresentando funcionalidades (Vendas, Clientes, Inventário)
- ✅ Botão de login destacado
- ✅ Toggle de idioma e tema
- ✅ Versão do sistema

#### 2. **LoginPage.vue** (`src/presentation/pages/`)
Página de autenticação com:
- ✅ Formulário de login centralizado
- ✅ Campos de email e senha
- ✅ Validação em tempo real
- ✅ Toggle para mostrar/ocultar senha
- ✅ Checkbox "Lembrar de mim"
- ✅ Link "Esqueceu sua senha?"
- ✅ Loading state durante autenticação
- ✅ Exibição de erros
- ✅ Toggle de idioma e tema
- ✅ Totalmente responsivo

**Validações:**
- Email obrigatório e formato válido
- Senha obrigatória e mínimo 6 caracteres

#### 3. **DashboardPage.vue** (`src/presentation/pages/`)
Dashboard principal com:
- ✅ Mensagem de boas-vindas personalizada
- ✅ 4 cards de estatísticas:
  - Vendas de hoje
  - Total de clientes
  - Itens com estoque baixo
  - Vendas recentes
- ✅ Cards de ações rápidas:
  - Nova venda
  - Novo cliente
  - Novo produto
  - Ver relatórios
- ✅ Tabela de vendas recentes
- ✅ Lista de itens com estoque baixo
- ✅ Totalmente responsivo

### 🔧 Componentes Reutilizáveis

#### 1. **DataTable.vue** (`src/presentation/components/`)
Tabela de dados reutilizável com:
- ✅ Título customizável
- ✅ Campo de busca integrado
- ✅ Suporte a slots para customização
- ✅ Ações de visualizar, editar e deletar
- ✅ Paginação
- ✅ Loading state
- ✅ Responsivo

**Props:**
```typescript
{
  title?: string
  headers: any[]
  items: any[]
  loading?: boolean
  searchable?: boolean
  itemsPerPage?: number
  page?: number
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}
```

**Eventos:**
- `@view` - Quando clica em visualizar
- `@edit` - Quando clica em editar
- `@delete` - Quando clica em deletar

#### 2. **ConfirmDialog.vue** (`src/presentation/components/`)
Dialog de confirmação com:
- ✅ Título customizável
- ✅ Mensagem customizável
- ✅ Textos dos botões customizáveis
- ✅ Cor do botão de confirmação customizável
- ✅ Modo persistente (não fecha ao clicar fora)

**Props:**
```typescript
{
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  confirmColor?: string
}
```

**Uso:**
```vue
<ConfirmDialog
  v-model="showDialog"
  :message="t('customer.deleteConfirm')"
  confirm-color="error"
  @confirm="handleDelete"
/>
```

#### 3. **LoadingOverlay.vue** (`src/presentation/components/`)
Overlay de loading com:
- ✅ Spinner circular
- ✅ Mensagem opcional
- ✅ Overlay fullscreen
- ✅ Persistente (não fecha ao clicar)

**Props:**
```typescript
{
  message?: string
}
```

## 🌐 Internacionalização (i18n)

### Configuração

Localizado em `src/i18n/index.ts`

### Idiomas Suportados

1. **Português (Brasil)** - `pt-BR` (padrão)
2. **Inglês (Estados Unidos)** - `en-US`

### Arquivos de Tradução

- `src/i18n/locales/pt-BR.json`
- `src/i18n/locales/en-US.json`

### Categorias de Tradução

- ✅ **app** - Informações do app
- ✅ **common** - Textos comuns
- ✅ **auth** - Autenticação
- ✅ **nav** - Navegação
- ✅ **customer** - Clientes
- ✅ **product** - Produtos
- ✅ **category** - Categorias
- ✅ **sale** - Vendas
- ✅ **inventory** - Inventário
- ✅ **report** - Relatórios
- ✅ **settings** - Configurações
- ✅ **dashboard** - Dashboard
- ✅ **paymentMethod** - Métodos de pagamento
- ✅ **saleStatus** - Status de vendas
- ✅ **userRole** - Papéis de usuário
- ✅ **validation** - Mensagens de validação
- ✅ **error** - Mensagens de erro

### Uso nos Componentes

```vue
<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>{{ t('customer.title') }}</div>
</template>
```

### Composable useLocale

```typescript
import { useLocale } from '@/composables/useLocale'

const { currentLocale, setLocale, toggleLocale } = useLocale()

// Mudar para inglês
setLocale('en-US')

// Alternar entre idiomas
toggleLocale()
```

## 🎨 Temas (Dark/Light)

### Configuração

O Vuetify já vem configurado com suporte a temas dark e light.

### Composable useTheme

```typescript
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, setTheme } = useTheme()

// Alternar tema
toggleTheme()

// Definir tema específico
setTheme('dark')
setTheme('light')
```

### Persistência

O tema escolhido é salvo no `localStorage` e restaurado ao recarregar a página.

## 📱 Responsividade

Todos os componentes são totalmente responsivos usando o sistema de grid do Vuetify:

### Breakpoints do Vuetify

- **xs** - Extra small (< 600px)
- **sm** - Small (600px - 960px)
- **md** - Medium (960px - 1264px)
- **lg** - Large (1264px - 1904px)
- **xl** - Extra large (> 1904px)

### Exemplos de Uso

```vue
<!-- Grid responsivo -->
<v-row>
  <v-col cols="12" sm="6" md="4" lg="3">
    <!-- Conteúdo -->
  </v-col>
</v-row>

<!-- Display responsivo -->
<div class="d-none d-md-block">
  <!-- Visível apenas em telas médias e maiores -->
</div>
```

## 🔒 Controle de Acesso na UI

### Verificação de Permissões

```vue
<script setup>
import { useAuthStore } from '@/store/auth'

const authStore = useAuthStore()
</script>

<template>
  <!-- Apenas para admin/manager -->
  <v-btn v-if="authStore.canManageProducts">
    Gerenciar Produtos
  </v-btn>

  <!-- Apenas para admin -->
  <v-btn v-if="authStore.isAdmin">
    Configurações
  </v-btn>
</template>
```

### Permissões Disponíveis

- `isAuthenticated` - Usuário está logado
- `isAdmin` - É administrador
- `isManager` - É gerente
- `canManageProducts` - Pode gerenciar produtos
- `canManageSales` - Pode gerenciar vendas
- `canManageInventory` - Pode gerenciar inventário
- `canViewReports` - Pode ver relatórios

## 🎯 Estrutura de Arquivos

```
src/
├── i18n/                      # Internacionalização
│   ├── index.ts
│   └── locales/
│       ├── pt-BR.json
│       └── en-US.json
├── composables/               # Composables Vue
│   ├── useApi.ts
│   ├── useNotification.ts
│   ├── useTheme.ts
│   └── useLocale.ts
├── presentation/              # Camada de apresentação
│   ├── layouts/
│   │   └── DefaultLayout.vue
│   ├── components/
│   │   ├── AppBar.vue
│   │   ├── NavigationDrawer.vue
│   │   ├── NotificationContainer.vue
│   │   ├── DataTable.vue
│   │   ├── ConfirmDialog.vue
│   │   └── LoadingOverlay.vue
│   └── pages/
│       ├── HomePage.vue
│       ├── LoginPage.vue
│       └── DashboardPage.vue
└── App.vue                    # Componente raiz
```

## 🚀 Próximas Páginas a Criar

Para completar o sistema, você pode criar as seguintes páginas seguindo o mesmo padrão:

### 1. Clientes
- `CustomersPage.vue` - Lista de clientes com DataTable
- `CustomerDetailPage.vue` - Detalhes e histórico do cliente
- `CustomerFormDialog.vue` - Dialog para criar/editar

### 2. Produtos
- `ProductsPage.vue` - Lista de produtos com DataTable
- `ProductFormDialog.vue` - Dialog para criar/editar

### 3. Categorias
- `CategoriesPage.vue` - Lista de categorias com DataTable
- `CategoryFormDialog.vue` - Dialog para criar/editar

### 4. Vendas
- `SalesPage.vue` - Lista de vendas com DataTable
- `NewSalePage.vue` - PDV (Ponto de Venda)
- `SaleDetailPage.vue` - Detalhes da venda

### 5. Inventário
- `InventoryPage.vue` - Lista de inventário com DataTable
- `InventoryMovementDialog.vue` - Dialog para movimentações

### 6. Relatórios
- `ReportsPage.vue` - Dashboard de relatórios com gráficos

### 7. Configurações
- `SettingsPage.vue` - Configurações do sistema
- `ProfilePage.vue` - Perfil do usuário

## 📝 Exemplo de Página Completa

```vue
<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h1 class="text-h4">{{ t('customer.title') }}</h1>
        <v-btn color="primary" @click="showFormDialog = true">
          <v-icon start>mdi-plus</v-icon>
          {{ t('customer.new') }}
        </v-btn>
      </v-col>
    </v-row>

    <DataTable
      :title="t('customer.list')"
      :headers="headers"
      :items="customerStore.customers"
      :loading="customerStore.loading"
      @edit="handleEdit"
      @delete="handleDeleteConfirm"
    >
      <template #item.balance="{ item }">
        {{ formatCurrency(item.balance) }}
      </template>
      <template #item.active="{ item }">
        <v-chip :color="item.active ? 'success' : 'error'" size="small">
          {{ item.active ? t('common.active') : t('common.inactive') }}
        </v-chip>
      </template>
    </DataTable>

    <!-- Form Dialog -->
    <CustomerFormDialog v-model="showFormDialog" :customer="selectedCustomer" />

    <!-- Confirm Delete -->
    <ConfirmDialog
      v-model="showDeleteDialog"
      :message="t('customer.deleteConfirm')"
      confirm-color="error"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCustomerStore } from '@/store/customer'
import { useNotification } from '@/composables/useNotification'
import { formatCurrency } from '@/shared/utils/formatters'
import DataTable from '@/presentation/components/DataTable.vue'
import ConfirmDialog from '@/presentation/components/ConfirmDialog.vue'
import CustomerFormDialog from '../components/CustomerFormDialog.vue'

const { t } = useI18n()
const customerStore = useCustomerStore()
const { success, error } = useNotification()

const showFormDialog = ref(false)
const showDeleteDialog = ref(false)
const selectedCustomer = ref(null)

const headers = [
  { title: t('customer.name'), key: 'name' },
  { title: t('customer.email'), key: 'email' },
  { title: t('customer.studentId'), key: 'studentId' },
  { title: t('customer.balance'), key: 'balance' },
  { title: t('common.status'), key: 'active' },
  { title: t('common.actions'), key: 'actions', sortable: false },
]

onMounted(async () => {
  await customerStore.fetchCustomers()
})

function handleEdit(customer: any) {
  selectedCustomer.value = customer
  showFormDialog.value = true
}

function handleDeleteConfirm(customer: any) {
  selectedCustomer.value = customer
  showDeleteDialog.value = true
}

async function handleDelete() {
  try {
    await customerStore.deleteCustomer(selectedCustomer.value.id)
    success(t('customer.deleteSuccess'))
  } catch (err) {
    error(t('error.generic'))
  }
}
</script>
```

## 🎉 Conclusão

A UI do sistema está completa com:
- ✅ Layout responsivo e moderno
- ✅ Navegação intuitiva
- ✅ Internacionalização (PT-BR e EN-US)
- ✅ Temas Dark e Light
- ✅ Sistema de notificações
- ✅ Componentes reutilizáveis
- ✅ Controle de acesso baseado em roles
- ✅ Páginas principais (Home, Login, Dashboard)

Todos os componentes seguem as melhores práticas do Vue 3 + TypeScript + Vuetify 3!
