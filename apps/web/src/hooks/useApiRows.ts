import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { mapApiRows } from "../api/mappers";
import { tableConfigs } from "../config/modules";
import type { ApiListResponse, DataStateName, HospitalModule } from "../types";

export function useApiRows(module: HospitalModule, externalRefreshKey = 0) {
  const table = tableConfigs[module.slug];
  const [rows, setRows] = useState<string[][]>(table.rows);
  const [state, setState] = useState<DataStateName>("loading");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    apiRequest<ApiListResponse<Record<string, unknown>>>(`${module.endpoint}?limit=50`)
      .then((result) => {
        if (cancelled) return;
        const mappedRows = mapApiRows(module.slug, result.data);
        setRows(mappedRows.length ? mappedRows : table.rows);
        setState(mappedRows.length || table.rows.length ? "loaded" : "empty");
      })
      .catch(() => {
        if (cancelled) return;
        setRows(table.rows);
        setState(table.rows.length ? "loaded" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [module.endpoint, module.slug, externalRefreshKey, refreshKey, table.rows]);

  return { rows, state, refresh: () => setRefreshKey((value) => value + 1) };
}
