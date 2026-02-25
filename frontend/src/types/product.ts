export interface Product {
  id: number;
  name: string;
  value: number;
}

export interface BomItem {
  rawMaterialId: number;
  rawMaterialName: string;
  requiredQuantity: number;
}

export interface ProductDetail extends Product {
  rawMaterials: BomItem[];
}

export interface ProductRequest {
  name: string;
  value: number;
}

export interface BomItemRequest {
  rawMaterialId: number;
  requiredQuantity: number;
}
