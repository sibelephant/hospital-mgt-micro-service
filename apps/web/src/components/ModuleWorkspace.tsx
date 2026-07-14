import { useMemo } from "react";
import { tableConfigs } from "../config/modules";
import { filterRows } from "../api/mappers";
import { useApiRows } from "../hooks/useApiRows";
import { Panel } from "./Panel";
import { DataState } from "./DataState";
import { DataTable } from "./DataTable";
import type { DataStateName, HospitalModule } from "../types";

export function ModuleWorkspace({
  module,
  refreshKey,
  searchQuery,
  onAction
}: {
  module: HospitalModule;
  refreshKey: number;
  searchQuery: string;
  onAction: () => void;
}) {
  const table = tableConfigs[module.slug];
  const apiRows = useApiRows(module, refreshKey);
  const rows = useMemo(() => filterRows(apiRows.rows, searchQuery), [apiRows.rows, searchQuery]);
  const state: DataStateName = apiRows.state === "loading" ? "loading" : rows.length ? "loaded" : apiRows.state;

  return (
    <Panel title={table.title} eyebrow={table.eyebrow} action={module.action} icon={module.icon} onAction={onAction}>
      <DataState state={state === "error" && apiRows.rows.length ? "loaded" : state} message="No records match the current search.">
        <DataTable
          columns={table.columns}
          rows={rows}
          statusColumn={table.statusColumn}
          rowAction={table.rowAction}
        />
      </DataState>
    </Panel>
  );
}
