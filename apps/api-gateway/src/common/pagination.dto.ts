import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 25;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;
}

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    limit: number;
    offset: number;
    count: number;
  };
};

export const paginate = <T>(data: T[], query: PaginationQueryDto): PaginatedResponse<T> => ({
  data,
  meta: {
    limit: query.limit,
    offset: query.offset,
    count: data.length
  }
});
