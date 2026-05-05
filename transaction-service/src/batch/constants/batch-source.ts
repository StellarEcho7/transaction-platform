export const BatchSource = {
  API: 'api',
  BATCH: 'batch',
  GENERATOR: 'generator',
} as const;

export type BatchSource = (typeof BatchSource)[keyof typeof BatchSource];