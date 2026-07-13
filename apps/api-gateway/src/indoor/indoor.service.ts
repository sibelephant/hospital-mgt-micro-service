import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, eq } from "drizzle-orm";
import { HospitalDb, indoorAssets } from "@hospital/db";
import { DB } from "../db/db.module";
import { CreateIndoorAssetDto, UpdateIndoorAssetDto } from "./indoor.dto";
import { paginate, PaginationQueryDto } from "../common/pagination.dto";

@Injectable()
export class IndoorService {
  constructor(@Inject(DB) private readonly db: HospitalDb) {}

  async assets(query: PaginationQueryDto, hospitalId: string) {
    const data = await this.db
      .select()
      .from(indoorAssets)
      .where(eq(indoorAssets.hospitalId, hospitalId))
      .limit(query.limit)
      .offset(query.offset);
    return paginate(data, query);
  }

  async createAsset(asset: CreateIndoorAssetDto, hospitalId: string) {
    const [created] = await this.db.insert(indoorAssets).values({ ...asset, hospitalId }).returning();
    return created;
  }

  async updateAsset({ id, ...asset }: UpdateIndoorAssetDto, hospitalId: string) {
    const [updated] = await this.db
      .update(indoorAssets)
      .set({ ...asset, updatedAt: new Date() })
      .where(and(eq(indoorAssets.id, id), eq(indoorAssets.hospitalId, hospitalId)))
      .returning();
    if (!updated) throw new NotFoundException("Indoor asset not found.");
    return updated;
  }
}
