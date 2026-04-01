import React, { useState } from "react";
import { auth } from "../firebase"; // تأكدي من المسار لملف firebase.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("تم إنشاء الحساب بنجاح! 🎉");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert("تم تسجيل الدخول!");
      }
      navigate("/"); // العودة للصفحة الرئيسية بعد النجاح
    } catch (error) {
      alert("خطأ: " + error.message);
    }
  };

  return (
    <div className="login-container" dir="rtl">
      <div className="login-card">
        <h2>{isRegistering ? "إنشاء حساب جديد" : "تسجيل الدخول"}</h2>
        <form onSubmit={handleAuth}>
          <input type="email" placeholder="البريد الإلكتروني" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="كلمة السر" onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="button">
            {isRegistering ? "إنشاء حساب" : "دخول"}
          </button>
        </form>
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "لديك حساب بالفعل؟ سجل دخولك" : "ليس لديك حساب؟ أنشئ حساباً الآن"}
        </p>
      </div>
    </div>
  );
};

export default Login;