import { Transform, TransformFnParams } from 'class-transformer';
import { TransactionStatus, TransactionStep } from '@prisma/client';

export class TransactionPersistenceDto {
  @Transform((params: TransformFnParams): string | null => {
    const value = params.value as string | undefined;
    return value ?? null;
  })
  transactionId: string | null;

  userId: string;
  amount: number;
  currency: string;

  @Transform((params: TransformFnParams): Date => {
    const value = params.value as string;
    return new Date(value);
  })
  timestamp: Date;

  merchant: string;
  category: string;
  batchId: string;

  @Transform(() => TransactionStatus.PENDING)
  status: TransactionStatus;

  @Transform(() => TransactionStep.VALIDATE)
  currentStep: TransactionStep;
}
