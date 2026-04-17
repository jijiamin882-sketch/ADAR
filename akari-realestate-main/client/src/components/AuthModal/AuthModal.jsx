import React, { useState } from "react";
import "./AuthModal.css";
import { FiX, FiMail, FiLock } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
// استيراد supabase من ملف الإعدادات
import { supabase } from "../../config/supabaseClient";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // 1. إضافة المتغير المفقود
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // دالة تسجيل الدخول / إنشاء حساب (البريد والباسورد)
  const handleAuth = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    // محاولة تسجيل الدخول مباشرة
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // إذا لم يجد الحساب، نقوم بإنشائه فوراً
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        alert("خطأ: " + signUpError.message);
      } else {
        alert("أهلاً بك في ADAR! تم إنشاء حسابك بنجاح.");
        onClose();
      }
    } else {
      alert("تم تسجيل الدخول بنجاح!");
      onClose();
    }
    setLoading(false);
  };

  // دالة تسجيل الدخول بجوجل
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) alert(error.message);
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
        
        <button className="auth-close-btn" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="auth-title">سجّل الدخول أو أنشئ حساباً</h2>
        <p className="auth-subtitle">ادخل إلى منصة ADAR العقارية</p>

        <form onSubmit={handleAuth}> {/* استخدام form أفضل للتنظيم */}
          {/* حقل الإيميل */}
          <div className="auth-input-group">
            <FiMail className="auth-input-icon" />
            <input
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* حقل كلمة السر */}
          <div className="auth-input-group">
            <FiLock className="auth-input-icon" />
            <input
              type="password"
              placeholder="أدخل كلمة السر"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* زر المتابعة */}
          <button 
            className="auth-continue-btn" 
            type="submit" // جعل النوع submit
            disabled={loading}
          >
            {loading ? "جاري المعالجة..." : "متابعة"}
          </button>
        </form>

        <div className="auth-divider">
          <span>أو</span>
        </div>

        {/* أزرار التواصل الاجتماعي */}
        <div className="auth-social-btns">
          <button className="auth-social-btn google" onClick={handleGoogleLogin}>
            <FaGoogle className="social-icon" /> Google
          </button>
          
          <button className="auth-social-btn facebook">
            <FaFacebookF className="social-icon" /> Facebook
          </button>
          <button className="auth-social-btn apple">
            <FaApple className="social-icon" /> Apple
          </button>
        </div>

        <p className="auth-terms">
          بالاستمرار، أنت توافق على <a href="#">شروط الخدمة</a> و<a href="/PrivacyPolicy">سياسة الخصوصية</a> الخاصة بـ ADAR.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;