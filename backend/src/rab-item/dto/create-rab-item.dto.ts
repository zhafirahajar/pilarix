import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRabItemDto {
  @IsInt()
  pekerjaanId!: number;

  @IsOptional()
  @IsInt()
  analysisId?: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsInt()
  level!: number;

  @IsInt()
  order!: number;

  @IsOptional()
  @IsNumber()
  volume?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}