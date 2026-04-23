import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { RabItemModule } from './rab-item/rab-item.module';
import { PekerjaanModule } from './pekerjaan/pekerjaan.module';
import { MaterialModule } from './material/material.module';
import { MaterialTransactionModule } from './material-transaction/material-transaction.module';
import { MaterialUsageModule } from './material-usage/material-usage.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    ProjectModule,
    RabItemModule,
    PekerjaanModule,
    MaterialModule,
    MaterialTransactionModule,
    MaterialUsageModule,
    AnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}


