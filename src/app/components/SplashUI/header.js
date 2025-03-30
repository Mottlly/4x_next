"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 right-0 w-full px-4 py-2 flex justify-end items-center gap-4 bg-transparent z-50">
      {!session ? (
        <button
          onClick={() => signIn("auth0")}
          className="rounded-full bg-blue-600 text-white px-3 py-1 text-sm hover:bg-blue-700 transition"
        >
          Log In / Sign Up
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src={session.user?.image || "/placeholder-avatar.png"}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-full border border-gray-300"
          />
          <button
            onClick={() => signOut()}
            className="rounded-full bg-red-600 text-white px-3 py-1 text-sm hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
