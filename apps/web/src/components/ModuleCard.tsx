import { NavLink } from "react-router-dom";
import { toneClasses } from "../config/styles";
import type { HospitalModule } from "../types";

export function ModuleCard({ module }: { module: HospitalModule }) {
  const Icon = module.icon;
  return (
    <NavLink
      to={`/modules/${module.slug}`}
      className="grid min-h-[112px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_24px_rgba(16,56,112,0.07)] transition hover:-translate-y-0.5 hover:border-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <div className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ${toneClasses[module.tone]}`}>
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-extrabold text-blue-950">{module.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{module.summary}</p>
      </div>
      <div className="text-right">
        <strong className="block text-2xl text-blue-950">{module.metric}</strong>
        <span className="text-xs text-slate-500">{module.detail}</span>
      </div>
    </NavLink>
  );
}
