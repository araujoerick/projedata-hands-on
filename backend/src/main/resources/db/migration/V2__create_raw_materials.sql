CREATE TABLE raw_materials (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    stock_quantity DECIMAL(15,4) NOT NULL DEFAULT 0
);
