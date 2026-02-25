import client from "./client";
import type { ProductionSuggestion } from "../types/productionPlanning";

export const productionPlanningApi = {
  suggestions: () =>
    client
      .get<ProductionSuggestion>("/api/production-planning/suggestions")
      .then((r) => r.data),
};
