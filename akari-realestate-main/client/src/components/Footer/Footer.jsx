/*import React from "react";
import "./Footer.css";
const Footer = () => {
  return (
    <div className="f-wrapper">
      <div className="paddings innerWidth flexCenter f-container">
        {/* left side */
        /*<div className="flexColStart f-left">
          <img src="./logo2.png" alt="" width={120} />
          <span className="secondaryText">
            Our vision is to make all people <br />
            the best place to live for them.
          </span>
        </div>

        <div className="flexColStart f-right">
          <span className="primaryText">Information</span>
          <span className="secondaryText">  Djelfa 17, Algeria</span>
          <div className="flexCenter f-menu">
            <span>Property</span>
            <span>Services</span>
            <span>Product</span>
            <span>About Us</span>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 text-xs">
        <p>© {new Date().getFullYear()} مشروع Adar. جميع الحقوق محفوظة.</p>
         
      </div>
      </div>
    </div>
  );
};

export default Footer;*/
 

 
/*const Footer = () => {
  return (
    <footer className="adar-footer">
      <div className="container">
        <div className="footer-content">
          
          {/* قسم التعريف بالمنصة *}
         <div className="footer-section about">
             <a href="http://localhost:5174/"/>
            <p className="footer-vision">
              منصتكم الرقمية الموثوقة للعقارات في الجزائر. نبني جسراً بين البائع والمشتري بكل شفافية واحترافية.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link"><FaFacebook size={20} /></a>
              <a href="#" className="social-link"><FaInstagram size={20} /></a>
              <a href="#" className="social-link"><FaLinkedin size={20} /></a>
              <a href="#" className="social-link"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          {/* قسم استكشاف العقارات (قائمة عمودية) *}
          <div className="footer-section links">
            <h3 className="section-title">استكشف العقارات</h3>
            <ul className="links-list">
              <li><a href="#" className="footer-link">شقق للبيع في الجلفة</a></li>
              <li><a href="#" className="footer-link">كراء منازل عائلية</a></li>
              <li><a href="#" className="footer-link">أراضي صالحة للبناء</a></li>
              <li><a href="#" className="footer-link">مساحات تجارية</a></li>
            </ul>
          </div>

          {/* قسم معلومات الشركة (قائمة عمودية) *}
          <div className="footer-section links">
            <h3 className="section-title">عن المنصة</h3>
            <ul className="links-list">
              <li><a href="#" className="footer-link">من نحن</a></li>
              <li><a href="#" className="footer-link">سياسة الخصوصية</a></li>
              <li><a href="#" className="footer-link">الشروط والأحكام</a></li>
              <li><a href="#" className="footer-link">اتصل بنا</a></li>
            </ul>
          </div>

          {/* قسم النشرة البريدية والتفاعل *}
         <div className="footer-section newsletter">
            <h3 className="section-title">اشترك معنا</h3>
            <p className="newsletter-desc">احصل على تنبيهات بأحدث العقارات المضافة.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="بريدك الإلكتروني" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">إرسال</button>
            </form>
          </div>

        </div>

        {/* شريط حقوق النشر واللمسة الجمالية السفلي * }
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} مشروع Adar. جميع الحقوق محفوظة.</p>
           
        </div>
      </div>
    </footer>
  );
};

export default Footer;
*/
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
              <li><Link to="/agencies" className="footer-link">الوكالات العقارية</Link></li>
              <li><Link to="/About" className="footer-link">من نحن</Link></li>
              <li><Link to="/Services" className="footer-link">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* 4. قسم النشرة البريدية */}
          <div className="footer-section">
            <h3 className="section-title">النشرة البريدية</h3>
            <p className="newsletter-desc">اشترك ليصلك كل جديد عن العقارات والعروض الحصرية.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="بريدك الإلكتروني" 
                className="newsletter-input" 
                required 
              />
              <button type="submit" className="newsletter-btn">اشتراك</button>
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