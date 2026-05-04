import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionPersistenceDto } from './dto/transaction-persistence.dto';

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
}
