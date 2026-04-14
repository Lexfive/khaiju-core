# 🔧 CORREÇÃO 502 - Guia de Deploy VPS

## ❌ **PROBLEMA**
- Login retorna HTTP 502
- `/api/auth/me` retorna 502
- Backend funciona em localhost mas não via Nginx

## ✅ **CAUSA RAIZ**
1. **CORS incompatível:** `credentials: true` com `origin: '*'` NÃO funciona
2. **Cookie sameSite:** `strict` muito restritivo para Nginx
3. **Nginx:** Faltava headers de cookie (`Cookie`, `Set-Cookie`)
4. **.env:** CORS_ORIGIN com wildcard em vez do domínio real

---

## 🚀 **DEPLOY DAS CORREÇÕES**

### **1. Atualizar Arquivos no Servidor**

```bash
# Local: Transferir arquivos atualizados
cd /caminho/do/khaiju
scp backend/src/controllers/auth.controller.js usuario@VPS:/opt/khaiju/backend/src/controllers/
scp backend/src/index.js usuario@VPS:/opt/khaiju/backend/src/
scp .env.vps usuario@VPS:/opt/khaiju/

# Ou comprimir e enviar tudo
tar -czf khaiju_fix_502.tar.gz backend/src .env.vps
scp khaiju_fix_502.tar.gz usuario@VPS:/tmp/
```

### **2. Na VPS: Aplicar Mudanças**

```bash
ssh usuario@VPS
cd /opt/khaiju

# Se enviou tar.gz:
tar -xzf /tmp/khaiju_fix_502.tar.gz

# Verificar .env.vps
cat .env.vps | grep CORS_ORIGIN
# Deve mostrar: CORS_ORIGIN=https://khaiju.lidermoldurashub.com.br
```

### **3. Atualizar Nginx**

```bash
# Backup da config atual
sudo cp /etc/nginx/sites-available/khaiju /etc/nginx/sites-available/khaiju.backup

# Editar configuração
sudo nano /etc/nginx/sites-available/khaiju
```

**Adicionar no `location /api`:**
```nginx
# ✅ CRÍTICO para cookies
proxy_set_header Cookie $http_cookie;
proxy_pass_header Set-Cookie;
```

**Verificar que proxy_pass NÃO tem barra no final:**
```nginx
proxy_pass http://127.0.0.1:8080;  # ✅ CORRETO
# proxy_pass http://127.0.0.1:8080/;  # ❌ ERRADO (remove /api)
```

**Testar e recarregar:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### **4. Rebuild Backend**

```bash
cd /opt/khaiju

# Parar backend
docker-compose -f docker-compose.vps.yml stop backend

# Rebuild sem cache
docker-compose -f docker-compose.vps.yml build --no-cache backend

# Iniciar
docker-compose -f docker-compose.vps.yml up -d backend

# Ver logs (procurar por erros)
docker-compose -f docker-compose.vps.yml logs -f backend
```

---

## 🧪 **TESTES**

### **1. Testar Backend Diretamente**

```bash
# Health check
curl http://localhost:8080/health

# Register
curl -v -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}' \
  -c cookies.txt

# Verificar cookie criado
cat cookies.txt | grep khaiju_token

# Testar /me
curl -v -b cookies.txt http://localhost:8080/api/auth/me
```

### **2. Testar Via Nginx (Domínio)**

```bash
# Register via domínio
curl -v -X POST https://khaiju.lidermoldurashub.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"VPS Test","email":"vps@test.com","password":"123456"}' \
  -c cookies_vps.txt

# Verificar cookie
cat cookies_vps.txt

# Testar /me
curl -v -b cookies_vps.txt https://khaiju.lidermoldurashub.com.br/api/auth/me
```

**Resposta esperada (200 OK):**
```json
{"user":{"id":"...","name":"VPS Test","email":"vps@test.com","createdAt":"..."}}
```

### **3. Testar no Navegador**

1. Abrir: `https://khaiju.lidermoldurashub.com.br/login`
2. F12 → Network tab
3. Fazer login
4. Verificar:
   - Request: `POST /api/auth/login` → Status 200 ✅
   - Response Headers: `Set-Cookie: khaiju_token=...`
   - Request seguinte: `GET /api/auth/me` com cookie

---

## 📊 **CHECKLIST DE VERIFICAÇÃO**

```
Backend:
[ ] auth.controller.js atualizado (sameSite: 'lax', logs)
[ ] index.js CORS atualizado (allowedHeaders + exposedHeaders)
[ ] .env.vps com CORS_ORIGIN correto
[ ] Backend rebuilded

Nginx:
[ ] proxy_set_header Cookie adicionado
[ ] proxy_pass_header Set-Cookie adicionado
[ ] proxy_pass SEM barra no final
[ ] nginx -t OK
[ ] nginx reloaded

Testes:
[ ] curl localhost: register + /me funciona
[ ] curl domínio: register + /me funciona (200)
[ ] Navegador: login funciona
[ ] Navegador: /me retorna usuário
[ ] Cookie presente em DevTools → Application → Cookies
```

---

## 🐛 **TROUBLESHOOTING**

### **Ainda retorna 502:**

**1. Ver logs do backend:**
```bash
docker-compose -f docker-compose.vps.yml logs backend --tail=50
```

**2. Ver logs do Nginx:**
```bash
sudo tail -f /var/log/nginx/khaiju_ssl_error.log
```

**3. Verificar se backend está respondendo:**
```bash
curl -v http://localhost:8080/health
```

### **Cookie não está sendo enviado:**

**1. Verificar Response Headers no navegador:**
- Deve ter: `Set-Cookie: khaiju_token=...`
- Atributos: `HttpOnly; Secure; SameSite=Lax`

**2. Verificar se CORS_ORIGIN bate com o domínio:**
```bash
grep CORS_ORIGIN /opt/khaiju/.env.vps
# Deve ser: https://khaiju.lidermoldurashub.com.br
```

**3. Verificar logs do backend:**
```bash
docker logs khaiju_backend 2>&1 | grep CORS
```

### **Erro "Not allowed by CORS":**

**1. Backend não está usando .env.vps correto:**
```bash
# Verificar se docker-compose usa --env-file .env.vps
docker-compose -f docker-compose.vps.yml config | grep CORS
```

**2. Rebuild backend:**
```bash
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml up -d
```

---

## ✅ **RESULTADO ESPERADO**

Após aplicar todas as correções:

✅ `POST /api/auth/login` → 200 OK + cookie setado  
✅ `GET /api/auth/me` → 200 OK + dados do usuário  
✅ Cookie visível em DevTools → Application → Cookies  
✅ Sessão persiste após refresh  
✅ Logout remove cookie  

---

**Status:** 🔧 CORREÇÕES APLICADAS  
**Prioridade:** 🔴 CRÍTICA  
**Próximo:** Deploy e teste em produção
