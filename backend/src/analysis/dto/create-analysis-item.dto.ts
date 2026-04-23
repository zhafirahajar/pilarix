import { IsEnum, IsNumber } from 'class-validator';

export class CreateAnalysisItemDto {
  @IsNumber()
  materialId: number;

  @IsNumber()
  price: number;

  @IsNumber()
  coefficient: number;
}