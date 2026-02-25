package com.projedata.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "raw_materials")
public class RawMaterial extends PanacheEntityBase {

    @Id
    @SequenceGenerator(name = "rawMaterialsSeq", sequenceName = "raw_materials_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rawMaterialsSeq")
    public Long id;

    @Column(nullable = false)
    public String name;

    @Column(name = "stock_quantity", nullable = false, precision = 15, scale = 4)
    public BigDecimal stockQuantity;
}
