// dto/create-material-usage.dto.ts
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMaterialUsageDto {
  @IsInt()
  materialId: number;

  @IsInt()
  rabItemId: number;

  @IsOptional()
  @IsInt()
  analysisItemId?: number;

  @IsNumber()
  coefficient: number;

  @IsString()
  unit: string;
}