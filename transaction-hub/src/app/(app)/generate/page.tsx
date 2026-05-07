"use client";

import { useState } from "react";
import {
  generateTransactions,
  TransactionInput,
} from "@/src/lib/generate-transactions";
import Box from "@/src/components/Box";
import Paper from "@/src/components/Paper";
import Typography from "@/src/components/Typography";
import TextField from "@/src/components/TextField";
import Divider from "@/src/components/Divider";
import Button from "@/src/components/Button";
import Alert from "@/src/components/Alert";

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
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1.5 }}>
              Generate Transactions
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Generate synthetic transaction data for testing the transaction
              processing system.
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
              }}
            >
              <TextField
                label="Number of transactions"
                type="number"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1, max: 10000 } }}
                fullWidth
                helperText="Range: 1 - 10000"
              />
              <TextField
                label="Invalid %"
                type="number"
                value={invalidPercent}
                onChange={(e) => setInvalidPercent(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                fullWidth
                helperText="Transactions that will fail validation"
              />
              <TextField
                label="Dangerous %"
                type="number"
                value={dangerousPercent}
                onChange={(e) => setDangerousPercent(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 0, max: 100 } }}
                fullWidth
                helperText="Transactions with high risk score"
              />
              <TextField
                label="Seed (optional)"
                type="number"
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                placeholder="For reproducibility"
                fullWidth
                helperText="Leave empty for random results"
              />
              <Box sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGenerate}
                  sx={{ minWidth: 140 }}
                >
                  Generate
                </Button>
              </Box>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              height: "100%",
              minHeight: 500,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 500 }}>
                {generatedData
                  ? `Preview (${generatedData.length} transactions)`
                  : "Preview"}
              </Typography>
              {generatedData && (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={handleDownload}
                >
                  Download JSON
                </Button>
              )}
            </Box>
            {generatedData ? (
              <>
                <Box
                  component="pre"
                  sx={{
                    maxHeight: 525,
                    overflow: "auto",
                    bgcolor: "grey.50",
                    p: 2.5,
                    borderRadius: 1,
                    fontSize: "0.8rem",
                    fontFamily: "monospace",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {JSON.stringify(generatedData.slice(0, 10), null, 2)}
                  {generatedData.length > 10 && (
                    <Typography
                      variant="body2"
                      sx={{
                        display: "block",
                        mt: 1.5,
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}
                    >
                      ... and {generatedData.length - 10} more transactions
                    </Typography>
                  )}
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  bgcolor: "grey.50",
                  borderRadius: 1,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Click Generate to create transactions and see preview here
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
