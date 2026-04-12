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

          <div className="nav-item-wrapper">
            <button 
              className={`nav-dropdown-btn ${isPropertiesActive ? 'active' : ''}`} 
              onClick={() => toggleDropdown('properties')}
            >
              العقارات <BiChevronDown className={`dropdown-arrow ${activeDropdown === 'properties' ? 'rotate' : ''}`} />
            </button>
            <div className={`nav-dropdown-content ${activeDropdown === 'properties' ? 'show' : ''}`}>
              <NavLink to="/properties?type=apartment" onClick={() => setActiveDropdown(null)}>شقق للبيع</NavLink>
              <NavLink to="/properties?type=villa" onClick={() => setActiveDropdown(null)}>فيلات</NavLink>
              <NavLink to="/properties?type=land" onClick={() => setActiveDropdown(null)}>اراضي</NavLink>
              <NavLink to="/properties?type=commercial" onClick={() => setActiveDropdown(null)}>محلات تجارية</NavLink>
            </div>
          </div>

          <div className="nav-item-wrapper">
            <button 
              className={`nav-dropdown-btn ${isagenciesActive ? 'active' : ''}`} 
              onClick={() => toggleDropdown('agencies')}
            >
              الوكالات <BiChevronDown className={`dropdown-arrow ${activeDropdown === 'agencies' ? 'rotate' : ''}`} />
            </button>
            <div className={`nav-dropdown-content ${activeDropdown === 'agencies' ? 'show' : ''}`}>
              <NavLink to="/agencies" onClick={() => setActiveDropdown(null)}>افضل الوكالات</NavLink>
              <NavLink to="/agencies" onClick={() => setActiveDropdown(null)}>وكالات العاصمة</NavLink>
            </div>
          </div>

          <div className="nav-item-wrapper">
            <button 
              className={`nav-dropdown-btn ${isServicesActive ? 'active' : ''}`} 
              onClick={() => toggleDropdown('services')}
            >
              الخدمات <BiChevronDown className={`dropdown-arrow ${activeDropdown === 'services' ? 'rotate' : ''}`} />
            </button>
            <div className={`nav-dropdown-content ${activeDropdown === 'services' ? 'show' : ''}`}>
              <NavLink to="/Services#valuation" onClick={() => setActiveDropdown(null)}>تقييم عقاري</NavLink>
              <NavLink to="/Services#legal" onClick={() => setActiveDropdown(null)}>استشارات قانونية</NavLink>
            </div>
          </div>

          {/* ========== المدونة (منسدلة مثل الباقي) ========== */}
          <div className="nav-item-wrapper">
            <button 
              className={`nav-dropdown-btn ${isBlogActive ? 'active' : ''}`} 
              onClick={() => toggleDropdown('blog')}
            >
              المدونة <BiChevronDown className={`dropdown-arrow ${activeDropdown === 'blog' ? 'rotate' : ''}`} />
            </button>
            <div className={`nav-dropdown-content ${activeDropdown === 'blog' ? 'show' : ''}`}>
              <NavLink to="/Blog" onClick={() => setActiveDropdown(null)}>جميع المقالات</NavLink>
              <NavLink to="/Blog?type=news" onClick={() => setActiveDropdown(null)}>أخبار العقارات</NavLink>
              <NavLink to="/Blog?type=tips" onClick={() => setActiveDropdown(null)}>نصائح الاستثمار</NavLink>
              <NavLink to="/Blog?type_guide" onClick={() => setActiveDropdown(null)}>دليل المشتري</NavLink>
            </div>
          </div>

          <div className="nav-item-wrapper">
            <button 
              className={`nav-dropdown-btn ${isaboutActive ? 'active' : ''}`}  
              onClick={() => toggleDropdown('about')}
            >
              عنا <BiChevronDown className={`dropdown-arrow ${activeDropdown === 'about' ? 'rotate' : ''}`} />
            </button>
            <div className={`nav-dropdown-content ${activeDropdown === 'about' ? 'show' : ''}`}>
              <NavLink to="/about" onClick={() => setActiveDropdown(null)}>رؤيتنا</NavLink>
              <NavLink to="/about" onClick={() => setActiveDropdown(null)}>شركاؤنا</NavLink>
              <NavLink to="/about" onClick={() => setActiveDropdown(null)}>فريق العمل</NavLink>
            </div>
          </div>
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
              <FiLogOut /> خروج
            </button>
          )}
        </div>

      </div>

      {/* ========== القائمة الجانبية للهاتف ========== */}
      <div className={`h-mobile-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
        
        <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
          الرئيسية
        </NavLink>

        <div className="mobile-accordion-item">
          <button 
            className={`mobile-accordion-header ${activeDropdown === 'properties' ? 'open' : ''}`}
            onClick={() => toggleDropdown('properties')}
          >
            العقارات
            <BiChevronDown className="dropdown-arrow" />
          </button>
          <div className={`mobile-accordion-body ${activeDropdown === 'properties' ? 'open' : ''}`}>
            <NavLink to="/properties?type=apartment" onClick={closeMobileMenu}>شقق للبيع</NavLink>
            <NavLink to="/properties?type=villa" onClick={closeMobileMenu}>فيلات</NavLink>
            <NavLink to="/properties?type=land" onClick={closeMobileMenu}>اراضي</NavLink>
            <NavLink to="/properties?type=commercial" onClick={closeMobileMenu}>محلات تجارية</NavLink>
          </div>
        </div>

        <div className="mobile-accordion-item">
          <button 
            className={`mobile-accordion-header ${activeDropdown === 'agencies' ? 'open' : ''}`}
            onClick={() => toggleDropdown('agencies')}
          >
            الوكالات
            <BiChevronDown className="dropdown-arrow" />
          </button>
          <div className={`mobile-accordion-body ${activeDropdown === 'agencies' ? 'open' : ''}`}>
            <NavLink to="/agencies" onClick={closeMobileMenu}>افضل الوكالات</NavLink>
            <NavLink to="/agencies" onClick={closeMobileMenu}>وكالات العاصمة</NavLink>
          </div>
        </div>

        <div className="mobile-accordion-item">
          <button 
            className={`mobile-accordion-header ${activeDropdown === 'services' ? 'open' : ''}`}
            onClick={() => toggleDropdown('services')}
          >
            الخدمات
            <BiChevronDown className="dropdown-arrow" />
          </button>
          <div className={`mobile-accordion-body ${activeDropdown === 'services' ? 'open' : ''}`}>
            <NavLink to="/Services#valuation" onClick={closeMobileMenu}>تقييم عقاري</NavLink>
            <NavLink to="/Services#legal" onClick={closeMobileMenu}>استشارات قانونية</NavLink>
          </div>
        </div>

        {/* ========== المدونة في الهاتف (أكورديون مثل الباقي) ========== */}
        <div className="mobile-accordion-item">
          <button 
            className={`mobile-accordion-header ${activeDropdown === 'blog' ? 'open' : ''}`}
            onClick={() => toggleDropdown('blog')}
          >
            المدونة
            <BiChevronDown className="dropdown-arrow" />
          </button>
          <div className={`mobile-accordion-body ${activeDropdown === 'blog' ? 'open' : ''}`}>
            <NavLink to="/Blog" onClick={closeMobileMenu}>جميع المقالات</NavLink>
            <NavLink to="/Blog?type=news" onClick={closeMobileMenu}>أخبار العقارات</NavLink>
            <NavLink to="/Blog?type=tips" onClick={closeMobileMenu}>نصائح الاستثمار</NavLink>
            <NavLink to="/Blog?type=guide" onClick={closeMobileMenu}>دليل المشتري</NavLink>
          </div>
        </div>

        <div className="mobile-accordion-item">
          <button 
            className={`mobile-accordion-header ${activeDropdown === 'about' ? 'open' : ''}`}
            onClick={() => toggleDropdown('about')}
          >
            عنا
            <BiChevronDown className="dropdown-arrow" />
          </button>
          <div className={`mobile-accordion-body ${activeDropdown === 'about' ? 'open' : ''}`}>
            <NavLink to="/about" onClick={closeMobileMenu}>رؤيتنا</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu}>شركاؤنا</NavLink>
            <NavLink to="/about" onClick={closeMobileMenu}>فريق العمل</NavLink>
          </div>
        </div>

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