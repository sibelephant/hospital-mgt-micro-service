import { useMemo, useState } from "react";
import { Activity, BedDouble, CalendarDays, ClipboardList } from "lucide-react";
import { modules, tableConfigs, wardRows } from "../config/modules";
import { filterRows } from "../api/mappers";
import { useApiRows } from "../hooks/useApiRows";
import { ModuleCard } from "../components/ModuleCard";
import { Panel } from "../components/Panel";
import { DataState } from "../components/DataState";
import { DataTable } from "../components/DataTable";
import { StatusList } from "../components/StatusList";
import { ActionModal } from "../components/ActionModal";
import type { HospitalModule } from "../types";

export function Dashboard({ searchQuery }: { searchQuery: string }) {
  const [modalModule, setModalModule] = useState<HospitalModule | null>(null);
  const appointmentsModule = modules[0];
  const appointmentData = useApiRows(appointmentsModule);
  const scheduleRows = useMemo(() => filterRows(appointmentData.rows, searchQuery), [appointmentData.rows, searchQuery]);
  const filteredModules = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();
    if (!normalized) return modules;
    return modules.filter((module) =>
      [module.name, module.shortName, module.summary, module.detail].some((value) => value.toLowerCase().includes(normalized))
    );
  }, [searchQuery]);

  return (
    <div className="grid gap-4">
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3" aria-label="System modules">
        {filteredModules.map((module) => (
          <ModuleCard module={module} key={module.slug} />
        ))}
      </section>
      {filteredModules.length === 0 ? <DataState state="empty" message="No modules match the current search." /> : null}
      <section className="grid items-start gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title="Today's Schedule"
          eyebrow="Monthly calendar"
          action="Book Appointment"
          icon={CalendarDays}
          onAction={() => setModalModule(appointmentsModule)}
        >
          <DataState
            state={appointmentData.state === "loading" ? "loading" : scheduleRows.length ? "loaded" : "empty"}
            message="No appointments match the current search."
          >
            <DataTable
              columns={tableConfigs.appointments.columns}
              rows={scheduleRows}
              statusColumn={tableConfigs.appointments.statusColumn}
              rowAction={tableConfigs.appointments.rowAction}
            />
          </DataState>
        </Panel>
        <Panel title="Ward Occupancy" eyebrow="Indoor assets" icon={BedDouble}>
          <div className="grid gap-3">
            {wardRows.map(([ward, count, percent]) => (
              <div className="grid items-center gap-3 sm:grid-cols-[minmax(100px,1fr)_minmax(120px,44%)]" key={ward}>
                <div>
                  <strong className="block text-sm text-blue-950">{ward}</strong>
                  <small className="block text-slate-500">{count} occupied</small>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-blue-100" aria-label={`${ward} ${percent} occupied`}>
                  <span className="block h-full rounded-full bg-blue-700" style={{ width: percent }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Clinical Queue" eyebrow="Outpatient work" icon={Activity}>
          <StatusList items={[["Vaccine charts", "42"], ["Prescriptions", "87"], ["Investigations", "29"]]} />
        </Panel>
        <Panel title="Reports and Billing" eyebrow="Stakeholders" icon={ClipboardList}>
          <StatusList items={[["Billing reports", "14"], ["Medical reports", "22"], ["Pending invoices", "$31k"]]} />
        </Panel>
      </section>
      {modalModule ? (
        <ActionModal
          module={modalModule}
          onClose={() => setModalModule(null)}
          onSaved={() => {
            appointmentData.refresh();
            setModalModule(null);
          }}
        />
      ) : null}
    </div>
  );
}
