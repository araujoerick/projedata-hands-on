import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import rawMaterialsReducer, {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../../store/rawMaterialsSlice";
import * as api from "../../api/rawMaterialsApi";
import type { RawMaterial } from "../../types/rawMaterial";

vi.mock("../../api/rawMaterialsApi");

const mockItems: RawMaterial[] = [
  { id: 1, name: "Prancha de Pinus", stockQuantity: 120 },
  { id: 2, name: "Parafuso (cento)", stockQuantity: 8 },
];

function makeStore() {
  return configureStore({ reducer: { rawMaterials: rawMaterialsReducer } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("rawMaterialsSlice", () => {
  describe("fetchRawMaterials", () => {
    it("sets loading true while pending", () => {
      vi.spyOn(api.rawMaterialsApi, "list").mockReturnValue(new Promise(() => {}));
      const store = makeStore();
      store.dispatch(fetchRawMaterials());
      expect(store.getState().rawMaterials.loading).toBe(true);
    });

    it("populates items on fulfilled", async () => {
      vi.spyOn(api.rawMaterialsApi, "list").mockResolvedValue(mockItems);
      const store = makeStore();
      await store.dispatch(fetchRawMaterials());
      expect(store.getState().rawMaterials.items).toEqual(mockItems);
      expect(store.getState().rawMaterials.loading).toBe(false);
    });

    it("sets error on rejected", async () => {
      vi.spyOn(api.rawMaterialsApi, "list").mockRejectedValue(new Error("Network error"));
      const store = makeStore();
      await store.dispatch(fetchRawMaterials());
      expect(store.getState().rawMaterials.error).toBe("Network error");
      expect(store.getState().rawMaterials.loading).toBe(false);
    });
  });

  describe("createRawMaterial", () => {
    it("appends new item to list", async () => {
      const newItem: RawMaterial = { id: 3, name: "Cola", stockQuantity: 15.5 };
      vi.spyOn(api.rawMaterialsApi, "create").mockResolvedValue(newItem);
      const store = makeStore();
      // Pre-populate
      vi.spyOn(api.rawMaterialsApi, "list").mockResolvedValue(mockItems);
      await store.dispatch(fetchRawMaterials());

      await store.dispatch(createRawMaterial({ name: "Cola", stockQuantity: 15.5 }));
      expect(store.getState().rawMaterials.items).toHaveLength(3);
      expect(store.getState().rawMaterials.items[2]).toEqual(newItem);
    });
  });

  describe("updateRawMaterial", () => {
    it("replaces item in list", async () => {
      const updated: RawMaterial = { id: 1, name: "Pinus Atualizado", stockQuantity: 200 };
      vi.spyOn(api.rawMaterialsApi, "update").mockResolvedValue(updated);
      vi.spyOn(api.rawMaterialsApi, "list").mockResolvedValue(mockItems);
      const store = makeStore();
      await store.dispatch(fetchRawMaterials());

      await store.dispatch(updateRawMaterial({ id: 1, data: { name: "Pinus Atualizado", stockQuantity: 200 } }));
      const items = store.getState().rawMaterials.items;
      expect(items[0].name).toBe("Pinus Atualizado");
      expect(items[0].stockQuantity).toBe(200);
    });
  });

  describe("deleteRawMaterial", () => {
    it("removes item from list by id", async () => {
      vi.spyOn(api.rawMaterialsApi, "delete").mockResolvedValue({} as Awaited<ReturnType<typeof api.rawMaterialsApi.delete>>);
      vi.spyOn(api.rawMaterialsApi, "list").mockResolvedValue(mockItems);
      const store = makeStore();
      await store.dispatch(fetchRawMaterials());

      await store.dispatch(deleteRawMaterial(1));
      const items = store.getState().rawMaterials.items;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe(2);
    });
  });
});
