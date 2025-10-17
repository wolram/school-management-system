# 🎓 School Management System

Sistema Robusto e Intuitivo de Gestão de Horário Integral para Instituições de Ensino.

## 📋 Visão Geral

Um sistema web completo para automatizar e otimizar a administração de contratos de alunos, cálculos financeiros, geração de relatórios operacionais e comunicação em instituições de educação.

## 🏗️ Arquitetura

```
school-management-system/
├── backend/              (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── config/       (Database, JWT, Email)
│   │   ├── middleware/   (Auth, Audit, Validação)
│   │   ├── routes/       (API endpoints)
│   │   ├── controllers/  (Lógica de controle)
│   │   ├── services/     (Lógica de negócio)
│   │   ├── types/        (TypeScript interfaces)
│   │   └── utils/        (Helpers & validation)
│   ├── prisma/           (Database schema)
│   └── package.json
│
└── frontend/             (Next.js 14 + React 18 + TypeScript)
    ├── app/              (Pages & layouts)
    ├── components/       (React components)
    ├── lib/              (Utilities & API client)
    ├── types/            (TypeScript types)
    └── package.json
```

## 🚀 Stack Tecnológico

### Backend
- **Node.js + Express** - Servidor web
- **TypeScript** - Type safety
- **PostgreSQL + Prisma** - Banco de dados
- **JWT** - Autenticação
- **Bcryptjs** - Criptografia de senha
- **Zod** - Validação
- **ExcelJS, PDFKit, Docx** - Exportação de dados

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **React Query** - State management
- **React Hook Form** - Form management
- **Recharts** - Gráficos & dashboards
- **Axios** - HTTP client

## 📚 Fase 1: Infraestrutura & Segurança ✅

### ✅ Implementado

#### Backend
- [x] **Estrutura de diretórios** completa
- [x] **Prisma Schema** com todas as entidades:
  - Usuários (3 perfis: Admin, Gerente, Operador)
  - Segmentos, Séries, Turmas
  - Alunos e Matriz de Contrato
  - Preços e Horas Extras
  - Log de Auditoria
  - Notificações e Email Queue

- [x] **Validação de dados**
  - Formato de horários (HH:mm com incrementos de 30min)
  - Validação de email
  - Validação de senha (mínimo 8 caracteres, maiúscula, minúscula, número)
  - Schemas Zod completos

- [x] **Autenticação JWT**
  - Login com email e senha
  - Geração de tokens
  - Verificação de tokens
  - Renovação automática

- [x] **Controle de Acesso (RBAC)**
  - 3 perfis de usuário
  - Middleware de autorização
  - Permissões por rota

- [x] **Log de Auditoria**
  - Registro automático de CREATE, UPDATE, DELETE
  - Descrições humanizadas
  - Rastreamento de IP e User-Agent
  - Filtros avançados de busca

- [x] **API REST**
  - Health check
  - Login endpoint
  - User management (criar, listar, desativar)
  - Alterar senha
  - CORS configurado

#### Frontend
- [x] Estrutura de diretórios
- [x] Configuração inicial (package.json, tsconfig, etc)

## 🔧 Instalação & Setup

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- npm ou yarn

### 1. Clonar Repositório
```bash
git clone <repository-url>
cd school-management-system
```

### 2. Instalar Dependências

#### Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas credenciais PostgreSQL
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Configurar Banco de Dados

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed  # Opcional: popular dados iniciais
```

### 4. Iniciar Desenvolvimento

```bash
# Na raiz do projeto
npm run dev

# Ou separadamente:

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 📖 Documentação da API

### Autenticação

#### POST /api/auth/login
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "cuid123",
      "email": "user@example.com",
      "name": "John Doe",
      "profile": "GERENTE"
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

#### POST /api/auth/signup (ADMIN only)
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123",
  "name": "Jane Doe",
  "profile": "OPERADOR"
}
```

#### GET /api/auth/me
```bash
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/auth/me
```

#### GET /api/auth/users (ADMIN only)
```bash
curl -H "Authorization: Bearer {token}" http://localhost:5000/api/auth/users?page=1&limit=50
```

#### POST /api/auth/change-password
```json
{
  "oldPassword": "OldPass123",
  "newPassword": "NewSecurePass123"
}
```

## 📊 Estrutura de Dados

### Usuários (Users)
- ID, Email, Senha (hash), Nome, Perfil (ADMIN/GERENTE/OPERADOR)
- Status ativo/inativo

### Estrutura Acadêmica
- **Segmentos**: Ex. Educação Infantil
  - **Séries**: Ex. Maternal (dentro de Educação Infantil)
    - **Turmas**: Ex. Turma A (dentro de Maternal)

### Alunos
- Dados cadastrais
- Série e Turma
- Status (Ativo/Inativo)
- Responsável e contatos

### Matriz de Contrato (Semanal)
- Por dia da semana (Seg-Sex)
- Horário de entrada e saída
- Serviços contratados (Almoço, Jantar, Judô, etc)

### Preços
- Mensalidade (por Série)
- Serviços Extras
- Valor/Hora Extra

### Log de Auditoria
- Usuário responsável
- Ação (CREATE/UPDATE/DELETE)
- Tabela e ID do registro
- Descrição humanizada
- Valores antigos e novos
- Timestamp e IP

## 🔐 Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT com expiração configurável
- ✅ CORS restritivo
- ✅ Helmet para headers de segurança
- ✅ Validação rigorosa de inputs
- ✅ Auditoria completa de mudanças
- ✅ Logs de IP e User-Agent
- ✅ Rate limiting (a implementar)

## 📈 Próximas Fases

### Fase 2: Módulo Acadêmico (1-2 semanas)
- [ ] CRUD de Segmentos, Séries, Turmas
- [ ] Interface hierárquica forçada
- [ ] Integridade referencial

### Fase 3: Gestão de Alunos (2 semanas)
- [ ] Cadastro completo
- [ ] Matriz de contrato visual (drag-and-drop)
- [ ] Histórico de mudanças
- [ ] Migração de turma

### Fase 4: Precificação (1 semana)
- [ ] Central de preços (Admin)
- [ ] Gerenciamento de vigência

### Fase 5: Cálculos Financeiros (2 semanas)
- [ ] Motor de horas extras
- [ ] Calculadora de orçamento
- [ ] Simulador com descontos

### Fase 6: Relatórios & Dashboard (2 semanas)
- [ ] Dashboard gerencial
- [ ] Gerador dinâmico
- [ ] Exportação (PDF/Excel/Word)

### Fase 7: Integrações (1 semana)
- [ ] Importação em massa (CSV/XLSX)
- [ ] Notificações por e-mail
- [ ] Webhooks

### Fase 8: Testes & Deploy (1-2 semanas)
- [ ] Testes unitários
- [ ] Testes integração
- [ ] Performance
- [ ] Deploy produção

## 🤝 Contribuição

Este projeto foi desenvolvido pela Anthropic em colaboração com Claude Code.

## 📄 Licença

MIT

---

**Generated with [Claude Code](https://claude.com/claude-code) 🤖**
