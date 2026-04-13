# 🚀 Khaiju - Sistema Financeiro Empresarial

![Version](https://img.shields.io/badge/version-1.0.0-purple)
![License](https://img.shields.io/badge/license-Proprietário-blue)

Sistema financeiro completo para gestão empresarial, rodando 100% em rede local (on-premise) com interface premium luxury fintech dark.

---

## 📋 Índice

- [Características](#características)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Uso](#uso)
- [Acesso na Rede Local](#acesso-na-rede-local)
- [Backup e Restauração](#backup-e-restauração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Manutenção](#manutenção)
- [Troubleshooting](#troubleshooting)

---

## ✨ Características

### Interface Premium
- 🎨 Design **Luxury Fintech Dark** com paleta profissional
- 💎 Cards com profundidade e glow sutil roxo
- 📊 Dashboard rica com KPIs, gráficos e métricas
- 🎯 Sidebar moderna com ícones e navegação fluida
- 📱 Responsivo e otimizado para múltiplos dispositivos

### Funcionalidades
- 💰 Gestão de transações (receitas e despesas)
- 📈 Relatórios financeiros completos
- 🎯 Metas e orçamentos
- 📊 Gráficos interativos de fluxo financeiro
- 👥 Multiusuário com autenticação
- 🔐 Segurança com JWT

### Infraestrutura
- 🐳 Docker Compose para deploy simplificado
- 🗄️ PostgreSQL com volumes persistentes
- 💾 Sistema de backup automático
- 🔄 Health checks e auto-restart
- 🌐 Acesso via rede local (IP ou khaiju.local)

---

## 🛠 Tecnologias

**Frontend:**
- React 18 + Vite
- React Router DOM
- Recharts (gráficos)
- Lucide React (ícones)
- Custom CSS Design System

**Backend:**
- Node.js 20
- Express.js
- Prisma ORM
- PostgreSQL 16
- JWT Authentication

**Infraestrutura:**
- Docker & Docker Compose
- NGINX (reverse proxy)
- PostgreSQL (banco de dados)

---

## 📦 Pré-requisitos

- **Docker** >= 24.0
- **Docker Compose** >= 2.20
- **Git** (opcional, para versionamento)
- **Mínimo 2GB RAM** disponível
- **5GB espaço em disco**

### Verificar instalação:

```bash
docker --version
docker-compose --version
```

---

## 🚀 Instalação

### 1. Clone ou extraia o projeto

```bash
cd /caminho/para/khaiju
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

**Edite o arquivo `.env` e altere as senhas:**

```env
POSTGRES_PASSWORD=sua_senha_segura_aqui
JWT_SECRET=seu_jwt_secret_seguro_aqui
```

### 3. Inicie o sistema

```bash
docker-compose up -d
```

**Aguarde alguns segundos** enquanto os containers são criados e inicializados.

### 4. Verifique o status

```bash
docker-compose ps
```

Você deve ver 3 containers rodando:
- `khaiju-postgres` (banco de dados)
- `khaiju-backend` (API)
- `khaiju-frontend` (interface web)

---

## 💻 Uso

### Acessar o sistema

**No servidor (máquina onde está rodando):**

```
http://localhost
```

**Em outros computadores da rede:**

```
http://IP_DO_SERVIDOR
```

> Substitua `IP_DO_SERVIDOR` pelo IP local da máquina (exemplo: `192.168.1.100`)

### Comandos úteis

```bash
# Parar o sistema
docker-compose down

# Reiniciar
docker-compose restart

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend

# Parar e remover containers (mantém dados)
docker-compose down

# Parar e remover TUDO (⚠️ apaga dados)
docker-compose down -v
```

---

## 🌐 Acesso na Rede Local

### Método 1: Acesso por IP (recomendado)

1. **Descubra o IP do servidor:**

   **Linux/Mac:**
   ```bash
   ip addr show | grep inet
   # ou
   ifconfig | grep inet
   ```

   **Windows:**
   ```cmd
   ipconfig
   ```

2. **Acesse de qualquer PC na mesma rede:**
   ```
   http://192.168.1.XXX
   ```

### Método 2: Acesso por khaiju.local

Para usar `http://khaiju.local`, configure o arquivo **hosts** em CADA máquina que vai acessar:

**Windows:**
1. Abra o Bloco de Notas como Administrador
2. Abra o arquivo: `C:\Windows\System32\drivers\etc\hosts`
3. Adicione no final:
   ```
   192.168.1.XXX   khaiju.local
   ```
4. Salve e feche

**Linux/Mac:**
```bash
sudo nano /etc/hosts
```

Adicione:
```
192.168.1.XXX   khaiju.local
```

Salve com `Ctrl+O`, saia com `Ctrl+X`.

Agora acesse: `http://khaiju.local`

---

## 💾 Backup e Restauração

### Backup Manual

```bash
./scripts/backup.sh
```

Os backups são salvos em `./backups/` com timestamp:
- `khaiju_backup_20240413_143022.sql.gz`

**Configuração:**
- Backups são mantidos por **30 dias** (configurável em `backup.sh`)
- Backups antigos são removidos automaticamente

### Backup Automático (Cron)

**Linux/Mac - Executar backup diário às 3h da manhã:**

```bash
crontab -e
```

Adicione:
```cron
0 3 * * * cd /caminho/completo/para/khaiju && ./scripts/backup.sh >> ./backups/backup.log 2>&1
```

**Windows - Usar Agendador de Tarefas:**
1. Abrir "Agendador de Tarefas"
2. Criar Tarefa Básica
3. Configurar para rodar `backup.sh` diariamente

### Restauração

```bash
./scripts/restore.sh
```

Siga as instruções no terminal:
1. Selecione o backup para restaurar
2. Confirme digitando `SIM`
3. Aguarde a conclusão

⚠️ **ATENÇÃO:** A restauração **substitui todos os dados atuais!**

---

## 📁 Estrutura do Projeto

```
khaiju/
│
├── docker-compose.yml          # Orquestração dos containers
├── .env                        # Variáveis de ambiente (não versionar!)
├── .env.example                # Template de configuração
├── README.md                   # Esta documentação
│
├── frontend/                   # React App
│   ├── Dockerfile              # Build da interface
│   ├── nginx.conf              # Configuração NGINX
│   ├── src/                    # Código-fonte React
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── data/               # API client e providers
│   │   └── styles/             # Design system
│   ├── package.json            # Dependências
│   └── vite.config.js          # Configuração Vite
│
├── backend/                    # Node.js API
│   ├── Dockerfile              # Build da API
│   ├── prisma/                 # ORM e migrations
│   │   ├── schema.prisma       # Schema do banco
│   │   └── migrations/         # Histórico de mudanças
│   ├── src/                    # Código-fonte
│   │   ├── controllers/        # Lógica de negócio
│   │   ├── routes/             # Rotas da API
│   │   ├── services/           # Serviços
│   │   ├── middlewares/        # Autenticação, erros
│   │   └── index.js            # Entry point
│   └── package.json            # Dependências
│
├── postgres/                   # Database
│   └── init.sql                # Script de inicialização
│
├── scripts/                    # Utilitários
│   ├── backup.sh               # Backup automático
│   └── restore.sh              # Restauração
│
└── backups/                    # Backups gerados (criado automaticamente)
```

---

## 🔧 Manutenção

### Atualizar dependências do Frontend

```bash
cd frontend
npm update
docker-compose build frontend
docker-compose up -d frontend
```

### Atualizar dependências do Backend

```bash
cd backend
npm update
docker-compose build backend
docker-compose up -d backend
```

### Verificar saúde dos containers

```bash
docker ps
```

Verifique se o status está **Up** e **healthy**.

### Limpar Docker (liberar espaço)

```bash
# Remover imagens não utilizadas
docker image prune -a

# Remover volumes órfãos
docker volume prune

# Limpar tudo (CUIDADO!)
docker system prune -a
```

---

## 🚨 Troubleshooting

### Problema: Container não inicia

**Solução:**
```bash
docker-compose logs <nome-do-container>
```

Verifique os logs para identificar o erro.

### Problema: Erro "port already in use"

**Solução:**
```bash
# Ver o que está usando a porta 80
sudo lsof -i :80

# Parar o processo ou mudar a porta no docker-compose.yml
```

### Problema: Banco de dados não conecta

**Solução:**
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres

# Recriar o container
docker-compose down
docker-compose up -d
```

### Problema: Mudanças no código não aparecem

**Solução:**
```bash
# Rebuild dos containers
docker-compose build
docker-compose up -d
```

### Problema: Espaço em disco cheio

**Solução:**
```bash
# Verificar uso do Docker
docker system df

# Limpar imagens antigas
docker image prune -a

# Verificar tamanho dos backups
du -sh backups/

# Remover backups antigos manualmente
rm backups/khaiju_backup_20230101_*.sql.gz
```

### Problema: Performance lenta

**Verificações:**
1. Recursos disponíveis: `docker stats`
2. Logs de erro: `docker-compose logs`
3. Espaço em disco: `df -h`

**Soluções:**
- Aumentar recursos do Docker (Settings > Resources)
- Otimizar queries do banco
- Limpar dados antigos

---

## 📊 Monitoramento

### Ver uso de recursos em tempo real

```bash
docker stats
```

### Verificar logs em tempo real

```bash
docker-compose logs -f --tail=100
```

### Health Check manual

```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost/
```

---

## 🔐 Segurança

### Boas práticas implementadas:

✅ Senhas armazenadas com bcrypt  
✅ JWT para autenticação  
✅ CORS configurado  
✅ Variáveis de ambiente para secrets  
✅ PostgreSQL com senha forte  
✅ Rede isolada do Docker  

### Recomendações adicionais:

1. **Altere as senhas padrão** no arquivo `.env`
2. **Não exponha portas** desnecessárias (3001, 5432) para fora do servidor
3. **Configure firewall** no servidor:
   ```bash
   # Permitir apenas porta 80 (HTTP)
   sudo ufw allow 80/tcp
   sudo ufw enable
   ```
4. **Backups regulares** e armazenamento em local seguro
5. **Atualize o sistema** regularmente

---

## 📝 Notas Importantes

### Dados Persistentes

Os dados do PostgreSQL são armazenados em um **volume Docker persistente** chamado `khaiju_postgres_data`.

Mesmo se você rodar `docker-compose down`, os dados **NÃO serão perdidos**.

Para remover os dados completamente:
```bash
docker-compose down -v
```
⚠️ **Faça backup antes!**

### Primeiro Acesso

Na primeira inicialização:
1. O banco de dados será criado automaticamente
2. As migrations do Prisma serão aplicadas
3. Um usuário admin pode ser criado manualmente via API

### Portas Utilizadas

- **80** - Frontend (NGINX)
- **3001** - Backend API (exposta apenas para debug)
- **5432** - PostgreSQL (exposta apenas para admin)

Em produção, recomenda-se expor **apenas a porta 80**.

---

## 👨‍💻 Desenvolvido com

- ❤️ Arquitetura profissional
- 🎨 Design System luxury fintech dark
- 🐳 Docker para deploy simplificado
- 📊 Best practices em React e Node.js
- 🔒 Segurança em mente

---

## 📞 Suporte

Para questões técnicas ou problemas:

1. Verifique a seção [Troubleshooting](#troubleshooting)
2. Consulte os logs: `docker-compose logs`
3. Verifique issues conhecidas na documentação

---

## 📜 Licença

© 2024 Khaiju - Sistema Financeiro Empresarial  
Todos os direitos reservados - Uso interno apenas

---

**Versão:** 1.0.0  
**Última atualização:** Abril 2024

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Configure
cp .env.example .env
nano .env  # Altere as senhas

# 2. Inicie
docker-compose up -d

# 3. Acesse
http://localhost  # No servidor
http://IP_DO_SERVIDOR  # Em outros PCs

# 4. Backup
./scripts/backup.sh
```

✅ Pronto para uso em ambiente empresarial!
