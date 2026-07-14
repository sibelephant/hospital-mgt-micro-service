import React from "react";
import { Plus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function Panel({
  eyebrow,
  title,
  icon: Icon,
  action,
  onAction,
  children
}: {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  action?: string;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_24px_rgba(16,56,112,0.07)] sm:p-[18px]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">{eyebrow}</p>
          <h2 className="text-[1.05rem] font-extrabold text-blue-950">{title}</h2>
        </div>
        {action ? (
          <button
            className="inline-flex min-h-[38px] items-center justify-center gap-2 rounded-lg bg-blue-700 px-3.5 text-sm font-bold text-white hover:bg-blue-800"
            onClick={onAction}
            type="button"
          >
            <Plus size={17} />
            {action}
          </button>
        ) : (
          <Icon className="text-blue-700" size={22} />
        )}
      </div>
      {children}
    </article>
  );
}
