import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";
import { HospitalDb, patients } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreatePatientDto } from "./patients.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class PatientsService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async list(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(patients)
      .where(eq(patients.hospitalId, hospitalId))
      .orderBy(desc(patients.createdAt))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async register(patient: CreatePatientDto, hospitalId: string) {
    const [created] = await this.db.insert(patients).values({ ...patient, hospitalId }).returning();
    return created;
  }
}
