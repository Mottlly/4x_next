"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { useUserData } from "../../library/utililies/hooks/useUserData";
import { handleStartGame } from "../../library/utililies/menu/menuUtilities";

export default function CreateGamePage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const userData = useUserData(session);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show loading until userData is ready
  if (status === "loading" || !userData) {
    return <p className="p-4">{t("loading")}</p>;
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("createGame")}</h1>
      <button
        onClick={() => handleStartGame(userData, router)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded"
      >
        {t("startGame")}
      </button>
      <button
        onClick={() => router.back()}
        className="w-full mt-4 px-4 py-2 bg-gray-200 rounded"
      >
        {t("cancel")}
      </button>
    </div>
  );
}
