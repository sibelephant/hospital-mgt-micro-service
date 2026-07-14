import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { DataStateName } from "../types";

export function DataState({
  state,
  children,
  message = "New records will appear here after the first item is created."
}: {
  state: DataStateName;
  children?: React.ReactNode;
  message?: string;
}) {
  if (state === "loaded") return <>{children}</>;
  if (state === "loading") {
    return (
      <div className="rounded-lg border border-blue-100 bg-white p-4" aria-busy="true">
        <div className="mb-3 h-4 w-32 animate-pulse rounded bg-blue-100" />
        <div className="grid gap-2">
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <div className="h-10 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }
  if (state === "empty") {
    return (
      <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-4 text-sm text-slate-600">
        <p className="font-bold text-blue-950">No records found</p>
        <p className="mt-1 mb-0">{message}</p>
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-800">
      <div className="flex items-start gap-2">
        <AlertCircle className="mt-0.5 shrink-0" size={17} />
        <div>
          <p className="font-bold">Unable to load live records</p>
          <p className="mt-1 mb-3">Check the API connection, then retry the request.</p>
          <button className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 font-bold text-rose-700 ring-1 ring-rose-200" type="button">
            <RefreshCw size={15} />
            Retry
          </button>
        </div>
      </div>
    </div>
  );
}
