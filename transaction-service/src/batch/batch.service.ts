import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../outbox/outbox.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto } from './dto/batch-response.dto';
import { BatchStatus } from './constants/batch-status';
import {
  TransactionStep,
  TransactionStatus,
  OutboxEventStatus,
} from '../transaction/constants';

@Injectable()
export class BatchService {
  constructor(
    private prisma: PrismaService,
    private outboxService: OutboxService,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const batchName = createBatchDto.batchName || this.generateBatchName();

    const batch = await this.prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({
        data: {
          name: batchName,
          status: BatchStatus.PROCESSING,
          total: createBatchDto.transactions.length,
          processed: 0,
          failed: 0,
        },
      });

      const transactions = await tx.transaction.createManyAndReturn({
        data: createBatchDto.transactions.map((t) => ({
          transactionId: t.transactionId || undefined,
          userId: t.userId,
          amount: t.amount,
          currency: t.currency,
          timestamp: new Date(t.timestamp),
          merchant: t.merchant,
          category: t.category,
          batchId: batch.id,
          status: TransactionStatus.PENDING,
          currentStep: TransactionStep.VALIDATE,
        })),
      });

      await tx.outboxEvent.createMany({
        data: transactions.map((tx) => ({
          transactionId: tx.id,
          step: TransactionStep.VALIDATE,
          status: OutboxEventStatus.PENDING,
        })),
      });

      return batch;
    });

    return plainToInstance(BatchResponseDto, batch);
  }

  private generateBatchName(): string {
    const date = new Date();
    return `Batch (${date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })})`;
  }
}
