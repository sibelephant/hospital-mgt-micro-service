import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from "class-validator";

export class CreateIndoorAssetDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  ward!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(60)
  type!: string;

  @IsOptional()
  @IsIn(["available", "occupied", "maintenance", "reserved"])
  status?: "available" | "occupied" | "maintenance" | "reserved";

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsString()
  roundNote?: string;
}

export class UpdateIndoorAssetDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  ward?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  type?: string;

  @IsOptional()
  @IsIn(["available", "occupied", "maintenance", "reserved"])
  status?: "available" | "occupied" | "maintenance" | "reserved";

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsOptional()
  @IsString()
  roundNote?: string;
}
