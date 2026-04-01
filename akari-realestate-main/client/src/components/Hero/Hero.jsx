import React from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-wrapper">
      {/* طبقة الصورة الخلفية */}
      <div className="hero-bg-container">
        <img src="./Akar (2).jpg" alt="Djelfa Real Estate" />
        <div className="hero-overlay"></div>
      </div>
      
       
          
      <div className="paddings innerWidth hero-container">
        <div className="flexColCenter hero-content">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            دليلك الأول للعقارات  
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hero-subtitle"
          >
           يمكن ان نربطك مباشرة مع أفضل الوكالات العقارية والموثقين المعتمدين
          </motion.p>
          {/* ========== قائمة التنقل (Menu) ========== */}
          <motion.nav 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="hero-nav-menu"
          >
            <a href="#" className="hero-nav-link active">شراء</a>
             
            <a href="#" className="hero-nav-link">كراء</a>
          </motion.nav>
          <div className="hero-search-bar" onClick={() => navigate("/properties")}>
            <input type="text" placeholder="ابحث عن أحياء الجلفة، عين وسارة، حاسي بحبح..." readOnly />
            <button className="button">بحث سريع</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;