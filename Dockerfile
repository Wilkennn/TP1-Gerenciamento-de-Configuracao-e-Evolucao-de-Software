# Estágio 1: Build
# Usamos uma imagem Node completa para compilar o projeto
FROM node:20 AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de dependência primeiro (otimização de cache do Docker)
COPY package*.json ./
COPY prisma ./prisma/

# Instala as dependências (incluindo devDependencies para rodar o build)
RUN npm install

# Gera o cliente do Prisma
RUN npx prisma generate

# Copia o restante do código fonte
COPY . .

# Compila o TypeScript para JavaScript (gera a pasta dist)
RUN npm run build

# ---

# Estágio 2: Produção
# Usamos uma imagem "slim" (menor) apenas para rodar o app
FROM node:20-slim

# Instala bibliotecas necessárias para o Prisma rodar em imagens slim (OpenSSL)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

# Copia apenas os arquivos necessários do estágio de build
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

# Instala APENAS dependências de produção (ignora typescript, jest, etc.)
RUN npm install --production

# Garante que o Prisma Client está pronto no ambiente de produção
RUN npx prisma generate

# Expõe a porta que o Express vai usar
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/server.js"]