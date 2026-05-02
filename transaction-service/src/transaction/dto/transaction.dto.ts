import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
} from 'class-validator';

export class TransactionDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (value ? String(value) : undefined))
  transactionId?: string;

  @IsString()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => Number(value))
  amount: number;

  @IsString()
  currency: string;

  @IsDateString()
  timestamp: string;

  @IsString()
  merchant: string;

  @IsString()
  category: string;
}