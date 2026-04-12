import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { ref, set } from "firebase/database";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // إنشاء حساب جديد
  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await set(ref(db, `users/${result.user.uid}`), {
      name,
      email,
      role: "user",
      createdAt: new Date().toISOString(),
    });
    return result;
  };

  // تسجيل دخول
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // تسجيل خروج
  const logout = () => {
    return signOut(auth);
  };

  // إعادة تعيين كلمة المرور
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // مراقبة حالة المستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};