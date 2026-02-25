export interface SuggestionItem {
  productId: number;
  productName: string;
  productValue: number;
  producibleQuantity: number;
  totalValue: number;
}

export interface ProductionSuggestion {
  suggestions: SuggestionItem[];
  grandTotalValue: number;
}
