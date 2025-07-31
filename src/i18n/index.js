import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // ✅ Ensure fallback is set to 'en'
    debug: true, // ✅ Enable debug mode to see logs
    ns: ["common"], // ✅ Define namespace
    defaultNS: "common", // ✅ Set default namespace
    interpolation: { escapeValue: false },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // ✅ Ensure correct path
    },
  });

export default i18n;
