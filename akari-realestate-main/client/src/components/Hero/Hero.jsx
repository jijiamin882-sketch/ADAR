import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiSearch, FiHome, FiMessageCircle, FiUploadCloud, 
  FiShield, FiChevronDown, FiMapPin, FiUsers, FiTrendingUp, 
  FiAward, FiArrowLeft, FiArrowRight, FiStar, FiHeart, FiZap, FiMessageSquare,
  FiTool, FiTruck, FiFileText, FiBox
} from 'react-icons/fi';
import AiChat from "../../pages/AiChat/AiChat";
import AddProperty from "../../pages/AddProperty/AddProperty";
import { createClient } from "@supabase/supabase-js";

// === إنشاء اتصال Supabase مباشرة هنا ===
const supabase = createClient(
  "https://pngumoydgkdpurzbcxqv.supabase.co",  
  "sb_publishable_YAdSiCennqPgMOdeeDO42g_ZRr9hYTz"                
);

export default function Hero() {
  const navigate = useNavigate();
  
  // === حالات الصفحة ===
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [commentText, setCommentText] = useState(''); 
  const [comments, setComments] = useState([]); 
  const commentsRef = useRef(null); // للتحكم في الأسهم
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
  const [selectedFilters, setSelectedFilters] = useState({ type: 'نوع العقار', city: 'المدينة', price: 'نطاق السعر' });
  const dropdownRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
   const [commentRating, setCommentRating] = useState(0);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  useEffect(() => {
  const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenDropdown(null); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (filterKey, option) => { setSelectedFilters(prev => ({ ...prev, [filterKey]: option.label })); setOpenDropdown(null); };

  // === دوال التعليقات والأسهم ===
  const handleComment = () => { const section = document.getElementById('comments-section'); if (section) section.scrollIntoView({ behavior: 'smooth' }); };
  
  const scrollComments = (scrollOffset) => { if (commentsRef.current) commentsRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' }); };

  const handleAddComment = (e) => {
     
     e.preventDefault();
    // لا يرسل إذا كان النص فارغاً أو لم يتم اختيار نجوم
    if (commentText.trim() === '' || commentRating === 0) return; 

    const newComment = { 
      id: Date.now(), 
      text: commentText, 
      rating: commentRating, // <--- حفظ التقييم مع التعليق
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) 
    };
    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentRating(0); // تصفير النجوم بعد الإرسال
  };
  const scrollServices = (scrollOffset) => {
    if (servicesRef.current) {
      servicesRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  // === بيانات الصفحة ===
  const featuredProperties = [
    { id: 1, image: "https://i.pinimg.com/736x/c5/88/9d/c5889dea48dee28bb4652464d70ee678.jpg", title: "شقة فاخرة في قلب المدينة", location: "الجلفة، حي البساتين", price: "12,500,000 دج", type: "شقة", beds: 3, baths: 2, area: "120 م²", featured: true },
    { id: 2, image: "https://i.pinimg.com/1200x/fb/7b/35/fb7b352a7a4f99b0d9b8c82df6617cb8.jpg", title: "فيلا حديثة مع حديقة", location: "الجزائر العاصمة، باب الزوار", price: "35,000,000 دج", type: "فيلا", beds: 5, baths: 3, area: "280 م²", featured: true },
    { id: 3, image: "https://i.pinimg.com/736x/e9/90/1c/e9901c4b99b7c3679132ff371d7643e8.jpg", title: "محل تجاري في موقع استراتيجي", location: "وهران، شارع لاربي بن مهيدي", price: "18,000,000 دج", type: "محل تجاري", beds: 0, baths: 1, area: "90 م²", featured: false },
    { id: 4, image: "https://tse4.mm.bing.net/th/id/OIP.0UezRVhr32nhHVpkDiGr_QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3", title: "أرض سكنية قابلة للبناء", location: "الجزائر العاصمة, زرالدة", price: "8,500,000 دج", type: "أرض", beds: 0, baths: 0, area: " 1,920,000 م²", featured: false },
    { id: 5, image: "https://i.pinimg.com/1200x/c3/c0/c9/c3c0c9f637c24dc1d2fdabf3b948d492.jpg", title: "منزل عائلي مستقل", location: "الجلفة، حي 1 نوفمبر", price: "15,200,000 دج", type: "منزل", beds: 4, baths: 2, area: "200 م²", featured: true },
    { id: 6, image: "https://i.pinimg.com/1200x/5a/e2/0f/5ae20fddb5028843a0991857084e99c1.jpg", title: "شقة استوديو مفروشة", location: "الجزائر العاصمة، حيدرة", price: "6,800,000 دج", type: "شقة", beds: 1, baths: 1, area: "45 م²", featured: false }
  ];

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
    { number: "85+", label: "وكالة معتمدة", icon: <FiAward /> },
    { number: "350+", label: "صفقة شهرياً", icon: <FiTrendingUp /> }
  ];

  return (
    <div className="home-page">
           
      {/* === 1. الهيرو === */}
      <section className="hero-wrapper">
        <div className="hero-bg-container"><img src="./hero.jpg" alt="Djelfa Real Estate" /><div className="hero-overlay"></div></div>
        <div className="paddings innerWidth hero-container">
          <div className="flexColCenter hero-content">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-title">دليلك الأول للعقارات</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hero-subtitle">يمكن ان نربطك مباشرة مع أفضل الوكالات العقارية والموثقين المعتمدين</motion.p>
            
            <div className="hero-advanced-search" ref={dropdownRef}> 
              <div className="search-text-input-section"><FiSearch className="search-input-icon" /><input type="text" placeholder="بحث..." className="search-text-field" /></div>
              <div className="search-filter-fields">
                {/* فلاتر البحث (كما هي) */}
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}><span className={selectedFilters.type !== 'نوع العقار' ? 'selected-text' : ''}>{selectedFilters.type}</span><FiChevronDown className={`dropdown-icon ${openDropdown === 'type' ? 'rotate-icon' : ''}`} />{openDropdown === 'type' && (<div className="dropdown-list">{propertyTypes.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('type', opt); }}>{opt.label}</div>))}</div>)}</div>
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}><span className={selectedFilters.city !== 'المدينة' ? 'selected-text' : ''}>{selectedFilters.city}</span><FiChevronDown className={`dropdown-icon ${openDropdown === 'city' ? 'rotate-icon' : ''}`} />{openDropdown === 'city' && (<div className="dropdown-list">{cities.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('city', opt); }}>{opt.label}</div>))}</div>)}</div>
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}><span className={selectedFilters.price !== 'نطاق السعر' ? 'selected-text' : ''}>{selectedFilters.price}</span><FiChevronDown className={`dropdown-icon ${openDropdown === 'price' ? 'rotate-icon' : ''}`} />{openDropdown === 'price' && (<div className="dropdown-list">{priceRanges.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('price', opt); }}>{opt.label}</div>))}</div>)}</div>
              </div>
              <button className="search-submit-button" onClick={() => navigate("/properties")}><FiSearch className="search-btn-icon" /><span>بحث</span></button>
            </div>
               
            <div className="quick-actions-banner">
               
              {/* === الإجراءات السريعة (تم التنظيف) === */}
            
              <div className="quick-actions-right-side">
                <span className="section-label">إجراءات سريعة</span>
                
                {/* هذا هو السطر الذي يجمعهم بجانب بعض */}
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
                {/* نهاية سطر الأيقونات */}
                
              </div>
              <div className="add-text-content">
                <div className="title-with-icon">
                <div className="home-icon-small"><FiHome size={20} /></div>
                <h3>هل لديك عقار للبيع أو الإيجار؟</h3>
                </div>
                  <p>انشره الآن ووصل لآلاف العملاء في الجلفة</p>
                  <button className="btn-add-now" onClick={() => navigate("/AddProperty")}>أضف عقارك الآن</button>
                </div>
              </div>

              
          </div>
        </div>
      </section>

      {/* === 2. الإحصائيات === */}
      <section className="stats-wrapper"><div className="innerWidth stats-container">{stats.map((stat, index) => (<motion.div key={index} className="stat-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}><div className="stat-icon">{stat.icon}</div><h2 className="stat-number">{stat.number}</h2><p className="stat-label">{stat.label}</p></motion.div>))}</div></section>

      {/* === 3. العقارات المميزة === */}
      <section className="properties-wrapper">
        <div className="innerWidth properties-container">
          <div className="section-header"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><span className="section-badge">عقارات مميزة</span><h2 className="section-title">اكتشف أحدث العقارات المتاحة</h2><p className="section-desc">اختر من بين مئات العقارات المختارة بعناية في أفضل المواقع</p></motion.div><Link to="/properties" className="view-all-btn">عرض الكل <FiArrowLeft /></Link></div>
          <div className="properties-grid">{featuredProperties.map((property, index) => (<motion.div key={property.id} className="property-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}><div className="property-image-container"><img src={property.image} alt={property.title} /><div className="property-image-overlay"><span className="property-type-badge">{property.type}</span>{property.featured && <span className="property-featured-badge">مميز</span>}</div><button className={`fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)} aria-label="أضف للمفضلة"><FiHeart /></button></div><div className="property-info"><div className="property-price-row"><span className="property-price">{property.price}</span></div><h3 className="property-title">{property.title}</h3><p className="property-location"><FiMapPin /> {property.location}</p><div className="property-details-row">{property.beds > 0 && (<div className="property-detail-item"><span>غرف</span><strong>{property.beds}</strong></div>)}{property.baths > 0 && (<div className="property-detail-item"><span>حمامات</span><strong>{property.baths}</strong></div>)}<div className="property-detail-item"><span>المساحة</span><strong>{property.area}</strong></div></div></div></motion.div>))}</div>
        </div>
      </section>

      {/* === 4. الخدمات === */}
                  
             {/* === 4. الخدمات (شريط أفقي) === */}
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
             {/* زر المزيد */}
            <Link to="/services" className="view-all-services-btn">
              استعرض جميع الخدمات <FiArrowLeft />
            </Link>
            <button className="unified-arrow right-arrow" onClick={() => scrollServices(330)}><FiArrowRight /></button>

            
          </div>
        </div>
      </section>

      {/* === 5. آراء العملاء والتعليقات (شريط أفقي مدمج) === */}
      <div id="comments-section" className="testimonials-carousel-container">
        <motion.div className="section-header-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-badge">آراء العملاء</span>
          <h2 className="section-title">تعليقات وآراء عملائنا</h2>
          <p className="section-desc">شاركنا رأيك واقرأ تجارب الآخرين الناجحة معنا</p>
        </motion.div>
        
        <div className="unified-carousel-wrapper">
          <button className="unified-arrow left-arrow" onClick={() => scrollComments(-320)}><FiArrowLeft /></button>

          <div className="unified-carousel-track" ref={commentsRef}>
                        {/* 1. بطاقة إضافة التعليق دائماً في البداية */}
            <div className="unified-card add-comment-card">
              <h4 style={{ color: '#f1c991', marginBottom: '15px' }}>أضف تعليقك وتقييمك</h4>
              
              {/* نجوم التقييم التفاعلية */}
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
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="اكتب رأيك هنا..." />
                <button type="submit">إرسال</button>
              </form>
            </div>

            {/* 2. التعليقات التي كتبها المستخدم حديثاً (مع عرض النجوم) */}
            {comments.map((c) => (
              <div key={c.id} className="unified-card user-comment-card">
                
                {/* عرض النجوم إذا قام المستخدم بتقييم */}
                {c.rating > 0 && (
                  <div className="unified-stars">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={i < c.rating ? "star-filled" : "star-empty"} />
                    ))}
                  </div>
                )}

                <div className="unified-header">
                  <div className="author-avatar-sm">{c.text.charAt(0)}</div>
                  <div>
                    <span className="comment-author">زائر</span>
                    <span className="comment-time">{c.time}</span>
                  </div>
                </div>
                <p className="unified-text">{c.text}</p>
              </div>
            ))}

            {/* 3. آراء العملاء الثابتة (بدون تغيير) */}
            {testimonials.map((t, index) => (
              <div key={`t-${index}`} className="unified-card">
                 {/* ... كود آراء العملاء يبقى كما هو ... */}
              </div>
            ))}
            
          </div>

          <button className="unified-arrow right-arrow" onClick={() => scrollComments(320)}><FiArrowRight /></button>
        </div>
      </div>

      {/* === 6. دعوة للعمل === */}
      <section className="cta-wrapper">
        <div className="innerWidth cta-container">
          <motion.div className="cta-content" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <h2>ابدأ رحلتك العقارية اليوم</h2>
            <p>سواء كنت تبحث عن عقار أو تريد بيع عقارك، ADAR هنا لمساعدتك</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={() => navigate("/properties")}>
                <FiSearch /> ابحث عن عقار
              </button>
              <button className="cta-btn-secondary" onClick={() => navigate("/AddProperty")}>
                <FiUploadCloud /> أضف عقارك
              </button>
              <button className="cta-btn-secondary" onClick={() => navigate("/AddService")}>
                <FiUploadCloud /> أضف خدمة
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* === الذكاء الاصطناعي === */}
      {isAiOpen && <AiChat onClose={() => setIsAiOpen(false)} />}
    </div>
  );
}