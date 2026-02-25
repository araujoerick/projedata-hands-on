import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import RawMaterialsPage from "./pages/RawMaterialsPage";
import ProductsPage from "./pages/ProductsPage";
import ProductionPlanningPage from "./pages/ProductionPlanningPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/raw-materials" replace />} />
        <Route path="/raw-materials" element={<RawMaterialsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/production" element={<ProductionPlanningPage />} />
      </Route>
    </Routes>
  );
}
