import React, { useState } from "react";
import "./Header.css";
import { BiChevronDown } from "react-icons/bi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiStar, FiLogOut, FiUser } from "react-icons/fi";
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDropdown = (menuName) => {
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };

  const location = useLocation();
  const isPropertiesActive = location.pathname === '/properties';
  const isagenciesActive = location.pathname === '/agencies';
  const isServicesActive = location.pathname === '/Services';
  const isaboutActive = location.pathname === '/about';
  const isBlogActive = location.pathname === '/Blog';

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };
  // دالة تسجيل الدخول بجوجل
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
      redirectTo: window.location.origin, // يعيد المستخدم للموقع بعد الدخول
    },
  });

  if (error) console.log("خطأ في تسجيل الدخول:", error.message);
};

 

  return (
    <section className="h-wrapper">
      <div className="h-container">
        
        <Link to="/" onClick={closeMobileMenu}>
          <img src="./logo4.png" alt="ADAR" width={100} />
        </Link>

        <button 
          className={`h-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="القائمة"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* ========== قائمة الديسكتوب ========== */}
        <div className="h-menu">
          <NavLink to="/">الرئيسية</NavLink>
          <NavLink to="/properties">العقارات</NavLink>
          <NavLink to="/services">الخدمات</NavLink>
          <NavLink to="/blog">المدونة</NavLink>
          <NavLink to="/about">عنا</NavLink>
          
        </div>
        {/* ========== أزرار الدخول ========== */}
        <div className="h-auth-buttons">
          {!currentUser ? (
            <>
              <button className="h-login-text" onClick={() => setIsAuthOpen(true)}>
                تسجيل الدخول
              </button>
              <button className="h-subscribe-btn" onClick={() => setIsAuthOpen(true)}>
                <FiStar /> اشتراك
              </button>
            </>
          ) : (
            <button className="h-login-text" onClick={handleLogout}>
              <FiLogOut /> تسجيل الخروج
            </button>
          )}
        </div>

      </div>

      {/* ========== القائمة الجانبية للهاتف ========== */}
      <div className={`h-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        
        <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
          الرئيسية
        </NavLink>
        <NavLink to="/properties" className="mobile-nav-link" onClick={closeMobileMenu}>
          العقارات
        </NavLink>
        <NavLink to="/Services" className="mobile-nav-link" onClick={closeMobileMenu}>
          الخدمات
        </NavLink>
        <NavLink to="/Blog" className="mobile-nav-link" onClick={closeMobileMenu}>
          المدونة
        </NavLink>
        <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
          عنا
        </NavLink>
        <div className="mobile-auth-section">
          {!currentUser ? (
            <>
              <button className="h-login-text" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }}>
                تسجيل الدخول
              </button>
              <button className="h-subscribe-btn" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }}>
                <FiStar /> اشتراك
              </button>
            </>
          ) : (
            <button className="h-login-text" onClick={handleLogout}>
              <FiLogOut /> تسجيل الخروج
            </button>
          )}
        </div>
      </div>

      <div className={`h-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
};

export default Header;