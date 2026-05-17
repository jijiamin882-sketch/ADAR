import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiMapPin, FiHeart, FiGrid, FiList, FiSliders, FiEdit3, FiTrash2, FiShield, FiX } from "react-icons/fi";
import "./Properties.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next";

export default function Properties() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  
  // تم وضع النصوص داخل t() مع قيمة احتياطية عربية
  const urlToDbType = {
    'apartment': t('db_type_apartment', 'شقة'), 
    'villa': t('db_type_villa', 'فيلا'), 
    'house': t('db_type_house', 'منزل'),
    'land': t('db_type_land', 'أرض'), 
    'commercial': t('db_type_commercial', 'محل تجاري')
  };

  const urlToDbCity = {
    'djelfa': t('db_city_djelfa', 'الجلفة'), 
    'tmsilt': t('db_city_tmsilt', 'تسمسيلت'),
    'algiers': t('db_city_algiers', 'الجزائر العاصمة'), 
    'oran': t('db_city_oran', 'وهران')
  };

  const initialType = urlToDbType[searchParams.get('type')] || 'all';
  const filterCity = urlToDbCity[searchParams.get('city')] || null;
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

        if (filterCity) query = query.eq('city', filterCity); 

        if (filterPrice === '0-500000') query = query.lte('price', 500000);
        else if (filterPrice === '500000-1000000') query = query.gte('price', 500000).lte('price', 1000000);
        else if (filterPrice === '1000000-3000000') query = query.gte('price', 1000000).lte('price', 3000000);
        else if (filterPrice === '3000000-plus') query = query.gte('price', 3000000);

        const { data, error } = await query;
        if (error) throw error;
        setProperties(data || []);
      } catch (error) {
        console.log(t('props_error_fetch'), error);
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
  }, [isMine, currentUser?.id, filterCity, filterSearch, filterPrice, t]);

  const toggleFavorite = async (e, id) => {
    e.stopPropagation(); e.preventDefault();
    if (!currentUser) { alert(t('props_login_to_fav')); return; }
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
    if (window.confirm(t('props_confirm_delete'))) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      const { error } = await supabase.from('properties').delete().eq('id', propertyId);
      if (error) { console.error(t('props_error_delete'), error.message); alert(t('props_delete_failed') + error.message); }
    }
  };

  const clearAdvancedFilters = () => {
    setAdvCity('all'); setAdvPrice('all'); setAdvBedrooms('all'); setAdvArea('all');
  };

  const normalizeArabic = (text) => {
    if (!text) return "";
    return text.toString().replace(/[إأآا]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();
  };
  
  // تم ترجمة المرادفات
  const realEstateMap = {
    [t('syn_villas', 'فلل')]: [t('db_type_villa', 'فيلا')], 
    [t('db_type_villa', 'فيلا')]: [t('syn_villas', 'فلل')], 
    [t('syn_houses', 'منازل')]: [t('db_type_house', 'منزل')], 
    [t('db_type_house', 'منزل')]: [t('syn_houses', 'منازل')],
    [t('syn_lands', 'اراضي')]: [t('db_type_land', 'ارض'), t('db_type_land_hamza', 'أرض')], 
    [t('db_type_land', 'ارض')]: [t('syn_lands', 'اراضي')], 
    [t('db_type_land_hamza', 'أرض')]: [t('syn_lands', 'اراضي')],
    [t('syn_stores', 'محلات')]: [t('db_type_commercial', 'محل')], 
    [t('db_type_commercial', 'محل')]: [t('syn_stores', 'محلات')], 
    [t('syn_apartments', 'شقق')]: [t('db_type_apartment', 'شقة')], 
    [t('db_type_apartment', 'شقة')]: [t('syn_apartments', 'شقق')],
    [t('syn_buildings', 'عمارات')]: [t('syn_building', 'عمارة')], 
    [t('syn_building', 'عمارة')]: [t('syn_buildings', 'عمارات')], 
    [t('syn_warehouses', 'مستودعات')]: [t('syn_warehouse', 'مستودع')], 
    [t('syn_warehouse', 'مستودع')]: [t('syn_warehouses', 'مستودعات')],
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
      realEstateMap[nSearch].forEach(syn => { searchVariations = searchVariations.concat(extractRoot(normalizeArabic(syn))); });
    }
    searchVariations = [...new Set(searchVariations)];

    const dbWords = nText.split(/\s+/);
    return dbWords.some(dbWord => {
      let dbVariations = extractRoot(dbWord);
      if (realEstateMap[dbWord]) {
        dbVariations = dbVariations.concat(realEstateMap[dbWord]);
        realEstateMap[dbWord].forEach(syn => { dbVariations = dbVariations.concat(extractRoot(normalizeArabic(syn))); });
      }
      dbVariations = [...new Set(dbVariations)];
      return searchVariations.some(sv => dbVariations.includes(sv));
    });
  };

  // تم ترجمة الكلمات المحذوفة في البحث
  const ignoredWords = [
    t('ignore_in', 'في'), t('ignore_from', 'من'), t('ignore_on', 'على'), 
    t('ignore_to', 'إلى'), t('ignore_about', 'عن'), t('ignore_with', 'مع'), 
    t('ignore_at', 'عند'), t('ignore_this_m', 'هذا'), t('ignore_this_f', 'هذه'), 
    t('ignore_wilaya', 'ولاية'), t('ignore_city', 'مدينة'), t('ignore_neighborhood', 'حي'), 
    t('ignore_street', 'شارع'), t('ignore_road', 'طريق'), 
    'in', 'from', 'on', 'to', 'at'
  ];

  const filteredProperties = properties.filter(p => {
    const matchType = activeType === 'all' || p.type === activeType;
    const matchListing = listingType === 'all' || p.listing_type === listingType;

    let matchSearch = true;
    if (filterSearch) {
      const searchWords = filterSearch.trim().split(/\s+/);
      const importantWords = searchWords.filter(w => !ignoredWords.includes(w));
      const wordsToMatch = importantWords.length > 0 ? importantWords : searchWords;

      matchSearch = wordsToMatch.every(word => {
        return Object.values(p).some(value => {
          if (typeof value === 'string') return isSmartMatch(word, value);
          return false;
        });
      });
    }

    const matchAdvCity = advCity === 'all' || p.city === advCity || p.wilaya === advCity;

    let matchAdvPrice = true;
    const propPrice = Number(p.price) || 0;
    if (advPrice === '1') matchAdvPrice = propPrice <= 500000;
    else if (advPrice === '2') matchAdvPrice = propPrice > 500000 && propPrice <= 1000000;
    else if (advPrice === '3') matchAdvPrice = propPrice > 1000000 && propPrice <= 3000000;
    else if (advPrice === '4') matchAdvPrice = propPrice > 3000000 && propPrice <= 5000000;
    else if (advPrice === '5') matchAdvPrice = propPrice > 5000000;

    const matchAdvBedrooms = advBedrooms === 'all' || (parseInt(p.beds) || 0) >= parseInt(advBedrooms);

    let matchAdvArea = true;
    const areaStr = String(p.area || '').replace(/[^0-9]/g, ''); 
    const propArea = parseInt(areaStr) || 0;
    if (advArea === '1') matchAdvArea = propArea > 0 && propArea <= 100;
    else if (advArea === '2') matchAdvArea = propArea > 100 && propArea <= 200;
    else if (advArea === '3') matchAdvArea = propArea > 200;

    return matchType && matchListing && matchSearch && matchAdvCity && matchAdvPrice && matchAdvBedrooms && matchAdvArea;
  });

  const listingOptions = [
    { value: 'all', label: t('props_filter_all') },
    { value: 'sale', label: t('props_listing_sale') },
    { value: 'rent', label: t('props_listing_rent') }
  ];

  // تم توحيد الأنواع لتستخدم t()
  const typeOptions = [
    { value: 'all', label: t('props_filter_all') },
    { value: t('db_type_apartment', 'شقة'), label: t('props_type_apartment') },
    { value: t('db_type_villa', 'فيلا'), label: t('props_type_villa') },
    { value: t('db_type_commercial', 'محل تجاري'), label: t('props_type_commercial') },
    { value: t('db_type_land', 'أرض'), label: t('props_type_land') }
  ];

  return (
    <div className="props-page-wrapper">
      <div className="props-top-filters">
        <div className="props-container">
          <div className="props-filter-row">
            <button className={`props-filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <FiSliders /> {t('props_filter_advanced')}
            </button>
          </div>

          {showFilters && (
            <div className="props-advanced-filters" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', padding: '20px', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginTop: '10px' }}>
              
              <div className="props-af-item">
                <label>{t('props_filter_city')}</label>
                <select value={advCity} onChange={(e) => setAdvCity(e.target.value)}>
                  <option value="all">{t('props_filter_all_cities')}</option>
                  <option value={t('db_city_djelfa', 'الجلفة')}>{t('props_city_djelfa')}</option>
                  <option value={t('db_city_algiers', 'الجزائر العاصمة')}>{t('props_city_algiers')}</option>
                  <option value={t('db_city_oran', 'وهران')}>{t('props_city_oran')}</option>
                  <option value={t('db_city_tmsilt', 'تسمسيلت')}>{t('props_city_tissemsilt')}</option>
                  <option value={t('db_city_constantine', 'قسنطينة')}>{t('props_city_constantine')}</option>
                  <option value={t('db_city_annaba', 'عنابة')}>{t('props_city_annaba')}</option>
                  <option value={t('db_city_batna', 'باتنة')}>{t('props_city_batna')}</option>
                  <option value={t('db_city_setif', 'سطيف')}>{t('props_city_setif')}</option>
                  <option value={t('db_city_blida', 'البليدة')}>{t('props_city_blida')}</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>{t('props_filter_price_range')}</label>
                <select value={advPrice} onChange={(e) => setAdvPrice(e.target.value)}>
                  <option value="all">{t('props_filter_any_price')}</option>
                  <option value="1">{t('props_price_under_500k')}</option>
                  <option value="2">{t('props_price_500k_to_1m')}</option>
                  <option value="3">{t('props_price_1m_to_3m')}</option>
                  <option value="4">{t('props_price_3m_to_5m')}</option>
                  <option value="5">{t('props_price_over_5m')}</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>{t('props_filter_bedrooms')}</label>
                <select value={advBedrooms} onChange={(e) => setAdvBedrooms(e.target.value)}>
                  <option value="all">{t('props_filter_all')}</option>
                  <option value="1">{t('props_bedrooms_min', { count: 1 })}</option>
                  <option value="2">{t('props_bedrooms_min', { count: 2 })}</option>
                  <option value="3">{t('props_bedrooms_min', { count: 3 })}</option>
                  <option value="4">{t('props_bedrooms_min', { count: 4 })}</option>
                </select>
              </div>

              <div className="props-af-item">
                <label>{t('props_filter_area')}</label>
                <select value={advArea} onChange={(e) => setAdvArea(e.target.value)}>
                  <option value="all">{t('props_filter_any_area')}</option>
                  <option value="1">{t('props_area_under_100')}</option>
                  <option value="2">{t('props_area_100_to_200')}</option>
                  <option value="3">{t('props_area_over_200')}</option>
                </select>
              </div>

              <div className="props-af-item" style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  onClick={clearAdvancedFilters}
                  style={{ width: '100%', padding: '10px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                >
                  <FiX /> {t('props_filter_clear')}
                </button>
              </div>
            </div>
          )}

          <div className="props-filters-stepped">
            <div className="props-step-1">
              {listingOptions.map(opt => (
                <button key={opt.value} className={`step-1-btn ${listingType === opt.value ? 'active' : ''}`} onClick={() => setListingType(opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
            
            <div className={`props-step-2-wrapper ${listingType !== 'all' ? 'show' : ''}`}>
              <div className="props-step-2">
                {typeOptions.map(opt => (
                  <button key={opt.value} className={`step-2-btn ${activeType === opt.value ? 'active' : ''}`} onClick={() => setActiveType(opt.value)}>
                    {opt.label}
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
            <p>
             {isMine 
               ? <>{t('props_my_properties')} (<strong>{filteredProperties.length}</strong>)</>
               : <>{t('props_found')} <strong>{filteredProperties.length}</strong> {t('props_property_word')}</>
              }
            </p>
          </p>
          <div className="props-view-toggles">
            <FiGrid className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} />
            <FiList className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} />
          </div>
        </div>

        {isMine && filteredProperties.length === 0 && (
          <div style={{textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '12px'}}>
            <h2 style={{marginBottom: '10px'}}>{t('props_empty_title')}</h2>
            <Link to="/AddProperty" style={{padding: '10px 20px', background: '#007bff', color: '#fff', borderRadius: '8px', textDecoration: 'none'}}>{t('props_empty_btn')}</Link>
          </div>
        )}

        <div className={`props-grid ${viewMode === 'list' ? 'props-list-view' : ''}`}>
          {filteredProperties.map(property => (
            <Link key={property.id} to={`/property/${property.id}`} className="props-card">
              <div className="props-card-image">
                <img src={property.image || `https://placehold.co/300x200/1a1a2e/ffffff?text=${t('props_placeholder_img')}`} alt={property.title} loading="lazy" onError={(e) => { e.target.src = `https://placehold.co/300x200/1a1a2e/ffffff?text=${t('props_placeholder_img')}`; }} />
                <span className="props-card-type">{property.type}</span>
                <button className={`props-fav-btn ${favorites.includes(property.id) ? 'fav-active' : ''}`} onClick={(e) => toggleFavorite(e, property.id)}><FiHeart /></button>
              </div>
              <div className="props-card-content">
                <div className="props-card-price">{property.price} {t('props_currency')}</div>
                <h3 className="props-card-title">{property.title}</h3>
                
                {isMine && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="props-fav-btn" style={{color: '#007bff', background: '#e6f2ff'}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}><FiEdit3 /> {t('props_edit')}</button>
                    <button className="props-fav-btn" style={{color: '#dc3545', background: '#ffe6e9'}} onClick={(e) => handleDelete(e, property.id)}><FiTrash2 /> {t('props_delete')}</button>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <p className="props-card-location" style={{ margin: 0 }}><FiMapPin size={14} /> {property.location}</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {property.owner_id_number && (<span style={{ background: '#f4b357', color: 'black', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '3px' }}><FiShield size={11} /> {t('props_verified')}</span>)}
                    <span style={{ background: property.status === 'active' ? '#0a8a1d' : '#dc3545', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' }}>{property.status === 'active' ? t('props_active') : t('props_inactive')}</span>
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