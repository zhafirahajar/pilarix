import { Module } from '@nestjs/common';
import { PekerjaanService } from './pekerjaan.service';
import { PekerjaanController } from './pekerjaan.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],  
  controllers: [PekerjaanController],
  providers: [PekerjaanService],
})
export class PekerjaanModule {}
