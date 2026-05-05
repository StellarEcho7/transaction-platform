export const FraudFlag = {
  HIGH_AMOUNT: 'HIGH_AMOUNT',
  SUSPICIOUS_MERCHANT: 'SUSPICIOUS_MERCHANT',
  UNKNOWN_REGION: 'UNKNOWN_REGION',
} as const;

export type FraudFlag = (typeof FraudFlag)[keyof typeof FraudFlag];
