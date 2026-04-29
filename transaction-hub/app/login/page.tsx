"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Box from "@/src/components/Box";
import TextField from "@/src/components/TextField";
import Button from "@/src/components/Button";
import Typography from "@/src/components/Typography";
import SnackbarAlert from "@/src/components/SnackbarAlert";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/account");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Sign In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="you@example.com"
          />

          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ mb: 2 }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{ textAlign: "center", color: "text.secondary" }}
        >
          Don&apos;t have an account?{" "}
          <Link href="/register" style={{ color: "#1976d2" }}>
            Register
          </Link>
        </Typography>
      </Box>

      <SnackbarAlert
        open={!!error}
        message={error}
        severity="error"
        onClose={() => setError("")}
      />
    </Box>
  );
}
