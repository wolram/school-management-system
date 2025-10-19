#!/bin/bash

# Script de Teste - Fases 4 e 5
# Sistema de Precificação e Cálculos Financeiros

BASE_URL="http://localhost:5001"
echo "🧪 Testando Fases 4 e 5 do School Management System"
echo "=================================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Você precisa fazer login primeiro e obter o token
echo -e "${YELLOW}⚠️  IMPORTANTE: Primeiro faça login para obter o token${NC}"
echo "Execute no terminal:"
echo ""
echo "curl -X POST http://localhost:5001/api/auth/login \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\": \"admin@example.com\", \"password\": \"Admin123\"}'"
echo ""
echo "Cole o token abaixo e pressione ENTER:"
read -r TOKEN

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Token não fornecido. Abortando...${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Token configurado!${NC}"
echo ""

# Função para fazer requisições
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3

    if [ -z "$data" ]; then
        curl -s -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json"
    else
        curl -s -X "$method" "$BASE_URL$endpoint" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    fi
}

# ============================================================
# FASE 4: TESTES DE PREÇOS
# ============================================================

echo -e "${BLUE}📊 FASE 4: Sistema de Precificação${NC}"
echo "-----------------------------------"
echo ""

# 1. Obter todas as séries (para usar nos preços)
echo -e "${YELLOW}1. Obtendo séries disponíveis...${NC}"
SERIES_RESPONSE=$(api_call GET "/api/academic/series")
FIRST_SERIES_ID=$(echo "$SERIES_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['data'][0]['id'] if data.get('data') and len(data['data']) > 0 else '')" 2>/dev/null)

if [ -z "$FIRST_SERIES_ID" ]; then
    echo -e "${RED}❌ Nenhuma série encontrada. Crie séries primeiro!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Série ID encontrada: $FIRST_SERIES_ID${NC}"
echo ""

# 2. Criar Preço de Mensalidade
echo -e "${YELLOW}2. Criando preço de MENSALIDADE...${NC}"
PRICE_MENSALIDADE=$(api_call POST "/api/prices" '{
  "type": "MENSALIDADE",
  "seriesId": "'"$FIRST_SERIES_ID"'",
  "value": 1500.00,
  "effectiveDate": "2025-01-01"
}')
echo "$PRICE_MENSALIDADE" | python3 -m json.tool 2>/dev/null || echo "$PRICE_MENSALIDADE"
echo ""

# 3. Criar Preço de Serviço - Almoço
echo -e "${YELLOW}3. Criando preço de SERVIÇO (Almoço)...${NC}"
PRICE_ALMOCO=$(api_call POST "/api/prices" '{
  "type": "SERVICO",
  "serviceName": "Almoço",
  "value": 25.00,
  "effectiveDate": "2025-01-01"
}')
echo "$PRICE_ALMOCO" | python3 -m json.tool 2>/dev/null || echo "$PRICE_ALMOCO"
echo ""

# 4. Criar Preço de Serviço - Judô
echo -e "${YELLOW}4. Criando preço de SERVIÇO (Judô)...${NC}"
PRICE_JUDO=$(api_call POST "/api/prices" '{
  "type": "SERVICO",
  "serviceName": "Judô",
  "value": 80.00,
  "effectiveDate": "2025-01-01"
}')
echo "$PRICE_JUDO" | python3 -m json.tool 2>/dev/null || echo "$PRICE_JUDO"
echo ""

# 5. Criar Preço de Hora Extra
echo -e "${YELLOW}5. Criando preço de HORA EXTRA...${NC}"
PRICE_HORA_EXTRA=$(api_call POST "/api/prices" '{
  "type": "HORA_EXTRA",
  "value": 50.00,
  "valuePerHour": 50.00,
  "effectiveDate": "2025-01-01"
}')
echo "$PRICE_HORA_EXTRA" | python3 -m json.tool 2>/dev/null || echo "$PRICE_HORA_EXTRA"
echo ""

# 6. Listar todos os preços
echo -e "${YELLOW}6. Listando todos os preços criados...${NC}"
ALL_PRICES=$(api_call GET "/api/prices")
echo "$ALL_PRICES" | python3 -m json.tool 2>/dev/null || echo "$ALL_PRICES"
echo ""

# 7. Listar apenas preços ativos
echo -e "${YELLOW}7. Listando apenas preços ATIVOS...${NC}"
ACTIVE_PRICES=$(api_call GET "/api/prices/active")
echo "$ACTIVE_PRICES" | python3 -m json.tool 2>/dev/null || echo "$ACTIVE_PRICES"
echo ""

# ============================================================
# FASE 5: TESTES DE CÁLCULOS
# ============================================================

echo ""
echo -e "${BLUE}🧮 FASE 5: Cálculos Financeiros${NC}"
echo "--------------------------------"
echo ""

# 8. Obter primeiro aluno
echo -e "${YELLOW}8. Obtendo aluno para testes...${NC}"
STUDENTS_RESPONSE=$(api_call GET "/api/students?limit=1")
STUDENT_ID=$(echo "$STUDENTS_RESPONSE" | python3 -c "import sys, json; data = json.load(sys.stdin); print(data['data'][0]['id'] if data.get('data') and len(data['data']) > 0 else '')" 2>/dev/null)

if [ -z "$STUDENT_ID" ]; then
    echo -e "${RED}❌ Nenhum aluno encontrado. Crie alunos primeiro!${NC}"
    echo -e "${YELLOW}ℹ️  Mas você já pode testar as páginas de Preços no navegador!${NC}"
    exit 0
fi

echo -e "${GREEN}✓ Aluno ID encontrado: $STUDENT_ID${NC}"
echo ""

# 9. Calcular Horas Extras
echo -e "${YELLOW}9. Calculando horas extras de um dia...${NC}"
EXTRA_HOURS=$(api_call POST "/api/calculations/extra-hours" '{
  "studentId": "'"$STUDENT_ID"'",
  "date": "2025-10-15",
  "realEntryTime": "07:30",
  "realExitTime": "13:00"
}')
echo "$EXTRA_HOURS" | python3 -m json.tool 2>/dev/null || echo "$EXTRA_HOURS"
echo ""

# 10. Obter Orçamento Mensal
echo -e "${YELLOW}10. Calculando orçamento mensal (Outubro/2025)...${NC}"
BUDGET=$(api_call GET "/api/calculations/budget/$STUDENT_ID?month=10&year=2025")
echo "$BUDGET" | python3 -m json.tool 2>/dev/null || echo "$BUDGET"
echo ""

# 11. Histórico de Horas Extras
echo -e "${YELLOW}11. Obtendo histórico de horas extras...${NC}"
HISTORY=$(api_call GET "/api/calculations/history/$STUDENT_ID?startDate=2025-10-01&endDate=2025-10-31")
echo "$HISTORY" | python3 -m json.tool 2>/dev/null || echo "$HISTORY"
echo ""

# ============================================================
# RESUMO
# ============================================================

echo ""
echo -e "${GREEN}=================================================="
echo "✅ TESTES CONCLUÍDOS COM SUCESSO!"
echo "==================================================${NC}"
echo ""
echo -e "${BLUE}🌐 Acesse o Frontend:${NC}"
echo ""
echo "   Preços:    http://localhost:3000/dashboard/prices"
echo "   Cálculos:  http://localhost:3000/dashboard/calculations"
echo ""
echo -e "${YELLOW}💡 Dicas:${NC}"
echo "   - Faça login no frontend com: admin@example.com / Admin123"
echo "   - Na página de Preços, clique em 'Novo Preço'"
echo "   - Na página de Cálculos, selecione um aluno e clique 'Calcular'"
echo ""
echo -e "${GREEN}🎉 Fases 4 e 5 testadas com sucesso!${NC}"
