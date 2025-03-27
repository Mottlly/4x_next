"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import i18n from "@/i18n"; // make sure this path matches your setup

const supportedLanguages = {
  en: "English",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  pt: "Português",
  ru: "Русский",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
  ar: "العربية",
  zhCN: "中文 (简体)",
};

export default function SettingsPage() {
  const router = useRouter();

  const [volume, setVolume] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("musicVolume");
      return saved ? parseFloat(saved) : 0.3;
    }
    return 0.3;
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("language") ||
        i18n.language || // <-- Use i18n-detected language
        "en"
      );
    }
    return "en";
  });

  // Persist volume on change
  useEffect(() => {
    localStorage.setItem("musicVolume", JSON.stringify(volume));
  }, [volume]);

  // Change and persist language
  useEffect(() => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }, [language]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Game Settings</h1>

      <div className="w-full max-w-md mb-6">
        <label className="block mb-2">
          Music Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="w-full max-w-md mb-6">
        <label className="block mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Menu
      </button>
    </div>
  );
}
