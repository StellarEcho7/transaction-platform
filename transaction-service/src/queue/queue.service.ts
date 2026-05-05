import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

export interface QueueJob {
  name: string;
  data: Record<string, unknown>;
  opts?: {
    jobId?: string;
    attempts?: number;
    backoff?: { type: 'exponential' | 'fixed'; delay: number };
    removeOnComplete?: boolean | number;
    removeOnFail?: boolean | number;
  };
}

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('transaction-processing')
    private readonly transactionQueue: Queue,
  ) {}

  async publish(job: QueueJob): Promise<void> {
    await this.transactionQueue.add(job.name, job.data, job.opts);
  }

  async publishBulk(jobs: QueueJob[]): Promise<void> {
    await this.transactionQueue.addBulk(jobs);
  }
}
