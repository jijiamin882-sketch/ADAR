import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import './i18n.js';

// === استيراد مزود المصادقة الخاص بنا (Supabase) بدلاً من Auth0 ===
import { AuthContextProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* لف التطبيق بـ AuthContextProvider ليتمكن كل الموقع من معرفة المستخدم */}
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);