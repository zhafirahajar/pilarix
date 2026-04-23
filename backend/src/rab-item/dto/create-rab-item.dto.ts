import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRabItemDto {
  @IsInt()
  pekerjaanId!: number;

  @IsInt()
  @IsOptional()
  analysisId?: number;

  @IsOptional()
  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsInt()
  level!: number;

  @IsInt()
  order!: number;

  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}