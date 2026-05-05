import { IsString, IsNumber, IsDateString } from 'class-validator';

export class TransactionDto {
  @IsString()
  transactionId: string;

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
