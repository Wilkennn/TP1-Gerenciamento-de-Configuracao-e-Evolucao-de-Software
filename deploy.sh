#!/bin/bash
set -e

echo "🚀 Iniciando Build & Push..."

# Definir o nome da imagem
IMAGE_TAG="$DOCKER_USERNAME/library-api:latest"

echo "📦 Construindo a imagem: $IMAGE_TAG"
# O build agora vai funcionar com o truque do Dockerfile
docker build -t $IMAGE_TAG .

echo "⬆️  Enviando para o Docker Hub..."
docker push $IMAGE_TAG

echo "✅ Deploy realizado com sucesso!"