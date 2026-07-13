import { IsIn, IsNumberString, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";

export class CreateInvoiceDto {
  @IsUUID()
  patientId!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  invoiceNumber!: string;

  @IsNumberString()
  subtotal!: string;

  @IsOptional()
  @IsNumberString()
  tax?: string;

  @IsNumberString()
  total!: string;

  @IsOptional()
  @IsIn(["draft", "sent", "paid", "overdue", "void"])
  status?: "draft" | "sent" | "paid" | "overdue" | "void";
}
