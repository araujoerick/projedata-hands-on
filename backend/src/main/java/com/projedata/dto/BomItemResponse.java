package com.projedata.dto;

import com.projedata.entity.ProductRawMaterial;

import java.math.BigDecimal;

public class BomItemResponse {

    public Long rawMaterialId;
    public String rawMaterialName;
    public BigDecimal requiredQuantity;

    public static BomItemResponse from(ProductRawMaterial entity) {
        BomItemResponse dto = new BomItemResponse();
        dto.rawMaterialId = entity.rawMaterial.id;
        dto.rawMaterialName = entity.rawMaterial.name;
        dto.requiredQuantity = entity.requiredQuantity;
        return dto;
    }
}
