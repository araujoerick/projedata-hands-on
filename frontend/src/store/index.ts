import { configureStore } from "@reduxjs/toolkit";
import rawMaterialsReducer from "./rawMaterialsSlice";
import productsReducer from "./productsSlice";
import productionPlanningReducer from "./productionPlanningSlice";

export const store = configureStore({
  reducer: {
    rawMaterials: rawMaterialsReducer,
    products: productsReducer,
    productionPlanning: productionPlanningReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
