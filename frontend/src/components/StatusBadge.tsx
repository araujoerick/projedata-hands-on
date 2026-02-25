interface StatusBadgeProps {
  quantity: number;
}

function getStatus(quantity: number): { label: string; className: string } {
  if (quantity === 0)
    return {
      label: "Sem estoque",
      className: "bg-red-100 text-red-700",
    };
  if (quantity < 10)
    return {
      label: "Estoque baixo",
      className: "bg-amber-100 text-amber-700",
    };
  return {
    label: "Normal",
    className: "bg-green-100 text-green-700",
  };
}

export default function StatusBadge({ quantity }: StatusBadgeProps) {
  const { label, className } = getStatus(quantity);
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${className}`}
    >
      {label}
    </span>
  );
}
