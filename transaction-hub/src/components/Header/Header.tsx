import { AppBar, Toolbar } from "@mui/material";
import UserMenu from "../UserMenu";
import Typography from "../Typography";

export default function Header() {
  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component="h1"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Transaction Platform
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}
