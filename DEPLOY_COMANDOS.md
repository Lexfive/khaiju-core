# ═══════════════════════════════════════════════════════════════
# 🚀 KHAIJU - DEPLOY REAL VPS (COMANDOS EXATOS)
# ═══════════════════════════════════════════════════════════════

## ────────────────────────────────────────────────────────────────
## PASSO 1: TRANSFERIR PROJETO PARA VPS
## ────────────────────────────────────────────────────────────────

# Na sua máquina LOCAL, comprima o projeto:
cd /caminho/do/khaiju
tar -czf khaiju.tar.gz --exclude='node_modules' --exclude='.git' .

# Transferir para VPS:
scp khaiju.tar.gz usuario@SEU_IP_VPS:/tmp/

# ────────────────────────────────────────────────────────────────
# AGORA CONECTAR À VPS:
ssh usuario@SEU_IP_VPS


## ────────────────────────────────────────────────────────────────
## PASSO 2: EXTRAIR E CONFIGURAR (NA VPS)
## ────────────────────────────────────────────────────────────────

sudo mkdir -p /opt/khaiju
sudo chown $USER:$USER /opt/khaiju
cd /opt/khaiju
tar -xzf /tmp/khaiju.tar.gz
rm /tmp/khaiju.tar.gz


## ────────────────────────────────────────────────────────────────
## PASSO 3: CONFIGURAR AMBIENTE
## ────────────────────────────────────────────────────────────────

# Criar .env.vps
cat > .env.vps << 'EOF'
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


## ────────────────────────────────────────────────────────────────
## PASSO 4: BUILD E INICIAR
## ────────────────────────────────────────────────────────────────

docker-compose -f docker-compose.vps.yml --env-file .env.vps build
docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d


## ────────────────────────────────────────────────────────────────
## PASSO 5: VERIFICAR
## ────────────────────────────────────────────────────────────────

# Ver containers
docker ps | grep khaiju

# Testar backend
curl http://localhost:3001/health

# Testar frontend
curl http://localhost:8080

# Ver logs
docker-compose -f docker-compose.vps.yml logs -f


## ────────────────────────────────────────────────────────────────
## PASSO 6: CONFIGURAR NGINX
## ────────────────────────────────────────────────────────────────

# Criar configuração
sudo nano /etc/nginx/sites-available/khaiju

# Colar este conteúdo:
# ──────────────────────────────────────────────────
server {
    listen 80;
    server_name khaiju.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
# ──────────────────────────────────────────────────

# Ativar
sudo ln -s /etc/nginx/sites-available/khaiju /etc/nginx/sites-enabled/

# Testar
sudo nginx -t

# Recarregar
sudo systemctl reload nginx


## ────────────────────────────────────────────────────────────────
## PASSO 7: HTTPS (OPCIONAL)
## ────────────────────────────────────────────────────────────────

sudo certbot --nginx -d khaiju.seudominio.com


## ────────────────────────────────────────────────────────────────
## ACESSO FINAL
## ────────────────────────────────────────────────────────────────

# Com domínio:
https://khaiju.seudominio.com

# Apenas IP:
http://SEU_IP:8080


## ────────────────────────────────────────────────────────────────
## COMANDOS ÚTEIS
## ────────────────────────────────────────────────────────────────

# Parar
docker-compose -f docker-compose.vps.yml down

# Reiniciar
docker-compose -f docker-compose.vps.yml restart

# Logs
docker-compose -f docker-compose.vps.yml logs -f

# Status
docker-compose -f docker-compose.vps.yml ps

# Backup
./scripts/backup.sh


## ────────────────────────────────────────────────────────────────
## TROUBLESHOOTING RÁPIDO
## ────────────────────────────────────────────────────────────────

# Container não inicia:
docker-compose -f docker-compose.vps.yml logs backend

# Porta ocupada:
# Editar FRONTEND_PORT no .env.vps para outra (ex: 8081)

# NGINX erro 502:
sudo tail -f /var/log/nginx/error.log

# CORS erro:
# Ajustar CORS_ORIGIN no .env.vps
# Reiniciar: docker-compose -f docker-compose.vps.yml restart backend


═══════════════════════════════════════════════════════════════
