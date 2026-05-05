import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ValidateProcessor } from './validate.processor';
import { EnrichProcessor } from './enrich.processor';
import { AnalyzeProcessor } from './analyze.processor';
import { QueueModule } from '../queue/queue.module';
import { OutboxModule } from '../outbox/outbox.module';
import { BatchModule } from '../batch/batch.module';
import { TransactionModule } from '../transaction/transaction.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QUEUE_NAME } from '../queue/constants';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QUEUE_NAME,
    }),
    QueueModule,
    OutboxModule,
    BatchModule,
    TransactionModule,
    PrismaModule,
  ],
  providers: [ValidateProcessor, EnrichProcessor, AnalyzeProcessor],
  exports: [],
})
export class WorkersModule {}
