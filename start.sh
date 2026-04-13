#!/bin/bash
# ════════════════════════════════════════════════════════════
# 🚀 Khaiju - Quick Start Script
# ════════════════════════════════════════════════════════════

set -e

echo "════════════════════════════════════════════════════════════"
echo "🚀 Khaiju - Sistema Financeiro Empresarial"
echo "════════════════════════════════════════════════════════════"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ ERRO: Docker não está instalado!"
    echo "   Instale em: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ ERRO: Docker Compose não está instalado!"
    echo "   Instale em: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker instalado: $(docker --version)"
echo "✅ Docker Compose instalado: $(docker-compose --version)"
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚠️  Arquivo .env não encontrado!"
    echo "📝 Criando .env a partir de .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  ATENÇÃO: Edite o arquivo .env e altere as senhas antes de prosseguir!"
    echo ""
    read -p "Pressione ENTER quando tiver configurado o .env, ou Ctrl+C para sair..."
fi

echo "📦 Iniciando containers do Khaiju..."
echo ""

docker-compose up -d

echo ""
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Khaiju está rodando!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📌 Acesse o sistema:"
echo ""
echo "   No servidor:          http://localhost"
echo "   Em outros PCs:        http://$(hostname -I | awk '{print $1}')"
echo "   Com hosts config:     http://khaiju.local"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Comandos úteis:"
echo ""
echo "   Ver logs:             docker-compose logs -f"
echo "   Parar sistema:        docker-compose down"
echo "   Reiniciar:            docker-compose restart"
echo "   Fazer backup:         ./scripts/backup.sh"
echo "   Ver status:           docker-compose ps"
echo ""
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📖 Documentação completa: ./README.md"
echo ""
