import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Only initialize if we're in a browser environment
if (typeof window !== 'undefined' && !i18n.isInitialized) {
  i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      fallbackLng: "en", // ✅ Ensure fallback is set to 'en'
      debug: false, // Disable debug in production builds
      ns: ["common"], // ✅ Define namespace
      defaultNS: "common", // ✅ Set default namespace
      interpolation: { escapeValue: false },
      backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json", // ✅ Ensure correct path
      },
      // Add fallback resources for build time
      resources: {
        en: {
          common: {
            "gamePage.LoadingError": "Loading Error",
            "gamePage.NoMapData": "No map data available"
          }
        }
      }
    });
}

export default i18n;
