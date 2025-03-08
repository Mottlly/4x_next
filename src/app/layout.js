"use client"; // Ensure this file runs in the client environment

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; // ✅ Import SessionProvider for NextAuth
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ✅ Wrap with SessionProvider (NextAuth) */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
