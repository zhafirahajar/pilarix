import { Module } from '@nestjs/common';
import { MaterialPriceService } from './material-price.service';
import { MaterialPriceController } from './material-price.controller';
import { MaterialPriceCalculatorService } from './material-price-calculator.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialPriceController],
  providers: [MaterialPriceService, MaterialPriceCalculatorService],
  exports: [MaterialPriceCalculatorService],
})
export class MaterialPriceModule {}
