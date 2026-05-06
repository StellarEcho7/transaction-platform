"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import LogoutButton from "../LogoutButton";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (status === "loading") {
    return null;
  }

  const userName = session?.user?.name || session?.user?.email || "User";

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Button
        onClick={handleClick}
        sx={{ textTransform: "none" }}
        startIcon={
          <Avatar sx={{ width: 32, height: 32 }}>{userName[0]}</Avatar>
        }
      >
        {userName}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem component={Link} href="/profile" onClick={handleClose}>
          Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <LogoutButton />
        </MenuItem>
      </Menu>
    </Box>
  );
}
