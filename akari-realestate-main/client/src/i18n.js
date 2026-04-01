import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      translation: {
        // يمكنك إضافة ترجماتك هنا مستقبلاً
      },
    },
  },
  lng: "ar", // إجبار الموقع على العربية
  fallbackLng: "ar",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;