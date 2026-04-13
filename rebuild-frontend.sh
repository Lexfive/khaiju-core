#!/bin/bash
# ════════════════════════════════════════════════════════════
# 🔧 Khaiju - Rebuild Frontend (Produção)
# FORÇA rebuild sem cache para refletir mudanças
# ════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "🔧 Rebuild Forçado do Frontend Khaiju"
echo "════════════════════════════════════════════════════════════"
echo ""

cd /opt/khaiju 2>/dev/null || cd /app

echo "⏹️  Parando container frontend..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps stop frontend

echo "🗑️  Removendo container antigo..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps rm -f frontend

echo "🗑️  Removendo imagem antiga..."
docker rmi khaiju_frontend 2>/dev/null || true

echo "🏗️  Rebuild SEM CACHE..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps build --no-cache frontend

echo "🚀 Iniciando novo container..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d frontend

echo ""
echo "⏳ Aguardando inicialização (10s)..."
sleep 10

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Rebuild Concluído!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🧪 Testando frontend..."
curl -s -o /dev/null -w "Status HTTP: %{http_code}\n" http://localhost:8080

echo ""
echo "📝 Ver logs:"
echo "   docker-compose -f docker-compose.vps.yml logs -f frontend"
echo ""
echo "🌐 Acesso:"
echo "   http://SEU_IP:8080"
echo ""
echo "════════════════════════════════════════════════════════════"
