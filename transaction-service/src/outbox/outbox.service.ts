import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStep } from '@prisma/client';

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
        status: 'PENDING',
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
        status: 'PENDING',
      })),
    });
  }

  async getUnprocessed(limit: number = 100): Promise<
    {
      id: string;
      transactionId: string;
      step: TransactionStep;
    }[]
  > {
    return this.prisma.outboxEvent.findMany({
      where: {
        status: 'PENDING',
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
        status: 'PROCESSED',
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
        status: 'PENDING',
        processedAt: null,
      },
      select: { id: true },
    });
  }
}
