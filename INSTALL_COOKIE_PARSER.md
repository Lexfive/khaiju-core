# ═══════════════════════════════════════════════════════════════
# 🔧 INSTALAÇÃO DE DEPENDÊNCIA - cookie-parser
# ═══════════════════════════════════════════════════════════════

# Na VPS, executar:
cd /opt/khaiju/backend
npm install cookie-parser

# Verificar instalação:
npm list cookie-parser

# Rebuild backend:
docker-compose -f ../docker-compose.vps.yml build backend
docker-compose -f ../docker-compose.vps.yml up -d backend
