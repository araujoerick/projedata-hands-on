package com.projedata.dto;

import com.projedata.entity.RawMaterial;

import java.math.BigDecimal;

public class RawMaterialResponse {

    public Long id;
    public String name;
    public BigDecimal stockQuantity;

    public static RawMaterialResponse from(RawMaterial entity) {
        RawMaterialResponse dto = new RawMaterialResponse();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.stockQuantity = entity.stockQuantity;
        return dto;
    }
}
