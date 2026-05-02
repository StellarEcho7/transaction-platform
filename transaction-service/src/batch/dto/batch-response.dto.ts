import { Transform } from 'class-transformer';

export class BatchResponseDto {
  @Transform(({ obj }) => obj?.id)
  batchId: string;

  @Transform(({ obj }) => obj?.name)
  batchName: string;

  status: string;
  total: number;
  processed: number;
  failed: number;
}