"use client";

import { useSession } from "next-auth/react";
import Box from "@/src/components/Box";
import Typography from "@/src/components/Typography";
import Button from "@/src/components/Button";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 3, color: "#1a1a1a" }}>
          Profile
        </Typography>

        <Typography variant="body1" sx={{ mb: 1, color: "#1a1a1a" }}>
          <strong>Name:</strong> {session?.user?.name || "Not set"}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1, color: "#1a1a1a" }}>
          <strong>Email:</strong> {session?.user?.email}
        </Typography>

        <Typography variant="body1" sx={{ mb: 3, color: "#1a1a1a" }}>
          <strong>Role:</strong> {session?.user?.role}
        </Typography>

        <Link href="/account">
          <Button variant="outlined">Back to Account</Button>
        </Link>
      </Box>
    </Box>
  );
}
