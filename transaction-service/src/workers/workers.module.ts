import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { WorkersService } from './workers.service';
import { ValidateProcessor } from './validate.worker';
import { EnrichProcessor } from './enrich.worker';
import { AnalyzeProcessor } from './analyze.worker';
import { QueueModule } from '../queue/queue.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'transaction-processing',
    }),
    QueueModule,
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
