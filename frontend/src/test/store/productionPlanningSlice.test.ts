import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import productionPlanningReducer, {
  fetchSuggestions,
} from "../../store/productionPlanningSlice";
import * as api from "../../api/productionPlanningApi";
import type { ProductionSuggestion } from "../../types/productionPlanning";

vi.mock("../../api/productionPlanningApi");

const mockResponse: ProductionSuggestion = {
  suggestions: [
    {
      productId: 1,
      productName: "Escrivaninha de Carvalho",
      productValue: 1250.0,
      producibleQuantity: 4,
      totalValue: 5000.0,
    },
  ],
  grandTotalValue: 5000.0,
};

function makeStore() {
  return configureStore({ reducer: { productionPlanning: productionPlanningReducer } });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("productionPlanningSlice", () => {
  it("initial state has null data", () => {
    const store = makeStore();
    const state = store.getState().productionPlanning;
    expect(state.data).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets loading true while pending", () => {
    vi.spyOn(api.productionPlanningApi, "suggestions").mockReturnValue(new Promise(() => {}));
    const store = makeStore();
    store.dispatch(fetchSuggestions());
    expect(store.getState().productionPlanning.loading).toBe(true);
  });

  it("populates data on fulfilled", async () => {
    vi.spyOn(api.productionPlanningApi, "suggestions").mockResolvedValue(mockResponse);
    const store = makeStore();
    await store.dispatch(fetchSuggestions());
    const state = store.getState().productionPlanning;
    expect(state.data).toEqual(mockResponse);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("sets error on rejected", async () => {
    vi.spyOn(api.productionPlanningApi, "suggestions").mockRejectedValue(new Error("Server error"));
    const store = makeStore();
    await store.dispatch(fetchSuggestions());
    const state = store.getState().productionPlanning;
    expect(state.error).toBe("Server error");
    expect(state.loading).toBe(false);
    expect(state.data).toBeNull();
  });

  it("grandTotalValue reflects sum of all suggestions", async () => {
    vi.spyOn(api.productionPlanningApi, "suggestions").mockResolvedValue(mockResponse);
    const store = makeStore();
    await store.dispatch(fetchSuggestions());
    expect(store.getState().productionPlanning.data?.grandTotalValue).toBe(5000.0);
  });
});
