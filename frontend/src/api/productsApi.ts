import client from "./client";
import type {
  Product,
  ProductDetail,
  ProductRequest,
  BomItem,
  BomItemRequest,
} from "../types/product";

export const productsApi = {
  list: () => client.get<Product[]>("/api/products").then((r) => r.data),
  findById: (id: number) =>
    client.get<ProductDetail>(`/api/products/${id}`).then((r) => r.data),
  create: (data: ProductRequest) =>
    client.post<Product>("/api/products", data).then((r) => r.data),
  update: (id: number, data: ProductRequest) =>
    client.put<Product>(`/api/products/${id}`, data).then((r) => r.data),
  delete: (id: number) => client.delete(`/api/products/${id}`),

  listBom: (productId: number) =>
    client
      .get<BomItem[]>(`/api/products/${productId}/raw-materials`)
      .then((r) => r.data),
  addBomItem: (productId: number, data: BomItemRequest) =>
    client
      .post<BomItem>(`/api/products/${productId}/raw-materials`, data)
      .then((r) => r.data),
  updateBomItem: (productId: number, rmId: number, data: BomItemRequest) =>
    client
      .put<BomItem>(`/api/products/${productId}/raw-materials/${rmId}`, data)
      .then((r) => r.data),
  deleteBomItem: (productId: number, rmId: number) =>
    client.delete(`/api/products/${productId}/raw-materials/${rmId}`),
};
