import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkersService } from './workers.service';
import { ValidateProcessor } from './validate.processor';
import { EnrichProcessor } from './enrich.processor';
import { AnalyzeProcessor } from './analyze.processor';
import { QueueModule } from '../queue/queue.module';
import { OutboxModule } from '../outbox/outbox.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction-processing',
    }),
    QueueModule,
    OutboxModule,
    PrismaModule,
  ],
  providers: [
    WorkersService,
    ValidateProcessor,
    EnrichProcessor,
    AnalyzeProcessor,
  ],
  exports: [WorkersService],
})
export class WorkersModule {}
