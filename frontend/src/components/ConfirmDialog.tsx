import Modal from "./Modal";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal title="Confirmar" onClose={onCancel}>
      <p className="mb-6 text-sm text-slate-600">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="border-border rounded border px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          className="bg-danger rounded px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Excluir
        </button>
      </div>
    </Modal>
  );
}
