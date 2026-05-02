import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionService } from '../transaction/transaction.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { BatchResponseDto } from './dto/batch-response.dto';
import { BatchStatus } from '@prisma/client';

@Injectable()
export class BatchService {
  constructor(
    private prisma: PrismaService,
    private transactionService: TransactionService,
  ) {}

  async create(createBatchDto: CreateBatchDto): Promise<BatchResponseDto> {
    const batchName = createBatchDto.batchName || this.generateBatchName();

    const batch = await this.prisma.$transaction(async (tx) => {
      const batch = await this.prisma.batch.create({
        data: {
          name: batchName,
          status: BatchStatus.PROCESSING,
          total: createBatchDto.transactions.length,
          processed: 0,
          failed: 0,
        },
      });

      await this.transactionService.createMany(
        batch.id,
        createBatchDto.transactions,
      );

      return plainToInstance(BatchResponseDto, batch);
    });
    return batch;
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
