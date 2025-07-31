import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Initialize with fallback resources for build time
const resources = {
  en: {
    common: {
      "gamePage.LoadingError": "Loading Error",
      "gamePage.NoMapData": "No map data available",
    }
  }
};

// Only use browser-specific plugins if we're in a browser
const plugins = [];
if (typeof window !== 'undefined') {
  plugins.push(HttpBackend, LanguageDetector);
}

i18n
  .use(initReactI18next);

// Add browser plugins only if available
plugins.forEach(plugin => i18n.use(plugin));

i18n.init({
  fallbackLng: "en",
  debug: false, // Disable debug for builds
  ns: ["common"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  resources, // Always have fallback resources
  ...(typeof window !== 'undefined' && {
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  }),
});

export default i18n;
