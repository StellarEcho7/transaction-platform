import { IsOptional, IsInt, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { BatchStatus } from '../constants/batch-status';

export class BatchListQueryDto {
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
  limit?: number = 10;

  @IsOptional()
  @IsIn([BatchStatus.PROCESSING, BatchStatus.COMPLETED, BatchStatus.FAILED])
  status?: BatchStatus;
}
