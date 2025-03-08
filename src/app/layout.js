"use client"; // Ensure this file runs in the client environment

import { Geist, Geist_Mono } from "next/font/google";
import { Auth0Provider } from "@auth0/auth0-react"; // ✅ Import Auth0Provider
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
        {/* ✅ Wrap with Auth0Provider */}
        <Auth0Provider
          domain="your-auth0-domain"
          clientId="your-auth0-client-id"
          authorizationParams={{
            redirect_uri:
              typeof window !== "undefined"
                ? window.location.origin
                : undefined,
          }}
        >
          {children}
        </Auth0Provider>
      </body>
    </html>
  );
}
