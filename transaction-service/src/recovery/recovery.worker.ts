import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
import {
  RECOVERY_POLL_INTERVAL_MS,
  DEDUPLICATION_INTERVAL_MS,
} from '../shared/constants';

@Injectable()
export class RecoveryWorker {
  private readonly logger = new Logger(RecoveryWorker.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  @Interval(RECOVERY_POLL_INTERVAL_MS)
  async recover(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      const staleThreshold = new Date(Date.now() - DEDUPLICATION_INTERVAL_MS);

      const stuckTransactions = await this.prisma.transaction.findMany({
        where: {
          currentStep: { not: null },
          updatedAt: { lt: staleThreshold },
        },
        select: { id: true, currentStep: true },
      });

      for (const tx of stuckTransactions) {
        if (!tx.currentStep) continue;

        const existingEvent = await this.outboxService.findByTransactionAndStep(
          tx.id,
          tx.currentStep,
        );

        if (!existingEvent) {
          await this.outboxService.createEvent(tx.id, tx.currentStep);
          this.logger.log(
            `Recreated outbox event for stuck transaction ${tx.id}, step ${tx.currentStep}`,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in recovery worker:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
