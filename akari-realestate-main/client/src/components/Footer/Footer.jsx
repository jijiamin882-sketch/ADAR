import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, FaInstagram, FaLinkedin, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt,
  FaTiktok, 
} from 'react-icons/fa';
import './Footer.css';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="adar-footer">
      <div className="footer-container">
        
        <div className="footer-grid">
          
          {/* 1. قسم التعريف بالمنصة */}
          <div className="footer-section">
            <Link to="/" className="footer-logo-link">
              <img src="./logo4.png" alt="Adar Logo" className="footer-logo" />
            </Link>
            <p className="footer-vision">
              {t('footer_vision')}
            </p>
            
            <div className="footer-contact-info">
              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span> 456 253 555 213 +</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>adarakar26@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>{t('footer_location')}</span>
              </div>
            </div>

            <div className="footer-socials">
              <a href="https://www.facebook.com" className="social-link"><FaFacebook /></a>
              <a href="https://www.instagram.com/adar.akari?igsh=MTA2aWI5ODY4b3d2Zg==" className="social-link"><FaInstagram /></a>
              <a href="https://www.linkedin.com" className="social-link"><FaLinkedin /></a>
              <a href="" className="social-link" target="_blank" rel="noreferrer"><FaTiktok /></a>
            </div>
          </div>

          {/* 2. قسم الخدمات */}
          <div className="footer-section">
            <h3 className="section-title">{t('footer_services_title')}</h3>
            <ul className="links-list">
              <li><Link to="/notaries" className="footer-link">{t('footer_service_notaries')}</Link></li>
              <li><Link to="/maintenance" className="footer-link">{t('footer_service_maintenance')}</Link></li>
              <li><Link to="/furniture" className="footer-link">{t('footer_service_furniture')}</Link></li>
              <li><Link to="/moving" className="footer-link">{t('footer_service_moving')}</Link></li>
            </ul>
          </div>

          {/* 3. قسم روابط سريعة */}
          <div className="footer-section">
            <h3 className="section-title">{t('footer_quick_links_title')}</h3>
            <ul className="links-list">
              <li><Link to="/properties" className="footer-link">{t('footer_explore_properties')}</Link></li>
              <li><Link to="/About" className="footer-link">{t('footer_about_us')}</Link></li>
              <li><Link to="/PrivacyPolicy" className="footer-link">{t('footer_privacy_policy')}</Link></li>
            </ul>
          </div>

        </div>

        {/* شريط حقوق النشر */}
        <div className="footer-bottom-bar">
          <p>{t('footer_copyright')} {new Date().getFullYear()}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;