# Fluxo de Autenticação - CantinaSoft Frontend

Este documento explica como funciona o fluxo de autenticação completo do CantinaSoft Frontend.

## Visão Geral

O sistema utiliza autenticação baseada em JWT (JSON Web Token) com integração completa com o backend.

## Componentes Principais

### 1. **LoginPage** (`src/presentation/pages/LoginPage.vue`)
Página de login com formulário validado.

**Funcionalidades:**
- Validação de email e senha
- Exibição de erros da API
- Loading state durante a requisição
- Redirecionamento após login bem-sucedido
- Notificações de sucesso/erro

### 2. **AuthStore** (`src/store/auth.ts`)
Store Pinia que gerencia o estado de autenticação.

**Estado:**
- `user`: Dados do usuário autenticado
- `token`: JWT token
- `loading`: Estado de carregamento
- `error`: Mensagens de erro

**Ações:**
- `login()`: Realiza login via API
- `register()`: Registra novo usuário
- `logout()`: Remove credenciais
- `verifyToken()`: Valida token armazenado
- `initializeFromStorage()`: Carrega do localStorage

### 3. **AuthRepository** (`src/infrastructure/repositories/AuthRepository.ts`)
Camada de infraestrutura que faz as requisições HTTP.

**Endpoints:**
- `POST /auth/login` - Login
- `POST /auth/register` - Registro
- `POST /auth/verify` - Verificação de token

### 4. **HTTP Client** (`src/infrastructure/http/httpClient.ts`)
Cliente HTTP configurado com interceptors.

**Interceptors:**
- Request: Adiciona token JWT automaticamente
- Response: Redireciona para login em 401

### 5. **Router Guards** (`src/router/index.ts`)
Proteção de rotas baseada em autenticação.

## Fluxo de Login Completo

```
1. Usuário acessa /login
   ↓
2. Preenche email e senha
   ↓
3. Clica em "Entrar"
   ↓
4. LoginPage valida o formulário
   ↓
5. Chama authStore.login({ email, password })
   ↓
6. AuthStore chama authRepository.login()
   ↓
7. AuthRepository faz POST /auth/login via httpClient
   ↓
8. Backend processa e retorna { user, token }
   ↓
9. AuthRepository salva token e user no localStorage
   ↓
10. AuthStore atualiza o estado (user, token)
   ↓
11. LoginPage exibe notificação de sucesso
   ↓
12. Router redireciona para /dashboard
   ↓
13. Router guard verifica autenticação
   ↓
14. Usuário acessa o dashboard autenticado
```

## Fluxo de Requisições Autenticadas

Após o login, todas as requisições HTTP incluem automaticamente o token JWT:

```typescript
// Exemplo de requisição
const customers = await httpClient.get('/customers')

// O httpClient automaticamente adiciona:
// headers: { Authorization: 'Bearer eyJhbGc...' }
```

### Interceptor de Request

```typescript
this.client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Interceptor de Response (401)

```typescript
this.client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## Proteção de Rotas

### Router Guard

```typescript
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // Inicializa do localStorage
  if (!authStore.isAuthenticated) {
    authStore.initializeFromStorage()
  }

  // Verifica se a rota requer autenticação
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redireciona para login com query redirect
      next({ name: 'login', query: { redirect: to.fullPath } })
      return
    }

    // Verifica roles específicas
    if (to.meta.roles && Array.isArray(to.meta.roles)) {
      const userRole = authStore.user?.role
      if (!userRole || !to.meta.roles.includes(userRole)) {
        next({ name: 'dashboard' })
        return
      }
    }
  }

  // Se autenticado, não pode acessar login/home
  if ((to.name === 'login' || to.name === 'home') && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
    return
  }

  next()
})
```

### Exemplo de Rota Protegida

```typescript
{
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardPage,
  meta: {
    title: 'Dashboard',
    requiresAuth: true, // Requer autenticação
  },
}
```

### Exemplo de Rota com Roles

```typescript
{
  path: '/customers',
  name: 'customers',
  component: CustomersPage,
  meta: {
    title: 'Clientes',
    requiresAuth: true,
    roles: ['admin', 'manager'], // Apenas admin e manager
  },
}
```

## Validação de Formulário

### Regras de Validação

```typescript
const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Email inválido',
  minLength: (v: string) => v.length >= 6 || 'Senha deve ter no mínimo 6 caracteres',
}
```

### Validação Antes do Submit

```typescript
const handleLogin = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return // Para se inválido

  // Continua com o login...
}
```

## Tratamento de Erros

### Erros da API

```typescript
try {
  await authStore.login({ email, password })
  showSuccess('Login realizado com sucesso!')
  router.push('/dashboard')
} catch (error) {
  // Erro já está em authStore.error
  console.error('Login error:', error)
  showError(authStore.error || 'Erro ao fazer login')
}
```

### Exibição no Template

```vue
<v-alert
  v-if="authStore.error"
  type="error"
  variant="tonal"
  closable
  @click:close="authStore.error = null"
>
  {{ authStore.error }}
</v-alert>
```

## Estados de Loading

### Durante Login

```vue
<v-btn
  type="submit"
  :loading="authStore.loading"
  :disabled="authStore.loading"
>
  Entrar
</v-btn>

<v-text-field
  v-model="email"
  :disabled="authStore.loading"
/>
```

## Persistência de Sessão

### Salvando no localStorage

```typescript
async login(credentials: LoginDTO) {
  const response = await httpClient.post('/auth/login', credentials)
  if (response.token) {
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
  }
  return response
}
```

### Carregando na Inicialização

```typescript
function initializeFromStorage() {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (storedToken && storedUser) {
    token.value = storedToken
    user.value = JSON.parse(storedUser)
  }
}
```

### Limpando no Logout

```typescript
function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  user.value = null
  token.value = null
  error.value = null
}
```

## Redirecionamento Inteligente

### Após Login

```typescript
// Se o usuário tentou acessar /customers mas foi redirecionado para login
// Após autenticar, volta para /customers
const redirectTo = (route.query.redirect as string) || '/dashboard'
router.push(redirectTo)
```

### Exemplo de Fluxo

```
1. Usuário (não autenticado) tenta acessar /customers
   ↓
2. Router guard redireciona para /login?redirect=/customers
   ↓
3. Usuário faz login
   ↓
4. Sistema redireciona para /customers (da query redirect)
```

## Verificação de Roles

### No Template

```vue
<v-btn v-if="authStore.isAdmin">
  Gerenciar Usuários
</v-btn>

<v-btn v-if="authStore.canManageProducts">
  Adicionar Produto
</v-btn>
```

### Computeds Disponíveis

```typescript
const isAuthenticated = computed(() => !!token.value && !!user.value)
const isAdmin = computed(() => user.value?.role === 'admin')
const isManager = computed(() => user.value?.role === 'manager')
const canManageProducts = computed(() =>
  user.value?.role === 'admin' || user.value?.role === 'manager'
)
```

## Testando o Fluxo

### Teste Manual

1. Acesse http://localhost:3000
2. Clique em "Acessar Sistema" na landing page
3. Preencha email e senha
4. Observe no DevTools → Network:
   - Request para `POST /auth/login`
   - Response com `{ user, token }`
5. Observe no DevTools → Application → Local Storage:
   - `token`: JWT token
   - `user`: JSON do usuário
6. Após login, você é redirecionado para `/dashboard`
7. Se tentar acessar `/login` novamente, é redirecionado para `/dashboard`

### Console Logs

No console do browser você verá:

```
🌐 API URL configured: http://localhost:3001
Login realizado com sucesso!
```

### Network Tab

Procure por:
- **Request URL**: `http://localhost:3001/auth/login`
- **Method**: POST
- **Payload**: `{ email: "...", password: "..." }`
- **Response**: `{ user: {...}, token: "..." }`

## Troubleshooting

### Erro: "VITE_API_URL not configured"

**Solução**: Configure o arquivo `.env`
```bash
cp .env.example .env
```

### Erro 401 na requisição de login

**Possíveis causas:**
1. Backend não está rodando
2. URL do backend incorreta
3. Credenciais inválidas

**Verificar:**
```bash
# No console do browser
console.log(import.meta.env.VITE_API_URL)
```

### Token não está sendo enviado

**Verificar:**
1. Token está no localStorage?
2. Interceptor está configurado?
3. Veja no Network Tab se o header `Authorization` está presente

### Redirecionamento infinito

**Causa**: Loop entre login e dashboard

**Solução**: Verificar router guards e estado de autenticação

### Logout não funciona

**Verificar:**
1. `authStore.logout()` está sendo chamado?
2. localStorage está sendo limpo?
3. Página está recarregando ou redirecionando?

## Segurança

### Boas Práticas Implementadas

1. ✅ Token JWT armazenado no localStorage
2. ✅ HTTPS em produção (Vercel)
3. ✅ Validação de formulário no frontend
4. ✅ Interceptor para adicionar token automaticamente
5. ✅ Logout em 401 (token expirado/inválido)
6. ✅ Router guards para proteção de rotas
7. ✅ Verificação de roles

### O que NÃO fazer

1. ❌ Nunca armazene senhas no frontend
2. ❌ Nunca faça validação apenas no frontend
3. ❌ Nunca confie apenas no token do localStorage (sempre valide no backend)
4. ❌ Nunca exponha informações sensíveis no console em produção

## Próximas Melhorias

Possíveis melhorias futuras:

1. **Refresh Token**: Renovar token automaticamente antes de expirar
2. **Remember Me**: Opção para manter login por mais tempo
3. **2FA**: Autenticação de dois fatores
4. **Password Recovery**: Recuperação de senha via email
5. **Session Timeout**: Logout automático após inatividade
6. **Multiple Tabs**: Sincronizar estado entre abas

## Referências

- **Pinia Store**: https://pinia.vuejs.org/
- **Vue Router**: https://router.vuejs.org/
- **Axios Interceptors**: https://axios-http.com/docs/interceptors
- **JWT**: https://jwt.io/
