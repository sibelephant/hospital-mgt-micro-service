import { IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateClinicalRecordDto {
  @IsUUID()
  patientId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(80)
  visitType!: string;

  @IsOptional()
  @IsString()
  vaccineChart?: string;

  @IsOptional()
  @IsString()
  prescription?: string;

  @IsOptional()
  @IsString()
  investigation?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;
}
