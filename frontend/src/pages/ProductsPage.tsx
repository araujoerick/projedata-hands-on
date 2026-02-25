import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/index";
import {
  fetchProducts,
  fetchProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  addBomItem,
  updateBomItem,
  deleteBomItem,
  clearSelectedDetail,
} from "../store/productsSlice";
import { fetchRawMaterials } from "../store/rawMaterialsSlice";
import type { Product, BomItem } from "../types/product";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

const brl = (v: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

interface ProductFormState {
  name: string;
  value: string;
}

const emptyProductForm: ProductFormState = { name: "", value: "" };

interface BomFormState {
  rawMaterialId: string;
  requiredQuantity: string;
}

const emptyBomForm: BomFormState = { rawMaterialId: "", requiredQuantity: "" };

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedDetail, loading, bomLoading } = useSelector(
    (state: RootState) => state.products,
  );
  const rawMaterials = useSelector(
    (state: RootState) => state.rawMaterials.items,
  );

  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] =
    useState<ProductFormState>(emptyProductForm);
  const [deleteProductTarget, setDeleteProductTarget] =
    useState<Product | null>(null);

  const [bomModal, setBomModal] = useState(false);
  const [editingBom, setEditingBom] = useState<BomItem | null>(null);
  const [bomForm, setBomForm] = useState<BomFormState>(emptyBomForm);
  const [deleteBomTarget, setDeleteBomTarget] = useState<BomItem | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchRawMaterials());
  }, [dispatch]);

  // --- Product modal ---
  function openCreateProduct() {
    setEditingProduct(null);
    setProductForm(emptyProductForm);
    setProductModal(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct(p);
    setProductForm({ name: p.name, value: String(p.value) });
    setProductModal(true);
  }

  function closeProductModal() {
    setProductModal(false);
    setEditingProduct(null);
    setProductForm(emptyProductForm);
  }

  function handleProductSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name: productForm.name.trim(),
      value: parseFloat(productForm.value),
    };
    if (editingProduct) {
      dispatch(updateProduct({ id: editingProduct.id, data }));
    } else {
      dispatch(createProduct(data));
    }
    closeProductModal();
  }

  function handleDeleteProduct() {
    if (deleteProductTarget) {
      dispatch(deleteProduct(deleteProductTarget.id));
      setDeleteProductTarget(null);
    }
  }

  function selectProduct(p: Product) {
    if (selectedDetail?.id === p.id) {
      dispatch(clearSelectedDetail());
    } else {
      dispatch(fetchProductDetail(p.id));
    }
  }

  // --- BOM modal ---
  function openAddBom() {
    setEditingBom(null);
    setBomForm(emptyBomForm);
    setBomModal(true);
  }

  function openEditBom(item: BomItem) {
    setEditingBom(item);
    setBomForm({
      rawMaterialId: String(item.rawMaterialId),
      requiredQuantity: String(item.requiredQuantity),
    });
    setBomModal(true);
  }

  function closeBomModal() {
    setBomModal(false);
    setEditingBom(null);
    setBomForm(emptyBomForm);
  }

  function handleBomSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDetail) return;
    const data = {
      rawMaterialId: parseInt(bomForm.rawMaterialId),
      requiredQuantity: parseFloat(bomForm.requiredQuantity),
    };
    if (editingBom) {
      dispatch(
        updateBomItem({
          productId: selectedDetail.id,
          rmId: editingBom.rawMaterialId,
          data,
        }),
      );
    } else {
      dispatch(addBomItem({ productId: selectedDetail.id, data }));
    }
    closeBomModal();
  }

  function handleDeleteBom() {
    if (deleteBomTarget && selectedDetail) {
      dispatch(
        deleteBomItem({
          productId: selectedDetail.id,
          rmId: deleteBomTarget.rawMaterialId,
        }),
      );
      setDeleteBomTarget(null);
    }
  }

  const availableRawMaterials = rawMaterials.filter(
    (rm) =>
      !selectedDetail?.rawMaterials.some((b) => b.rawMaterialId === rm.id),
  );

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-slate-800">
        Produtos e Composição (BOM)
      </h1>

      <div className="mb-2 flex justify-end">
        <button
          onClick={openCreateProduct}
          className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Novo Produto
        </button>
      </div>

      <div className="border-border overflow-x-auto rounded border bg-white">
        <table className="w-full min-w-120 text-sm">
          <thead>
            <tr className="border-border border-b bg-slate-50 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Carregando...
                </td>
              </tr>
            )}
            {!loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-400"
                >
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
            {!loading &&
              items.map((product) => (
                <>
                  <tr
                    key={product.id}
                    className={`border-border cursor-pointer border-b hover:bg-slate-50 ${
                      selectedDetail?.id === product.id ? "bg-blue-50" : ""
                    }`}
                    onClick={() => selectProduct(product)}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {brl(product.value)}
                    </td>
                    <td className="px-4 py-3">
                      <div
                        className="flex gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => openEditProduct(product)}
                          className="border-border rounded border px-3 py-1 text-xs text-slate-600 hover:bg-slate-100"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteProductTarget(product)}
                          className="text-danger rounded border border-red-200 px-3 py-1 text-xs hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>

                  {selectedDetail?.id === product.id && (
                    <tr key={`bom-${product.id}`}>
                      <td
                        colSpan={3}
                        className="border-border border-b bg-slate-50 px-6 py-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Composição — {product.name}
                          </span>
                          <button
                            onClick={openAddBom}
                            disabled={availableRawMaterials.length === 0}
                            className="bg-primary rounded px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-40"
                          >
                            Adicionar Insumo
                          </button>
                        </div>

                        {bomLoading ? (
                          <p className="text-xs text-slate-400">
                            Carregando composição...
                          </p>
                        ) : selectedDetail.rawMaterials.length === 0 ? (
                          <p className="text-xs text-slate-400">
                            Nenhum insumo cadastrado neste produto ainda.
                          </p>
                        ) : (
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-border border-b text-left text-slate-500">
                                <th className="py-2 pr-4">Matéria-prima</th>
                                <th className="py-2 pr-4">Qtd. Necessária</th>
                                <th className="py-2">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedDetail.rawMaterials.map((bom) => (
                                <tr
                                  key={bom.rawMaterialId}
                                  className="border-border border-b last:border-0"
                                >
                                  <td className="py-2 pr-4 font-medium text-slate-700">
                                    {bom.rawMaterialName}
                                  </td>
                                  <td className="py-2 pr-4 text-slate-600">
                                    {bom.requiredQuantity}
                                  </td>
                                  <td className="py-2">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => openEditBom(bom)}
                                        className="border-border rounded border px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                                      >
                                        Editar
                                      </button>
                                      <button
                                        onClick={() => setDeleteBomTarget(bom)}
                                        className="text-danger rounded border border-red-200 px-2 py-0.5 hover:bg-red-50"
                                      >
                                        Remover
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>

      {/* Product create/edit modal */}
      {productModal && (
        <Modal
          title={editingProduct ? "Editar Produto" : "Novo Produto"}
          onClose={closeProductModal}
        >
          <form onSubmit={handleProductSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Nome
              </label>
              <input
                type="text"
                required
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                className="border-border focus:border-primary focus:ring-primary w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Valor (R$)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                value={productForm.value}
                onChange={(e) =>
                  setProductForm({ ...productForm, value: e.target.value })
                }
                className="border-border focus:border-primary focus:ring-primary w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeProductModal}
                className="border-border rounded border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingProduct ? "Salvar" : "Cadastrar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* BOM add/edit modal */}
      {bomModal && (
        <Modal
          title={editingBom ? "Editar Insumo" : "Adicionar Insumo à Composição"}
          onClose={closeBomModal}
        >
          <form onSubmit={handleBomSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Matéria-prima
              </label>
              {editingBom ? (
                <input
                  type="text"
                  disabled
                  value={editingBom.rawMaterialName}
                  className="border-border w-full rounded border bg-slate-50 px-3 py-2 text-sm text-slate-500"
                />
              ) : (
                <select
                  required
                  value={bomForm.rawMaterialId}
                  onChange={(e) =>
                    setBomForm({ ...bomForm, rawMaterialId: e.target.value })
                  }
                  className="border-border focus:border-primary focus:ring-primary w-full rounded border bg-white px-3 py-2 text-sm outline-none focus:ring-1"
                >
                  <option value="">Selecione uma matéria-prima...</option>
                  {availableRawMaterials.map((rm) => (
                    <option key={rm.id} value={rm.id}>
                      {rm.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Quantidade Necessária
              </label>
              <input
                type="number"
                min="0.0001"
                step="0.0001"
                required
                value={bomForm.requiredQuantity}
                onChange={(e) =>
                  setBomForm({ ...bomForm, requiredQuantity: e.target.value })
                }
                className="border-border focus:border-primary focus:ring-primary w-full rounded border px-3 py-2 text-sm outline-none focus:ring-1"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeBomModal}
                className="border-border rounded border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-primary rounded px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingBom ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteProductTarget && (
        <ConfirmDialog
          message={`Excluir o produto "${deleteProductTarget.name}"? A composição também será removida.`}
          onConfirm={handleDeleteProduct}
          onCancel={() => setDeleteProductTarget(null)}
        />
      )}

      {deleteBomTarget && (
        <ConfirmDialog
          message={`Remover "${deleteBomTarget.rawMaterialName}" da composição?`}
          onConfirm={handleDeleteBom}
          onCancel={() => setDeleteBomTarget(null)}
        />
      )}
    </div>
  );
}
