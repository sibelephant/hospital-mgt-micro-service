import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { AccountingService } from "./accounting.service";
import { CreateInvoiceDto } from "./accounting.dto";
import { PaginationQueryDto } from "../common/pagination.dto";
import { CurrentUser } from "../common/current-user.decorator";
import { AuthenticatedUser } from "../common/auth.types";
import { Roles } from "../common/roles.decorator";

@Controller("accounting")
export class AccountingController {
  constructor(private readonly accounting: AccountingService) {}

  @Get("invoices")
  @Roles("owner", "admin", "billing")
  invoices(@Query() query: PaginationQueryDto, @CurrentUser() user: AuthenticatedUser) {
    return this.accounting.invoices(query, user.hospitalId);
  }

  @Post("invoices")
  @Roles("owner", "admin", "billing")
  createInvoice(@Body() invoice: CreateInvoiceDto, @CurrentUser() user: AuthenticatedUser) {
    return this.accounting.createInvoice(invoice, user.hospitalId);
  }
}
