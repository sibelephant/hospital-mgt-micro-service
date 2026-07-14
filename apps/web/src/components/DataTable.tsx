import { useState } from "react";
import { Eye, X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

function RowDrawer({ columns, row, onClose }: { columns: string[]; row: string[]; onClose: () => void }) {
  return (
    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-blue-950">Record details</h3>
        <button className="grid h-8 w-8 place-items-center rounded-lg hover:bg-white" onClick={onClose} type="button" aria-label="Close details">
          <X size={16} />
        </button>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {columns.map((column, index) => (
          <div className="rounded-lg bg-white p-3 ring-1 ring-blue-100" key={column}>
            <dt className="text-xs font-extrabold uppercase text-slate-500">{column}</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">{row[index]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function DataTable({
  columns,
  rows,
  statusColumn,
  rowAction
}: {
  columns: string[];
  rows: string[][];
  statusColumn?: number;
  rowAction: string;
}) {
  const [selectedRow, setSelectedRow] = useState<string[] | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-blue-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-100 text-left text-sm">
            <thead className="bg-blue-50/70 text-xs uppercase text-slate-500">
              <tr>
                {columns.map((column) => (
                  <th className="whitespace-nowrap px-4 py-3 font-extrabold" key={column}>
                    {column}
                  </th>
                ))}
                <th className="whitespace-nowrap px-4 py-3 text-right font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50 bg-white">
              {rows.map((row) => (
                <tr className="hover:bg-blue-50/40" key={row.join("-")}>
                  {row.map((cell, index) => (
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700" key={`${cell}-${index}`}>
                      {index === statusColumn ? <StatusBadge label={cell} /> : cell}
                    </td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <button
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50"
                      onClick={() => setSelectedRow(row)}
                      type="button"
                    >
                      <Eye size={14} />
                      {rowAction}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedRow ? <RowDrawer columns={columns} row={selectedRow} onClose={() => setSelectedRow(null)} /> : null}
    </>
  );
}
