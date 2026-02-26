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

## Testes

O projeto usa **Vitest** + **Testing Library** + **jsdom**.

```bash
npm test          # executa todos os testes uma vez
npm run test:watch  # modo watch (re-executa ao salvar)
```

### Cobertura

| Arquivo | Tipo | Casos de teste |
|---|---|---|
| `store/rawMaterialsSlice.test.ts` | Redux slice | Loading ao buscar; preenchimento da lista no fulfilled; erro no rejected; criação adiciona item à lista; atualização substitui item; exclusão remove item por ID |
| `store/productionPlanningSlice.test.ts` | Redux slice | Estado inicial nulo; loading ao buscar; dados preenchidos no fulfilled; erro no rejected; grandTotalValue reflete a soma correta |
| `components/StatusBadge.test.tsx` | Componente | Badge "Sem estoque" (qty = 0); "Estoque baixo" (1–9, incluindo valores de fronteira 1 e 9); "Normal" (≥ 10 e valores grandes); classes CSS de danger / warning / success |
| `components/Modal.test.tsx` | Componente | Renderiza título e conteúdo; fecha ao clicar no backdrop; não fecha ao clicar no conteúdo interno; fecha ao clicar no botão X; fecha ao pressionar Escape; não fecha em outras teclas |

### Configuração

- `vite.config.ts` — `environment: "jsdom"`, `globals: true`, `setupFiles: ["./src/test/setup.ts"]`
- `src/test/setup.ts` — importa `@testing-library/jest-dom` (matchers como `toBeInTheDocument`)
- `src/test/vitest.d.ts` — types globais do Vitest para TypeScript

## Build de produção

```bash
npm run build   # gera dist/
```
