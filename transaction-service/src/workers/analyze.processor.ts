import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bullmq';
import { WorkersService } from './workers.service';
import { TransactionStep, TransactionStatus } from '../transaction/constants';

export interface TransactionJobData {
  transactionId: string;
  step: 'VALIDATE' | 'ENRICH' | 'ANALYZE';
}

@Processor('transaction-processing')
export class AnalyzeProcessor {
  constructor(private readonly workersService: WorkersService) {}

  @Process('process-transaction')
  async handle(job: Job<TransactionJobData>): Promise<void> {
    const { transactionId, step } = job.data;

    if (step !== TransactionStep.ANALYZE) return;

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

    const analysisResult = this.analyzeTransaction(tx);

    await this.workersService.analyzeTransaction(
      transactionId,
      analysisResult.riskScore,
      analysisResult.fraudFlags,
    );

    await this.workersService.markAsCompleted(transactionId);
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
    const region = tx.region || 'UNKNOWN';

    if (amount > 10000) {
      fraudFlags.push('HIGH_AMOUNT');
      riskScore += 0.4;
    } else if (amount > 5000) {
      riskScore += 0.2;
    }

    const suspiciousMerchants = [
      'suspicious',
      'unknown',
      'test',
      'fake',
      'scam',
    ];
    const isSuspiciousMerchant = suspiciousMerchants.some((suspicious) =>
      merchant.toLowerCase().includes(suspicious),
    );
    if (isSuspiciousMerchant) {
      fraudFlags.push('SUSPICIOUS_MERCHANT');
      riskScore += 0.5;
    }

    if (region === 'UNKNOWN') {
      fraudFlags.push('UNKNOWN_REGION');
      riskScore += 0.2;
    }

    riskScore = Math.min(riskScore, 1);

    return { riskScore, fraudFlags };
  }
}
