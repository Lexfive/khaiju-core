#!/bin/bash

# ════════════════════════════════════════════════════════════
# 🚀 Khaiju VPS Deploy Script - CORRIGIDO
# Deploy automatizado com validação em cada etapa
# ════════════════════════════════════════════════════════════

set -e  # Parar em caso de erro

echo "════════════════════════════════════════════════════════════"
echo "🚀 Khaiju Deploy Automático - VPS Production (CORRIGIDO)"
echo "════════════════════════════════════════════════════════════"
echo ""

# ──────────────────────────────────────────────────────────
# Cores para output
# ──────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

info() {
    echo -e "ℹ️  $1"
}

# ──────────────────────────────────────────────────────────
# Validações iniciais
# ──────────────────────────────────────────────────────────
info "Validando ambiente..."

# Verificar se está no diretório correto
if [ ! -f "docker-compose.vps.yml" ]; then
    error "docker-compose.vps.yml não encontrado! Execute este script na raiz do projeto."
fi

if [ ! -f ".env.vps" ]; then
    error ".env.vps não encontrado!"
fi

success "Arquivos necessários encontrados"

# ──────────────────────────────────────────────────────────
# PASSO 1: Backup do banco (se existir)
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 1: Backup do banco de dados..."

if docker ps | grep -q khaiju_postgres; then
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    docker exec khaiju_postgres pg_dump -U khaiju khaiju_db > "$BACKUP_FILE" 2>/dev/null || true
    if [ -f "$BACKUP_FILE" ]; then
        success "Backup criado: $BACKUP_FILE"
    else
        warning "Backup não criado (container pode estar vazio)"
    fi
else
    warning "Container PostgreSQL não encontrado, pulando backup"
fi

# ──────────────────────────────────────────────────────────
# PASSO 2: Parar containers antigos
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 2: Parando containers antigos..."

docker-compose -f docker-compose.vps.yml down 2>/dev/null || true
success "Containers parados"

# ──────────────────────────────────────────────────────────
# PASSO 3: Rebuild das imagens
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 3: Rebuilding imagens (isso pode levar alguns minutos)..."

docker-compose -f docker-compose.vps.yml build --no-cache
success "Imagens rebuilded"

# ──────────────────────────────────────────────────────────
# PASSO 4: Subir containers
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 4: Subindo containers..."

docker-compose -f docker-compose.vps.yml up -d
success "Containers iniciados"

# ──────────────────────────────────────────────────────────
# PASSO 5: Aguardar containers ficarem healthy
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 5: Aguardando containers ficarem saudáveis..."

sleep 10

# Verificar PostgreSQL
for i in {1..30}; do
    if docker exec khaiju_postgres pg_isready -U khaiju -d khaiju_db >/dev/null 2>&1; then
        success "PostgreSQL ready"
        break
    fi
    if [ $i -eq 30 ]; then
        error "PostgreSQL não respondeu após 30 segundos"
    fi
    sleep 1
done

# Verificar Backend
for i in {1..30}; do
    if curl -s http://127.0.0.1:3001/health >/dev/null 2>&1; then
        success "Backend ready"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Backend não respondeu após 30 segundos"
    fi
    sleep 1
done

# Verificar Frontend
for i in {1..30}; do
    if curl -s http://127.0.0.1:8080 >/dev/null 2>&1; then
        success "Frontend ready"
        break
    fi
    if [ $i -eq 30 ]; then
        error "Frontend não respondeu após 30 segundos"
    fi
    sleep 1
done

# ──────────────────────────────────────────────────────────
# PASSO 6: Testes de validação
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 6: Executando testes de validação..."

# Teste 1: Health check backend direto
HEALTH=$(curl -s http://127.0.0.1:3001/health)
if echo "$HEALTH" | grep -q '"status":"ok"'; then
    success "Health check backend: OK"
else
    error "Health check backend falhou"
fi

# Teste 2: Frontend direto
if curl -s -I http://127.0.0.1:8080 | grep -q "200 OK"; then
    success "Frontend responding: OK"
else
    error "Frontend não está respondendo"
fi

# Teste 3: Verificar portas escutando
if ss -tlnp 2>/dev/null | grep -q ":3001" || netstat -tlnp 2>/dev/null | grep -q ":3001"; then
    success "Porta 3001 (backend) escutando"
else
    warning "Porta 3001 não detectada (pode ser normal dependendo do netstat)"
fi

if ss -tlnp 2>/dev/null | grep -q ":8080" || netstat -tlnp 2>/dev/null | grep -q ":8080"; then
    success "Porta 8080 (frontend) escutando"
else
    warning "Porta 8080 não detectada (pode ser normal dependendo do netstat)"
fi

# ──────────────────────────────────────────────────────────
# PASSO 7: Status final
# ──────────────────────────────────────────────────────────
echo ""
info "PASSO 7: Status dos containers..."
docker ps --filter "name=khaiju" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# ──────────────────────────────────────────────────────────
# PASSO 8: Instruções de validação externa
# ──────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════════════════════════"
success "Deploy local concluído com sucesso!"
echo "════════════════════════════════════════════════════════════"
echo ""
info "Próximos passos MANUAIS:"
echo ""
echo "1. Atualizar configuração do Nginx no HOST VPS:"
echo "   sudo cp nginx-khaiju-vps.conf /etc/nginx/sites-available/khaiju"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "2. Testar API via proxy reverso:"
echo "   curl -k https://khaiju.lidermoldurashub.com.br/api/auth/me"
echo ""
echo "3. Abrir navegador:"
echo "   https://khaiju.lidermoldurashub.com.br"
echo ""
echo "4. Verificar logs em tempo real:"
echo "   docker-compose -f docker-compose.vps.yml logs -f"
echo ""
echo "════════════════════════════════════════════════════════════"
