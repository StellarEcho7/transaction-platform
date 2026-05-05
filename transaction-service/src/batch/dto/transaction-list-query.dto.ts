import { IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionStatus } from '../../transaction/constants/transaction-status';

export class TransactionListQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsIn([
    TransactionStatus.PENDING,
    TransactionStatus.PROCESSING,
    TransactionStatus.COMPLETED,
    TransactionStatus.FAILED,
    TransactionStatus.FAILED_FINAL,
  ])
  status?: TransactionStatus;
}
