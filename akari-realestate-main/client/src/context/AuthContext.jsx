import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // مهم جداً لمنع الوميض

  useEffect(() => {
    // 1. جلب الجلسة الحالية عند فتح الموقع أو تحديث الصفحة
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // 2. الاستماع لأي تغيير في حالة تسجيل الدخول (دخول، خروج، تحديث)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
      setLoading(false);
    });

    // تنظيف الاستماع عند إغلاق المكون
    return () => subscription.unsubscribe();
  }, []);

  // دالة تسجيل الخروج
  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};