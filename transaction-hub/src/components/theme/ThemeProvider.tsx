"use client";

import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#666666" },
  },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={lightTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
