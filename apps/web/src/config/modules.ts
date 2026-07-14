import {
  BedDouble,
  CalendarDays,
  FileBarChart,
  HeartPulse,
  ReceiptText,
  UserPlus
} from "lucide-react";
import type { HospitalModule, TableConfig } from "../types";

export const modules: HospitalModule[] = [
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

export const tableConfigs: Record<string, TableConfig> = {
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

export const wardRows = [
  ["Ward A", "32/40", "80%"],
  ["Ward B", "21/35", "60%"],
  ["Pediatrics", "18/24", "75%"],
  ["OT", "3/5", "60%"]
];
