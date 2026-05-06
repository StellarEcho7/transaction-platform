import { AppBar, Toolbar, Typography } from "@mui/material";
import UserMenu from "../UserMenu";

export default function Header() {
  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Transaction Platform
        </Typography>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
}