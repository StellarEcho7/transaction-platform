export const FraudFlag = {
  HIGH_AMOUNT: "HIGH_AMOUNT",
  SUSPICIOUS_MERCHANT: "SUSPICIOUS_MERCHANT",
  UNKNOWN_REGION: "UNKNOWN_REGION",
} as const;

export type FraudFlagType = (typeof FraudFlag)[keyof typeof FraudFlag];

export const HIGH_AMOUNT_THRESHOLD = 10000;
export const MEDIUM_AMOUNT_THRESHOLD = 5000;

export const SUSPICIOUS_KEYWORDS = [
  "suspicious",
  "unknown",
  "test",
  "fake",
  "scam",
] as const;

export type SuspiciousKeyword = (typeof SUSPICIOUS_KEYWORDS)[number];

export const VALIDATION_INVALID_VALUES = {
  EMPTY_STRING: "",
  WHITESPACE_STRING: "   ",
  ZERO_AMOUNT: 0,
} as const;

export type ValidationInvalidValueType = keyof typeof VALIDATION_INVALID_VALUES;

export const US_MERCHANTS = ["amazon", "ebay", "walmart"] as const;
export const ASIA_MERCHANTS = ["alibaba", "tencent"] as const;
export const EU_MERCHANTS = ["carrefour", "metro"] as const;

export type MerchantsByRegion = {
  US: readonly string[];
  ASIA: readonly string[];
  EU: readonly string[];
};
