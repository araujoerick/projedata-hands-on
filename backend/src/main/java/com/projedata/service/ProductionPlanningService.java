package com.projedata.service;

import com.projedata.dto.ProductionSuggestionResponse;
import com.projedata.dto.ProductionSuggestionResponse.SuggestionItem;
import com.projedata.entity.Product;
import com.projedata.entity.ProductRawMaterial;
import com.projedata.entity.RawMaterial;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class ProductionPlanningService {

    public ProductionSuggestionResponse suggest() {
        // Step 1: fetch all products ordered by value DESC
        List<Product> products = Product.find("ORDER BY value DESC").list();

        // Step 2: build stock map rawMaterialId -> available quantity
        Map<Long, BigDecimal> stockMap = new HashMap<>();
        for (RawMaterial rm : RawMaterial.<RawMaterial>listAll()) {
            stockMap.put(rm.id, rm.stockQuantity);
        }

        // Step 3: greedy allocation
        List<SuggestionItem> suggestions = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (Product product : products) {
            if (product.rawMaterials.isEmpty()) {
                continue;
            }

            // Step 3a/b: calculate min producible quantity across all BOM items
            long qty = Long.MAX_VALUE;
            for (ProductRawMaterial bom : product.rawMaterials) {
                BigDecimal available = stockMap.getOrDefault(bom.rawMaterial.id, BigDecimal.ZERO);
                long producible = available.divideToIntegralValue(bom.requiredQuantity).longValue();
                qty = Math.min(qty, producible);
            }

            if (qty == Long.MAX_VALUE) {
                qty = 0;
            }

            // Step 3c: deduct from stock only if something can be produced
            if (qty > 0) {
                for (ProductRawMaterial bom : product.rawMaterials) {
                    BigDecimal used = bom.requiredQuantity.multiply(BigDecimal.valueOf(qty));
                    stockMap.merge(bom.rawMaterial.id, used, BigDecimal::subtract);
                }
            }

            // Build suggestion item
            BigDecimal totalValue = product.value.multiply(BigDecimal.valueOf(qty));
            grandTotal = grandTotal.add(totalValue);

            SuggestionItem item = new SuggestionItem();
            item.productId = product.id;
            item.productName = product.name;
            item.productValue = product.value;
            item.producibleQuantity = qty;
            item.totalValue = totalValue;
            suggestions.add(item);
        }

        ProductionSuggestionResponse response = new ProductionSuggestionResponse();
        response.suggestions = suggestions;
        response.grandTotalValue = grandTotal;
        return response;
    }
}
