# Frontend — Projedata

SPA construída com React 19, Redux Toolkit, TypeScript e Vite.

## Pré-requisitos

- Node 20+
- npm 10+

## Como rodar

```bash
npm install
npm run dev
```

App disponível em `http://localhost:5173`.

## Variável de ambiente

Crie um arquivo `.env` na raiz de `/frontend`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> O Vite substitui `import.meta.env.VITE_*` em **tempo de build**, por isso o valor precisa estar disponível antes de `npm run build`.

## Estrutura de pastas

```
src/
├── api/
│   ├── client.ts                  # Instância Axios com baseURL
│   ├── rawMaterialsApi.ts
│   ├── productsApi.ts
│   └── productionPlanningApi.ts
├── store/
│   ├── index.ts                   # Configuração do Redux store
│   ├── rawMaterialsSlice.ts
│   ├── productsSlice.ts
│   └── productionPlanningSlice.ts
├── types/
│   ├── rawMaterial.ts
│   ├── product.ts
│   └── productionPlanning.ts
├── components/
│   ├── Layout.tsx                 # Sidebar + outlet (responsivo)
│   ├── StatusBadge.tsx
│   ├── Modal.tsx
│   └── ConfirmDialog.tsx
└── pages/
    ├── RawMaterialsPage.tsx
    ├── ProductsPage.tsx
    └── ProductionPlanningPage.tsx
```

## Telas

| Tela | Rota | Descrição |
|---|---|---|
| Raw Materials | `/raw-materials` | CRUD de matérias-primas com cards de stats e badge de status de estoque |
| Products & BOM | `/products` | CRUD de produtos com painel BOM expansível por produto |
| Production Planning | `/production` | Cálculo de produção sugerida com tabela de resultados e grand total |

## Build de produção

```bash
npm run build   # gera dist/
```
