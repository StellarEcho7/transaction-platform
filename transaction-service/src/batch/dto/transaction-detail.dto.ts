export class TransactionDetailDto {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  merchant: string;
  category: string;
  status: string;
  currentStep: string | null;
  region?: string | null;
  operationType?: string | null;
  riskScore?: number | null;
  fraudFlags?: Record<string, unknown> | null;
  batchId: string;
  createdAt: Date;
  updatedAt: Date;
}
