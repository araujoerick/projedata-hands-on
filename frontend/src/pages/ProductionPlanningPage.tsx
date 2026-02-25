import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import { fetchSuggestions } from "../store/productionPlanningSlice";

const brl = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );

export default function ProductionPlanningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.productionPlanning,
  );

  function handleCalculate() {
    dispatch(fetchSuggestions());
  }

  const suggestions = data?.suggestions ?? [];
  const grandTotal = data?.grandTotalValue ?? 0;
  const hasCalculated = data !== null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">
          Production Planning
        </h1>
        <button
          onClick={handleCalculate}
          disabled={loading}
          className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Calculating..." : "Calculate Production"}
        </button>
      </div>

      {error && <p className="text-danger mb-4 text-sm">Error: {error}</p>}

      {!hasCalculated && !loading && (
        <div className="border-border flex flex-col items-center justify-center rounded border bg-white py-16 text-center">
          <p className="text-slate-500">
            Click <strong>Calculate Production</strong> to see production
            suggestions based on current stock.
          </p>
        </div>
      )}

      {hasCalculated && (
        <>
          {/* Table */}
          <div className="border-border mb-6 overflow-x-auto rounded border bg-white">
            <table className="w-full min-w-120 text-sm">
              <thead>
                <tr className="border-border border-b bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Unit Value</th>
                  <th className="px-4 py-3">Producible Qty</th>
                  <th className="px-4 py-3">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      No production possible with current stock levels.
                    </td>
                  </tr>
                )}
                {suggestions.map((s) => (
                  <tr
                    key={s.productId}
                    className="border-border border-b last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {s.productName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {brl(s.productValue)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {s.producibleQuantity}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {brl(s.totalValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grand Total Card */}
          <div className="border-primary bg-primary/5 flex items-center justify-between rounded border px-6 py-4">
            <span className="text-sm font-semibold tracking-wide text-slate-700 uppercase">
              Grand Total Value
            </span>
            <span className="text-primary text-2xl font-bold">
              {brl(grandTotal)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
