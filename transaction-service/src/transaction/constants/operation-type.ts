export const OperationType = {
  PURCHASE: 'PURCHASE',
  REFUND: 'REFUND',
} as const;

export type OperationType = (typeof OperationType)[keyof typeof OperationType];
