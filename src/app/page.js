"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Logo */}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        {/* Welcome Message */}
        <h1 className="text-2xl font-semibold text-center sm:text-left">
          Welcome to My App
        </h1>
        <p className="text-sm text-center sm:text-left">
          Log in to access your account and start exploring.
        </p>

        {/* Authentication Buttons */}
        {!session ? (
          <div className="flex gap-4">
            <button
              onClick={() => signIn("auth0")}
              className="rounded-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-semibold">
              ✅ You are logged in as {session.user.email}!
            </p>
            <button
              onClick={() => signOut()}
              className="mt-4 rounded-full bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
