# ════════════════════════════════════════════════════════════
# 🔧 Khaiju - Checklist de Implantação
# ════════════════════════════════════════════════════════════

## 📋 Pré-Implantação

### 1. Servidor/Máquina Host
- [ ] Docker >= 24.0 instalado
- [ ] Docker Compose >= 2.20 instalado
- [ ] Mínimo 2GB RAM disponível
- [ ] Mínimo 5GB espaço em disco
- [ ] IP fixo na rede local (recomendado)

### 2. Configuração de Rede
- [ ] Firewall configurado (permitir porta 80)
- [ ] IP do servidor anotado (ex: 192.168.1.100)
- [ ] Rede local estável

### 3. Configuração Inicial
- [ ] Arquivo `.env` criado (baseado em `.env.example`)
- [ ] Senha do PostgreSQL alterada
- [ ] JWT Secret alterado
- [ ] Permissões de execução nos scripts: `chmod +x scripts/*.sh start.sh`

---

## 🚀 Implantação

### 1. Primeira Inicialização
```bash
# Opção 1: Script automático
./start.sh

# Opção 2: Manual
docker-compose up -d
```

### 2. Verificar Status
```bash
docker-compose ps
```
**Resultado esperado:** 3 containers rodando (healthy)

### 3. Verificar Logs
```bash
docker-compose logs -f
```
**Verificar:** Sem erros críticos

### 4. Testar Acesso Local
```bash
curl http://localhost
```
**Resultado esperado:** HTML da aplicação

---

## 🌐 Configuração de Acesso na Rede

### Para outros computadores acessarem:

#### Método 1: Por IP (Mais Simples)
1. Descubra o IP do servidor:
   ```bash
   hostname -I
   # ou
   ip addr show
   ```
2. Acesse de qualquer PC: `http://IP_DO_SERVIDOR`

#### Método 2: Por khaiju.local (Opcional)
**Em CADA computador que vai acessar**, edite o arquivo hosts:

**Windows:**
- Arquivo: `C:\Windows\System32\drivers\etc\hosts`
- Adicionar: `192.168.1.XXX   khaiju.local`

**Linux/Mac:**
```bash
sudo nano /etc/hosts
# Adicionar: 192.168.1.XXX   khaiju.local
```

---

## ✅ Verificação Pós-Implantação

### 1. Containers
- [ ] `khaiju-postgres` rodando e healthy
- [ ] `khaiju-backend` rodando e healthy
- [ ] `khaiju-frontend` rodando e healthy

### 2. Acesso
- [ ] Frontend acessível via navegador (localhost)
- [ ] Frontend acessível de outro PC (via IP)
- [ ] Interface carrega corretamente (sem erros 404)
- [ ] Design luxury fintech dark aplicado

### 3. Backend
```bash
curl http://localhost:3001/health
```
- [ ] Retorna `{"status":"ok"}`

### 4. Database
```bash
docker exec -it khaiju-postgres psql -U khaiju -d khaiju_db -c "\dt"
```
- [ ] Mostra tabelas: User, Account, Category, Transaction

---

## 💾 Configurar Backup Automático

### Linux/Mac (Cron)
```bash
crontab -e
```
Adicionar:
```
0 3 * * * cd /caminho/completo/khaiju && ./scripts/backup.sh >> ./backups/backup.log 2>&1
```

### Windows (Agendador de Tarefas)
1. Abrir Agendador de Tarefas
2. Criar Tarefa Básica
3. Apontar para `scripts/backup.sh`
4. Definir frequência (diário às 3h)

### Testar Backup Manualmente
```bash
./scripts/backup.sh
```
- [ ] Backup criado em `./backups/`
- [ ] Arquivo .sql.gz gerado
- [ ] Sem erros no log

---

## 🔒 Segurança

### Checklist de Segurança
- [ ] Senhas padrão alteradas no `.env`
- [ ] `.env` NÃO commitado no Git (verificar `.gitignore`)
- [ ] Firewall configurado (apenas porta 80 exposta)
- [ ] Backups regulares configurados
- [ ] Acesso restrito à rede local (não expor para internet)

### Firewall (Linux)
```bash
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status
```

---

## 📊 Monitoramento

### Verificações Diárias
```bash
# Status dos containers
docker-compose ps

# Uso de recursos
docker stats

# Logs recentes
docker-compose logs --tail=50

# Espaço em disco
df -h
```

### Alertas a Monitorar
- [ ] Container com status "Restarting"
- [ ] Logs com erros críticos
- [ ] Disco acima de 80% de uso
- [ ] Backups não gerados

---

## 🆘 Troubleshooting Comum

### Container não inicia
```bash
docker-compose logs <nome-container>
# Verificar erro específico
```

### Porta 80 em uso
```bash
sudo lsof -i :80
# Parar serviço conflitante ou mudar porta no docker-compose.yml
```

### Erro de conexão com banco
```bash
docker-compose down
docker-compose up -d
# Aguardar 10 segundos e testar
```

### Interface não carrega
```bash
# Verificar logs do frontend
docker-compose logs frontend

# Rebuild
docker-compose build frontend
docker-compose up -d frontend
```

---

## 📝 Manutenção Mensal

- [ ] Verificar backups criados e íntegros
- [ ] Limpar backups com mais de 30 dias
- [ ] Verificar espaço em disco
- [ ] Revisar logs de erro
- [ ] Testar restauração de backup (em ambiente de teste)

---

## 🚨 Plano de Recuperação de Desastre

### Backup Preventivo Antes de Mudanças
```bash
./scripts/backup.sh
```

### Restauração Completa
```bash
# 1. Parar sistema
docker-compose down

# 2. Restaurar backup
./scripts/restore.sh

# 3. Reiniciar
docker-compose up -d
```

### Reinstalação Completa
```bash
# 1. Fazer backup dos dados
./scripts/backup.sh

# 2. Remover tudo
docker-compose down -v

# 3. Limpar Docker
docker system prune -a

# 4. Reiniciar
docker-compose up -d

# 5. Restaurar dados
./scripts/restore.sh
```

---

## ✅ Conclusão

Ao marcar todos os itens acima, o sistema estará:
- ✅ Rodando em produção local
- ✅ Acessível por múltiplos usuários
- ✅ Com backups automáticos
- ✅ Seguro e monitorado
- ✅ Pronto para uso empresarial

---

**Última revisão:** Abril 2024  
**Versão:** 1.0.0
