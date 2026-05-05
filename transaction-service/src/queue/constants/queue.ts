export const QUEUE_NAME = 'transaction';

export const JOB_NAME = {
  VALIDATE: 'validate',
  ENRICH: 'enrich',
  ANALYZE: 'analyze',
} as const;

export type JobName = (typeof JOB_NAME)[keyof typeof JOB_NAME];
