import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkersService } from './workers.service';
import { OutboxService } from '../outbox/outbox.service';
import { TransactionStep, TransactionStatus } from '../transaction/constants';

export interface TransactionJobData {
  transactionId: string;
  step: 'VALIDATE' | 'ENRICH' | 'ANALYZE';
}

@Processor('transaction-processing')
export class ValidateProcessor {
  constructor(
    private readonly workersService: WorkersService,
    private readonly outboxService: OutboxService,
  ) {}

  @Process('process-transaction')
  async handle(job: Job<TransactionJobData>): Promise<void> {
    const { transactionId, step } = job.data;

    if (step !== TransactionStep.VALIDATE) return;

    const tx = await this.workersService.getTransaction(transactionId);

    if (!tx || tx.currentStep === null) {
      return;
    }

    if (
      tx.status === TransactionStatus.PROCESSING &&
      !this.workersService.isProcessingStale(tx.processingStartedAt)
    ) {
      return;
    }

    await this.workersService.markProcessing(transactionId);

    const validationResult = this.validateTransaction(tx);

    if (!validationResult.valid) {
      await this.workersService.markAsFailed(transactionId);
      return;
    }

    await this.workersService.advanceToNextStep(
      transactionId,
      TransactionStep.ENRICH,
      TransactionStatus.PENDING,
    );

    await this.outboxService.createEvent(transactionId, TransactionStep.ENRICH);
  }

  private validateTransaction(tx: {
    userId: string | null;
    amount: number | null;
    timestamp: Date | null;
    merchant: string | null;
    category: string | null;
  }): { valid: boolean; errors?: string[] } {
    const errors: string[] = [];

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
