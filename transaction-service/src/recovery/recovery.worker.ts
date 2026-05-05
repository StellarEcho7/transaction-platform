import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';

@Injectable()
export class RecoveryWorker {
  private readonly logger = new Logger(RecoveryWorker.name);
  private isProcessing = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly outboxService: OutboxService,
  ) {}

  @Interval(30000)
  async recover(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      const staleThreshold = new Date(Date.now() - 60 * 1000);

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
