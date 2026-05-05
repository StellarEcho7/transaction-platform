import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { OutboxService } from './outbox.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class OutboxProcessor {
  private readonly logger = new Logger(OutboxProcessor.name);
  private isProcessing = false;

  constructor(
    private readonly outboxService: OutboxService,
    private readonly queueService: QueueService,
  ) {}

  @Interval(1000)
  async process(): Promise<void> {
    if (this.isProcessing) return;

    this.isProcessing = true;
    try {
      const events = await this.outboxService.getUnprocessed(50);

      for (const event of events) {
        try {
          await this.queueService.publish({
            name: 'process-transaction',
            data: {
              transactionId: event.transactionId,
              step: event.step,
            },
            opts: {
              jobId: `${event.transactionId}-${event.step}`,
              attempts: 5,
              backoff: { type: 'exponential', delay: 2000 },
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
