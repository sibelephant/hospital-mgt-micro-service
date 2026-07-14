export function filterRows(rows: string[][], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return rows;
  return rows.filter((row) => row.some((cell) => cell.toLowerCase().includes(normalized)));
}

export function mapApiRows(slug: string, records: Record<string, unknown>[]) {
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

export function shortId(value: unknown) {
  const text = String(value ?? "");
  return text.length > 10 ? `${text.slice(0, 8)}...` : text;
}

export function formatTime(value: unknown) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(value: unknown) {
  const date = new Date(String(value ?? ""));
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString([], { month: "short", day: "2-digit" });
}
