import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة
import "./Login.css";

const Login = () => {
  const { t } = useTranslation(); // تعريف الترجمة
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        alert(t('login_success_register'));
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
      }
      navigate("/"); 
    } catch (error) {
      alert(`${t('login_error')} ${error.message || t('login_error_unknown')}`);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) alert(error.message);
  };

  return (
    // تم حذف dir="rtl" لأن i18n يتحكم في الاتجاه من ملف التهيئة الرئيسي
    <div className="login-container"> 
      <div className="login-card">
        <h2>{isRegistering ? t('login_title_register') : t('login_title_login')}</h2>
        <p className="login-subtitle">{isRegistering ? t('login_subtitle_register') : t('login_subtitle_login')}</p>
        
        <form onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder={t('login_email_placeholder')} 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder={t('login_password_placeholder')} 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('login_loading') : (isRegistering ? t('login_btn_register') : t('login_btn_login'))}
          </button>
        </form>

        <div className="divider">
          <span>{t('login_or')}</span>
        </div>

        <button onClick={signInWithGoogle} className="btn-google">
          <svg viewBox="0 0 24 24" width="20" height="20" style={{marginLeft: '10px'}}>
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.0761363 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"/>
            <path fill="#4A90D9" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.9038455 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"/>
            <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7281476 1.23746264,17.3349879 L5.27698177,14.2678769 Z"/>
          </svg>
          {t('login_google_btn')}
        </button>

        <p className="switch-mode" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? t('login_switch_to_login') : t('login_switch_to_register')}
        </p>
      </div>
    </div>
  );
};

export default Login;