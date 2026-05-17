import React, { useState } from "react";
import "./AuthModal.css";
import { FiX, FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiUser, FiHome, FiTool } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

const AuthModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation(); // تعريف الترجمة
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Invalid login credentials") {
          setErrorMsg(t('auth_error_invalid_credentials'));
        } else {
          setErrorMsg(error.message);
        }
      } else {
        onClose();
      }
    } else {
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
        setSuccessMsg(t('auth_success_signup'));
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
          <h2>{t('auth_welcome_title')}</h2>
          <p>{t('auth_welcome_desc')}</p>
        </div>

        <div className="custom-tabs">
          <button
            type="button"
            className={mode === "login" ? "tab active" : "tab"}
            onClick={() => { setMode("login"); setErrorMsg(""); setSuccessMsg(""); }}
          >
            {t('auth_tab_login')}
          </button>
          <button
            type="button"
            className={mode === "signup" ? "tab active" : "tab"}
            onClick={() => { setMode("signup"); setErrorMsg(""); setSuccessMsg(""); }}
          >
            {t('auth_tab_signup')}
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

          {mode === "signup" && (
            <div className="auth-role-selector">
              <label>{t('auth_role_label')}</label>
              <div className="auth-roles-grid">
                <label className={`auth-role-option ${registerRole === 'user' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="user" checked={registerRole === 'user'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiUser size={20} />
                  <span>{t('auth_role_user')}</span>
                </label>
                <label className={`auth-role-option ${registerRole === 'owner' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="owner" checked={registerRole === 'owner'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiHome size={20} />
                  <span>{t('auth_role_owner')}</span>
                </label>
                <label className={`auth-role-option ${registerRole === 'provider' ? 'selected' : ''}`}>
                  <input type="radio" name="role" value="provider" checked={registerRole === 'provider'} onChange={(e) => setRegisterRole(e.target.value)} />
                  <FiTool size={20} />
                  <span>{t('auth_role_provider')}</span>
                </label>
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder={t('auth_fullname_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-wrapper">
            <FiMail className="input-icon" />
            <input type="email" placeholder={t('auth_email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-wrapper">
            <FiLock className="input-icon" />
            <input type="password" placeholder={t('auth_password_placeholder')} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? t('auth_loading') : (mode === "login" ? t('auth_btn_login') : t('auth_btn_signup'))}
          </button>
        </form>

        <div className="custom-divider">
          <span>{t('auth_divider')}</span>
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
          {t('auth_footer_terms')} <a href="#">{t('auth_footer_tos')}</a> {t('auth_footer_and')} <a href="#">{t('auth_footer_privacy')}</a>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;