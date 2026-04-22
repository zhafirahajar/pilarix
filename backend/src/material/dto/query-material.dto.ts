import { IsOptional, IsString } from 'class-validator';

export class QueryMaterialDto {
  @IsOptional()
  @IsString()
  search?: string;
}