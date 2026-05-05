import { BatchResponseDto } from './batch-response.dto';
import { TransactionDetailDto } from './transaction-detail.dto';
import { PaginationResponseDto } from './pagination-response.dto';

export class BatchDetailDto extends BatchResponseDto {
  transactions?: TransactionDetailDto[];
  pagination?: PaginationResponseDto;
}
