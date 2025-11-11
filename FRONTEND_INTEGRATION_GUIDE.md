# 🚀 Guia de Integração Frontend - CantinaSoft API

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Endpoints Principais](#endpoints-principais)
  - [1. Autenticação](#1-autenticação)
  - [2. Pessoas](#2-pessoas-people)
  - [3. Clientes](#3-clientes)
  - [4. Produtos e Categorias](#4-produtos-e-categorias)
  - [5. Formas de Pagamento](#5-formas-de-pagamento)
  - [6. Contas (Accounts)](#6-contas-accounts)
  - [7. Vendas](#7-vendas)
  - [8. Inventário](#8-inventário)
  - [9. Utilitários](#9-utilitários)
- [Estrutura de Respostas](#estrutura-de-respostas)
- [Tratamento de Erros](#tratamento-de-erros)
- [Exemplos de Integração](#exemplos-de-integração)
- [Notas Importantes](#notas-importantes)
  - [Login com CPF](#login-com-cpf)
  - [Módulo de Pessoas vs Clientes vs Contas](#módulo-de-pessoas-vs-clientes-vs-contas)
  - [Sistema de Contas Compartilhadas](#sistema-de-contas-compartilhadas)

---

## 🌐 Visão Geral

### Informações Básicas

- **Base URL**: `https://your-api-domain.com/api/v1`
- **Formato**: JSON
- **Autenticação**: JWT Bearer Token
- **Charset**: UTF-8

### Headers Padrão

```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_JWT_TOKEN'  // Exceto rotas públicas
}
```

---

## 🔐 Autenticação

### Como Funciona

1. Faça login com email e senha
2. Receba o token JWT
3. Armazene o token (localStorage, sessionStorage ou cookie)
4. Envie o token em todas as requisições autenticadas

### Roles (Papéis) Disponíveis

| Role | Descrição | Permissões |
|------|-----------|------------|
| `admin` | Administrador | Acesso total ao sistema |
| `manager` | Gerente | Criar/editar produtos, vendas, clientes |
| `responsible` | Responsável | Visualizar e gerenciar clientes vinculados |
| `customer` | Cliente/Aluno | Visualizar próprias informações |

---

## 📡 Endpoints Principais

### 1. Autenticação

#### 🔓 Login
```http
POST /api/v1/auth/login
```

**IMPORTANTE**: O campo `email` aceita tanto email quanto CPF. O sistema detecta automaticamente o tipo de identificador.

**Request com Email:**
```json
{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

**Request com CPF:**
```json
{
  "email": "12345678901",
  "password": "senha123"
}
```

**Nota**: O CPF pode ser enviado com ou sem formatação (123.456.789-01 ou 12345678901)

**Response (200):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "email": "joao@example.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

**Exemplo JavaScript (Login com Email ou CPF):**
```javascript
async function login(emailOrCpf, password) {
  const response = await fetch('https://api.example.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: emailOrCpf,  // Pode ser email ou CPF
      password
    })
  });

  const data = await response.json();

  if (response.ok) {
    // Armazene o token
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } else {
    throw new Error(data.message);
  }
}

// Uso:
// Login com email
await login('usuario@example.com', 'senha123');

// Login com CPF (com ou sem formatação)
await login('12345678901', 'senha123');
await login('123.456.789-01', 'senha123');
```

#### 📝 Registro
```http
POST /api/v1/auth/register
```

**Request:**
```json
{
  "name": "Maria Santos",
  "email": "maria@example.com",
  "password": "senha123",
  "cpf": "12345678901",
  "phone": "11999999999",
  "role": "customer"
}
```

#### ✅ Verificar Token
```http
POST /api/v1/auth/verify
```

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Pessoas (People)

O módulo de Pessoas (`/api/v1/people`) gerencia os dados pessoais de todos os usuários do sistema, incluindo responsáveis e seus dependentes. Este módulo é fundamental para vincular pessoas físicas aos usuários do sistema.

#### 📋 Listar Todas as Pessoas
```http
GET /api/v1/people?page=1&limit=10&activeOnly=true
```
**Permissões**: Requer autenticação

**Query Parameters:**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)
- `activeOnly` (opcional): Filtrar apenas pessoas ativas (padrão: true)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "people": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "João Silva",
        "cpf": "12345678901",
        "email": "joao@example.com",
        "phone": "11999999999",
        "birthDate": "1990-05-15T00:00:00.000Z",
        "responsibleId": null,
        "active": true,
        "createdAt": "2025-01-01T10:00:00.000Z",
        "updatedAt": "2025-01-01T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### 🔍 Buscar Pessoa por ID
```http
GET /api/v1/people/:id
```
**Permissões**: Requer autenticação

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Maria Santos",
    "cpf": "98765432100",
    "email": "maria@example.com",
    "phone": "11988888888",
    "birthDate": "2010-03-20T00:00:00.000Z",
    "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
    "active": true,
    "createdAt": "2025-01-01T10:00:00.000Z",
    "updatedAt": "2025-01-01T10:00:00.000Z",
    "responsible": {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "name": "João Silva",
      "cpf": "12345678901",
      "email": "joao@example.com"
    }
  }
}
```

#### 🔍 Buscar Pessoa por CPF
```http
GET /api/v1/people/cpf/:cpf
```
**Permissões**: Requer autenticação

**Exemplo:**
```http
GET /api/v1/people/cpf/12345678901
```

**Nota**: O CPF pode ser enviado com ou sem formatação (123.456.789-01 ou 12345678901)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "João Silva",
    "cpf": "12345678901",
    "email": "joao@example.com",
    "phone": "11999999999",
    "active": true
  }
}
```

#### 🔎 Buscar/Pesquisar Pessoas
```http
GET /api/v1/people/search?q=termo&page=1&limit=10
```
**Permissões**: Requer autenticação

**Query Parameters:**
- `q` (obrigatório): Termo de busca (mínimo 2 caracteres)
- `page` (opcional): Número da página
- `limit` (opcional): Itens por página

**Busca por**: nome, CPF ou email

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "people": [...],
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### ➕ Criar Pessoa
```http
POST /api/v1/people
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "name": "Ana Costa",
  "cpf": "98765432100",
  "email": "ana@example.com",
  "phone": "11977777777",
  "birthDate": "2012-08-10",
  "responsibleId": "650e8400-e29b-41d4-a716-446655440001"
}
```

**Campos Obrigatórios:**
- `name`: Nome completo (mínimo 3 caracteres)
- `cpf`: CPF válido (com ou sem formatação)

**Campos Opcionais:**
- `email`: Email válido
- `phone`: Telefone (10-11 dígitos)
- `birthDate`: Data de nascimento (formato: YYYY-MM-DD)
- `responsibleId`: ID do responsável (se for dependente)

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "name": "Ana Costa",
    "cpf": "98765432100",
    "email": "ana@example.com",
    "phone": "11977777777",
    "birthDate": "2012-08-10T00:00:00.000Z",
    "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
    "active": true,
    "createdAt": "2025-01-15T14:30:00.000Z",
    "updatedAt": "2025-01-15T14:30:00.000Z"
  }
}
```

**Exemplo JavaScript:**
```javascript
async function createPerson(personData) {
  const token = localStorage.getItem('authToken');
  const response = await fetch('https://api.example.com/api/v1/people', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(personData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Uso:
await createPerson({
  name: 'Ana Costa',
  cpf: '98765432100',
  email: 'ana@example.com',
  phone: '11977777777',
  birthDate: '2012-08-10',
  responsibleId: '650e8400-e29b-41d4-a716-446655440001'
});
```

#### ✏️ Atualizar Pessoa
```http
PUT /api/v1/people/:id
```
**Permissões**: `admin`, `manager`

**Request (todos os campos são opcionais):**
```json
{
  "name": "Ana Costa Silva",
  "email": "ana.silva@example.com",
  "phone": "11966666666",
  "birthDate": "2012-08-10",
  "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
  "active": true
}
```

**Nota**: O CPF não pode ser alterado após criação

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "name": "Ana Costa Silva",
    "cpf": "98765432100",
    "email": "ana.silva@example.com",
    "phone": "11966666666",
    "active": true,
    "updatedAt": "2025-01-16T10:00:00.000Z"
  }
}
```

#### 🗑️ Deletar Pessoa
```http
DELETE /api/v1/people/:id
```
**Permissões**: `admin` apenas

**Importante**:
- É um soft delete (marca como inativa, não remove do banco)
- Não é possível deletar uma pessoa que possui dependentes

**Response (200):**
```json
{
  "status": "success",
  "message": "Person deleted successfully"
}
```

**Response (400) - Se tiver dependentes:**
```json
{
  "status": "error",
  "message": "Cannot delete person with dependents. Please reassign or remove dependents first."
}
```

#### 👨‍👩‍👧‍👦 Listar Dependentes
```http
GET /api/v1/people/:id/dependents
```
**Permissões**: Requer autenticação

**Response (200):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "name": "Ana Costa",
      "cpf": "98765432100",
      "email": "ana@example.com",
      "phone": "11977777777",
      "birthDate": "2012-08-10T00:00:00.000Z",
      "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
      "active": true
    },
    {
      "id": "760e8400-e29b-41d4-a716-446655440000",
      "name": "Pedro Costa",
      "cpf": "11122233344",
      "email": "pedro@example.com",
      "birthDate": "2015-02-20T00:00:00.000Z",
      "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
      "active": true
    }
  ]
}
```

**Exemplo JavaScript:**
```javascript
async function getDependents(responsibleId) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `https://api.example.com/api/v1/people/${responsibleId}/dependents`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

---

### 3. Clientes

#### 📋 Listar Todos os Clientes
```http
GET /api/v1/customers?page=1&limit=10
```

**Response (200):**
```json
{
  "customers": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Pedro Almeida",
      "email": "pedro@example.com",
      "cpf": "12345678901",
      "phone": "11988888888",
      "studentId": "2024001",
      "balance": 50.00,
      "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
      "active": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15
}
```

**Exemplo JavaScript:**
```javascript
async function getCustomers(page = 1, limit = 10) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `https://api.example.com/api/v1/customers?page=${page}&limit=${limit}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return await response.json();
}
```

#### 👤 Buscar Cliente por ID
```http
GET /api/v1/customers/:id
```

#### ➕ Criar Cliente
```http
POST /api/v1/customers
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "name": "Ana Costa",
  "email": "ana@example.com",
  "cpf": "98765432100",
  "phone": "11977777777",
  "studentId": "2024002",
  "responsibleId": "650e8400-e29b-41d4-a716-446655440001",
  "initialBalance": 100.00
}
```

#### ✏️ Atualizar Cliente
```http
PUT /api/v1/customers/:id
```
**Permissões**: `admin`, `manager`

#### 🗑️ Deletar Cliente
```http
DELETE /api/v1/customers/:id
```
**Permissões**: `admin` apenas

#### 💰 Adicionar Crédito
```http
POST /api/v1/customers/:id/credit/add
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "amount": 50.00,
  "description": "Recarga de crédito mensal"
}
```

**Exemplo JavaScript:**
```javascript
async function addCredit(customerId, amount, description) {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `https://api.example.com/api/v1/customers/${customerId}/credit/add`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, description })
    }
  );

  return await response.json();
}
```

#### 💸 Debitar Crédito
```http
POST /api/v1/customers/:id/credit/debit
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "amount": 10.00,
  "description": "Ajuste manual de saldo"
}
```

#### 📊 Histórico de Saldo
```http
GET /api/v1/customers/:id/balance-history
```

**Response:**
```json
{
  "history": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "customerId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": 50.00,
      "type": "credit",
      "description": "Recarga de crédito",
      "userId": "850e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2025-01-15T14:30:00.000Z"
    },
    {
      "id": "760e8400-e29b-41d4-a716-446655440000",
      "customerId": "550e8400-e29b-41d4-a716-446655440000",
      "amount": -10.50,
      "type": "debit",
      "description": "Compra de lanche",
      "userId": "850e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2025-01-16T12:15:00.000Z"
    }
  ]
}
```

---

### 4. Produtos e Categorias

#### 📦 Listar Todos os Produtos
```http
GET /api/v1/products?page=1&limit=10&categoryId=uuid&active=true
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "450e8400-e29b-41d4-a716-446655440000",
      "name": "Suco de Laranja",
      "description": "Suco natural 300ml",
      "price": 5.00,
      "cost": 2.50,
      "categoryId": "350e8400-e29b-41d4-a716-446655440000",
      "active": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z",
      "category": {
        "id": "350e8400-e29b-41d4-a716-446655440000",
        "name": "Bebidas",
        "description": "Bebidas naturais e industrializadas"
      }
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### 🔍 Buscar Produto por ID
```http
GET /api/v1/products/:id
```

#### ➕ Criar Produto
```http
POST /api/v1/products
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "name": "Sanduíche Natural",
  "description": "Pão integral com frango desfiado",
  "price": 8.50,
  "cost": 4.00,
  "categoryId": "350e8400-e29b-41d4-a716-446655440001"
}
```

#### ✏️ Atualizar Produto
```http
PUT /api/v1/products/:id
```
**Permissões**: `admin`, `manager`

#### 🗑️ Deletar Produto
```http
DELETE /api/v1/products/:id
```
**Permissões**: `admin` apenas

#### 📂 Listar Todas as Categorias
```http
GET /api/v1/categories?page=1&limit=10&active=true
```

**Response:**
```json
{
  "categories": [
    {
      "id": "350e8400-e29b-41d4-a716-446655440000",
      "name": "Bebidas",
      "description": "Bebidas naturais e industrializadas",
      "active": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### ➕ Criar Categoria
```http
POST /api/v1/categories
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "name": "Lanches",
  "description": "Lanches e salgados"
}
```

---

### 5. Formas de Pagamento

#### 📋 Listar Todas as Formas de Pagamento
```http
GET /api/v1/payment-methods?page=1&limit=10
```

**Response (200):**
```json
{
  "paymentMethods": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "name": "cash",
      "displayName": "Dinheiro",
      "description": "Pagamento em dinheiro",
      "active": true,
      "requiresAccount": false,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "760e8400-e29b-41d4-a716-446655440000",
      "name": "card",
      "displayName": "Maquininha",
      "description": "Pagamento com cartão",
      "active": true,
      "requiresAccount": false,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "account",
      "displayName": "Saldo da Conta",
      "description": "Débito do saldo da conta do cliente",
      "active": true,
      "requiresAccount": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

#### 📋 Listar Formas de Pagamento Ativas
```http
GET /api/v1/payment-methods/active
```

**Response (200):**
```json
{
  "paymentMethods": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "name": "cash",
      "displayName": "Dinheiro",
      "active": true,
      "requiresAccount": false
    }
  ]
}
```

---

### 6. Contas (Accounts)

O sistema de contas permite que clientes tenham saldo e limite de crédito. Uma conta está vinculada a uma pessoa e pode ser compartilhada entre responsáveis e dependentes.

#### 📋 Listar Todas as Contas
```http
GET /api/v1/accounts?page=1&limit=10
```

**Response (200):**
```json
{
  "accounts": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440000",
      "personId": "550e8400-e29b-41d4-a716-446655440000",
      "personName": "João Silva",
      "personCpf": "12345678901",
      "personEmail": "joao@example.com",
      "balance": 150.00,
      "creditLimit": 50.00,
      "allowNegative": true,
      "active": true,
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-01T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### 🔍 Buscar Saldo da Conta
```http
GET /api/v1/accounts/:id/balance
```

**Response (200):**
```json
{
  "accountId": "850e8400-e29b-41d4-a716-446655440000",
  "personId": "550e8400-e29b-41d4-a716-446655440000",
  "personName": "João Silva",
  "currentBalance": 150.00,
  "creditLimit": 50.00,
  "availableCredit": 200.00,
  "allowNegative": true
}
```

**Nota:** `availableCredit` é a soma do saldo atual + limite de crédito (quando `allowNegative` = true)

#### 💰 Adicionar Crédito na Conta
```http
POST /api/v1/accounts/:id/credit
```

**Request:**
```json
{
  "amount": 100.00,
  "description": "Recarga mensal"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Credit added successfully",
  "data": {
    "id": "950e8400-e29b-41d4-a716-446655440000",
    "accountId": "850e8400-e29b-41d4-a716-446655440000",
    "amount": 100.00,
    "type": "credit",
    "description": "Recarga mensal",
    "userId": "650e8400-e29b-41d4-a716-446655440000",
    "userName": "Admin User",
    "createdAt": "2025-01-15T14:30:00.000Z"
  }
}
```

#### 💸 Debitar Crédito da Conta
```http
POST /api/v1/accounts/:id/debit
```

**Request:**
```json
{
  "amount": 10.00,
  "description": "Ajuste manual"
}
```

#### 📊 Histórico de Transações
```http
GET /api/v1/accounts/:id/transactions
```

**Response (200):**
```json
{
  "transactions": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440000",
      "accountId": "850e8400-e29b-41d4-a716-446655440000",
      "amount": 100.00,
      "type": "credit",
      "description": "Recarga mensal",
      "userId": "650e8400-e29b-41d4-a716-446655440000",
      "userName": "Admin User",
      "createdAt": "2025-01-15T14:30:00.000Z"
    },
    {
      "id": "960e8400-e29b-41d4-a716-446655440000",
      "accountId": "850e8400-e29b-41d4-a716-446655440000",
      "amount": 25.50,
      "type": "debit",
      "description": "Sale #650e8400-e29b-41d4-a716-446655440000",
      "userId": "650e8400-e29b-41d4-a716-446655440000",
      "userName": "Admin User",
      "createdAt": "2025-01-15T12:30:00.000Z"
    }
  ]
}
```

#### ✏️ Atualizar Limite de Crédito
```http
PUT /api/v1/accounts/:id
```

**Request:**
```json
{
  "creditLimit": 100.00,
  "allowNegative": true
}
```

**Importante:**
- `creditLimit`: Valor máximo que o saldo pode ficar negativo
- `allowNegative`: Se `true`, permite que o saldo fique negativo até o `creditLimit`
- Exemplo: `balance = -30.00`, `creditLimit = 50.00` → Cliente ainda pode gastar R$ 20,00

---

### 7. Vendas

#### 🛒 Listar Todas as Vendas
```http
GET /api/v1/sales?page=1&limit=10&customerId=uuid&status=completed&startDate=2025-01-01&endDate=2025-12-31
```

**Response (200):**
```json
{
  "sales": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "customerId": "550e8400-e29b-41d4-a716-446655440000",
      "customerName": "Pedro Almeida",
      "userId": "850e8400-e29b-41d4-a716-446655440000",
      "userName": "João Silva",
      "totalAmount": 25.50,
      "paymentMethod": "account",
      "paymentMethodId": "770e8400-e29b-41d4-a716-446655440000",
      "paymentMethodName": "Saldo da Conta",
      "status": "completed",
      "createdAt": "2025-01-15T12:30:00.000Z",
      "updatedAt": "2025-01-15T12:30:00.000Z",
      "items": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440000",
          "saleId": "650e8400-e29b-41d4-a716-446655440000",
          "productId": "450e8400-e29b-41d4-a716-446655440000",
          "productName": "Suco de Laranja",
          "quantity": 2,
          "unitPrice": 5.00,
          "subtotal": 10.00
        },
        {
          "id": "670e8400-e29b-41d4-a716-446655440000",
          "saleId": "650e8400-e29b-41d4-a716-446655440000",
          "productId": "460e8400-e29b-41d4-a716-446655440000",
          "productName": "Sanduíche Natural",
          "quantity": 1,
          "unitPrice": 8.50,
          "subtotal": 8.50
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

#### 🔍 Buscar Venda por ID
```http
GET /api/v1/sales/:id
```

#### ➕ Criar Venda
```http
POST /api/v1/sales
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "paymentMethodId": "770e8400-e29b-41d4-a716-446655440000",
  "items": [
    {
      "productId": "450e8400-e29b-41d4-a716-446655440000",
      "quantity": 2
    },
    {
      "productId": "460e8400-e29b-41d4-a716-446655440000",
      "quantity": 1
    }
  ]
}
```

**Importante:**
- `paymentMethodId`: ID da forma de pagamento (obtenha via `/api/v1/payment-methods/active`)
- Se a forma de pagamento requer conta (`requiresAccount = true`), o sistema verifica:
  - Se o cliente possui uma conta ativa
  - Se há saldo suficiente (considerando `balance + creditLimit` se `allowNegative = true`)
- O estoque é automaticamente atualizado para cada produto
- Transações de conta são criadas automaticamente

**Response (201):**
```json
{
  "status": "success",
  "message": "Sale created successfully",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440000",
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "totalAmount": 18.50,
    "paymentMethod": "credit",
    "status": "completed",
    "items": [
      {
        "productId": "450e8400-e29b-41d4-a716-446655440000",
        "productName": "Suco de Laranja",
        "quantity": 2,
        "unitPrice": 5.00,
        "subtotal": 10.00
      }
    ],
    "createdAt": "2025-01-15T12:30:00.000Z"
  }
}
```

**Exemplo JavaScript:**
```javascript
async function createSale(customerId, paymentMethod, items) {
  const token = localStorage.getItem('authToken');
  const response = await fetch('https://api.example.com/api/v1/sales', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerId,
      paymentMethod,
      items
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Uso:
createSale(
  '550e8400-e29b-41d4-a716-446655440000',
  'credit',
  [
    { productId: '450e8400-e29b-41d4-a716-446655440000', quantity: 2 },
    { productId: '460e8400-e29b-41d4-a716-446655440000', quantity: 1 }
  ]
);
```

#### ❌ Cancelar Venda
```http
PATCH /api/v1/sales/:id/cancel
```
**Permissões**: `admin`, `manager`

#### 📊 Resumo de Vendas
```http
GET /api/v1/sales/summary?startDate=2025-01-01&endDate=2025-12-31
```
**Permissões**: `admin`, `manager`

**Response:**
```json
{
  "totalSales": 150,
  "totalAmount": 3500.00,
  "averageTicket": 23.33,
  "salesByPaymentMethod": [
    {
      "paymentMethod": "credit",
      "count": 80,
      "total": 2000.00
    },
    {
      "paymentMethod": "cash",
      "count": 50,
      "total": 1200.00
    },
    {
      "paymentMethod": "pix",
      "count": 15,
      "total": 250.00
    },
    {
      "paymentMethod": "card",
      "count": 5,
      "total": 50.00
    }
  ]
}
```

#### 📜 Histórico de Vendas do Cliente
```http
GET /api/v1/customers/:customerId/sales
```

**Response:**
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Pedro Almeida",
  "totalPurchases": 25,
  "totalSpent": 500.00,
  "sales": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "totalAmount": 25.50,
      "paymentMethod": "credit",
      "status": "completed",
      "createdAt": "2025-01-15T12:30:00.000Z",
      "items": [...]
    }
  ]
}
```

---

### 8. Inventário

#### 📦 Listar Todo o Inventário
```http
GET /api/v1/inventory?page=1&limit=10
```

**Response:**
```json
{
  "items": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "productId": "450e8400-e29b-41d4-a716-446655440000",
      "productName": "Suco de Laranja",
      "quantity": 50,
      "minQuantity": 10,
      "maxQuantity": 100,
      "lastRestockDate": "2025-01-10T10:00:00.000Z",
      "createdAt": "2025-01-01T10:00:00.000Z",
      "updatedAt": "2025-01-10T10:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

#### 🔍 Buscar Inventário por Produto
```http
GET /api/v1/inventory/product/:productId
```

#### ⚠️ Itens com Estoque Baixo
```http
GET /api/v1/inventory/low-stock
```
**Permissões**: `admin`, `manager`

**Response:**
```json
{
  "items": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440000",
      "productId": "450e8400-e29b-41d4-a716-446655440000",
      "productName": "Suco de Laranja",
      "quantity": 5,
      "minQuantity": 10,
      "deficit": 5
    }
  ]
}
```

#### 📊 Relatório de Inventário
```http
GET /api/v1/inventory/report
```
**Permissões**: `admin`, `manager`

**Response:**
```json
{
  "totalProducts": 50,
  "totalValue": 15000.00,
  "lowStockCount": 5,
  "outOfStockCount": 2,
  "lowStockItems": [
    {
      "productId": "450e8400-e29b-41d4-a716-446655440000",
      "productName": "Suco de Laranja",
      "quantity": 5,
      "minQuantity": 10
    }
  ]
}
```

#### ➕ Criar Inventário
```http
POST /api/v1/inventory
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "productId": "450e8400-e29b-41d4-a716-446655440000",
  "quantity": 50,
  "minQuantity": 10,
  "maxQuantity": 100
}
```

#### 📥 Reabastecer Estoque
```http
POST /api/v1/inventory/restock
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "inventoryId": "750e8400-e29b-41d4-a716-446655440000",
  "type": "restock",
  "quantity": 50,
  "reason": "Reabastecimento mensal"
}
```

#### ⚙️ Ajustar Estoque
```http
POST /api/v1/inventory/adjust
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "inventoryId": "750e8400-e29b-41d4-a716-446655440000",
  "type": "adjustment",
  "quantity": -5,
  "reason": "Ajuste de inventário"
}
```

#### 🗑️ Registrar Perda
```http
POST /api/v1/inventory/loss
```
**Permissões**: `admin`, `manager`

**Request:**
```json
{
  "inventoryId": "750e8400-e29b-41d4-a716-446655440000",
  "type": "loss",
  "quantity": 3,
  "reason": "Produto vencido"
}
```

#### 📜 Histórico de Movimentações
```http
GET /api/v1/inventory/:inventoryId/movements
```

**Response:**
```json
{
  "movements": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440000",
      "inventoryId": "750e8400-e29b-41d4-a716-446655440000",
      "productId": "450e8400-e29b-41d4-a716-446655440000",
      "productName": "Suco de Laranja",
      "type": "restock",
      "quantity": 50,
      "previousQuantity": 20,
      "newQuantity": 70,
      "reason": "Reabastecimento mensal",
      "userId": "850e8400-e29b-41d4-a716-446655440000",
      "userName": "João Silva",
      "createdAt": "2025-01-10T10:00:00.000Z"
    }
  ]
}
```

---

### 9. Utilitários

#### ✅ Health Check Geral
```http
GET /health
```
**Autenticação**: Não requerida

**Response:**
```json
{
  "status": "success",
  "message": "CantinaSoft API is running",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "database": {
    "connected": true,
    "status": "healthy"
  }
}
```

#### 🗄️ Informações do Banco
```http
GET /api/v1/database/info
```
**Autenticação**: Não requerida

**Response:**
```json
{
  "status": "success",
  "database": {
    "connected": true,
    "host": "ep-xxx.neon.tech",
    "database": "neondb",
    "branch": "main",
    "version": "PostgreSQL 16.x"
  }
}
```

#### 📋 Listar Tabelas
```http
GET /api/v1/database/tables
```
**Autenticação**: Não requerida

**Response:**
```json
{
  "tables": [
    "users",
    "customers",
    "products",
    "categories",
    "sales",
    "sale_items",
    "inventory",
    "inventory_movements",
    "balance_history"
  ]
}
```

---

## 📦 Estrutura de Respostas

### ✅ Sucesso Padrão
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": { ... }
}
```

### ❌ Erro de Validação (400)
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### 🔒 Erro de Autenticação (401)
```json
{
  "status": "error",
  "message": "Authentication token not provided"
}
```

### 🚫 Erro de Autorização (403)
```json
{
  "status": "error",
  "message": "Insufficient permissions"
}
```

### 🔍 Recurso Não Encontrado (404)
```json
{
  "status": "error",
  "message": "Resource not found"
}
```

### ⚠️ Erro de Servidor (500)
```json
{
  "status": "error",
  "message": "Internal server error"
}
```

---

## 🛠️ Tratamento de Erros

### Exemplo de Função Genérica

```javascript
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('authToken');

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(
      `https://api.example.com${endpoint}`,
      config
    );

    const data = await response.json();

    if (!response.ok) {
      // Tratamento específico por código de status
      switch (response.status) {
        case 401:
          // Token inválido ou expirado - redirecionar para login
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Sem permissão
          throw new Error('Você não tem permissão para executar esta ação');
        case 404:
          throw new Error('Recurso não encontrado');
        case 400:
          // Erro de validação
          if (data.errors) {
            const errorMessages = data.errors
              .map(e => `${e.field}: ${e.message}`)
              .join('\n');
            throw new Error(errorMessages);
          }
          throw new Error(data.message);
        default:
          throw new Error(data.message || 'Erro ao processar requisição');
      }
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Uso:
try {
  const customers = await apiRequest('/api/v1/customers?page=1&limit=10');
  console.log(customers);
} catch (error) {
  alert(error.message);
}
```

---

## 📚 Exemplos de Integração

### React Hook para API

```javascript
import { useState, useEffect } from 'react';

export function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiRequest(endpoint, options);
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}

// Uso em componente:
function CustomersList() {
  const { data, loading, error } = useApi('/api/v1/customers');

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <ul>
      {data.customers.map(customer => (
        <li key={customer.id}>{customer.name}</li>
      ))}
    </ul>
  );
}
```

### Service Layer (Arquitetura Recomendada)

```javascript
// services/api.js
const API_BASE_URL = 'https://api.example.com/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const token = this.getToken();

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
      }
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Métodos de autenticação
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Métodos de clientes
  async getCustomers(page = 1, limit = 10) {
    return this.request(`/customers?page=${page}&limit=${limit}`);
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }

  async createCustomer(customerData) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData)
    });
  }

  async updateCustomer(id, customerData) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData)
    });
  }

  async deleteCustomer(id) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE'
    });
  }

  async addCredit(customerId, amount, description) {
    return this.request(`/customers/${customerId}/credit/add`, {
      method: 'POST',
      body: JSON.stringify({ amount, description })
    });
  }

  async debitCredit(customerId, amount, description) {
    return this.request(`/customers/${customerId}/credit/debit`, {
      method: 'POST',
      body: JSON.stringify({ amount, description })
    });
  }

  async getBalanceHistory(customerId) {
    return this.request(`/customers/${customerId}/balance-history`);
  }

  // Métodos de pessoas
  async getPeople(page = 1, limit = 10, activeOnly = true) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      activeOnly: activeOnly.toString()
    }).toString();
    return this.request(`/people?${params}`);
  }

  async getPerson(id) {
    return this.request(`/people/${id}`);
  }

  async getPersonByCpf(cpf) {
    return this.request(`/people/cpf/${cpf}`);
  }

  async searchPeople(searchTerm, page = 1, limit = 10) {
    const params = new URLSearchParams({
      q: searchTerm,
      page: page.toString(),
      limit: limit.toString()
    }).toString();
    return this.request(`/people/search?${params}`);
  }

  async createPerson(personData) {
    return this.request('/people', {
      method: 'POST',
      body: JSON.stringify(personData)
    });
  }

  async updatePerson(id, personData) {
    return this.request(`/people/${id}`, {
      method: 'PUT',
      body: JSON.stringify(personData)
    });
  }

  async deletePerson(id) {
    return this.request(`/people/${id}`, {
      method: 'DELETE'
    });
  }

  async getDependents(responsibleId) {
    return this.request(`/people/${responsibleId}/dependents`);
  }

  // Métodos de produtos
  async getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products${query ? '?' + query : ''}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos de categorias
  async getCategories(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/categories${query ? '?' + query : ''}`);
  }

  async createCategory(categoryData) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  // Métodos de vendas
  async getSales(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/sales${query ? '?' + query : ''}`);
  }

  async getSale(id) {
    return this.request(`/sales/${id}`);
  }

  async createSale(saleData) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(saleData)
    });
  }

  async cancelSale(id) {
    return this.request(`/sales/${id}/cancel`, {
      method: 'PATCH'
    });
  }

  async getSalesSummary(startDate, endDate) {
    const params = new URLSearchParams({ startDate, endDate }).toString();
    return this.request(`/sales/summary?${params}`);
  }

  async getCustomerSales(customerId) {
    return this.request(`/customers/${customerId}/sales`);
  }

  // Métodos de inventário
  async getInventory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/inventory${query ? '?' + query : ''}`);
  }

  async getInventoryByProduct(productId) {
    return this.request(`/inventory/product/${productId}`);
  }

  async getLowStockItems() {
    return this.request('/inventory/low-stock');
  }

  async getInventoryReport() {
    return this.request('/inventory/report');
  }

  async createInventory(inventoryData) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(inventoryData)
    });
  }

  async restockInventory(inventoryId, quantity, reason) {
    return this.request('/inventory/restock', {
      method: 'POST',
      body: JSON.stringify({ inventoryId, type: 'restock', quantity, reason })
    });
  }

  async adjustInventory(inventoryId, quantity, reason) {
    return this.request('/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ inventoryId, type: 'adjustment', quantity, reason })
    });
  }

  async registerLoss(inventoryId, quantity, reason) {
    return this.request('/inventory/loss', {
      method: 'POST',
      body: JSON.stringify({ inventoryId, type: 'loss', quantity, reason })
    });
  }

  async getInventoryMovements(inventoryId) {
    return this.request(`/inventory/${inventoryId}/movements`);
  }
}

export default new ApiService();
```

### Uso do Service

```javascript
import api from './services/api';

// Login
async function handleLogin(email, password) {
  try {
    const data = await api.login(email, password);
    console.log('Login successful:', data.user);
    // Redirecionar para dashboard
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

// Listar clientes
async function loadCustomers() {
  try {
    const data = await api.getCustomers(1, 20);
    console.log('Customers:', data.customers);
  } catch (error) {
    console.error('Failed to load customers:', error.message);
  }
}

// Listar pessoas
async function loadPeople() {
  try {
    const data = await api.getPeople(1, 20, true);
    console.log('People:', data.data.people);
  } catch (error) {
    console.error('Failed to load people:', error.message);
  }
}

// Buscar pessoa por CPF
async function findPersonByCpf(cpf) {
  try {
    const data = await api.getPersonByCpf(cpf);
    console.log('Person found:', data.data);
  } catch (error) {
    console.error('Person not found:', error.message);
  }
}

// Criar pessoa
async function registerPerson() {
  try {
    const person = await api.createPerson({
      name: 'Ana Costa',
      cpf: '98765432100',
      email: 'ana@example.com',
      phone: '11977777777',
      birthDate: '2012-08-10',
      responsibleId: '650e8400-e29b-41d4-a716-446655440001'
    });
    console.log('Person created:', person);
  } catch (error) {
    console.error('Failed to create person:', error.message);
  }
}

// Buscar dependentes de um responsável
async function loadDependents(responsibleId) {
  try {
    const data = await api.getDependents(responsibleId);
    console.log('Dependents:', data.data);
  } catch (error) {
    console.error('Failed to load dependents:', error.message);
  }
}

// Criar venda
async function processSale(customerId, items) {
  try {
    const sale = await api.createSale({
      customerId,
      paymentMethod: 'credit',
      items
    });
    console.log('Sale created:', sale);
  } catch (error) {
    console.error('Failed to create sale:', error.message);
  }
}
```

---

## 📋 Checklist de Integração

### Configuração Inicial
- [ ] Definir URL base da API
- [ ] Implementar camada de serviço (service layer)
- [ ] Configurar interceptors para tokens JWT
- [ ] Implementar tratamento de erros global
- [ ] Configurar timeout para requisições

### Autenticação
- [ ] Implementar tela de login
- [ ] Armazenar token JWT após login
- [ ] Implementar logout (limpar token)
- [ ] Adicionar verificação de token expirado
- [ ] Redirecionar para login em caso de 401

### Funcionalidades Principais
- [ ] Listar e buscar clientes
- [ ] Criar, editar e deletar clientes
- [ ] Gerenciar saldo de clientes
- [ ] Listar produtos e categorias
- [ ] Realizar vendas
- [ ] Visualizar histórico de vendas
- [ ] Monitorar inventário
- [ ] Visualizar relatórios

### Controle de Acesso
- [ ] Implementar verificação de role do usuário
- [ ] Mostrar/esconder funcionalidades por permissão
- [ ] Desabilitar ações não permitidas

### Experiência do Usuário
- [ ] Adicionar loading states
- [ ] Implementar feedback de sucesso/erro
- [ ] Adicionar paginação em listas
- [ ] Implementar busca e filtros
- [ ] Adicionar confirmação para ações críticas

---

## 🚀 Dicas de Performance

1. **Cache de Dados**: Implemente cache local para dados que não mudam frequentemente (categorias, produtos)

2. **Debounce em Buscas**: Use debounce para buscar enquanto o usuário digita

3. **Paginação**: Sempre use paginação em listas grandes

4. **Loading States**: Sempre mostre feedback visual durante requisições

5. **Otimistic Updates**: Atualize a UI imediatamente e reverta em caso de erro

---

## 🐛 Debug e Troubleshooting

### Problemas Comuns

#### Token Expirado
```javascript
// Solução: Implementar refresh do token ou redirecionar para login
if (response.status === 401) {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

#### CORS
```javascript
// Certifique-se de que o backend permite o domínio do frontend
// Verifique os headers:
// Access-Control-Allow-Origin
// Access-Control-Allow-Methods
// Access-Control-Allow-Headers
```

#### Validação de Dados
```javascript
// Sempre valide dados no frontend antes de enviar
// Use bibliotecas como Yup, Zod ou Joi
```

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Consulte a documentação técnica completa
- Verifique os logs do servidor
- Entre em contato com a equipe de backend

---

## 📝 Notas Importantes

### Login com CPF

A API suporta login tanto com email quanto com CPF. O sistema detecta automaticamente o tipo de identificador:

**Características:**
- O campo `email` no endpoint `/api/v1/auth/login` aceita ambos os formatos
- CPF pode ser enviado com ou sem formatação (123.456.789-01 ou 12345678901)
- A validação de CPF é feita automaticamente
- Se o identificador tiver 11 dígitos numéricos, é tratado como CPF
- Caso contrário, é validado como email

**Exemplo de UI:**
```javascript
// Componente de login que aceita email ou CPF
function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // O backend detecta automaticamente se é email ou CPF
      await api.login(identifier, password);
      // Redirecionar para dashboard
    } catch (error) {
      // Mostrar erro
      alert(error.message);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
      <input
        type="text"
        placeholder="Email ou CPF"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

### Módulo de Pessoas vs Clientes vs Contas

**Pessoas (`/api/v1/people`)**:
- Cadastro de dados pessoais (CPF, nome, telefone, etc.)
- Gerenciamento de responsáveis e dependentes
- Base para todos os usuários do sistema
- Utilizado para login com CPF

**Clientes (`/api/v1/customers`)**:
- Focado em funcionalidades da cantina
- Histórico de compras
- Vinculado a uma pessoa através do `person_id`
- Vinculado a uma conta através do `account_id`

**Contas (`/api/v1/accounts`)**:
- Gerenciamento de saldo e créditos
- Sistema de crédito com limite configurável
- Pode ser compartilhada entre responsável e dependentes
- Vinculada a uma pessoa através do `person_id`
- Histórico de transações financeiras

**Fluxo Recomendado:**
1. Criar pessoa no módulo de Pessoas
2. Criar conta para a pessoa (se necessário usar sistema de crédito)
3. Criar cliente vinculado à pessoa e à conta
4. Usuário pode fazer login com CPF
5. Sistema busca dados pessoais, dados de cliente e dados da conta

**Sistema de Contas Compartilhadas:**

O sistema permite que responsáveis e dependentes compartilhem a mesma conta:

```
Responsável (João Silva)
  └─ Pessoa ID: 123
  └─ Conta ID: 456 (saldo: R$ 100,00, crédito: R$ 50,00)
      └─ Dependente 1 (Maria Silva - Filha)
          └─ Pessoa ID: 789
          └─ Usa a mesma Conta ID: 456
      └─ Dependente 2 (Pedro Silva - Filho)
          └─ Pessoa ID: 101
          └─ Usa a mesma Conta ID: 456
```

**Como funciona:**
1. Responsável e dependentes possuem registros separados na tabela `people`
2. Todos podem ter registros na tabela `customers`
3. Todos os `customers` do grupo familiar apontam para a mesma `account_id`
4. Quando qualquer um do grupo faz uma compra usando a conta, o saldo é debitado da conta compartilhada
5. Recargas de crédito podem ser feitas por qualquer atendente e beneficiam todo o grupo

**Exemplo de Implementação:**

```javascript
// 1. Criar pessoa responsável
const responsavel = await api.createPerson({
  name: 'João Silva',
  cpf: '12345678901',
  email: 'joao@example.com',
  phone: '11999999999'
});

// 2. Criar conta para o responsável
const conta = await api.createAccount({
  personId: responsavel.data.id,
  initialBalance: 100.00,
  creditLimit: 50.00,
  allowNegative: true
});

// 3. Criar cliente para o responsável
const clienteResponsavel = await api.createCustomer({
  personId: responsavel.data.id,
  accountId: conta.data.id,
  studentId: 'RESP001'
});

// 4. Criar pessoa dependente (filha)
const dependente = await api.createPerson({
  name: 'Maria Silva',
  cpf: '98765432100',
  birthDate: '2010-05-15',
  responsibleId: responsavel.data.id  // Vincula ao responsável
});

// 5. Criar cliente para o dependente usando a MESMA conta
const clienteDependente = await api.createCustomer({
  personId: dependente.data.id,
  accountId: conta.data.id,  // Mesma conta do responsável!
  studentId: 'ALU001'
});

// 6. Agora ambos podem comprar usando a mesma conta
// Compra do responsável
await api.createSale({
  customerId: clienteResponsavel.data.id,
  paymentMethodId: accountPaymentMethodId,
  items: [{ productId: '...', quantity: 2 }]
});

// Compra do dependente (mesmo saldo)
await api.createSale({
  customerId: clienteDependente.data.id,
  paymentMethodId: accountPaymentMethodId,
  items: [{ productId: '...', quantity: 1 }]
});

// 7. Verificar saldo compartilhado
const saldo = await api.getAccountBalance(conta.data.id);
// Mostra o saldo após ambas as compras
```

**Importante:**
- Uma conta pode ter múltiplos clientes vinculados
- Cada pessoa só pode ter uma conta própria
- O sistema de crédito negativo permite gastos até o limite definido
- Todas as transações são registradas com o usuário que as executou

---

**Versão**: 3.0.0
**Última Atualização**: Janeiro 2025
**Documentação gerada para**: CantinaSoft ERP Backend API
