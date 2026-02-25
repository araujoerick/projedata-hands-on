package com.projedata.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class BomItemRequest {

    @NotNull
    public Long rawMaterialId;

    @NotNull
    @DecimalMin("0.0001")
    public BigDecimal requiredQuantity;
}
