import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import Box from "@/src/components/Box";
import Typography from "@/src/components/Typography";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
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
        <Typography variant="h4" sx={{ mb: 3 }}>
          Profile
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Name:</strong> {session?.user?.name || "Not set"}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Email:</strong> {session?.user?.email}
        </Typography>

        <Typography variant="body1">
          <strong>Role:</strong> {session?.user?.role}
        </Typography>
      </Box>
    </Box>
  );
}
