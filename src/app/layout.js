"use client"; // Ensure this file runs in the client environment

// Force dynamic rendering to prevent static generation timeout
export const dynamic = 'force-dynamic';

import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react"; // ✅ Import SessionProvider for NextAuth
import "./globals.css";
import { Toaster } from "react-hot-toast";

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
        <SessionProvider>
          <Toaster position="top-center" />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
