-- ============================================================
-- V4 — Seed data: simulates a small furniture/wood industry
-- ============================================================
-- Scenarios covered:
--   1. Shared raw materials between products (tests greedy priority)
--   2. Products ordered by value DESC get materials first
--   3. Out-of-stock materials (qty = 0)  → danger badge
--   4. Low-stock materials (qty < 10)    → warning badge
--   5. Healthy-stock materials (qty ≥ 10) → success badge
--   6. A product with no BOM (should be skipped by the algorithm)
--   7. A product whose BOM has a zero-stock material (cannot produce)
-- ============================================================

-- --------------------------------
-- Raw Materials (10 items)
-- --------------------------------
INSERT INTO raw_materials (name, stock_quantity) VALUES
  ('Pine Wood Plank',       120.0000),   -- id 1  | healthy
  ('Oak Wood Plank',         25.0000),   -- id 2  | healthy
  ('Steel Screw (100-pack)',  8.0000),   -- id 3  | low stock (< 10)
  ('Wood Glue (liters)',     15.5000),   -- id 4  | healthy
  ('Sandpaper Sheet',        50.0000),   -- id 5  | healthy
  ('Varnish (liters)',        6.5000),   -- id 6  | low stock
  ('Fabric (meters)',         0.0000),   -- id 7  | out of stock
  ('Foam Padding (kg)',       3.0000),   -- id 8  | low stock
  ('Glass Panel',            12.0000),   -- id 9  | healthy
  ('Steel Bracket',          40.0000);   -- id 10 | healthy

-- --------------------------------
-- Products (6 items)
-- --------------------------------
INSERT INTO products (name, value) VALUES
  ('Executive Oak Desk',    1250.00),  -- id 1 | highest value → priority 1
  ('Pine Bookshelf',         480.00),  -- id 2 | priority 2
  ('Coffee Table',           350.00),  -- id 3 | priority 3, shares Pine Wood with Bookshelf
  ('Upholstered Chair',      820.00),  -- id 4 | high value but needs Fabric (stock=0) → cannot produce
  ('Display Cabinet',        950.00),  -- id 5 | priority after Desk, uses Glass + Oak
  ('Prototype Widget',        99.00);  -- id 6 | NO BOM → skipped by algorithm

-- --------------------------------
-- BOM — Bill of Materials
-- --------------------------------

-- Product 1: Executive Oak Desk (R$ 1250.00)
--   Needs: 4 Oak Planks + 2 Screw packs + 1L Glue + 2 Sandpaper + 1.5L Varnish + 4 Brackets
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (1, 2,  4.0000),   -- Oak Wood Plank
  (1, 3,  2.0000),   -- Steel Screw
  (1, 4,  1.0000),   -- Wood Glue
  (1, 5,  2.0000),   -- Sandpaper
  (1, 6,  1.5000),   -- Varnish
  (1, 10, 4.0000);   -- Steel Bracket

-- Expected: floor(25/4)=6, floor(8/2)=4, floor(15.5/1)=15, floor(50/2)=25, floor(6.5/1.5)=4, floor(40/4)=10
-- min = 4 units → total R$ 5000.00
-- After: Oak=25-16=9, Screw=8-8=0, Glue=15.5-4=11.5, Sandpaper=50-8=42, Varnish=6.5-6=0.5, Bracket=40-16=24

-- Product 5: Display Cabinet (R$ 950.00)
--   Needs: 3 Oak Planks + 2 Glass Panels + 1 Screw pack + 0.5L Varnish + 2 Brackets
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (5, 2,  3.0000),   -- Oak Wood Plank
  (5, 9,  2.0000),   -- Glass Panel
  (5, 3,  1.0000),   -- Steel Screw
  (5, 6,  0.5000),   -- Varnish
  (5, 10, 2.0000);   -- Steel Bracket

-- After Desk: Oak=9, Screw=0, Varnish=0.5, Glass=12, Bracket=24
-- floor(9/3)=3, floor(12/2)=6, floor(0/1)=0 → Screw=0 → min=0 → CANNOT PRODUCE

-- Product 4: Upholstered Chair (R$ 820.00)
--   Needs: 2 Pine Planks + 3m Fabric + 2kg Foam + 1 Screw pack
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (4, 1,  2.0000),   -- Pine Wood Plank
  (4, 7,  3.0000),   -- Fabric (stock = 0!)
  (4, 8,  2.0000),   -- Foam Padding
  (4, 3,  1.0000);   -- Steel Screw

-- Fabric = 0 → CANNOT PRODUCE regardless of other stocks

-- Product 2: Pine Bookshelf (R$ 480.00)
--   Needs: 6 Pine Planks + 1 Screw pack + 0.5L Glue + 3 Sandpaper + 1L Varnish + 6 Brackets
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (2, 1,  6.0000),   -- Pine Wood Plank
  (2, 3,  1.0000),   -- Steel Screw
  (2, 4,  0.5000),   -- Wood Glue
  (2, 5,  3.0000),   -- Sandpaper
  (2, 6,  1.0000),   -- Varnish
  (2, 10, 6.0000);   -- Steel Bracket

-- After Desk: Pine=120, Screw=0, Glue=11.5, Sandpaper=42, Varnish=0.5, Bracket=24
-- Screw=0 → floor(0/1)=0 → CANNOT PRODUCE

-- Product 3: Coffee Table (R$ 350.00)
--   Needs: 3 Pine Planks + 1 Screw pack + 0.5L Glue + 1 Sandpaper + 4 Brackets
INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES
  (3, 1,  3.0000),   -- Pine Wood Plank
  (3, 3,  1.0000),   -- Steel Screw
  (3, 4,  0.5000),   -- Wood Glue
  (3, 5,  1.0000),   -- Sandpaper
  (3, 10, 4.0000);   -- Steel Bracket

-- After Desk: Pine=120, Screw=0, Glue=11.5, Sandpaper=42, Bracket=24
-- Screw=0 → floor(0/1)=0 → CANNOT PRODUCE

-- Product 6: Prototype Widget (R$ 99.00)
--   NO BOM entries → algorithm skips it

-- ============================================================
-- Expected Production Planning Result (greedy, value DESC):
--
-- 1. Executive Oak Desk  → 4 units × R$ 1,250.00 = R$ 5,000.00
--    (Screws become bottleneck at 4 units, consumes all 8 packs)
--
-- 2. Display Cabinet     → 0 (Screws depleted)
-- 3. Upholstered Chair   → 0 (Fabric = 0)
-- 4. Pine Bookshelf      → 0 (Screws depleted)
-- 5. Coffee Table        → 0 (Screws depleted)
-- 6. Prototype Widget    → skipped (no BOM)
--
-- Grand Total: R$ 5,000.00
--
-- UI observations:
--   - Stats cards: 10 total, 5 healthy, 3 low, 2 out-of-stock (Fabric + after deductions)
--   - Only 1 product line in suggestions table
--   - Grand total card: R$ 5.000,00
-- ============================================================
