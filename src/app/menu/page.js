"use client";

import i18n from "../../i18n"; // 👈 Load i18next once per app
import { useTranslation } from "react-i18next";
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
} from "../../library/utililies/menu/menuUtilities";

export default function MainMenu() {
  const { t } = useTranslation(); // 👈 Hook into translations
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  //for playing with languages
  //useEffect(() => {
  //  i18n.changeLanguage("en"); // 👈 Force language on mount
  //}, []);

  // Redirect to home page if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
        <h1 className={menuStyles.menuHeader}>{t("mainMenu")}</h1>

        {userData ? (
          <p className="text-lg">{t("welcome", { user: session.user.id })}</p>
        ) : (
          <p className="text-lg text-gray-500">{t("loading")}</p>
        )}

        <div className={menuStyles.menuButtonContainer}>
          <button
            onClick={() => handleContinueGame(router)}
            className={menuStyles.continue}
          >
            {t("continue")}
          </button>

          <button
            onClick={() => handleStartGame(userData, router)}
            className={menuStyles.start}
          >
            {t("start")}
          </button>

          <button
            onClick={() => handleSettings(router)}
            className={menuStyles.settings}
          >
            {t("settings")}
          </button>

          <button onClick={handleLogout} className={menuStyles.logout}>
            {t("logout")}
          </button>
        </div>
      </main>
    </div>
  );
}
