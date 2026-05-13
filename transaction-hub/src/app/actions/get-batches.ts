export interface Batch {
  id: string;
  name: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  total: number;
  processed: number;
  failed: number;
  source: string;
  createdAt: string;
}

export interface BatchesPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetBatchesResult {
  data: Batch[];
  pagination: BatchesPagination;
}

export interface GetBatchesError {
  error: string;
  message?: string;
}

export async function getBatches(
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<GetBatchesResult | GetBatchesError> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", String(page));
    queryParams.append("limit", String(limit));
    if (status) {
      queryParams.append("status", status);
    }

    const response = await fetch(`/api/batches?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.error || "Failed to fetch batches",
        message: data.message,
      };
    }

    return {
      data: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    return {
      error: "Network error",
      message: "Failed to connect to server",
    };
  }
}
