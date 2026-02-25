import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  fetchRawMaterials,
  createRawMaterial,
  updateRawMaterial,
  deleteRawMaterial,
} from "../store/rawMaterialsSlice";
import type { RawMaterial } from "../types/rawMaterial";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

function getStockStatus(qty: number): "out" | "low" | "healthy" {
  if (qty === 0) return "out";
  if (qty < 10) return "low";
  return "healthy";
}

interface FormState {
  name: string;
  stockQuantity: string;
}

const emptyForm: FormState = { name: "", stockQuantity: "" };

export default function RawMaterialsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector(
    (state: RootState) => state.rawMaterials,
  );

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<RawMaterial | null>(null);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  const totalItems = items.length;
  const healthyCount = items.filter(
    (i) => getStockStatus(i.stockQuantity) === "healthy",
  ).length;
  const lowCount = items.filter(
    (i) => getStockStatus(i.stockQuantity) === "low",
  ).length;
  const outCount = items.filter(
    (i) => getStockStatus(i.stockQuantity) === "out",
  ).length;

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(item: RawMaterial) {
    setEditing(item);
    setForm({ name: item.name, stockQuantity: String(item.stockQuantity) });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: form.name.trim(),
      stockQuantity: parseFloat(form.stockQuantity),
    };
    if (editing) {
      dispatch(updateRawMaterial({ id: editing.id, data }));
    } else {
      dispatch(createRawMaterial(data));
    }
    closeModal();
  }

  function handleDelete() {
    if (deleteTarget) {
      dispatch(deleteRawMaterial(deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-800">
        Raw Materials Inventory
      </h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total Items"
          value={totalItems}
          color="text-slate-700"
        />
        <StatCard
          label="Healthy Stock"
          value={healthyCount}
          color="text-success"
        />
        <StatCard label="Low Stock" value={lowCount} color="text-warning" />
        <StatCard label="Out of Stock" value={outCount} color="text-danger" />
      </div>

      {/* Search + Add */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border focus:border-primary focus:ring-primary flex-1 rounded border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-1"
        />
        <button
          onClick={openCreate}
          className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Raw Material
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-danger mb-4 text-sm">Error: {error}</p>}

      {/* Table */}
      <div className="border-border overflow-hidden rounded border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stock Quantity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  No raw materials found.
                </td>
              </tr>
            )}
            {!loading &&
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-border border-b last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {item.stockQuantity}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge quantity={item.stockQuantity} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="border-border rounded border px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-danger rounded border border-red-200 px-3 py-1 text-xs hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <Modal
          title={editing ? "Edit Raw Material" : "Add Raw Material"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border-border focus:border-primary focus:ring-primary w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Stock Quantity
              </label>
              <input
                type="number"
                min="0"
                step="0.0001"
                required
                value={form.stockQuantity}
                onChange={(e) =>
                  setForm({ ...form, stockQuantity: e.target.value })
                }
                className="border-border focus:border-primary focus:ring-primary w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeModal}
                className="border-border rounded border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editing ? "Save" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="border-border rounded border bg-white px-4 py-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
