# 📘 Guia Completo de Integração Frontend - CantinaSoft Backend

## 📋 Índice

1. [Informações Gerais](#informações-gerais)
2. [Autenticação](#autenticação)
3. [Endpoints Disponíveis](#endpoints-disponíveis)
4. [Exemplos de Código](#exemplos-de-código)
5. [Tratamento de Erros](#tratamento-de-erros)
6. [Fluxos Completos](#fluxos-completos)
7. [WebSocket (Opcional)](#websocket-opcional)

---

## 🌐 Informações Gerais

### Base URL
```
http://localhost:3001/api/v1
```

### Headers Padrão
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Apenas em rotas autenticadas
}
```

### Formato de Resposta

#### Sucesso
```json
{
  "status": "success",
  "data": { ... }
}
```

#### Erro
```json
{
  "status": "error",
  "message": "Descrição do erro"
}
```

---

## 🔐 Autenticação

### 1. Login

**Endpoint**: `POST /auth/login`

**Body**:
```json
{
  "email": "admin@cantina-soft.com",
  "password": "admin123"
}
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "00000000-0000-0000-0000-000000000001",
      "name": "Administrador Master",
      "email": "admin@cantina-soft.com",
      "role": "admin",
      "active": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Armazene o token** em `localStorage`, `sessionStorage` ou state management (Redux, Zustand, etc).

---

### 2. Registro de Novo Usuário

**Endpoint**: `POST /auth/register`

**Body**:
```json
{
  "name": "João Silva",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "manager"
}
```

**Roles disponíveis**: `admin`, `manager`, `user`

---

### 3. Verificar Token

**Endpoint**: `POST /auth/verify`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "status": "success",
  "data": {
    "userId": "...",
    "email": "...",
    "role": "admin"
  }
}
```

---

### 4. Obter Usuário Atual

**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response**:
```json
{
  "status": "success",
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "admin",
    "active": true
  }
}
```

---

## 📦 Endpoints Disponíveis

### 👥 Clientes (Customers)

#### Listar Todos os Clientes
```
GET /customers?page=1&limit=10
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": "...",
        "name": "João da Silva",
        "cpf": "12345678901",
        "email": "joao@email.com",
        "phone": "11987654321",
        "studentId": "2024001",
        "balance": 150.00,
        "active": true,
        "createdAt": "2025-01-10T10:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

#### Criar Cliente
```
POST /customers
```

**Body**:
```json
{
  "name": "Maria Santos",
  "cpf": "98765432100",
  "email": "maria@email.com",
  "phone": "11999887766",
  "studentId": "2024002",
  "initialBalance": 50.00
}
```

#### Buscar Cliente por ID
```
GET /customers/:id
```

#### Atualizar Cliente
```
PUT /customers/:id
```

**Body**:
```json
{
  "phone": "11888776655",
  "email": "novoemail@email.com"
}
```

#### Desativar Cliente
```
DELETE /customers/:id
```

---

### 🏷️ Categorias (Categories)

#### Listar Categorias
```
GET /categories?page=1&limit=10
```

#### Criar Categoria
```
POST /categories
```

**Body**:
```json
{
  "name": "Bebidas",
  "description": "Refrigerantes, sucos e água"
}
```

#### Atualizar Categoria
```
PUT /categories/:id
```

#### Excluir Categoria
```
DELETE /categories/:id
```

---

### 🛍️ Produtos (Products)

#### Listar Produtos
```
GET /products?page=1&limit=10&categoryId=...&search=coca
```

**Query Params**:
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 10)
- `categoryId`: Filtrar por categoria (opcional)
- `search`: Buscar por nome (opcional)

**Response**:
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "...",
        "name": "Coca-Cola Lata 350ml",
        "description": "Refrigerante Coca-Cola",
        "price": 5.50,
        "categoryId": "...",
        "categoryName": "Bebidas",
        "barcode": "7894900011517",
        "active": true,
        "createdAt": "2025-01-10T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Criar Produto
```
POST /products
```

**Body**:
```json
{
  "name": "Coca-Cola Lata 350ml",
  "description": "Refrigerante Coca-Cola",
  "price": 5.50,
  "categoryId": "categoria-uuid",
  "barcode": "7894900011517"
}
```

#### Buscar Produto por ID
```
GET /products/:id
```

#### Atualizar Produto
```
PUT /products/:id
```

#### Desativar Produto
```
DELETE /products/:id
```

---

### 📦 Estoque (Inventory)

#### Listar Todo o Estoque
```
GET /inventory?page=1&limit=10
```

**Response**:
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "id": "...",
        "productId": "...",
        "productName": "Coca-Cola Lata 350ml",
        "quantity": 100,
        "minQuantity": 10,
        "maxQuantity": 500,
        "status": "sufficient",
        "updatedAt": "2025-01-10T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

**Status possíveis**: `low` (baixo), `sufficient` (suficiente), `excess` (excesso)

#### Buscar Estoque de um Produto
```
GET /inventory/product/:productId
```

#### Adicionar Estoque
```
POST /inventory/add
```

**Body**:
```json
{
  "productId": "produto-uuid",
  "quantity": 100,
  "reason": "Compra de fornecedor"
}
```

**Nota**: Se o produto não tiver inventory, será criado automaticamente.

#### Itens com Estoque Baixo
```
GET /inventory/low-stock
```

#### Relatório de Estoque
```
GET /inventory/report
```

#### Histórico de Movimentações
```
GET /inventory/:inventoryId/movements
```

---

### 💳 Métodos de Pagamento (Payment Methods)

#### Listar Métodos de Pagamento
```
GET /payment-methods
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "...",
      "name": "cash",
      "displayName": "Dinheiro",
      "requiresAccount": false,
      "active": true
    },
    {
      "id": "...",
      "name": "account",
      "displayName": "Conta do Aluno",
      "requiresAccount": true,
      "active": true
    },
    {
      "id": "...",
      "name": "pix",
      "displayName": "PIX",
      "requiresAccount": false,
      "active": true
    }
  ]
}
```

---

### 💰 Contas (Accounts)

#### Adicionar Crédito na Conta do Cliente
```
POST /accounts/credit
```

**Body**:
```json
{
  "customerId": "cliente-uuid",
  "amount": 100.00,
  "description": "Recarga de créditos"
}
```

#### Buscar Histórico de Transações
```
GET /accounts/history/:customerId
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "...",
        "accountId": "...",
        "customerId": "...",
        "amount": 100.00,
        "type": "credit",
        "description": "Recarga de créditos",
        "userName": "Admin",
        "createdAt": "2025-01-10T10:00:00.000Z"
      }
    ]
  }
}
```

**Tipos de transação**: `credit` (crédito), `debit` (débito)

---

### 🛒 Vendas (Sales)

#### Criar Venda
```
POST /sales
```

**Body (Venda em Dinheiro - SEM cliente)**:
```json
{
  "paymentMethodId": "",
  "items": [
    {
      "productId": "produto-uuid-1",
      "quantity": 2
    },
    {
      "productId": "produto-uuid-2",
      "quantity": 1
    }
  ]
}
```

**Body (Venda na Conta do Aluno - COM cliente)**:
```json
{
  "customerId": "cliente-uuid",
  "paymentMethodId": "account-payment-method-uuid",
  "items": [
    {
      "productId": "produto-uuid-1",
      "quantity": 2
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "venda-uuid",
    "customerId": "cliente-uuid",
    "customerName": "João da Silva",
    "userId": "user-uuid",
    "userName": "Admin",
    "totalAmount": 11.00,
    "paymentMethodId": "...",
    "paymentMethod": "Cash",
    "status": "completed",
    "createdAt": "2025-01-10T10:00:00.000Z",
    "items": [
      {
        "id": "...",
        "productId": "...",
        "productName": "Coca-Cola Lata 350ml",
        "quantity": 2,
        "unitPrice": 5.50,
        "subtotal": 11.00
      }
    ]
  }
}
```

**Validações Automáticas**:
- ✅ Verifica se há estoque suficiente
- ✅ Deduz automaticamente do estoque
- ✅ Se pagamento for "conta", verifica saldo e debita
- ✅ Registra movimento no estoque

#### Listar Todas as Vendas
```
GET /sales?page=1&limit=10
```

#### Buscar Venda por ID
```
GET /sales/:id
```

#### Resumo de Vendas
```
GET /sales/summary?startDate=2025-01-01&endDate=2025-01-31
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalSales": 1500.00,
    "totalTransactions": 150,
    "averageTicket": 10.00,
    "period": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    }
  }
}
```

#### Cancelar Venda
```
POST /sales/:id/cancel
ou
PATCH /sales/:id/cancel
```

**O que acontece ao cancelar**:
- ✅ Venda marcada como `cancelled`
- ✅ Produtos devolvidos ao estoque
- ✅ Se foi pago via conta, valor reembolsado ao cliente

#### Histórico de Vendas de um Cliente
```
GET /customers/:customerId/sales?page=1&limit=10
```

---

## 💻 Exemplos de Código

### React + Axios

#### 1. Configurar Axios

```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

#### 2. Serviço de Autenticação

```javascript
// src/services/authService.js
import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data.data;

    // Armazenar token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    const { token, user } = response.data.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { token, user };
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
```

---

#### 3. Context de Autenticação (React)

```javascript
// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          authService.logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const { user } = await authService.login(email, password);
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

#### 4. Serviço de Produtos

```javascript
// src/services/productService.js
import api from './api';

export const productService = {
  async getAll(page = 1, limit = 10, filters = {}) {
    const params = new URLSearchParams({ page, limit, ...filters });
    const response = await api.get(`/products?${params}`);
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async create(productData) {
    const response = await api.post('/products', productData);
    return response.data.data;
  },

  async update(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data.data;
  },

  async delete(id) {
    await api.delete(`/products/${id}`);
  },
};
```

---

#### 5. Serviço de Vendas

```javascript
// src/services/saleService.js
import api from './api';

export const saleService = {
  async createSale(saleData) {
    const response = await api.post('/sales', saleData);
    return response.data.data;
  },

  async getAll(page = 1, limit = 10) {
    const response = await api.get(`/sales?page=${page}&limit=${limit}`);
    return response.data.data;
  },

  async getById(id) {
    const response = await api.get(`/sales/${id}`);
    return response.data.data;
  },

  async getSummary(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`/sales/summary?${params}`);
    return response.data.data;
  },

  async cancelSale(id) {
    const response = await api.post(`/sales/${id}/cancel`);
    return response.data.data;
  },
};
```

---

#### 6. Componente de Login

```jsx
// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Login - CantinaSoft</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
```

---

#### 7. Componente de Listagem de Produtos

```jsx
// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll(page, 10);
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      try {
        await productService.delete(id);
        loadProducts();
      } catch (error) {
        alert('Erro ao excluir produto');
      }
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Produtos</h2>

      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.categoryName}</td>
              <td>R$ {product.price.toFixed(2)}</td>
              <td>
                <button onClick={() => handleDelete(product.id)}>
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={page === 1}
        >
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
```

---

#### 8. Componente de Carrinho/PDV

```jsx
// src/pages/PDV.jsx
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { saleService } from '../services/saleService';
import { customerService } from '../services/customerService';

export function PDV() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadProducts();
  }, [search]);

  const loadProducts = async () => {
    const data = await productService.getAll(1, 50, { search });
    setProducts(data.products);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: 1
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.productId === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  };

  const handleFinalizeSale = async () => {
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    try {
      const saleData = {
        customerId: customer?.id || undefined,
        paymentMethodId: paymentMethod || '',
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      const sale = await saleService.createSale(saleData);

      alert(`Venda realizada com sucesso! Total: R$ ${sale.totalAmount.toFixed(2)}`);

      // Limpar carrinho
      setCart([]);
      setCustomer(null);
      setPaymentMethod('');

    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao finalizar venda');
    }
  };

  return (
    <div className="pdv-container">
      <div className="products-section">
        <h3>Produtos</h3>
        <input
          type="text"
          placeholder="Buscar produto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h4>{product.name}</h4>
              <p>R$ {product.price.toFixed(2)}</p>
              <button onClick={() => addToCart(product)}>
                Adicionar
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="cart-section">
        <h3>Carrinho</h3>

        {cart.length === 0 ? (
          <p>Carrinho vazio</p>
        ) : (
          <>
            {cart.map(item => (
              <div key={item.productId} className="cart-item">
                <span>{item.productName}</span>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value))}
                  min="1"
                />
                <span>R$ {(item.unitPrice * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item.productId)}>
                  Remover
                </button>
              </div>
            ))}

            <div className="cart-total">
              <h3>Total: R$ {calculateTotal().toFixed(2)}</h3>
            </div>

            <div className="payment-section">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Dinheiro</option>
                <option value="payment-method-uuid">Conta do Aluno</option>
                <option value="pix-uuid">PIX</option>
              </select>

              <button onClick={handleFinalizeSale} className="finalize-btn">
                Finalizar Venda
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

---

### React Query (Recomendado)

```javascript
// src/hooks/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useProducts(page = 1, limit = 10, filters = {}) {
  return useQuery({
    queryKey: ['products', page, limit, filters],
    queryFn: () => productService.getAll(page, limit, filters),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
    },
  });
}
```

---

## 🚨 Tratamento de Erros

### Códigos de Status HTTP

| Código | Significado | Ação Recomendada |
|--------|-------------|------------------|
| 200 | OK | Sucesso |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos - mostrar mensagem de erro |
| 401 | Unauthorized | Token inválido/expirado - redirecionar para login |
| 403 | Forbidden | Sem permissão - mostrar mensagem |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor - tentar novamente |

### Exemplo de Tratamento

```javascript
try {
  const sale = await saleService.createSale(saleData);
  // Sucesso
} catch (error) {
  if (error.response) {
    // Erro da API
    const { status, data } = error.response;

    switch (status) {
      case 400:
        alert(`Dados inválidos: ${data.message}`);
        break;
      case 401:
        alert('Sessão expirada. Faça login novamente.');
        authService.logout();
        break;
      case 403:
        alert('Você não tem permissão para realizar esta ação.');
        break;
      case 404:
        alert('Recurso não encontrado.');
        break;
      case 500:
        alert('Erro no servidor. Tente novamente mais tarde.');
        break;
      default:
        alert(data.message || 'Erro desconhecido');
    }
  } else if (error.request) {
    // Sem resposta do servidor
    alert('Servidor não está respondendo. Verifique sua conexão.');
  } else {
    // Erro ao configurar requisição
    alert('Erro ao processar requisição.');
  }
}
```

---

## 🔄 Fluxos Completos

### Fluxo 1: Realizar uma Venda

```javascript
async function realizarVenda() {
  // 1. Buscar produtos disponíveis
  const { products } = await productService.getAll(1, 50);

  // 2. Montar carrinho
  const cart = [
    { productId: products[0].id, quantity: 2 },
    { productId: products[1].id, quantity: 1 }
  ];

  // 3. Buscar métodos de pagamento
  const paymentMethods = await paymentMethodService.getAll();
  const cashMethod = paymentMethods.find(pm => pm.name === 'cash');

  // 4. Criar venda
  const sale = await saleService.createSale({
    paymentMethodId: cashMethod?.id || '',
    items: cart
  });

  console.log(`Venda criada! Total: R$ ${sale.totalAmount}`);
  return sale;
}
```

---

### Fluxo 2: Venda com Débito em Conta

```javascript
async function vendaComConta(customerId) {
  // 1. Buscar cliente e verificar saldo
  const customer = await customerService.getById(customerId);
  console.log(`Saldo do cliente: R$ ${customer.balance}`);

  // 2. Buscar método de pagamento "conta"
  const paymentMethods = await paymentMethodService.getAll();
  const accountMethod = paymentMethods.find(pm => pm.name === 'account');

  // 3. Criar venda
  const sale = await saleService.createSale({
    customerId: customer.id,
    paymentMethodId: accountMethod.id,
    items: [
      { productId: 'produto-uuid', quantity: 2 }
    ]
  });

  console.log(`Venda criada! Novo saldo: R$ ${customer.balance - sale.totalAmount}`);
  return sale;
}
```

---

### Fluxo 3: Adicionar Crédito ao Cliente

```javascript
async function adicionarCredito(customerId, amount) {
  // 1. Adicionar crédito
  const transaction = await accountService.addCredit({
    customerId,
    amount,
    description: 'Recarga de créditos'
  });

  // 2. Buscar histórico atualizado
  const history = await accountService.getHistory(customerId);

  console.log(`Crédito adicionado! Transações: ${history.transactions.length}`);
  return { transaction, history };
}
```

---

### Fluxo 4: Gerenciar Estoque

```javascript
async function gerenciarEstoque(productId) {
  // 1. Verificar estoque atual
  const inventory = await inventoryService.getByProductId(productId);
  console.log(`Estoque atual: ${inventory.quantity} unidades`);

  // 2. Adicionar estoque
  await inventoryService.addStock({
    productId,
    quantity: 100,
    reason: 'Compra de fornecedor'
  });

  // 3. Verificar itens com estoque baixo
  const lowStock = await inventoryService.getLowStock();
  console.log(`${lowStock.length} produtos com estoque baixo`);

  return lowStock;
}
```

---

## 📊 Dashboard - Dados Agregados

```javascript
async function getDashboardData() {
  // Buscar resumo de vendas do mês
  const startDate = new Date();
  startDate.setDate(1);
  const endDate = new Date();

  const salesSummary = await saleService.getSummary(
    startDate.toISOString(),
    endDate.toISOString()
  );

  // Buscar produtos com estoque baixo
  const lowStockItems = await inventoryService.getLowStock();

  // Buscar últimas vendas
  const recentSales = await saleService.getAll(1, 10);

  return {
    totalSales: salesSummary.totalSales,
    totalTransactions: salesSummary.totalTransactions,
    averageTicket: salesSummary.averageTicket,
    lowStockCount: lowStockItems.length,
    recentSales: recentSales.sales
  };
}
```

---

## 🔐 Proteção de Rotas

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Uso:
// <Route path="/admin" element={
//   <ProtectedRoute allowedRoles={['admin']}>
//     <AdminPage />
//   </ProtectedRoute>
// } />
```

---

## 📱 Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Table.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   └── ProtectedRoute.jsx
├── contexts/
│   └── AuthContext.jsx
├── hooks/
│   ├── useProducts.js
│   ├── useSales.js
│   └── useCustomers.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Sales.jsx
│   ├── PDV.jsx
│   ├── Customers.jsx
│   └── Inventory.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── productService.js
│   ├── saleService.js
│   ├── customerService.js
│   ├── inventoryService.js
│   ├── accountService.js
│   └── paymentMethodService.js
├── utils/
│   ├── formatters.js
│   └── validators.js
├── App.jsx
└── main.jsx
```

---

## 🔧 Utilitários Úteis

```javascript
// src/utils/formatters.js

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

export function formatCPF(cpf) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
```

---

## ✅ Checklist de Integração

- [ ] Configurar baseURL da API
- [ ] Implementar serviço de autenticação
- [ ] Configurar interceptors do Axios
- [ ] Criar context de autenticação
- [ ] Implementar proteção de rotas
- [ ] Criar serviços para cada módulo
- [ ] Implementar tratamento de erros
- [ ] Testar fluxo de login/logout
- [ ] Testar CRUD de produtos
- [ ] Testar fluxo de vendas
- [ ] Testar gestão de estoque
- [ ] Implementar formatação de valores
- [ ] Adicionar loading states
- [ ] Implementar paginação
- [ ] Testar em diferentes cenários de erro

---

## 📞 Suporte

Se encontrar problemas na integração:

1. Verifique se o backend está rodando: `http://localhost:3001/api/v1/database/status`
2. Verifique os logs do console do navegador
3. Verifique se o token está sendo enviado corretamente
4. Consulte o arquivo `POSTMAN_GUIDE.md` para exemplos de requisições

---

## 🚀 Próximos Passos

1. **Implementar WebSocket** para notificações em tempo real
2. **Adicionar validação de formulários** com bibliotecas como Yup ou Zod
3. **Implementar cache** com React Query
4. **Adicionar testes** com Jest e React Testing Library
5. **Implementar modo offline** com Service Workers

---

**Desenvolvido para CantinaSoft ERP** 🍔
