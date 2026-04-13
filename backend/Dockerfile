# ────────────────────────────────────────────────────────────
# Khaiju Backend - Production Dockerfile
# ────────────────────────────────────────────────────────────

FROM node:20-alpine AS base

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install --production

# Copiar código fonte
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor porta
EXPOSE 3001

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
