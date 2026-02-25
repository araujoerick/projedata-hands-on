CREATE TABLE product_raw_materials (
    product_id        BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    raw_material_id   BIGINT NOT NULL REFERENCES raw_materials(id),
    required_quantity DECIMAL(15,4) NOT NULL,
    PRIMARY KEY (product_id, raw_material_id)
);
