import { Box } from "@mui/material";
import Header from "../Header";
import Sidebar from "../Sidebar";

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

export default function LoggedInLayout({ children }: LoggedInLayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
