export interface RawMaterial {
  id: number;
  name: string;
  stockQuantity: number;
}

export interface RawMaterialRequest {
  name: string;
  stockQuantity: number;
}
