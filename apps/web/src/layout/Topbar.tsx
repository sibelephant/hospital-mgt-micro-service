import { Search, X } from "lucide-react";
import type { AuthSession } from "../types";

export function Topbar({
  searchQuery,
  session,
  onLogout,
  onSearchChange
}: {
  searchQuery: string;
  session: AuthSession;
  onLogout: () => void;
  onSearchChange: (value: string) => void;
}) {
  return (
    <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Hospital operations</p>
        <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-none text-blue-950">
          {session.hospital.name}
        </h1>
      </div>
      <div className="flex w-full flex-col gap-3 md:max-w-[620px] md:flex-row md:items-center">
        <label className="flex min-h-11 w-full items-center gap-2.5 rounded-lg border border-blue-100 bg-white px-3.5 text-slate-500 shadow-sm">
          <Search size={18} />
          <input
            className="w-full min-w-0 border-0 bg-transparent text-slate-900 outline-none"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search patients, invoices, reports"
            value={searchQuery}
          />
          {searchQuery ? (
            <button
              className="grid h-7 w-7 place-items-center rounded-md text-slate-500 hover:bg-slate-100"
              onClick={() => onSearchChange("")}
              type="button"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          ) : null}
        </label>
        <button
          className="min-h-11 rounded-lg border border-blue-100 bg-white px-4 text-sm font-bold text-blue-800 shadow-sm hover:bg-blue-50"
          onClick={onLogout}
          type="button"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
