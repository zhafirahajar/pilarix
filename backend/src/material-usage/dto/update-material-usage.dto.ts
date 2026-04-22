// dto/update-material-usage.dto.ts
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateMaterialUsageDto {
  @IsOptional()
  @IsNumber()
  quantity?: number;
}