#!/bin/bash
# ════════════════════════════════════════════════════════════
# 🚀 Khaiju VPS - Script de Deploy Automatizado
# ════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "🚀 Khaiju - Deploy VPS Automatizado"
echo "════════════════════════════════════════════════════════════"
echo ""

# ══════════════════════════════════════════════════════════════
# Verificações Pré-Deploy
# ══════════════════════════════════════════════════════════════

echo "📋 Verificando pré-requisitos..."
echo ""

# Verificar Docker
if ! command -v docker &> /dev/null; then
    echo "❌ ERRO: Docker não está instalado!"
    echo "   Instale em: https://docs.docker.com/get-docker/"
    exit 1
fi
echo "✅ Docker instalado: $(docker --version)"

# Verificar Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERRO: Docker Compose não está instalado!"
    echo "   Instale em: https://docs.docker.com/compose/install/"
    exit 1
fi
echo "✅ Docker Compose instalado: $(docker-compose --version)"

echo ""

# ══════════════════════════════════════════════════════════════
# Configuração de Variáveis de Ambiente
# ══════════════════════════════════════════════════════════════

if [ ! -f .env.vps ]; then
    echo "⚠️  Arquivo .env.vps não encontrado!"
    echo ""
    
    if [ -f .env.vps.example ]; then
        echo "📝 Criando .env.vps a partir de .env.vps.example..."
        cp .env.vps.example .env.vps
        echo ""
        echo "⚠️  ATENÇÃO: Configure o arquivo .env.vps antes de continuar!"
        echo ""
        echo "   Edite o arquivo e configure:"
        echo "   - POSTGRES_PASSWORD"
        echo "   - JWT_SECRET"
        echo "   - CORS_ORIGIN"
        echo "   - DOMAIN"
        echo "   - FRONTEND_PORT"
        echo ""
        read -p "Pressione ENTER quando tiver configurado o .env.vps, ou Ctrl+C para sair..."
    else
        echo "❌ ERRO: .env.vps.example também não encontrado!"
        exit 1
    fi
fi

echo "✅ Arquivo .env.vps encontrado"
echo ""

# ══════════════════════════════════════════════════════════════
# Validar Variáveis Essenciais
# ══════════════════════════════════════════════════════════════

echo "🔍 Validando configurações..."

source .env.vps

if [ -z "$POSTGRES_PASSWORD" ] || [ "$POSTGRES_PASSWORD" == "ALTERE_PARA_SENHA_FORTE_AQUI" ]; then
    echo "❌ ERRO: POSTGRES_PASSWORD não configurado!"
    echo "   Edite .env.vps e configure uma senha forte"
    exit 1
fi

if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" == "ALTERE_PARA_SECRET_FORTE_AQUI_MIN_32_CHARS" ]; then
    echo "❌ ERRO: JWT_SECRET não configurado!"
    echo "   Edite .env.vps e configure um secret forte (min 32 caracteres)"
    exit 1
fi

echo "✅ Variáveis essenciais configuradas"
echo ""

# ══════════════════════════════════════════════════════════════
# Modo de Deploy
# ══════════════════════════════════════════════════════════════

echo "📦 Escolha o modo de deploy:"
echo ""
echo "  1. Primeira instalação (fresh install)"
echo "  2. Atualização (update)"
echo "  3. Rebuild completo (rebuild tudo)"
echo ""
read -p "Escolha uma opção (1-3): " DEPLOY_MODE

case $DEPLOY_MODE in
    1)
        MODE="install"
        ;;
    2)
        MODE="update"
        ;;
    3)
        MODE="rebuild"
        ;;
    *)
        echo "❌ Opção inválida!"
        exit 1
        ;;
esac

echo ""

# ══════════════════════════════════════════════════════════════
# Executar Deploy
# ══════════════════════════════════════════════════════════════

if [ "$MODE" == "install" ]; then
    echo "🚀 Iniciando primeira instalação..."
    echo ""
    
    # Criar diretório de backups
    mkdir -p backups
    
    # Parar containers existentes (se houver)
    echo "⏹️  Parando containers antigos (se existirem)..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps down 2>/dev/null || true
    
    # Build das imagens
    echo "🏗️  Buildando imagens Docker..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps build
    
    # Iniciar containers
    echo "🚀 Iniciando containers..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d
    
    echo ""
    echo "⏳ Aguardando inicialização dos serviços..."
    sleep 15

elif [ "$MODE" == "update" ]; then
    echo "🔄 Atualizando sistema..."
    echo ""
    
    # Pull das últimas mudanças
    if [ -d .git ]; then
        echo "📥 Obtendo últimas mudanças do Git..."
        git pull
    fi
    
    # Rebuild apenas se necessário
    echo "🏗️  Verificando se precisa rebuild..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps build
    
    # Restart com novas imagens
    echo "🔄 Reiniciando containers..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d
    
    echo ""
    echo "⏳ Aguardando estabilização..."
    sleep 10

elif [ "$MODE" == "rebuild" ]; then
    echo "🔨 Rebuild completo..."
    echo ""
    
    # Parar tudo
    echo "⏹️  Parando containers..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps down
    
    # Rebuild sem cache
    echo "🏗️  Rebuild sem cache..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps build --no-cache
    
    # Iniciar
    echo "🚀 Iniciando containers..."
    docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d
    
    echo ""
    echo "⏳ Aguardando inicialização..."
    sleep 15
fi

# ══════════════════════════════════════════════════════════════
# Verificações Pós-Deploy
# ══════════════════════════════════════════════════════════════

echo ""
echo "════════════════════════════════════════════════════════════"
echo "🔍 Verificando deploy..."
echo "════════════════════════════════════════════════════════════"
echo ""

# Status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.vps.yml ps
echo ""

# Health check backend
echo "🏥 Testando health check do backend..."
sleep 5
HEALTH_RESPONSE=$(docker exec khaiju_backend wget -qO- http://localhost:3001/health 2>/dev/null || echo "ERROR")

if [[ $HEALTH_RESPONSE == *"ok"* ]]; then
    echo "✅ Backend respondendo corretamente"
else
    echo "⚠️  Backend não está respondendo ao health check"
    echo "   Execute: docker-compose -f docker-compose.vps.yml logs backend"
fi

echo ""

# ══════════════════════════════════════════════════════════════
# Informações de Acesso
# ══════════════════════════════════════════════════════════════

echo "════════════════════════════════════════════════════════════"
echo "✅ Deploy concluído!"
echo "════════════════════════════════════════════════════════════"
echo ""

# Detectar IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')
FRONTEND_PORT=${FRONTEND_PORT:-8080}

echo "📌 Informações de acesso:"
echo ""

if [ ! -z "$DOMAIN" ] && [ "$DOMAIN" != "khaiju.seudominio.com" ]; then
    echo "   🌐 Via domínio:    https://$DOMAIN"
    echo "                      (Requer proxy reverso configurado)"
    echo ""
fi

echo "   🖥️  Via IP:         http://$SERVER_IP:$FRONTEND_PORT"
echo "   🏠 Localhost:       http://localhost:$FRONTEND_PORT"
echo ""

echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Próximos passos:"
echo ""

if [ "$MODE" == "install" ]; then
    echo "  1. Acesse o sistema via navegador"
    echo "  2. Configure proxy reverso (NGINX/Traefik)"
    echo "     Ver: DEPLOY_VPS.md e PROXY_EXAMPLES.md"
    echo "  3. Configure HTTPS (Let's Encrypt)"
    echo "  4. Configure backup automático:"
    echo "     crontab -e"
    echo "     0 3 * * * cd $(pwd) && ./scripts/backup.sh"
fi

echo ""
echo "📖 Documentação:"
echo "   - Deploy VPS:        DEPLOY_VPS.md"
echo "   - Proxy exemplos:    PROXY_EXAMPLES.md"
echo "   - Troubleshooting:   README.md"
echo ""

echo "🔧 Comandos úteis:"
echo ""
echo "   Ver logs:            docker-compose -f docker-compose.vps.yml logs -f"
echo "   Parar sistema:       docker-compose -f docker-compose.vps.yml down"
echo "   Reiniciar:           docker-compose -f docker-compose.vps.yml restart"
echo "   Ver status:          docker-compose -f docker-compose.vps.yml ps"
echo "   Fazer backup:        ./scripts/backup.sh"
echo ""

echo "════════════════════════════════════════════════════════════"
