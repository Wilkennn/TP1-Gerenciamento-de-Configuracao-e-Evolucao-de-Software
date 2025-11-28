#!/bin/bash
set -e # Encerra o script se qualquer comando der erro

echo "🚀 Iniciando Deploy para o Docker Hub..."

# 1. Login no Docker Hub usando as variáveis do Travis
# O flag --password-stdin é o jeito seguro de passar a senha sem mostrar no log
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin

# 2. Definir o nome da imagem
# Ex: wilkenmoreira/library-api
IMAGE_TAG="$DOCKER_USERNAME/library-api:latest"

echo "📦 Construindo a imagem Docker: $IMAGE_TAG"
docker build -t $IMAGE_TAG .

echo "⬆️  Enviando a imagem para o Docker Hub..."
docker push $IMAGE_TAG

echo "✅ Deploy realizado com sucesso!"
echo "A imagem está disponível em: https://hub.docker.com/r/$DOCKER_USERNAME/library-api"