import React, { useState } from "react";
import "./Header.css";
import { BiChevronDown } from "react-icons/bi";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiStar, FiLogOut, FiUser, FiHeart, FiHome,FiGrid } from "react-icons/fi";
import AuthModal from "../AuthModal/AuthModal";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // جديد: لحالة قائمة المستخدم

  const toggleDropdown = (menuName) => {
    setActiveDropdown(prev => (prev === menuName ? null : menuName));
  };

  const location = useLocation();
  
  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
    setIsProfileOpen(false);
    // 1. مسح بيانات المستخدم من localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // 2. مسح بيانات المستخدم من sessionStorage (إن وجدت)
    sessionStorage.clear();
    
    // 3. الانتقال إلى الصفحة الرئيسية
    navigate('/');
    
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };
   
  const navigate = useNavigate();

   
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

        {/* ========== أزرار الدخول / قائمة المستخدم ========== */}
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
            /* ✅ الشكل الجديد عند تسجيل الدخول */
            <div className="h-profile-wrapper">
              <button className="h-profile-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="h-profile-avatar">
                  <FiUser />
                </div>
                <span className="h-profile-name">
                  {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                </span>
                <BiChevronDown className={`dropdown-arrow ${isProfileOpen ? 'rotate' : ''}`} />
              </button>
              
                               {isProfileOpen && (
                 <div className="h-profile-dropdown">
                    <div className="h-profile-dropdown-header">
                     <span>مرحباً بك!</span>
                     <small>{currentUser.email}</small>
                    </div>

                    {/* ✅ زر لوحة التحكم الجديد */}
                    <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="h-logout-dropdown-btn" style={{color:'#f1c991', textDecoration:'none', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '5px'}}>
                      <FiGrid style={{ marginRight: '8px' }} />
                       لوحة التحكم   
                    </Link>

                    
    
                     

                    <button onClick={handleLogout} className="h-logout-dropdown-btn">
                      <FiLogOut /> تسجيل الخروج
                    </button>
                  </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* ========== القائمة الجانبية للهاتف ========== */}
      <div className={`h-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>الرئيسية</NavLink>
        <NavLink to="/properties" className="mobile-nav-link" onClick={closeMobileMenu}>العقارات</NavLink>
        <NavLink to="/Services" className="mobile-nav-link" onClick={closeMobileMenu}>الخدمات</NavLink>
        <NavLink to="/Blog" className="mobile-nav-link" onClick={closeMobileMenu}>المدونة</NavLink>
        <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>عنا</NavLink>
        
        <div className="mobile-auth-section">
          {!currentUser ? (
            <>
              <button className="h-login-text" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }}>تسجيل الدخول</button>
              <button className="h-subscribe-btn" onClick={() => { setIsAuthOpen(true); closeMobileMenu(); }}><FiStar /> اشتراك</button>
            </>
          ) : (
            <button className="h-login-text" onClick={handleLogout}><FiLogOut /> تسجيل الخروج ({currentUser.email?.split('@')[0]})</button>
          )}
        </div>
      </div>

      <div className={`h-mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={closeMobileMenu}></div>

      {/* نافذة تسجيل الدخول المنبثقة */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </section>
  );
};

export default Header;