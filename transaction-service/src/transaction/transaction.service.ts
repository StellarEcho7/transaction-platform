import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { TransactionStatus, TransactionStep } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createMany(batchId: string, transactions: TransactionDto[]) {
    const data = transactions.map((tx) => ({
      transactionId: tx.transactionId || null,
      userId: tx.userId,
      amount: tx.amount,
      currency: tx.currency,
      timestamp: new Date(tx.timestamp),
      merchant: tx.merchant,
      category: tx.category,
      batchId,
      status: TransactionStatus.PENDING,
      currentStep: TransactionStep.VALIDATE,
    }));

    return this.prisma.transaction.createMany({ data });
  }
}