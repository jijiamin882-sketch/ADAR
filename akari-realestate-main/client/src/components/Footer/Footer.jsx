
import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, 
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import './Footer.css';

const Footer = () => {
  
  // دالة الاشتراك في النشرة البريدية
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("تم اشتراكك في النشرة البريدية بنجاح! شكراً لك.", {
      position: "top-center",
      autoClose: 3000,
    });
    e.target.reset(); // تفريغ الحقل بعد الإرسال
  };

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
              منصتكم الرقمية الموثوقة للعقارات في الجزائر. نبني جسراً بين البائع والمشتري بكل شفافية واحترافية.
            </p>
            
            <div className="footer-contact-info">
              <div className="contact-item">
                <FaPhoneAlt className="contact-icon" />
                <span>+213 555 123 456</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>contact@adar-realestate.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>الجلفة، الجزائر</span>
              </div>
            </div>

            <div className="footer-socials">
              <a href="#" className="social-link"><FaFacebook /></a>
              <a href="#" className="social-link"><FaInstagram /></a>
              <a href="#" className="social-link"><FaLinkedin /></a>
              <a href="#" className="social-link"><FaWhatsapp /></a>
            </div>
          </div>

          {/* 2. قسم الخدمات */}
          <div className="footer-section">
            <h3 className="section-title">خدماتنا</h3>
            <ul className="links-list">
              <li><Link to="/notaries" className="footer-link">خدمات الموثقون</Link></li>
              <li><Link to="/maintenance" className="footer-link">صيانة العقار</Link></li>
              <li><Link to="/furniture" className="footer-link">خدمات الأثاث</Link></li>
              <li><Link to="/moving" className="footer-link">نقل الأثاث</Link></li>
            </ul>
          </div>

          {/* 3. قسم روابط سريعة */}
          <div className="footer-section">
            <h3 className="section-title">روابط سريعة</h3>
            <ul className="links-list">
              <li><Link to="/properties" className="footer-link">استكشف العقارات</Link></li>
              <li><Link to="/About" className="footer-link">من نحن</Link></li>
              <li><Link to="/PrivacyPolicy" className="footer-link">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* 4. قسم النشرة البريدية */}
          <div className="footer-section">
            <h3 className="section-title">اشترك معنا</h3>
            <p className="newsletter-desc">اشترك ليصلك كل جديد عن العقارات والعروض الحصرية.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="newsletter-input" 
                required 
              />
              <button type="submit" className="newsletter-btn">ارسل</button>
            </form>
          </div>

        </div>

        {/* شريط حقوق النشر */}
        <div className="footer-bottom-bar">
          <p>مشروع ADAR جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;