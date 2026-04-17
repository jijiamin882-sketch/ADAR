import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  FiSearch, FiMapPin, FiHeart, FiChevronDown, 
  FiGrid, FiList, FiSliders
} from "react-icons/fi";
import "./Properties.css";
// استيراد supabase من الملف الذي أعددتِه
import { SupabaseClient } from "@supabase/supabase-js";

const fallbackProperties = [
  { id: 1, title: "شقة فاخرة في قلب المدينة", location: "الجلفة، حي البساتين", price: "12,500,000 دج", type: "شقة", beds: 3, baths: 2, area: "120 م²", listingType: "sale", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600" },
];

export default function Properties() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeType, setActiveType] = useState(initialType);
  const [listingType, setListingType] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // الحالة الأساسية للعقارات
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // 1. جلب البيانات من Supabase عند تحميل الصفحة
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase.from('properties').select('*');
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.log("خطأ في جلب البيانات، جاري استخدام Fallback:", error);
        setProperties(fallbackProperties);
      }
    };

    fetchProperties();

    // 2. تفعيل المزامنة اللحظية (Real-time)
    const channel = supabase
      .channel('realtime-properties')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'properties' },
        (payload) => {
          console.log('تغيير جديد وصل من صديقتك:', payload);
          
          if (payload.eventType === 'INSERT') {
            setProperties((prev) => [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setProperties((prev) => prev.map(p => p.id === payload.new.id ? payload.new : p));
          } else if (payload.eventType === 'DELETE') {
            setProperties((prev) => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // تنظيف الاتصال عند مغادرة الصفحة
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // الفلترة بناءً على الاختيارات
  const filteredProperties = properties.filter(p => {
    const matchType = activeType === 'all' || p.type === activeType;
    const matchListing = listingType === 'all' || p.listingType === listingType;
    return matchType && matchListing;
  });

  return (
    <div className="props-page-wrapper">
      <div className="props-top-filters">
        <div className="props-container">
          <div className="props-filter-row">
            <button className={`props-filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <FiSliders /> فلاتر متقدمة
            </button>
          </div>

          {showFilters && (
            <div className="props-advanced-filters">
              <div className="props-af-item">
                <label>الولاية</label>
                <select><option>الجلفة</option><option>الجزائر العاصمة</option></select>
              </div>
            </div>
          )}

          <div className="props-filters-stepped">
            <div className="props-step-1">
              <button className={`step-1-btn ${listingType === 'all' ? 'active' : ''}`} onClick={() => setListingType('all')}>الكل</button>
              <button className={`step-1-btn sale ${listingType === 'sale' ? 'active' : ''}`} onClick={() => setListingType('sale')}>للبيع</button>
              <button className={`step-1-btn rent ${listingType === 'rent' ? 'active' : ''}`} onClick={() => setListingType('rent')}>للكراء</button>
            </div>
            
            <div className={`props-step-2-wrapper ${listingType !== 'all' ? 'show' : ''}`}>
              <div className="props-step-2">
                {['all', 'شقة', 'فيلا', 'محل تجاري', 'أرض'].map(t => (
                  <button key={t} className={`step-2-btn ${activeType === t ? 'active' : ''}`} onClick={() => setActiveType(t)}>
                    {t === 'all' ? 'الكل' : t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="props-container props-results-section">
        <div className="props-results-header">
          <p>تم العثور على <strong>{filteredProperties.length}</strong> عقار</p>
          <div className="props-view-toggles">
            <FiGrid className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} />
            <FiList className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} />
          </div>
        </div>

        <div className={`props-grid ${viewMode === 'list' ? 'props-list-view' : ''}`}>
          {filteredProperties.map(property => (
            <Link key={property.id} to={`/property/${property.id}`} className="props-card">
              <div className="props-card-image">
                <img src={property.image || 'https://via.placeholder.com/300'} alt={property.title} />
                <span className="props-card-type">{property.type}</span>
                <button className={`props-fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)}>
                  <FiHeart />
                </button>
              </div>
              <div className="props-card-content">
                <div className="props-card-price">{property.price}</div>
                <h3 className="props-card-title">{property.title}</h3>
                <p className="props-card-location"><FiMapPin size={14} /> {property.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}