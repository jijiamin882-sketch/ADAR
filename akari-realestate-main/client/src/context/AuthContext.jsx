import React, { createContext, useContext, useState, useEffect } from "react";
// 1. استيراد supabase بدلاً من firebase
import { supabase } from "../config/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // مراقبة حالة المستخدم (هذا ما سيجعل زر "خروج" يظهر فوراً)
  useEffect(() => {
    // التحقق من المستخدم الحالي عند فتح الموقع
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // الاستماع لأي تغيير (دخول أو خروج)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // تسجيل الخروج
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};