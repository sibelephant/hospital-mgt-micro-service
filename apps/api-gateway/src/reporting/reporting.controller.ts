import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { CreateReportDto } from "./reporting.dto";
import { ReportingService } from "./reporting.service";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("reports")
export class ReportingController {
  constructor(private readonly reporting: ReportingService) {}

  @Get()
  @Roles("owner", "admin", "billing")
  list(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reporting.list(query, user.hospitalId);
  }

  @Post()
  @Roles("owner", "admin")
  create(@Body() report: CreateReportDto, @CurrentUser() user: AuthenticatedUser) {
    return this.reporting.create(report, user.hospitalId);
  }
}
