import { LayoutDashboard, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { modules } from "../config/modules";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "grid min-h-11 grid-cols-[20px_minmax(0,1fr)] items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-blue-50 outline-none transition",
    "hover:bg-white/15 focus-visible:bg-white/15",
    isActive ? "bg-white/20 text-white shadow-sm" : ""
  ].join(" ");
}

export function Sidebar() {
  return (
    <aside className="bg-blue-800 px-4 py-5 text-white sm:px-5 lg:px-[18px] lg:py-6">
      <NavLink to="/" className="mb-4 flex items-center gap-2.5 text-xl font-extrabold lg:mb-8">
        <ShieldCheck size={28} />
        <span>CareGrid</span>
      </NavLink>
      <nav className="space-y-4" aria-label="Hospital navigation">
        <NavLink className={navClass} to="/" end>
          <LayoutDashboard size={18} />
          <span className="truncate">Dashboard</span>
        </NavLink>
        <div>
          <p className="mb-2 px-3 text-xs font-extrabold uppercase text-blue-200">Modules</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible lg:pb-0">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <NavLink
                  className={({ isActive }) => `${navClass({ isActive })} min-w-[148px] lg:min-w-0`}
                  key={module.slug}
                  title={module.name}
                  to={`/modules/${module.slug}`}
                >
                  <Icon size={18} />
                  <span className="truncate">{module.shortName}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
}
