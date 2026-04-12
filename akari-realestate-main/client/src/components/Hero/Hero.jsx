
/*import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FiSearch, FiHome, FiMessageCircle, FiUploadCloud, 
  FiShield, FiChevronDown 
} from 'react-icons/fi';
   
export default function Hero() {
  const navigate = useNavigate();

  // 1. بيانات القوائم المنسدلة
  const propertyTypes = [
    { value: 'apartment', label: 'شقة' },
    { value: 'villa', label: 'فيلا' },
    { value: 'house', label: 'منزل' },
    { value: 'land', label: 'أرض' },
    { value: 'commercial', label: 'محل تجاري' },
     
  ];

  const cities = [
    { value: 'riyadh', label: 'الجلفة' },
    { value: 'jeddah', label: 'تسمسيلت' },
    { value: 'dubai', label: 'الجزائر العاصمة' },
    { value: 'cairo', label: 'وهران' },
     
  ];

  const priceRanges = [
    { value: '0-500000', label: 'أقل من 500,000' },
    { value: '500000-1000000', label: '500,000 - 1,000,000' },
    { value: '1000000-3000000', label: '1,000,000 - 3,000,000' },
    { value: '3000000-plus', label: 'أكثر من 3,000,000' }
  ];

  // 2. حالات القوائم (فتح/إغلاق + القيم المختارة)
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'نوع العقار',
    city: 'المدينة',
    price: 'نطاق السعر'
  });
  
  const dropdownRef = useRef(null);

  // 3. إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. دالة اختيار عنصر من القائمة
  const handleSelect = (filterKey, option) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: option.label }));
    setOpenDropdown(null);
  };
  
  return (
    <section className="hero-wrapper">
      <div className="hero-bg-container">
        <img src="./hero.jpg" alt="Djelfa Real Estate" />
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
          
          {/* --- شريط البحث المتقدم مع القوائم المنسدلة --- *}
          <div className="hero-advanced-search" ref={dropdownRef}> 
            
            <div className="search-text-input-section">
              <FiSearch className="search-input-icon" />
              <input 
                type="text" 
                placeholder="بحث..." 
                className="search-text-field"
              />
            </div>

            <div className="search-filter-fields">
              
              {/* قائمة نوع العقار *}
              <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}>
                <span className={selectedFilters.type !== 'نوع العقار' ? 'selected-text' : ''}>{selectedFilters.type}</span>
                <FiChevronDown className={`dropdown-icon ${openDropdown === 'type' ? 'rotate-icon' : ''}`} />
                {openDropdown === 'type' && (
                  <div className="dropdown-list">
                    {propertyTypes.map(opt => (
                      <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('type', opt); }}>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* قائمة المدينة *}
              <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}>
                <span className={selectedFilters.city !== 'المدينة' ? 'selected-text' : ''}>{selectedFilters.city}</span>
                <FiChevronDown className={`dropdown-icon ${openDropdown === 'city' ? 'rotate-icon' : ''}`} />
                {openDropdown === 'city' && (
                  <div className="dropdown-list">
                    {cities.map(opt => (
                      <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('city', opt); }}>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* قائمة نطاق السعر *}
              <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}>
                <span className={selectedFilters.price !== 'نطاق السعر' ? 'selected-text' : ''}>{selectedFilters.price}</span>
                <FiChevronDown className={`dropdown-icon ${openDropdown === 'price' ? 'rotate-icon' : ''}`} />
                {openDropdown === 'price' && (
                  <div className="dropdown-list">
                    {priceRanges.map(opt => (
                      <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('price', opt); }}>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            <button className="search-submit-button" onClick={() => navigate("/properties")}>
              <FiSearch className="search-btn-icon" />
              <span>بحث</span>
            </button>
            
          </div>
             
          {/* --- شريط الإجراءات السريعة --- *}
          <div className="quick-actions-banner">
            {/* 1. قسم الإجراءات السريعة (يمين) *}
            <div className="quick-actions-right-side">
              <span className="section-label">إجراءات سريعة</span>
              <div className="actions-icons-row">
                <div className="action-item">
                  <div className="action-icon-circle"><FiShield /></div>
                  <span>تقييم عقاري</span>
                  <small>احصل على تقييم دقيق</small>
                </div>
                <div className="action-item">
                  <div className="action-icon-circle"><FiUploadCloud /></div>
                  <span>أضف عقاراتك</span>
                  <small>انشر عقاراتك الآن</small>
                </div>
                <div className="action-item">
                  <div className="action-icon-circle"><FiMessageCircle /></div>
                  <span>تواصل واتساب</span>
                  <small>تحدث مع وكيل مباشر</small>
                </div>
              </div>
            </div>

            {/* 2. قسم "هل لديك عقار" (يسار) *}
            <div className="quick-actions-left-side">
              <div className="add-property-card">
                <div className="add-text-content">
                  <div className="title-with-icon">
                    <div className="home-icon-small">
                      <FiHome size={20} />
                    </div>
                    <h3>هل لديك عقار للبيع أو الإيجار؟</h3>
                  </div>
                  <p>انشره الآن ووصل لآلاف العملاء في الجلفة</p>
                  <button className="btn-add-now">أضف عقارك الآن</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}*/

import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiSearch, FiHome, FiMessageCircle, FiUploadCloud, 
  FiShield, FiChevronDown, FiMapPin, FiUsers, FiTrendingUp, 
  FiAward, FiArrowLeft, FiStar, FiHeart
} from 'react-icons/fi';

export default function Hero() {
  const navigate = useNavigate();

  const propertyTypes = [
    { value: 'apartment', label: 'شقة' },
    { value: 'villa', label: 'فيلا' },
    { value: 'house', label: 'منزل' },
    { value: 'land', label: 'أرض' },
    { value: 'commercial', label: 'محل تجاري' },
  ];

  const cities = [
    { value: 'djelfa', label: 'الجلفة' },
    { value: 'tmsilt', label: 'تسمسيلت' },
    { value: 'algiers', label: 'الجزائر العاصمة' },
    { value: 'oran', label: 'وهران' },
  ];

  const priceRanges = [
    { value: '0-500000', label: 'أقل من 500,000' },
    { value: '500000-1000000', label: '500,000 - 1,000,000' },
    { value: '1000000-3000000', label: '1,000,000 - 3,000,000' },
    { value: '3000000-plus', label: 'أكثر من 3,000,000' }
  ];

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    type: 'نوع العقار',
    city: 'المدينة',
    price: 'نطاق السعر'
  });
  const dropdownRef = useRef(null);

  // === حالة المفضلة ===
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (e, id) => {
    e.stopPropagation(); // لمنع فتح كرت العقار عند الضغط على القلب
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fid => fid !== id) 
        : [...prev, id]
    );
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (filterKey, option) => {
    setSelectedFilters(prev => ({ ...prev, [filterKey]: option.label }));
    setOpenDropdown(null);
  };

  const featuredProperties = [
    {
      id: 1,
      image: "https://i.pinimg.com/736x/c5/88/9d/c5889dea48dee28bb4652464d70ee678.jpg",
      title: "شقة فاخرة في قلب المدينة",
      location: "الجلفة، حي البساتين",
      price: "12,500,000 دج",
      type: "شقة",
      beds: 3,
      baths: 2,
      area: "120 م²",
      featured: true
    },
    {
      id: 2,
      image: "https://i.pinimg.com/1200x/fb/7b/35/fb7b352a7a4f99b0d9b8c82df6617cb8.jpg",
      title: "فيلا حديثة مع حديقة",
      location: "الجزائر العاصمة، باب الزوار",
      price: "35,000,000 دج",
      type: "فيلا",
      beds: 5,
      baths: 3,
      area: "280 م²",
      featured: true
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/e9/90/1c/e9901c4b99b7c3679132ff371d7643e8.jpg",
      title: "محل تجاري في موقع استراتيجي",
      location: "وهران، شارع لاربي بن مهيدي",
      price: "18,000,000 دج",
      type: "محل تجاري",
      beds: 0,
      baths: 1,
      area: "90 م²",
      featured: false
    },
    {
      id: 4,
      image: "https://tse4.mm.bing.net/th/id/OIP.0UezRVhr32nhHVpkDiGr_QHaFj?rs=1&pid=ImgDetMain&o=7&rm=3",
      title: "أرض سكنية قابلة للبناء",
      location: "الجزائر العاصمة, زرالدة",
      price: "8,500,000 دج",
      type: "أرض",
      beds: 0,
      baths: 0,
      area: " 1,920,000 م²",
      featured: false
    },
    {
      id: 5,
      image: "https://i.pinimg.com/1200x/c3/c0/c9/c3c0c9f637c24dc1d2fdabf3b948d492.jpg",
      title: "منزل عائلي مستقل",
      location: "الجلفة، حي 1 نوفمبر",
      price: "15,200,000 دج",
      type: "منزل",
      beds: 4,
      baths: 2,
      area: "200 م²",
      featured: true
    },
    {
      id: 6,
      image: "https://i.pinimg.com/1200x/5a/e2/0f/5ae20fddb5028843a0991857084e99c1.jpg",
      title: "شقة استوديو مفروشة",
      location: "الجزائر العاصمة، حيدرة",
      price: "6,800,000 دج",
      type: "شقة",
      beds: 1,
      baths: 1,
      area: "45 م²",
      featured: false
    }
  ];

  const services = [
    { icon: <FiHome />, title: "بيع وشراء العقارات", desc: "منصة متكاملة لعرض وبيع العقارات بأفضل الأسعار في الجزائر" },
    { icon: <FiShield />, title: "تقييم عقاري دقيق", desc: "فريق متخصص يقدم تقييماً عادلاً ودقيقاً لعقارك حسب السوق" },
    { icon: <FiUsers />, title: "وكالات معتمدة", desc: "شبكة واسعة من الوكالات العقارية المرخصة والموثوقة" },
    { icon: <FiTrendingUp />, title: "استشارات استثمارية", desc: "نقدم لك أفضل النصائح للاستثمار العقاري الذكي والمربح" },
    { icon: <FiUploadCloud />, title: "نشر عقاراتك مجاناً", desc: "أضف عقارك بسهولة وصل لآلاف المهتمين بدون أي رسوم" },
    { icon: <FiMessageCircle />, title: "تواصل مباشر", desc: "تحدث مع الوكيل أو المالك مباشرة عبر واتساب أو الهاتف" }
  ];

  const agencies = [
    { name: "زينو للعقارات", img: "https://tse4.mm.bing.net/th/id/OIP.5OQwnp8OLEGrBc1k9bN59gHaHj?rs=1&pid=ImgDetMain&o=7&rm=3", deals: "150+", rating: 4.8 },
    { name: "ونوقي للعقارات", img: "https://tse4.mm.bing.net/th/id/OIP.9GPanPH78ZV0O_u6MCz8IQHaEl?rs=1&pid=ImgDetMain&o=7&rm=3", deals: "230+", rating: 4.9 },
    { name: "عبزوزي للعقار", img: "https://tse1.mm.bing.net/th/id/OIP.HDcVtMjTlteULhkt1QgzzwHaHf?rs=1&pid=ImgDetMain&o=7&rm=3", deals: "90+", rating: 4.7 },
    { name: "صفقة عقارية", img: "https://tse2.mm.bing.net/th/id/OIP.Gj_PVW230YbHPQZWlYkxZgHaHZ?rs=1&pid=ImgDetMain&o=7&rm=3", deals: "180+", rating: 4.6 }
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
        <div className="hero-bg-container">
          <img src="./hero.jpg" alt="Djelfa Real Estate" />
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
            
            <div className="hero-advanced-search" ref={dropdownRef}> 
              <div className="search-text-input-section">
                <FiSearch className="search-input-icon" />
                <input type="text" placeholder="بحث..." className="search-text-field" />
              </div>

              <div className="search-filter-fields">
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}>
                  <span className={selectedFilters.type !== 'نوع العقار' ? 'selected-text' : ''}>{selectedFilters.type}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'type' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'type' && (
                    <div className="dropdown-list">
                      {propertyTypes.map(opt => (
                        <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('type', opt); }}>{opt.label}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}>
                  <span className={selectedFilters.city !== 'المدينة' ? 'selected-text' : ''}>{selectedFilters.city}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'city' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'city' && (
                    <div className="dropdown-list">
                      {cities.map(opt => (
                        <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('city', opt); }}>{opt.label}</div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}>
                  <span className={selectedFilters.price !== 'نطاق السعر' ? 'selected-text' : ''}>{selectedFilters.price}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'price' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'price' && (
                    <div className="dropdown-list">
                      {priceRanges.map(opt => (
                        <div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('price', opt); }}>{opt.label}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className="search-submit-button" onClick={() => navigate("/properties")}>
                <FiSearch className="search-btn-icon" />
                <span>بحث</span>
              </button>
            </div>
               
            <div className="quick-actions-banner">
              <div className="quick-actions-right-side">
                <span className="section-label">إجراءات سريعة</span>
                <div className="actions-icons-row">
                  <div className="action-item">
                    <div className="action-icon-circle"><FiShield /></div>
                    <span>تقييم عقاري</span>
                    <small>احصل على تقييم دقيق</small>
                  </div>
                  <div className="action-item">
                    <div className="action-icon-circle"><FiUploadCloud /></div>
                    <span>أضف عقاراتك</span>
                    <small>انشر عقاراتك الآن</small>
                  </div>
                  <div className="action-item">
                    <div className="action-icon-circle"><FiMessageCircle /></div>
                    <span>تواصل واتساب</span>
                    <small>تحدث مع وكيل مباشر</small>
                  </div>
                </div>
              </div>

              <div className="quick-actions-left-side">
                <div className="add-property-card">
                  <div className="add-text-content">
                    <div className="title-with-icon">
                      <div className="home-icon-small"><FiHome size={20} /></div>
                      <h3>هل لديك عقار للبيع أو الإيجار؟</h3>
                    </div>
                    <p>انشره الآن ووصل لآلاف العملاء في الجلفة</p>
                    <button className="btn-add-now">أضف عقارك الآن</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === 2. الإحصائيات === */}
      <section className="stats-wrapper">
        <div className="innerWidth stats-container">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <h2 className="stat-number">{stat.number}</h2>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* === 3. العقارات المميزة (مع زر المفضلة) === */}
      <section className="properties-wrapper">
        <div className="innerWidth properties-container">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-badge">عقارات مميزة</span>
              <h2 className="section-title">اكتشف أحدث العقارات المتاحة</h2>
              <p className="section-desc">اختر من بين مئات العقارات المختارة بعناية في أفضل المواقع</p>
            </motion.div>
            <Link to="/properties" className="view-all-btn">
              عرض الكل <FiArrowLeft />
            </Link>
          </div>

          <div className="properties-grid">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                className="property-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="property-image-container">
                  <img src={property.image} alt={property.title} />
                  <div className="property-image-overlay">
                    <span className="property-type-badge">{property.type}</span>
                    {property.featured && <span className="property-featured-badge">مميز</span>}
                  </div>
                  
                  {/* ========== زر المفضلة ========== */}
                  <button 
                    className={`fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`}
                    onClick={(e) => toggleFavorite(e, property.id)}
                    aria-label="أضف للمفضلة"
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
                      <div className="property-detail-item">
                        <span>غرف</span>
                        <strong>{property.beds}</strong>
                      </div>
                    )}
                    {property.baths > 0 && (
                      <div className="property-detail-item">
                        <span>حمامات</span>
                        <strong>{property.baths}</strong>
                      </div>
                    )}
                    <div className="property-detail-item">
                      <span>المساحة</span>
                      <strong>{property.area}</strong>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 4. الخدمات === */}
      <section className="services-wrapper">
        <div className="innerWidth services-container">
          <motion.div
            className="section-header-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">خدماتنا</span>
            <h2 className="section-title">كل ما تحتاجه في مكان واحد</h2>
            <p className="section-desc">نقدم لك مجموعة متكاملة من الخدمات العقارية لتسهيل تجربتك</p>
          </motion.div>

          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 5. الوكالات === */}
      <section className="agencies-wrapper">
        <div className="innerWidth agencies-container">
          <motion.div
            className="section-header-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">وكالاتنا</span>
            <h2 className="section-title">وكالات عقارية معتمدة</h2>
            <p className="section-desc">تعامل مع وكالات موثوقة ومرخصة لضمان صفقات آمنة</p>
          </motion.div>

          <div className="agencies-grid">
            {agencies.map((agency, index) => (
              <motion.div
                key={index}
                className="agency-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="agency-image-container">
                  <img src={agency.img} alt={agency.name} />
                </div>
                <div className="agency-info">
                  <h3 className="agency-name">{agency.name}</h3>
                  <div className="agency-stats">
                    <span><FiTrendingUp /> {agency.deals} صفقة</span>
                    <span><FiStar /> {agency.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="agencies-cta">
            <Link to="/agencies" className="agencies-cta-btn">
              تصفح جميع الوكالات <FiArrowLeft />
            </Link>
          </div>
        </div>
      </section>

      {/* === 6. آراء العملاء === */}
      <section className="testimonials-wrapper">
        <div className="innerWidth testimonials-container">
          <motion.div
            className="section-header-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">آراء العملاء</span>
            <h2 className="section-title">ماذا يقول عملاؤنا عنا</h2>
            <p className="section-desc">نفخر بثقة عملائنا وتجاربهم الناجحة مع منصتنا</p>
          </motion.div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < testimonial.rating ? "star-filled" : "star-empty"} />
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.name.charAt(0)}</div>
                  <div>
                    <h4 className="author-name">{testimonial.name}</h4>
                    <span className="author-role">{testimonial.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* === 7. دعوة للعمل === */}
      <section className="cta-wrapper">
        <div className="innerWidth cta-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>ابدأ رحلتك العقارية اليوم</h2>
            <p>سواء كنت تبحث عن عقار أو تريد بيع عقارك، ADAR هنا لمساعدتك</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={() => navigate("/properties")}>
                <FiSearch /> ابحث عن عقار
              </button>
              <button className="cta-btn-secondary" onClick={() => navigate("/Services")}>
                <FiUploadCloud /> أضف عقارك
              </button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}