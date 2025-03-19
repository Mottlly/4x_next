"use client";

import { useSession } from "next-auth/react";
import { menuStyles } from "../../library/styles/menu/menustyles";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  fetchUserData,
  createNewUser,
  handleStartGame,
  handleContinueGame,
  handleSettings,
  handleLogout,
} from "../../library/utililies/menu/menuUtilities"; // ✅ Import Utility Functions

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
  const fetchUserDataCallback = useCallback(
    async (authID) => {
      await fetchUserData(authID, setUserData, () =>
        createNewUser(setUserData)
      );
    },
    [setUserData]
  );

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserDataCallback(session.user.id);
    }
  }, [status, session, fetchUserDataCallback]);

  return (
    <div className={menuStyles.menuContainer}>
      <main className={menuStyles.menuMain}>
        <h1 className={menuStyles.menuHeader}>Main Menu</h1>

        {userData ? (
          <p className="text-lg">Welcome, {session.user.id}!</p>
        ) : (
          <p className="text-lg text-gray-500">Loading user data...</p>
        )}

        <div className={menuStyles.menuButtonContainer}>
          <button
            onClick={() => handleContinueGame(router)}
            className={menuStyles.continue}
          >
            Continue Game
          </button>

          <button
            onClick={() => handleStartGame(userData, router)}
            className={menuStyles.start}
          >
            Start Game
          </button>

          <button
            onClick={() => handleSettings(router)}
            className={menuStyles.settings}
          >
            Settings
          </button>

          <button onClick={handleLogout} className={menuStyles.logout}>
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
