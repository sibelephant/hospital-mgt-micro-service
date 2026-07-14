import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { NavLink, Navigate, useParams } from "react-router-dom";
import { modules } from "../config/modules";
import { toneClasses } from "../config/styles";
import { ModuleWorkspace } from "../components/ModuleWorkspace";
import { MetricPanel } from "../components/MetricPanel";
import { WorkflowPanel } from "../components/WorkflowPanel";
import { ActionModal } from "../components/ActionModal";
import type { HospitalModule } from "../types";

export function ModuleDetail({ searchQuery }: { searchQuery: string }) {
  const { slug } = useParams();
  const module = modules.find((item) => item.slug === slug);
  const [modalModule, setModalModule] = useState<HospitalModule | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!module) return <Navigate to="/" replace />;

  const Icon = module.icon;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <NavLink className="font-semibold text-blue-700" to="/">
          Dashboard
        </NavLink>
        <ChevronRight size={16} />
        <span>{module.name}</span>
      </div>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(16,56,112,0.07)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ring-1 ${toneClasses[module.tone]}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Module workspace</p>
              <h2 className="text-2xl font-extrabold text-blue-950">{module.name}</h2>
              <p className="mt-1 max-w-3xl text-slate-600">{module.summary}</p>
            </div>
          </div>
          <button
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-800 sm:w-auto"
            onClick={() => setModalModule(module)}
            type="button"
          >
            <Plus size={17} />
            {module.action}
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ModuleWorkspace
          module={module}
          refreshKey={refreshKey}
          searchQuery={searchQuery}
          onAction={() => setModalModule(module)}
        />
        <aside className="grid content-start gap-4">
          <MetricPanel module={module} />
          <WorkflowPanel module={module} />
        </aside>
      </section>
      {modalModule ? (
        <ActionModal
          module={modalModule}
          onClose={() => setModalModule(null)}
          onSaved={() => {
            setRefreshKey((value) => value + 1);
            setModalModule(null);
          }}
        />
      ) : null}
    </div>
  );
}
