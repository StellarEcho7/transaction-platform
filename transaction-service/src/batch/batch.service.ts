import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto } from './dto/batch-response.dto';
import { BatchStatus } from './constants/batch-status';
import {
  TransactionStep,
  TransactionStatus,
  OutboxEventStatus,
} from '../transaction/constants';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class BatchService {
  constructor(private prisma: PrismaService) {}

  async create(createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const batchName = createBatchDto.batchName || this.generateBatchName();
    const transactionIds = createBatchDto.transactions.map(
      (t) => t.transactionId || createId(),
    );

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

      await tx.transaction.createMany({
        data: createBatchDto.transactions.map((t, index) => ({
          id: transactionIds[index],
          transactionId: t.transactionId,
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
        data: transactionIds.map((id) => ({
          transactionId: id,
          step: TransactionStep.VALIDATE,
          status: OutboxEventStatus.PENDING,
        })),
      });

      return batch;
    });

    return plainToInstance(BatchResponseDto, batch);
  }

  async incrementProcessed(batchId: string): Promise<void> {
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) return;

    const newProcessed = batch.processed + 1;

    await this.prisma.batch.update({
      where: { id: batchId },
      data: {
        processed: newProcessed,
        status:
          newProcessed + batch.failed >= batch.total
            ? BatchStatus.COMPLETED
            : batch.status,
      },
    });
  }

  async incrementFailed(batchId: string): Promise<void> {
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
    });

    if (!batch) return;

    const newFailed = batch.failed + 1;

    await this.prisma.batch.update({
      where: { id: batchId },
      data: {
        failed: newFailed,
        status:
          newFailed + batch.processed >= batch.total
            ? BatchStatus.COMPLETED
            : batch.status,
      },
    });
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
