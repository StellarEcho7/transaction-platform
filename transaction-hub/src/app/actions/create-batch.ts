"use server";

import { config } from "@/src/config";

export interface TransactionInput {
  transactionId: string;
  userId: string;
  amount?: number;
  currency: string;
  timestamp: string;
  merchant?: string;
  category: string;
}

export interface CreateBatchResult {
  id: string;
  name: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface CreateBatchError {
  error: string;
  message?: string;
}

export async function createBatch(
  transactions: TransactionInput[],
  batchName?: string,
): Promise<CreateBatchResult | CreateBatchError> {
  try {
    const response = await fetch(`${config.serviceUrl}/batches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactions,
        batchName: batchName || undefined,
        source: "MANUAL",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to create batch",
        message: data.message,
      };
    }

    return {
      id: data.id,
      name: data.name,
      status: data.status,
      total: data.total,
      createdAt: data.createdAt,
    };
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
    };
  }
}
