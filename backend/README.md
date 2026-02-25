# Backend — Projedata

API REST para controle de estoque de matérias-primas e planejamento de produção.

**Stack:** Quarkus · RESTEasy Reactive · Hibernate Panache · PostgreSQL · Flyway

---

## Pré-requisitos

- Java 21
- Maven 3.9+
- Docker (para o banco)

---

## Como rodar

```bash
# 1. Subir o PostgreSQL
docker compose up -d

# 2. Iniciar o Quarkus em modo dev (hot reload)
./mvnw quarkus:dev
```

Swagger UI disponível em: `http://localhost:8080/q/swagger-ui`

---

## Variáveis de ambiente

Definidas em `src/main/resources/application.properties`:

| Variável | Padrão | Descrição |
|---|---|---|
| `QUARKUS_DATASOURCE_JDBC_URL` | `jdbc:postgresql://localhost:5432/projedata` | URL do banco |
| `QUARKUS_DATASOURCE_USERNAME` | `projedata` | Usuário do banco |
| `QUARKUS_DATASOURCE_PASSWORD` | `projedata` | Senha do banco |

---

## Estrutura de pacotes

```
src/main/java/com/projedata/
├── entity/                         # Entidades JPA (mapeamento do banco)
│   ├── Product.java
│   ├── RawMaterial.java
│   ├── ProductRawMaterial.java     # Tabela BOM com @EmbeddedId
│   └── ProductRawMaterialId.java   # Chave composta (productId + rawMaterialId)
│
├── dto/                            # Objetos de transferência (request/response)
│   ├── RawMaterialRequest.java
│   ├── RawMaterialResponse.java
│   ├── ProductRequest.java
│   ├── ProductResponse.java
│   ├── ProductDetailResponse.java  # Produto + lista de materiais (BOM)
│   ├── BomItemRequest.java
│   ├── BomItemResponse.java
│   └── ProductionSuggestionResponse.java
│
├── service/                        # Regras de negócio
│   ├── RawMaterialService.java
│   ├── ProductService.java         # Inclui operações de BOM
│   └── ProductionPlanningService.java  # Algoritmo greedy
│
└── resource/                       # Endpoints REST (JAX-RS)
    ├── RawMaterialResource.java
    ├── ProductResource.java        # Inclui sub-endpoints de BOM
    └── ProductionPlanningResource.java

src/main/resources/
├── application.properties
└── db/migration/
    ├── V1__create_products.sql
    ├── V2__create_raw_materials.sql
    └── V3__create_product_raw_materials.sql
```

---

## Endpoints

### Raw Materials — `/api/raw-materials`

| Método | Path | Descrição |
|---|---|---|
| GET | `/api/raw-materials` | Listar todos |
| GET | `/api/raw-materials/{id}` | Buscar por ID |
| POST | `/api/raw-materials` | Criar |
| PUT | `/api/raw-materials/{id}` | Atualizar |
| DELETE | `/api/raw-materials/{id}` | Excluir |

### Products — `/api/products`

| Método | Path | Descrição |
|---|---|---|
| GET | `/api/products` | Listar todos |
| GET | `/api/products/{id}` | Buscar por ID (inclui BOM) |
| POST | `/api/products` | Criar |
| PUT | `/api/products/{id}` | Atualizar |
| DELETE | `/api/products/{id}` | Excluir |

### BOM — `/api/products/{id}/raw-materials`

| Método | Path | Descrição |
|---|---|---|
| GET | `/api/products/{id}/raw-materials` | Listar materiais do produto |
| POST | `/api/products/{id}/raw-materials` | Adicionar material ao produto |
| PUT | `/api/products/{id}/raw-materials/{rmId}` | Atualizar quantidade |
| DELETE | `/api/products/{id}/raw-materials/{rmId}` | Remover material |

### Production Planning — `/api/production-planning`

| Método | Path | Descrição |
|---|---|---|
| GET | `/api/production-planning/suggestions` | Calcular produção sugerida |
