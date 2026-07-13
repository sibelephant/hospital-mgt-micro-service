import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePatientDto {
  @IsString()
  @MaxLength(32)
  hospitalNumber!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName!: string;

  @IsDateString()
  dateOfBirth!: string;

  @IsString()
  @MaxLength(24)
  gender!: string;

  @IsString()
  @MaxLength(32)
  phone!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  emergencyContact?: string;
}
