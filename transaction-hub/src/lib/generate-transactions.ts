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

const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"];
const MERCHANTS = [
  "Amazon",
  "Walmart",
  "Target",
  "Apple Store",
  "Best Buy",
  "Starbucks",
  "McDonald's",
  "Uber",
  "Netflix",
  "Spotify",
];
const CATEGORIES = [
  "shopping",
  "food",
  "transport",
  "entertainment",
  "utilities",
  "health",
  "travel",
];

const SUSPICIOUS_MERCHANTS = [
  "Unknown Store",
  "Test Merchant",
  "Fake Shop",
  "Suspicious LLC",
];

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
  return {
    transactionId: generateUUID(),
    userId: generateUUID(),
    amount: parseFloat((random() * 1000 + 1).toFixed(2)),
    currency: CURRENCIES[Math.floor(random() * CURRENCIES.length)],
    timestamp: generateTimestamp(),
    merchant: MERCHANTS[Math.floor(random() * MERCHANTS.length)],
    category: CATEGORIES[Math.floor(random() * CATEGORIES.length)],
  };
}

function generateInvalidTransaction(random: () => number): TransactionInput {
  const invalidType = Math.floor(random() * 4);
  const base: TransactionInput = {
    transactionId: generateUUID(),
    userId: generateUUID(),
    amount: 100,
    currency: "USD",
    timestamp: generateTimestamp(),
    merchant: "Test Store",
    category: "shopping",
  };

  switch (invalidType) {
    case 0:
      return {
        transactionId: base.transactionId,
        userId: base.userId,
        currency: base.currency,
        timestamp: base.timestamp,
        category: base.category,
      };
    case 1:
      base.amount = 0;
      break;
    case 2:
      base.currency = "INVALID";
      break;
    case 3:
      return {
        transactionId: base.transactionId,
        userId: base.userId,
        amount: base.amount,
        currency: base.currency,
        timestamp: base.timestamp,
        category: base.category,
      };
  }

  return base;
}

function generateDangerousTransaction(random: () => number): TransactionInput {
  const dangerousType = Math.floor(random() * 2);

  if (dangerousType === 0) {
    return {
      transactionId: generateUUID(),
      userId: generateUUID(),
      amount: parseFloat((random() * 9000 + 5000).toFixed(2)),
      currency: CURRENCIES[Math.floor(random() * CURRENCIES.length)],
      timestamp: generateTimestamp(),
      merchant: MERCHANTS[Math.floor(random() * MERCHANTS.length)],
      category: CATEGORIES[Math.floor(random() * CATEGORIES.length)],
    };
  } else {
    return {
      transactionId: generateUUID(),
      userId: generateUUID(),
      amount: parseFloat((random() * 500 + 100).toFixed(2)),
      currency: CURRENCIES[Math.floor(random() * CURRENCIES.length)],
      timestamp: generateTimestamp(),
      merchant:
        SUSPICIOUS_MERCHANTS[
          Math.floor(random() * SUSPICIOUS_MERCHANTS.length)
        ],
      category: "unknown",
    };
  }
}

function shuffleArray<T>(array: T[], random: () => number): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
