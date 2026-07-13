import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ClinicalService } from "./clinical.service";
import { CreateClinicalRecordDto } from "./clinical.dto";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("clinical")
export class ClinicalController {
  constructor(private readonly clinical: ClinicalService) {}

  @Get("records")
  @Roles("owner", "admin", "doctor", "nurse", "lab")
  records(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clinical.records(query, user.hospitalId);
  }

  @Post("records")
  @Roles("owner", "admin", "doctor", "nurse", "lab")
  createRecord(@Body() record: CreateClinicalRecordDto, @CurrentUser() user: AuthenticatedUser) {
    return this.clinical.createRecord(record, user.hospitalId);
  }
}
