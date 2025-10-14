# My Wallet

Uma aplicação moderna de gerenciamento financeiro pessoal construída com Next.js, React e Prisma.

## 🔧 Pré-requisitos

- **Node.js**: Versão 20 ou superior
- **PostgreSQL**: Para o banco de dados
- **NPM**: Para gerenciamento de pacotes

## 🚀 Tecnologias

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca para interfaces de usuário
- **Prisma** - ORM para TypeScript/JavaScript
- **Material-UI** - Biblioteca de componentes
- **TypeScript** - Superset do JavaScript com tipagem estática
- **PostgreSQL** - Banco de dados relacional

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/mathec-x/my-wallet.git
cd my-wallet

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute as migrações do banco
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🏗️ Estrutura da Aplicação

### Arquitetura em Camadas

O projeto segue uma arquitetura em camadas bem definida:

- **App**: Interface do usuário (páginas, componentes, hooks)
- **Server**: Lógica de negócio (use cases, domínios, infraestrutura)
- **Shared**: Recursos compartilhados (schemas, validações)

### Sistema de Componentes

A aplicação utiliza uma estrutura de componentes inspirada no Atomic Design, mas com nomenclatura própria:

#### **Primitives** (`src/app/components/primitives/`)
Componentes básicos e reutilizáveis:
- Avatars, badges, botões, inputs
- Elementos fundamentais da interface

#### **Elements** (`src/app/components/elements/`)
Blocos visuais intermediários:
- Cards, modais, tabelas
- Componentes que combinam primitives

#### **UI** (`src/app/components/ui/`)
Componentes de interface específicos:
- Botões especializados, inputs customizados
- Elementos visuais com comportamento específico

#### **Layouts** (`src/app/components/layouts/`)
Componentes de estrutura:
- Header, footer, sidebar
- Containers e wrappers de páginas

#### **Composites** (`src/app/components/composites/`)
Componentes completos e complexos:
- Formulários compostos, dashboards
- Seções inteiras da aplicação

## 🛠️ Gerador de Componentes

O projeto inclui um CLI personalizado para gerar componentes automaticamente na estrutura correta:

```bash
# Adicionar nova página
npx add page nome-da-pagina
npx add page nome-da-pagina --private  # Para páginas privadas

# Adicionar drawer/modal
npx add drawer nome-do-drawer

# Adicionar ação
npx add action nome-da-acao

# Adicionar componentes
npx add component NomeDoComponente --primitive    # Componente primitivo
npx add component NomeDoComponente --element      # Elemento visual
npx add component NomeDoComponente --ui           # Componente UI
npx add component NomeDoComponente --layout       # Layout
npx add component NomeDoComponente --composite    # Componente composto

# Adicionar use case (server-side)
npx add useCase nomeDoUseCase

# Adicionar serviço de domínio
npx add domain nomeDoServico
```

Cada comando gera automaticamente:
- Arquivo do componente com template básico
- Arquivo de estilos (quando aplicável)
- Estrutura de pastas organizada
- Tipos TypeScript apropriados

## 🗃️ Banco de Dados

O projeto utiliza Prisma como ORM com PostgreSQL:

### Modelos Principais:
- **User**: Usuários da aplicação
- **Account**: Contas financeiras dos usuários
- **Entry**: Entradas/transações (receitas e despesas)

### Comandos Prisma:
```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Visualizar dados
npx prisma studio

# Reset do banco (desenvolvimento)
npx prisma migrate reset
```

## 🔐 Autenticação

A aplicação possui sistema de autenticação JWT com:
- Login/logout
- Proteção de rotas privadas
- Middleware de autenticação
- Provider de contexto de usuário

## 📝 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (Turbopack)
npm run build        # Build de produção (Turbopack)
npm run start        # Servidor de produção
npm run lint         # Verificação de código com ESLint
```

## 🌍 Variáveis de Ambiente

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/mywallet"
JWT_SECRET="seu-jwt-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

## 📁 Estrutura de Pastas

```
src/
├── app/                    # App Router do Next.js
│   ├── (private)/         # Rotas privadas
│   ├── (public)/          # Rotas públicas
│   ├── @drawer/           # Parallel routes para modais
│   ├── actions/           # Server Actions
│   ├── components/        # Sistema de componentes
│   └── hooks/             # Custom hooks
├── server/                # Lógica server-side
│   ├── application/       # Use cases
│   ├── domain/           # Regras de negócio
│   └── infra/            # Infraestrutura (Prisma, etc)
└── shared/               # Recursos compartilhados
    └── schemas/          # Validações Zod
```

## 🚀 Deploy

A aplicação está preparada para deploy em plataformas como Vercel, que oferecem suporte nativo ao Next.js e PostgreSQL.

## 📄 Licença

Este projeto está sob a licença MIT.