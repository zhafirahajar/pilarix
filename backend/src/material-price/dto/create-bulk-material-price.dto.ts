import { IsInt, IsNumber, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MaterialPriceItem {
  @IsInt()
  materialId: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateBulkMaterialPriceDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialPriceItem)
  items: MaterialPriceItem[];
}
