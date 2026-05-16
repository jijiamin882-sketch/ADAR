import React, { useState, useRef, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء مكتبة الترجمة
import { 
  FiSearch, FiHome, FiMessageCircle, FiUploadCloud, 
  FiShield, FiChevronDown, FiMapPin, FiUsers, FiTrendingUp, 
  FiAward, FiArrowLeft, FiArrowRight, FiStar, FiHeart, FiZap, FiMessageSquare,
  FiTool, FiTruck, FiFileText, FiBox
} from 'react-icons/fi';
import AiChat from "../../pages/AiChat/AiChat";
import AuthModal from "../AuthModal/AuthModal";

export default function Hero() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t: translate } = useTranslation(); // <-- 2. تعريف دالة الترجمة (تسميتها translate لتجنب التعارض)

  const checkLogin = (path) => {
    if (!currentUser || !currentUser.email) {
      setPendingAction(path);
      setIsAuthOpen(true);
      return;
    }
    navigate(path);
  };  

  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]); 
  const commentsRef = useRef(null);
  const servicesRef = useRef(null);

  // <-- 3. ترجمة المصفوفات الثابتة
  const propertyTypes = [
    { value: 'apartment', label: translate('type_apartment') }, { value: 'villa', label: translate('type_villa') },
    { value: 'house', label: translate('type_house') }, { value: 'land', label: translate('type_land') },
    { value: 'commercial', label: translate('type_commercial') },
  ];

  const cities = [
    { value: 'djelfa', label: translate('city_djelfa') }, { value: 'tmsilt', label: translate('city_tmsilt') },
    { value: 'algiers', label: translate('city_algiers') }, { value: 'oran', label: translate('city_oran') },
  ];

  const priceRanges = [
    { value: '0-500000', label: translate('price_1') }, { value: '500000-1000000', label: translate('price_2') },
    { value: '1000000-3000000', label: translate('price_3') }, { value: '3000000-plus', label: translate('price_4') }
  ];

  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({ 
    type: { value: '', label: '' }, 
    city: { value: '', label: '' }, 
    price: { value: '', label: '' } 
  });
  const dropdownRef = useRef(null);
  const [favorites, setFavorites] = useState([]);
  const [commentRating, setCommentRating] = useState(0);

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
    if (!currentUser?.email) {
      setPendingAction(() => handleComment);
      setIsAuthOpen(true);
      return;
    }
    if (commentText.trim() === '' || commentRating === 0) return; 
    const userName = currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || translate('user');
    const newComment = { 
      id: Date.now(), text: commentText, rating: commentRating,
      author: userName,
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }) 
    };
    setComments([newComment, ...comments]);
    setCommentText('');
    setCommentRating(0);
  };

  const scrollServices = (scrollOffset) => {
    if (servicesRef.current) servicesRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
  };

  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoadingProperties(true);
      const { data, error } = await supabase.from("properties").select("*").eq("status", "active").order("created_at", { ascending: false }).limit(6);
      if (!error && data) {
        setFeaturedProperties(data.map((p) => ({
          id: p.id, image: p.image || "./default-property.jpg", title: p.title, // ملاحظة: بيانات قاعدة البيانات لا نترجمها هنا
          location: p.location || p.city || "", price: Number(p.price).toLocaleString("ar-DZ") + " دج", type: p.type,
          beds: p.rooms || 0, baths: p.baths || 0, area: (p.area || 0) + " م²", featured: true,
        })));
      }
      setLoadingProperties(false);
    };
    fetchFeatured();
  }, []);

  // <-- 4. ترجمة مصفوفة الخدمات
  const services = [
    { icon: <FiHome />, title: translate('service_1_title'), desc: translate('service_1_desc') },
    { icon: <FiShield />, title: translate('service_2_title'), desc: translate('service_2_desc') },
    { icon: <FiTrendingUp />, title: translate('service_3_title'), desc: translate('service_3_desc') },
    { icon: <FiUploadCloud />, title: translate('service_4_title'), desc: translate('service_4_desc') },
    { icon: <FiBox />, title: translate('service_5_title'), desc: translate('service_5_desc') },
    { icon: <FiTool />, title: translate('service_6_title'), desc: translate('service_6_desc') },
    { icon: <FiTruck />, title: translate('service_7_title'), desc: translate('service_7_desc') },
    { icon: <FiFileText />, title: translate('service_8_title'), desc: translate('service_8_desc') }
  ];

  // <-- 5. ترجمة مصفوفة آراء العملاء
  const testimonials = [
    { name: translate('t1_name'), role: translate('t1_role'), text: translate('t1_text'), rating: 5 },
    { name: translate('t2_name'), role: translate('t2_role'), text: translate('t2_text'), rating: 5 },
    { name: translate('t3_name'), role: translate('t3_role'), text: translate('t3_text'), rating: 4 }
  ];

  const stats = [
    { number: "2,500+", label: translate('stat_properties'), icon: <FiHome /> },
    { number: "1,200+", label: translate('stat_clients'), icon: <FiUsers /> },
    { number: "85+", label: translate('stat_services'), icon: <FiAward /> },
    { number: "350+", label: translate('stat_deals'), icon: <FiTrendingUp /> }
  ];

  return (
    <div className="home-page">
      {/* === 1. الهيرو === */}
      <section className="hero-wrapper">
        <div className="hero-bg-container"><img src="./hero.jpg" alt="Djelfa Real Estate" /><div className="hero-overlay"></div></div>
        <div className="paddings innerWidth hero-container">
          <div className="flexColCenter hero-content">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="hero-title">{translate('hero_title')}</motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="hero-subtitle">{translate('hero_subtitle')}</motion.p>
            
            <div className="hero-advanced-search" ref={dropdownRef}> 
              <div className="search-text-input-section">
                <FiSearch className="search-input-icon" /> 
                <input type="text" placeholder={translate('search_placeholder')} className="search-text-field" value={searchText} onChange={(e) => setSearchText(e.target.value)} /> 
              </div>

              <div className="search-filter-fields">
                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}>
                  <span className={selectedFilters.type.value ? 'selected-text' : ''}>{selectedFilters.type.value ? selectedFilters.type.label : translate('filter_type')}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'type' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'type' && (<div className="dropdown-list">{propertyTypes.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('type', opt); }}>{opt.label}</div>))}</div>)}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'city' ? null : 'city')}>
                  <span className={selectedFilters.city.value ? 'selected-text' : ''}>{selectedFilters.city.value ? selectedFilters.city.label : translate('filter_city')}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'city' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'city' && (<div className="dropdown-list">{cities.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('city', opt); }}>{opt.label}</div>))}</div>)}
                </div>

                <div className="filter-dropdown" onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}>
                  <span className={selectedFilters.price.value ? 'selected-text' : ''}>{selectedFilters.price.value ? selectedFilters.price.label : translate('filter_price')}</span>
                  <FiChevronDown className={`dropdown-icon ${openDropdown === 'price' ? 'rotate-icon' : ''}`} />
                  {openDropdown === 'price' && (<div className="dropdown-list">{priceRanges.map(opt => (<div key={opt.value} className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleSelect('price', opt); }}>{opt.label}</div>))}</div>)}
                </div>
              </div>

              <button className="search-submit-button" onClick={() => {
                  const params = new URLSearchParams();
                  if (searchText.trim()) params.append('search', searchText.trim());
                  if (selectedFilters.type.value) params.append('type', selectedFilters.type.value);
                  if (selectedFilters.city.value) params.append('city', selectedFilters.city.value);
                  if (selectedFilters.price.value) params.append('price', selectedFilters.price.value);
                  navigate(`/properties${params.toString() ? `?${params.toString()}` : ''}`);
                }}>
                <FiSearch className="search-btn-icon" /><span>{translate('search_btn')}</span>
              </button>
            </div>
               
            <div className="quick-actions-banner">
              <div className="quick-actions-right-side">
                <span className="section-label">{translate('quick_actions')}</span>
                <div className="actions-icons-row">
                  <div className="action-item" onClick={() => setIsAiOpen(true)} style={{ cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiZap /></div>
                    <span>{translate('ai_assistant')}</span>
                    <small>{translate('ai_assistant_desc')}</small>
                  </div>

                  <div className="action-item" onClick={handleComment} style={{ cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiMessageSquare /></div>
                    <span>{translate('add_comment')}</span>
                    <small>{translate('add_comment_desc')}</small>
                  </div>

                  <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="action-item" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
                    <div className="action-icon-circle"><FiMessageCircle /></div>
                    <span>{translate('whatsapp')}</span>
                    <small>{translate('whatsapp_desc')}</small>
                  </a>
                </div>
              </div>

              <div className="add-text-content">
                <div className="title-with-icon">
                  <div className="home-icon-small"><FiHome size={20} /></div>
                  <h3>{translate('have_property')}</h3>
                </div>
                <p>{translate('have_property_desc')}</p>
                <button className="btn-add-now" onClick={() => checkLogin("/AddProperty")}>{translate('add_now')}</button>
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
              <span className="section-badge">{translate('badge_featured')}</span>
              <h2 className="section-title">{translate('properties_title')}</h2>
              <p className="section-desc">{translate('properties_desc')}</p>
            </motion.div>
            <Link to="/properties" className="view-all-btn">{translate('view_all')} <FiArrowLeft /></Link>
          </div>

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

          {!loadingProperties && featuredProperties.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
              <FiHome size={48} style={{ marginBottom: 16, color: "#444" }} />
              <p>{translate('no_properties')}</p>
              <Link to="/properties" className="view-all-btn" style={{ marginTop: '16', display: 'inline-flex' }}>{translate('browse_all')}</Link>
            </div>
          )}

          {!loadingProperties && featuredProperties.length > 0 && (
            <div className="properties-grid">
              {featuredProperties.map((property, index) => (
                <Link to={`/property/${property.id}`} key={property.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div className="property-card" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}>
                    <div className="property-image-container">
                      <img src={property.image} alt={property.title} onError={(e) => { e.target.src = "./default-property.jpg"; }} />
                      <div className="property-image-overlay">
                        <span className="property-type-badge">{property.type}</span>
                        {property.featured && <span className="property-featured-badge">{translate('featured_badge')}</span>}
                      </div>
                      <button className={`fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => { e.preventDefault(); toggleFavorite(e, property.id); }}><FiHeart /></button>
                    </div>
                    <div className="property-info">
                      <div className="property-price-row"><span className="property-price">{property.price}</span></div>
                      <h3 className="property-title">{property.title}</h3>
                      <p className="property-location"><FiMapPin /> {property.location}</p>
                      <div className="property-details-row">
                        {property.beds > 0 && (<div className="property-detail-item"><span>{translate('rooms')}</span><strong>{property.beds}</strong></div>)}
                        {property.baths > 0 && (<div className="property-detail-item"><span>{translate('baths')}</span><strong>{property.baths}</strong></div>)}
                        <div className="property-detail-item"><span>{translate('area')}</span><strong>{property.area}</strong></div>
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
            <span className="section-badge">{translate('badge_services')}</span>
            <h2 className="section-title">{translate('services_title')}</h2>
            <p className="section-desc">{translate('services_desc')}</p>
          </motion.div>

          <div className="services-carousel-wrapper">
            <button className="unified-arrow left-arrow" onClick={() => scrollServices(-330)}><FiArrowLeft /></button>
            <div className="services-carousel-track" ref={servicesRef}>
              {services.map((service, index) => (
                <motion.div key={index} className="service-card-carousel" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
                  <div className="service-icon">{service.icon}</div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-desc">{service.desc}</p>
                </motion.div>
              ))}
            </div>
            <Link to="/services" className="view-all-services-btn">{translate('view_all_services')} <FiArrowLeft /></Link>
            <button className="unified-arrow right-arrow" onClick={() => scrollServices(330)}><FiArrowRight /></button>
          </div>
        </div>
      </section>

      {/* === 5. آراء العملاء والتعليقات === */}
      <div id="comments-section" className="testimonials-carousel-container">
        <motion.div className="section-header-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="section-badge">{translate('badge_testimonials')}</span>
          <h2 className="section-title">{translate('testimonials_title')}</h2>
          <p className="section-desc">{translate('testimonials_desc')}</p>
        </motion.div>
        
        <div className="unified-carousel-wrapper">
          <button className="unified-arrow left-arrow" onClick={() => scrollComments(-320)}><FiArrowLeft /></button>
          <div className="unified-carousel-track" ref={commentsRef}>
            <div className="unified-card add-comment-card">
              <h4 style={{ color: '#f1c991', marginBottom: '15px' }}>{translate('add_your_comment')}</h4>
              {currentUser?.email ? (
                <p style={{ fontSize: '13px', color: '#4caf50', marginBottom: '12px' }}>
                  {translate('welcome_user')} {currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0]}
                </p>
              ) : (
                <p style={{ fontSize: '13px', color: '#888', marginBottom: '12px' }}>
                  {translate('login_to_comment_1')} <span style={{ color: '#f1c991', cursor: 'pointer' }} onClick={() => setIsAuthOpen(true)}>{translate('login_to_comment_2')}</span> {translate('login_to_comment_3')}
                </p>
              )}

              <div className="star-rating-selector">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} className={star <= commentRating ? "star-filled active-star" : "star-empty"} onClick={() => setCommentRating(star)} />
                ))}
              </div>

              <form className="unified-comment-form" onSubmit={handleAddComment}>
                <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder={currentUser?.email ? translate('write_comment') : translate('login_first')} disabled={!currentUser?.email} />
                <button type="submit" disabled={!currentUser?.email}>{translate('send')}</button>
              </form>
            </div>

            {comments.map((c) => (
              <div key={c.id} className="unified-card user-comment-card">
                {c.rating > 0 && (<div className="unified-stars">{[...Array(5)].map((_, i) => (<FiStar key={i} className={i < c.rating ? "star-filled" : "star-empty"} />))}</div>)}
                <div className="unified-header">
                  <div className="author-avatar-sm">{c.author?.charAt(0) || "?"}</div>
                  <div><span className="comment-author">{c.author}</span><span className="comment-time">{c.time}</span></div>
                </div>
                <p className="unified-text">{c.text}</p>
              </div>
            ))}

            {testimonials.map((item, index) => ( // <-- تم تغيير (t) إلى (item) هنا
              <div key={`t-${index}`} className="unified-card">
                <div className="unified-stars">{[...Array(5)].map((_, i) => (<FiStar key={i} className={i < item.rating ? "star-filled" : "star-empty"} />))}</div>
                <div className="unified-header">
                  <div className="author-avatar-sm">{item.name.charAt(0)}</div>
                  <div><span className="comment-author">{item.name}</span><span className="comment-time">{item.role}</span></div>
                </div>
                <p className="unified-text">"{item.text}"</p>
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
            <h2>{translate('cta_title')}</h2>
            <p>{translate('cta_desc')}</p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={() => navigate("/properties")}><FiSearch /> {translate('cta_search')}</button>
              <button className="cta-btn-secondary" onClick={() => checkLogin("/AddProperty")}><FiUploadCloud /> {translate('cta_add_property')}</button>
              <button className="cta-btn-secondary" onClick={() => checkLogin("/AddService")}><FiUploadCloud /> {translate('cta_add_service')}</button>
            </div>
          </motion.div>
        </div>
      </section>

      {isAiOpen && <AiChat onClose={() => setIsAiOpen(false)} />}
      {isAuthOpen && (<AuthModal isOpen={isAuthOpen} onClose={() => { setIsAuthOpen(false); setPendingAction(null); }} />)}
    </div>
  );
}