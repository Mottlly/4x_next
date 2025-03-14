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
