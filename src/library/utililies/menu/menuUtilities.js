import { signOut } from "next-auth/react";

// ✅ Fetch User Data
export const fetchUserData = async (authID, setUserData, createNewUser) => {
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
};

// ✅ Create New User
export const createNewUser = async (setUserData) => {
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

// ✅ Start a New Game
export const handleStartGame = async (userData, router) => {
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

// ✅ Continue Game
export const handleContinueGame = async (router) => {
  try {
    const response = await fetch("/api/gameTable", { method: "GET" });

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

// ✅ Navigate to Settings
export const handleSettings = (router) => {
  router.push("/settings");
};

// ✅ Logout User
export const handleLogout = () => {
  signOut();
};
