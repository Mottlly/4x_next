"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect to home page if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleStartGame = () => {
    router.push("/game"); // Redirect to the game page
  };

  const handleSettings = () => {
    router.push("/settings"); // Redirect to settings page
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-semibold text-center sm:text-left">
          Main Menu
        </h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleStartGame}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Start Game
          </button>
          <button
            onClick={handleSettings}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
          >
            Settings
          </button>
          <button
            onClick={() => signOut()}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
