import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productionPlanningApi } from "../api/productionPlanningApi";
import type { ProductionSuggestion } from "../types/productionPlanning";

interface ProductionPlanningState {
  data: ProductionSuggestion | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductionPlanningState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchSuggestions = createAsyncThunk(
  "productionPlanning/fetchSuggestions",
  () => productionPlanningApi.suggestions(),
);

const productionPlanningSlice = createSlice({
  name: "productionPlanning",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load";
      });
  },
});

export default productionPlanningSlice.reducer;
