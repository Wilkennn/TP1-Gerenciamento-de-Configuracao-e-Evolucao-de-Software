# Library API - TP1 Gerência de Configuração e Evolução de Software

Este projeto apresenta uma API RESTful para o gerenciamento de uma
biblioteca, desenvolvida como parte do **Trabalho Prático 1** da
disciplina de **Gerência de Configuração e Evolução de Software**.

O sistema permite o cadastro de usuários e livros, além de gerenciar
empréstimos com validações complexas de regras de negócio
(disponibilidade, datas de devolução e multas).

------------------------------------------------------------------------

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna e robusta:

-   **Linguagem:** TypeScript / Node.js (v20)
-   **Framework Web:** Express
-   **Banco de Dados:** MySQL 8.0
-   **ORM:** Prisma (v5.22.0)
-   **Infraestrutura:** Docker & Docker Compose
-   **Testes:** Jest & Supertest
-   **CI/CD:** Semaphore CI,

------------------------------------------------------------------------

## 📋 Pré-requisitos

Para executar este projeto localmente, instale:

-   Docker e Docker Compose\
-   Node.js 20+\
-   Git

------------------------------------------------------------------------

## 🛠️ Passo a Passo de Instalação e Execução

### 1. Clonar o Repositório

    git clone <URL_DO_SEU_REPOSITORIO>
    cd library-api
    npm install

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` deve conter:

    DATABASE_URL="mysql://root:root@localhost:3307/library_db"

### 3. Subir a Infraestrutura (Banco de Dados)

    docker-compose up -d

Aguarde 20--30 segundos até o MySQL iniciar.

### 4. Criar as Tabelas (Migrations)

    npx prisma migrate dev --name init

### 5. Popular o Banco (Seed)

    npx prisma db seed

### 6. Iniciar a API

    npm run dev

Acesse: http://localhost:3000/books

------------------------------------------------------------------------

## ✅ Testes Automatizados

Rodar todos os testes:

    npm test

Cobertura de código:

    npm run test:cov

------------------------------------------------------------------------

## 🔄 Integração Contínua (CI/CD)

- Pipeline automatizado no Semaphore CI, executando:
- Build & Test
- Ambiente Docker efêmero
- Testes automatizados
- Deploy no Docker Hub

------------------------------------------------------------------------
##  🐳 Rodar versão de produção

``` bash
docker run -p 3000:3000 wilkenn/library-api:latest
```

------------------------------------------------------------------------

## 🏛️ Arquitetura do Projeto

-   **src/controllers:** Recebe requisições e valida entradas\
-   **src/services:** Regras de negócio\
-   **src/repositories:** Acesso a dados (Repository Pattern)\
-   **src/dtos:** Data Transfer Objects\
-   **src/database:** Configuração do Prisma e Seed

------------------------------------------------------------------------

## 🔒 Governança e Contribuição

-   Conventional Commits (`feat:`, `fix:`, `docs:`...)\
-   Husky + Commitlint
-   Branch `main` protegida\
-   Pull Requests com revisão obrigatória\
-   Testes obrigatórios para novas funcionalidades
- Merge somente com testes verdes e aprovação
