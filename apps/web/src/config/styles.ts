import type { ModuleTone, StatusTone } from "../types";

export const toneClasses: Record<ModuleTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  navy: "bg-slate-100 text-blue-900 ring-slate-200"
};

export const statusClasses: Record<StatusTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200"
};

export const statusTone = (status: string): StatusTone => {
  const normalized = status.toLowerCase();
  if (["paid", "completed", "available", "ready", "sent", "signed", "active"].includes(normalized)) return "green";
  if (["scheduled", "checked in", "open", "in progress", "new"].includes(normalized)) return "blue";
  if (["draft", "reserved", "follow-up", "occupied"].includes(normalized)) return "amber";
  if (["overdue", "maintenance", "cancelled"].includes(normalized)) return "red";
  return "slate";
};
