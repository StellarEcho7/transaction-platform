import { Transform, TransformFnParams } from 'class-transformer';
import { Batch } from '@prisma/client';

export class BatchResponseDto {
  @Transform((params: TransformFnParams): string => {
    const batch = params.obj as Batch;
    return batch.id;
  })
  batchId: string;

  @Transform((params: TransformFnParams): string => {
    const batch = params.obj as Batch;
    return batch.name;
  })
  batchName: string;

  status: string;
  total: number;
  processed: number;
  failed: number;
}
