import { configureStore } from "@reduxjs/toolkit";
import rawMaterialsReducer from "./rawMaterialsSlice";
import productsReducer from "./productsSlice";

export const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialsReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
