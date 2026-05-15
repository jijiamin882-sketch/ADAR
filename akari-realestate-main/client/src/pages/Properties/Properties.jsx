import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiMapPin, FiHeart, FiGrid, FiList, FiSliders, FiEdit3, FiTrash2, FiShield, FiX } from "react-icons/fi";
import "./Properties.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

export default function Properties() {
  const [searchParams] = useSearchParams();
   
  const typeMap = {
    'apartment': 'شقة', 'villa': 'فيلا', 'house': 'منزل',
    'land': 'أرض', 'commercial': 'محل تجاري'
  };

  const cityMap = {
    'djelfa': 'الجلفة', 'tmsilt': 'تسمسيلت',
    'algiers': 'الجزائر العاصمة', 'oran': 'وهران'
  };

  const initialType = typeMap[searchParams.get('type')] || 'all';
  const filterCity = cityMap[searchParams.get('city')] || null;
  const filterPrice = searchParams.get('price');
  const filterSearch = searchParams.get('search');

  const { currentUser } = useAuth();
  const isMine = searchParams.get('mine') === 'true';
   
  const [activeType, setActiveType] = useState(initialType);
  const [listingType, setListingType] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [properties, setProperties] = useState([]);

  // === حالات الفلاتر المتقدمة الجديدة ===
  const [advCity, setAdvCity] = useState('all');
  const [advPrice, setAdvPrice] = useState('all');
  const [advBedrooms, setAdvBedrooms] = useState('all');
  const [advArea, setAdvArea] = useState('all');

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        let query = supabase.from('properties').select('*');
        
        if (isMine && currentUser) {
          query = query.eq('user_id', currentUser.id);
        } else {
          query = query.eq('status', 'active');
        }

        if (filterCity) {
          query = query.eq('city', filterCity); 
        }

        if (filterPrice === '0-500000') {
          query = query.lte('price', 500000);
        } else if (filterPrice === '500000-1000000') {
          query = query.gte('price', 500000).lte('price', 1000000);
        } else if (filterPrice === '1000000-3000000') {
          query = query.gte('price', 1000000).lte('price', 3000000);
        } else if (filterPrice === '3000000-plus') {
          query = query.gte('price', 3000000);
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
      if (data) setFavorites(data.map(fav => fav.property_id));
    };

    fetchProperties();
    fetchMyFavorites();

    const channel = supabase
      .channel('realtime-properties')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          if (!isMine || payload.new.user_id === currentUser?.id) setProperties((prev) => [...prev, payload.new]);
        } else if (payload.eventType === 'UPDATE') {
          setProperties((prev) => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
          setProperties((prev) => prev.filter(p => p.id !== payload.old.id));
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isMine, currentUser?.id, filterCity, filterSearch, filterPrice]);

  const toggleFavorite = async (e, id) => {
    e.stopPropagation(); e.preventDefault();
    if (!currentUser) { alert("يجب عليك تسجيل الدخول أولاً لحفظ العقار ❤️"); return; }
    const isCurrentlyFav = favorites.includes(id);
    setFavorites(prev => isCurrentlyFav ? prev.filter(f => f !== id) : [...prev, id]);
    if (isCurrentlyFav) {
      await supabase.from('favorites').delete().eq('property_id', id).eq('user_id', currentUser.id);
    } else {
      await supabase.from('favorites').insert([{ property_id: id, user_id: currentUser.id }]);
    }
  };

  const handleDelete = async (e, propertyId) => {
    e.preventDefault(); e.stopPropagation();
    if (window.confirm("هل أنت متأكد من حذف هذا العقار نهائياً؟")) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      const { error } = await supabase.from('properties').delete().eq('id', propertyId);
      if (error) { console.error("خطأ الحذف:", error.message); alert("لم يتم الحذف: " + error.message); }
    }
  };

  // دالة مسح الفلاتر المتقدمة
  const clearAdvancedFilters = () => {
    setAdvCity('all');
    setAdvPrice('all');
    setAdvBedrooms('all');
    setAdvArea('all');
  };

  // ==========================================
  // === نظام البحث الذكي السحري للعربية ===
  // ==========================================
  const normalizeArabic = (text) => {
    if (!text) return "";
    return text.toString().replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
  };
  
  const realEstateMap = {
    'فلل': ['فيلا'], 'فيلا': ['فلل'], 'منازل': ['منزل'], 'منزل': ['منازل'],
    'اراضي': ['ارض', 'أرض'], 'ارض': ['اراضي'], 'أرض': ['اراضي'],
    'محلات': ['محل'], 'محل': ['محلات'], 'شقق': ['شقة'], 'شقة': ['شقق'],
    'عمارات': ['عمارة'], 'عمارة': ['عمارات'], 'مستودعات': ['مستودع'], 'مستودع': ['مستودعات'],
  };
     
  const extractRoot = (word) => {
    if (!word || word.length <= 2) return [word];
    let w = normalizeArabic(word);
    let roots = [w];
    if (w.length >= 3) roots.push(w.slice(0, -1)); 
    if (w.length >= 4) roots.push(w.slice(0, -2));
    if (w.endsWith("ات")) { roots.push(w.slice(0, -2), w.slice(0, -2) + "ه"); }
    if (w.endsWith("ون") || w.endsWith("ين")) { roots.push(w.slice(0, -2)); }
    return [...new Set(roots)];
  };

  const isSmartMatch = (searchWord, dbText) => {
    const nSearch = normalizeArabic(searchWord);
    const nText = normalizeArabic(dbText);
    if (nText.includes(nSearch)) return true;

    let searchVariations = extractRoot(nSearch);
    if (realEstateMap[nSearch]) {
      searchVariations = searchVariations.concat(realEstateMap[nSearch]);
      realEstateMap[nSearch].forEach(syn => {
        searchVariations = searchVariations.concat(extractRoot(normalizeArabic(syn)));
      });
    }
    searchVariations = [...new Set(searchVariations)];

    const dbWords = nText.split(/\s+/);
    return dbWords.some(dbWord => {
      let dbVariations = extractRoot(dbWord);
      if (realEstateMap[dbWord]) {
        dbVariations = dbVariations.concat(realEstateMap[dbWord]);
        realEstateMap[dbWord].forEach(syn => {
          dbVariations = dbVariations.concat(extractRoot(normalizeArabic(syn)));
        });
      }
      dbVariations = [...new Set(dbVariations)];
      return searchVariations.some(sv => dbVariations.includes(sv));
    });
  };

  // ==========================================
  // === الفلتر النهائي (يشمل المتقدم والأساسي) ===
  // ==========================================
  const filteredProperties = properties.filter(p => {
    // 1. الفلاتر الأساسية
    const matchType = activeType === 'all' || p.type === activeType;
    const matchListing = listingType === 'all' || p.listing_type === listingType;

    // 2. فلتر البحث النصي
    let matchSearch = true;
    if (filterSearch) {
      const searchWords = filterSearch.trim().split(/\s+/);
      const ignoredWords = ['في', 'من', 'على', 'إلى', 'عن', 'مع', 'عند', 'هذا', 'هذه', 'ولاية', 'مدينة', 'حي', 'شارع', 'طريق'];
      const importantWords = searchWords.filter(w => !ignoredWords.includes(w));
      const wordsToMatch = importantWords.length > 0 ? importantWords : searchWords;

      matchSearch = wordsToMatch.every(word => {
        return Object.values(p).some(value => {
          if (typeof value === 'string') return isSmartMatch(word, value);
          return false;
        });
      });
    }

    // === 3. الفلاتر المتقدمة الجديدة ===
    
    // فلتر المدينة المتقدم
    const matchAdvCity = advCity === 'all' || p.city === advCity || p.wilaya === advCity;

    // فلتر السعر المتقدم
    let matchAdvPrice = true;
    const propPrice = Number(p.price) || 0;
    if (advPrice === '1') matchAdvPrice = propPrice <= 500000;
    else if (advPrice === '2') matchAdvPrice = propPrice > 500000 && propPrice <= 1000000;
    else if (advPrice === '3') matchAdvPrice = propPrice > 1000000 && propPrice <= 3000000;
    else if (advPrice === '4') matchAdvPrice = propPrice > 3000000 && propPrice <= 5000000;
    else if (advPrice === '5') matchAdvPrice = propPrice > 5000000;

    // فلتر غرف النوم
    const matchAdvBedrooms = advBedrooms === 'all' || (parseInt(p.beds) || 0) >= parseInt(advBedrooms);

    // فلتر المساحة (بعض قواعد البيانات تضيف م² كنص، لذا نستخرج الأرقام فقط)
    let matchAdvArea = true;
    const areaStr = String(p.area || '').replace(/[^0-9]/g, ''); // إزالة م² والنصوص
    const propArea = parseInt(areaStr) || 0;
    if (advArea === '1') matchAdvArea = propArea > 0 && propArea <= 100;
    else if (advArea === '2') matchAdvArea = propArea > 100 && propArea <= 200;
    else if (advArea === '3') matchAdvArea = propArea > 200;

    // يجب أن تتطابق جميع الشروط
    return matchType && matchListing && matchSearch && matchAdvCity && matchAdvPrice && matchAdvBedrooms && matchAdvArea;
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

          {/* === واجهة الفلاتر المتقدمة الجديدة بالكامل === */}
          {showFilters && (
            <div className="props-advanced-filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
              
              <div className="props-af-item">
                <label>الولاية / المدينة</label>
                <select value={advCity} onChange={(e) => setAdvCity(e.target.value)}>
                  <option value="all">كل المدن</option>
                  <option value="الجلفة">الجلفة</option>
                  <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                  <option value="وهران">وهران</option>
                  <option value="تسمسيلت">تسمسيلت</option>
                  <option value="قسنطينة">قسنطينة</option>
                  <option value="عنابة">عنابة</option>
                  <option value="باتنة">باتنة</option>
                  <option value="سطيف">سطيف</option>
                  <option value="البليدة">البليدة</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>نطاق السعر (دج)</label>
                <select value={advPrice} onChange={(e) => setAdvPrice(e.target.value)}>
                  <option value="all">أي سعر</option>
                  <option value="1">أقل من 500,000</option>
                  <option value="2">500,000 - 1,000,000</option>
                  <option value="3">1,000,000 - 3,000,000</option>
                  <option value="4">3,000,000 - 5,000,000</option>
                  <option value="5">أكثر من 5,000,000</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>غرف النوم</label>
                <select value={advBedrooms} onChange={(e) => setAdvBedrooms(e.target.value)}>
                  <option value="all">الكل</option>
                  <option value="1">1 غرفة فأكثر</option>
                  <option value="2">2 غرف فأكثر</option>
                  <option value="3">3 غرف فأكثر</option>
                  <option value="4">4 غرف فأكثر</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>المساحة (م²)</label>
                <select value={advArea} onChange={(e) => setAdvArea(e.target.value)}>
                  <option value="all">أي مساحة</option>
                  <option value="1">أقل من 100 م²</option>
                  <option value="2">100 - 200 م²</option>
                  <option value="3">أكثر من 200 م²</option>
                </select>
              </div>

              {/* زر مسح الفلاتر */}
              <div className="props-af-item" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  onClick={clearAdvancedFilters}
                  style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                >
                  <FiX /> مسح الفلاتر
                </button>
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
            {isMine ? (<>عقاراتي الخاصة: <strong>{filteredProperties.length}</strong> عقار</>) : (<>تم العثور على <strong>{filteredProperties.length}</strong> عقار</>)}
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
                <img src={property.image || 'https://placehold.co/300x200/1a1a2e/ffffff?text=عقار'} alt={property.title} loading="lazy" onError={(e) => { e.target.src = 'https://placehold.co/300x200/1a1a2e/ffffff?text=عقار'; }} />
                <span className="props-card-type">{property.type}</span>
                <button className={`props-fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)}><FiHeart /></button>
              </div>
              <div className="props-card-content">
                <div className="props-card-price">{property.price} دج</div>
                <h3 className="props-card-title">{property.title}</h3>
                <p className="props-card-location"><FiMapPin size={14} /> {property.location}</p>
                
                {isMine && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="props-fav-btn" style={{color: '#007bff', background: '#e6f2ff'}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><FiEdit3 /> تعديل</button>
                    <button className="props-fav-btn" style={{color: '#dc3545', background: '#ffe6e9'}} onClick={(e) => handleDelete(e, property.id)}><FiTrash2 /> حذف</button>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <p className="props-card-location" style={{ margin: 0 }}><FiMapPin size={14} /> {property.location}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {property.owner_id_number && (<span style={{ background: '#f4b357', color: 'black', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}><FiShield size={11} /> موثق</span>)}
                    <span style={{ background: '#0a8a1d', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{property.status === 'active' ? 'مفعّل  ' : 'معلّق  '}</span>
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