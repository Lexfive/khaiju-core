#!/bin/bash
# ════════════════════════════════════════════════════════════
# 💾 Khaiju - Backup Automático do PostgreSQL
# ════════════════════════════════════════════════════════════

set -e

# Configurações
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="khaiju_backup_${TIMESTAMP}.sql"
CONTAINER_NAME="khaiju-postgres"
DB_NAME="khaiju_db"
DB_USER="khaiju"
RETENTION_DAYS=30

# Criar diretório de backups se não existir
mkdir -p "$BACKUP_DIR"

echo "════════════════════════════════════════════════════════════"
echo "🚀 Iniciando backup do Khaiju"
echo "════════════════════════════════════════════════════════════"
echo "📅 Data: $(date '+%d/%m/%Y %H:%M:%S')"
echo "📦 Arquivo: $BACKUP_FILE"
echo ""

# Verificar se o container está rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ ERRO: Container $CONTAINER_NAME não está rodando!"
    exit 1
fi

# Executar backup
echo "⏳ Criando backup..."
docker exec -t "$CONTAINER_NAME" pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists > "$BACKUP_DIR/$BACKUP_FILE"

# Comprimir backup
echo "🗜️  Comprimindo backup..."
gzip "$BACKUP_DIR/$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

# Verificar tamanho do backup
BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
echo "✅ Backup concluído: $BACKUP_SIZE"

# Limpar backups antigos
echo "🧹 Removendo backups com mais de $RETENTION_DAYS dias..."
find "$BACKUP_DIR" -name "khaiju_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

# Listar backups disponíveis
echo ""
echo "📋 Backups disponíveis:"
ls -lh "$BACKUP_DIR" | grep "khaiju_backup_" | tail -n 5

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Backup finalizado com sucesso!"
echo "════════════════════════════════════════════════════════════"
