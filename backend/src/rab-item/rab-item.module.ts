import { Module } from '@nestjs/common';
import { RabItemService } from './rab-item.service';
import { RabItemController } from './rab-item.controller';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  providers: [RabItemService],
  controllers: [RabItemController]
})
export class RabItemModule {}
