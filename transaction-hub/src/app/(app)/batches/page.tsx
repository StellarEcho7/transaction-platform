"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Box from "@/src/components/Box";
import Paper from "@/src/components/Paper";
import Typography from "@/src/components/Typography";
import Select from "@/src/components/Select";
import MenuItem from "@/src/components/MenuItem";
import TextField from "@/src/components/TextField";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@/src/components/Table";
import TablePagination from "@/src/components/TablePagination";
import LinearProgress from "@/src/components/LinearProgress";
import {
  getBatches,
  Batch,
  BatchesPagination,
} from "@/src/app/actions/get-batches";
import { useTheme } from "@/src/components/theme";

type StatusFilter = "ALL" | "PROCESSING" | "COMPLETED" | "FAILED";

interface BatchesData {
  data: Batch[];
  pagination: BatchesPagination;
}

export default function BatchesPage() {
  const theme = useTheme();
  const router = useRouter();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [pagination, setPagination] = useState<BatchesPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [nameFilter, setNameFilter] = useState("");
  const [debouncedName, setDebouncedName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(nameFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [nameFilter]);

  const fetchBatches = useCallback(async (): Promise<BatchesData | null> => {
    const result = await getBatches(
      pagination.page,
      pagination.limit,
      statusFilter === "ALL" ? undefined : statusFilter,
      debouncedName || undefined,
    );

    if ("error" in result) {
      setError(result.message || result.error);
      return null;
    }

    return result as BatchesData;
  }, [pagination.page, pagination.limit, statusFilter, debouncedName]);

  useEffect(() => {
    const loadBatches = async () => {
      setLoading(true);
      const data = await fetchBatches();

      if (!data) {
        setLoading(false);
        return;
      }

      setBatches(data.data);

      setPagination((prev) => {
        if (
          prev.page === data.pagination.page &&
          prev.limit === data.pagination.limit &&
          prev.total === data.pagination.total &&
          prev.totalPages === data.pagination.totalPages
        ) {
          return prev;
        }

        return data.pagination;
      });

      setLoading(false);
    };

    loadBatches();
  }, [pagination.page, pagination.limit, statusFilter, fetchBatches]);

  useEffect(() => {
    const hasProcessing = batches.some((b) => b.status === "PROCESSING");
    if (!hasProcessing) return;

    const interval = setInterval(async () => {
      const data = await fetchBatches();
      if (data) {
        setBatches(data.data);
        setPagination(data.pagination);
        const stillProcessing = data.data.some(
          (b) => b.status === "PROCESSING",
        );
        if (!stillProcessing) {
          clearInterval(interval);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [batches, fetchBatches]);

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

  const handleStatusChange = (event: unknown) => {
    const value = (event as { target: { value: string } }).target
      .value as StatusFilter;
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
    setLoading(true);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNameFilter(event.target.value);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleRowClick = (batchId: string) => {
    router.push(`/batches/${batchId}`);
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return theme.palette.info.light;
      case "COMPLETED":
        return theme.palette.success.light;
      case "FAILED":
        return theme.palette.error.light;
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
        return theme.palette.error.dark;
      default:
        return theme.palette.grey[600];
    }
  };

  const calculateProgress = (batch: Batch) => {
    if (batch.total === 0) return 0;
    return ((batch.processed + batch.failed) / batch.total) * 100;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Batches
      </Typography>

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

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="body2">Name:</Typography>
          <TextField
            value={nameFilter}
            onChange={handleNameChange}
            size="small"
            placeholder="Search by name"
            sx={{ minWidth: 200 }}
          />
          <Typography variant="body2">Status:</Typography>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PROCESSING">Processing</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
          </Select>
        </Box>
      </Paper>

      {batches.length === 0 && !loading ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            No batches found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Upload transactions to create a batch
          </Typography>
        </Paper>
      ) : (
        <>
          <Box sx={{ mb: 1 }}>
            {loading && <LinearProgress sx={{ height: 3 }} />}
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ border: "1px solid", borderColor: "divider", minWidth: 900 }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 120, py: 1 }}>Name</TableCell>
                  <TableCell sx={{ width: 90, py: 1 }}>Status</TableCell>
                  <TableCell align="right" sx={{ width: 70, py: 1 }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ width: 80, py: 1 }}>
                    Processed
                  </TableCell>
                  <TableCell align="right" sx={{ width: 70, py: 1 }}>
                    Failed
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, py: 1 }}>Progress</TableCell>
                  <TableCell sx={{ width: 140, py: 1 }}>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow
                    key={batch.id}
                    hover
                    onClick={() => handleRowClick(batch.id)}
                    sx={{ cursor: "pointer", py: 0.5 }}
                  >
                    <TableCell>{batch.name}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "inline-block",
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: getStatusBgColor(batch.status),
                          color: getStatusTextColor(batch.status),
                        }}
                      >
                        {batch.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{batch.total}</TableCell>
                    <TableCell align="right">{batch.processed}</TableCell>
                    <TableCell align="right">{batch.failed}</TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(batch)}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                        />
                        <Typography variant="body2" sx={{ minWidth: 40 }}>
                          {Math.round(calculateProgress(batch))}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(batch.createdAt)}</TableCell>
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
