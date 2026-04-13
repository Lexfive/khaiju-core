# 🚀 Khaiju - Guia de Deploy VPS (Produção)

![Version](https://img.shields.io/badge/version-1.0.0--vps-purple)
![Production](https://img.shields.io/badge/deploy-VPS-success)

Guia completo para deploy do Khaiju em VPS pública (Hostinger, DigitalOcean, AWS, etc.)

---

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração Inicial](#configuração-inicial)
- [Deploy](#deploy)
- [Configuração de Proxy Reverso](#configuração-de-proxy-reverso)
- [Acesso e Testes](#acesso-e-testes)
- [Múltiplos Sistemas na Mesma VPS](#múltiplos-sistemas-na-mesma-vps)
- [HTTPS com Let's Encrypt](#https-com-lets-encrypt)
- [Troubleshooting](#troubleshooting)

---

## 🛠 Pré-requisitos

### Na VPS:

✅ **Docker** >= 24.0  
✅ **Docker Compose** >= 2.20  
✅ **Acesso SSH** à VPS  
✅ **Mínimo 2GB RAM**  
✅ **Mínimo 10GB disco**  
✅ **(Opcional) Domínio configurado** apontando para IP da VPS  

### Verificar instalação:

```bash
ssh usuario@SEU_IP_VPS
docker --version
docker-compose --version
```

---

## ⚙️ Configuração Inicial

### 1. Conectar à VPS via SSH

```bash
ssh usuario@SEU_IP_VPS
```

### 2. Criar diretório do projeto

```bash
mkdir -p ~/khaiju
cd ~/khaiju
```

### 3. Transferir arquivos do projeto

**Opção A: Via Git (Recomendado)**

```bash
git clone https://github.com/seu-usuario/khaiju.git .
```

**Opção B: Via SCP (do seu computador local)**

```bash
# No seu computador local:
scp -r /caminho/local/khaiju/* usuario@SEU_IP_VPS:~/khaiju/
```

**Opção C: Via FTP/SFTP**

Use FileZilla ou WinSCP para transferir os arquivos.

### 4. Configurar variáveis de ambiente

```bash
cd ~/khaiju
cp .env.vps.example .env.vps
nano .env.vps
```

**Configure as variáveis essenciais:**

```env
# ⚠️ OBRIGATÓRIO: Alterar senhas!
POSTGRES_PASSWORD=SUA_SENHA_FORTE_AQUI
JWT_SECRET=SEU_JWT_SECRET_FORTE_AQUI_MIN_32_CHARS

# Porta do frontend (8080 recomendado para evitar conflitos)
FRONTEND_PORT=8080

# CORS - Configurar baseado no seu cenário:
# Com domínio:
CORS_ORIGIN=https://khaiju.seudominio.com

# Apenas IP:
CORS_ORIGIN=http://SEU_IP:8080

# Domínio (para Traefik/proxy reverso)
DOMAIN=khaiju.seudominio.com
```

---

## 🚀 Deploy

### Método 1: Deploy Direto (Acesso via IP:PORTA)

```bash
cd ~/khaiju

# Iniciar sistema
docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d

# Verificar status
docker-compose -f docker-compose.vps.yml ps

# Ver logs
docker-compose -f docker-compose.vps.yml logs -f
```

**Acesso:**
```
http://SEU_IP:8080
```

### Método 2: Deploy com Proxy Reverso (Recomendado)

Ver seção [Configuração de Proxy Reverso](#configuração-de-proxy-reverso).

---

## 🌐 Configuração de Proxy Reverso

Para usar domínio/subdomínio e HTTPS, configure um proxy reverso na VPS.

### Opção A: NGINX como Proxy Reverso

#### 1. Instalar NGINX na VPS (fora do Docker)

```bash
sudo apt update
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### 2. Criar configuração do Khaiju

```bash
sudo nano /etc/nginx/sites-available/khaiju
```

**Conteúdo:**

```nginx
server {
    listen 80;
    server_name khaiju.seudominio.com;  # Alterar para seu domínio

    # Logs
    access_log /var/log/nginx/khaiju_access.log;
    error_log /var/log/nginx/khaiju_error.log;

    # Proxy para Khaiju frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    # Tamanho máximo de upload
    client_max_body_size 10M;
}
```

#### 3. Ativar configuração

```bash
sudo ln -s /etc/nginx/sites-available/khaiju /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Configurar HTTPS (Let's Encrypt)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d khaiju.seudominio.com

# Testar auto-renovação
sudo certbot renew --dry-run
```

**Acesso:**
```
https://khaiju.seudominio.com
```

### Opção B: Traefik como Proxy Reverso

Se já usa Traefik na VPS, os labels já estão configurados no `docker-compose.vps.yml`:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.khaiju.rule=Host(`khaiju.seudominio.com`)"
  - "traefik.http.routers.khaiju.entrypoints=websecure"
  - "traefik.http.routers.khaiju.tls.certresolver=letsencrypt"
```

**Configure o `.env.vps`:**

```env
DOMAIN=khaiju.seudominio.com
CORS_ORIGIN=https://khaiju.seudominio.com
```

**Adicione o Khaiju à rede do Traefik:**

```bash
# Criar rede externa (se não existir)
docker network create proxy_network

# Modificar docker-compose.vps.yml
# Descomentar seção "external_proxy" em networks
```

---

## 🧪 Acesso e Testes

### Testar Health Check do Backend

```bash
# Via localhost (dentro da VPS)
curl http://localhost:3001/health

# Via IP público (se porta 3001 exposta - não recomendado)
curl http://SEU_IP:3001/health
```

**Resposta esperada:**
```json
{
  "status": "ok",
  "service": "Khaiju API",
  "environment": "production",
  "timestamp": "2024-04-13T12:00:00.000Z",
  "uptime": 123.45
}
```

### Testar Frontend

**Acesso via navegador:**

- **Sem proxy:** `http://SEU_IP:8080`
- **Com NGINX:** `https://khaiju.seudominio.com`
- **Com Traefik:** `https://khaiju.seudominio.com`

### Testar API via Frontend

1. Abra o navegador
2. Acesse a aplicação
3. Abra DevTools (F12) → Console
4. Verifique se há erros de CORS
5. Teste funcionalidades (dashboard, transações)

---

## 🔄 Múltiplos Sistemas na Mesma VPS

### Evitar Conflitos de Porta

O Khaiju usa porta **8080** por padrão (configurável via `FRONTEND_PORT`).

**Se já tem outro sistema na porta 8080:**

```env
# Em .env.vps
FRONTEND_PORT=8081  # ou outra porta disponível
```

### Isolamento de Containers

Cada sistema deve ter:

✅ **Nomes únicos de containers** (khaiju_*, lider_*, etc.)  
✅ **Nomes únicos de volumes** (khaiju_postgres_data)  
✅ **Redes separadas** (khaiju_network, lider_network)  

O Khaiju já está configurado com prefixo `khaiju_` em tudo.

### Exemplo: Khaiju + Líder HB na mesma VPS

```bash
# Líder HB rodando na porta 8000
# Khaiju rodando na porta 8080

# NGINX proxy reverso:
# - lider.seudominio.com → localhost:8000
# - khaiju.seudominio.com → localhost:8080
```

**Configuração NGINX:**

```nginx
# /etc/nginx/sites-available/multisite

server {
    listen 80;
    server_name lider.seudominio.com;
    location / {
        proxy_pass http://localhost:8000;
        # ... headers
    }
}

server {
    listen 80;
    server_name khaiju.seudominio.com;
    location / {
        proxy_pass http://localhost:8080;
        # ... headers
    }
}
```

---

## 🔒 HTTPS com Let's Encrypt

### Pré-requisitos:

✅ Domínio/subdomínio configurado (DNS apontando para VPS)  
✅ NGINX instalado e configurado  
✅ Portas 80 e 443 abertas no firewall  

### Instalação Certbot:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Obter Certificado SSL:

```bash
# Para um domínio
sudo certbot --nginx -d khaiju.seudominio.com

# Para múltiplos domínios
sudo certbot --nginx -d khaiju.seudominio.com -d www.khaiju.seudominio.com
```

### Auto-renovação:

Certbot configura auto-renovação automaticamente.

**Testar renovação:**

```bash
sudo certbot renew --dry-run
```

**Renovação manual (se necessário):**

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Verificar certificado:

```bash
sudo certbot certificates
```

---

## 📊 Monitoramento

### Verificar Status dos Containers

```bash
cd ~/khaiju
docker-compose -f docker-compose.vps.yml ps
```

### Ver Logs em Tempo Real

```bash
# Todos os serviços
docker-compose -f docker-compose.vps.yml logs -f

# Apenas backend
docker-compose -f docker-compose.vps.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.vps.yml logs -f frontend

# Últimas 100 linhas
docker-compose -f docker-compose.vps.yml logs --tail=100
```

### Ver Uso de Recursos

```bash
docker stats
```

### Verificar Espaço em Disco

```bash
df -h
docker system df
```

---

## 💾 Backup em VPS

### Backup Manual

```bash
cd ~/khaiju
./scripts/backup.sh
```

Backups são salvos em `~/khaiju/backups/`

### Backup Automático (Cron)

```bash
crontab -e
```

**Adicionar:**

```cron
# Backup diário às 3h da manhã
0 3 * * * cd /home/usuario/khaiju && ./scripts/backup.sh >> /home/usuario/khaiju/backups/backup.log 2>&1
```

### Download de Backup para Local

```bash
# No seu computador local:
scp usuario@SEU_IP:/home/usuario/khaiju/backups/khaiju_backup_*.sql.gz ./
```

---

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
cd ~/khaiju

# Iniciar
docker-compose -f docker-compose.vps.yml --env-file .env.vps up -d

# Parar
docker-compose -f docker-compose.vps.yml down

# Reiniciar
docker-compose -f docker-compose.vps.yml restart

# Parar e remover (mantém volumes)
docker-compose -f docker-compose.vps.yml down

# Parar e remover TUDO (⚠️ apaga dados!)
docker-compose -f docker-compose.vps.yml down -v
```

### Rebuild após Mudanças no Código

```bash
cd ~/khaiju

# Rebuild e restart
docker-compose -f docker-compose.vps.yml build
docker-compose -f docker-compose.vps.yml up -d
```

### Acessar Shell do Container

```bash
# Backend
docker exec -it khaiju_backend sh

# Frontend
docker exec -it khaiju_frontend sh

# PostgreSQL
docker exec -it khaiju_postgres psql -U khaiju -d khaiju_db
```

---

## 🚨 Troubleshooting

### Problema: Container não inicia

**Solução:**

```bash
docker-compose -f docker-compose.vps.yml logs <nome-container>
```

Verifique os logs para identificar o erro.

### Problema: Erro de CORS

**Sintomas:** Console do navegador mostra erro CORS.

**Solução:**

1. Verifique `CORS_ORIGIN` no `.env.vps`
2. Deve coincidir com URL de acesso
3. Reinicie o backend:

```bash
docker-compose -f docker-compose.vps.yml restart backend
```

### Problema: 502 Bad Gateway (NGINX)

**Causas comuns:**

1. Container frontend não está rodando
2. Porta errada no proxy_pass
3. Container não está acessível

**Solução:**

```bash
# Verificar containers
docker-compose -f docker-compose.vps.yml ps

# Verificar logs do NGINX
sudo tail -f /var/log/nginx/khaiju_error.log

# Testar conexão
curl http://localhost:8080
```

### Problema: Porta já em uso

**Erro:** `port is already allocated`

**Solução:**

Alterar `FRONTEND_PORT` no `.env.vps`:

```env
FRONTEND_PORT=8081  # ou outra porta livre
```

### Problema: PostgreSQL não conecta

**Solução:**

```bash
# Verificar se está rodando
docker-compose -f docker-compose.vps.yml ps postgres

# Ver logs
docker-compose -f docker-compose.vps.yml logs postgres

# Recriar container
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d
```

### Problema: API não responde

**Verificações:**

```bash
# 1. Backend está rodando?
docker-compose -f docker-compose.vps.yml ps backend

# 2. Health check
curl http://localhost:3001/health

# 3. Logs do backend
docker-compose -f docker-compose.vps.yml logs backend

# 4. CORS configurado?
grep CORS_ORIGIN .env.vps
```

---

## 🔐 Segurança em VPS

### Checklist de Segurança:

✅ **Firewall configurado** (permitir apenas 80, 443, 22)  
✅ **Senhas fortes** no `.env.vps`  
✅ **HTTPS habilitado** (Let's Encrypt)  
✅ **PostgreSQL não exposto** externamente  
✅ **Backups regulares** configurados  
✅ **`.env.vps` não commitado** no Git  
✅ **CORS específico** (não usar wildcard `*`)  

### Configurar Firewall (UFW):

```bash
# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Ver status
sudo ufw status
```

### Bloquear Acesso Direto às Portas dos Containers:

**Não** exponha as portas dos containers publicamente. Use apenas via proxy reverso.

No `docker-compose.vps.yml`, as portas estão configuradas como `expose` (interno) ou `127.0.0.1:PORTA` (apenas localhost).

---

## 📈 Escalabilidade

### Aumentar Recursos do PostgreSQL:

Editar `docker-compose.vps.yml`:

```yaml
postgres:
  # ...
  deploy:
    resources:
      limits:
        cpus: '2'
        memory: 2G
      reservations:
        cpus: '1'
        memory: 1G
```

### Múltiplas Réplicas (com Load Balancer):

Para escalar horizontalmente, use Docker Swarm ou Kubernetes.

---

## 📞 Suporte

### Documentação:

- **Instalação:** `README.md`
- **Checklist:** `DEPLOYMENT_CHECKLIST.md`
- **Mudanças:** `CHANGES.md`

### Logs:

```bash
# Aplicação
docker-compose -f docker-compose.vps.yml logs -f

# NGINX (se usar)
sudo tail -f /var/log/nginx/khaiju_error.log
```

---

## ✅ Conclusão

Seguindo este guia, o Khaiju estará:

✅ Rodando em VPS pública  
✅ Acessível via domínio/IP  
✅ Protegido com HTTPS  
✅ Isolado de outros sistemas  
✅ Com backups automáticos  
✅ Monitorado e estável  

**Acesso final:**

```
https://khaiju.seudominio.com
```

ou

```
http://SEU_IP:8080
```

---

**Versão:** 1.0.0-vps  
**Última atualização:** Abril 2024  
**Ambiente:** VPS / Produção Pública
