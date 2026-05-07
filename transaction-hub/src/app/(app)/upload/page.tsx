"use client";

import { useState, useCallback } from "react";
import Box from "@/src/components/Box";
import Paper from "@/src/components/Paper";
import Typography from "@/src/components/Typography";
import TextField from "@/src/components/TextField";
import Button from "@/src/components/Button";
import Alert from "@/src/components/Alert";
import Divider from "@/src/components/Divider";
import { createBatch, TransactionInput } from "@/src/app/actions/create-batch";

const REQUIRED_FIELDS = [
  "transactionId",
  "userId",
  "currency",
  "timestamp",
  "category",
] as const;

function validateTransaction(tx: unknown): string[] {
  const errors: string[] = [];
  if (!tx || typeof tx !== "object") {
    return ["Invalid transaction object"];
  }
  const obj = tx as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }
  if (typeof obj.amount === "number" && obj.amount <= 0) {
    errors.push("Amount must be greater than 0");
  }
  return errors;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [batchName, setBatchName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    id: string;
    name: string;
    total: number;
  } | null>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.name.endsWith(".json")) {
      setError("Please upload a JSON file");
      return;
    }
    setFile(f);
    setError(null);
    setSuccess(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        setError("Invalid JSON format");
        setIsLoading(false);
        return;
      }

      if (!Array.isArray(data)) {
        setError("File must contain an array of transactions");
        setIsLoading(false);
        return;
      }

      const validationErrors: string[] = [];
      const transactions: TransactionInput[] = [];

      for (let i = 0; i < data.length; i++) {
        const tx = data[i];
        const errors = validateTransaction(tx);
        if (errors.length > 0) {
          validationErrors.push(`Transaction ${i + 1}: ${errors.join(", ")}`);
        }
        transactions.push({
          transactionId: String(tx.transactionId),
          userId: String(tx.userId),
          amount: tx.amount != null ? Number(tx.amount) : undefined,
          currency: String(tx.currency),
          timestamp: String(tx.timestamp),
          merchant: tx.merchant != null ? String(tx.merchant) : undefined,
          category: String(tx.category),
        });
      }

      if (validationErrors.length > 0) {
        setError(
          `Validation failed:\n${validationErrors.slice(0, 5).join("\n")}${
            validationErrors.length > 5
              ? `\n...and ${validationErrors.length - 5} more errors`
              : ""
          }`,
        );
        setIsLoading(false);
        return;
      }

      const result = await createBatch(transactions, batchName || undefined);

      if ("error" in result) {
        setError(result.message || result.error);
      } else {
        setSuccess({
          id: result.id,
          name: result.name,
          total: result.total,
        });
        setFile(null);
        setBatchName("");
      }
    } catch {
      setError("Failed to process file");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3.5,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1.5 }}>
          Upload Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Upload a JSON file containing transactions to process as a batch.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              JSON File
            </Typography>
            <Box
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              sx={{
                border: "2px dashed",
                borderColor: isDragging
                  ? "primary.main"
                  : file
                    ? "success.main"
                    : "divider",
                borderRadius: 2,
                p: 4,
                textAlign: "center",
                bgcolor: isDragging ? "action.hover" : "grey.50",
                cursor: "pointer",
                transition: "all 0.2s",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "action.hover",
                },
              }}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".json"
                onChange={handleFileInput}
                style={{ display: "none" }}
              />
              {file ? (
                <Typography variant="body1" color="success.main">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </Typography>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Drag and drop a JSON file here, or click to browse
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            label="Batch Name (optional)"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            placeholder="Auto-generated if empty"
            fullWidth
            helperText="Leave empty to auto-generate a batch name"
          />

          <Box sx={{ mt: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!file || isLoading}
              sx={{ minWidth: 140 }}
            >
              {isLoading ? "Uploading..." : "Upload & Create Batch"}
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Batch created successfully!
            </Typography>
            <Typography variant="body2">Batch ID: {success.id}</Typography>
            <Typography variant="body2">Name: {success.name}</Typography>
            <Typography variant="body2">
              Transactions: {success.total}
            </Typography>
          </Alert>
        )}
      </Paper>
    </Box>
  );
}
