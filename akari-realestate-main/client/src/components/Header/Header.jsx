import React, { useState, useEffect } from "react";
import "./Header.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiStar, FiLogOut, FiUser, FiGrid, FiGlobe, FiChevronDown } from "react-icons/fi"; // تم حذف BiChevronDown
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'fr';
    }
  };

  const toggleDropdown = (menuName) => {
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };
  
  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    setIsProfileOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <section className="h-wrapper">
      <div className="h-container">
        
        {/* الشعار */}
        <Link to="/" className="h-logo-link" onClick={closeMobileMenu}>
          <img src="./logo4.png" alt="ADAR" width={100} />
        </Link>

        {/* زر القائمة للهاتف */}
        <button 
          className={`h-mobile-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t('menu')}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* ========== قائمة الديسكتوب ========== */}
        <nav className="h-menu">
          <NavLink to="/">{t('home')}</NavLink>
          <NavLink to="/properties">{t('properties')}</NavLink>
          <NavLink to="/services">{t('services')}</NavLink>
          <NavLink to="/blog">{t('blog')}</NavLink>
          <NavLink to="/about">{t('about')}</NavLink>
        </nav>

        {/* ========== أزرار الإجراءات (الجزء الأيمن) ========== */}
        <div className="h-actions-wrapper">
          
          {/* 1. زر تبديل اللغة (تصميم مضغوط واحترافي) */}
          <button 
            className="h-lang-btn"
            onClick={() => changeLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
            title={i18n.language === 'ar' ? 'Passer en Français' : 'التبديل للعربية'}
          >
            <FiGlobe className="lang-icon" />
            <span className="lang-code">{i18n.language === 'ar' ? 'FR' : 'AR'}</span>
          </button>

          {/* 2. الحالة: لم يسجل الدخول */}
          {!currentUser ? (
            <>
              <button className="h-login-text" onClick={() => setIsAuthOpen(true)}>
                {t('login')}
              </button>  
              <button className="h-subscribe-btn" onClick={() => navigate('/pricingPlans')}>
                <FiStar /> {t('subscribe')}
              </button>
            </>
          ) : (
            <>
              {/* 3. زر الاشتراك (يصبح أقل بروزاً عند تسجيل الدخول) */}
              <button className="h-subscribe-btn h-btn-ghost" onClick={() => navigate('/pricingPlans')}>
                <FiStar /> {t('subscribe')}
              </button>

              {/* 4. قائمة المستخدم (هو العنصر الأبرز الآن) */}
              <div className="h-profile-wrapper">
                <button className="h-profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <div className="h-profile-avatar">
                    <FiUser />
                  </div>
                  <span className="h-profile-name">
                    {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                  </span>
                  <FiChevronDown className={`dropdown-arrow ${isProfileOpen ? 'rotate' : ''}`} />
                </button>
                
                {isProfileOpen && (
                   <div className="h-profile-dropdown">
                      <div className="h-profile-dropdown-header">
                       <span>{t('welcome')}</span>
                       <small>{currentUser.email}</small>
                      </div>

                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="h-dropdown-item h-dashboard-link">
                        <FiGrid />
                         {t('dashboard')}   
                      </Link>

                      <button onClick={handleLogout} className="h-dropdown-item h-logout-btn">
                        <FiLogOut /> {t('logout')}
                      </button>
                    </div>
                 )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========== القائمة الجانبية للهاتف ========== */}
      <div className={`h-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        
        {/* وضع زر اللغة في القائمة الجانبة أيضاً لتنظيم الهيدر العلوي للهاتف */}
        <div className="mobile-top-actions">
           <button 
              className="h-lang-btn"
              onClick={() => changeLanguage(i18n.language === 'ar' ? 'fr' : 'ar')}
            >
              <FiGlobe className="lang-icon" />
              <span>{i18n.language === 'ar' ? 'Français' : 'العربية'}</span>
            </button>
        </div>

        <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>{t('home')}</NavLink>
        <NavLink to="/properties" className="mobile-nav-link" onClick={closeMobileMenu}>{t('properties')}</NavLink>
        <NavLink to="/services" className="mobile-nav-link" onClick={closeMobileMenu}>{t('services')}</NavLink>
        <NavLink to="/blog" className="mobile-nav-link" onClick={closeMobileMenu}>{t('blog')}</NavLink>
        <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>{t('about')}</NavLink>
        
        <div className="mobile-auth-section">
          {!currentUser ? (
            <>
              <button className="h-login-text" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }}>
                {t('login')}
              </button>
              <button className="h-subscribe-btn" onClick={() => { navigate('/pricingPlans'); closeMobileMenu(); }}>
                <FiStar /> {t('subscribe')}
              </button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                <FiGrid /> {t('dashboard')}
              </Link>
              <button className="h-login-text h-mobile-logout" onClick={handleLogout}>
                <FiLogOut /> {t('logout')}
              </button>
            </>
          )}
        </div>
      </div>

      <div className={`h-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>

      {isAuthOpen && (
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      )}
    </section>
  );
};

export default Header;