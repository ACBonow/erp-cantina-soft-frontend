# Configuração de Ambientes - CantinaSoft Frontend

Este documento explica como configurar os diferentes ambientes (desenvolvimento, homologação e produção) para o frontend do CantinaSoft.

## Visão Geral

O projeto utiliza variáveis de ambiente para configurar a URL do backend de acordo com o ambiente em que está sendo executado.

## Ambientes

### 1. Desenvolvimento (Local)

**Arquivo**: `.env`
**URL do Backend**: `http://localhost:3001`

Este é o ambiente local onde você desenvolve. O arquivo `.env` não é versionado no Git (está no `.gitignore`).

**Como configurar:**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# O arquivo já vem configurado para desenvolvimento local
# VITE_API_URL=http://localhost:3001
```

**Como executar:**
```bash
npm run dev
```

### 2. Homologação/Preview (Vercel Preview)

**Arquivo**: `.env.preview`
**URL do Backend**: `https://homolog-erp-cantina-soft-backend.vercel.app`

Este ambiente é usado para testes antes de ir para produção. Na Vercel, este ambiente é chamado de "Preview" e é usado para branches que não são a main.

**Configuração na Vercel:**
1. Acesse o dashboard do projeto na Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione a variável:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://homolog-erp-cantina-soft-backend.vercel.app`
   - **Environment**: Selecione apenas "Preview"

**Deploy automático:**
- Qualquer push em branches diferentes da `main` irá usar este ambiente
- Exemplo: branch `develop`, `feature/nova-funcionalidade`, etc.

### 3. Produção (Vercel Production)

**Arquivo**: `.env.production`
**URL do Backend**: `https://erp-cantina-soft-backend.vercel.app`

Este é o ambiente de produção real, acessado pelos usuários finais.

**Configuração na Vercel:**
1. Acesse o dashboard do projeto na Vercel
2. Vá em "Settings" → "Environment Variables"
3. Adicione a variável:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://erp-cantina-soft-backend.vercel.app`
   - **Environment**: Selecione apenas "Production"

**Deploy automático:**
- Pushes na branch `main` irão para produção
- Merges de pull requests na `main` também

## Estrutura de Arquivos

```
.
├── .env                    # Desenvolvimento (não versionado)
├── .env.example            # Template com comentários
├── .env.preview            # Homologação (versionado)
├── .env.production         # Produção (versionado)
└── src/
    └── infrastructure/
        └── http/
            └── httpClient.ts  # Cliente HTTP configurado
```

## Como Funciona

### No Código

O arquivo `src/infrastructure/http/httpClient.ts` utiliza a variável de ambiente:

```typescript
const getApiUrl = (): string => {
  const envApiUrl = import.meta.env.VITE_API_URL

  if (!envApiUrl) {
    console.warn('⚠️  VITE_API_URL not configured. Using default: http://localhost:3001')
    return 'http://localhost:3001'
  }

  if (import.meta.env.DEV) {
    console.log(`🌐 API URL configured: ${envApiUrl}`)
  }

  return envApiUrl
}

export const httpClient = new HttpClient(getApiUrl())
```

### Build do Vite

O Vite automaticamente:
1. Em desenvolvimento (`npm run dev`): usa `.env`
2. Em preview (`vercel --preview`): usa `.env.preview`
3. Em produção (`npm run build`): usa `.env.production`

## Configuração na Vercel (Passo a Passo)

### Para o Ambiente de Preview (Homologação)

1. Acesse: https://vercel.com/seu-usuario/erp-cantina-soft-frontend
2. Clique em "Settings"
3. Clique em "Environment Variables"
4. Clique em "Add New"
5. Preencha:
   ```
   Name: VITE_API_URL
   Value: https://homolog-erp-cantina-soft-backend.vercel.app
   ```
6. Em "Environments", selecione apenas: **Preview**
7. Clique em "Save"

### Para o Ambiente de Produção

1. Ainda em "Environment Variables"
2. Clique em "Add New"
3. Preencha:
   ```
   Name: VITE_API_URL
   Value: https://erp-cantina-soft-backend.vercel.app
   ```
4. Em "Environments", selecione apenas: **Production**
5. Clique em "Save"

## Verificando a Configuração

### No Console do Browser

Quando você acessa o aplicativo em desenvolvimento, verá no console:

```
🌐 API URL configured: http://localhost:3001
```

### Testando as Requisições

Você pode verificar no Network Tab do DevTools se as requisições estão sendo feitas para a URL correta.

## Troubleshooting

### Erro: "VITE_API_URL not configured"

**Solução**: Certifique-se de que você criou o arquivo `.env` localmente:
```bash
cp .env.example .env
```

### Requisições indo para localhost em produção

**Solução**:
1. Verifique se a variável `VITE_API_URL` está configurada na Vercel
2. Force um novo deploy na Vercel após adicionar a variável
3. Limpe o cache do navegador

### Deploy na Vercel não está usando a variável correta

**Solução**:
1. Verifique se você selecionou o ambiente correto (Preview ou Production)
2. Após adicionar/alterar variáveis, faça um novo deploy
3. Na Vercel, vá em "Deployments" → selecione o deploy → "Redeploy"

## Boas Práticas

1. **Nunca commite o arquivo `.env`** - Ele contém configurações locais
2. **Sempre atualize o `.env.example`** - Quando adicionar novas variáveis
3. **Use HTTPS em produção** - Nunca use HTTP para APIs em produção
4. **Documente novas variáveis** - Atualize este arquivo quando adicionar novas configs

## URLs de Referência

- **Backend Homologação**: https://homolog-erp-cantina-soft-backend.vercel.app
- **Backend Produção**: https://erp-cantina-soft-backend.vercel.app
- **Frontend Deploy**: Configurado automaticamente pela Vercel

## Exemplo de Uso

```typescript
// Qualquer repositório usando httpClient automaticamente
// usará a URL correta do ambiente

import { httpClient } from '@/infrastructure/http/httpClient'

// Esta requisição irá para a URL configurada no ambiente
const users = await httpClient.get('/users')
```

## Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build de produção (usa .env.production)
npm run build

# Preview do build
npm run preview

# Verificar variáveis de ambiente
echo $VITE_API_URL  # Linux/Mac
echo %VITE_API_URL%  # Windows CMD
$env:VITE_API_URL    # Windows PowerShell
```

## Suporte

Se você encontrar problemas com a configuração de ambientes, verifique:

1. Os arquivos `.env.*` estão criados corretamente
2. As variáveis estão configuradas na Vercel
3. O deploy foi feito após configurar as variáveis
4. O cache do navegador foi limpo

Para mais informações sobre variáveis de ambiente no Vite:
https://vitejs.dev/guide/env-and-mode.html
