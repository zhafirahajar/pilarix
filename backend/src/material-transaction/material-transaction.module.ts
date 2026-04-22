import { Module } from '@nestjs/common';
import { MaterialTransactionService } from './material-transaction.service';
import { MaterialTransactionController } from './material-transaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MaterialTransactionController],
  providers: [MaterialTransactionService],
})
export class MaterialTransactionModule {}
