import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkersService } from './workers.service';
import { OutboxService } from '../outbox/outbox.service';
import {
  TransactionStep,
  TransactionStatus,
  OperationType,
} from '../transaction/constants';
import { QUEUE_NAME, JOB_NAME } from '../queue/constants';

export interface EnrichJobData {
  transactionId: string;
}

@Processor(QUEUE_NAME)
export class EnrichProcessor {
  constructor(
    private readonly workersService: WorkersService,
    private readonly outboxService: OutboxService,
  ) {}

  @Process(JOB_NAME.ENRICH)
  async handle(job: Job<EnrichJobData>): Promise<void> {
    const { transactionId } = job.data;

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

    const enrichedData = this.enrichTransaction(tx);

    await this.workersService.enrichTransaction(
      transactionId,
      enrichedData.region,
      enrichedData.operationType,
    );

    await this.workersService.advanceToNextStep(
      transactionId,
      TransactionStep.ANALYZE,
      TransactionStatus.PENDING,
    );

    await this.outboxService.createEvent(
      transactionId,
      TransactionStep.ANALYZE,
    );
  }

  private enrichTransaction(tx: {
    merchant: string | null;
    amount: number | null;
    userId: string | null;
  }): { region: string; operationType: string } {
    const merchant = tx.merchant || '';
    const amount = tx.amount || 0;

    let region = 'UNKNOWN';
    if (
      merchant.toLowerCase().includes('amazon') ||
      merchant.toLowerCase().includes('ebay') ||
      merchant.toLowerCase().includes('walmart')
    ) {
      region = 'US';
    } else if (
      merchant.toLowerCase().includes('alibaba') ||
      merchant.toLowerCase().includes('tencent')
    ) {
      region = 'ASIA';
    } else if (
      merchant.toLowerCase().includes('carrefour') ||
      merchant.toLowerCase().includes('metro')
    ) {
      region = 'EU';
    }

    const operationType =
      amount < 0 ? OperationType.REFUND : OperationType.PURCHASE;

    return { region, operationType };
  }
}
