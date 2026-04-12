import React, { useState } from "react";
import "./AuthModal.css";
import { FiX, FiMail } from "react-icons/fi";
import { FaGoogle, FaFacebookF, FaApple } from "react-icons/fa";

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal-box" onClick={(e) => e.stopPropagation()}>
        
        {/* زر الإغلاق */}
        <button className="auth-close-btn" onClick={onClose}>
          <FiX />
        </button>

        {/* العنوان */}
        <h2 className="auth-title">سجّل الدخول أو أنشئ حساباً</h2>
        <p className="auth-subtitle">ادخل إلى منصة ADAR العقارية</p>

        {/* حقل الإيميل */}
        <div className="auth-input-group">
          <FiMail className="auth-input-icon" />
          <input
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* زر المتابعة */}
        <button className="auth-continue-btn">
          متابعة
        </button>

        {/* فاصل */}
        <div className="auth-divider">
          <span>أو</span>
        </div>

        {/* أزرار التواصل الاجتماعي */}
        <div className="auth-social-btns">
          <button className="auth-social-btn google">
            <FaGoogle className="social-icon" /> Google
          </button>
          <button className="auth-social-btn facebook">
            <FaFacebookF className="social-icon" /> Facebook
          </button>
          <button className="auth-social-btn apple">
            <FaApple className="social-icon" /> Apple
          </button>
        </div>

        {/* رابط الوكلاء */}
        <div className="auth-agent-link">
          هل أنت وكيل عقاري؟ <a href="/agencies">انضم إلينا</a>
        </div>

        {/* الشروط */}
        <p className="auth-terms">
          بالاستمرار، أنت توافق على <a href="#">شروط الخدمة</a> و<a href="#">سياسة الخصوصية</a> الخاصة بـ ADAR.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;