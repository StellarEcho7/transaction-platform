import type { Metadata } from "next";
import { Providers } from "@/src/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Transaction Platform",
  description: "Fault-tolerant transaction processing system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}