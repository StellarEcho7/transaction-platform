import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { TransactionService } from '../transaction/transaction.service';
import { OutboxService } from '../outbox/outbox.service';
import {
  TransactionStep,
  TransactionStatus,
  OperationType,
  Region,
  US_MERCHANTS,
  ASIA_MERCHANTS,
  EU_MERCHANTS,
} from '../transaction/constants';
import { DEDUPLICATION_INTERVAL_MS } from '../shared/constants';
import { QUEUE_NAME, JOB_NAME } from '../queue/constants';

export interface EnrichJobData {
  transactionId: string;
}

@Processor(QUEUE_NAME)
export class EnrichProcessor {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly outboxService: OutboxService,
  ) {}

  @Process(JOB_NAME.ENRICH)
  async handle(job: Job<EnrichJobData>): Promise<void> {
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

    const enrichedData = this.enrichTransaction(tx);

    await this.transactionService.enrichTransaction(
      transactionId,
      enrichedData.region,
      enrichedData.operationType,
    );

    await this.transactionService.advanceToNextStep(
      transactionId,
      TransactionStep.ANALYZE,
      TransactionStatus.PENDING,
    );

    await this.outboxService.createEvent(
      transactionId,
      TransactionStep.ANALYZE,
    );
  }

  private isProcessingStale(processingStartedAt: Date | null): boolean {
    if (!processingStartedAt) return true;
    const staleThreshold = new Date(Date.now() - DEDUPLICATION_INTERVAL_MS);
    return processingStartedAt < staleThreshold;
  }

  private enrichTransaction(tx: {
    merchant: string | null;
    amount: number | null;
    userId: string | null;
  }): { region: Region; operationType: OperationType } {
    const merchant = tx.merchant || '';
    const amount = tx.amount || 0;

    let region: Region = Region.UNKNOWN;
    if (US_MERCHANTS.some((m) => merchant.toLowerCase().includes(m))) {
      region = Region.US;
    } else if (ASIA_MERCHANTS.some((m) => merchant.toLowerCase().includes(m))) {
      region = Region.ASIA;
    } else if (EU_MERCHANTS.some((m) => merchant.toLowerCase().includes(m))) {
      region = Region.EU;
    }

    const operationType =
      amount < 0 ? OperationType.REFUND : OperationType.PURCHASE;

    return { region, operationType };
  }
}
