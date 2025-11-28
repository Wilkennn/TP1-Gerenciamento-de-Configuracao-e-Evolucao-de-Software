# Estágio 1: Build
FROM node:20 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# Gera o prisma (usando banco dummy para passar no build)
RUN DATABASE_URL="mysql://dummy:dummy@localhost:3306/db" npx prisma generate

COPY . .

RUN npm run build

# Estágio 2: Produção
FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# --- CORREÇÃO AQUI ---
# Adicionamos --ignore-scripts para ele não tentar rodar o Husky
RUN npm install --production --ignore-scripts
# ---------------------

# Gera o prisma de produção
RUN DATABASE_URL="mysql://dummy:dummy@localhost:3306/db" npx prisma generate

EXPOSE 3000

CMD ["node", "dist/server.js"]