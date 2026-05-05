export class BatchResponseDto {
  id: string;
  name: string;
  status: string;
  total: number;
  processed: number;
  failed: number;
  createdAt: Date;
}
