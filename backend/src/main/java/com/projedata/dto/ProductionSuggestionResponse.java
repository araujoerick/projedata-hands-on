package com.projedata.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionResponse {

    public List<SuggestionItem> suggestions;
    public BigDecimal grandTotalValue;

    public static class SuggestionItem {
        public Long productId;
        public String productName;
        public BigDecimal productValue;
        public long producibleQuantity;
        public BigDecimal totalValue;
    }
}
