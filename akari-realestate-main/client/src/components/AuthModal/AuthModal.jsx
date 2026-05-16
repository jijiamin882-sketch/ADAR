import React, { useState } from "react";
import "./AuthModal.css";
import { FiX, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiUser, FiHome, FiTool } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { supabase } from "../../supabaseClient";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // ← كان مفقوداً
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [registerRole, setRegisterRole] = useState("user");

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (mode === "login") {
      // ===== تسجيل الدخول =====
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setErrorMsg("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        } else {
          setErrorMsg(error.message);
        }
      } else {
        onClose();
      }
    } else {
      // ===== إنشاء حساب جديد =====
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            role: registerRole,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("تم إنشاء الحساب بنجاح! يمكنك الآن الانتقال لتسجيل الدخول.");
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        data: {
          role: registerRole,
        },
      },
    });
    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="custom-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        
        <button className="custom-close" onClick={onClose}><FiX /></button>

        <div className="custom-header">
          <h2>مرحباً بك في ADAR</h2>
          <p>سجّل دخولك للوصول إلى حسابك أو أنشئ حساباً جديداً</p>
        </div>

        <div className="custom-tabs">
          <button
            type="button"
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            className={mode === "signup" ? "tab active" : "tab"}
            onClick={() => { setMode("signup"); setErrorMsg(""); setSuccessMsg(""); }}
          >
            حساب جديد
          </button>
        </div>

        {errorMsg && (
          <div className="error-box">
            <FiAlertCircle className="error-icon" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="success-box">
            <FiCheckCircle className="success-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="custom-form">

          {/* ===== اختيار الدور: يظهر فقط في "حساب جديد" ===== */}
          {mode === "signup" && (
            <div className="auth-role-selector">
              <label>نوع الحساب:</label>
              <div className="auth-roles-grid">
                <label className={`auth-role-option ${registerRole === 'user' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="user" checked={registerRole === 'user'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiUser size={20} />
                  <span>مستخدم عادي</span>
                </label>
                <label className={`auth-role-option ${registerRole === 'owner' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="owner" checked={registerRole === 'owner'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiHome size={20} />
                  <span>مالك عقار</span>
                </label>
                <label className={`auth-role-option ${registerRole === 'provider' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="provider" checked={registerRole === 'provider'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiTool size={20} />
                  <span>مقدم خدمة</span>
                </label>
              </div>
            </div>
          )}

          {/* ===== حقل الاسم: يظهر فقط في "حساب جديد" ===== */}
          {mode === "signup" && (
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="الاسم الكامل"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "جاري التحقق..." : (mode === "login" ? "تسجيل الدخول" : "إنشاء الحساب")}
          </button>
        </form>

        <div className="custom-divider">
          <span>أو المتابعة عبر</span>
        </div>

        <div className="social-buttons">
          <button type="button" className="social-btn google" onClick={handleGoogleLogin}>
            <FaGoogle /> Google
          </button>
          <button type="button" className="social-btn facebook">
            <FaFacebookF /> Facebook
          </button>
          <button type="button" className="social-btn apple">
            <FaApple /> Apple
          </button>
        </div>

         

        <p className="custom-footer">
          بالاستمرار، أنت توافق على <a href="#">شروط الخدمة</a> و<a href="#">سياسة الخصوصية</a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;