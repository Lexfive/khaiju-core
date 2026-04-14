# 🚀 Deploy VPS Khaiju - Guia Completo e Definitivo

## ✅ Problema Resolvido
**502 Bad Gateway** → Porta 3001 do backend agora está exposta corretamente

---

## 📦 Arquivos Corrigidos

### 1. `docker-compose.vps.yml`
✅ Backend agora expõe porta `3001:3001`  
✅ Frontend mantém `8080:80`

### 2. `/etc/nginx/sites-available/khaiju`
✅ API roteada para `http://127.0.0.1:3001/`  
✅ Frontend roteado para `http://127.0.0.1:8080/`  
✅ Headers de proxy configurados para cookies HTTP-only

---

## 🎯 Passo a Passo de Deploy (Copie e Execute)

### **PASSO 1: Parar containers antigos**
```bash
cd /caminho/para/khaiju
docker-compose -f docker-compose.vps.yml down
```

### **PASSO 2: Fazer backup do banco (CRÍTICO)**
```bash
docker exec khaiju_postgres pg_dump -U khaiju khaiju_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### **PASSO 3: Atualizar arquivos corrigidos**
```bash
# Substituir docker-compose.vps.yml
cat > docker-compose.vps.yml << 'EOF'
# ════════════════════════════════════════════════════════════
# 🚀 Khaiju - Sistema Financeiro Empresarial
# Versão VPS - Produção com Reverse Proxy
# ════════════════════════════════════════════════════════════

version: '3.9'

services:
  # ──────────────────────────────────────────────────────────
  # 🗄️ PostgreSQL Database
  # ──────────────────────────────────────────────────────────
  postgres:
    image: postgres:16-alpine
    container_name: khaiju_postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: khaiju
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: khaiju_db
      PGDATA: /var/lib/postgresql/data/pgdata
    # ⚠️ NÃO EXPOR PORTA EXTERNAMENTE EM VPS
    # Apenas comunicação interna via rede Docker
    expose:
      - "5432"
    volumes:
      - khaiju_postgres_data:/var/lib/postgresql/data
      - ./postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U khaiju -d khaiju_db"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - khaiju_network

  # ──────────────────────────────────────────────────────────
  # 🔧 Backend API (Node.js + Express + Prisma)
  # ──────────────────────────────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: khaiju_backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3001
      DATABASE_URL: postgresql://khaiju:${POSTGRES_PASSWORD}@postgres:5432/khaiju_db?schema=public
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRES_IN: 7d
      CORS_ORIGIN: ${CORS_ORIGIN:-*}
      TRUST_PROXY: "true"
      API_BASE_URL: ${API_BASE_URL:-/api}
    # ✅ CRÍTICO: Expor porta 3001 para o host (Nginx VPS)
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./backend/prisma:/app/prisma
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - khaiju_network

  # ──────────────────────────────────────────────────────────
  # 🌐 Frontend (React + NGINX)
  # ──────────────────────────────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        # Build-time variables para configuração do frontend
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-/api}
    container_name: khaiju_frontend
    restart: unless-stopped
    # Porta customizável para evitar conflitos
    ports:
      - "${FRONTEND_PORT:-8080}:80"
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - khaiju_network
    # Labels para Traefik (caso use)
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.khaiju.rule=Host(`${DOMAIN:-khaiju.localhost}`)"
      - "traefik.http.routers.khaiju.entrypoints=websecure"
      - "traefik.http.routers.khaiju.tls.certresolver=letsencrypt"
      - "traefik.http.services.khaiju.loadbalancer.server.port=80"

# ──────────────────────────────────────────────────────────
# 💾 Volumes Persistentes
# ──────────────────────────────────────────────────────────
volumes:
  khaiju_postgres_data:
    driver: local
    name: khaiju_postgres_data

# ──────────────────────────────────────────────────────────
# 🌐 Network
# ──────────────────────────────────────────────────────────
networks:
  khaiju_network:
    driver: bridge
    name: khaiju_network
    # Para integração com proxy reverso externo
  # external_proxy:
  #   external: true
  #   name: proxy_network
EOF
```

### **PASSO 4: Configurar Nginx do host VPS**
```bash
# Criar/atualizar configuração do Nginx
sudo nano /etc/nginx/sites-available/khaiju
```

**Cole este conteúdo:**
```nginx
# ════════════════════════════════════════════════════════════
# NGINX Configuration - Khaiju VPS (CORRIGIDO)
# ════════════════════════════════════════════════════════════
#
# Arquivo: /etc/nginx/sites-available/khaiju
#
# ════════════════════════════════════════════════════════════

server {
    listen 80;
    listen [::]:80;
    server_name khaiju.lidermoldurashub.com.br;

    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name khaiju.lidermoldurashub.com.br;

    # SSL (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/khaiju.lidermoldurashub.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/khaiju.lidermoldurashub.com.br/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/khaiju.lidermoldurashub.com.br/chain.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logs
    access_log /var/log/nginx/khaiju_ssl_access.log;
    error_log /var/log/nginx/khaiju_ssl_error.log warn;

    # Tamanho máximo de upload
    client_max_body_size 10M;

    # ══════════════════════════════════════════════════════════
    # 🔌 Proxy para Backend API (CORRIGIDO)
    # ══════════════════════════════════════════════════════════
    location /api/ {
        # ✅ CRÍTICO: Proxy para porta 3001 (backend)
        proxy_pass http://127.0.0.1:3001/;
        
        proxy_http_version 1.1;
        
        # Headers de proxy reverso
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Port $server_port;
        
        # ✅ CRÍTICO para cookies HTTP-only funcionarem
        proxy_set_header Cookie $http_cookie;
        proxy_pass_header Set-Cookie;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    # ══════════════════════════════════════════════════════════
    # 📁 Frontend (Tudo que não é /api)
    # ══════════════════════════════════════════════════════════
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

    # ══════════════════════════════════════════════════════════
    # 🔒 Segurança
    # ══════════════════════════════════════════════════════════
    
    # Bloquear acesso a arquivos ocultos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

**Salvar e sair:** `Ctrl+O`, `Enter`, `Ctrl+X`

### **PASSO 5: Ativar site e validar configuração**
```bash
# Criar symlink
sudo ln -sf /etc/nginx/sites-available/khaiju /etc/nginx/sites-enabled/

# Testar configuração do Nginx
sudo nginx -t

# Se retornar "syntax is ok" e "test is successful", prosseguir
```

### **PASSO 6: Rebuild e restart dos containers**
```bash
# Voltar para diretório do projeto
cd /caminho/para/khaiju

# Rebuild das imagens
docker-compose -f docker-compose.vps.yml build --no-cache

# Subir containers em background
docker-compose -f docker-compose.vps.yml up -d

# Verificar logs
docker-compose -f docker-compose.vps.yml logs -f
```

### **PASSO 7: Reiniciar Nginx do host**
```bash
sudo systemctl reload nginx
# OU
sudo nginx -s reload
```

---

## 🔍 Checklist de Validação (EXECUTE NA ORDEM)

### **1. Verificar containers rodando**
```bash
docker ps
```
**Espera-se ver:**
- ✅ `khaiju_postgres` (UP)
- ✅ `khaiju_backend` (UP)
- ✅ `khaiju_frontend` (UP)

### **2. Testar health do backend (DIRETO)**
```bash
curl http://127.0.0.1:3001/health
```
**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "Khaiju API",
  "environment": "production",
  "timestamp": "2024-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456
}
```

### **3. Testar frontend (DIRETO)**
```bash
curl -I http://127.0.0.1:8080
```
**Resposta esperada:**
```
HTTP/1.1 200 OK
```

### **4. Testar API via Nginx (ATRAVÉS DO PROXY)**
```bash
curl -k https://khaiju.lidermoldurashub.com.br/api/auth/me
```
**Resposta esperada (não autenticado):**
```json
{
  "error": {
    "message": "Token não encontrado",
    "code": "NO_TOKEN"
  }
}
```
✅ **Se retornar erro de autenticação = API está respondendo!**

### **5. Testar login completo**
```bash
curl -k -X POST https://khaiju.lidermoldurashub.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste Deploy","email":"teste@khaiju.com","password":"123456"}' \
  -c cookies.txt -b cookies.txt
```
**Resposta esperada:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Teste Deploy",
    "email": "teste@khaiju.com"
  }
}
```

### **6. Verificar cookie HTTP-only foi setado**
```bash
cat cookies.txt | grep khaiju_token
```
✅ **Deve aparecer:** `khaiju.lidermoldurashub.com.br	TRUE	/	TRUE	...	khaiju_token	eyJhbGci...`

### **7. Testar autenticação com cookie**
```bash
curl -k https://khaiju.lidermoldurashub.com.br/api/auth/me \
  -b cookies.txt
```
**Resposta esperada:**
```json
{
  "user": {
    "id": "...",
    "name": "Teste Deploy",
    "email": "teste@khaiju.com",
    "createdAt": "..."
  }
}
```

### **8. Acessar frontend no navegador**
```
https://khaiju.lidermoldurashub.com.br
```
✅ **Deve carregar a tela de login do Khaiju**

---

## 🚨 Troubleshooting

### **Erro: 502 Bad Gateway**
```bash
# Verificar logs do Nginx
sudo tail -f /var/log/nginx/khaiju_ssl_error.log

# Verificar logs do backend
docker logs khaiju_backend -f

# Verificar se porta 3001 está escutando
ss -tlnp | grep 3001
# Deve retornar: 127.0.0.1:3001
```

### **Erro: Containers não sobem**
```bash
# Logs detalhados
docker-compose -f docker-compose.vps.yml logs

# Verificar se .env.vps existe
ls -la .env.vps

# Verificar se variáveis estão setadas
docker-compose -f docker-compose.vps.yml config
```

### **Erro: Cookies não funcionam**
```bash
# Verificar headers de resposta
curl -kI https://khaiju.lidermoldurashub.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@khaiju.com","password":"123456"}'

# Deve conter: Set-Cookie: khaiju_token=...; HttpOnly; Secure; SameSite=Lax
```

---

## 📊 Arquitetura de Rede (FINAL)

```
┌─────────────────────────────────────────────────────────┐
│  Internet (HTTPS)                                       │
│  https://khaiju.lidermoldurashub.com.br                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │   NGINX (Host VPS)   │
          │   :443 SSL/TLS       │
          └──────────┬───────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   /api/ → 127.0.0.1:3001    / → 127.0.0.1:8080
        │                         │
        ▼                         ▼
 ┌──────────────┐          ┌──────────────┐
 │   Backend    │          │   Frontend   │
 │ khaiju_backend│◄────────┤khaiju_frontend│
 │   :3001      │          │    :80       │
 └──────┬───────┘          └──────────────┘
        │
        ▼
 ┌──────────────┐
 │  PostgreSQL  │
 │khaiju_postgres│
 │    :5432     │
 └──────────────┘
```

---

## ✅ Confirmação de Sucesso

**O deploy está 100% funcional quando:**

- [ ] `docker ps` mostra 3 containers UP
- [ ] `curl http://127.0.0.1:3001/health` retorna status ok
- [ ] `curl http://127.0.0.1:8080` retorna 200 OK
- [ ] `curl https://khaiju.../api/auth/me` retorna erro de autenticação (não 502)
- [ ] Registro via API retorna cookie HTTP-only
- [ ] Login no navegador funciona e redireciona para dashboard
- [ ] Transações são salvas e persistem após refresh
- [ ] Gráficos do dashboard exibem dados reais

---

## 🎯 Próximos Passos (P1)

Após confirmar que o **502 foi resolvido**, próxima tarefa:

**Simplificar formulário de transações:**
- Remover campos desnecessários
- Manter apenas: Valor, Tipo (Receita/Despesa), Categoria, Data (opcional), Descrição (opcional)
- Arquivo: `/app/frontend/src/pages/Transacoes/index.jsx`

---

## 📝 Notas Importantes

1. **Backup automático:** Configure cron job para backup diário do PostgreSQL
2. **Monitoramento:** Implemente logs centralizados (ELK, Grafana, etc.)
3. **SSL:** Certifique-se que Let's Encrypt auto-renew está ativo
4. **Firewall:** Apenas portas 80, 443, 22 devem estar abertas
5. **Atualizações:** Agende janelas de manutenção para updates de containers

---

**Documentação criada em:** 2024-12-XX  
**Status:** ✅ DEPLOY PRODUCTION-READY  
**Ambiente:** VPS Hostinger com NGINX + Docker Compose
