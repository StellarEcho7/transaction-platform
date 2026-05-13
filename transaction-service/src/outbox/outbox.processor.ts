import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { QueueService } from '../queue/queue.service';
import {
  JOB_NAME,
  RETRY_ATTEMPTS,
  RETRY_BACKOFF_DELAY,
} from '../queue/constants';
import { TransactionStep } from '../transaction/constants';
import { OUTBOX_POLL_INTERVAL_MS } from '../shared/constants';

const STEP_TO_JOB_NAME: Record<TransactionStep, string> = {
  [TransactionStep.VALIDATE]: JOB_NAME.VALIDATE,
  [TransactionStep.ENRICH]: JOB_NAME.ENRICH,
  [TransactionStep.ANALYZE]: JOB_NAME.ANALYZE,
};

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly queueService: QueueService,
  ) {}

  @Interval(OUTBOX_POLL_INTERVAL_MS)
  async process(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      const events = await this.outboxService.getUnprocessed(50);

      if (events.length > 0) {
        this.logger.log(
          `[OUTBOX] Found ${events.length} pending events, processing...`,
        );
      }

      for (const event of events) {
        try {
          const jobName = STEP_TO_JOB_NAME[event.step];

          await this.queueService.publish({
            name: jobName,
            data: {
              transactionId: event.transactionId,
            },
            opts: {
              jobId: `${event.transactionId}-${event.step}`,
              attempts: RETRY_ATTEMPTS,
              backoff: { type: 'exponential', delay: RETRY_BACKOFF_DELAY },
              removeOnComplete: false,
              removeOnFail: false,
            },
          });

          await this.outboxService.markProcessed(event.id);
          this.logger.log(
            `[OUTBOX] Published ${jobName} for transaction ${event.transactionId}`,
          );
        } catch (error) {
          this.logger.error(
            `[OUTBOX] Failed to publish job for event ${event.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('[OUTBOX] Error processing outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
