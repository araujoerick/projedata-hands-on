package com.projedata.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "product_raw_materials")
public class ProductRawMaterial extends PanacheEntityBase {

    @EmbeddedId
    public ProductRawMaterialId id = new ProductRawMaterialId();

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    public Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("rawMaterialId")
    @JoinColumn(name = "raw_material_id")
    public RawMaterial rawMaterial;

    @Column(name = "required_quantity", nullable = false, precision = 15, scale = 4)
    public BigDecimal requiredQuantity;
}
