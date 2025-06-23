"use client";

import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import { menuStyles } from "../../library/styles/menu/menustyles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
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
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col justify-center items-center px-6">
      <Header />

      {/* Game Title Section */}
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold text-white mb-2 tracking-wide">
          Project Armageddon - A 4X Adventure
        </h1>
        <p className="text-xl text-gray-400">Eject • Eat • Exploit • Evade</p>
      </div>

      {/* Main Menu Card */}
      <main className="bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          {t("mainMenu")}
        </h2>
        {userData ? (
          <div className="text-center mb-8 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            {" "}
            <div className="flex items-center justify-center gap-3 mb-2">
              {userData.picture && (
                <Image
                  src={userData.picture}
                  alt="User Avatar"
                  width={48}
                  height={48}
                  className="rounded-full border-2 border-green-400"
                />
              )}
              <div>
                <p className="text-xl text-green-400 font-medium">
                  Welcome back,{" "}
                  {userData.name || userData.nickname || "Commander"}!
                </p>
                <p className="text-sm text-gray-400">
                  Ready for another expedition?
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8 p-4 bg-gray-800/50 rounded-lg">
            <p className="text-lg text-gray-400">{t("loading")}</p>
          </div>
        )}{" "}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => handleContinueGame(router)}
            className="w-full bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-300 hover:text-cyan-200 py-4 px-6 rounded-xl text-xl font-medium tracking-wide uppercase transition-all duration-200 transform hover:scale-105 border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]"
          >
            {t("continue")}
          </button>

          <button
            onClick={() => router.push("/create-game")}
            className="w-full bg-green-900/30 hover:bg-green-800/40 text-green-400 hover:text-green-300 py-4 px-6 rounded-xl text-xl font-medium tracking-wide uppercase transition-all duration-200 transform hover:scale-105 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]"
          >
            {t("start")}
          </button>

          <button
            onClick={() => handleSettings(router)}
            className="w-full bg-gray-800/30 hover:bg-gray-700/40 text-gray-400 hover:text-gray-300 py-4 px-6 rounded-xl text-xl font-medium tracking-wide uppercase transition-all duration-200 transform hover:scale-105 border-2 border-gray-500 shadow-[0_0_15px_rgba(107,114,128,0.3)] hover:shadow-[0_0_25px_rgba(107,114,128,0.5)]"
          >
            {t("settings")}
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 py-4 px-6 rounded-xl text-xl font-medium tracking-wide uppercase transition-all duration-200 transform hover:scale-105 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]"
          >
            {t("logout")}
          </button>
        </div>
      </main>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-gray-500 text-sm">Version 1.0.0 Alpha</p>
      </div>
    </div>
  );
}
