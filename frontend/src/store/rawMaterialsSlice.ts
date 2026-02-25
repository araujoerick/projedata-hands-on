import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { rawMaterialsApi } from "../api/rawMaterialsApi";
import type { RawMaterial, RawMaterialRequest } from "../types/rawMaterial";

interface RawMaterialsState {
  items: RawMaterial[];
  loading: boolean;
  error: string | null;
}

const initialState: RawMaterialsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchRawMaterials = createAsyncThunk(
  "rawMaterials/fetchAll",
  () => rawMaterialsApi.list()
);

export const createRawMaterial = createAsyncThunk(
  "rawMaterials/create",
  (data: RawMaterialRequest) => rawMaterialsApi.create(data)
);

export const updateRawMaterial = createAsyncThunk(
  "rawMaterials/update",
  ({ id, data }: { id: number; data: RawMaterialRequest }) =>
    rawMaterialsApi.update(id, data)
);

export const deleteRawMaterial = createAsyncThunk(
  "rawMaterials/delete",
  (id: number) => rawMaterialsApi.delete(id).then(() => id)
);

const rawMaterialsSlice = createSlice({
  name: "rawMaterials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRawMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRawMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchRawMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load";
      })
      .addCase(createRawMaterial.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateRawMaterial.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(deleteRawMaterial.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      });
  },
});

export default rawMaterialsSlice.reducer;
