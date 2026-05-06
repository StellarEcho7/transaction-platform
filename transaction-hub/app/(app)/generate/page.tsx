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
import { generateTransactions, TransactionInput } from "@/src/lib/generate-transactions";

export default function GeneratePage() {
  const [count, setCount] = useState(100);
  const [invalidPercent, setInvalidPercent] = useState(0);
  const [dangerousPercent, setDangerousPercent] = useState(0);
  const [seed, setSeed] = useState("");
  const [generatedData, setGeneratedData] = useState<TransactionInput[] | null>(
    null
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
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Generate Transactions
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Generate synthetic transaction data for testing the transaction processing
        system. Configure the parameters below and click Generate to create a JSON
        file.
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
        <TextField
          label="Number of transactions"
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          slotProps={{ htmlInput: { min: 1, max: 10000 } }}
          sx={{ maxWidth: 300 }}
        />
        <TextField
          label="Invalid %"
          type="number"
          value={invalidPercent}
          onChange={(e) => setInvalidPercent(Number(e.target.value))}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
          sx={{ maxWidth: 300 }}
        />
        <TextField
          label="Dangerous %"
          type="number"
          value={dangerousPercent}
          onChange={(e) => setDangerousPercent(Number(e.target.value))}
          slotProps={{ htmlInput: { min: 0, max: 100 } }}
          sx={{ maxWidth: 300 }}
        />
        <TextField
          label="Seed (optional)"
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          placeholder="For reproducibility"
          sx={{ maxWidth: 300 }}
        />
        <Box>
          <Button variant="contained" onClick={handleGenerate}>
            Generate
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {generatedData && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Preview ({generatedData.length} transactions)
          </Typography>
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
            {JSON.stringify(
              generatedData.slice(0, 10),
              null,
              2
            )}
            {generatedData.length > 10 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                ... and {generatedData.length - 10} more
              </Typography>
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="success" onClick={handleDownload}>
              Download JSON
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}