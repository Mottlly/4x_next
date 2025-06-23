"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Mountain,
  Map,
  Globe,
  Smile,
  Target,
  Flame,
  Trees,
  Sun,
  Snowflake,
  Shuffle,
} from "lucide-react";

import { useUserData } from "../../library/utililies/hooks/useUserData";
import { handleStartGame } from "../../library/utililies/menu/menuUtilities";

export default function CreateGamePage() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const router = useRouter();
  const userData = useUserData(session);
  // Wizard steps config
  const steps = [
    {
      key: "Map Size",
      options: [
        { key: "small", label: t("small"), icon: Mountain },
        { key: "medium", label: t("medium"), icon: Map },
        { key: "large", label: t("large"), icon: Globe },
      ],
    },
    {
      key: "difficulty",
      options: [
        { key: "easy", label: t("easy"), icon: Smile },
        { key: "normal", label: t("normal"), icon: Target },
        { key: "hard", label: t("hard"), icon: Flame },
      ],
    },
    {
      key: "biome",
      options: [
        { key: "temperate", label: t("temperate"), icon: Trees },
        { key: "desert", label: t("desert"), icon: Sun },
        { key: "tundra", label: t("tundra"), icon: Snowflake },
        { key: "random", label: t("random"), icon: Shuffle },
      ],
    },
  ];

  const totalSteps = steps.length;
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = steps[stepIndex];

  const [settings, setSettings] = useState({
    mapSize: "medium",
    difficulty: "normal",
    biome: "temperate",
  });

  // Redirect unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (status === "loading" || !userData) {
    return <p className="p-4">{t("loading")}</p>;
  }

  // Selection handler
  const selectOption = (name, key) =>
    setSettings((s) => ({ ...s, [name]: key }));

  // Navigation
  const onNext = () => {
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    } else {
      handleStartGame(userData, router, settings);
    }
  };
  const onBack = () => {
    if (stepIndex === 0) {
      // return to main menu
      router.push("/menu");
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  const progressText = `${stepIndex + 1} / ${totalSteps}`;

  return (
    <div className="h-screen w-screen bg-black flex flex-col px-6 py-8">
      {" "}
      {/* HEADER */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">
          Game Creation Wizard
        </h1>
        <p className="text-xl text-gray-300">Configure your world parameters</p>
      </header>
      {/* MAIN: Options + Progress */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-green-400">
            {t(currentStep.key)}
          </h2>
          <p className="text-lg text-gray-300 italic">
            {currentStep.key === "Map Size" &&
              "Computer, how big is this planet?"}
            {currentStep.key === "difficulty" &&
              "Computer, are there any hostiles on the surface?"}
            {currentStep.key === "biome" &&
              "Computer, prepare survival equipment for...?"}
          </p>
        </div>
        <div
          className="w-full max-w-4xl grid gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {currentStep.options.map((opt) => {
            const isSel = settings[currentStep.key] === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => selectOption(currentStep.key, opt.key)}
                className={`flex flex-col overflow-hidden rounded-lg focus:outline-none transition-all duration-200 transform ${
                  isSel
                    ? "border-2 border-green-400 shadow-[0_0_10px_#00ff00]"
                    : "border-2 border-gray-700 shadow-[0_0_5px_#000]"
                }`}
              >
                {" "}
                <div className="h-32 bg-[#111] flex items-center justify-center">
                  {opt.icon ? (
                    <opt.icon
                      size={48}
                      className={`transition-colors duration-200 ${
                        isSel ? "text-green-400" : "text-gray-400"
                      }`}
                    />
                  ) : (
                    <span className="text-gray-600 text-sm">Icon</span>
                  )}
                </div>
                <div className="py-3 text-base text-white text-center flex-1 flex items-center justify-center">
                  {opt.label}
                </div>
              </button>
            );
          })}
        </div>
        <p className="text-sm text-gray-400">{progressText}</p>
      </main>
      {/* FOOTER: Back / Next */}
      <footer className="flex justify-center items-center gap-6">
        <button
          onClick={onBack}
          className="py-2 px-6 text-sm rounded-lg border-2 border-gray-400 text-gray-400 shadow-[0_0_5px_#9ca3af] hover:border-gray-200 hover:shadow-[0_0_10px_#9ca3af] transition-all duration-200 transform hover:scale-105"
        >
          {stepIndex === 0 ? t("back to menu") : t("back")}
        </button>
        <button
          onClick={onNext}
          className="py-2 px-6 text-sm rounded-lg border-2 border-green-400 text-green-400 shadow-[0_0_10px_#00ff00] hover:shadow-[0_0_20px_#00ff00] transition-all duration-200 transform hover:scale-105"
        >
          {stepIndex < totalSteps - 1 ? t("next") : t("start game")}
        </button>
      </footer>
    </div>
  );
}
