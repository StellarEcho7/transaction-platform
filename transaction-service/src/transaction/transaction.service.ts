import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionPersistenceDto } from './dto/transaction-persistence.dto';
import { TransactionStatus, TransactionStep } from './constants';
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
}
