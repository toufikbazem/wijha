import { Users } from "lucide-react";

/**
 * Metric — a single stat tile in a hub card's stats row (CVs / New / Views).
 */
export default function Metric({
  icon: Icon,
  value,
  label,
  highlight,
}: {
  icon: typeof Users;
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-3 text-center ring-1 ring-inset transition-colors ${
        highlight
          ? "bg-emerald-50 ring-emerald-100"
          : "bg-gray-50/80 ring-gray-100"
      }`}
    >
      <div className="flex items-center justify-center gap-1.5">
        <Icon
          className={`h-3.5 w-3.5 ${
            highlight ? "text-emerald-500" : "text-gray-400"
          }`}
        />
        <span
          className={`text-base font-bold leading-none ${
            highlight ? "text-emerald-600" : "text-gray-900"
          }`}
        >
          {value}
        </span>
      </div>
      <p className="mt-1 text-[11px] font-medium text-gray-400">{label}</p>
    </div>
  );
}
