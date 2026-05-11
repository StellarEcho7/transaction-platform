import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { QUEUE_NAME } from './constants';

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
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue(QUEUE_NAME)
    private readonly transactionQueue: Queue,
  ) {}

  async publish(job: QueueJob): Promise<void> {
    this.logger.debug(
      `[QUEUE] Publishing job: ${job.name}, jobId: ${job.opts?.jobId || 'auto'}`,
    );
    await this.transactionQueue.add(job.name, job.data, job.opts);
  }

  async publishBulk(jobs: QueueJob[]): Promise<void> {
    if (jobs.length === 0) return;
    this.logger.log(`[QUEUE] Publishing ${jobs.length} jobs in bulk`);
    await this.transactionQueue.addBulk(jobs);
  }
}
