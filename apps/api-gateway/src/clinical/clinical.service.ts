import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { clinicalRecords, HospitalDb } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreateClinicalRecordDto } from "./clinical.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class ClinicalService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async records(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(clinicalRecords)
      .where(eq(clinicalRecords.hospitalId, hospitalId))
      .orderBy(desc(clinicalRecords.createdAt))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async createRecord(record: CreateClinicalRecordDto, hospitalId: string) {
    const [created] = await this.db.insert(clinicalRecords).values({ ...record, hospitalId }).returning();
    return created;
  }
}
