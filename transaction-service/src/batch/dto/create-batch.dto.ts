import { IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TransactionDto } from '../../transaction/dto/transaction.dto';
import { BatchSource } from '../constants';

export class CreateBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions: TransactionDto[];

  @IsOptional()
  @IsString()
  batchName?: string;

  @IsOptional()
  @IsString()
  source?: BatchSource;
}
