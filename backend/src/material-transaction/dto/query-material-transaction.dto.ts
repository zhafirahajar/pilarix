import { IsInt, IsOptional } from 'class-validator';

export class QueryMaterialTransactionDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsInt()
  materialId?: number;
}