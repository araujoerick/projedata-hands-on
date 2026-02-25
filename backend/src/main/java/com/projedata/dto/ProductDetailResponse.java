package com.projedata.dto;

import com.projedata.entity.Product;

import java.math.BigDecimal;
import java.util.List;

public class ProductDetailResponse {

    public Long id;
    public String name;
    public BigDecimal value;
    public List<BomItemResponse> rawMaterials;

    public static ProductDetailResponse from(Product entity) {
        ProductDetailResponse dto = new ProductDetailResponse();
        dto.id = entity.id;
        dto.name = entity.name;
        dto.value = entity.value;
        dto.rawMaterials = entity.rawMaterials.stream()
                .map(BomItemResponse::from)
                .toList();
        return dto;
    }
}
