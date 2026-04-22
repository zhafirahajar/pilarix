import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class CreateMaterialTransactionDto {
  @IsInt()
  materialId: number;

  @IsInt()
  projectId: number;

  @IsOptional()
  @IsInt()
  pekerjaanId?: number;

  @IsOptional()
  @IsInt()
  rabItemId?: number;

  @IsNumber()
  quantity: number;

  @IsEnum(TransactionType)
  type: TransactionType;

  @IsOptional()
  @IsString()
  note?: string;
}