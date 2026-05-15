import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { 
  FiSearch, FiHome, FiMessageCircle, FiUploadCloud, 
  FiShield, FiChevronDown, FiMapPin, FiUsers, FiTrendingUp, 
  FiAward, FiArrowLeft, FiArrowRight, FiStar, FiHeart, FiZap, FiMessageSquare,
  FiTool, FiTruck, FiFileText, FiBox
} from 'react-icons/fi';
import AiChat from "../../pages/AiChat/AiChat";
import AuthModal from "../AuthModal/AuthModal"; // ← أضف هذا السطر

export default function Hero() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // ← أضف هذا السطر (كان مفقوداً!)
   // === تحقق قوي من تسجيل الدخول ===
  const checkLogin = (path) => {
    if (!currentUser || !currentUser.email) {
      setPendingAction(path);
      setIsAuthOpen(true);
      return;
    }
    navigate(path);
  };  
  // === حالات الصفحة ===
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false); // ← أضف هذا السطر
  const [pendingAction, setPendingAction] = useState(null); // ← لحفظ الإجراء بعد تسجيل الدخول
  const [commentText, setCommentText] = useState(''); 
  const [comments, setComments] = useState([]); 
  const commentsRef = useRef(null);
  const servicesRef = useRef(null);
  const propertyTypes = [
    { value: 'apartment', label: 'شقة' }, { value: 'villa', label: 'فيلا' },
    { value: 'house', label: 'منزل' }, { value: 'land', label: 'أرض' },
    { value: 'commercial', label: 'محل تجاري' },
  ];

  const cities = [
    { value: 'djelfa', label: 'الجلفة' }, { value: 'tmsilt', label: 'تسمسيلت' },
    { value: 'algiers', label: 'الجزائر العاصمة' }, { value: 'oran', label: 'وهران' },
  ];

  const priceRanges = [
    { value: '0-500000', label: 'أقل من 500,000' }, { value: '500000-1000000', label: '500,000 - 1,000,000' },
    { value: '1000000-3000000', label: '1,000,000 - 3,000,000' }, { value: '3000000-plus', label: 'أكثر من 3,000,000' }
  ];

  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ 
    type: { value: '', label: 'نوع العقار' }, 
    city: { value: '', label: 'المدينة' }, 
    price: { value: '', label: 'نطاق السعر' } 
  });
  const dropdownRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [commentRating, setCommentRating] = useState(0);

  

    // === بعد تسجيل الدخول: نفّذ الإجراء المحفوظ ===
  useEffect(() => {
    if (currentUser?.email && pendingAction) {
      navigate(pendingAction);
      setPendingAction(null);
      setIsAuthOpen(false);
    }
  }, [currentUser, pendingAction, navigate]);
  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(null); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (filterKey, option) => { 
    setSelectedFilters(prev => ({ ...prev, [filterKey]: { value: option.value, label: option.label } })); 
    setOpenDropdown(null); 
  };

  const handleComment = () => { const section = document.getElementById('comments-section'); if (section) section.scrollIntoView({ behavior: 'smooth' }); };
  
  const scrollComments = (scrollOffset) => { if (commentsRef.current) commentsRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' }); };

     const handleAddComment = (e) => {
    e.preventDefault();
    
    // يجب تسجيل الدخول لكتابة تعليق
    if (!currentUser?.email) {
      setPendingAction(() => handleComment);
      setIsAuthOpen(true);
      return;
    }

    if (commentText.trim() === '' || commentRating === 0) return; 

    const userName = currentUser.user_metadata?.full_name 
                  || currentUser.email?.split('@')[0] 
                  || "مستخدم";

    const newComment = { 
      id: Date.now(), 
      text: commentText, 
      rating: commentRating,
      author: userName, // ← اسم المستخدم الحقيقي
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) 
    };
    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentRating(0);
  };

  const scrollServices = (scrollOffset) => {
    if (servicesRef.current) {
      servicesRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

     // === العقارات من Supabase ===
    // === العقارات من Supabase (مطابق لجدولك الحقيقي) ===
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoadingProperties(true);

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setFeaturedProperties(
          data.map((p) => ({
            id: p.id,
            image: p.image || "./default-property.jpg",
            title: p.title,
            location: p.location || p.city || "",
            price: Number(p.price).toLocaleString("ar-DZ") + " دج",
            type: p.type,
            beds: p.rooms || 0,
            baths: p.baths || 0,
            area: (p.area || 0) + " م²",
            featured: true,
          }))
        );
      } else if (error) {
        console.error("خطأ جلب العقارات:", error.message);
      }

      setLoadingProperties(false);
    };

    fetchFeatured();
  }, []);

  const services = [
    { icon: <FiHome />, title: "بيع وشراء العقارات", desc: "منصة متكاملة لعرض وبيع العقارات بأفضل الأسعار في الجزائر" },
    { icon: <FiShield />, title: "تقييم عقاري دقيق", desc: "فريق متخصص يقدم تقييماً عادلاً ودقيقاً لعقارك حسب السوق" },
    { icon: <FiTrendingUp />, title: "استشارات استثمارية", desc: "نقدم لك أفضل النصائح للاستثمار العقاري الذكي والمربح" },
    { icon: <FiUploadCloud />, title: "نشر عقاراتك مجاناً", desc: "أضف عقارك بسهولة وصل لآلاف المهتمين بدون أي رسوم" },
    { icon: <FiBox />, title: "خدمات الأثاث والتجهيز", desc: "تجهيز منزلك الجديد بالكامل بأحدث الأثاث والديكورات بأسعار مناسبة" },
    { icon: <FiTool />, title: "صيانة العقارات", desc: "فريق فني متخصص لصيانة وإصلاح الأعطال الكهربائية والسباكة والبناء" },
    { icon: <FiTruck />, title: "نقل الأثاث", desc: "خدمات نقل آمنة وسريعة للأثاث داخل وخارج المدن مع التغليف والحماية" },
    { icon: <FiFileText />, title: "خدمة الموثقون", desc: "توثيق عقود البيع والشراء مع موثقين معتمدين لضمان حقوقك قانونياً "}
  ];

  const testimonials = [
    { name: "محمد بن علي", role: "مستثمر عقاري", text: "منصة ADAR غيرت طريقة بحثي عن العقارات. وجدت فيلا أحلامي في أقل من أسبوع!", rating: 5 },
    { name: "فاطمة الزهراء", role: "مالكة عقار", text: "نشرت شقتي على المنصة وتواصل معي أكثر من 20 شخص في أول 3 أيام. خدمة ممتازة!", rating: 5 },
    { name: "كريم بوزيد", role: "وكيل عقاري", text: "كوكالة عقارية، ساعدتنا ADAR في الوصول لعملاء جدد وزيادة مبيعاتنا بشكل ملحوظ.", rating: 4 }
  ];

  const stats = [
    { number: "2,500+", label: "عقار متاح", icon: <FiHome /> },
    { number: "1,200+", label: "عميل سعيد", icon: <FiUsers /> },
    { number: "85+", label: " خدمات معتمدة", icon: <FiAward /> },
    { number: "350+", label: "صفقة شهرياً", icon: <FiTrendingUp /> }
  ];

  return (
    <div className="home-page">
           
      {/* === 1. الهيرو === */}
      <section className="hero-wrapper">
        <div className="hero-bg-container"><img src="./hero.jpg" alt="Djelfa Real Estate" /><div className="hero-overlay"></div></div>
        <div className="paddings innerWidth hero-container">
          <div className="flexColCenter hero-content">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-title">بوابة نحو عالم العقارات</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hero-subtitle">مصدرك الجديد  والآمن  والذكي  لايجاد العقار  المناسب لك</motion.p>
            
            <div className="hero-advanced-search" ref={dropdownRef}> 
              <div className="search-text-input-section">
                <FiSearch className="search-input-icon" /> 
                <input 
                  type="text" 
                  placeholder="بحث..." 
                  className="search-text-field"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                /> 
              </div>

              <div className="search-filter-fields">
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}>
                  <span className={selectedFilters.type.value ? 'selected-text' : ''}>{selectedFilters.type.label}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'type' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'type' && (<div className="dropdown-list">{propertyTypes.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('type', opt); }}>{opt.label}</div>))}</div>)}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}>
                  <span className={selectedFilters.city.value ? 'selected-text' : ''}>{selectedFilters.city.label}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'city' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'city' && (<div className="dropdown-list">{cities.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('city', opt); }}>{opt.label}</div>))}</div>)}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}>
                  <span className={selectedFilters.price.value ? 'selected-text' : ''}>{selectedFilters.price.label}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'price' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'price' && (<div className="dropdown-list">{priceRanges.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('price', opt); }}>{opt.label}</div>))}</div>)}
                </div>
              </div>

              <button 
                className="search-submit-button" 
                onClick={() => {
                  const params = new URLSearchParams();
                  if (searchText.trim()) params.append('search', searchText.trim());
                  if (selectedFilters.type.value) params.append('type', selectedFilters.type.value);
                  if (selectedFilters.city.value) params.append('city', selectedFilters.city.value);
                  if (selectedFilters.price.value) params.append('price', selectedFilters.price.value);
                  const queryString = params.toString();
                  navigate(`/properties${queryString ? `?${queryString}` : ''}`);
                }}
              >
                <FiSearch className="search-btn-icon" /><span>بحث</span>
              </button>
            </div>
               
            <div className="quick-actions-banner">
              <div className="quick-actions-right-side">
                <span className="section-label">إجراءات سريعة</span>
                <div className="actions-icons-row">
                  <div className="action-item" onClick={() => setIsAiOpen(true)} style={{ cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiZap /></div>
                    <span>مساعد AI</span>
                    <small>دردشة مع المساعد</small>
                  </div>

                  <div className="action-item" onClick={handleComment} style={{ cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiMessageSquare /></div>
                    <span>تعليق</span>
                    <small>شاركنا رأيك</small>
                  </div>

                  <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="action-item" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiMessageCircle /></div>
                    <span>تواصل واتساب</span>
                    <small>من اجل اي استفسار</small>
                  </a>
                </div>
              </div>

              <div className="add-text-content">
                <div className="title-with-icon">
                  <div className="home-icon-small"><FiHome size={20} /></div>
                  <h3>هل لديك عقار للبيع أو الإيجار؟</h3>
                </div>
                <p>انشره الآن ووصل لآلاف العملاء في الجلفة</p>
                
                {/* ← تم تعديل هذا الزر */}
                                 <button 
                  className="btn-add-now" 
                  onClick={() => checkLogin("/AddProperty")}
                >
                  أضف عقارك الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === 2. الإحصائيات === */}
      <section className="stats-wrapper">
        <div className="innerWidth stats-container">
          {stats.map((stat, index) => (
            <motion.div key={index} className="stat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
              <div className="stat-icon">{stat.icon}</div>
              <h2 className="stat-number">{stat.number}</h2>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
            {/* === 3. العقارات المميزة === */}
      <section className="properties-wrapper">
        <div className="innerWidth properties-container">
          <div className="section-header">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-badge">عقارات مميزة</span>
              <h2 className="section-title">اكتشف أحدث العقارات المتاحة</h2>
              <p className="section-desc">اختر من بين مئات العقارات المختارة بعناية في أفضل المواقع</p>
            </motion.div>
            <Link to="/properties" className="view-all-btn">عرض الكل <FiArrowLeft /></Link>
          </div>

          {/* جاري التحميل */}
          {loadingProperties && (
            <div className="properties-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="property-card" style={{ opacity: 0.3 }}>
                  <div style={{ height: 220, background: "#222", borderRadius: "16px 16px 0 0" }}></div>
                  <div style={{ padding: 20 }}>
                    <div style={{ height: 14, width: "60%", background: "#222", borderRadius: 8, marginBottom: 10 }}></div>
                    <div style={{ height: 14, width: "80%", background: "#222", borderRadius: 8, marginBottom: 10 }}></div>
                    <div style={{ height: 14, width: "40%", background: "#222", borderRadius: 8 }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* لا توجد عقارات */}
          {!loadingProperties && featuredProperties.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <FiHome size={48} style={{ marginBottom: 16, color: "#444" }} />
              <p>لا توجد عقارات مميزة حالياً</p>
              <Link to="/properties" className="view-all-btn" style={{ marginTop: '16', display: 'inline-flex' }}>تصفح جميع العقارات</Link>;
            </div>
          )}

          {/* عرض العقارات */}
                         {!loadingProperties && featuredProperties.length > 0 && (
            <div className="properties-grid">
              {featuredProperties.map((property, index) => (
                <Link 
                  to={`/property/${property.id}`} 
                  key={property.id} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div 
                    className="property-card" 
                    initial={{ opacity: 0, y: 40 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="property-image-container">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        onError={(e) => { e.target.src = "./default-property.jpg"; }}
                      />
                      <div className="property-image-overlay">
                        <span className="property-type-badge">{property.type}</span>
                        {property.featured && <span className="property-featured-badge">مميز</span>}
                      </div>
                      <button 
                        className={`fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} 
                        onClick={(e) => { e.preventDefault(); toggleFavorite(e, property.id); }}
                      >
                        <FiHeart />
                      </button>
                    </div>
                    <div className="property-info">
                      <div className="property-price-row">
                        <span className="property-price">{property.price}</span>
                      </div>
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location"><FiMapPin /> {property.location}</p>
                      <div className="property-details-row">
                        {property.beds > 0 && (
                          <div className="property-detail-item"><span>غرف</span><strong>{property.beds}</strong></div>
                        )}
                        {property.baths > 0 && (
                          <div className="property-detail-item"><span>حمامات</span><strong>{property.baths}</strong></div>
                        )}
                        <div className="property-detail-item"><span>المساحة</span><strong>{property.area}</strong></div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* === 4. الخدمات === */}
      <section className="services-wrapper">
        <div className="innerWidth services-container">
          <motion.div className="section-header-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-badge">خدماتنا</span>
            <h2 className="section-title">كل ما تحتاجه في مكان واحد</h2>
            <p className="section-desc">نقدم لك مجموعة متكاملة من الخدمات العقارية لتسهيل تجربتك</p>
          </motion.div>

          <div className="services-carousel-wrapper">
            <button className="unified-arrow left-arrow" onClick={() => scrollServices(-330)}><FiArrowLeft /></button>
            <div className="services-carousel-track" ref={servicesRef}>
              {services.map((service, index) => (
                <motion.div 
                  key={index} 
                  className="service-card-carousel" 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </motion.div>
              ))}
            </div>
            <Link to="/services" className="view-all-services-btn">استعرض جميع الخدمات <FiArrowLeft /></Link>
            <button className="unified-arrow right-arrow" onClick={() => scrollServices(330)}><FiArrowRight /></button>
          </div>
        </div>
      </section>

      {/* === 5. آراء العملاء والتعليقات === */}
      <div id="comments-section" className="testimonials-carousel-container">
        <motion.div className="section-header-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-badge">آراء العملاء</span>
          <h2 className="section-title">تعليقات وآراء عملائنا</h2>
          <p className="section-desc">شاركنا رأيك واقرأ تجارب الآخرين الناجحة معنا</p>
        </motion.div>
        
        <div className="unified-carousel-wrapper">
          <button className="unified-arrow left-arrow" onClick={() => scrollComments(-320)}><FiArrowLeft /></button>
          <div className="unified-carousel-track" ref={commentsRef}>
                         <div className="unified-card add-comment-card">
              <h4 style={{ color: '#f1c991', marginBottom: '15px' }}>أضف تعليقك وتقييمك</h4>
              
              {/* ← رسالة تذكير للمستخدم */}
              {currentUser?.email ? (
                <p style={{ fontSize: '13px', color: '#4caf50', marginBottom: '12px' }}>
                  مرحباً {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                </p>
              ) : (
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                  يجب <span style={{ color: '#f1c991', cursor: 'pointer' }} onClick={() => setIsAuthOpen(true)}>تسجيل الدخول</span> لكتابة تعليق
                </p>
              )}

              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar 
                    key={star} 
                    className={star <= commentRating ? "star-filled active-star" : "star-empty"} 
                    onClick={() => setCommentRating(star)}
                  />
                ))}
              </div>

              <form className="unified-comment-form" onSubmit={handleAddComment}>
                <input 
                  value={commentText} 
                  onChange={(e) => setCommentText(e.target.value)} 
                  placeholder={currentUser?.email ? "اكتب رأيك هنا..." : "سجّل دخولك أولاً..."}
                  disabled={!currentUser?.email}
                />
                <button type="submit" disabled={!currentUser?.email}>إرسال</button>
              </form>
            </div>

            {comments.map((c) => (
              <div key={c.id} className="unified-card user-comment-card">
                
                {c.rating > 0 && (
                  <div className="unified-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < c.rating ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                )}

                <div className="unified-header">
                  <div className="author-avatar-sm">{c.author?.charAt(0) || "?"}</div>
                  <div>
                    {/* ← كان "زائر" أصبح الاسم الحقيقي */}
                    <span className="comment-author">{c.author}</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                </div>
                <p className="unified-text">{c.text}</p>
              </div>
            ))}

            {testimonials.map((t, index) => (
              <div key={`t-${index}`} className="unified-card">
                <div className="unified-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < t.rating ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <div className="unified-header">
                  <div className="author-avatar-sm">{t.name.charAt(0)}</div>
                  <div>
                    <span className="comment-author">{t.name}</span>
                    <span className="comment-time">{t.role}</span>
                  </div>
                </div>
                <p className="unified-text">"{t.text}"</p>
              </div>
            ))}
          </div>
          <button className="unified-arrow right-arrow" onClick={() => scrollComments(320)}><FiArrowRight /></button>
        </div>
      </div>

      {/* === 6. دعوة للعمل ← تم تعديل الأزرار === */}
      <section className="cta-wrapper">
        <div className="innerWidth cta-container">
          <motion.div className="cta-content" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2>ابدأ رحلتك العقارية اليوم</h2>
            <p>سواء كنت تبحث عن عقار أو تريد بيع عقارك، ADAR هنا لمساعدتك</p>
            <div className="cta-buttons">
                           <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={() => navigate("/properties")}>
                <FiSearch /> ابحث عن عقار
              </button>
              <button className="cta-btn-secondary" onClick={() => checkLogin("/AddProperty")}>
                <FiUploadCloud /> أضف عقارك
              </button>
              <button className="cta-btn-secondary" onClick={() => checkLogin("/AddService")}>
                <FiUploadCloud /> أضف خدمة
              </button>
            </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === الذكاء الاصطناعي === */}
      {isAiOpen && <AiChat onClose={() => setIsAiOpen(false)} />}

      {/* ← نافذة تسجيل الدخول المنبثقة */}
      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => { setIsAuthOpen(false); setPendingAction(null); }}
        />
      )}
    </div>
  );
}