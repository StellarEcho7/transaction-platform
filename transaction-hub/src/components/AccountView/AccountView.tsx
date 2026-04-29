"use client";

import { signOut } from "next-auth/react";
import Box from "@/src/components/Box";
import Button from "@/src/components/Button";
import Link from "next/link";
import Typography from "@/src/components/Typography";

interface AccountViewProps {
  name: string | null;
  email: string | null | undefined;
  role: string;
}

export default function AccountView({ name, email, role }: AccountViewProps) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
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
          <Typography variant="h4" sx={{ color: "#1a1a1a" }}>
          Account
        </Typography>
          <Button
            variant="outlined"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mb: 1, color: "#1a1a1a" }}>
          Welcome, {name || email}!
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: "#666666" }}>
          Role: {role}
        </Typography>

        <Link href="/profile" style={{ color: "#1976d2" }}>
          View Profile
        </Link>
      </Box>
    </Box>
  );
}
