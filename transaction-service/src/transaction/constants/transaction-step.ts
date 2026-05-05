export const TransactionStep = {
  VALIDATE: 'VALIDATE',
  ENRICH: 'ENRICH',
  ANALYZE: 'ANALYZE',
} as const;

export type TransactionStep =
  (typeof TransactionStep)[keyof typeof TransactionStep];
