#!/bin/bash

BASE_URL="http://localhost:5001"
ADMIN_EMAIL="admin@school.com"
ADMIN_PASSWORD="123456"

echo "════════════════════════════════════════════════════════════"
echo "🧪 School Management System - API Test Suite"
echo "════════════════════════════════════════════════════════════"
echo ""

# 1. Test Health Endpoint
echo "1️⃣ Testing Health Endpoint..."
curl -s "$BASE_URL/health" | jq '.status' && echo "   ✅ Health: OK" || echo "   ❌ Health: FAILED"
echo ""

# 2. Test Root Endpoint
echo "2️⃣ Testing Root Endpoint..."
curl -s "$BASE_URL/" | jq '.message' && echo "   ✅ Root: OK" || echo "   ❌ Root: FAILED"
echo ""

# 3. Test Login
echo "3️⃣ Testing Login (Auth Module)..."
TOKEN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
  | jq -r '.token // empty')

if [ -z "$TOKEN" ]; then
  echo "   ❌ Login: FAILED - No token returned"
  echo "   Login Response:"
  curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" | jq '.'
else
  echo "   ✅ Login: OK (Token: ${TOKEN:0:20}...)"
fi
echo ""

# 4. Test Academic Endpoints (Segments)
echo "4️⃣ Testing Academic Module (Segments)..."
curl -s "$BASE_URL/api/academic/segments" -H "Authorization: Bearer $TOKEN" | jq '.data | length' > /dev/null 2>&1 && echo "   ✅ Get Segments: OK" || echo "   ❌ Get Segments: FAILED"
echo ""

# 5. Test Students List
echo "5️⃣ Testing Students Module..."
curl -s "$BASE_URL/api/students" -H "Authorization: Bearer $TOKEN" | jq '.data | length' > /dev/null 2>&1 && echo "   ✅ Get Students: OK" || echo "   ❌ Get Students: FAILED"
echo ""

# 6. Test Student by ID
echo "6️⃣ Testing Get Student by ID..."
STUDENT_ID=$(curl -s "$BASE_URL/api/students?limit=1" -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id // empty')
if [ -n "$STUDENT_ID" ]; then
  curl -s "$BASE_URL/api/students/$STUDENT_ID" -H "Authorization: Bearer $TOKEN" | jq '.data.name' > /dev/null 2>&1 && echo "   ✅ Get Student by ID: OK" || echo "   ❌ Get Student by ID: FAILED"
else
  echo "   ⚠️  No student found to test"
fi
echo ""

echo "════════════════════════════════════════════════════════════"
echo "✨ Basic API tests completed!"
echo "════════════════════════════════════════════════════════════"
