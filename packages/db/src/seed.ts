import { count } from "drizzle-orm";
import { hash } from "bcryptjs";
import { createDb } from "./client";
import {
  appointments,
  clinicalRecords,
  hospitals,
  indoorAssets,
  invoices,
  patients,
  reports,
  resources,
  users
} from "./schema";

const db = createDb(process.env.DATABASE_URL ?? "postgres://hospital:hospital@localhost:5433/hospital");

async function hasRows(table: Parameters<typeof db.select>[0] extends never ? never : any) {
  const [result] = await db.select({ value: count() }).from(table);
  return Number(result.value) > 0;
}

async function seed() {
  if (!(await hasRows(hospitals))) {
    await db.insert(hospitals).values({ name: "CareGrid General Hospital", slug: "caregrid-general" });
  }

  const [hospital] = await db.select().from(hospitals).limit(1);
  if (!hospital) throw new Error("Unable to create demo hospital.");

  if (!(await hasRows(users))) {
    await db.insert(users).values({
      hospitalId: hospital.id,
      email: "admin@caregrid.test",
      passwordHash: await hash("admin12345", 12),
      firstName: "CareGrid",
      lastName: "Admin",
      role: "owner"
    });
  }

  if (!(await hasRows(patients))) {
    await db.insert(patients).values([
      {
        hospitalId: hospital.id,
        hospitalNumber: "HN-20491",
        firstName: "Maya",
        lastName: "Johnson",
        dateOfBirth: "1992-04-11",
        gender: "Female",
        phone: "0703 445 9812",
        email: "maya.johnson@example.com",
        emergencyContact: "Evan Johnson"
      },
      {
        hospitalId: hospital.id,
        hospitalNumber: "HN-20492",
        firstName: "Leon",
        lastName: "Carter",
        dateOfBirth: "1988-09-20",
        gender: "Male",
        phone: "0801 112 9021",
        email: "leon.carter@example.com",
        emergencyContact: "Nia Carter"
      },
      {
        hospitalId: hospital.id,
        hospitalNumber: "HN-20493",
        firstName: "Amina",
        lastName: "Bello",
        dateOfBirth: "1996-02-18",
        gender: "Female",
        phone: "0815 230 1188",
        email: "amina.bello@example.com",
        emergencyContact: "Sani Bello"
      }
    ]);
  }

  if (!(await hasRows(resources))) {
    await db.insert(resources).values([
      { hospitalId: hospital.id, name: "Dr. Patel", type: "doctor", location: "Outpatient Clinic" },
      { hospitalId: hospital.id, name: "Lab 2", type: "room", location: "Diagnostics" },
      { hospitalId: hospital.id, name: "Room 8", type: "room", location: "Outpatient Clinic" },
      { hospitalId: hospital.id, name: "Theatre 2", type: "theatre", location: "Surgery", status: "maintenance" }
    ]);
  }

  const patientRows = await db.select().from(patients).limit(3);
  const resourceRows = await db.select().from(resources).limit(3);
  if (patientRows.length < 3 || resourceRows.length < 3) return;

  if (!(await hasRows(appointments))) {
    await db.insert(appointments).values([
      {
        hospitalId: hospital.id,
        patientId: patientRows[0].id,
        resourceId: resourceRows[0].id,
        startsAt: new Date("2026-07-13T09:00:00.000Z"),
        endsAt: new Date("2026-07-13T09:30:00.000Z"),
        reason: "Vaccination"
      },
      {
        hospitalId: hospital.id,
        patientId: patientRows[1].id,
        resourceId: resourceRows[1].id,
        startsAt: new Date("2026-07-13T10:30:00.000Z"),
        endsAt: new Date("2026-07-13T11:00:00.000Z"),
        reason: "Investigation",
        status: "checked_in"
      }
    ]);
  }

  if (!(await hasRows(reports))) {
    await db.insert(reports).values([
      {
        hospitalId: hospital.id,
        title: "Monthly billing summary",
        type: "billing",
        stakeholder: "Finance",
        summary: "Billing totals and collections summary for the month."
      },
      {
        hospitalId: hospital.id,
        title: "Ward occupancy trend",
        type: "operations",
        stakeholder: "Administration",
        summary: "Indoor asset occupancy and bed utilization trend."
      }
    ]);
  }

  if (!(await hasRows(indoorAssets))) {
    await db.insert(indoorAssets).values([
      {
        hospitalId: hospital.id,
        name: "Bed A-12",
        ward: "Ward A",
        type: "bed",
        status: "occupied",
        patientId: patientRows[0].id,
        roundNote: "Round due 16:00"
      },
      {
        hospitalId: hospital.id,
        name: "Bed B-04",
        ward: "Ward B",
        type: "bed",
        status: "available",
        roundNote: "Cleaned"
      },
      {
        hospitalId: hospital.id,
        name: "Theatre 2",
        ward: "OT",
        type: "theatre",
        status: "maintenance",
        roundNote: "Sterilization"
      }
    ]);
  }

  if (!(await hasRows(clinicalRecords))) {
    await db.insert(clinicalRecords).values([
      {
        hospitalId: hospital.id,
        patientId: patientRows[0].id,
        visitType: "Vaccination",
        vaccineChart: "Adult booster schedule",
        diagnosis: "Routine immunization"
      },
      {
        hospitalId: hospital.id,
        patientId: patientRows[1].id,
        visitType: "Investigation",
        investigation: "CBC and malaria test",
        diagnosis: "Pending lab review"
      }
    ]);
  }

  if (!(await hasRows(invoices))) {
    await db.insert(invoices).values([
      {
        hospitalId: hospital.id,
        patientId: patientRows[0].id,
        invoiceNumber: "INV-8021",
        subtotal: "1240.00",
        tax: "0.00",
        total: "1240.00",
        status: "sent"
      },
      {
        hospitalId: hospital.id,
        patientId: patientRows[1].id,
        invoiceNumber: "INV-8022",
        subtotal: "420.00",
        tax: "0.00",
        total: "420.00",
        status: "paid"
      }
    ]);
  }
}

seed()
  .then(() => {
    console.log("Seed data is ready.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
