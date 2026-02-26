package com.projedata.service;

import com.projedata.dto.ProductionSuggestionResponse;
import com.projedata.entity.Product;
import com.projedata.entity.ProductRawMaterial;
import com.projedata.entity.ProductRawMaterialId;
import com.projedata.entity.RawMaterial;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@QuarkusTest
class ProductionPlanningServiceTest {

    @Inject
    ProductionPlanningService service;

    @BeforeEach
    @Transactional
    void cleanup() {
        ProductRawMaterial.deleteAll();
        Product.deleteAll();
        RawMaterial.deleteAll();
    }

    // --- Setup helpers: persist data in their own transaction ---

    @Transactional
    void setupProductNoBom() {
        Product p = new Product();
        p.name = "Protótipo";
        p.value = new BigDecimal("99.00");
        p.persist();
    }

    @Transactional
    void setupZeroStock() {
        RawMaterial rm = new RawMaterial();
        rm.name = "Tecido";
        rm.stockQuantity = BigDecimal.ZERO;
        rm.persist();

        Product p = new Product();
        p.name = "Poltrona";
        p.value = new BigDecimal("820.00");
        p.persist();

        ProductRawMaterial bom = new ProductRawMaterial();
        bom.id = new ProductRawMaterialId();
        bom.id.productId = p.id;
        bom.id.rawMaterialId = rm.id;
        bom.product = p;
        bom.rawMaterial = rm;
        bom.requiredQuantity = new BigDecimal("3.0000");
        bom.persist();
    }

    @Transactional
    void setupEnoughStock() {
        RawMaterial rm = new RawMaterial();
        rm.name = "Prancha de Pinus";
        rm.stockQuantity = new BigDecimal("12.0000");
        rm.persist();

        Product p = new Product();
        p.name = "Mesa";
        p.value = new BigDecimal("350.00");
        p.persist();

        ProductRawMaterial bom = new ProductRawMaterial();
        bom.id = new ProductRawMaterialId();
        bom.id.productId = p.id;
        bom.id.rawMaterialId = rm.id;
        bom.product = p;
        bom.rawMaterial = rm;
        bom.requiredQuantity = new BigDecimal("3.0000"); // floor(12/3) = 4
        bom.persist();
    }

    @Transactional
    void setupSharedMaterial() {
        RawMaterial rm = new RawMaterial();
        rm.name = "Prancha de Carvalho";
        rm.stockQuantity = new BigDecimal("4.0000");
        rm.persist();

        Product cheap = new Product();
        cheap.name = "Mesa Simples";
        cheap.value = new BigDecimal("200.00");
        cheap.persist();

        Product expensive = new Product();
        expensive.name = "Escrivaninha de Carvalho";
        expensive.value = new BigDecimal("1250.00");
        expensive.persist();

        ProductRawMaterial bomCheap = new ProductRawMaterial();
        bomCheap.id = new ProductRawMaterialId();
        bomCheap.id.productId = cheap.id;
        bomCheap.id.rawMaterialId = rm.id;
        bomCheap.product = cheap;
        bomCheap.rawMaterial = rm;
        bomCheap.requiredQuantity = new BigDecimal("4.0000");
        bomCheap.persist();

        ProductRawMaterial bomExpensive = new ProductRawMaterial();
        bomExpensive.id = new ProductRawMaterialId();
        bomExpensive.id.productId = expensive.id;
        bomExpensive.id.rawMaterialId = rm.id;
        bomExpensive.product = expensive;
        bomExpensive.rawMaterial = rm;
        bomExpensive.requiredQuantity = new BigDecimal("4.0000");
        bomExpensive.persist();
    }

    @Transactional
    void setupBottleneck() {
        RawMaterial rm1 = new RawMaterial();
        rm1.name = "Parafuso";
        rm1.stockQuantity = new BigDecimal("8.0000"); // floor(8/2) = 4
        rm1.persist();

        RawMaterial rm2 = new RawMaterial();
        rm2.name = "Cola";
        rm2.stockQuantity = new BigDecimal("15.5000"); // floor(15.5/1) = 15
        rm2.persist();

        Product p = new Product();
        p.name = "Escrivaninha";
        p.value = new BigDecimal("1250.00");
        p.persist();

        ProductRawMaterial bom1 = new ProductRawMaterial();
        bom1.id = new ProductRawMaterialId();
        bom1.id.productId = p.id;
        bom1.id.rawMaterialId = rm1.id;
        bom1.product = p;
        bom1.rawMaterial = rm1;
        bom1.requiredQuantity = new BigDecimal("2.0000");
        bom1.persist();

        ProductRawMaterial bom2 = new ProductRawMaterial();
        bom2.id = new ProductRawMaterialId();
        bom2.id.productId = p.id;
        bom2.id.rawMaterialId = rm2.id;
        bom2.product = p;
        bom2.rawMaterial = rm2;
        bom2.requiredQuantity = new BigDecimal("1.0000");
        bom2.persist();
    }

    // --- Calls service.suggest() in a separate transaction ---

    @Transactional
    ProductionSuggestionResponse callSuggest() {
        return service.suggest();
    }

    // --- Tests ---

    @Test
    void suggest_returnsEmptyWhenNoProducts() {
        ProductionSuggestionResponse result = callSuggest();
        assertTrue(result.suggestions.isEmpty());
        assertEquals(BigDecimal.ZERO, result.grandTotalValue);
    }

    @Test
    void suggest_ignoresProductWithoutBom() {
        setupProductNoBom();
        ProductionSuggestionResponse result = callSuggest();
        assertTrue(result.suggestions.isEmpty());
        assertEquals(BigDecimal.ZERO, result.grandTotalValue);
    }

    @Test
    void suggest_returnsZeroWhenStockInsufficient() {
        setupZeroStock();
        ProductionSuggestionResponse result = callSuggest();
        assertEquals(1, result.suggestions.size());
        assertEquals(0L, result.suggestions.get(0).producibleQuantity);
        assertEquals(0, BigDecimal.ZERO.compareTo(result.grandTotalValue));
    }

    @Test
    void suggest_calculatesCorrectQuantityAndValue() {
        setupEnoughStock();
        ProductionSuggestionResponse result = callSuggest();
        assertEquals(1, result.suggestions.size());
        assertEquals(4L, result.suggestions.get(0).producibleQuantity);
        assertEquals(new BigDecimal("1400.00"), result.suggestions.get(0).totalValue);
        assertEquals(new BigDecimal("1400.00"), result.grandTotalValue);
    }

    @Test
    void suggest_prioritizesHigherValueProduct() {
        setupSharedMaterial();
        ProductionSuggestionResponse result = callSuggest();

        // Expensive product consumes all stock; cheap product gets qty=0
        long expensiveQty = result.suggestions.stream()
                .filter(s -> s.productName.equals("Escrivaninha de Carvalho"))
                .findFirst().orElseThrow().producibleQuantity;
        long cheapQty = result.suggestions.stream()
                .filter(s -> s.productName.equals("Mesa Simples"))
                .findFirst().orElseThrow().producibleQuantity;

        assertEquals(1L, expensiveQty);
        assertEquals(0L, cheapQty);
        assertEquals(new BigDecimal("1250.00"), result.grandTotalValue);
    }

    @Test
    void suggest_bottleneckMaterialLimitsQuantity() {
        setupBottleneck();
        ProductionSuggestionResponse result = callSuggest();
        assertEquals(4L, result.suggestions.get(0).producibleQuantity);
    }
}
