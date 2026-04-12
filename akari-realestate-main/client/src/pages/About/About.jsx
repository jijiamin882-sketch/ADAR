import React, { useEffect, useRef } from "react";
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
} from "react-icons/fi";
import "./About.css";

const About = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

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

  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const teamMembers = [
    {
      name: "أمين بن عمر",
      role: "المؤسس والمدير التنفيذي",
      img: "https://picsum.photos/seed/amin-ceo/400/400.jpg",
      bio: "خبرة تتجاوز 10 سنوات في مجال التكنولوجيا والعقارات",
    },
    {
      name: "سارة بلقاسم",
      role: "مديرة المنتج",
      img: "https://picsum.photos/seed/sara-pm/400/400.jpg",
      bio: "متخصصة في تصميم تجارب المستخدم وإدارة المنتجات الرقمية",
    },
    {
      name: "يوسف حداد",
      role: "المدير التقني",
      img: "https://picsum.photos/seed/youssef-cto/400/400.jpg",
      bio: "مهندس برمجيات بخبرة واسعة في بناء المنصات الرقمية",
    },
    {
      name: "نادية مرابط",
      role: "مديرة التسويق",
      img: "https://picsum.photos/seed/nadia-marketing/400/400.jpg",
      bio: "خبيرة في التسويق الرقمي واستراتيجيات النمو",
    },
    {
      name: "كريم بوزيد",
      role: "مدير الشراكات",
      img: "https://picsum.photos/seed/karim-partner/400/400.jpg",
      bio: "مسؤول عن بناء شبكة الشراكات مع الوكالات العقارية",
    },
    {
      name: "ليلى شريف",
      role: "مديرة خدمة العملاء",
      img: "https://picsum.photos/seed/layla-support/400/400.jpg",
      bio: "متخصصة في تحسين تجربة العملاء وحل المشكلات",
    },
  ];

  const partners = [
    {
      name: "مجموعة الإعمار",
      type: "شريك استراتيجي",
      img: "https://picsum.photos/seed/partner-1/300/150.jpg",
    },
    {
      name: "عقارات الجزائر",
      type: "وكالة معتمدة",
      img: "https://picsum.photos/seed/partner-2/300/150.jpg",
    },
    {
      name: "بنك الفلاحة",
      type: "شريك مالي",
      img: "https://picsum.photos/seed/partner-3/300/150.jpg",
    },
    {
      name: "دار التعمير",
      type: "شريك حكومي",
      img: "https://picsum.photos/seed/partner-4/300/150.jpg",
    },
    {
      name: "مؤسسة البناء الحديث",
      type: "شريك تقني",
      img: "https://picsum.photos/seed/partner-5/300/150.jpg",
    },
    {
      name: "شركة الضمان العقاري",
      type: "شريك قانوني",
      img: "https://picsum.photos/seed/partner-6/300/150.jpg",
    },
  ];

  const stats = [
    { number: "+2,500", label: "عقار متاح", icon: <FiGlobe /> },
    { number: "+150", label: "وكالة عقارية نشطة", icon: <FiUsers /> },
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
              <h2
                className="section-title"
                style={{ textAlign: "right" }}
              >
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
              <h2
                className="section-title"
                style={{ textAlign: "right" }}
              >
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
              نفتخر بشراكتنا مع نخبة من المؤسسات والوكالات الرائدة في قطاع
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
          <div className="partners-cta">
            <p>هل تريد أن تكون شريكاً معنا؟</p>
            <button
              className="partners-cta-btn"
              onClick={() => navigate("/contact")}
            >
              تواصل معنا الآن
            </button>
          </div>
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
            ابدأ الآن واكتشف آلاف العقارات المتاحة عبر جميع ولايات
            الجزائر
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
    </div>
  );
};

export default About;