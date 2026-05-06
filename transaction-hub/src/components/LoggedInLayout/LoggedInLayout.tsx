import { Box } from "@mui/material";
import Header from "../Header";
import Sidebar from "../Sidebar";

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

export default function LoggedInLayout({ children }: LoggedInLayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}