package com.projedata.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RawMaterialRequest {

    @NotBlank
    public String name;

    @NotNull
    @DecimalMin("0.0")
    public BigDecimal stockQuantity;
}
