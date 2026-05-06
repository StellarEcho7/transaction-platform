"use client";

import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import {
  generateTransactions,
  TransactionInput,
} from "@/src/lib/generate-transactions";

export default function GeneratePage() {
  const [count, setCount] = useState(100);
  const [invalidPercent, setInvalidPercent] = useState(0);
  const [dangerousPercent, setDangerousPercent] = useState(0);
  const [seed, setSeed] = useState("");
  const [generatedData, setGeneratedData] = useState<TransactionInput[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setError(null);
    setGeneratedData(null);
    try {
      const cnt = parseInt(String(count), 10);
      const invalid = parseInt(String(invalidPercent), 10);
      const dangerous = parseInt(String(dangerousPercent), 10);

      if (cnt < 1 || cnt > 10000) {
        setError("Count must be between 1 and 10000");
        return;
      }
      if (invalid < 0 || invalid > 100) {
        setError("Invalid percent must be between 0 and 100");
        return;
      }
      if (dangerous < 0 || dangerous > 100) {
        setError("Dangerous percent must be between 0 and 100");
        return;
      }
      if (invalid + dangerous > 100) {
        setError("Invalid + dangerous percent cannot exceed 100%");
        return;
      }
      const data = generateTransactions({
        count: cnt,
        invalidPercent: invalid,
        dangerousPercent: dangerous,
        seed: seed ? parseInt(seed, 10) : undefined,
      });
      setGeneratedData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    }
  };

  const handleDownload = () => {
    if (!generatedData) return;
    const json = JSON.stringify(generatedData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 4 }}>
        <Box sx={{ width: 400, flexShrink: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h4">Generate Transactions</Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Generate synthetic transaction data for testing the transaction
              processing system. Configure the parameters below and click
              Generate to create a JSON file.
            </Typography>
            <TextField
              label="Number of transactions"
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1, max: 10000 } }}
              fullWidth
            />
            <TextField
              label="Invalid %"
              type="number"
              value={invalidPercent}
              onChange={(e) => setInvalidPercent(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              fullWidth
            />
            <TextField
              label="Dangerous %"
              type="number"
              value={dangerousPercent}
              onChange={(e) => setDangerousPercent(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              fullWidth
            />
            <TextField
              label="Seed (optional)"
              type="number"
              value={seed}
              onChange={(e) => setSeed(e.target.value)}
              placeholder="For reproducibility"
              fullWidth
            />
            <Box>
              <Button variant="contained" onClick={handleGenerate}>
                Generate
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 2, height: "100%", minHeight: 500 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {generatedData
                ? `Preview (${generatedData.length} transactions)`
                : "Preview"}
            </Typography>
            {generatedData ? (
              <>
                <Box
                  component="pre"
                  sx={{
                    maxHeight: 400,
                    overflow: "auto",
                    bgcolor: "grey.100",
                    p: 2,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                  }}
                >
                  {JSON.stringify(generatedData.slice(0, 10), null, 2)}
                  {generatedData.length > 10 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      ... and {generatedData.length - 10} more
                    </Typography>
                  )}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleDownload}
                  >
                    Download JSON
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Click Generate to create transactions and see preview here
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
