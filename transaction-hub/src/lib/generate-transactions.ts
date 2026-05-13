export interface GenerateParams {
  count: number;
  invalidPercent: number;
  dangerousPercent: number;
  seed?: number;
}

export interface TransactionInput {
  transactionId: string;
  userId: string;
  amount?: number;
  currency: string;
  timestamp: string;
  merchant?: string;
  category: string;
}

import {
  HIGH_AMOUNT_THRESHOLD,
  SUSPICIOUS_KEYWORDS,
  US_MERCHANTS,
  ASIA_MERCHANTS,
  EU_MERCHANTS,
  VALIDATION_INVALID_VALUES,
} from "./constants/transaction-rules";

function seededRandom(seed: number): () => number {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateTimestamp(): string {
  const now = new Date();
  const offset = Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000);
  return new Date(now.getTime() - offset).toISOString();
}

export function generateTransactions(
  params: GenerateParams,
): TransactionInput[] {
  const { count, invalidPercent, dangerousPercent, seed } = params;

  if (count < 1 || count > 10000) {
    throw new Error("Count must be between 1 and 10000");
  }
  if (invalidPercent < 0 || invalidPercent > 100) {
    throw new Error("Invalid percent must be between 0 and 100");
  }
  if (dangerousPercent < 0 || dangerousPercent > 100) {
    throw new Error("Dangerous percent must be between 0 and 100");
  }
  if (invalidPercent + dangerousPercent > 100) {
    throw new Error("Invalid + dangerous percent cannot exceed 100%");
  }

  const random = seed !== undefined ? seededRandom(seed) : Math.random;

  const invalidCount = Math.floor((count * invalidPercent) / 100);
  const dangerousCount = Math.floor((count * dangerousPercent) / 100);
  const validCount = count - invalidCount - dangerousCount;

  const transactions: TransactionInput[] = [];

  for (let i = 0; i < invalidCount; i++) {
    transactions.push(generateInvalidTransaction(random));
  }
  for (let i = 0; i < dangerousCount; i++) {
    transactions.push(generateDangerousTransaction(random));
  }
  for (let i = 0; i < validCount; i++) {
    transactions.push(generateValidTransaction(random));
  }

  shuffleArray(transactions, random);

  return transactions;
}

function generateValidTransaction(random: () => number): TransactionInput {
  const validMerchants = [
    ...US_MERCHANTS.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
    ...ASIA_MERCHANTS.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
    ...EU_MERCHANTS.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
  ];
  return {
    transactionId: generateUUID(),
    userId: generateUUID(),
    amount: parseFloat((random() * 1000 + 1).toFixed(2)),
    currency: "USD",
    timestamp: generateTimestamp(),
    merchant: validMerchants[Math.floor(random() * validMerchants.length)],
    category: "shopping",
  };
}

function generateInvalidTransaction(random: () => number): TransactionInput {
  const invalidType = Math.floor(random() * 5);
  const base = {
    transactionId: generateUUID(),
    userId: generateUUID(),
    amount: 100,
    currency: "USD",
    timestamp: generateTimestamp(),
    merchant: "Amazon",
    category: "shopping",
  };

  switch (invalidType) {
    case 0:
      base.transactionId = base.transactionId + "-invalid";
      base.userId = VALIDATION_INVALID_VALUES.EMPTY_STRING;
      break;
    case 1:
      base.userId = VALIDATION_INVALID_VALUES.WHITESPACE_STRING;
      break;
    case 2:
      base.amount = VALIDATION_INVALID_VALUES.ZERO_AMOUNT;
      break;
    case 3:
      base.merchant = VALIDATION_INVALID_VALUES.EMPTY_STRING;
      break;
    case 4:
      base.category = VALIDATION_INVALID_VALUES.EMPTY_STRING;
      break;
  }

  return base;
}

function generateDangerousTransaction(random: () => number): TransactionInput {
  const dangerousType = Math.floor(random() * 3);

  if (dangerousType === 0) {
    return {
      transactionId: generateUUID(),
      userId: generateUUID(),
      amount: parseFloat((HIGH_AMOUNT_THRESHOLD + random() * 1000).toFixed(2)),
      currency: "USD",
      timestamp: generateTimestamp(),
      merchant: "Amazon",
      category: "shopping",
    };
  }

  const merchantKeyword =
    SUSPICIOUS_KEYWORDS[Math.floor(random() * SUSPICIOUS_KEYWORDS.length)];
  const baseAmount = random() * 500 + 100;

  return {
    transactionId: generateUUID(),
    userId: generateUUID(),
    amount: parseFloat(baseAmount.toFixed(2)),
    currency: "USD",
    timestamp: generateTimestamp(),
    merchant: `${merchantKeyword.charAt(0).toUpperCase() + merchantKeyword.slice(1)} Store`,
    category: "shopping",
  };
}

function shuffleArray<T>(array: T[], random: () => number): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}