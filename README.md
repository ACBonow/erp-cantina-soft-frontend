# 🍔 CantinaSoft - Sistema de Gestão para Cantinas Escolares

Sistema ERP completo para gestão de cantinas e bares escolares, desenvolvido com Vue 3, TypeScript, Vuetify 3 e arquitetura limpa.

## ✨ Funcionalidades Implementadas

### 🌐 Internacionalização
- ✅ Suporte a 2 idiomas (PT-BR e EN-US)
- ✅ Toggle instantâneo de idioma
- ✅ Traduções completas de toda a interface

### 🎨 Temas
- ✅ Tema Light (claro)
- ✅ Tema Dark (escuro)
- ✅ Alternância instantânea
- ✅ Persistência da escolha do usuário

### 🔐 Autenticação e Autorização
- ✅ Sistema de login com JWT
- ✅ 4 níveis de acesso (Admin, Manager, Responsible, Customer)
- ✅ Guards de rotas
- ✅ Controle de acesso baseado em roles na UI

### 📊 Módulos do Sistema (Backend Integration Ready)
- ✅ **Dashboard** - Visão geral com estatísticas
- ✅ **Clientes** - Gestão completa (stores + repositories)
- ✅ **Produtos** - Cadastro e controle (stores + repositories)
- ✅ **Categorias** - Organização (stores + repositories)
- ✅ **Vendas** - PDV e histórico (stores + repositories)
- ✅ **Inventário** - Controle de estoque (stores + repositories)
- ✅ **Relatórios** - Análises (stores + repositories)

### 🎯 UI/UX
- ✅ Design responsivo (Mobile, Tablet, Desktop)
- ✅ Navegação intuitiva com menu lateral
- ✅ Sistema de notificações toast
- ✅ Componentes reutilizáveis
- ✅ Loading states e feedback visual
- ✅ Dialogs de confirmação

## Tecnologias

- Vue.js 3
- TypeScript
- Vuetify 3
- Pinia (State Management)
- Vue Router
- Vite
- Axios

## Arquitetura

O projeto segue os princípios de Clean Architecture e Clean Code:

- **presentation**: Componentes Vue, páginas e composables
- **domain**: Entidades, casos de uso e interfaces
- **infrastructure**: Implementações de repositórios, serviços externos
- **shared**: Utilitários, constantes e helpers compartilhados

## Configuração do Ambiente

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Build para Produção

```bash
npm run build
```

## Lint e Formatação

```bash
npm run lint
npm run format
```

## 📚 Documentação Completa

- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Guia completo de integração com backend
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação da lógica
- **[UI_DOCUMENTATION.md](./UI_DOCUMENTATION.md)** - Documentação detalhada da UI
- **[UI_IMPLEMENTATION_SUMMARY.md](./UI_IMPLEMENTATION_SUMMARY.md)** - Resumo da implementação da UI

## 🎯 Estrutura do Projeto

```
src/
├── domain/              # Entidades e interfaces de repositório
├── infrastructure/      # Implementação de repositórios e HTTP client
├── store/              # Stores Pinia para gerenciamento de estado
├── presentation/        # Layouts, componentes e páginas
├── composables/        # Composables reutilizáveis
├── i18n/               # Arquivos de tradução (PT-BR e EN-US)
└── shared/             # Utilitários, constantes e tipos
```

## 💡 Como Usar

### Trocar Idioma
Clique no ícone de tradução (🌐) no AppBar para alternar entre Português e Inglês.

### Trocar Tema
Clique no ícone de sol/lua (☀️/🌙) no AppBar para alternar entre temas claro e escuro.

### Fazer Login
1. Acesse a página de login
2. Insira email e senha
3. Sistema redirecionará para o dashboard

### Usar as Stores
```typescript
import { useCustomerStore } from '@/store/customer'

const customerStore = useCustomerStore()
await customerStore.fetchCustomers({ page: 1, limit: 10 })
```

## 🚀 Deploy

O projeto está configurado para deploy automático na Vercel.

---

**Desenvolvido com ❤️ usando Vue 3 + TypeScript + Vuetify 3**
