import type { FieldConfig } from "../types";

export function Field({
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

export function formFields(slug: string): FieldConfig[] {
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

export function defaultFormValues(slug: string): Record<string, string> {
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

export function buildPayload(slug: string, values: Record<string, string>) {
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
