import { IsOptional, IsString } from 'class-validator';

export class UpdateAnalysisDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  unit?: string;
}