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
  const [statusFilter, setStatusFilter] = useState<
    "all" | "healthy" | "low" | "out"
  >("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RawMaterial | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<RawMaterial | null>(null);

  useEffect(() => {
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  const filtered = items.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      getStockStatus(i.stockQuantity) === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        Estoque de Matérias-primas
      </h1>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Total de itens"
          value={totalItems}
          color="text-slate-700"
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        />
        <StatCard
          label="Normal"
          value={healthyCount}
          color="text-success"
          active={statusFilter === "healthy"}
          onClick={() =>
            setStatusFilter(statusFilter === "healthy" ? "all" : "healthy")
          }
        />
        <StatCard
          label="Estoque baixo"
          value={lowCount}
          color="text-warning"
          active={statusFilter === "low"}
          onClick={() =>
            setStatusFilter(statusFilter === "low" ? "all" : "low")
          }
        />
        <StatCard
          label="Sem estoque"
          value={outCount}
          color="text-danger"
          active={statusFilter === "out"}
          onClick={() =>
            setStatusFilter(statusFilter === "out" ? "all" : "out")
          }
        />
      </div>

      {/* Search + Add */}
      <div className="mb-4 flex gap-3">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border focus:border-primary focus:ring-primary flex-1 rounded border bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-1"
        />
        <button
          onClick={openCreate}
          className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Nova Matéria-prima
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-danger mb-4 text-sm">Erro: {error}</p>}

      {/* Table */}
      <div className="border-border overflow-x-auto rounded border bg-white">
        <table className="w-full min-w-120 text-sm">
          <thead>
            <tr className="border-border border-b bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Qtd. em Estoque</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Nenhuma matéria-prima encontrada.
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
                        Editar
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        className="text-danger rounded border border-red-200 px-3 py-1 text-xs hover:bg-red-50"
                      >
                        Excluir
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
          title={editing ? "Editar Matéria-prima" : "Nova Matéria-prima"}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nome
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
                Quantidade em Estoque
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
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editing ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          message={`Excluir "${deleteTarget.name}"? Esta ação não pode ser desfeita.`}
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
  active?: boolean;
  onClick?: () => void;
}

function StatCard({ label, value, color, active, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`border-border cursor-pointer rounded border bg-white px-4 py-4 transition-colors hover:bg-slate-50 ${active ? "ring-primary border-primary ring-2" : ""}`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
