import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchStatus } from '@prisma/client';

export interface BatchResponse {
  batchId: string;
  batchName: string;
  status: string;
  total: number;
  processed: number;
  failed: number;
}

@Injectable()
export class BatchService {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<BatchResponse> {
    const batchName = createBatchDto.batchName || this.generateBatchName();

    const batch = await this.prisma.batch.create({
      data: {
        name: batchName,
        status: BatchStatus.PROCESSING,
        total: createBatchDto.transactions.length,
        processed: 0,
        failed: 0,
      },
    });

    await this.transactionService.createMany(batch.id, createBatchDto.transactions);

    return {
      batchId: batch.id,
      batchName: batch.name,
      status: batch.status,
      total: batch.total,
      processed: batch.processed,
      failed: batch.failed,
    };
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