import { StatusBadge } from "./StatusBadge";
import type { HospitalModule } from "../types";

export function MetricPanel({ module }: { module: HospitalModule }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(16,56,112,0.07)]">
      <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Current metric</p>
      <strong className="block text-4xl text-blue-950">{module.metric}</strong>
      <span className="text-slate-500">{module.detail}</span>
      <div className="mt-6 rounded-lg bg-blue-700 p-4 text-white">
        <p className="mb-2 text-sm font-bold">Primary workflow</p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-blue-50">{module.action}</span>
          <StatusBadge label="Active" />
        </div>
      </div>
    </article>
  );
}
