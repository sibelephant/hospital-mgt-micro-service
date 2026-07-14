import { tableConfigs } from "../config/modules";
import { statusTone } from "../config/styles";
import { StatusList } from "./StatusList";
import type { HospitalModule } from "../types";

export function WorkflowPanel({ module }: { module: HospitalModule }) {
  const table = tableConfigs[module.slug];
  const activeCount = table.rows.filter((row) => statusTone(row[table.statusColumn]) === "blue").length;
  const riskCount = table.rows.filter((row) => statusTone(row[table.statusColumn]) === "red").length;

  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(16,56,112,0.07)]">
      <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Workload</p>
      <StatusList
        items={[
          ["Open items", String(activeCount)],
          ["Needs attention", String(riskCount)],
          ["Total records", String(table.rows.length)]
        ]}
      />
    </article>
  );
}
