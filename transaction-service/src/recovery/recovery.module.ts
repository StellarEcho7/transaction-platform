import { Module } from '@nestjs/common';
import { RecoveryWorker } from './recovery.worker';
import { OutboxModule } from '../outbox/outbox.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [OutboxModule, PrismaModule],
  providers: [RecoveryWorker],
  exports: [RecoveryWorker],
})
export class RecoveryModule {}
