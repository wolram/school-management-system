# 🚀 EXEMPLOS PRÁTICOS DA API - FASE 1

## 📖 Guia Completo com Requests & Responses

---

## 🔐 1. AUTENTICAÇÃO - LOGIN

### Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "AdminPass123"
  }'
```

### Response Success (200)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbDAxIiwiZW1haWwiOiJhZG1pbkBzY2hvb2wuY29tIiwicHJvZmlsZSI6IkFETUlOIiwiaWF0IjoxNzI5MTYyMDAwLCJleHAiOjE3MjkyNDg0MDB9.signature...",
    "user": {
      "id": "cl01",
      "email": "admin@school.com",
      "name": "João Admin",
      "profile": "ADMIN"
    }
  },
  "timestamp": "2024-10-17T22:33:20.123Z"
}
```

### Response Error - Email/Senha Incorretos (401)
```json
{
  "success": false,
  "error": "Email ou senha incorretos",
  "timestamp": "2024-10-17T22:33:20.123Z"
}
```

### Response Error - Usuário Inativo (401)
```json
{
  "success": false,
  "error": "Usuário inativo",
  "timestamp": "2024-10-17T22:33:20.123Z"
}
```

---

## 👤 2. CRIAR NOVO USUÁRIO

### Prerequisitos
- ✅ Estar autenticado (ter token JWT)
- ✅ Perfil ADMIN

### Request
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerente@school.com",
    "password": "GerentePass123",
    "name": "Maria Gerente",
    "profile": "GERENTE"
  }'
```

### Response Success (201)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cl02",
      "email": "gerente@school.com",
      "name": "Maria Gerente",
      "profile": "GERENTE"
    }
  },
  "message": "Usuário criado com sucesso",
  "timestamp": "2024-10-17T22:35:00.123Z"
}
```

### Auditoria Registrada
```json
{
  "action": "CREATE",
  "table": "users",
  "recordId": "cl02",
  "description": "Novo usuário criado: Maria Gerente (gerente@school.com) com perfil GERENTE",
  "ipAddress": "192.168.1.100",
  "userAgent": "curl/7.68.0"
}
```

### Response Error - Email Já Existe (400)
```json
{
  "success": false,
  "error": "Email já cadastrado",
  "timestamp": "2024-10-17T22:35:00.123Z"
}
```

### Response Error - Sem Autenticação (401)
```json
{
  "success": false,
  "error": "Não autenticado",
  "timestamp": "2024-10-17T22:35:00.123Z"
}
```

### Response Error - Perfil Insuficiente (403)
```json
{
  "success": false,
  "error": "Acesso negado. Perfil insuficiente.",
  "timestamp": "2024-10-17T22:35:00.123Z"
}
```

---

## 🔍 3. OBTER DADOS DO USUÁRIO AUTENTICADO

### Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response Success (200)
```json
{
  "success": true,
  "data": {
    "id": "cl01",
    "email": "admin@school.com",
    "name": "João Admin",
    "profile": "ADMIN",
    "active": true,
    "createdAt": "2024-10-17T20:00:00.000Z",
    "updatedAt": "2024-10-17T22:30:00.000Z"
  },
  "timestamp": "2024-10-17T22:36:10.123Z"
}
```

### Response Error - Token Expirado (401)
```json
{
  "success": false,
  "error": "Token expirado",
  "timestamp": "2024-10-17T22:36:10.123Z"
}
```

### Response Error - Token Inválido (401)
```json
{
  "success": false,
  "error": "Token inválido",
  "timestamp": "2024-10-17T22:36:10.123Z"
}
```

---

## 📋 4. LISTAR TODOS OS USUÁRIOS

### Prerequisitos
- ✅ Perfil ADMIN
- ✅ Token JWT válido

### Request com Paginação
```bash
curl -X GET "http://localhost:5000/api/auth/users?page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response Success (200)
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "cl01",
        "email": "admin@school.com",
        "name": "João Admin",
        "profile": "ADMIN",
        "active": true,
        "createdAt": "2024-10-17T20:00:00.000Z",
        "updatedAt": "2024-10-17T22:30:00.000Z"
      },
      {
        "id": "cl02",
        "email": "gerente@school.com",
        "name": "Maria Gerente",
        "profile": "GERENTE",
        "active": true,
        "createdAt": "2024-10-17T22:35:00.000Z",
        "updatedAt": "2024-10-17T22:35:00.000Z"
      },
      {
        "id": "cl03",
        "email": "operador@school.com",
        "name": "Pedro Operador",
        "profile": "OPERADOR",
        "active": true,
        "createdAt": "2024-10-17T22:40:00.000Z",
        "updatedAt": "2024-10-17T22:40:00.000Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 10
  },
  "timestamp": "2024-10-17T22:41:30.123Z"
}
```

### Request com Paginação (Página 2)
```bash
curl -X GET "http://localhost:5000/api/auth/users?page=2&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Response quando não há dados
```json
{
  "success": true,
  "data": {
    "data": [],
    "total": 3,
    "page": 2,
    "limit": 10
  },
  "timestamp": "2024-10-17T22:41:30.123Z"
}
```

---

## 🔑 5. ALTERAR SENHA

### Request
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "AdminPass123",
    "newPassword": "NewAdminPass456"
  }'
```

### Response Success (200)
```json
{
  "success": true,
  "message": "Senha alterada com sucesso",
  "timestamp": "2024-10-17T22:42:50.123Z"
}
```

### Auditoria Registrada
```json
{
  "action": "UPDATE",
  "table": "users",
  "recordId": "cl01",
  "description": "Usuário admin@school.com alterou sua senha",
  "ipAddress": "192.168.1.100",
  "userAgent": "curl/7.68.0"
}
```

### Response Error - Senha Atual Incorreta (400)
```json
{
  "success": false,
  "error": "Senha atual incorreta",
  "timestamp": "2024-10-17T22:42:50.123Z"
}
```

### Response Error - Nova Senha Fraca (400)
```json
{
  "success": false,
  "error": "Senha deve ter no mínimo 8 caracteres",
  "timestamp": "2024-10-17T22:42:50.123Z"
}
```

### Response Error - Senhas Não Conferem (400)
```json
{
  "success": false,
  "error": "Senhas não conferem",
  "timestamp": "2024-10-17T22:42:50.123Z"
}
```

---

## 🏥 6. HEALTH CHECKS

### Request Simples
```bash
curl http://localhost:5000/
```

### Response (200)
```json
{
  "success": true,
  "message": "School Management System API",
  "version": "1.0.0",
  "timestamp": "2024-10-17T22:43:00.123Z"
}
```

### Request Detalhado (com DB check)
```bash
curl http://localhost:5000/health
```

### Response Success (200)
```json
{
  "success": true,
  "status": "OK",
  "database": "connected",
  "node_env": "development",
  "timestamp": "2024-10-17T22:43:05.123Z"
}
```

### Response Error - BD Desconectado (503)
```json
{
  "success": false,
  "status": "SERVICE_UNAVAILABLE",
  "database": "disconnected",
  "error": "connect ECONNREFUSED 127.0.0.1:5432",
  "timestamp": "2024-10-17T22:43:05.123Z"
}
```

---

## 🔐 SEGURANÇA - Fluxo Completo de Autenticação

### Cenário: Novo usuário se registra e faz login

#### 1️⃣ Admin cria novo usuário
```bash
# Admin login primeiro
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"AdminPass123"}' \
  | jq -r '.data.token')

# Admin cria operador
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@school.com",
    "password": "OperadorPass123",
    "name": "João Operador",
    "profile": "OPERADOR"
  }'
```

#### 2️⃣ Novo operador faz login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@school.com",
    "password": "OperadorPass123"
  }'

# Response com novo TOKEN para operador
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cl04",
      "email": "operador@school.com",
      "name": "João Operador",
      "profile": "OPERADOR"
    }
  }
}
```

#### 3️⃣ Operador tenta criar novo usuário (deve falhar)
```bash
OPERADOR_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:5000/api/auth/signup \
  -H "Authorization: Bearer $OPERADOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novouser@school.com",
    "password": "NewUserPass123",
    "name": "Novo Usuário",
    "profile": "OPERADOR"
  }'

# Response: 403 Forbidden
{
  "success": false,
  "error": "Acesso negado. Perfil insuficiente.",
  "timestamp": "2024-10-17T22:50:00.123Z"
}
```

#### 4️⃣ Rastrear auditoria
```bash
# Query para encontrar logs deste operador
# (Endpoint a ser implementado na Fase 2)
```

---

## ⚠️ VALIDAÇÕES EJEMPLOS

### 1. Validação de Email
```bash
# Email inválido
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email","password":"Pass123"}'

# Response
{
  "success": false,
  "error": "Validação falhou: Email inválido",
  "timestamp": "2024-10-17T22:51:00.123Z"
}
```

### 2. Validação de Senha (muito fraca)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@school.com",
    "password": "weak",
    "name": "Test User",
    "profile": "OPERADOR"
  }'

# Response
{
  "success": false,
  "error": "Validação falhou: Senha deve ter no mínimo 8 caracteres",
  "timestamp": "2024-10-17T22:51:30.123Z"
}
```

### 3. Validação de Senha (sem maiúscula)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@school.com",
    "password": "lowercase123",
    "name": "Test User",
    "profile": "OPERADOR"
  }'

# Response
{
  "success": false,
  "error": "Validação falhou: Senha deve conter letra maiúscula",
  "timestamp": "2024-10-17T22:51:45.123Z"
}
```

---

## 🧪 TESTE COM POSTMAN

### Importar Collection
```json
{
  "info": {
    "name": "School Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:5000/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@school.com\",\"password\":\"AdminPass123\"}"
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/auth/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        },
        {
          "name": "List Users",
          "request": {
            "method": "GET",
            "url": "http://localhost:5000/api/auth/users?page=1&limit=10",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## 🔄 FLUXO DE AUDITORIA

### Exemplo: Registro de Mudança

Quando um usuário altera a senha:

1. **Request** → `POST /api/auth/change-password`
2. **Validação** → Zod schema valida
3. **Processamento** → bcryptjs faz hash da nova senha
4. **Update DB** → User.password atualizada
5. **Auditoria** → AuditLog registrado com:
   - userId: admin@school.com
   - action: UPDATE
   - table: users
   - description: "Usuário admin@school.com alterou sua senha"
   - ipAddress: 192.168.1.100
   - userAgent: Mozilla/5.0...
   - timestamp: 2024-10-17T22:52:00Z

### Query de Auditoria (para Fase 2)
```sql
SELECT
  al.id,
  u.name as user_name,
  al.action,
  al.table,
  al.description,
  al.ipAddress,
  al.createdAt
FROM audit_logs al
JOIN users u ON al.userId = u.id
ORDER BY al.createdAt DESC
LIMIT 50;
```

---

## 📊 TESTE DE CARGA (Exemplo)

### Teste simples com Apache Bench
```bash
# 1000 requests, 10 concorrentes
ab -n 1000 -c 10 http://localhost:5000/health

# Output esperado:
# Requests per second:  500 [#/sec] (mean)
# Time per request:     2.000 [ms] (mean)
# Transfer rate:        120.50 [Kbytes/sec] received
```

---

## 🐛 DEBUGGING

### Ativar Verbose Logging
```bash
# Ver todas as queries SQL (desenvolvimento)
# Adicionar ao .env:
# DATABASE_LOGGING=true
```

### Ver Headers Completos
```bash
curl -v -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"AdminPass123"}'

# Mostra:
# > POST /api/auth/login HTTP/1.1
# > Host: localhost:5000
# > Content-Type: application/json
# < HTTP/1.1 200 OK
# < X-Powered-By: Express
# < Strict-Transport-Security: max-age=15552000; includeSubDomains
```

---

## 📱 USANDO COM JAVASCRIPT/FETCH

```javascript
// Fazer login
const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@school.com',
    password: 'AdminPass123'
  })
});

const { data: { token } } = await loginResponse.json();

// Usar token
const meResponse = await fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const me = await meResponse.json();
console.log(me.data); // { id, email, name, profile, active, ... }

// Criar novo usuário
const signupResponse = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'newuser@school.com',
    password: 'NewUserPass123',
    name: 'New User',
    profile: 'OPERADOR'
  })
});

const newUser = await signupResponse.json();
console.log(newUser.data.user); // Novo usuário criado
```

---

## 🚀 PRÓXIMAS CHAMADAS DE API (Fase 2+)

```
POST   /api/segments              → Criar segmento
GET    /api/segments              → Listar segmentos
PUT    /api/segments/:id          → Atualizar segmento
DELETE /api/segments/:id          → Deletar segmento

POST   /api/series                → Criar série
GET    /api/series                → Listar séries
PUT    /api/series/:id            → Atualizar série

POST   /api/classes               → Criar turma
GET    /api/classes               → Listar turmas

POST   /api/students              → Criar aluno
GET    /api/students              → Listar alunos
PUT    /api/students/:id          → Atualizar aluno
POST   /api/students/:id/matrix   → Atualizar matriz

POST   /api/prices                → Criar preço
GET    /api/prices                → Listar preços
PUT    /api/prices/:id            → Atualizar preço

POST   /api/audit-logs            → Buscar logs (com filtros)
GET    /api/reports/dashboard     → Dashboard gerencial
GET    /api/reports/export/:format → Exportar relatório
```

---

**Gerado com [Claude Code](https://claude.com/claude-code) 🤖**
