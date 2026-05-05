import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { TransactionService } from '../transaction/transaction.service';
import { BatchService } from '../batch/batch.service';
import { OutboxService } from '../outbox/outbox.service';
import { TransactionStep, TransactionStatus } from '../transaction/constants';
import { DEDUPLICATION_INTERVAL_MS } from '../shared/constants';
import { QUEUE_NAME, JOB_NAME } from '../queue/constants';

export interface ValidateJobData {
  transactionId: string;
}

@Processor(QUEUE_NAME)
export class ValidateProcessor {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly batchService: BatchService,
    private readonly outboxService: OutboxService,
  ) {}

  @Process(JOB_NAME.VALIDATE)
  async handle(job: Job<ValidateJobData>): Promise<void> {
    const { transactionId } = job.data;

    const tx = await this.transactionService.getTransaction(transactionId);

    if (!tx || tx.currentStep === null) {
      return;
    }

    if (
      tx.status === TransactionStatus.PROCESSING &&
      !this.isProcessingStale(tx.processingStartedAt)
    ) {
      return;
    }

    await this.transactionService.markProcessing(transactionId);

    const validationResult = this.validateTransaction(tx);

    if (!validationResult.valid) {
      const batchId = await this.transactionService.markAsFailed(transactionId);
      if (batchId) {
        await this.batchService.incrementFailed(batchId);
      }
      return;
    }

    await this.transactionService.advanceToNextStep(
      transactionId,
      TransactionStep.ENRICH,
      TransactionStatus.PENDING,
    );

    await this.outboxService.createEvent(transactionId, TransactionStep.ENRICH);
  }

  private isProcessingStale(processingStartedAt: Date | null): boolean {
    if (!processingStartedAt) return true;
    const staleThreshold = new Date(Date.now() - DEDUPLICATION_INTERVAL_MS);
    return processingStartedAt < staleThreshold;
  }

  private validateTransaction(tx: {
    transactionId: string | null;
    userId: string | null;
    amount: number | null;
    timestamp: Date | null;
    merchant: string | null;
    category: string | null;
  }): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

    if (!tx.transactionId || tx.transactionId.trim() === '') {
      errors.push('transactionId is required');
    }

    if (!tx.userId || tx.userId.trim() === '') {
      errors.push('userId is required');
    }

    if (tx.amount === null || tx.amount === undefined) {
      errors.push('amount is required');
    } else if (tx.amount <= 0) {
      errors.push('amount must be greater than 0');
    }

    if (!tx.timestamp) {
      errors.push('timestamp is required');
    }

    if (!tx.merchant || tx.merchant.trim() === '') {
      errors.push('merchant is required');
    }

    if (!tx.category || tx.category.trim() === '') {
      errors.push('category is required');
    }

    return { valid: errors.length === 0, errors };
  }
}
