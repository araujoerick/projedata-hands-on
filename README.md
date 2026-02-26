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

## Algoritmo de Planejamento de Produção

O sistema implementa um planejamento do tipo **MRP simplificado** usando uma estratégia greedy (gulosa) orientada a valor:

1. Todos os produtos são ordenados por valor unitário de forma decrescente
2. Para cada produto, o sistema calcula quantas unidades podem ser fabricadas com o estoque virtual disponível:
   ```
   quantidade = floor( min( estoque_disponível / quantidade_necessária ) )
                       para cada matéria-prima do BOM do produto
   ```
3. Se a quantidade for maior que zero, os insumos são deduzidos do estoque
4. O processo repete para o próximo produto com o saldo restante

**Exemplo:** se Parafuso (estoque = 8) é usado por dois produtos — Escrivaninha (precisa de 2 por unidade) e Estante (precisa de 1 por unidade) — o sistema reserva os parafusos primeiro para a Escrivaninha por ter maior valor. Após produzir 4 unidades, o estoque de parafusos chega a zero e a Estante não pode mais ser fabricada.

A resposta inclui todos os produtos do catálogo: os que podem ser produzidos com a quantidade calculada, e os bloqueados (quantidade = 0) indicando insuficiência de estoque. O valor total considera apenas os itens efetivamente produzíveis.

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

## Testes

### Backend

```bash
cd backend
./mvnw test
```

Usa **JUnit 5 + QuarkusTest + REST Assured + Mockito**. O banco de teste é um **PostgreSQL real provisionado automaticamente via Testcontainers** (requer Docker). Cobre testes unitários do algoritmo greedy e testes de integração REST para os endpoints de matérias-primas e planejamento de produção.

### Frontend

```bash
cd frontend
npm test
```

Usa **Vitest + Testing Library + jsdom**. Cobre os Redux slices (`rawMaterials`, `productionPlanning`) e os componentes `StatusBadge` e `Modal`.

---

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

---

## Arquitetura de produção

```
┌─────────────────────────────────────────────────────────┐
│                        Internet                         │
└───────────────┬─────────────────────┬───────────────────┘
                │                     │
        HTTPS (:443)            HTTPS (:443)
                │                     │
   ┌────────────▼──────────┐  ┌───────▼──────────────────┐
   │  Vercel (CDN global)  │  │  Nginx Proxy Manager     │
   │  frontend (React SPA) │  │  Let's Encrypt TLS       │
   └───────────────────────┘  └───────┬──────────────────┘
                                      │ HTTP (:8080) interno
                               ┌──────▼──────────────────┐
                               │  VPS                    │
                               │  ┌───────────────────┐  │
                               │  │ projedata-backend │  │
                               │  │ (Quarkus :8080)   │  │
                               │  └────────┬──────────┘  │
                               │           │              │
                               │  ┌────────▼──────────┐  │
                               │  │ postgres:5432     │  │
                               │  │ (volume persistente) │
                               │  └───────────────────┘  │
                               └─────────────────────────┘
```

### Componentes

| Componente | Onde roda | Tecnologia |
|---|---|---|
| Frontend | Vercel | CDN global, deploy automático via Git |
| Backend | VPS (Docker) | Quarkus em container |
| Banco de dados | VPS (Docker) | PostgreSQL com volume persistente |
| Proxy reverso / TLS | VPS | Nginx Proxy Manager + Let's Encrypt |

### Endpoints de produção

- **Frontend:** https://projedata-erick-araujo.vercel.app/
- **API:** `https://api-projedata.aditivasolucoes.com.br`
- **Swagger UI:** `http://api-projedata.aditivasolucoes.com.br/q/swagger-ui/`

### Como o deploy funciona (CI/CD)

O workflow `.github/workflows/deploy.yml` é disparado em todo push para `main` (ou manualmente pela aba Actions):

```
push → main
  └── job: test
        ├── ./mvnw test          (backend — PostgreSQL via Testcontainers)
        └── npm test -- --run    (frontend — Vitest + jsdom)
              │
              └── (se passou) job: deploy
                    └── SSH na VPS
                          ├── git pull origin main
                          └── docker compose up -d --build backend
```

O deploy na VPS só ocorre se **todos os testes passarem**.
