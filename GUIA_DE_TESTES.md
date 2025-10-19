# 🧪 Guia Completo de Testes - Fases 4 e 5

## ✅ Status dos Servidores

- ✅ **Backend:** Rodando em http://localhost:5001
- ✅ **Frontend:** Rodando em http://localhost:3000
- ✅ **Banco de Dados:** Conectado e sincronizado

---

## 📋 Pré-requisitos

Certifique-se de ter:
1. ✅ Backend rodando (`cd backend && npm run dev`)
2. ✅ Frontend rodando (`cd frontend && npm run dev`)
3. ✅ Usuário admin criado (email: `admin@example.com`, senha: `Admin123`)
4. ✅ Pelo menos 1 segmento, 1 série, 1 turma e 1 aluno cadastrados

---

## 🎯 TESTE 1: Interface de Preços (Frontend)

### Acesse: http://localhost:3000/dashboard/prices

### Passos:

1. **Login:**
   - Email: `admin@example.com`
   - Senha: `Admin123`

2. **Criar Preço de Mensalidade:**
   - Clique em "Novo Preço"
   - Tipo: `Mensalidade`
   - Série: Selecione uma série existente
   - Valor: `1500.00`
   - Data de Vigência: `2025-01-01`
   - Clique em "Criar"
   - ✅ **Resultado Esperado:** Preço aparece na tabela

3. **Criar Preço de Serviço (Almoço):**
   - Clique em "Novo Preço"
   - Tipo: `Serviço`
   - Nome do Serviço: `Almoço`
   - Valor: `25.00`
   - Data de Vigência: `2025-01-01`
   - Clique em "Criar"
   - ✅ **Resultado Esperado:** Serviço aparece na tabela

4. **Criar Preço de Serviço (Judô):**
   - Clique em "Novo Preço"
   - Tipo: `Serviço`
   - Nome do Serviço: `Judô`
   - Valor: `80.00`
   - Data de Vigência: `2025-01-01`
   - Clique em "Criar"

5. **Criar Preço de Hora Extra:**
   - Clique em "Novo Preço"
   - Tipo: `Hora Extra`
   - Valor: `50.00`
   - Valor por Hora: `50.00`
   - Data de Vigência: `2025-01-01`
   - Clique em "Criar"

6. **Filtrar Preços:**
   - No dropdown "Tipo", selecione `Serviço`
   - ✅ **Resultado:** Apenas serviços aparecem
   - Selecione "Todos" novamente

7. **Editar um Preço:**
   - Clique em "Editar" em qualquer preço
   - Altere o valor
   - Clique em "Atualizar"
   - ✅ **Resultado:** Valor atualizado na tabela

8. **Desativar um Preço:**
   - Clique em "Desativar" em um preço ativo
   - Confirme
   - ✅ **Resultado:** Status muda para "Inativo"

---

## 🎯 TESTE 2: Cálculos Financeiros (Frontend)

### Acesse: http://localhost:3000/dashboard/calculations

### Aba 1: Orçamento Mensal

1. **Calcular Orçamento:**
   - Selecione um aluno
   - Selecione o mês: `Outubro`
   - Selecione o ano: `2025`
   - Clique em "Calcular Orçamento"

2. **✅ Resultado Esperado:**
   - Card AZUL: Mensalidade (ex: R$ 1.500,00)
   - Card VERDE: Serviços contratados (lista com Almoço, Judô, etc)
   - Card LARANJA: Horas extras (se houver)
   - Card ROXO: **TOTAL GERAL** (soma de tudo)

### Aba 2: Simulador
- ℹ️ Placeholder (desenvolvimento futuro)

### Aba 3: Horas Extras

1. **Ver Histórico:**
   - Selecione um aluno
   - Data Inicial: `2025-10-01`
   - Data Final: `2025-10-31`
   - Clique em "Carregar Histórico"

2. **✅ Resultado Esperado:**
   - Tabela com histórico de horas extras
   - Colunas: Data, Dia da Semana, Horas Extras, Valor/Hora, Valor Total
   - Linha de TOTAL no final

---

## 🎯 TESTE 3: API via cURL

### 1. Fazer Login e Obter Token

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123"
  }'
```

**Copie o `token` da resposta** e use nas próximas requisições.

### 2. Criar Preço via API

```bash
# Substitua SEU_TOKEN pelo token obtido
TOKEN="SEU_TOKEN_AQUI"

# Criar preço de mensalidade
curl -X POST http://localhost:5001/api/prices \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "MENSALIDADE",
    "seriesId": "ID_DA_SERIE",
    "value": 1500.00,
    "effectiveDate": "2025-01-01"
  }'
```

### 3. Listar Todos os Preços

```bash
curl -X GET http://localhost:5001/api/prices \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Calcular Orçamento Mensal

```bash
# Substitua STUDENT_ID pelo ID de um aluno
curl -X GET "http://localhost:5001/api/calculations/budget/STUDENT_ID?month=10&year=2025" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Calcular Horas Extras

```bash
curl -X POST http://localhost:5001/api/calculations/extra-hours \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "studentId": "STUDENT_ID",
    "date": "2025-10-15",
    "realEntryTime": "07:30",
    "realExitTime": "13:00"
  }'
```

---

## 🎯 TESTE 4: Script Automatizado

Execute o script de teste completo:

```bash
cd backend
./test-phases-4-5.sh
```

O script irá:
1. Solicitar que você faça login e forneça o token
2. Criar automaticamente todos os tipos de preços
3. Calcular orçamento de um aluno
4. Calcular horas extras
5. Mostrar histórico

---

## 📊 Checklist de Validação

### Fase 4 - Preços:
- [ ] Criar preço de mensalidade
- [ ] Criar preço de serviço
- [ ] Criar preço de hora extra
- [ ] Listar preços com filtros
- [ ] Editar preço existente
- [ ] Desativar preço
- [ ] Ver histórico de preços

### Fase 5 - Cálculos:
- [ ] Calcular horas extras de um dia
- [ ] Ver orçamento mensal completo
- [ ] Breakdown detalhado (mensalidade + serviços + horas extras)
- [ ] Ver histórico de horas extras por período
- [ ] Total geral calculado corretamente

### Interface:
- [ ] Menu "Preços" aparece com ícone 💰
- [ ] Menu "Cálculos" aparece com ícone 🧮
- [ ] Páginas são responsivas (testar mobile)
- [ ] Valores formatados em R$ (pt-BR)
- [ ] Datas formatadas em pt-BR
- [ ] Loading states funcionam
- [ ] Mensagens de erro aparecem

---

## 🐛 Problemas Comuns

### Erro: "Token não fornecido"
**Solução:** Faça login primeiro e certifique-se de copiar o token corretamente.

### Erro: "Série não encontrada"
**Solução:** Crie pelo menos uma série em `/dashboard/series` antes de criar preços de mensalidade.

### Erro: "Aluno não encontrado"
**Solução:** Crie pelo menos um aluno em `/dashboard/students` antes de calcular orçamentos.

### Erro: "CORS"
**Solução:** Backend já está configurado para aceitar localhost. Verifique se está usando `http://localhost:3000` (não `127.0.0.1`).

---

## 📸 Screenshots Esperados

### Página de Preços:
- Tabela com colunas: Tipo, Descrição, Valor, Vigência, Status, Ações
- Filtros no topo
- Botão "Novo Preço" destacado
- Modal de criação/edição com campos dinâmicos

### Página de Cálculos:
- 3 abas: Orçamento Mensal, Simulador, Horas Extras
- Cards coloridos com breakdown financeiro
- Total geral em destaque
- Tabela de histórico com totalizadores

---

## ✅ Tudo Funcionando?

Se todos os testes passaram, você tem:
- ✅ Sistema de precificação completo
- ✅ Motor de cálculos financeiros operacional
- ✅ Interface amigável e responsiva
- ✅ API REST totalmente funcional

**Parabéns! Fases 4 e 5 implementadas com sucesso! 🎉**

---

**Gerado automaticamente por Claude Code** 🤖
