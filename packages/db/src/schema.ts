import {
  date,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const appointmentStatus = pgEnum("appointment_status", [
  "scheduled",
  "checked_in",
  "completed",
  "cancelled"
]);

export const resourceType = pgEnum("resource_type", ["doctor", "room", "equipment", "bed", "theatre"]);
export const reportType = pgEnum("report_type", ["billing", "medical", "operations"]);
export const assetStatus = pgEnum("asset_status", ["available", "occupied", "maintenance", "reserved"]);
export const invoiceStatus = pgEnum("invoice_status", ["draft", "sent", "paid", "overdue", "void"]);
export const userRole = pgEnum("user_role", ["owner", "admin", "doctor", "nurse", "billing", "reception", "lab"]);

export const hospitals = pgTable("hospitals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  email: varchar("email", { length: 160 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  role: userRole("role").default("admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  revokedAt: timestamp("revoked_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const patients = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  hospitalNumber: varchar("hospital_number", { length: 32 }).notNull().unique(),
  firstName: varchar("first_name", { length: 80 }).notNull(),
  lastName: varchar("last_name", { length: 80 }).notNull(),
  dateOfBirth: date("date_of_birth").notNull(),
  gender: varchar("gender", { length: 24 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  email: varchar("email", { length: 120 }),
  address: text("address"),
  emergencyContact: varchar("emergency_contact", { length: 120 }),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  type: resourceType("type").notNull(),
  location: varchar("location", { length: 120 }),
  status: assetStatus("status").default("available").notNull()
});

export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  resourceId: integer("resource_id").references(() => resources.id),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  reason: text("reason").notNull(),
  status: appointmentStatus("status").default("scheduled").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const reports = pgTable("reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  type: reportType("type").notNull(),
  stakeholder: varchar("stakeholder", { length: 120 }).notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const indoorAssets = pgTable("indoor_assets", {
  id: serial("id").primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  ward: varchar("ward", { length: 80 }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  status: assetStatus("status").default("available").notNull(),
  patientId: uuid("patient_id").references(() => patients.id),
  roundNote: text("round_note"),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const clinicalRecords = pgTable("clinical_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  visitType: varchar("visit_type", { length: 80 }).notNull(),
  vaccineChart: text("vaccine_chart"),
  prescription: text("prescription"),
  investigation: text("investigation"),
  diagnosis: text("diagnosis"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const invoices = pgTable("invoices", {
  id: uuid("id").defaultRandom().primaryKey(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id).notNull(),
  patientId: uuid("patient_id").references(() => patients.id).notNull(),
  invoiceNumber: varchar("invoice_number", { length: 40 }).notNull().unique(),
  subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 12, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 12, scale: 2 }).notNull(),
  status: invoiceStatus("status").default("draft").notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull()
});
