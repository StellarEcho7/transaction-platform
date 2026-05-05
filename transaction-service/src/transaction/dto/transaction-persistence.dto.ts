import { Expose, Transform, TransformFnParams } from 'class-transformer';
import { TransactionStatus, TransactionStep } from '@prisma/client';

export class TransactionPersistenceDto {
  @Expose()
  transactionId: string;

  @Expose()
  userId: string;

  @Expose()
  amount: number;

  @Expose()
  currency: string;

  @Expose()
  @Transform((params: TransformFnParams): Date => {
    const value = params.value as string;
    return new Date(value);
  })
  timestamp: Date;

  @Expose()
  merchant: string;

  @Expose()
  category: string;

  @Expose()
  batchId: string;

  @Expose()
  @Transform(() => TransactionStatus.PENDING)
  status: TransactionStatus;

  @Expose()
  @Transform(() => TransactionStep.VALIDATE)
  currentStep: TransactionStep;
}
