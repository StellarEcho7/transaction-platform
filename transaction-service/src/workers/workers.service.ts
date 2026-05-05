import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionStatus, TransactionStep } from '../transaction/constants';
import { BatchStatus } from '../batch/constants';
import { DEDUPLICATION_INTERVAL_MS } from '../shared/constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

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

  async markAsCompleted(id: string): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.COMPLETED,
        currentStep: null,
        processingStartedAt: null,
      },
    });

    const tx = await this.prisma.transaction.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (tx?.batchId) {
      await this.incrementProcessed(tx.batchId);
    }
  }

  async markAsFailed(id: string): Promise<void> {
    await this.prisma.transaction.update({
      where: { id },
      data: {
        status: TransactionStatus.FAILED_FINAL,
        currentStep: null,
        processingStartedAt: null,
      },
    });

    const tx = await this.prisma.transaction.findUnique({
      where: { id },
      include: { batch: true },
    });

    if (tx?.batchId) {
      await this.incrementFailed(tx.batchId);
    }
  }

  private async incrementProcessed(batchId: string): Promise<void> {
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

  private async incrementFailed(batchId: string): Promise<void> {
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

  isProcessingStale(processingStartedAt: Date | null): boolean {
    if (!processingStartedAt) return true;
    const staleThreshold = new Date(Date.now() - DEDUPLICATION_INTERVAL_MS);
    return processingStartedAt < staleThreshold;
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
