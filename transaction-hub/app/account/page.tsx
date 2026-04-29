import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import Box from "@/src/components/Box";
import Typography from "@/src/components/Typography";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

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
        <Typography variant="h4" sx={{ mb: 2 }}>
          Account
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          Welcome, {session?.user?.name || session?.user?.email}!
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Role: {session?.user?.role}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Link href="/profile" style={{ color: "#1976d2" }}>
            View Profile
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
