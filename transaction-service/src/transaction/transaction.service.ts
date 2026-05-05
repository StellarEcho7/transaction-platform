import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionPersistenceDto } from './dto/transaction-persistence.dto';
import { TransactionStatus, TransactionStep } from './constants';
import { TransactionDetailDto } from '../batch/dto/transaction-detail.dto';
import { PaginationResponseDto } from '../batch/dto/pagination-response.dto';
import { TransactionListQueryDto } from '../batch/dto/transaction-list-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createMany(batchId: string, transactions: TransactionDto[]) {
    const data = transactions.map((tx) =>
      plainToInstance(
        TransactionPersistenceDto,
        { ...tx, batchId },
        { excludeExtraneousValues: true },
      ),
    );

    return this.prisma.transaction.createMany({ data });
  }

  async findAllByBatchId(batchId: string): Promise<{ id: string }[]> {
    return this.prisma.transaction.findMany({
      where: { batchId },
      select: { id: true },
    });
  }

  async getTransaction(id: string) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }

  async markProcessing(id: string): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.PROCESSING,
        processingStartedAt: new Date(),
      },
    });
  }

  async advanceToNextStep(
    id: string,
    nextStep: TransactionStep | null,
    status: TransactionStatus,
  ): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: {
        status,
        currentStep: nextStep,
        processingStartedAt: null,
      },
    });
  }

  async markAsCompleted(id: string): Promise<string | null> {
    const tx = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.COMPLETED,
        currentStep: null,
        processingStartedAt: null,
      },
      select: { batchId: true },
    });

    return tx.batchId;
  }

  async markAsFailed(id: string): Promise<string | null> {
    const tx = await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.FAILED_FINAL,
        currentStep: null,
        processingStartedAt: null,
      },
      select: { batchId: true },
    });

    return tx.batchId;
  }

  async enrichTransaction(
    id: string,
    region: string,
    operationType: string,
  ): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: { region, operationType },
    });
  }

  async analyzeTransaction(
    id: string,
    riskScore: number,
    fraudFlags: Prisma.InputJsonValue,
  ): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: { riskScore, fraudFlags },
    });
  }

  async findById(id: string): Promise<TransactionDetailDto> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    return plainToInstance(TransactionDetailDto, transaction);
  }

  async findByBatchId(
    batchId: string,
    query: TransactionListQueryDto,
  ): Promise<{
    data: TransactionDetailDto[];
    pagination: PaginationResponseDto;
  }> {
    const { page = 1, limit = 20, status } = query;
    const where = { batchId, ...(status ? { status } : {}) };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: plainToInstance(TransactionDetailDto, transactions),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
