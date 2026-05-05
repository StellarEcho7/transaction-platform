export const OutboxEventStatus = {
  PENDING: 'PENDING',
  PROCESSED: 'PROCESSED',
} as const;

export type OutboxEventStatus =
  (typeof OutboxEventStatus)[keyof typeof OutboxEventStatus];
