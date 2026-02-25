package com.projedata.service;

import com.projedata.dto.RawMaterialRequest;
import com.projedata.dto.RawMaterialResponse;
import com.projedata.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class RawMaterialService {

    public List<RawMaterialResponse> list() {
        return RawMaterial.<RawMaterial>listAll()
                .stream()
                .map(RawMaterialResponse::from)
                .toList();
    }

    public RawMaterialResponse findById(Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        return RawMaterialResponse.from(entity);
    }

    @Transactional
    public RawMaterialResponse create(RawMaterialRequest request) {
        RawMaterial entity = new RawMaterial();
        entity.name = request.name;
        entity.stockQuantity = request.stockQuantity;
        entity.persist();
        return RawMaterialResponse.from(entity);
    }

    @Transactional
    public RawMaterialResponse update(Long id, RawMaterialRequest request) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        entity.name = request.name;
        entity.stockQuantity = request.stockQuantity;
        return RawMaterialResponse.from(entity);
    }

    @Transactional
    public void delete(Long id) {
        RawMaterial entity = RawMaterial.findById(id);
        if (entity == null) {
            throw new NotFoundException("Raw material not found: " + id);
        }
        entity.delete();
    }
}
