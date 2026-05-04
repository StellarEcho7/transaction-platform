import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkersService } from './workers.service';
import { QueueService } from '../queue/queue.service';
import { TransactionStep, TransactionStatus } from '@prisma/client';

export interface TransactionJobData {
  transactionId: string;
  step: 'VALIDATE' | 'ENRICH' | 'ANALYZE';
}

@Processor('transaction-processing')
export class EnrichProcessor {
  constructor(
    private readonly workersService: WorkersService,
    private readonly queueService: QueueService,
  ) {}

  @Process('process-transaction')
  async handle(job: Job<TransactionJobData>): Promise<void> {
    const { transactionId, step } = job.data;

    if (step !== 'ENRICH') return;

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

    await this.queueService.addJob(transactionId, 'ANALYZE');
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

    const operationType = amount < 0 ? 'REFUND' : 'PURCHASE';

    return { region, operationType };
  }
}
