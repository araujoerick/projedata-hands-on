package com.projedata.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(name = "stock_quantity", nullable = false, precision = 15, scale = 4)
    public BigDecimal stockQuantity;
}
