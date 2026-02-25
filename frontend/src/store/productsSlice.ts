import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi } from "../api/productsApi";
import type {
  Product,
  ProductDetail,
  ProductRequest,
  BomItemRequest,
} from "../types/product";

interface ProductsState {
  items: Product[];
  selectedDetail: ProductDetail | null;
  loading: boolean;
  bomLoading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  selectedDetail: null,
  loading: false,
  bomLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk("products/fetchAll", () =>
  productsApi.list(),
);

export const fetchProductDetail = createAsyncThunk(
  "products/fetchDetail",
  (id: number) => productsApi.findById(id),
);

export const createProduct = createAsyncThunk(
  "products/create",
  (data: ProductRequest) => productsApi.create(data),
);

export const updateProduct = createAsyncThunk(
  "products/update",
  ({ id, data }: { id: number; data: ProductRequest }) =>
    productsApi.update(id, data),
);

export const deleteProduct = createAsyncThunk("products/delete", (id: number) =>
  productsApi.delete(id).then(() => id),
);

export const addBomItem = createAsyncThunk(
  "products/addBomItem",
  ({ productId, data }: { productId: number; data: BomItemRequest }) =>
    productsApi.addBomItem(productId, data),
);

export const updateBomItem = createAsyncThunk(
  "products/updateBomItem",
  ({
    productId,
    rmId,
    data,
  }: {
    productId: number;
    rmId: number;
    data: BomItemRequest;
  }) => productsApi.updateBomItem(productId, rmId, data),
);

export const deleteBomItem = createAsyncThunk(
  "products/deleteBomItem",
  ({ productId, rmId }: { productId: number; rmId: number }) =>
    productsApi.deleteBomItem(productId, rmId).then(() => rmId),
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedDetail(state) {
      state.selectedDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load";
      })
      // fetch detail
      .addCase(fetchProductDetail.pending, (state) => {
        state.bomLoading = true;
      })
      .addCase(fetchProductDetail.fulfilled, (state, action) => {
        state.bomLoading = false;
        state.selectedDetail = action.payload;
      })
      .addCase(fetchProductDetail.rejected, (state) => {
        state.bomLoading = false;
      })
      // create
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        if (state.selectedDetail?.id === action.payload.id) {
          state.selectedDetail = {
            ...state.selectedDetail,
            ...action.payload,
          };
        }
      })
      // delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        if (state.selectedDetail?.id === action.payload) {
          state.selectedDetail = null;
        }
      })
      // bom add
      .addCase(addBomItem.fulfilled, (state, action) => {
        if (state.selectedDetail) {
          state.selectedDetail.rawMaterials.push(action.payload);
        }
      })
      // bom update
      .addCase(updateBomItem.fulfilled, (state, action) => {
        if (state.selectedDetail) {
          const idx = state.selectedDetail.rawMaterials.findIndex(
            (i) => i.rawMaterialId === action.payload.rawMaterialId,
          );
          if (idx !== -1)
            state.selectedDetail.rawMaterials[idx] = action.payload;
        }
      })
      // bom delete
      .addCase(deleteBomItem.fulfilled, (state, action) => {
        if (state.selectedDetail) {
          state.selectedDetail.rawMaterials =
            state.selectedDetail.rawMaterials.filter(
              (i) => i.rawMaterialId !== action.payload,
            );
        }
      });
  },
});

export const { clearSelectedDetail } = productsSlice.actions;
export default productsSlice.reducer;
