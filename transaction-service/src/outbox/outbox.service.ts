import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStep, OutboxEventStatus } from '../transaction/constants';

const OUTBOX_QUERY_LIMIT = 100;

@Injectable()
export class OutboxService {
  constructor(private prisma: PrismaService) {}

  async createEvent(
    transactionId: string,
    step: TransactionStep,
  ): Promise<void> {
    await this.prisma.outboxEvent.create({
      data: {
        transactionId,
        step,
        status: OutboxEventStatus.PENDING,
      },
    });
  }

  async createEvents(
    events: { transactionId: string; step: TransactionStep }[],
  ): Promise<void> {
    if (events.length === 0) return;
    await this.prisma.outboxEvent.createMany({
      data: events.map((e) => ({
        transactionId: e.transactionId,
        step: e.step,
        status: OutboxEventStatus.PENDING,
      })),
    });
  }

  async getUnprocessed(limit: number = OUTBOX_QUERY_LIMIT): Promise<
    {
      id: string;
      transactionId: string;
      step: TransactionStep;
    }[]
  > {
    return this.prisma.outboxEvent.findMany({
      where: {
        status: OutboxEventStatus.PENDING,
        processedAt: null,
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: OutboxEventStatus.PROCESSED,
        processedAt: new Date(),
      },
    });
  }

  async findByTransactionAndStep(
    transactionId: string,
    step: TransactionStep,
  ): Promise<{ id: string } | null> {
    return this.prisma.outboxEvent.findFirst({
      where: {
        transactionId,
        step,
        status: OutboxEventStatus.PENDING,
        processedAt: null,
      },
      select: { id: true },
    });
  }
}
