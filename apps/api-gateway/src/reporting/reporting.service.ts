import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { HospitalDb, reports } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreateReportDto } from "./reporting.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class ReportingService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async list(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(reports)
      .where(eq(reports.hospitalId, hospitalId))
      .orderBy(desc(reports.createdAt))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async create(report: CreateReportDto, hospitalId: string) {
    const [created] = await this.db.insert(reports).values({ ...report, hospitalId }).returning();
    return created;
  }
}
