import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface TransactionJobData {
  transactionId: string;
  step: 'VALIDATE' | 'ENRICH' | 'ANALYZE';
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('transaction-processing')
    private readonly transactionQueue: Queue<TransactionJobData>,
  ) {}

  async addTransactionJobs(transactions: { id: string }[]): Promise<void> {
    const jobs = transactions.map((tx) => ({
      name: 'process-transaction',
      data: {
        transactionId: tx.id,
        step: 'VALIDATE' as const,
      },
      opts: {
        jobId: tx.id,
        attempts: 5,
        backoff: {
          type: 'exponential' as const,
          delay: 2000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    }));

    await this.transactionQueue.addBulk(jobs);
  }

  async addJob(transactionId: string, step: string): Promise<void> {
    await this.transactionQueue.add(
      'process-transaction',
      {
        transactionId,
        step: step as 'VALIDATE' | 'ENRICH' | 'ANALYZE',
      },
      {
        jobId: `${transactionId}-${step}`,
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
  }
}
