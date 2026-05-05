import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { TransactionService } from '../transaction/transaction.service';
import { BatchService } from '../batch/batch.service';
import {
  TransactionStatus,
  FraudFlag,
  Region,
  HIGH_AMOUNT_THRESHOLD,
  MEDIUM_AMOUNT_THRESHOLD,
  SUSPICIOUS_KEYWORDS,
} from '../transaction/constants';
import { DEDUPLICATION_INTERVAL_MS } from '../shared/constants';
import { QUEUE_NAME, JOB_NAME } from '../queue/constants';

export interface AnalyzeJobData {
  transactionId: string;
}

@Processor(QUEUE_NAME)
export class AnalyzeProcessor {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly batchService: BatchService,
  ) {}

  @Process(JOB_NAME.ANALYZE)
  async handle(job: Job<AnalyzeJobData>): Promise<void> {
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

    const analysisResult = this.analyzeTransaction(tx);

    await this.transactionService.analyzeTransaction(
      transactionId,
      analysisResult.riskScore,
      analysisResult.fraudFlags,
    );

    const batchId =
      await this.transactionService.markAsCompleted(transactionId);
    if (batchId) {
      await this.batchService.incrementProcessed(batchId);
    }
  }

  private isProcessingStale(processingStartedAt: Date | null): boolean {
    if (!processingStartedAt) return true;
    const staleThreshold = new Date(Date.now() - DEDUPLICATION_INTERVAL_MS);
    return processingStartedAt < staleThreshold;
  }

  private analyzeTransaction(tx: {
    amount: number | null;
    merchant: string | null;
    userId: string | null;
    region: string | null;
  }): { riskScore: number; fraudFlags: string[] } {
    const fraudFlags: string[] = [];
    let riskScore = 0;

    const amount = tx.amount || 0;
    const merchant = tx.merchant || '';
    const region = tx.region || Region.UNKNOWN;

    if (amount > HIGH_AMOUNT_THRESHOLD) {
      fraudFlags.push(FraudFlag.HIGH_AMOUNT);
      riskScore += 0.4;
    } else if (amount > MEDIUM_AMOUNT_THRESHOLD) {
      riskScore += 0.2;
    }

    const isSuspiciousMerchant = SUSPICIOUS_KEYWORDS.some((keyword) =>
      merchant.toLowerCase().includes(keyword),
    );
    if (isSuspiciousMerchant) {
      fraudFlags.push(FraudFlag.SUSPICIOUS_MERCHANT);
      riskScore += 0.5;
    }

    if (region === Region.UNKNOWN) {
      fraudFlags.push(FraudFlag.UNKNOWN_REGION);
      riskScore += 0.2;
    }

    riskScore = Math.min(riskScore, 1);

    return { riskScore, fraudFlags };
  }
}
