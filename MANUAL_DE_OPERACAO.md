# 📖 Manual de Operação - School Management System

## 🎯 Índice

1. [Visão Geral](#visão-geral)
2. [Acesso ao Sistema](#acesso-ao-sistema)
3. [Estrutura Hierárquica](#estrutura-hierárquica)
4. [Fluxo de Cadastro Correto](#fluxo-de-cadastro-correto)
5. [Funcionalidades por Módulo](#funcionalidades-por-módulo)
6. [Guia Passo a Passo](#guia-passo-a-passo)
7. [Perguntas Frequentes](#perguntas-frequentes)
8. [Resolução de Problemas](#resolução-de-problemas)

---

## 📋 Visão Geral

O **School Management System (SMS)** é um sistema completo de gestão escolar que permite gerenciar:

- 🏫 **Estrutura Acadêmica**: Segmentos, Séries e Turmas
- 👨‍🎓 **Alunos**: Matrículas, dados pessoais e responsáveis
- 💰 **Preços**: Mensalidades, serviços e horas extras
- 🧮 **Cálculos Financeiros**: Orçamentos mensais e simulações

---

## 🔐 Acesso ao Sistema

### Credenciais Padrão

```
URL: http://localhost:3000
Email: admin@example.com
Senha: Admin123
```

### Perfis de Usuário

- **ADMIN**: Acesso total ao sistema
- **GERENTE**: Gestão acadêmica e financeira
- **PROFESSOR**: Consulta de alunos e turmas
- **SECRETARIA**: Cadastro de alunos e consultas

---

## 🏗️ Estrutura Hierárquica

O sistema segue uma hierarquia rígida que **DEVE** ser respeitada na ordem de cadastro:

```
1. SEGMENTO (ex: Educação Infantil, Ensino Fundamental)
   ↓
2. SÉRIE (ex: 1º Ano, 2º Ano, Maternal)
   ↓
3. TURMA (ex: Turma A, Turma Almôndega)
   ↓
4. ALUNO (matrícula individual)
```

**⚠️ IMPORTANTE**: Você **NÃO PODE** criar um item sem ter criado o nível superior!

---

## ✅ Fluxo de Cadastro Correto

### 1️⃣ Primeiro Acesso - Configuração Inicial

Siga esta ordem **EXATAMENTE**:

1. **Login** com credenciais de administrador
2. **Criar Segmentos** (ex: Educação Infantil, Fundamental I, Fundamental II)
3. **Criar Séries** dentro de cada Segmento
4. **Criar Turmas** dentro de cada Série
5. **Cadastrar Alunos** em cada Turma
6. **Definir Preços** (mensalidades e serviços)

---

## 🎓 Funcionalidades por Módulo

### 📊 PAINEL (Dashboard)

**Localização**: Menu lateral > 📊 Painel

**Funcionalidades**:
- Visualização de estatísticas gerais
- Total de alunos, alunos ativos, turmas e segmentos
- Ações rápidas:
  - Configurações → Vai para Segmentos
  - Relatórios → Vai para Cálculos
  - Adicionar Aluno → Vai para formulário de alunos

**Informações Exibidas**:
- Nome do usuário logado
- Função (perfil)
- Email
- Status da API Backend
- Versão do sistema

---

### 🏫 SEGMENTOS

**Localização**: Menu lateral > 🏫 Segmentos

**O que são**: Grandes divisões da estrutura escolar

**Exemplos**:
- Educação Infantil
- Ensino Fundamental I (1º ao 5º ano)
- Ensino Fundamental II (6º ao 9º ano)
- Ensino Médio

**Como Criar um Segmento**:

1. Clique em **"➕ Adicionar Segmento"**
2. Preencha os campos:
   - **Nome*** (obrigatório): Ex: "Educação Infantil"
   - **Código*** (obrigatório): Ex: "EDU-INF"
   - **Descrição** (opcional): Ex: "Creche e Pré-escola"
   - **Status**: Ativo ou Inativo
3. Clique em **"Criar"**

**Observação**: O **ID** é gerado automaticamente pelo sistema (não precisa digitar).

---

### 📚 SÉRIES

**Localização**: Menu lateral > 📚 Séries

**O que são**: Níveis de ensino dentro de um Segmento

**Exemplos**:
- Maternal I, Maternal II (Educação Infantil)
- 1º Ano, 2º Ano, 3º Ano (Fundamental I)
- 6º Ano, 7º Ano (Fundamental II)

**Como Criar uma Série**:

1. **ANTES**: Certifique-se de ter criado pelo menos 1 Segmento
2. Clique em **"➕ Adicionar Série"**
3. Preencha os campos:
   - **Nome*** (obrigatório): Ex: "1º Ano"
   - **Código*** (obrigatório): Ex: "1ANO"
   - **Nível*** (obrigatório): Ex: "FUNDAMENTAL", "MÉDIO", "INFANTIL"
   - **Status**: Ativo ou Inativo
4. Clique em **"Criar"**

**⚠️ IMPORTANTE**:
- Você precisa ter o **ID do Segmento** para vincular a série
- Para obter o ID: vá em Segmentos, copie o ID da coluna da tabela

---

### 🏫 TURMAS

**Localização**: Menu lateral > 🏫 Turmas

**O que são**: Grupos específicos de alunos dentro de uma Série

**Exemplos**:
- Turma A, Turma B, Turma C
- Turma Almôndega, Turma Girassol
- Turma Matutino, Turma Vespertino

**Como Criar uma Turma**:

1. **ANTES**: Certifique-se de ter criado pelo menos 1 Série
2. Vá em **Séries** e copie o **ID da Série** desejada
3. Volte para **Turmas**
4. Clique em **"➕ Adicionar Turma"**
5. Preencha os campos:
   - **Nome*** (obrigatório): Ex: "Turma Almôndega"
   - **ID da Série*** (obrigatório): Cole o ID copiado
   - **Horário de Entrada*** (obrigatório): Ex: "08:00"
   - **Horário de Saída*** (obrigatório): Ex: "12:00"
   - **Status**: Ativo ou Inativo
6. Clique em **"Criar"**

**Formato dos Horários**:
- Formato: HH:mm (24 horas)
- Exemplos válidos: "08:00", "13:30", "07:45"

---

### 👨‍🎓 ALUNOS

**Localização**: Menu lateral > 👨‍🎓 Alunos

**O que são**: Estudantes matriculados na escola

**Como Cadastrar um Aluno**:

1. **ANTES**: Certifique-se de ter:
   - Pelo menos 1 Série criada
   - Pelo menos 1 Turma criada
2. Vá em **Séries** e copie o **ID da Série**
3. Vá em **Turmas** e copie o **ID da Turma**
4. Volte para **Alunos**
5. Clique em **"Adicionar Aluno"**
6. Preencha os campos:

**Dados do Aluno**:
- **Nome*** (obrigatório): Nome completo
- **Data de Nascimento*** (obrigatório): Formato DD/MM/AAAA
  - Digite apenas números: 17102015
  - Sistema formata automaticamente: 17/10/2015
- **Série*** (obrigatório): Cole o ID da série
- **Turma*** (obrigatório): Cole o ID da turma
- **CPF** (opcional): XXX.XXX.XXX-XX

**Dados do Responsável**:
- **Nome do Responsável** (opcional)
- **Email do Responsável** (opcional)
- **Telefone do Responsável** (opcional): (XX) XXXXX-XXXX

7. Clique em **"Criar"**

**Status do Aluno**:
- **ATIVO**: Aluno matriculado e frequentando
- **INATIVO**: Aluno não está mais na escola
- **PENDENTE**: Aguardando documentação ou pagamento

---

### 💰 PREÇOS

**Localização**: Menu lateral > 💰 Preços

**O que são**: Tabela de preços de mensalidades, serviços e horas extras

**Tipos de Preços**:

#### 1. MENSALIDADE
Valor cobrado mensalmente por série

**Como Criar**:
1. Clique em **"Novo Preço"**
2. Selecione **Tipo**: Mensalidade
3. Preencha:
   - **Série**: Selecione da lista (ex: 1º Ano)
   - **Valor**: 1500.00
   - **Data de Vigência**: 2025-01-01
4. Clique em **"Criar"**

#### 2. SERVIÇO
Serviços opcionais contratados pelos pais

**Exemplos**: Almoço, Judô, Natação, Transporte

**Como Criar**:
1. Clique em **"Novo Preço"**
2. Selecione **Tipo**: Serviço
3. Preencha:
   - **Nome do Serviço**: Almoço
   - **Valor**: 25.00 (por dia)
   - **Data de Vigência**: 2025-01-01
4. Clique em **"Criar"**

#### 3. HORA EXTRA
Valor cobrado quando o aluno fica além do horário

**Como Criar**:
1. Clique em **"Novo Preço"**
2. Selecione **Tipo**: Hora Extra
3. Preencha:
   - **Valor**: 50.00
   - **Valor por Hora**: 50.00
   - **Data de Vigência**: 2025-01-01
4. Clique em **"Criar"**

**Gerenciamento de Preços**:
- **Editar**: Modifica um preço existente
- **Desativar**: Preço não é mais válido (mantém histórico)
- **Filtrar**: Busca por tipo (Todos, Mensalidade, Serviço, Hora Extra)

---

### 🧮 CÁLCULOS

**Localização**: Menu lateral > 🧮 Cálculos

**O que são**: Ferramentas para calcular valores financeiros

#### Aba 1: ORÇAMENTO MENSAL

**Função**: Calcula quanto um aluno deve pagar no mês

**Como Usar**:
1. Selecione o **Aluno**
2. Selecione o **Mês** (ex: Outubro)
3. Selecione o **Ano** (ex: 2025)
4. Clique em **"Calcular Orçamento"**

**Resultado Exibido**:
- 🔵 **Mensalidade**: Valor da mensalidade da série
- 🟢 **Serviços Contratados**: Lista de serviços (Almoço, Judô, etc)
- 🟠 **Horas Extras**: Total de horas extras no mês
- 🟣 **TOTAL GERAL**: Soma de tudo que deve ser pago

**Exemplo**:
```
Mensalidade:          R$ 1.500,00
Serviços:
  - Almoço (20 dias): R$   500,00
  - Judô:             R$    80,00
Horas Extras:         R$   150,00
─────────────────────────────────
TOTAL GERAL:          R$ 2.230,00
```

#### Aba 2: SIMULADOR

**Status**: Em desenvolvimento (placeholder)

**Função futura**: Simular contratos e custos anuais

#### Aba 3: HORAS EXTRAS

**Função**: Ver histórico de horas extras de um aluno

**Como Usar**:
1. Selecione o **Aluno**
2. Defina **Data Inicial** (ex: 01/10/2025)
3. Defina **Data Final** (ex: 31/10/2025)
4. Clique em **"Carregar Histórico"**

**Resultado Exibido**:
Tabela com:
- Data
- Dia da Semana
- Horas Extras (quantidade)
- Valor por Hora
- Valor Total do Dia
- **TOTAL DO PERÍODO** (soma)

---

## 📝 Guia Passo a Passo

### 🚀 CENÁRIO 1: Primeira Configuração da Escola

**Objetivo**: Cadastrar a estrutura básica de uma escola do zero

**Passo 1 - Criar Segmentos**:
```
1. Login → admin@example.com / Admin123
2. Menu → Segmentos
3. Adicionar Segmento:
   - Nome: "Educação Infantil"
   - Código: "EDU-INF"
   - Descrição: "Maternal e Pré-escola"
4. Criar
5. Repetir para: "Fundamental I", "Fundamental II"
```

**Passo 2 - Criar Séries**:
```
1. Menu → Séries
2. Menu → Segmentos (nova aba)
3. Copiar ID do segmento "Educação Infantil"
4. Voltar para Séries
5. Adicionar Série:
   - Nome: "Maternal I"
   - Código: "MAT1"
   - Nível: "INFANTIL"
6. Criar
7. Repetir para: "Maternal II", "Pré I", "Pré II"
```

**Passo 3 - Criar Turmas**:
```
1. Menu → Séries
2. Copiar ID da série "Maternal I"
3. Menu → Turmas
4. Adicionar Turma:
   - Nome: "Turma Almôndega"
   - ID da Série: (colar ID copiado)
   - Entrada: "08:00"
   - Saída: "12:00"
5. Criar
6. Repetir para: "Turma Girassol", "Turma Arco-íris"
```

**Passo 4 - Cadastrar Alunos**:
```
1. Menu → Séries (copiar ID)
2. Menu → Turmas (copiar ID)
3. Menu → Alunos
4. Adicionar Aluno:
   - Nome: "João da Silva"
   - Data Nasc: 17102015 → 17/10/2015
   - Série: (colar ID)
   - Turma: (colar ID)
   - Nome Resp: "Maria da Silva"
   - Email Resp: "maria@example.com"
5. Criar
```

**Passo 5 - Configurar Preços**:
```
1. Menu → Preços
2. Novo Preço → Mensalidade:
   - Série: Maternal I
   - Valor: 1500.00
   - Vigência: 2025-01-01
3. Novo Preço → Serviço:
   - Nome: "Almoço"
   - Valor: 25.00
   - Vigência: 2025-01-01
4. Novo Preço → Hora Extra:
   - Valor: 50.00
   - Valor/hora: 50.00
   - Vigência: 2025-01-01
```

---

### 💼 CENÁRIO 2: Calcular Mensalidade de um Aluno

**Objetivo**: Ver quanto um aluno específico deve pagar no mês

```
1. Menu → Cálculos
2. Aba: "Orçamento Mensal"
3. Selecionar Aluno: "João da Silva"
4. Mês: Outubro
5. Ano: 2025
6. Calcular Orçamento
7. Ver resultado:
   - Mensalidade
   - Serviços (se houver)
   - Horas extras (se houver)
   - TOTAL
```

---

## ❓ Perguntas Frequentes

### 1. Como obter o ID de um Segmento/Série/Turma?

**Resposta**:
1. Vá na página da entidade (ex: Segmentos)
2. Olhe a tabela - há uma coluna com IDs
3. Copie o ID desejado (geralmente algo como: `clxyz123abc`)
4. Cole no formulário do próximo nível

**Dica**: Abra duas abas do navegador - uma com a lista (para copiar ID) e outra com o formulário.

---

### 2. Não consigo criar uma Turma - o que fazer?

**Resposta**:
Você precisa ter criado uma **Série** antes! Siga esta ordem:
1. Criar Segmento
2. Criar Série (com ID do Segmento)
3. Criar Turma (com ID da Série)

---

### 3. Como funciona o cálculo de Horas Extras?

**Resposta**:
O sistema compara o horário real de saída com o horário padrão da turma.

**Exemplo**:
- Turma tem saída padrão: 12:00
- Aluno saiu às: 13:00
- Horas extras: 1 hora
- Valor: 1h × R$ 50,00 = R$ 50,00

---

### 4. Posso cadastrar um aluno sem Série/Turma?

**Resposta**:
Atualmente **NÃO**. Os campos Série e Turma são obrigatórios.

**Solução temporária**:
Crie uma Série/Turma chamada "Aguardando Definição" e depois transfira o aluno.

---

### 5. Como desativar um preço antigo?

**Resposta**:
1. Menu → Preços
2. Encontre o preço na tabela
3. Clique em **"Desativar"**
4. Confirme

O preço não é deletado - fica inativo para manter histórico.

---

### 6. Formato da Data de Nascimento não funciona

**Resposta**:
Use o formato **DD/MM/AAAA**:
- Digite apenas números: `17102015`
- Sistema formata automaticamente: `17/10/2015`

**Não funciona**:
- ❌ 2015-10-17
- ❌ 10/17/2015

**Funciona**:
- ✅ 17/10/2015
- ✅ 17102015 (auto-formata)

---

## 🔧 Resolução de Problemas

### Problema 1: "Nenhum aluno/turma/série encontrado"

**Causa**: Banco de dados vazio

**Solução**:
1. Verifique se você está logado
2. Crie os registros seguindo a hierarquia:
   - Segmento → Série → Turma → Aluno

---

### Problema 2: Botão "Criar" não faz nada

**Causa**: Erro de validação ou campos obrigatórios não preenchidos

**Solução**:
1. Verifique se preencheu todos os campos marcados com `*`
2. Veja o console do navegador (F12) para mensagens de erro
3. Certifique-se de que os IDs copiados estão corretos

---

### Problema 3: "Erro ao salvar" aparece

**Causa**: ID inválido ou campos com formato errado

**Solução**:
1. Copie novamente o ID da tabela anterior
2. Verifique se o horário está no formato HH:mm (ex: 08:00)
3. Verifique se a data está no formato correto

---

### Problema 4: Página não carrega / fica em branco

**Causa**: Servidores não estão rodando

**Solução**:
1. Verifique se backend está rodando: http://localhost:5001/health
2. Verifique se frontend está rodando: http://localhost:3000
3. Reinicie os servidores se necessário

---

## 📊 Estrutura de Dados

### Hierarquia Completa

```
SEGMENTO
│
├─ id: "clxyz123abc" (gerado automaticamente)
├─ name: "Educação Infantil"
├─ code: "EDU-INF"
├─ description: "Maternal e Pré-escola"
└─ status: Ativo/Inativo
    │
    └─ SÉRIE
        │
        ├─ id: "clxyz456def" (gerado automaticamente)
        ├─ name: "Maternal I"
        ├─ code: "MAT1"
        ├─ level: "INFANTIL"
        ├─ segmentId: "clxyz123abc" ← (ID do segmento acima)
        └─ status: Ativo/Inativo
            │
            └─ TURMA
                │
                ├─ id: "clxyz789ghi" (gerado automaticamente)
                ├─ name: "Turma Almôndega"
                ├─ seriesId: "clxyz456def" ← (ID da série acima)
                ├─ defaultEntryTime: "08:00"
                ├─ defaultExitTime: "12:00"
                └─ status: Ativo/Inativo
                    │
                    └─ ALUNO
                        │
                        ├─ id: "clxyz012jkl" (gerado automaticamente)
                        ├─ name: "João da Silva"
                        ├─ dateOfBirth: "17/10/2015"
                        ├─ seriesId: "clxyz456def"
                        ├─ classId: "clxyz789ghi"
                        ├─ cpf: "123.456.789-00"
                        ├─ guardianName: "Maria da Silva"
                        ├─ guardianEmail: "maria@example.com"
                        ├─ guardianPhone: "(11) 99999-9999"
                        └─ status: ATIVO/INATIVO/PENDENTE
```

---

## 🎯 Dicas de Boas Práticas

### ✅ FAÇA

1. **Siga a ordem hierárquica**: Segmento → Série → Turma → Aluno
2. **Use códigos padronizados**: Ex: MAT1, MAT2, 1ANO, 2ANO
3. **Mantenha backup dos IDs**: Anote os IDs importantes
4. **Teste com poucos dados primeiro**: Crie 1 de cada para testar
5. **Desative em vez de deletar**: Mantém histórico

### ❌ NÃO FAÇA

1. **Não tente criar Turma sem Série**
2. **Não delete registros com dependentes**: Ex: Série com turmas
3. **Não use formatos de data diferentes**: Sempre DD/MM/AAAA
4. **Não deixe campos obrigatórios vazios**

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte este manual primeiro
2. Verifique a seção "Resolução de Problemas"
3. Entre em contato com o administrador do sistema

---

**Versão do Manual**: 1.0.0
**Última Atualização**: 19/10/2025
**Sistema**: School Management System v1.0.0

---

🤖 **Gerado com Claude Code**
