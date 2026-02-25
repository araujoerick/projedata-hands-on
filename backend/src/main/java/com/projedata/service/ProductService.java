package com.projedata.service;

import com.projedata.dto.ProductRequest;
import com.projedata.dto.ProductResponse;
import com.projedata.entity.Product;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.util.List;

@ApplicationScoped
public class ProductService {

    public List<ProductResponse> list() {
        return Product.<Product>listAll()
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse findById(Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        return ProductResponse.from(entity);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product entity = new Product();
        entity.name = request.name;
        entity.value = request.value;
        entity.persist();
        return ProductResponse.from(entity);
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        entity.name = request.name;
        entity.value = request.value;
        return ProductResponse.from(entity);
    }

    @Transactional
    public void delete(Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        entity.delete();
    }
}
