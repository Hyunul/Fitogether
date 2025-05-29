import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./i18n/locales/ko.json";
import en from "./i18n/locales/en.json";

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: ko,
    },
    en: {
      translation: en,
    },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
