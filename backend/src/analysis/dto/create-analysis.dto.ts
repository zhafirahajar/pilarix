import { IsString, IsNotEmpty } from 'class-validator';

export class CreateAnalysisDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  unit: string;
}