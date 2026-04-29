"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/src/components/theme";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </SessionProvider>
  );
}
