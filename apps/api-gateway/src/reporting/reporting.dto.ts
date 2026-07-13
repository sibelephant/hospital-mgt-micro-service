import { IsIn, IsString, MaxLength, MinLength } from "class-validator";

export class CreateReportDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsIn(["billing", "medical", "operations"])
  type!: "billing" | "medical" | "operations";

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  stakeholder!: string;

  @IsString()
  @MinLength(2)
  summary!: string;
}
