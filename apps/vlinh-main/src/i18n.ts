import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Cookies from "js-cookie";
import en from "./locales/en.json";

// 从 cookie 中获取保存的语言设置，如果没有则使用默认语言
const savedLanguage = Cookies.get("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// 监听语言变化，保存到 cookie
i18n.on("languageChanged", (lng) => {
  Cookies.set("language", lng, { expires: 365 }); // 保存一年
});

export default i18n;
