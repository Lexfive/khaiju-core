#!/bin/bash
# ════════════════════════════════════════════════════════════
# 🚀 Khaiju - Deploy Real VPS
# Comandos exatos para executar
# ════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "🚀 Iniciando Deploy Real do Khaiju"
echo "════════════════════════════════════════════════════════════"
echo ""

# ══════════════════════════════════════════════════════════════
# PASSO 1: Criar diretório e clonar projeto
# ══════════════════════════════════════════════════════════════
echo "📁 Criando diretório /opt/khaiju..."
sudo mkdir -p /opt/khaiju
sudo chown $USER:$USER /opt/khaiju
cd /opt/khaiju

# ⚠️ IMPORTANTE: Substituir pelo seu repositório Git real
# git clone https://github.com/seu-usuario/khaiju.git .

# OU transferir arquivos via SCP/SFTP
# scp -r /caminho/local/khaiju/* usuario@VPS:/opt/khaiju/

echo "✅ Diretório criado"
echo ""

# ══════════════════════════════════════════════════════════════
# PASSO 2: Configurar ambiente
# ══════════════════════════════════════════════════════════════
echo "⚙️  Configurando .env.vps..."

if [ ! -f .env.vps ]; then
    cp .env.vps.example .env.vps || cat > .env.vps << 'EOF'
POSTGRES_PASSWORD=Khaiju2024!Prod@Secure#DB
JWT_SECRET=khaiju-production-jwt-secret-2024-min-32-chars-secure
FRONTEND_PORT=8080
CORS_ORIGIN=*
API_BASE_URL=/api
VITE_API_BASE_URL=/api
DOMAIN=khaiju.localhost
NODE_ENV=production
JWT_EXPIRES_IN=7d
TRUST_PROXY=true
EOF
fi

echo "✅ Arquivo .env.vps configurado"
echo ""

# ══════════════════════════════════════════════════════════════
# PASSO 3: Build e iniciar containers
# ══════════════════════════════════════════════════════════════
echo "🏗️  Buildando imagens Docker..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps build

echo ""
echo "🚀 Iniciando containers..."
docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d

echo ""
echo "⏳ Aguardando inicialização (15 segundos)..."
sleep 15

# ══════════════════════════════════════════════════════════════
# PASSO 4: Verificação
# ══════════════════════════════════════════════════════════════
echo ""
echo "════════════════════════════════════════════════════════════"
echo "🔍 Verificando Deploy"
echo "════════════════════════════════════════════════════════════"
echo ""

echo "📊 Containers rodando:"
docker ps | grep khaiju

echo ""
echo "🏥 Health check backend:"
sleep 3
curl -s http://localhost:3001/health || echo "⚠️  Backend ainda inicializando..."

echo ""
echo "🌐 Testando frontend:"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080 || echo "⚠️  Frontend ainda inicializando..."

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Deploy Concluído!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📌 Próximos passos:"
echo ""
echo "1. Configurar NGINX:"
echo "   sudo nano /etc/nginx/sites-available/khaiju"
echo ""
echo "2. Testar acesso:"
echo "   curl http://localhost:8080"
echo ""
echo "3. Ver logs:"
echo "   docker-compose -f docker-compose.vps.yml logs -f"
echo ""
echo "════════════════════════════════════════════════════════════"
