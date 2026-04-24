import { Module } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { MaterialPriceModule } from '../material-price/material-price.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [MaterialPriceModule, PrismaModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
})
export class AnalysisModule {}