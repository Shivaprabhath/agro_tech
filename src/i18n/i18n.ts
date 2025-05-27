import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "./locales/en.json";
import esTranslations from "./locales/es.json";
import frTranslations from "./locales/fr.json";
import hiTranslations from "./locales/hi.json";
import teTranslations from "./locales/te.json";
import taTranslations from "./locales/ta.json";

// Get stored language preference
const storedLanguage = localStorage.getItem("preferredLanguage");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      hi: {
        translation: hiTranslations,
      },
      te: {
        translation: teTranslations,
      },
      ta: {
        translation: taTranslations,
      },

      es: {
        translation: esTranslations,
      },
      fr: {
        translation: frTranslations,
      },
    },
    lng: storedLanguage || undefined,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
