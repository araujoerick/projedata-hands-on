package com.projedata.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProductRawMaterialId implements Serializable {

    @Column(name = "product_id")
    public Long productId;

    @Column(name = "raw_material_id")
    public Long rawMaterialId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductRawMaterialId other)) return false;
        return Objects.equals(productId, other.productId) &&
               Objects.equals(rawMaterialId, other.rawMaterialId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(productId, rawMaterialId);
    }
}
