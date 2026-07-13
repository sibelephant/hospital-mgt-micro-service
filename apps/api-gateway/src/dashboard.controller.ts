import { Controller, Get, Inject } from "@nestjs/common";
import { count, eq } from "drizzle-orm";
import { appointments, clinicalRecords, HospitalDb, indoorAssets, invoices, patients, reports } from "@hospital/db";
import { DB } from "./db/db.module";
import { CurrentUser } from "./common/current-user.decorator";
import { AuthenticatedUser } from "./common/auth.types";
import { Roles } from "./common/roles.decorator";

@Controller("dashboard")
export class DashboardController {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  @Get()
  @Roles("owner", "admin", "doctor", "nurse", "billing", "reception", "lab")
  async getSummary(@CurrentUser() user: AuthenticatedUser) {
    const [[patientCount], [appointmentCount], [reportCount], [assetCount], [clinicalCount], [invoiceCount]] =
      await Promise.all([
        this.db.select({ value: count() }).from(patients).where(eq(patients.hospitalId, user.hospitalId)),
        this.db.select({ value: count() }).from(appointments).where(eq(appointments.hospitalId, user.hospitalId)),
        this.db.select({ value: count() }).from(reports).where(eq(reports.hospitalId, user.hospitalId)),
        this.db.select({ value: count() }).from(indoorAssets).where(eq(indoorAssets.hospitalId, user.hospitalId)),
        this.db.select({ value: count() }).from(clinicalRecords).where(eq(clinicalRecords.hospitalId, user.hospitalId)),
        this.db.select({ value: count() }).from(invoices).where(eq(invoices.hospitalId, user.hospitalId))
      ]);

    return {
      modules: [
        { name: "Appointment Scheduler", status: "active", metric: `${appointmentCount.value} bookings` },
        { name: "Patient Registration", status: "active", metric: `${patientCount.value} patient records` },
        { name: "Reporting", status: "active", metric: `${reportCount.value} stakeholder reports` },
        { name: "Indoor Management", status: "active", metric: `${assetCount.value} indoor assets` },
        { name: "Clinical Modules", status: "active", metric: `${clinicalCount.value} outpatient notes` },
        { name: "Accounting", status: "active", metric: `${invoiceCount.value} invoices` }
      ]
    };
  }
}
