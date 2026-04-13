#!/bin/bash
# ════════════════════════════════════════════════════════════
# 🔄 Khaiju - Restauração de Backup
# ════════════════════════════════════════════════════════════

set -e

BACKUP_DIR="./backups"
CONTAINER_NAME="khaiju-postgres"
DB_NAME="khaiju_db"
DB_USER="khaiju"

echo "════════════════════════════════════════════════════════════"
echo "🔄 Khaiju - Restauração de Backup"
echo "════════════════════════════════════════════════════════════"
echo ""

# Listar backups disponíveis
echo "📋 Backups disponíveis:"
echo ""
ls -1 "$BACKUP_DIR" | grep "khaiju_backup_" | nl
echo ""

# Solicitar qual backup restaurar
read -p "Digite o número do backup para restaurar (ou 'q' para sair): " CHOICE

if [ "$CHOICE" = "q" ]; then
    echo "❌ Restauração cancelada."
    exit 0
fi

# Obter arquivo selecionado
BACKUP_FILE=$(ls -1 "$BACKUP_DIR" | grep "khaiju_backup_" | sed -n "${CHOICE}p")

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ ERRO: Backup inválido!"
    exit 1
fi

BACKUP_PATH="$BACKUP_DIR/$BACKUP_FILE"

echo ""
echo "⚠️  ATENÇÃO: Esta operação irá SUBSTITUIR todos os dados atuais!"
echo "📦 Arquivo: $BACKUP_FILE"
echo ""
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " CONFIRM

if [ "$CONFIRM" != "SIM" ]; then
    echo "❌ Restauração cancelada."
    exit 0
fi

# Verificar se o container está rodando
if ! docker ps | grep -q "$CONTAINER_NAME"; then
    echo "❌ ERRO: Container $CONTAINER_NAME não está rodando!"
    exit 1
fi

echo ""
echo "⏳ Descomprimindo backup..."
if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -k "$BACKUP_PATH"
    BACKUP_PATH="${BACKUP_PATH%.gz}"
fi

echo "⏳ Restaurando backup..."
docker exec -i "$CONTAINER_NAME" psql -U "$DB_USER" -d "$DB_NAME" < "$BACKUP_PATH"

# Remover arquivo descomprimido temporário
if [[ $BACKUP_FILE == *.gz ]]; then
    rm "$BACKUP_PATH"
fi

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ Restauração concluída com sucesso!"
echo "════════════════════════════════════════════════════════════"
