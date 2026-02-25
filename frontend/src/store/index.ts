import { configureStore } from "@reduxjs/toolkit";
import rawMaterialsReducer from "./rawMaterialsSlice";

export const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
