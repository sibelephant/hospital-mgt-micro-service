import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Activity,
  AlertCircle,
  BedDouble,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Eye,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  UserPlus
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom";
import "./styles.css";

type ModuleTone = "blue" | "cyan" | "indigo" | "sky" | "teal" | "navy";
type StatusTone = "blue" | "green" | "amber" | "red" | "slate";
type DataStateName = "loaded" | "loading" | "empty" | "error";
type AuthSession = {
  token: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  user: {
    userId: string;
    hospitalId: string;
    email: string;
    role: string;
  };
  hospital: {
    id: string;
    name: string;
  };
};

type HospitalModule = {
  slug: string;
  name: string;
  shortName: string;
  metric: string;
  detail: string;
  summary: string;
  icon: LucideIcon;
  tone: ModuleTone;
  endpoint: string;
  action: string;
};

type TableConfig = {
  title: string;
  eyebrow: string;
  columns: string[];
  rows: string[][];
  statusColumn: number;
  rowAction: string;
};

const modules: HospitalModule[] = [
  {
    slug: "appointments",
    name: "Appointment Scheduler",
    shortName: "Appointments",
    metric: "128",
    detail: "monthly bookings",
    summary: "Monthly bookings, check-ins, cancellations, and resource assignment.",
    icon: CalendarDays,
    tone: "blue",
    endpoint: "/api/appointments/calendar",
    action: "Book Appointment"
  },
  {
    slug: "patients",
    name: "Patient Registration",
    shortName: "Patients",
    metric: "2,430",
    detail: "patient records",
    summary: "Patient demographics, hospital numbers, contact details, and quick references.",
    icon: UserPlus,
    tone: "cyan",
    endpoint: "/api/patients",
    action: "Register Patient"
  },
  {
    slug: "reports",
    name: "Reporting",
    shortName: "Reports",
    metric: "36",
    detail: "reports ready",
    summary: "Billing, medical, and operations reporting for stakeholders.",
    icon: FileBarChart,
    tone: "indigo",
    endpoint: "/api/reports",
    action: "Create Report"
  },
  {
    slug: "indoor",
    name: "Indoor Management",
    shortName: "Indoor",
    metric: "74%",
    detail: "bed occupancy",
    summary: "Beds, wards, theatre status, patient placement, and round notes.",
    icon: BedDouble,
    tone: "sky",
    endpoint: "/api/indoor/assets",
    action: "Assign Bed"
  },
  {
    slug: "clinical",
    name: "Clinical Modules",
    shortName: "Clinical",
    metric: "312",
    detail: "outpatient notes",
    summary: "Outpatient care, vaccine charts, prescriptions, tests, and investigations.",
    icon: HeartPulse,
    tone: "teal",
    endpoint: "/api/clinical/records",
    action: "Add Clinical Note"
  },
  {
    slug: "accounting",
    name: "Accounting",
    shortName: "Accounting",
    metric: "$184k",
    detail: "invoiced",
    summary: "Billing estimates, invoices, tax, payments, and account status.",
    icon: ReceiptText,
    tone: "navy",
    endpoint: "/api/accounting/invoices",
    action: "Create Invoice"
  }
];

const tableConfigs: Record<string, TableConfig> = {
  appointments: {
    title: "Appointment Calendar",
    eyebrow: "Bookings",
    columns: ["Time", "Patient", "Reason", "Resource", "Status"],
    rows: [
      ["09:00", "Maya Johnson", "Vaccination", "Dr. Patel", "scheduled"],
      ["10:30", "Leon Carter", "Investigation", "Lab 2", "checked in"],
      ["12:00", "Amina Bello", "Prescription review", "Room 8", "completed"],
      ["14:30", "Owen Smith", "Follow-up", "Dr. Chen", "scheduled"]
    ],
    statusColumn: 4,
    rowAction: "Open"
  },
  patients: {
    title: "Patient Directory",
    eyebrow: "Registration",
    columns: ["Hospital No.", "Patient", "Gender", "Phone", "Status"],
    rows: [
      ["HN-20491", "Maya Johnson", "Female", "0703 445 9812", "Active"],
      ["HN-20492", "Leon Carter", "Male", "0801 112 9021", "Active"],
      ["HN-20493", "Amina Bello", "Female", "0815 230 1188", "Follow-up"],
      ["HN-20494", "Owen Smith", "Male", "0909 811 4012", "New"]
    ],
    statusColumn: 4,
    rowAction: "Open"
  },
  reports: {
    title: "Report Queue",
    eyebrow: "Stakeholder reports",
    columns: ["Report ID", "Title", "Type", "Stakeholder", "Status"],
    rows: [
      ["RPT-1008", "Monthly billing summary", "Billing", "Finance", "Ready"],
      ["RPT-1009", "Malaria treatment outcomes", "Medical", "Clinical Board", "Draft"],
      ["RPT-1010", "Ward occupancy trend", "Operations", "Admin", "Sent"]
    ],
    statusColumn: 4,
    rowAction: "View"
  },
  indoor: {
    title: "Bed and Theatre Board",
    eyebrow: "Indoor assets",
    columns: ["Ward", "Asset", "Patient", "Status", "Round note"],
    rows: [
      ["Ward A", "Bed A-12", "Maya Johnson", "Occupied", "Round due 16:00"],
      ["Ward B", "Bed B-04", "Unassigned", "Available", "Cleaned"],
      ["Pediatrics", "Bed P-09", "Amina Bello", "Reserved", "Transfer pending"],
      ["OT", "Theatre 2", "Unassigned", "Maintenance", "Sterilization"]
    ],
    statusColumn: 3,
    rowAction: "Assign"
  },
  clinical: {
    title: "Clinical Encounter Queue",
    eyebrow: "Outpatient care",
    columns: ["Patient", "Visit Type", "Work Item", "Owner", "Status"],
    rows: [
      ["Maya Johnson", "Vaccination", "Vaccine chart", "Dr. Patel", "Open"],
      ["Leon Carter", "Investigation", "CBC and malaria test", "Lab 2", "In progress"],
      ["Amina Bello", "Prescription", "Medication review", "Dr. Chen", "Signed"]
    ],
    statusColumn: 4,
    rowAction: "Open"
  },
  accounting: {
    title: "Invoice Register",
    eyebrow: "Accounting",
    columns: ["Invoice", "Patient", "Total", "Status", "Issued"],
    rows: [
      ["INV-8021", "Maya Johnson", "$1,240.00", "Sent", "Jul 13"],
      ["INV-8022", "Leon Carter", "$420.00", "Paid", "Jul 12"],
      ["INV-8023", "Amina Bello", "$2,810.00", "Overdue", "Jul 08"],
      ["INV-8024", "Owen Smith", "$310.00", "Draft", "Jul 13"]
    ],
    statusColumn: 3,
    rowAction: "Open"
  }
};

const wardRows = [
  ["Ward A", "32/40", "80%"],
  ["Ward B", "21/35", "60%"],
  ["Pediatrics", "18/24", "75%"],
  ["OT", "3/5", "60%"]
];

const toneClasses: Record<ModuleTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
  teal: "bg-teal-50 text-teal-700 ring-teal-100",
  navy: "bg-slate-100 text-blue-900 ring-slate-200"
};

const statusClasses: Record<StatusTone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  red: "bg-rose-50 text-rose-700 ring-rose-200",
  slate: "bg-slate-100 text-slate-700 ring-slate-200"
};

const statusTone = (status: string): StatusTone => {
  const normalized = status.toLowerCase();
  if (["paid", "completed", "available", "ready", "sent", "signed", "active"].includes(normalized)) return "green";
  if (["scheduled", "checked in", "open", "in progress", "new"].includes(normalized)) return "blue";
  if (["draft", "reserved", "follow-up", "occupied"].includes(normalized)) return "amber";
  if (["overdue", "maintenance", "cancelled"].includes(normalized)) return "red";
  return "slate";
};

const filterRows = (rows: string[][], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rows;
  return rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(normalized)));
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

type ApiListResponse<T> = { data: T[]; meta?: { count: number; limit: number; offset: number } };

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const session = readStoredSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...init?.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401 && session?.refreshToken && path !== "/auth/refresh" && path !== "/auth/login") {
      const refreshed = await refreshSession(session.refreshToken);
      if (refreshed) {
        return apiRequest<T>(path, init);
      }
    }
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function refreshSession(refreshToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });
    if (!response.ok) throw new Error("Refresh failed");
    const session = (await response.json()) as AuthSession;
    window.localStorage.setItem("caregrid-auth", JSON.stringify(session));
    return session;
  } catch {
    window.localStorage.removeItem("caregrid-auth");
    return null;
  }
}

function readStoredSession(): AuthSession | null {
  const stored = window.localStorage.getItem("caregrid-auth");
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthSession;
  } catch {
    window.localStorage.removeItem("caregrid-auth");
    return null;
  }
}

function useApiRows(module: HospitalModule, externalRefreshKey = 0) {
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

function mapApiRows(slug: string, records: Record<string, unknown>[]) {
  if (slug === "appointments") {
    return records.map((record) => [
      formatTime(record.startsAt),
      shortId(record.patientId),
      String(record.reason ?? "Appointment"),
      record.resourceId ? `Resource ${record.resourceId}` : "Unassigned",
      String(record.status ?? "scheduled").replace("_", " ")
    ]);
  }
  if (slug === "patients") {
    return records.map((record) => [
      String(record.hospitalNumber ?? ""),
      `${record.firstName ?? ""} ${record.lastName ?? ""}`.trim(),
      String(record.gender ?? ""),
      String(record.phone ?? ""),
      "Active"
    ]);
  }
  if (slug === "reports") {
    return records.map((record) => [
      shortId(record.id),
      String(record.title ?? ""),
      String(record.type ?? ""),
      String(record.stakeholder ?? ""),
      "Ready"
    ]);
  }
  if (slug === "indoor") {
    return records.map((record) => [
      String(record.ward ?? ""),
      String(record.name ?? ""),
      record.patientId ? shortId(record.patientId) : "Unassigned",
      String(record.status ?? ""),
      String(record.roundNote ?? "")
    ]);
  }
  if (slug === "clinical") {
    return records.map((record) => [
      shortId(record.patientId),
      String(record.visitType ?? ""),
      String(record.investigation ?? record.prescription ?? record.vaccineChart ?? "Clinical note"),
      "Care team",
      "Open"
    ]);
  }
  return records.map((record) => [
    String(record.invoiceNumber ?? ""),
    shortId(record.patientId),
    `$${record.total ?? "0.00"}`,
    String(record.status ?? ""),
    formatDate(record.issuedAt)
  ]);
}

function shortId(value: unknown) {
  const text = String(value ?? "");
  return text.length > 10 ? `${text.slice(0, 8)}...` : text;
}

function formatTime(value: unknown) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(value: unknown) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString([], { month: "short", day: "2-digit" });
}

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [session, setSession] = useState<AuthSession | null>(() => readStoredSession());

  if (!session) {
    return <LoginScreen onAuthenticated={setSession} />;
  }

  return (
    <BrowserRouter>
      <main className="grid min-h-screen grid-cols-1 bg-slate-50 text-slate-900 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Sidebar />
        <section className="min-w-0 p-4 sm:p-6 lg:p-7">
          <Topbar
            searchQuery={searchQuery}
            session={session}
            onLogout={async () => {
              try {
                await apiRequest("/auth/logout", {
                  method: "POST",
                  body: JSON.stringify({ refreshToken: session.refreshToken })
                });
              } catch {
                // Local logout still clears stale credentials if the server is unavailable.
              }
              window.localStorage.removeItem("caregrid-auth");
              setSession(null);
            }}
            onSearchChange={setSearchQuery}
          />
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/modules/:slug" element={<ModuleDetail searchQuery={searchQuery} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
}

function LoginScreen({ onAuthenticated }: { onAuthenticated: (session: AuthSession) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [values, setValues] = useState({
    hospitalName: "CareGrid General Hospital",
    hospitalSlug: "caregrid-general",
    firstName: "CareGrid",
    lastName: "Admin",
    email: "admin@caregrid.test",
    password: "admin12345"
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateValue = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4">
      <section className="w-full max-w-xl rounded-lg border border-blue-100 bg-white p-6 shadow-[0_20px_50px_rgba(16,56,112,0.12)]">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-blue-700 text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Hospital access</p>
            <h1 className="text-2xl font-extrabold text-blue-950">CareGrid</h1>
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 rounded-lg bg-blue-50 p-1">
          {(["login", "register"] as const).map((item) => (
            <button
              className={`rounded-md px-3 py-2 text-sm font-bold ${mode === item ? "bg-white text-blue-800 shadow-sm" : "text-slate-600"}`}
              key={item}
              onClick={() => setMode(item)}
              type="button"
            >
              {item === "login" ? "Login" : "Register Hospital"}
            </button>
          ))}
        </div>
        <form
          className="grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            setIsSubmitting(true);
            try {
              const session = await apiRequest<AuthSession>(
                mode === "login" ? "/auth/login" : "/auth/register-hospital",
                {
                  method: "POST",
                  body: JSON.stringify(
                    mode === "login"
                      ? { email: values.email, password: values.password }
                      : {
                          hospitalName: values.hospitalName,
                          hospitalSlug: values.hospitalSlug,
                          firstName: values.firstName,
                          lastName: values.lastName,
                          email: values.email,
                          password: values.password
                        }
                  )
                }
              );
              window.localStorage.setItem("caregrid-auth", JSON.stringify(session));
              onAuthenticated(session);
            } catch {
              setError("Authentication failed. Check the credentials or hospital registration values.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {mode === "register" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <AuthField label="Hospital name" name="hospitalName" value={values.hospitalName} onChange={updateValue} />
              <AuthField label="Hospital slug" name="hospitalSlug" value={values.hospitalSlug} onChange={updateValue} />
              <AuthField label="First name" name="firstName" value={values.firstName} onChange={updateValue} />
              <AuthField label="Last name" name="lastName" value={values.lastName} onChange={updateValue} />
            </div>
          ) : null}
          <AuthField label="Email" name="email" type="email" value={values.email} onChange={updateValue} />
          <AuthField label="Password" name="password" type="password" value={values.password} onChange={updateValue} />
          {error ? <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</div> : null}
          <button
            className="min-h-11 rounded-lg bg-blue-700 px-4 text-sm font-extrabold text-white hover:bg-blue-800 disabled:bg-blue-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Please wait" : mode === "login" ? "Login" : "Create Hospital"}
          </button>
        </form>
      </section>
    </main>
  );
}

function AuthField({
  label,
  name,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-blue-950">
      {label}
      <input
        className="min-h-10 rounded-lg border border-blue-100 px-3 font-normal text-slate-800 outline-none focus:border-blue-400"
        onChange={(event) => onChange(name, event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

function Sidebar() {
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

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "grid min-h-11 grid-cols-[20px_minmax(0,1fr)] items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-blue-50 outline-none transition",
    "hover:bg-white/15 focus-visible:bg-white/15",
    isActive ? "bg-white/20 text-white shadow-sm" : ""
  ].join(" ");
}

function Topbar({
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

function Dashboard({ searchQuery }: { searchQuery: string }) {
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

function ModuleCard({ module }: { module: HospitalModule }) {
  const Icon = module.icon;
  return (
    <NavLink
      to={`/modules/${module.slug}`}
      className="grid min-h-[112px] grid-cols-[44px_minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-blue-100 bg-white p-4 shadow-[0_10px_24px_rgba(16,56,112,0.07)] transition hover:-translate-y-0.5 hover:border-blue-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
    >
      <div className={`grid h-10 w-10 place-items-center rounded-lg ring-1 ${toneClasses[module.tone]}`}>
        <Icon size={21} />
      </div>
      <div className="min-w-0">
        <h2 className="truncate text-sm font-extrabold text-blue-950">{module.name}</h2>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{module.summary}</p>
      </div>
      <div className="text-right">
        <strong className="block text-2xl text-blue-950">{module.metric}</strong>
        <span className="text-xs text-slate-500">{module.detail}</span>
      </div>
    </NavLink>
  );
}

function ModuleDetail({ searchQuery }: { searchQuery: string }) {
  const { slug } = useParams();
  const module = modules.find((item) => item.slug === slug);
  const [modalModule, setModalModule] = useState<HospitalModule | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  if (!module) return <Navigate to="/" replace />;

  const Icon = module.icon;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <NavLink className="font-semibold text-blue-700" to="/">
          Dashboard
        </NavLink>
        <ChevronRight size={16} />
        <span>{module.name}</span>
      </div>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(16,56,112,0.07)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ring-1 ${toneClasses[module.tone]}`}>
              <Icon size={24} />
            </div>
            <div>
              <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Module workspace</p>
              <h2 className="text-2xl font-extrabold text-blue-950">{module.name}</h2>
              <p className="mt-1 max-w-3xl text-slate-600">{module.summary}</p>
            </div>
          </div>
          <button
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-800 sm:w-auto"
            onClick={() => setModalModule(module)}
            type="button"
          >
            <Plus size={17} />
            {module.action}
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <ModuleWorkspace
          module={module}
          refreshKey={refreshKey}
          searchQuery={searchQuery}
          onAction={() => setModalModule(module)}
        />
        <aside className="grid content-start gap-4">
          <MetricPanel module={module} />
          <WorkflowPanel module={module} />
        </aside>
      </section>
      {modalModule ? (
        <ActionModal
          module={modalModule}
          onClose={() => setModalModule(null)}
          onSaved={() => {
            setRefreshKey((value) => value + 1);
            setModalModule(null);
          }}
        />
      ) : null}
    </div>
  );
}

function ModuleWorkspace({
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

function Panel({
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

function DataTable({
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

function StatusBadge({ label }: { label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[statusTone(label)]}`}>
      {label}
    </span>
  );
}

function StatusList({ items }: { items: string[][] }) {
  return (
    <ul className="m-0 grid list-none gap-0 p-0">
      {items.map(([label, value]) => (
        <li className="flex justify-between gap-4 border-b border-blue-100 py-3 last:border-b-0" key={label}>
          <span className="text-slate-500">{label}</span>
          <strong>{value}</strong>
        </li>
      ))}
    </ul>
  );
}

function MetricPanel({ module }: { module: HospitalModule }) {
  return (
    <article className="rounded-lg border border-blue-100 bg-white p-5 shadow-[0_10px_24px_rgba(16,56,112,0.07)]">
      <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">Current metric</p>
      <strong className="block text-4xl text-blue-950">{module.metric}</strong>
      <span className="text-slate-500">{module.detail}</span>
      <div className="mt-6 rounded-lg bg-blue-700 p-4 text-white">
        <p className="mb-2 text-sm font-bold">Primary workflow</p>
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="text-blue-50">{module.action}</span>
          <StatusBadge label="Active" />
        </div>
      </div>
    </article>
  );
}

function WorkflowPanel({ module }: { module: HospitalModule }) {
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

function DataState({
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

function ActionModal({
  module,
  onClose,
  onSaved
}: {
  module: HospitalModule;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(defaultFormValues(module.slug));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const fields = formFields(module.slug);

  const updateValue = (name: string, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <section className="w-full max-w-xl rounded-lg bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-blue-100 p-5">
          <div>
            <p className="mb-1 text-xs font-extrabold uppercase text-slate-500">{module.shortName}</p>
            <h2 className="text-xl font-extrabold text-blue-950">{module.action}</h2>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100" onClick={onClose} type="button" aria-label="Close modal">
            <X size={18} />
          </button>
        </div>
        <form
          className="grid gap-4 p-5"
          onSubmit={async (event) => {
            event.preventDefault();
            setState("saving");
            try {
              await apiRequest(module.endpoint.replace("/calendar", ""), {
                method: "POST",
                body: JSON.stringify(buildPayload(module.slug, values))
              });
              setState("saved");
              onSaved();
            } catch {
              setState("error");
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.slice(0, 2).map((field) => (
              <Field
                field={field}
                key={field.name}
                value={values[field.name] ?? ""}
                onChange={(value) => updateValue(field.name, value)}
              />
            ))}
          </div>
          {fields.slice(2).map((field) => (
            <Field
              field={field}
              key={field.name}
              value={values[field.name] ?? ""}
              onChange={(value) => updateValue(field.name, value)}
            />
          ))}
          <label className="grid gap-1.5 text-sm font-bold text-blue-950">
            Notes
            <textarea
              className="min-h-24 rounded-lg border border-blue-100 px-3 py-2 font-normal text-slate-800 outline-none focus:border-blue-400"
              onChange={(event) => updateValue("notes", event.target.value)}
              placeholder="Add operational notes"
              value={values.notes ?? ""}
            />
          </label>
          {state === "saved" ? <div className="rounded-lg bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">Record saved.</div> : null}
          {state === "error" ? (
            <div className="rounded-lg bg-rose-50 p-3 text-sm font-semibold text-rose-700">
              Save failed. Check required fields and API connectivity.
            </div>
          ) : null}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button className="min-h-10 rounded-lg px-4 text-sm font-bold text-slate-600 hover:bg-slate-100" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={state === "saving"}
              type="submit"
            >
              <Plus size={17} />
              {state === "saving" ? "Saving" : "Save"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
};

function Field({
  field,
  value,
  onChange
}: {
  field: FieldConfig;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-bold text-blue-950">
      {field.label}
      <input
        className="min-h-10 rounded-lg border border-blue-100 px-3 font-normal text-slate-800 outline-none focus:border-blue-400"
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        type={field.type ?? "text"}
        value={value}
      />
    </label>
  );
}

function formFields(slug: string): FieldConfig[] {
  if (slug === "patients") {
    return [
      { name: "hospitalNumber", label: "Hospital number", placeholder: "HN-20495" },
      { name: "firstName", label: "First name", placeholder: "Jane" },
      { name: "lastName", label: "Last name", placeholder: "Doe" },
      { name: "dateOfBirth", label: "Date of birth", placeholder: "1990-01-01", type: "date" },
      { name: "gender", label: "Gender", placeholder: "Female" },
      { name: "phone", label: "Phone", placeholder: "0800 000 0000" }
    ];
  }
  if (slug === "reports") {
    return [
      { name: "title", label: "Report title", placeholder: "Monthly billing summary" },
      { name: "type", label: "Type", placeholder: "billing" },
      { name: "stakeholder", label: "Stakeholder", placeholder: "Finance" },
      { name: "summary", label: "Summary", placeholder: "Short report summary" }
    ];
  }
  if (slug === "indoor") {
    return [
      { name: "name", label: "Asset", placeholder: "Bed A-13" },
      { name: "ward", label: "Ward", placeholder: "Ward A" },
      { name: "type", label: "Type", placeholder: "bed" },
      { name: "status", label: "Status", placeholder: "available" }
    ];
  }
  if (slug === "accounting") {
    return [
      { name: "patientId", label: "Patient ID", placeholder: "UUID" },
      { name: "invoiceNumber", label: "Invoice number", placeholder: "INV-8025" },
      { name: "subtotal", label: "Subtotal", placeholder: "100.00" },
      { name: "tax", label: "Tax", placeholder: "0.00" },
      { name: "total", label: "Total", placeholder: "100.00" },
      { name: "status", label: "Status", placeholder: "draft" }
    ];
  }
  if (slug === "clinical") {
    return [
      { name: "patientId", label: "Patient ID", placeholder: "UUID" },
      { name: "visitType", label: "Visit type", placeholder: "Follow-up" },
      { name: "diagnosis", label: "Diagnosis", placeholder: "Clinical assessment" },
      { name: "prescription", label: "Prescription", placeholder: "Medication notes" }
    ];
  }
  return [
    { name: "patientId", label: "Patient ID", placeholder: "UUID" },
    { name: "startsAt", label: "Starts at", placeholder: "2026-07-13T15:30:00.000Z", type: "datetime-local" },
    { name: "endsAt", label: "Ends at", placeholder: "2026-07-13T16:00:00.000Z", type: "datetime-local" },
    { name: "reason", label: "Reason", placeholder: "Follow-up" }
  ];
}

function defaultFormValues(slug: string): Record<string, string> {
  if (slug === "patients") {
    return { dateOfBirth: "1990-01-01", gender: "Female" };
  }
  if (slug === "reports") {
    return { type: "billing" };
  }
  if (slug === "indoor") {
    return { type: "bed", status: "available" };
  }
  if (slug === "accounting") {
    return { subtotal: "0.00", tax: "0.00", total: "0.00", status: "draft" };
  }
  if (slug === "appointments") {
    return { startsAt: "2026-07-13T15:30", endsAt: "2026-07-13T16:00" };
  }
  return {};
}

function buildPayload(slug: string, values: Record<string, string>) {
  if (slug === "patients") {
    return {
      hospitalNumber: values.hospitalNumber,
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      phone: values.phone
    };
  }
  if (slug === "reports") {
    return { title: values.title, type: values.type, stakeholder: values.stakeholder, summary: values.summary };
  }
  if (slug === "indoor") {
    return { name: values.name, ward: values.ward, type: values.type, status: values.status, roundNote: values.notes };
  }
  if (slug === "clinical") {
    return {
      patientId: values.patientId,
      visitType: values.visitType,
      diagnosis: values.diagnosis,
      prescription: values.prescription
    };
  }
  if (slug === "accounting") {
    return {
      patientId: values.patientId,
      invoiceNumber: values.invoiceNumber,
      subtotal: values.subtotal,
      tax: values.tax,
      total: values.total,
      status: values.status
    };
  }
  return {
    patientId: values.patientId,
    startsAt: new Date(values.startsAt).toISOString(),
    endsAt: new Date(values.endsAt).toISOString(),
    reason: values.reason
  };
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
