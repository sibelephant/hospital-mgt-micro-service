import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { PatientsService } from "./patients.service";
import { CreatePatientDto } from "./patients.dto";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("patients")
export class PatientsController {
  constructor(private readonly patients: PatientsService) {}

  @Get()
  @Roles("owner", "admin", "doctor", "nurse", "billing", "reception", "lab")
  list(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.patients.list(query, user.hospitalId);
  }

  @Post()
  @Roles("owner", "admin", "reception")
  register(@Body() patient: CreatePatientDto, @CurrentUser() user: AuthenticatedUser) {
    return this.patients.register(patient, user.hospitalId);
  }
}
