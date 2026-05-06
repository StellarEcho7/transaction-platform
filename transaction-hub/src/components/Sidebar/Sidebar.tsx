"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Generate", href: "/generate" },
  { label: "Upload", href: "/upload" },
  { label: "Batches", href: "/batches" },
];

interface SidebarProps {
  width?: number;
}

export default function Sidebar({ width = 240 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      sx={{
        width,
        flexShrink: 0,
        borderRight: 1,
        borderColor: "divider",
        py: 3,
        px: 2,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          px: 2,
          mb: 1,
          display: "block",
          color: "text.secondary",
          fontWeight: 600,
          letterSpacing: 2,
        }}
      >
        Navigation
      </Typography>
      <List disablePadding>
        {navItems.map((item) => {
          const isSelected = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  fontWeight: isSelected ? 600 : 400,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Link>
          );
        })}
      </List>
    </Box>
  );
}
