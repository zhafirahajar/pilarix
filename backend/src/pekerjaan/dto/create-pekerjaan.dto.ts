import { IsInt, IsString } from 'class-validator';

export class CreatePekerjaanDto {
  @IsString()
  name: string;

  @IsInt()
  projectId: number;
}