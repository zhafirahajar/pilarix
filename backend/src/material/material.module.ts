import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
