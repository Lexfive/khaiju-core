# ════════════════════════════════════════════════════════════
# 🌐 Exemplos de Configuração de Proxy Reverso para Khaiju
# ════════════════════════════════════════════════════════════

## ═══════════════════════════════════════════════════════════
## EXEMPLO 1: NGINX (Proxy Reverso Global)
## ═══════════════════════════════════════════════════════════

# Arquivo: /etc/nginx/sites-available/khaiju
# Uso: sudo ln -s /etc/nginx/sites-available/khaiju /etc/nginx/sites-enabled/

server {
    listen 80;
    listen [::]:80;
    server_name khaiju.seudominio.com;

    # Redirecionar HTTP para HTTPS (após configurar SSL)
    # return 301 https://$server_name$request_uri;

    # Logs
    access_log /var/log/nginx/khaiju_access.log;
    error_log /var/log/nginx/khaiju_error.log warn;

    # Tamanho máximo de upload
    client_max_body_size 10M;

    # Timeout configurations
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    # Proxy para Khaiju frontend (rodando na porta 8080)
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        
        # Headers essenciais
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # WebSocket support (se necessário)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}

# ═══════════════════════════════════════════════════════════
# NGINX com HTTPS (Let's Encrypt)
# ═══════════════════════════════════════════════════════════

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name khaiju.seudominio.com;

    # Certificados SSL (configurados via Certbot)
    ssl_certificate /etc/letsencrypt/live/khaiju.seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/khaiju.seudominio.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/khaiju.seudominio.com/chain.pem;

    # SSL Configuration (Mozilla Intermediate)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logs
    access_log /var/log/nginx/khaiju_ssl_access.log;
    error_log /var/log/nginx/khaiju_ssl_error.log warn;

    # Proxy para Khaiju
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name khaiju.seudominio.com;
    return 301 https://$server_name$request_uri;
}


## ═══════════════════════════════════════════════════════════
## EXEMPLO 2: Traefik (Docker Labels)
## ═══════════════════════════════════════════════════════════

# As labels já estão configuradas em docker-compose.vps.yml
# Configuração adicional necessária em traefik.yml ou traefik.toml

# traefik.yml (exemplo)
# -----------------------

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: seu-email@dominio.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    exposedByDefault: false
    network: proxy_network


## ═══════════════════════════════════════════════════════════
## EXEMPLO 3: Caddy (Caddyfile)
## ═══════════════════════════════════════════════════════════

# Arquivo: /etc/caddy/Caddyfile

khaiju.seudominio.com {
    # Caddy automaticamente configura HTTPS via Let's Encrypt
    
    reverse_proxy localhost:8080 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
    
    # Logs
    log {
        output file /var/log/caddy/khaiju_access.log
    }
    
    # Compressão
    encode gzip
}


## ═══════════════════════════════════════════════════════════
## EXEMPLO 4: Apache (VirtualHost)
## ═══════════════════════════════════════════════════════════

# Arquivo: /etc/apache2/sites-available/khaiju.conf
# Requer módulos: a2enmod proxy proxy_http proxy_wstunnel headers ssl

<VirtualHost *:80>
    ServerName khaiju.seudominio.com
    
    # Redirecionar para HTTPS
    # Redirect permanent / https://khaiju.seudominio.com/
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/khaiju_error.log
    CustomLog ${APACHE_LOG_DIR}/khaiju_access.log combined
    
    # Proxy para Khaiju
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    
    # Headers
    RequestHeader set X-Forwarded-Proto "http"
    RequestHeader set X-Forwarded-Port "80"
</VirtualHost>

<VirtualHost *:443>
    ServerName khaiju.seudominio.com
    
    # SSL (configurado via Certbot)
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/khaiju.seudominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/khaiju.seudominio.com/privkey.pem
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/khaiju_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/khaiju_ssl_access.log combined
    
    # Proxy
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8080/
    ProxyPassReverse / http://127.0.0.1:8080/
    
    # Headers
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"
    
    # HSTS
    Header always set Strict-Transport-Security "max-age=31536000"
</VirtualHost>


## ═══════════════════════════════════════════════════════════
## EXEMPLO 5: Múltiplos Sistemas na Mesma VPS
## ═══════════════════════════════════════════════════════════

# Cenário: Khaiju + Líder HB + Outro Sistema

# NGINX Configuration
# -------------------

# Khaiju - khaiju.dominio.com
server {
    listen 80;
    server_name khaiju.dominio.com;
    
    location / {
        proxy_pass http://127.0.0.1:8080;  # Porta do Khaiju
        # ... headers
    }
}

# Líder HB - lider.dominio.com
server {
    listen 80;
    server_name lider.dominio.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;  # Porta do Líder
        # ... headers
    }
}

# Outro sistema - app.dominio.com
server {
    listen 80;
    server_name app.dominio.com;
    
    location / {
        proxy_pass http://127.0.0.1:9000;  # Porta do outro sistema
        # ... headers
    }
}


## ═══════════════════════════════════════════════════════════
## EXEMPLO 6: Acesso via Subpath (não recomendado, mas possível)
## ═══════════════════════════════════════════════════════════

# Cenário: dominio.com/khaiju ao invés de khaiju.dominio.com

server {
    listen 80;
    server_name dominio.com;
    
    # Khaiju em /khaiju
    location /khaiju {
        # Remove /khaiju do path antes de passar para o container
        rewrite ^/khaiju(/.*)$ $1 break;
        
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Prefix /khaiju;
    }
    
    # Outro sistema na raiz
    location / {
        proxy_pass http://127.0.0.1:3000;
        # ... headers
    }
}

# ⚠️ IMPORTANTE: Para subpath funcionar corretamente,
# o frontend precisa ser buildado com base URL configurada:
# VITE_BASE_URL=/khaiju


## ═══════════════════════════════════════════════════════════
## COMANDOS ÚTEIS
## ═══════════════════════════════════════════════════════════

# NGINX
# -----
# Testar configuração
sudo nginx -t

# Recarregar
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/khaiju_error.log

# Apache
# ------
# Testar configuração
sudo apache2ctl configtest

# Recarregar
sudo systemctl reload apache2

# Ativar site
sudo a2ensite khaiju

# Caddy
# -----
# Testar configuração
caddy validate --config /etc/caddy/Caddyfile

# Recarregar
sudo systemctl reload caddy

# Traefik
# -------
# Ver logs
docker logs traefik -f


## ═══════════════════════════════════════════════════════════
## TROUBLESHOOTING
## ═══════════════════════════════════════════════════════════

# 502 Bad Gateway
# ---------------
# 1. Verificar se container está rodando
docker ps | grep khaiju

# 2. Verificar porta correta
curl http://localhost:8080

# 3. Verificar logs do proxy
sudo tail -f /var/log/nginx/error.log

# CORS Errors
# -----------
# Configurar CORS_ORIGIN no .env.vps corretamente
# Exemplo: CORS_ORIGIN=https://khaiju.seudominio.com

# 504 Gateway Timeout
# -------------------
# Aumentar timeouts no proxy reverso
# NGINX:
proxy_connect_timeout 300s;
proxy_send_timeout 300s;
proxy_read_timeout 300s;


## ═══════════════════════════════════════════════════════════
## FIM
## ═══════════════════════════════════════════════════════════
