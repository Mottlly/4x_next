"use client";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { menuStyles } from "../../library/styles/menu/menustyles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  handleStartGame,
  handleContinueGame,
  handleSettings,
  handleLogout,
} from "../../library/utililies/menu/menuUtilities";
import Header from "../components/SplashUI/header";
import { useUserData } from "../../library/utililies/hooks/useUserData";

export default function MainMenu() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const userData = useUserData(session);

  // Redirect unauthenticated users once
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  return (
    <div className={menuStyles.menuContainer}>
      <Header />
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
