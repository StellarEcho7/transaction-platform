import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { QueueService } from '../queue/queue.service';
import {
  JOB_NAME,
  RETRY_ATTEMPTS,
  RETRY_BACKOFF_DELAY,
} from '../queue/constants';
import { OUTBOX_POLL_INTERVAL_MS } from '../shared/constants';

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

      for (const event of events) {
        try {
          await this.queueService.publish({
            name: JOB_NAME,
            data: {
              transactionId: event.transactionId,
              step: event.step,
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
          this.logger.debug(
            `Published job for transaction ${event.transactionId}, step ${event.step}`,
          );
        } catch (error) {
          this.logger.error(
            `Failed to publish job for event ${event.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error processing outbox:', error);
    } finally {
      this.isProcessing = false;
    }
  }
}
