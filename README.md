# CantinaSoft - Frontend

Sistema de gerenciamento de cantinas/bares escolares.

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

## Deploy

O projeto está configurado para deploy automático na Vercel.
