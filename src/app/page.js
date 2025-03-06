"use client";

import { useAuth0 } from "@auth0/auth0-react";
import Image from "next/image";
import "./splash.css"; // ✅ Import the CSS file

export default function SplashPage() {
  const { loginWithPopup, loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    <div className="splash-container">
      {/* Logo */}
      <Image
        src="/next.svg"
        alt="App Logo"
        width={150}
        height={150}
        priority
        className="splash-logo"
      />

      {/* Welcome Message */}
      <h1 className="splash-heading">Welcome to My App</h1>
      <p className="splash-text">
        Log in to access your account and start exploring.
      </p>

      {/* Login Buttons */}
      {!isAuthenticated ? (
        <div className="splash-buttons">
          <button onClick={loginWithRedirect} className="splash-button blue">
            Login (Redirect)
          </button>
          <button onClick={loginWithPopup} className="splash-button green">
            Login (Popup)
          </button>
        </div>
      ) : (
        <p className="success-message">✅ You are logged in! Redirecting...</p>
      )}

      {/* Footer */}
      <footer className="splash-footer">Built with ❤️ using Next.js</footer>
    </div>
  );
}
