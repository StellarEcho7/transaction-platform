"use client";

import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: { default: "#ffffff", paper: "#ffffff" },
    text: { primary: "#1a1a1a", secondary: "#666666" },
    success: {
      main: "#2e7d32",
      light: "#e8f5e9",
      dark: "#1b5e20",
    },
    error: {
      main: "#c62828",
      light: "#ffebee",
      dark: "#b71c1c",
    },
    info: {
      main: "#1565c0",
      light: "#e3f2fd",
      dark: "#0d47a1",
    },
    warning: {
      main: "#e65100",
      light: "#fff3e0",
      dark: "#bf360c",
    },
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
