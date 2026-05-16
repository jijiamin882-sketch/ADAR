import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTarget, FiUsers, FiGlobe, FiShield, FiArrowLeft, FiEye, FiHeart,
  FiAward, FiTrendingUp, FiLinkedin, FiTwitter, FiMail, FiX, FiSend,
  FiUser, FiPhone, FiMessageSquare,
} from "react-icons/fi";
import "./About.css";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة
import { supabase } from "../../supabaseClient";
const About = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف دالة الترجمة
  
  const sectionsRef = useRef([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("about-visible"); });
    }, { threshold: 0.1 });
    sectionsRef.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") closeModal(); };
    if (showContactModal) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleEsc); document.body.style.overflow = ""; };
  }, [showContactModal]);

  const addToRefs = (el) => { if (el && !sectionsRef.current.includes(el)) sectionsRef.current.push(el); };

  const openModal = () => { setShowContactModal(true); setFormSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); setFormErrors({}); };
  const closeModal = () => { setShowContactModal(false); };
  const handleOverlayClick = (e) => { if (e.target === modalRef.current) closeModal(); };

  // <-- 3. ترجمة رسائل التحقق (Validation)
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('error_name');
    if (!formData.email.trim()) { errors.email = t('error_email_req'); } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { errors.email = t('error_email_invalid'); }
    if (!formData.phone.trim()) { errors.phone = t('error_phone_req'); } else if (!/^[\d\s+]{8,15}$/.test(formData.phone)) { errors.phone = t('error_phone_invalid'); }
    if (!formData.subject.trim()) errors.subject = t('error_subject');
    if (!formData.message.trim()) errors.message = t('error_message');
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

       const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSending(true);
    
    const sendToSupabase = async () => {
      // تنسيق الرسالة لتكون واضحة جداً للمدير عند قراءتها
      const formattedMessage = `🟢 رسالة جديدة من نموذج (تواصل معنا)\n\n👤 الاسم: ${formData.name}\n📧 البريد: ${formData.email}\n📞 الهاتف: ${formData.phone}\n📌 الموضوع: ${formData.subject}\n\n💬 الرسالة:\n${formData.message}`;

      const { error } = await supabase.from('messages').insert([
        {
          sender_name: formData.name,
          sender_phone: formData.phone,
          message_text: formattedMessage, // الرسالة المنسقة
          property_id: null, // ❗ مهم جداً: قيمة null تعني أن الرسالة للمدير العام وليست لعقار
        }
      ]);

      setIsSending(false);
      
      if (!error) {
        setFormSubmitted(true); // إظهار علامة النجاح للمستخدم
      } else {
        alert("حدث خطأ أثناء الإرسال: " + error.message);
      }
    };

    sendToSupabase();
  };

     

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) { setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors[field]; return newErrors; }); }
  };

  // <-- 4. ترجمة مصفوفات البيانات
  const teamMembers = [
    { name: "أمين بن عمر", role: t('team_1_role'), img: "https://i.pinimg.com/736x/51/d1/54/51d1544728a635bfdbcbbf30aeb0e4c0.jpg", bio: t('team_1_bio') },
    { name: "سارة بلقاسم", role: t('team_2_role'), img: "https://i.pinimg.com/736x/cf/d5/8e/cfd58ec52156c7161f46dd27edf9a7c9.jpg", bio: t('team_2_bio') },
    { name: "يوسف حداد", role: t('team_3_role'), img: "https://i.pinimg.com/736x/70/2e/b3/702eb327186a62e6bfab5be1e40a1b77.jpg", bio: t('team_3_bio') },
    { name: "نادية مرابط", role: t('team_4_role'), img: "https://i.pinimg.com/736x/5d/1c/82/5d1c8267d98775387b73b121c7412eb7.jpg", bio: t('team_4_bio') },
    { name: "كريم بوزيد", role: t('team_5_role'), img: "https://i.pinimg.com/736x/9f/1b/3c/9f1b3cc7a89f92825b2850ba1f57b33f.jpg", bio: t('team_5_bio') },
    { name: "ليلى شريف", role: t('team_6_role'), img: "https://i.pinimg.com/736x/c1/38/ad/c138ad87230eaba8b70d714335e5187f.jpg", bio: t('team_6_bio') },
  ];

  const partners = [
    { name: "مجموعة الإعمار", type: t('partner_type_strategic'), img: "https://i.pinimg.com/736x/1e/20/8e/1e208e5ef1f1b0daf0deaf009853f1a1.jpg" },
    { name: "بنك الفلاحة", type: t('partner_type_financial'), img: "https://picsum.photos/seed/partner-3/300/150.jpg" },
    { name: "بنك الاسكان و التعمير", type: t('partner_type_gov'), img: "https://i.pinimg.com/1200x/9e/af/dc/9eafdc3feeb511f7b756d67f0c2201b1.jpg" },
    { name: "مؤسسة البناء الحديث", type: t('partner_type_tech'), img: "https://i.pinimg.com/736x/74/54/04/745404d12e92abd7c73cfaac6e25d915.jpg" },
    { name: "شركة الضمان العقاري", type: t('partner_type_legal'), img: "https://i.pinimg.com/736x/1e/01/aa/1e01aae9fc8a8f8b262fcc02b9b93c3a.jpg" },
    { name: "شركة نقل", type: t('partner_type_commercial'), img: "https://i.pinimg.com/1200x/c5/72/8a/c5728a6fb76a4728003dd8c955fb651f.jpg" },
  ];

  const stats = [
    { number: "+2,500", label: t('about_stat_1'), icon: <FiGlobe /> },
    { number: "+5,000", label: t('about_stat_2'), icon: <FiHeart /> },
    { number: "+48", label: t('about_stat_3'), icon: <FiTarget /> },
  ];

  const features = [
    { icon: <FiTarget />, title: t('feat_1_title'), desc: t('feat_1_desc') },
    { icon: <FiShield />, title: t('feat_2_title'), desc: t('feat_2_desc') },
    { icon: <FiGlobe />, title: t('feat_3_title'), desc: t('feat_3_desc') },
    { icon: <FiUsers />, title: t('feat_4_title'), desc: t('feat_4_desc') },
    { icon: <FiTrendingUp />, title: t('feat_5_title'), desc: t('feat_5_desc') },
    { icon: <FiHeart />, title: t('feat_6_title'), desc: t('feat_6_desc') },
  ];

  return (
    <div className="about-wrapper">
      {/* ===== 1. المقدمة ===== */}
      <section className="about-hero" ref={addToRefs}>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-particles">
          {[...Array(20)].map((_, i) => (<span key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 4}s` }}></span>))}
        </div>
        <div className="about-container about-hero-content">
          <span className="about-badge"><FiAward /> {t('about_badge')}</span>
          <h1>{t('about_hero_title')}</h1>
          <p className="about-intro">{t('about_hero_desc')}</p>
          <div className="about-hero-decoration">
            <span className="deco-circle deco-1"></span>
            <span className="deco-circle deco-2"></span>
            <span className="deco-circle deco-3"></span>
          </div>
        </div>
      </section>

      {/* ===== 2. لماذا ADAR ===== */}
      <section className="about-features-section" ref={addToRefs}>
        <div className="about-container">
          <div className="section-header">
            <span className="section-badge">{t('about_feat_badge')}</span>
             <h2 className="section-title"></h2>
            <p className="section-subtitle">{t('about_feat_subtitle')}</p>
          </div>
          <div className="about-grid">
            {features.map((card, i) => (
              <div className="about-card" key={i}>
                <div className="about-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
                <div className="card-accent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. الإحصائيات ===== */}
      <section className="about-stats-section" ref={addToRefs}>
        <div className="about-stats-bg-pattern"></div>
        <div className="about-container">
          <div className="about-stats-grid">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index}>
                <div className="stat-icon">{stat.icon}</div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
                <div className="stat-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. رؤيتنا ===== */}
      <section className="about-vision-section" ref={addToRefs}>
        <div className="about-container">
          <div className="vision-wrapper">
            <div className="vision-visual">
              <div className="vision-icon-large"><FiEye /></div>
              <div className="vision-rings"><span className="ring ring-1"></span><span className="ring ring-2"></span><span className="ring ring-3"></span></div>
            </div>
            <div className="vision-content">
              <span className="section-badge">{t('about_vision_badge')}</span>
              <h2 className="section-title" style={{ textAlign: "right"}}>{t('about_vision_title')}</h2>
              <p className="vision-text">{t('about_vision_desc')}</p>
              <ul className="vision-points">
                <li><span className="point-marker"></span>{t('vision_point_1')}</li>
                <li><span className="point-marker"></span>{t('vision_point_2')}</li>
                <li><span className="point-marker"></span>{t('vision_point_3')}</li>
                <li><span className="point-marker"></span>{t('vision_point_4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. رسالتنا ===== */}
      <section className="about-mission-section" ref={addToRefs}>
        <div className="about-container">
          <div className="mission-wrapper">
            <div className="mission-content">
              <span className="section-badge">{t('about_mission_badge')}</span>
              <h2 className="section-title" style={{ textAlign: "right" }}>{t('about_mission_title')}</h2>
              <p className="mission-text">{t('about_mission_desc')}</p>
              <div className="mission-pillars">
                <div className="pillar">
                  <div className="pillar-number">01</div>
                  <div className="pillar-text"><h4>{t('mission_p1_title')}</h4><p>{t('mission_p1_desc')}</p></div>
                </div>
                <div className="pillar">
                  <div className="pillar-number">02</div>
                  <div className="pillar-text"><h4>{t('mission_p2_title')}</h4><p>{t('mission_p2_desc')}</p></div>
                </div>
                <div className="pillar">
                  <div className="pillar-number">03</div>
                  <div className="pillar-text"><h4>{t('mission_p3_title')}</h4><p>{t('mission_p3_desc')}</p></div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="mission-icon-large"><FiHeart /></div>
              <div className="mission-shapes"><span className="shape shape-1"></span><span className="shape shape-2"></span><span className="shape shape-3"></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. فريق العمل ===== */}
      <section className="about-team-section" ref={addToRefs}>
        <div className="about-container">
          <div className="section-header">
            <span className="section-badge">{t('about_team_badge')}</span>
            <h2 className="section-title">{t('about_team_title')}</h2>
            <p className="section-subtitle">{t('about_team_subtitle')}</p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-card-img-wrapper">
                  <img src={member.img} alt={member.name} loading="lazy" />
                  <div className="team-card-overlay">
                    <div className="team-socials">
                      <button className="team-social-btn"><FiLinkedin /></button>
                      <button className="team-social-btn"><FiTwitter /></button>
                      <button className="team-social-btn"><FiMail /></button>
                    </div>
                  </div>
                </div>
                <div className="team-card-info">
                  <h3>{member.name}</h3>
                  <span className="team-role">{member.role}</span>
                  <p className="team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 7. شركاؤنا ===== */}
      <section className="about-partners-section" ref={addToRefs}>
        <div className="about-container">
          <div className="section-header">
            <span className="section-badge">{t('about_partners_badge')}</span>
            <h2 className="section-title">{t('about_partners_title')}</h2>
            <p className="section-subtitle">{t('about_partners_subtitle')}</p>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div className="partner-card" key={index}>
                <div className="partner-card-img"><img src={partner.img} alt={partner.name} loading="lazy" /></div>
                <div className="partner-card-info">
                  <h4>{partner.name}</h4>
                  <span className="partner-type">{partner.type}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="partners-cta-btn" onClick={openModal}>{t('partners_cta')}</button>
        </div>
      </section>

      {/* ===== 8. العودة ===== */}
      <section className="about-back-section" ref={addToRefs}>
        <div className="about-container" style={{ textAlign: "center" }}>
          <h2 className="section-title">{t('about_back_title')}</h2>
          <p className="section-subtitle" style={{ maxWidth: "600px", margin: "0 auto 2rem" }}>{t('about_back_desc')}</p>
          <div className="about-back-buttons">
            <button className="about-back-btn about-back-btn-primary" onClick={() => navigate("/properties")}>{t('about_back_btn1')}</button>
            <button className="about-back-btn about-back-btn-secondary" onClick={() => navigate("/")}><FiArrowLeft /> {t('about_back_btn2')}</button>
          </div>
        </div>
      </section>

      {/* ===== نافذة التواصل المنبثقة ===== */}
      {showContactModal && (
        <div className="contact-modal-overlay" ref={modalRef} onClick={handleOverlayClick}>
          <div className="contact-modal">
            <div className="contact-modal-header">
              <div className="contact-modal-header-content">
                <div className="contact-modal-icon"><FiMail /></div>
                <div>
                  <h2>{t('modal_title')}</h2>
                  <p>{t('modal_desc')}</p>
                </div>
              </div>
              <button className="contact-modal-close" onClick={closeModal}><FiX /></button>
            </div>

            <div className="contact-modal-body">
              {!formSubmitted ? (
                <form className="contact-modal-form" onSubmit={handleSubmit} noValidate>
                  <div className={`contact-form-group ${formErrors.name ? "has-error" : ""}`}>
                    <label htmlFor="contact-name"><FiUser /> {t('modal_name_label')}</label>
                    <input id="contact-name" type="text" placeholder={t('modal_name_ph')} value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="contact-form-input" />
                    {formErrors.name && (<span className="contact-form-error">{formErrors.name}</span>)}
                  </div>

                  <div className={`contact-form-group ${formErrors.email ? "has-error" : ""}`}>
                    <label htmlFor="contact-email"><FiMail /> {t('modal_email_label')}</label>
                    <input id="contact-email" type="email" placeholder="example@email.com" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="contact-form-input" dir="ltr" style={{ textAlign: "right" }} />
                    {formErrors.email && (<span className="contact-form-error">{formErrors.email}</span>)}
                  </div>

                  <div className={`contact-form-group ${formErrors.phone ? "has-error" : ""}`}>
                    <label htmlFor="contact-phone"><FiPhone /> {t('modal_phone_label')}</label>
                    <input id="contact-phone" type="tel" placeholder="0XXXXXXXXX" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="contact-form-input" dir="ltr" style={{ textAlign: "right" }} />
                    {formErrors.phone && (<span className="contact-form-error">{formErrors.phone}</span>)}
                  </div>

                  <div className={`contact-form-group ${formErrors.subject ? "has-error" : ""}`}>
                    <label htmlFor="contact-subject"><FiTarget /> {t('modal_subject_label')}</label>
                    <select id="contact-subject" value={formData.subject} onChange={(e) => handleInputChange("subject", e.target.value)} className="contact-form-input contact-form-select">
                      <option value="">{t('modal_subject_ph')}</option>
                      <option value="partnership">{t('modal_subject_opt1')}</option>
                      <option value="support">{t('modal_subject_opt2')}</option>
                      <option value="inquiry">{t('modal_subject_opt3')}</option>
                      <option value="complaint">{t('modal_subject_opt4')}</option>
                      <option value="other">{t('modal_subject_opt5')}</option>
                    </select>
                    {formErrors.subject && (<span className="contact-form-error">{formErrors.subject}</span>)}
                  </div>

                  <div className={`contact-form-group ${formErrors.message ? "has-error" : ""}`}>
                    <label htmlFor="contact-message"><FiMessageSquare /> {t('modal_msg_label')}</label>
                    <textarea id="contact-message" rows="4" placeholder={t('modal_msg_ph')} value={formData.message} onChange={(e) => handleInputChange("message", e.target.value)} className="contact-form-input contact-form-textarea"></textarea>
                    {formErrors.message && (<span className="contact-form-error">{formErrors.message}</span>)}
                  </div>

                  <button type="submit" className="contact-modal-submit" disabled={isSending}>
                    {isSending ? (<><span className="contact-spinner"></span>{t('modal_sending')}</>) : (<><FiSend /> {t('modal_send_btn')}</>)}
                  </button>
                </form>
              ) : (
                <div className="contact-modal-success">
                  <div className="success-icon-wrapper">
                    <div className="success-checkmark">
                      <svg viewBox="0 0 52 52" className="checkmark-svg"><circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" /><path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                    </div>
                  </div>
                  <h3>{t('modal_success_title')}</h3>
                  <p>{t('modal_success_desc')}</p>
                  <button className="contact-modal-submit" onClick={closeModal}>{t('modal_success_btn')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;