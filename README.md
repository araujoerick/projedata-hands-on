# Projedata — Stock Control System

Sistema de controle de estoque de matérias-primas e produtos para uma indústria, com planejamento de produção baseado em disponibilidade de estoque.

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | Quarkus 3 + RESTEasy Reactive + Hibernate Panache |
| Frontend | React 19 + Redux Toolkit + TypeScript + Vite |
| Banco de dados | PostgreSQL 16 |
| Migrations | Flyway |
| Estilo | Tailwind CSS + Inter |
| Infra dev | Docker Compose |

## Funcionalidades

- **Raw Materials** — CRUD de matérias-primas com controle de estoque e badges de status (healthy / low / out)
- **Products & BOM** — CRUD de produtos com gerenciamento de Bill of Materials (lista de materiais por produto)
- **Production Planning** — cálculo greedy de produção sugerida com base no estoque disponível (prioriza produtos de maior valor)

## Estrutura do repositório

```
projedata/
├── backend/          # API Quarkus (Java 21)
│   └── src/main/java/com/projedata/
│       ├── entity/   # Entidades JPA (Panache)
│       ├── dto/      # Request/Response DTOs
│       ├── service/  # Lógica de negócio
│       └── resource/ # Endpoints REST
├── frontend/         # SPA React + TypeScript
│   └── src/
│       ├── api/      # Clientes Axios
│       ├── store/    # Redux slices
│       ├── types/    # Tipos TypeScript
│       ├── components/
│       └── pages/
├── docker-compose.yml       # PostgreSQL para desenvolvimento
├── docker-compose.prod.yml  # Stack completa para produção
└── .env.example             # Variáveis de ambiente necessárias
```

## Como rodar localmente

### Pré-requisitos

- Docker + Docker Compose
- Java 21
- Maven 3.9+
- Node 20+

### 1. Banco de dados

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
./mvnw quarkus:dev
```

API disponível em `http://localhost:8080`
Swagger UI em `http://localhost:8080/q/swagger-ui`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:5173`

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste os valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `POSTGRES_DB` | Nome do banco |
| `POSTGRES_USER` | Usuário do banco |
| `POSTGRES_PASSWORD` | Senha do banco |
| `CORS_ORIGINS` | Origem permitida no CORS (ex.: `http://localhost:5173`) |
