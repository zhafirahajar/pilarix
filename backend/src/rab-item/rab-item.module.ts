import { Module } from '@nestjs/common';
import { RabItemService } from './rab-item.service';
import { RabItemController } from './rab-item.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MaterialPriceModule } from '../material-price/material-price.module';

@Module({
  imports: [PrismaModule, MaterialPriceModule],
  providers: [RabItemService],
  controllers: [RabItemController],
})
export class RabItemModule {}
