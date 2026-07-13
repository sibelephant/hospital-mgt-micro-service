import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { HospitalDb, invoices } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreateInvoiceDto } from "./accounting.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class AccountingService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async invoices(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.hospitalId, hospitalId))
      .orderBy(desc(invoices.issuedAt))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async createInvoice(invoice: CreateInvoiceDto, hospitalId: string) {
    const [created] = await this.db.insert(invoices).values({ ...invoice, hospitalId }).returning();
    return created;
  }
}
