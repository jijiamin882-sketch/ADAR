import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiMapPin, FiHeart, FiGrid, FiList, FiSliders, FiEdit3, FiTrash2, FiShield } from "react-icons/fi";
import "./Properties.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

export default function Properties() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';

  const { currentUser } = useAuth();
  const isMine = searchParams.get('mine') === 'true';

  const [activeType, setActiveType] = useState(initialType);
  const [listingType, setListingType] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase.from('properties').select('*');
        if (isMine && currentUser) {
          query = query.eq('user_id', currentUser.id);
        }
        // ✅ إذا كان الزائر العادي (ليس في صفحة عقاراتي)، أعرض المفعّل فقط
        if (!isMine) {
          query = query.eq('status', 'active');
        }

        // إذا كان في صفحة "عقاراتي"، أعرض كل عقاراته (بغض النظر عن الحالة)
        if (isMine && currentUser) {
          query = query.eq('user_id', currentUser.id);
        }
        const { data, error } = await query;
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.log("خطأ في جلب البيانات:", error);
        setProperties([]);
      }
    };

    const fetchMyFavorites = async () => {
      if (!currentUser) return;
      const { data } = await supabase.from('favorites').select('property_id').eq('user_id', currentUser.id);
      if (data) {
        setFavorites(data.map(fav => fav.property_id));
      }
    };

    fetchProperties();
    fetchMyFavorites();

    const channel = supabase
      .channel('realtime-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          if (!isMine || payload.new.user_id === currentUser?.id) {
            setProperties((prev) => [...prev, payload.new]);
          }
        } else if (payload.eventType === 'UPDATE') {
          setProperties((prev) => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
          setProperties((prev) => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isMine, currentUser?.id]);

  const toggleFavorite = async (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (!currentUser) {
      alert("يجب عليك تسجيل الدخول أولاً لحفظ العقار ❤️");
      return;
    }
    const isCurrentlyFav = favorites.includes(id);
    setFavorites(prev => isCurrentlyFav ? prev.filter(f => f !== id) : [...prev, id]);

    if (isCurrentlyFav) {
      await supabase.from('favorites').delete().eq('property_id', id).eq('user_id', currentUser.id);
    } else {
      await supabase.from('favorites').insert([{ property_id: id, user_id: currentUser.id }]);
    }
  };

  const handleDelete = async (e, propertyId) => {
    alert("هل وصلنا للحذف الجديد؟");
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("هل أنت متأكد من حذف هذا العقار نهائياً؟")) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      const { error } = await supabase.from('properties').delete().eq('id', propertyId);
      if (error) {
        console.error("خطأ الحذف:", error.message);
        alert("لم يتم الحذف: " + error.message);
      }
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchType = activeType === 'all' || p.type === activeType;
    const matchListing = listingType === 'all' || p.listing_type === listingType;
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
              <div className="props-af-item">
                <label>السعر (دج)</label>
                <select><option>50000000</option><option>3000000000</option></select>
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
          <p>
            {isMine ? (
              <>عقاراتي الخاصة: <strong>{filteredProperties.length}</strong> عقار</>
            ) : (
              <>تم العثور على <strong>{filteredProperties.length}</strong> عقار</>
            )}
          </p>
          <div className="props-view-toggles">
            <FiGrid className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} />
            <FiList className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} />
          </div>
        </div>

        {isMine && filteredProperties.length === 0 && (
          <div style={{textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px'}}>
            <h2 style={{marginBottom: '10px'}}>لم تقم بإضافة أي عقارات بعد</h2>
            <Link to="/AddProperty" style={{padding: '10px 20px', background: '#007bff', color: '#fff', borderRadius: '8px', textDecoration: 'none'}}>أضف عقارك الأول</Link>
          </div>
        )}

        <div className={`props-grid ${viewMode === 'list' ? 'props-list-view' : ''}`}>
          {filteredProperties.map(property => (
            <Link key={property.id} to={`/property/${property.id}`} className="props-card">
                             <div className="props-card-image">
                {/* ✅ حماية الصور */}
                <img 
                  src={property.image || 'https://placehold.co/300x200/1a1a2e/ffffff?text=عقار'} 
                  alt={property.title} 
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://placehold.co/300x200/1a1a2e/ffffff?text=عقار'; }}
                />
                
                {/* شارة نوع العقار (تكون في مكانها الافتراضي) */}
                <span className="props-card-type">{property.type}</span>


                {/* زر المفضلة يبقى في الأعلى كالمعتاد */}
                <button className={`props-fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)}>
                  <FiHeart />
                </button>
              </div>
                             <div className="props-card-content">
                <div className="props-card-price">{property.price} دج</div>
                <h3 className="props-card-title">{property.title}</h3>
                <p className="props-card-location"><FiMapPin size={14} /> {property.location}</p>
                
                {/* أزرار التعديل والحذف تظهر فقط في صفحة "عقاراتي" */}
                {isMine && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      className="props-fav-btn" 
                      style={{color: '#007bff', background: '#e6f2ff'}}
                      onClick={(e) => {
                        e.preventDefault(); 
                        e.stopPropagation();
                      }}
                    >
                      <FiEdit3 /> تعديل
                    </button>
                    <button 
                      className="props-fav-btn" 
                      style={{color: '#dc3545', background: '#ffe6e9'}}
                      onClick={(e) => handleDelete(e, property.id)}
                    >
                      <FiTrash2 /> حذف
                    </button>
                  </div>
                )}

                {/* ✅ الشارات في أسفل البطاقة */}
                                 {/* الموقع والشارات معاً في سطر واحد */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginTop: '8px'
                }}>
                  <p className="props-card-location" style={{ margin: 0 }}>
                    <FiMapPin size={14} /> {property.location}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {property.owner_id_number && (
                      <span style={{
                        background: '#f4b357', color: 'black', 
                        padding: '2px 8px', borderRadius: '20px', 
                        fontSize: '11px', fontWeight: '600', 
                        display: 'flex', alignItems: 'center', gap: '3px'
                      }}>
                        <FiShield size={11} /> موثق
                      </span>
                    )}
                    <span style={{
                      background: '#0a8a1d', color: '#2563eb', 
                      padding: '2px 8px', borderRadius: '20px', 
                      fontSize: '11px', fontWeight: '600', color: 'white'
                    }}>
                      {property.status === 'active' ? 'مفعّل  ' : 'معلّق  '}
                    </span>
                  </div>
                </div>
                  
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}