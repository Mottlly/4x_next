"use client";

import { useSession, signOut } from "next-auth/react";
import { menuStyles } from "../../library/styles/menu/menustyles";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

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
  const fetchUserData = useCallback(async (authID) => {
    try {
      const response = await fetch(`/api/userTable?authID=${authID}`);

      if (response.status === 404) {
        console.warn("⚠️ User not found, creating new user...");
        await createNewUser(); // Call the POST request function
        return;
      }

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [status, session, fetchUserData]); // ✅ Now fetchUserData is safely included

  const createNewUser = async () => {
    try {
      const response = await fetch("/api/userTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to create user");

      const data = await response.json();
      console.log("✅ User created:", data);

      setUserData(data.user); // Update state with new user data
    } catch (error) {
      console.error("❌ Error creating user:", error);
    }
  };

  const handleStartGame = async () => {
    if (!userData) {
      console.error("❌ User data not loaded yet.");
      return;
    }

    try {
      const response = await fetch("/api/gameTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create a new game");
      }

      const { game } = await response.json();
      console.log("✅ New Game Created:", game);

      // Redirect to game page with the new game ID
      router.push(`/game?gameID=${game.id}`);
    } catch (error) {
      console.error("❌ Error starting game:", error);
    }
  };

  const handleContinueGame = async () => {
    try {
      const response = await fetch("/api/gameTable", { method: "GET" });

      //Code dialog popup
      if (!response.ok) {
        throw new Error("No previous game found.");
      }

      const { game } = await response.json();

      console.log("🔹 Continuing most recent game:", game);

      // Redirect to the game page with the retrieved game ID
      router.push(`/game?gameID=${game.id}`);
    } catch (error) {
      console.error("❌ Error continuing game:", error);
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };
  //locales file with keys for plain text "I8N"
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
            //import classNames
            className={menuStyles.continue}
          >
            Continue Game
          </button>

          <button onClick={handleStartGame} className={menuStyles.start}>
            Start Game
          </button>

          <button onClick={handleSettings} className={menuStyles.settings}>
            Settings
          </button>

          <button onClick={() => signOut()} className={menuStyles.logout}>
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
