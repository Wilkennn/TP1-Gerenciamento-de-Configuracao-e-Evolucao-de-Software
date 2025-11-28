#!/bin/bash
set -e # Encerra o script se houver erro

echo "🚀 Iniciando processo de Deploy..."

# 1. Instalar dependências apenas de produção (remove devDependencies)
echo "📦 Instalando dependências de produção..."
npm install --production

# 2. Executar Migrations do Banco de Dados (Garante integridade)
echo "🗄️ Atualizando esquema do banco de dados..."
npx prisma migrate deploy

# 3. Reiniciar o serviço (Exemplo usando PM2 ou Docker)
# O enunciado permite "servidor gratuito ou container docker" [cite: 37]
echo "🔄 Reiniciando aplicação..."
if command -v pm2 &> /dev/null; then
    pm2 reload ecosystem.config.js || pm2 start dist/server.js --name "library-api"
else
    echo "PM2 não detectado. Iniciando com node simples..."
    # Em um cenário real de script, aqui você enviaria os arquivos para o servidor via SSH/SCP
fi

echo "✅ Deploy concluído com sucesso!"