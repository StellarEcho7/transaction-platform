export const Region = {
  US: 'US',
  ASIA: 'ASIA',
  EU: 'EU',
  UNKNOWN: 'UNKNOWN',
} as const;

export type Region = (typeof Region)[keyof typeof Region];
