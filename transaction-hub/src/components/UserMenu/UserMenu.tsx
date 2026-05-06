"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

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
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <IconButton onClick={handleClick} sx={{ p: 0.5 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
          {userName[0].toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          component={Link}
          href="/profile"
          onClick={handleClose}
          sx={{ minWidth: 120 }}
        >
          Profile
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); signOut({ callbackUrl: "/login" }); }}>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}