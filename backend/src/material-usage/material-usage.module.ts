// material-usage.module.ts
import { Module } from '@nestjs/common';
import { MaterialUsageService } from './material-usage.service';
import { MaterialUsageController } from './material-usage.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [MaterialUsageController],
  providers: [MaterialUsageService],
  imports: [PrismaModule],
})
export class MaterialUsageModule {}