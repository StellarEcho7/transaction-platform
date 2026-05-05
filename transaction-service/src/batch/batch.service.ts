import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto } from './dto/batch-response.dto';
import { BatchListQueryDto } from './dto/batch-list-query.dto';
import { BatchDetailDto } from './dto/batch-detail.dto';
import { PaginationResponseDto } from './dto/pagination-response.dto';
import {
  BatchStatus,
  BatchSource,
} from './constants';
import { TransactionListQueryDto } from './dto/transaction-list-query.dto';
import { TransactionDetailDto } from './dto/transaction-detail.dto';
import { TransactionService } from '../transaction/transaction.service';
import {
  TransactionStep,
  TransactionStatus,
  OutboxEventStatus,
} from '../transaction/constants';

@Injectable()
export class BatchService {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const batchName = createBatchDto.batchName || this.generateBatchName();
    const transactionIds = createBatchDto.transactions.map(
      (t) => t.transactionId,
    );

    const batch = await this.prisma.$transaction(async (tx) => {
      const batch = await tx.batch.create({
        data: {
          name: batchName,
          status: BatchStatus.PROCESSING,
          total: createBatchDto.transactions.length,
          processed: 0,
          failed: 0,
          source: createBatchDto.source ?? BatchSource.API,
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

  async findAll(
    query: BatchListQueryDto,
  ): Promise<{ data: BatchResponseDto[]; pagination: PaginationResponseDto }> {
    const { page = 1, limit = 10, status } = query;
    const where = status ? { status } : {};

    const [batches, total] = await Promise.all([
      this.prisma.batch.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.batch.count({ where }),
    ]);

    return {
      data: plainToInstance(BatchResponseDto, batches),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<BatchDetailDto> {
    const batch = await this.prisma.batch.findUnique({
      where: { id },
      include: { transactions: false },
    });

    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }

    return plainToInstance(BatchDetailDto, batch);
  }

  async findTransactionsByBatchId(
    batchId: string,
    query: TransactionListQueryDto,
  ): Promise<{
    data: TransactionDetailDto[];
    pagination: PaginationResponseDto;
  }> {
    return this.transactionService.findByBatchId(batchId, query);
  }
}
