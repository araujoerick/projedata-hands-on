package com.projedata.service;

import com.projedata.dto.BomItemRequest;
import com.projedata.dto.BomItemResponse;
import com.projedata.dto.ProductDetailResponse;
import com.projedata.dto.ProductRequest;
import com.projedata.dto.ProductResponse;
import com.projedata.entity.Product;
import com.projedata.entity.ProductRawMaterial;
import com.projedata.entity.ProductRawMaterialId;
import com.projedata.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
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

    public ProductDetailResponse findById(Long id) {
        Product entity = Product.findById(id);
        if (entity == null) {
            throw new NotFoundException("Product not found: " + id);
        }
        return ProductDetailResponse.from(entity);
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

    // BOM operations

    public List<BomItemResponse> listBom(Long productId) {
        Product product = Product.findById(productId);
        if (product == null) {
            throw new NotFoundException("Product not found: " + productId);
        }
        return product.rawMaterials.stream()
                .map(BomItemResponse::from)
                .toList();
    }

    @Transactional
    public BomItemResponse addBomItem(Long productId, BomItemRequest request) {
        Product product = Product.findById(productId);
        if (product == null) {
            throw new NotFoundException("Product not found: " + productId);
        }
        RawMaterial rawMaterial = RawMaterial.findById(request.rawMaterialId);
        if (rawMaterial == null) {
            throw new NotFoundException("Raw material not found: " + request.rawMaterialId);
        }

        boolean alreadyExists = product.rawMaterials.stream()
                .anyMatch(item -> item.rawMaterial.id.equals(request.rawMaterialId));
        if (alreadyExists) {
            throw new BadRequestException("Raw material already in BOM for this product");
        }

        ProductRawMaterial item = new ProductRawMaterial();
        item.id = new ProductRawMaterialId();
        item.id.productId = productId;
        item.id.rawMaterialId = request.rawMaterialId;
        item.product = product;
        item.rawMaterial = rawMaterial;
        item.requiredQuantity = request.requiredQuantity;
        item.persist();

        return BomItemResponse.from(item);
    }

    @Transactional
    public BomItemResponse updateBomItem(Long productId, Long rawMaterialId, BomItemRequest request) {
        ProductRawMaterialId pk = new ProductRawMaterialId();
        pk.productId = productId;
        pk.rawMaterialId = rawMaterialId;

        ProductRawMaterial item = ProductRawMaterial.findById(pk);
        if (item == null) {
            throw new NotFoundException("BOM item not found");
        }
        item.requiredQuantity = request.requiredQuantity;
        return BomItemResponse.from(item);
    }

    @Transactional
    public void deleteBomItem(Long productId, Long rawMaterialId) {
        ProductRawMaterialId pk = new ProductRawMaterialId();
        pk.productId = productId;
        pk.rawMaterialId = rawMaterialId;

        ProductRawMaterial item = ProductRawMaterial.findById(pk);
        if (item == null) {
            throw new NotFoundException("BOM item not found");
        }
        item.delete();
    }
}
