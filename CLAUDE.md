# CLAUDE.md — erp-cantina-soft-frontend

ERP para gestão de cantinas escolares. SPA em Vue 3 + TypeScript com Vuetify 3.

## Stack

- **Framework:** Vue.js 3 (Composition API, `<script setup>`)
- **Linguagem:** TypeScript
- **UI:** Vuetify 3 (Material Design 3) + MDI icons (`@mdi/font`)
- **Build:** Vite 5
- **State:** Pinia
- **Roteamento:** Vue Router 4
- **HTTP:** Axios (configurado em `src/infrastructure/http/httpClient.ts`)
- **i18n:** Vue I18n 9 (pt-BR e en-US)
- **Deploy:** Vercel (SPA rewrite em `vercel.json`)
- **Linting/Formatting:** ESLint + Prettier (100 chars, single quotes, 2 spaces, trailing commas ES5)

## Comandos Essenciais

```bash
npm run dev          # Dev server — porta 3000 (requer backend em :3001)
npm run build        # Build de produção → dist/
npm run preview      # Preview do build local
npm run lint         # ESLint com auto-fix
npm run format       # Prettier em src/
npm run type-check   # vue-tsc --noEmit
```

## Estrutura de Pastas

```
src/
├── domain/
│   ├── entities/        # Modelos de dados (User, Product, Customer, etc.)
│   ├── repositories/    # Interfaces de repositório (contratos)
│   └── usecases/        # Casos de uso / lógica de negócio
├── infrastructure/
│   ├── http/            # httpClient.ts — Axios com interceptors
│   └── repositories/    # Implementações dos repositórios (chamam a API)
├── presentation/
│   ├── components/      # Componentes reutilizáveis
│   ├── composables/     # Composables de apresentação
│   ├── layouts/         # DefaultLayout.vue
│   └── pages/           # Páginas roteadas
├── store/               # Stores Pinia (auth, customer, product, etc.)
├── router/              # index.ts — rotas + guards de autenticação
├── composables/         # Composables globais (useTheme, useNotification, useLocale)
├── i18n/locales/        # pt-BR.json, en-US.json
├── plugins/             # Configuração do Vuetify
├── shared/
│   ├── constants/       # Constantes da aplicação
│   ├── types/           # Tipos TypeScript globais
│   └── utils/           # Formatters, validators
├── styles/              # SCSS global
├── App.vue
└── main.ts
```

## Arquitetura (Clean Architecture)

- **Domain:** entidades e interfaces — sem dependências externas
- **Infrastructure:** implementações concretas (HTTP, repositórios)
- **Presentation:** componentes Vue, páginas, layouts
- **Store (Pinia):** estado global; chama repositórios da infraestrutura

## Rotas Disponíveis

| Rota | Página | Acesso |
|------|--------|--------|
| `/` | HomePage | Público |
| `/login` | LoginPage | Público |
| `/dashboard` | DashboardPage | Autenticado |
| `/people` | PeoplePage | admin / manager |
| `/categories` | CategoriesPage | admin / manager |
| `/pdv` | PDVPage | Autenticado |
| `/products` | ProductsPage | admin / manager |
| `/inventory` | InventoryPage | admin / manager |

## Stores Pinia

`auth`, `customer`, `product`, `category`, `sale`, `inventory`, `paymentMethod`, `account`, `people`

Padrão: `defineStore` com Composition API, `ref` para estado, `computed` para getters, `async` actions com loading/error.

## HTTP Client e API

- **Interceptor de request:** injeta `Authorization: Bearer {token}` automaticamente (token do localStorage)
- **Interceptor de response:** desempacota `{ status, data }` → retorna `data` diretamente; trata 401 redirecionando para `/login`
- **Timeout:** 30 segundos
- **Base URL:** `import.meta.env.VITE_API_URL`

Formato esperado do backend:
```typescript
{ status: 'success' | 'error', data: T, message?: string }
```

## Variáveis de Ambiente

```env
# .env (criado a partir de .env.example)
VITE_API_URL=http://localhost:3001
```

Ambientes disponíveis: `.env`, `.env.preview`, `.env.production`

## Convenções de Código

- Componentes Vue: `PascalCase` (ex: `AppBar.vue`, `DataTable.vue`)
- Composables: `camelCase` com prefixo `use` (ex: `useTheme.ts`, `useNotification.ts`)
- Stores: `camelCase` com prefixo `use` (ex: `useAuthStore()`)
- Constantes: `UPPER_SNAKE_CASE`
- Todos os componentes usam `<script setup lang="ts">`
- Props e emits sempre tipados
- Sem `console.log` em produção (ESLint bloqueia)

## Componentes Principais Reutilizáveis

- `AppBar.vue` — header com toggle de idioma, tema e menu do usuário
- `NavigationDrawer.vue` — sidebar de navegação
- `DataTable.vue` — tabela de dados reutilizável
- `ConfirmDialog.vue` — diálogo de confirmação
- `LoadingOverlay.vue` — overlay de carregamento
- `NotificationContainer.vue` — toasts de notificação
- `LowStockWidget.vue` — widget de alertas de estoque baixo
- `StockBadge.vue` — badge de status do estoque

## Composables Globais

- `useTheme()` — alterna dark/light; persiste em localStorage
- `useNotification()` — exibe toasts
- `useLocale()` — alterna idioma (pt-BR / en-US)

## Internacionalização

- Idiomas: `pt-BR` (padrão) e `en-US`
- Arquivos: `src/i18n/locales/pt-BR.json` e `en-US.json`
- Locale persiste em localStorage

## Roles de Usuário

`admin`, `manager`, `responsible`, `customer` — guards de rota verificam role via store de auth.

## Testes

Sem suite de testes configurada.

## Documentação de Referência

- `API_INTEGRATION.md` — guia de integração com o backend
- `AUTHENTICATION_FLOW.md` — fluxo de autenticação
- `UI_DOCUMENTATION.md` — documentação de componentes UI
- `FRONTEND_STATUS.md` — status de implementação e roadmap
