import type { Metadata } from "next";
import type React from "react";
// import { Inter } from "next/font/google";
import "./globals.css";
// const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Verity | Digital Asset Protection & Deepfake Forensics",
  description: "Protect your digital legacy with Verity's advanced forensics and detection systems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-n-8 text-n-1 min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['light', 'dark']}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
