"use client";

import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";

export default function SplashPage() {
  const { loginWithPopup, loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white px-6">
      {/* Logo */}
      <Image
        src="/next.svg"
        alt="App Logo"
        width={150}
        height={150}
        priority
        className="mb-8 animate-fade-in"
      />

      {/* Welcome Message */}
      <h1 className="text-4xl font-bold text-center mb-4 animate-fade-in">
        Welcome to My App
      </h1>
      <p className="text-lg text-gray-300 text-center mb-8 animate-fade-in">
        Log in to access your account and start exploring.
      </p>

      {/* Login Buttons */}
      {!isAuthenticated ? (
        <div className="space-y-4">
          <button
            onClick={loginWithRedirect}
            className="w-64 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg animate-fade-in"
          >
            Login (Redirect)
          </button>
          <button
            onClick={loginWithPopup}
            className="w-64 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold transition-all duration-300 shadow-lg animate-fade-in"
          >
            Login (Popup)
          </button>
        </div>
      ) : (
        <p className="text-lg text-green-400 mt-6 animate-fade-in">
          ✅ You are logged in! Redirecting...
        </p>
      )}

      {/* Footer */}
      <footer className="absolute bottom-6 text-gray-400 text-sm">
        Built with ❤️ using Next.js & Tailwind CSS
      </footer>
    </div>
  );
}
