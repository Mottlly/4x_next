"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainMenu() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  // Redirect to home page if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch user data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [status, session]);

  const fetchUserData = async (authID) => {
    try {
      const response = await fetch(`/api/userTable?authID=${authID}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleStartGame = () => {
    router.push("/game");
  };

  const handleContinueGame = () => {
    router.push("/game");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-semibold text-center sm:text-left">
          Main Menu
        </h1>

        {userData ? (
          <p className="text-lg">Welcome, {session.user.id}!</p>
        ) : (
          <p className="text-lg text-gray-500">Loading user data...</p>
        )}

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={handleContinueGame}
            className="w-full bg-transparent text-cyan-300 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
             transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-cyan-400
             shadow-[0px_0px_10px_#00ffff] hover:shadow-[0px_0px_20px_#00ffff] 
             before:absolute before:inset-0 before:bg-cyan-500 before:blur-md before:opacity-20 
             backdrop-blur-md"
          >
            Continue Game
          </button>

          <button
            onClick={handleStartGame}
            className="w-full bg-transparent text-green-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
             transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-green-400
             shadow-[0px_0px_10px_#00ff00] hover:shadow-[0px_0px_20px_#00ff00] 
             before:absolute before:inset-0 before:bg-green-500 before:blur-md before:opacity-20 
             backdrop-blur-md"
          >
            Start Game
          </button>

          <button
            onClick={handleSettings}
            className="w-full bg-transparent text-gray-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
             transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-gray-400
             shadow-[0px_0px_10px_#9ca3af] hover:shadow-[0px_0px_20px_#9ca3af] 
             before:absolute before:inset-0 before:bg-gray-600 before:blur-md before:opacity-20 
             backdrop-blur-md"
          >
            Settings
          </button>

          <button
            onClick={() => signOut()}
            className="w-full bg-transparent text-red-400 py-3 px-6 rounded-lg relative text-xl tracking-widest uppercase
             transition-all duration-200 transform hover:scale-105 active:scale-95 border-2 border-red-400
             shadow-[0px_0px_10px_#ff0000] hover:shadow-[0px_0px_20px_#ff0000] 
             before:absolute before:inset-0 before:bg-red-600 before:blur-md before:opacity-20 
             backdrop-blur-md"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
