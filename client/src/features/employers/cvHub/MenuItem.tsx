import { Pencil } from "lucide-react";

/**
 * MenuItem — a single row in a hub card's actions dropdown.
 */
export default function MenuItem({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: typeof Pencil;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative z-10 w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-sm cursor-pointer transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
