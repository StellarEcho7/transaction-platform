export interface BatchDetail {
  id: string;
  name: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "FAILED_FINAL";
  total: number;
  processed: number;
  failed: number;
  source: string;
  createdAt: string;
}

export interface BatchDetailError {
  error: string;
  message?: string;
}

export async function getBatch(
  id: string,
): Promise<BatchDetail | BatchDetailError> {
  try {
    const response = await fetch(`/api/batches/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to fetch batch",
        message: data.message,
      };
    }

    return data as BatchDetail;
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
    };
  }
}

export interface Transaction {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  currency: string;
  timestamp: string;
  merchant: string;
  category: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "FAILED_FINAL";
  currentStep: "VALIDATE" | "ENRICH" | "ANALYZE" | null;
  region: string | null;
  operationType: string | null;
  riskScore: number | null;
  fraudFlags: string | null;
  batchId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetBatchTransactionsResult {
  data: Transaction[];
  pagination: TransactionPagination;
}

export interface GetBatchTransactionsError {
  error: string;
  message?: string;
}

export async function getBatchTransactions(
  batchId: string,
  page: number = 1,
  limit: number = 20,
): Promise<GetBatchTransactionsResult | GetBatchTransactionsError> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));

    const response = await fetch(
      `/api/batches/${batchId}/transactions?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to fetch transactions",
        message: data.message,
      };
    }

    return data as GetBatchTransactionsResult;
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
    };
  }
}
