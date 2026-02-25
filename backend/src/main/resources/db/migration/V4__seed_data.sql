-- ============================================================
-- V4 — Seed data: simula uma indústria moveleira brasileira
-- ============================================================
-- Cenários cobertos:
--   1. Matéria-prima compartilhada entre produtos (testa prioridade greedy)
--   2. Produtos ordenados por valor DESC recebem insumos primeiro
--   3. Matéria-prima com estoque zerado (qty = 0)  → badge "Sem estoque"
--   4. Matéria-prima com estoque baixo (qty < 10)  → badge "Estoque baixo"
--   5. Matéria-prima com estoque normal (qty ≥ 10) → badge "Normal"
--   6. Produto sem BOM (ignorado pelo algoritmo)
--   7. Produto cujo BOM tem insumo zerado (não pode ser produzido)
-- ============================================================

-- --------------------------------
-- Matérias-primas (10 itens)
-- --------------------------------
INSERT INTO raw_materials (name, stock_quantity) VALUES
  ('Prancha de Pinus',         120.0000),   -- id 1  | normal
  ('Prancha de Carvalho',       25.0000),   -- id 2  | normal
  ('Parafuso (cento)',           8.0000),   -- id 3  | estoque baixo (< 10)
  ('Cola para Madeira (litro)', 15.5000),   -- id 4  | normal
  ('Folha de Lixa',             50.0000),   -- id 5  | normal
  ('Verniz (litro)',             6.5000),   -- id 6  | estoque baixo
  ('Tecido (metro)',             0.0000),   -- id 7  | sem estoque
  ('Espuma (kg)',                3.0000),   -- id 8  | estoque baixo
  ('Painel de Vidro',           12.0000),   -- id 9  | normal
  ('Cantoneira de Aço',         40.0000);   -- id 10 | normal

-- --------------------------------
-- Produtos (6 itens)
-- --------------------------------
INSERT INTO products (name, value) VALUES
  ('Escrivaninha de Carvalho',  1250.00),  -- id 1 | maior valor → prioridade 1
  ('Estante de Pinus',           480.00),  -- id 2 | prioridade 4
  ('Mesa de Centro',             350.00),  -- id 3 | prioridade 5, compartilha Pinus
  ('Poltrona Estofada',          820.00),  -- id 4 | alto valor mas precisa de Tecido (zerado)
  ('Cristaleira com Vidro',      950.00),  -- id 5 | prioridade 2, usa Vidro + Carvalho
  ('Protótipo Interno',           99.00);  -- id 6 | SEM BOM → ignorado pelo algoritmo

-- --------------------------------
-- BOM — Composição dos Produtos
-- --------------------------------

-- Produto 1: Escrivaninha de Carvalho (R$ 1.250,00)
--   Precisa: 4 Pranchas de Carvalho + 2 centos de Parafuso + 1L Cola + 2 Lixas + 1,5L Verniz + 4 Cantoneiras
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (1, 2,  4.0000),   -- Prancha de Carvalho
  (1, 3,  2.0000),   -- Parafuso (cento)
  (1, 4,  1.0000),   -- Cola para Madeira
  (1, 5,  2.0000),   -- Folha de Lixa
  (1, 6,  1.5000),   -- Verniz
  (1, 10, 4.0000);   -- Cantoneira de Aço

-- Cálculo esperado:
--   floor(25/4)=6, floor(8/2)=4, floor(15,5/1)=15, floor(50/2)=25, floor(6,5/1,5)=4, floor(40/4)=10
--   mínimo = 4 unidades → total R$ 5.000,00
-- Após: Carvalho=9, Parafuso=0, Cola=11,5, Lixa=42, Verniz=0,5, Cantoneira=24

-- Produto 5: Cristaleira com Vidro (R$ 950,00)
--   Precisa: 3 Pranchas de Carvalho + 2 Painéis de Vidro + 1 cento Parafuso + 0,5L Verniz + 2 Cantoneiras
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (5, 2,  3.0000),   -- Prancha de Carvalho
  (5, 9,  2.0000),   -- Painel de Vidro
  (5, 3,  1.0000),   -- Parafuso (cento)
  (5, 6,  0.5000),   -- Verniz
  (5, 10, 2.0000);   -- Cantoneira de Aço

-- Após Escrivaninha: Carvalho=9, Parafuso=0, Verniz=0,5, Vidro=12, Cantoneira=24
-- floor(9/3)=3, floor(12/2)=6, floor(0/1)=0 → Parafuso=0 → NÃO PRODUZ

-- Produto 4: Poltrona Estofada (R$ 820,00)
--   Precisa: 2 Pinus + 3m Tecido + 2kg Espuma + 1 cento Parafuso
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (4, 1,  2.0000),   -- Prancha de Pinus
  (4, 7,  3.0000),   -- Tecido (zerado!)
  (4, 8,  2.0000),   -- Espuma
  (4, 3,  1.0000);   -- Parafuso (cento)

-- Tecido = 0 → NÃO PRODUZ independente dos outros estoques

-- Produto 2: Estante de Pinus (R$ 480,00)
--   Precisa: 6 Pinus + 1 cento Parafuso + 0,5L Cola + 3 Lixas + 1L Verniz + 6 Cantoneiras
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (2, 1,  6.0000),   -- Prancha de Pinus
  (2, 3,  1.0000),   -- Parafuso (cento)
  (2, 4,  0.5000),   -- Cola para Madeira
  (2, 5,  3.0000),   -- Folha de Lixa
  (2, 6,  1.0000),   -- Verniz
  (2, 10, 6.0000);   -- Cantoneira de Aço

-- Após Escrivaninha: Parafuso=0 → NÃO PRODUZ

-- Produto 3: Mesa de Centro (R$ 350,00)
--   Precisa: 3 Pinus + 1 cento Parafuso + 0,5L Cola + 1 Lixa + 4 Cantoneiras
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (3, 1,  3.0000),   -- Prancha de Pinus
  (3, 3,  1.0000),   -- Parafuso (cento)
  (3, 4,  0.5000),   -- Cola para Madeira
  (3, 5,  1.0000),   -- Folha de Lixa
  (3, 10, 4.0000);   -- Cantoneira de Aço

-- Após Escrivaninha: Parafuso=0 → NÃO PRODUZ

-- Produto 6: Protótipo Interno (R$ 99,00)
--   SEM itens no BOM → algoritmo ignora

-- ============================================================
-- Resultado esperado do Planejamento de Produção (greedy por valor DESC):
--
-- 1. Escrivaninha de Carvalho → 4 unid. × R$ 1.250,00 = R$ 5.000,00
--    (Parafuso é o gargalo: floor(8/2)=4; Verniz também: floor(6,5/1,5)=4)
--
-- 2. Cristaleira com Vidro    → 0 (Parafuso esgotado)
-- 3. Poltrona Estofada        → 0 (Tecido = 0)
-- 4. Estante de Pinus         → 0 (Parafuso esgotado)
-- 5. Mesa de Centro           → 0 (Parafuso esgotado)
-- 6. Protótipo Interno        → ignorado (sem BOM)
--
-- Total Geral: R$ 5.000,00
--
-- Badges esperados na tela de Matérias-primas:
--   Total=10 | Normal=5 | Estoque baixo=3 | Sem estoque=1 (Tecido)
--   (Parafuso e Verniz aparecem como "Estoque baixo" antes da produção)
-- ============================================================
