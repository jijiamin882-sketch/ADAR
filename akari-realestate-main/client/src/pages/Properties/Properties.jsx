import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  FiSearch, FiMapPin, FiHeart, FiChevronDown, 
  FiGrid, FiList, FiSliders
} from "react-icons/fi";
import "./Properties.css";

const mockProperties = [
  { id: 1, title: "شقة فاخرة في قلب المدينة", location: "الجلفة، حي البساتين", price: "12,500,000 دج", type: "شقة", beds: 3, baths: 2, area: "120 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600" },
  { id: 2, title: "فيلا حديثة مع حديقة", location: "الجزائر العاصمة، باب الزوار", price: "35,000,000 دج", type: "فيلا", beds: 5, baths: 3, area: "280 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600" },
  { id: 3, title: "محل تجاري في موقع استراتيجي", location: "وهران، شارع لاربي بن مهيدي", price: "18,000,000 دج", type: "محل تجاري", beds: 0, baths: 1, area: "90 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
  { id: 4, title: "أرض سكنية قابلة للبناء", location: "الجلفة، منطقة الهضاب", price: "8,500,000 دج", type: "أرض", beds: 0, baths: 0, area: "500 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600" },
  { id: 5, title: "شقة مفروشة للكراء السنوي", location: "الجلفة، حي 20 أوت", price: "45,000 دج/شهر", type: "شقة", beds: 2, baths: 1, area: "80 م²", listingType: "rent", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600" },
  { id: 6, title: "شقة استوديو مفروشة", location: "الجزائر العاصمة، حيدرة", price: "25,000 دج/شهر", type: "شقة", beds: 1, baths: 1, area: "45 م²", listingType: "rent", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600" },
  { id: 7, title: "فيلا فاخرة للكراء", location: "الجزائر العاصمة، البليدة", price: "120,000 دج/شهر", type: "فيلا", beds: 4, baths: 3, area: "220 م²", listingType: "rent", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600" },
  { id: 8, title: "محل تجاري للكراء", location: "وهران، حي المدينة الجديدة", price: "65,000 دج/شهر", type: "محل تجاري", beds: 0, baths: 1, area: "60 م²", listingType: "rent", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
  { id: 9, title: "منزل عائلي مستقل للبيع", location: "تسمسيلت، حي 1 نوفمبر", price: "15,200,000 دج", type: "منزل", beds: 4, baths: 2, area: "200 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600" }
];

export default function Properties() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeType, setActiveType] = useState(initialType);
  const [listingType, setListingType] = useState('all');
  const [openAccordion, setOpenAccordion] = useState(null); // 'sale' أو 'rent'
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // دالة فتح/قفل الأكورديون وتغيير الفلتر
  const handleAccordionClick = (type) => {
    if (openAccordion === type) {
      setOpenAccordion(null);
      setListingType('all');
      setActiveType('all');
    } else {
      setOpenAccordion(type);
      setListingType(type);
      setActiveType('all');
    }
  };

  const filteredProperties = mockProperties.filter(p => {
    const matchType = activeType === 'all' || p.type === activeType;
    const matchListing = listingType === 'all' || p.listingType === listingType;
    return matchType && matchListing;
  });

  const typesList = [
    { key: 'all', label: 'الكل' },
    { key: 'شقة', label: 'شقق' },
    { key: 'فيلا', label: 'فيلات' },
    { key: 'محل تجاري', label: 'محلات' },
    { key: 'أرض', label: 'أراضي' },
    { key: 'منزل', label: 'منازل' }
  ];

  return (
    <div className="props-page-wrapper">
      <div className="props-top-filters">
        <div className="props-container">
          
          <div className="props-filter-row">
            <div className="props-search-box">
              <FiSearch className="props-search-icon" />
              <input type="text" placeholder="ابحث عن مدينة، حي، أو كلمة مفتاحية..." />
            </div>
            <button className={`props-filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <FiSliders /> فلاتر متقدمة
            </button>
          </div>

          {showFilters && (
            <div className="props-advanced-filters">
              <div className="props-af-item">
                <label>نطاق السعر</label>
                <select><option>الكل</option><option>أقل من 5,000,000 دج</option></select>
              </div>
              <div className="props-af-item">
                <label>عدد غرف النوم</label>
                <select><option>الكل</option><option>1</option><option>2</option><option>3+</option></select>
              </div>
              <div className="props-af-item">
                <label>المساحة (م²)</label>
                <select><option>الكل</option><option>أقل من 100</option><option>أكثر من 200</option></select>
              </div>
            </div>
          )}

          {/* ========== التصميم الجديد: أزرار البيع والكراء مع الأكورديون ========== */}
                                              {/* ========== التصميم الجديد: فلاتر متدرج وأنيق ========== */}
          <div className="props-filters-stepped">
            
            {/* الصف الأول: الهدف (كل / بيع / كراء) */}
            <div className="props-step-1">
              <button 
                className={`step-1-btn ${listingType === 'all' ? 'active' : ''}`}
                onClick={() => { setListingType('all'); setActiveType('all'); }}
              >
                الكل
              </button>
              <button 
                className={`step-1-btn sale ${listingType === 'sale' ? 'active' : ''}`}
                onClick={() => { setListingType('sale'); setActiveType('all'); }}
              >
                للبيع
              </button>
              <button 
                className={`step-1-btn rent ${listingType === 'rent' ? 'active' : ''}`}
                onClick={() => { setListingType('rent'); setActiveType('all'); }}
              >
                للكراء
              </button>
            </div>

            {/* الصف الثاني: نوع العقار (يظهر فقط إذا اخترت بيع أو كراء) */}
            <div className={`props-step-2-wrapper ${listingType !== 'all' ? 'show' : ''}`}>
              <div className="props-step-2">
                <button 
                  className={`step-2-btn ${activeType === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveType('all')}
                >
                  الكل
                </button>
                <button 
                  className={`step-2-btn ${activeType === 'شقة' ? 'active' : ''}`}
                  onClick={() => setActiveType('شقة')}
                >
                  شقق
                </button>
                <button 
                  className={`step-2-btn ${activeType === 'فيلا' ? 'active' : ''}`}
                  onClick={() => setActiveType('فيلا')}
                >
                  فيلات
                </button>
                <button 
                  className={`step-2-btn ${activeType === 'محل تجاري' ? 'active' : ''}`}
                  onClick={() => setActiveType('محل تجاري')}
                >
                  محلات
                </button>
                <button 
                  className={`step-2-btn ${activeType === 'أرض' ? 'active' : ''}`}
                  onClick={() => setActiveType('أرض')}
                >
                  أراضي
                </button>
                <button 
                  className={`step-2-btn ${activeType === 'منزل' ? 'active' : ''}`}
                  onClick={() => setActiveType('منزل')}
                >
                  منازل
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* === قسم النتائج === */}
      <div className="props-container props-results-section">
        <div className="props-results-header">
          <p>تم العثور على <strong>{filteredProperties.length}</strong> عقار</p>
          <div className="props-view-toggles">
            <FiGrid className="active" />
            <FiList />
          </div>
        </div>

        <div className="props-grid">
          {filteredProperties.map(property => (
            <Link key={property.id} to={`/property/${property.id}`} className="props-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="props-card-image">
                <img src={property.image} alt={property.title} />
                <span className="props-card-type">
                  {property.type} {property.listingType === 'sale' ? 'للبيع' : 'للكراء'}
                </span>
                <button className={`props-fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)}>
                  <FiHeart />
                </button>
              </div>
              <div className="props-card-content">
                <div className="props-card-price">{property.price}</div>
                <h3 className="props-card-title">{property.title}</h3>
                <p className="props-card-location"><FiMapPin size={14} /> {property.location}</p>
                
                <div className="props-card-details">
                  {property.beds > 0 && (
                    <div className="props-detail">
                      <span>غرف</span>
                      <strong>{property.beds}</strong>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="props-detail">
                      <span>حمامات</span>
                      <strong>{property.baths}</strong>
                    </div>
                  )}
                  <div className="props-detail">
                    <span>المساحة</span>
                    <strong>{property.area}</strong>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProperties.length > 0 && (
          <div className="props-load-more">
            <button>تحميل المزيد من العقارات</button>
          </div>
        )}
      </div>
    </div>
  );
}