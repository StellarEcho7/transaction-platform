import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, List, ListItemButton, ListItemText } from "@mui/material";

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
        py: 2,
      }}
    >
      <List>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemButton selected={pathname === item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>
    </Box>
  );
}
