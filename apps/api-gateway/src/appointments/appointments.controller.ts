import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AppointmentsService } from "./appointments.service";
import { CreateAppointmentDto } from "./appointments.dto";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("appointments")
export class AppointmentsController {
  constructor(private readonly appointments: AppointmentsService) {}

  @Get("calendar")
  @Roles("owner", "admin", "doctor", "nurse", "reception")
  calendar(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.appointments.monthlyCalendar(query, user.hospitalId);
  }

  @Post()
  @Roles("owner", "admin", "doctor", "nurse", "reception")
  schedule(@Body() appointment: CreateAppointmentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.appointments.schedule(appointment, user.hospitalId);
  }
}
