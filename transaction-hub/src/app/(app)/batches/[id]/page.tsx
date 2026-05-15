"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Box from "@/src/components/Box";
import Paper from "@/src/components/Paper";
import Typography from "@/src/components/Typography";
import Button from "@/src/components/Button";
import LinearProgress from "@/src/components/LinearProgress";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@/src/components/Table";
import TablePagination from "@/src/components/TablePagination";
import {
  getBatch,
  getBatchTransactions,
  BatchDetail,
  Transaction,
  TransactionPagination,
} from "@/src/app/actions/get-batch";
import { useTheme } from "@/src/components/theme";

interface BatchData {
  batch: BatchDetail | null;
  transactions: Transaction[];
  pagination: TransactionPagination;
}

export default function BatchDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const theme = useTheme();
  const router = useRouter();
  const [batchId, setBatchId] = useState<string>("");
  const [batch, setBatch] = useState<BatchDetail | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<TransactionPagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setBatchId(p.id));
  }, [params]);

  const fetchData = useCallback(async (): Promise<BatchData | null> => {
    const [batchResult, transactionsResult] = await Promise.all([
      getBatch(batchId),
      getBatchTransactions(batchId, pagination.page, pagination.limit),
    ]);

    if ("error" in batchResult) {
      setError(batchResult.message || batchResult.error);
      setLoading(false);
      return null;
    }

    if ("error" in transactionsResult) {
      setError(transactionsResult.message || transactionsResult.error);
      setLoading(false);
      return null;
    }

    return {
      batch: batchResult as BatchDetail,
      transactions: (transactionsResult as { data: Transaction[] }).data,
      pagination: (transactionsResult as { pagination: TransactionPagination })
        .pagination,
    };
  }, [batchId, pagination.page, pagination.limit]);

  useEffect(() => {
    if (!batchId) {
      return;
    }
    const run = async () => {
      const data = await fetchData();

      if (data) {
        setBatch(data.batch);
        setTransactions(data.transactions);
        setPagination(data.pagination);
        setLoading(false);
      }
    };

    run();
  }, [fetchData, batchId]);

  useEffect(() => {
    if (!batchId || !batch) return;

    if (batch.status === "COMPLETED" || batch.status === "FAILED") {
      return;
    }

    const interval = setInterval(async () => {
      const data = await fetchData();
      if (data) {
        setBatch(data.batch);
        setTransactions(data.transactions);
        setPagination(data.pagination);

        if (
          data.batch &&
          (data.batch.status === "COMPLETED" || data.batch.status === "FAILED")
        ) {
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [batchId, batch, fetchData]);

  const handlePageChange = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
    setLoading(true);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setPagination({ ...pagination, limit: newLimit, page: 1 });
    setLoading(true);
  };

  const handleBack = () => {
    router.push("/batches");
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return theme.palette.info.light;
      case "COMPLETED":
        return theme.palette.success.light;
      case "FAILED":
      case "FAILED_FINAL":
        return theme.palette.error.light;
      case "PENDING":
        return theme.palette.warning.light;
      default:
        return theme.palette.grey[100];
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return theme.palette.info.dark;
      case "COMPLETED":
        return theme.palette.success.dark;
      case "FAILED":
      case "FAILED_FINAL":
        return theme.palette.error.dark;
      case "PENDING":
        return theme.palette.warning.dark;
      default:
        return theme.palette.grey[600];
    }
  };

  const calculateProgress = () => {
    if (!batch || batch.total === 0) return 0;
    return ((batch.processed + batch.failed) / batch.total) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <Box sx={{ p: 3, pt: 1 }}>
      <Button onClick={handleBack} sx={{ mb: 2 }}>
        Back
      </Button>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            bgcolor: "error.light",
            color: "error.contrastText",
          }}
        >
          <Typography>{error}</Typography>
        </Paper>
      )}

      {batch && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                {batch.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ID: {batch.id}
              </Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography
                variant="body2"
                sx={{
                  display: "inline-block",
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: getStatusBgColor(batch.status),
                  color: getStatusTextColor(batch.status),
                  mb: 1,
                }}
              >
                {batch.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Source: {batch.source}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(batch.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography variant="body2">
                Total: {batch.total} | Processed: {batch.processed} | Failed:{" "}
                {batch.failed}
              </Typography>
              <Typography variant="body2">
                {Math.round(calculateProgress())}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={calculateProgress()}
              sx={{ height: 10, borderRadius: 1 }}
            />
          </Box>
        </Paper>
      )}

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Transactions
      </Typography>

      {transactions.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No transactions found
          </Typography>
        </Paper>
      ) : (
        <>
          {loading && <LinearProgress sx={{ mb: 1, height: 3 }} />}
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              overflowX: "auto",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 110, py: 1 }}>
                    Transaction ID
                  </TableCell>
                  <TableCell align="right" sx={{ width: 90, py: 1 }}>
                    Amount
                  </TableCell>
                  <TableCell sx={{ width: 50, py: 1 }}>Currency</TableCell>
                  <TableCell sx={{ minWidth: 130, py: 1 }}>Timestamp</TableCell>
                  <TableCell sx={{ minWidth: 100, py: 1 }}>Merchant</TableCell>
                  <TableCell sx={{ width: 80, py: 1 }}>Category</TableCell>
                  <TableCell sx={{ width: 80, py: 1 }}>Status</TableCell>
                  <TableCell sx={{ width: 80, py: 1 }}>Step</TableCell>
                  <TableCell sx={{ width: 50, py: 1 }}>Region</TableCell>
                  <TableCell align="right" sx={{ width: 70, py: 1 }}>
                    Risk
                  </TableCell>
                  <TableCell sx={{ minWidth: 100, py: 1 }}>
                    Fraud Flags
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} hover sx={{ py: 0.25 }}>
                    <TableCell>{tx.transactionId}</TableCell>
                    <TableCell align="right">
                      {formatAmount(tx.amount, tx.currency)}
                    </TableCell>
                    <TableCell>{tx.currency}</TableCell>
                    <TableCell>{formatDate(tx.timestamp)}</TableCell>
                    <TableCell>{tx.merchant}</TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          bgcolor: getStatusBgColor(tx.status),
                          color: getStatusTextColor(tx.status),
                        }}
                      >
                        {tx.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {tx.currentStep && (
                        <Typography
                          variant="body2"
                          sx={{
                            display: "inline-block",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: "0.75rem",
                            bgcolor: "warning.light",
                            color: "warning.dark",
                          }}
                        >
                          {tx.currentStep}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{tx.region || "-"}</TableCell>
                    <TableCell align="right">
                      {tx.riskScore !== null ? tx.riskScore.toFixed(2) : "-"}
                    </TableCell>
                    <TableCell>{tx.fraudFlags || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagination.total}
            page={pagination.page - 1}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.limit}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </>
      )}
    </Box>
  );
}
