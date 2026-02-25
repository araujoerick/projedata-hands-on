package com.projedata.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product extends PanacheEntity {

    @Column(nullable = false)
    public String name;

    @Column(nullable = false, precision = 15, scale = 2)
    public BigDecimal value;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<ProductRawMaterial> rawMaterials = new ArrayList<>();
}
