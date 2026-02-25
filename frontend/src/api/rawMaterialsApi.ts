import client from "./client";
import type { RawMaterial, RawMaterialRequest } from "../types/rawMaterial";

export const rawMaterialsApi = {
  list: () =>
    client.get<RawMaterial[]>("/api/raw-materials").then((r) => r.data),
  findById: (id: number) =>
    client.get<RawMaterial>(`/api/raw-materials/${id}`).then((r) => r.data),
  create: (data: RawMaterialRequest) =>
    client.post<RawMaterial>("/api/raw-materials", data).then((r) => r.data),
  update: (id: number, data: RawMaterialRequest) =>
    client
      .put<RawMaterial>(`/api/raw-materials/${id}`, data)
      .then((r) => r.data),
  delete: (id: number) => client.delete(`/api/raw-materials/${id}`),
};
