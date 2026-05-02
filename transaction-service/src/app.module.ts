import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BatchModule } from './batch/batch.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [PrismaModule, BatchModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}