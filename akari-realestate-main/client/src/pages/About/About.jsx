import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiTarget,
  FiUsers,
  FiGlobe,
  FiShield,
  FiArrowLeft,
  FiEye,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiX,
  FiSend,
  FiUser,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import "./About.css";

const About = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // إغلاق النافذة بالضغط على Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (showContactModal) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [showContactModal]);

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const openModal = () => {
    setShowContactModal(true);
    setFormSubmitted(false);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setFormErrors({});
  };

  const closeModal = () => {
    setShowContactModal(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === modalRef.current) {
      closeModal();
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "الاسم مطلوب";
    if (!formData.email.trim()) {
      errors.email = "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "بريد إلكتروني غير صالح";
    }
    if (!formData.phone.trim()) {
      errors.phone = "رقم الهاتف مطلوب";
    } else if (!/^[\d\s+]{8,15}$/.test(formData.phone)) {
      errors.phone = "رقم هاتف غير صالح";
    }
    if (!formData.subject.trim()) errors.subject = "الموضوع مطلوب";
    if (!formData.message.trim()) errors.message = "الرسالة مطلوبة";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSending(true);
    // محاكاة إرسال البيانات
    setTimeout(() => {
      setIsSending(false);
      setFormSubmitted(true);
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const teamMembers = [
    {
      name: "أمين بن عمر",
      role: "المؤسس والمدير التنفيذي",
      img: "https://i.pinimg.com/736x/51/d1/54/51d1544728a635bfdbcbbf30aeb0e4c0.jpg",
      bio: "خبرة تتجاوز 10 سنوات في مجال التكنولوجيا والعقارات",
    },
    {
      name: "سارة بلقاسم",
      role: "مديرة المنتج",
      img: "https://i.pinimg.com/736x/cf/d5/8e/cfd58ec52156c7161f46dd27edf9a7c9.jpg",
      bio: "متخصصة في تصميم تجارب المستخدم وإدارة المنتجات الرقمية",
    },
    {
      name: "يوسف حداد",
      role: "المدير التقني",
      img: "https://i.pinimg.com/736x/70/2e/b3/702eb327186a62e6bfab5be1e40a1b77.jpg",
      bio: "مهندس برمجيات بخبرة واسعة في بناء المنصات الرقمية",
    },
    {
      name: "نادية مرابط",
      role: "مديرة التسويق",
      img: "https://i.pinimg.com/736x/5d/1c/82/5d1c8267d98775387b73b121c7412eb7.jpg",
      bio: "خبيرة في التسويق الرقمي واستراتيجيات النمو",
    },
    {
      name: "كريم بوزيد",
      role: "مدير الشراكات",
      img: "https://i.pinimg.com/736x/9f/1b/3c/9f1b3cc7a89f92825b2850ba1f57b33f.jpg",
      bio: "مسؤول عن بناء شبكة الشراكات مع اصحاب العقارات",
    },
    {
      name: "ليلى شريف",
      role: "مديرة خدمة العملاء",
      img: "https://i.pinimg.com/736x/c1/38/ad/c138ad87230eaba8b70d714335e5187f.jpg",
      bio: "متخصصة في تحسين تجربة العملاء وحل المشكلات",
    },
  ];

  const partners = [
    {
      name: "مجموعة الإعمار",
      type: "شريك استراتيجي",
      img: "https://i.pinimg.com/736x/1e/20/8e/1e208e5ef1f1b0daf0deaf009853f1a1.jpg",
    },
     
    {
      name: "بنك الفلاحة",
      type: "شريك مالي",
      img: "https://picsum.photos/seed/partner-3/300/150.jpg",
    },
    {
      name: "بنك الاسكان و التعمير",
      type: "شريك حكومي",
      img: "https://i.pinimg.com/1200x/9e/af/dc/9eafdc3feeb511f7b756d67f0c2201b1.jpg",
    },
    {
      name: "مؤسسة البناء الحديث",
      type: "شريك تقني",
      img: "https://i.pinimg.com/736x/74/54/04/745404d12e92abd7c73cfaac6e25d915.jpg",
    },
    {
      name: "شركة الضمان العقاري",
      type: "شريك قانوني",
      img: "https://i.pinimg.com/736x/1e/01/aa/1e01aae9fc8a8f8b262fcc02b9b93c3a.jpg",
    },
    {
      name: "شركة نقل",
      type: "شريك تجاري",
      img: "https://i.pinimg.com/1200x/c5/72/8a/c5728a6fb76a4728003dd8c955fb651f.jpg",
    },
  ];

  const stats = [
    { number: "+2,500", label: "عقار متاح", icon: <FiGlobe /> },
    { number: "+5,000", label: "مستخدم راضٍ", icon: <FiHeart /> },
    { number: "+48", label: "ولاية مغطّاة", icon: <FiTarget /> },
  ];

  return (
    <div className="about-wrapper">
      {/* ===== 1. المقدمة ===== */}
      <section className="about-hero" ref={addToRefs}>
        <div className="about-hero-overlay"></div>
        <div className="about-hero-particles">
          {[...Array(20)].map((_, i) => (
            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            ></span>
          ))}
        </div>
        <div className="about-container about-hero-content">
          <span className="about-badge">
            <FiAward /> تعرف علينا
          </span>
          <h1>من نحن؟</h1>
          <p className="about-intro">
            ADAR ليست مجرد منصة عقارية، بل هي حلول تكنولوجية متكاملة
            صُممت لتسهيل تجربة البحث عن العقارات، توثيق المعاملات، وربط
            البائعين والمشترين بأمان وشفافية في الجزائر.
          </p>
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
            <span className="section-badge">مميزاتنا</span>
            <h2 className="section-title">لماذا تختار منصة ADAR؟</h2>
            <p className="section-subtitle">
              نقدم لك تجربة عقارية رقمية متكاملة تجمع بين التقنية الحديثة
              والخدمة الاحترافية
            </p>
          </div>
          <div className="about-grid">
            {[
              {
                icon: <FiTarget />,
                title: "دقة عالية",
                desc: "فلاتر بحث ذكية تساعدك على إيجاد العقار المناسب بدقة حسب المساحة، السعر، والمنطقة.",
              },
              {
                icon: <FiShield />,
                title: "أمان وثقة",
                desc: "نعمل فقط مع وكالات عقارية موثقة وموثقين معتمدين لضمان حقوق جميع الأطراف.",
              },
              {
                icon: <FiGlobe />,
                title: "تغطية شاملة",
                desc: "شبكة واسعة تغطي مختلف ولايات الوطن لتوفير خيارات متنوعة تلبي جميع الاحتياجات.",
              },
              {
                icon: <FiUsers />,
                title: "خدمة العملاء",
                desc: "فريق دعم متخصص متاح على مدار الساعة لمساعدتك في أي استفسار أو مشكلة تقنية.",
              },
              {
                icon: <FiTrendingUp />,
                title: "تحليلات ذكية",
                desc: "إحصائيات وتحليلات دقيقة لأسعار العقارات لمساعدتك في اتخاذ القرار الأنسب.",
              },
              {
                icon: <FiHeart />,
                title: "تجربة مخصصة",
                desc: "واجهة سهلة الاستخدام تتكيف مع تفضيلاتك وتعرض لك ما يناسبك فقط.",
              },
            ].map((card, i) => (
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
              <div className="vision-icon-large">
                <FiEye />
              </div>
              <div className="vision-rings">
                <span className="ring ring-1"></span>
                <span className="ring ring-2"></span>
                <span className="ring ring-3"></span>
              </div>
            </div>
            <div className="vision-content">
              <span className="section-badge">رؤيتنا</span>
              <h2 className="section-title" style={{ textAlign: "right"}}>
                نحو مستقبل عقاري رقمي
              </h2>
              <p className="vision-text">
                نسعى لأن نكون المنصة العقارية الرقمية الأولى في الجزائر، حيث
                ندمج الذكاء الاصطناعي والتحليلات البيانية لتقديم تجربة
                عقارية لم يسبق لها مثيل. نؤمن بأن مستقبل العقارات في
                الجزائر يمر عبر التحول الرقمي الشامل.
              </p>
              <ul className="vision-points">
                <li>
                  <span className="point-marker"></span>
                  الريادة في التحول الرقمي لقطاع العقارات الجزائري
                </li>
                <li>
                  <span className="point-marker"></span>
                  توفير تجربة عقارية سلسة من البحث حتى التملك
                </li>
                <li>
                  <span className="point-marker"></span>
                  بناء منظومة عقارية ذكية تعتمد على البيانات والتحليلات
                </li>
                <li>
                  <span className="point-marker"></span>
                  جعل العقار في الجزائر أكثر شفافية وسهولة الوصول
                </li>
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
              <span className="section-badge">رسالتنا</span>
              <h2 className="section-title" style={{ textAlign: "right" }}>
                ما نعمل من أجله
              </h2>
              <p className="mission-text">
                رسالتنا هي تمكين كل جزائري من الوصول إلى العقار المناسب له
                بكل سهولة وثقة. نعمل على سد الفجوة بين البائع والمشتري من
                خلال تقنيات حديثة تضمن الشفافية والأمان في كل معاملة.
              </p>
              <div className="mission-pillars">
                <div className="pillar">
                  <div className="pillar-number">01</div>
                  <div className="pillar-text">
                    <h4>الشفافية</h4>
                    <p>معلومات واضحة ودقيقة عن كل عقار بلا حجب</p>
                  </div>
                </div>
                <div className="pillar">
                  <div className="pillar-number">02</div>
                  <div className="pillar-text">
                    <h4>الموثوقية</h4>
                    <p>التعامل فقط مع مصادر موثوقة ومعتمدة قانونياً</p>
                  </div>
                </div>
                <div className="pillar">
                  <div className="pillar-number">03</div>
                  <div className="pillar-text">
                    <h4>الابتكار</h4>
                    <p>استمرار في تطوير أدوات تقنية تخدم المستخدم</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mission-visual">
              <div className="mission-icon-large">
                <FiHeart />
              </div>
              <div className="mission-shapes">
                <span className="shape shape-1"></span>
                <span className="shape shape-2"></span>
                <span className="shape shape-3"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. فريق العمل ===== */}
      <section className="about-team-section" ref={addToRefs}>
        <div className="about-container">
          <div className="section-header">
            <span className="section-badge">فريقنا</span>
            <h2 className="section-title">فريق العمل</h2>
            <p className="section-subtitle">
              فريق متميز من الخبراء والمتخصصين يعملون بشغف لتقديم أفضل
              تجربة عقارية رقمية
            </p>
          </div>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div className="team-card" key={index}>
                <div className="team-card-img-wrapper">
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                  />
                  <div className="team-card-overlay">
                    <div className="team-socials">
                      <button className="team-social-btn">
                        <FiLinkedin />
                      </button>
                      <button className="team-social-btn">
                        <FiTwitter />
                      </button>
                      <button className="team-social-btn">
                        <FiMail />
                      </button>
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
            <span className="section-badge">شراكاتنا</span>
            <h2 className="section-title">شركاؤنا</h2>
            <p className="section-subtitle">
              نفتخر بشراكتنا مع نخبة من المؤسسات الرائدة في قطاع
              العقارات والتمويل
            </p>
          </div>
          <div className="partners-grid">
            {partners.map((partner, index) => (
              <div className="partner-card" key={index}>
                <div className="partner-card-img">
                  <img
                    src={partner.img}
                    alt={partner.name}
                    loading="lazy"
                  />
                </div>
                <div className="partner-card-info">
                  <h4>{partner.name}</h4>
                  <span className="partner-type">{partner.type}</span>
                </div>
              </div>
            ))}
          </div>
           
            <button className="partners-cta-btn" onClick={openModal}>
              تواصل معنا الآن
            </button>
         
        </div>
      </section>

      {/* ===== 8. العودة ===== */}
      <section className="about-back-section" ref={addToRefs}>
        <div className="about-container" style={{ textAlign: "center" }}>
          <h2 className="section-title">مستعد لاكتشاف عقارك؟</h2>
          <p
            className="section-subtitle"
            style={{ maxWidth: "600px", margin: "0 auto 2rem" }}
          >
            ابدأ الآن واكتشف آلاف العقارات المتاحة عبر جميع ولايات الجزائر
          </p>
          <div className="about-back-buttons">
            <button
              className="about-back-btn about-back-btn-primary"
              onClick={() => navigate("/properties")}
            >
              تصفح العقارات
            </button>
            <button
              className="about-back-btn about-back-btn-secondary"
              onClick={() => navigate("/")}
            >
              <FiArrowLeft /> العودة للرئيسية
            </button>
          </div>
        </div>
      </section>

      {/* ===== نافذة التواصل المنبثقة ===== */}
      {showContactModal && (
        <div
          className="contact-modal-overlay"
          ref={modalRef}
          onClick={handleOverlayClick}
        >
          <div className="contact-modal">
            {/* رأس النافذة */}
            <div className="contact-modal-header">
              <div className="contact-modal-header-content">
                <div className="contact-modal-icon">
                  <FiMail />
                </div>
                <div>
                  <h2>تواصل معنا</h2>
                  <p>نحن هنا لمساعدتك، أرسل لنا رسالتك وسنرد عليك في أقرب وقت</p>
                </div>
              </div>
              <button className="contact-modal-close" onClick={closeModal}>
                <FiX />
              </button>
            </div>

            {/* محتوى النافذة */}
            <div className="contact-modal-body">
              {!formSubmitted ? (
                <form className="contact-modal-form" onSubmit={handleSubmit} noValidate>
                  {/* الاسم */}
                  <div className={`contact-form-group ${formErrors.name ? "has-error" : ""}`}>
                    <label htmlFor="contact-name">
                      <FiUser /> الاسم الكامل
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="contact-form-input"
                    />
                    {formErrors.name && (
                      <span className="contact-form-error">{formErrors.name}</span>
                    )}
                  </div>

                  {/* البريد الإلكتروني */}
                  <div className={`contact-form-group ${formErrors.email ? "has-error" : ""}`}>
                    <label htmlFor="contact-email">
                      <FiMail /> البريد الإلكتروني
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="contact-form-input"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    />
                    {formErrors.email && (
                      <span className="contact-form-error">{formErrors.email}</span>
                    )}
                  </div>

                  {/* رقم الهاتف */}
                  <div className={`contact-form-group ${formErrors.phone ? "has-error" : ""}`}>
                    <label htmlFor="contact-phone">
                      <FiPhone /> رقم الهاتف
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="0XXXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="contact-form-input"
                      dir="ltr"
                      style={{ textAlign: "right" }}
                    />
                    {formErrors.phone && (
                      <span className="contact-form-error">{formErrors.phone}</span>
                    )}
                  </div>

                  {/* الموضوع */}
                  <div className={`contact-form-group ${formErrors.subject ? "has-error" : ""}`}>
                    <label htmlFor="contact-subject">
                      <FiTarget /> الموضوع
                    </label>
                    <select
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      className="contact-form-input contact-form-select"
                    >
                      <option value="">اختر موضوع الرسالة</option>
                      <option value="partnership">طلب شراكة</option>
                      <option value="support">دعم فني</option>
                      <option value="inquiry">استفسار عام</option>
                      <option value="complaint">شكوى أو اقتراح</option>
                      <option value="other">أخرى</option>
                    </select>
                    {formErrors.subject && (
                      <span className="contact-form-error">{formErrors.subject}</span>
                    )}
                  </div>

                  {/* الرسالة */}
                  <div className={`contact-form-group ${formErrors.message ? "has-error" : ""}`}>
                    <label htmlFor="contact-message">
                      <FiMessageSquare /> الرسالة
                    </label>
                    <textarea
                      id="contact-message"
                      rows="4"
                      placeholder="اكتب رسالتك هنا..."
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      className="contact-form-input contact-form-textarea"
                    ></textarea>
                    {formErrors.message && (
                      <span className="contact-form-error">{formErrors.message}</span>
                    )}
                  </div>

                  {/* زر الإرسال */}
                  <button
                    type="submit"
                    className="contact-modal-submit"
                    disabled={isSending}
                  >
                    {isSending ? (
                      <>
                        <span className="contact-spinner"></span>
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <FiSend /> إرسال الرسالة
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="contact-modal-success">
                  <div className="success-icon-wrapper">
                    <div className="success-checkmark">
                      <svg viewBox="0 0 52 52" className="checkmark-svg">
                        <circle
                          className="checkmark-circle"
                          cx="26"
                          cy="26"
                          r="25"
                          fill="none"
                        />
                        <path
                          className="checkmark-check"
                          fill="none"
                          d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                      </svg>
                    </div>
                  </div>
                  <h3>تم الإرسال بنجاح!</h3>
                  <p>
                    شكراً لتواصلك معنا. سنقوم بمراجعة رسالتك والرد عليك في
                    أقرب وقت ممكن خلال 24 ساعة.
                  </p>
                  <button className="contact-modal-submit" onClick={closeModal}>
                    حسناً، فهمت
                  </button>
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