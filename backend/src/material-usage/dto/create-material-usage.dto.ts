// dto/create-material-usage.dto.ts
import { IsInt, IsNumber } from 'class-validator';

export class CreateMaterialUsageDto {
  @IsInt()
  materialId: number;

  @IsNumber()
  quantity: number;
}