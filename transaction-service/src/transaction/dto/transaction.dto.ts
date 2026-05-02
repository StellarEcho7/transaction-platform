import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator';

export class TransactionDto {
  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsString()
  userId: string;

  @IsNumber()
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
