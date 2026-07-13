import { Module } from "@nestjs/common";
import { APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { DbModule } from "./db/db.module";
import { PatientsModule } from "./patients/patients.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { ReportingModule } from "./reporting/reporting.module";
import { IndoorModule } from "./indoor/indoor.module";
import { ClinicalModule } from "./clinical/clinical.module";
import { AccountingModule } from "./accounting/accounting.module";
import { DashboardController } from "./dashboard.controller";
import { AuthModule } from "./auth/auth.module";
import { JwtAuthGuard } from "./common/jwt-auth.guard";
import { AuditInterceptor } from "./common/audit.interceptor";
import { RolesGuard } from "./common/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    PatientsModule,
    AppointmentsModule,
    ReportingModule,
    IndoorModule,
    ClinicalModule,
    AccountingModule,
    AuthModule
  ],
  controllers: [DashboardController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor
    }
  ]
})
export class AppModule {}
