export const BatchStatus = {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type BatchStatus = (typeof BatchStatus)[keyof typeof BatchStatus];
