import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { appointments, HospitalDb } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreateAppointmentDto } from "./appointments.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class AppointmentsService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async monthlyCalendar(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(appointments)
      .where(eq(appointments.hospitalId, hospitalId))
      .orderBy(desc(appointments.startsAt))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async schedule(appointment: CreateAppointmentDto, hospitalId: string) {
    if (new Date(appointment.endsAt) <= new Date(appointment.startsAt)) {
      throw new BadRequestException("Appointment end time must be after start time.");
    }

    const [created] = await this.db
      .insert(appointments)
      .values({
        ...appointment,
        hospitalId,
        startsAt: new Date(appointment.startsAt),
        endsAt: new Date(appointment.endsAt)
      })
      .returning();
    return created;
  }
}
