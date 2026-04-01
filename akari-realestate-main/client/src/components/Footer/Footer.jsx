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
 

import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; // تأكدي من تثبيت react-icons

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
const Footer = () => {
  return (
    <footer className="adar-footer">
      <div className="container">
        <div className="footer-content">
          
          {/* قسم التعريف بالمنصة */}
         <div className="footer-section about">
             {/* تم تعديل هذا السطر لإضافة اللوجو */}
             <a href="/" className="footer-logo-link">
               <img src="./logo4.png" alt= "" className="footer-logo" />
             </a>
            
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

          {/* قسم استكشاف العقارات (قائمة عمودية) */}
          <div className="footer-section links">
            <h3 className="section-title">استكشف العقارات</h3>
            <ul className="links-list">
              <li><a href="#" className="footer-link">شقق للبيع في الجلفة</a></li>
              <li><a href="#" className="footer-link">كراء منازل عائلية</a></li>
              <li><a href="#" className="footer-link">أراضي صالحة للبناء</a></li>
              <li><a href="#" className="footer-link">مساحات تجارية</a></li>
            </ul>
          </div>

          {/* قسم معلومات الشركة (قائمة عمودية) */}
          <div className="footer-section links">
            <h3 className="section-title">عن المنصة</h3>
            <ul className="links-list">
              <li><a href="#" className="footer-link">من نحن</a></li>
              <li><a href="#" className="footer-link">سياسة الخصوصية</a></li>
              <li><a href="#" className="footer-link">الشروط والأحكام</a></li>
              <li><a href="#" className="footer-link">اتصل بنا</a></li>
            </ul>
          </div>

          {/* قسم النشرة البريدية والتفاعل */}
         <div className="footer-section newsletter">
            <h3 className="section-title">اشترك معنا</h3>
            <p className="newsletter-desc">احصل على تنبيهات بأحدث العقارات المضافة.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="بريدك الإلكتروني" className="newsletter-input" />
              <button type="submit" className="newsletter-btn">إرسال</button>
            </form>
          </div>

        </div>

        {/* شريط حقوق النشر واللمسة الجمالية السفلي */ }
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} مشروع Adar. جميع الحقوق محفوظة.</p>
           
        </div>
      </div>
    </footer>
  );
};

export default Footer;

 