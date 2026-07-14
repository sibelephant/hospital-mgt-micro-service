import { statusClasses, statusTone } from "../config/styles";

export function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[statusTone(label)]}`}>
      {label}
    </span>
  );
}
