import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { MaterialItemType } from '@prisma/client';

export class CreateMaterialDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsEnum(MaterialItemType)
  @IsNotEmpty()
  type: MaterialItemType;
}