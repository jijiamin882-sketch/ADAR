import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../context/AuthContext";
import { 
  FiMapPin, FiHeart, FiShare2, FiPhone, FiMessageCircle, 
  FiHome, FiArrowLeft, FiChevronLeft, FiChevronRight, 
  FiDroplet , FiMaximize, FiCheckCircle, FiEdit3, FiTrash2, FiShield, FiLock,
  FiPlus, FiBook, FiAward, FiShoppingCart, FiTruck, FiSun, FiNavigation
} from 'react-icons/fi';  
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";
import { supabase } from "../../supabaseClient"; 
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

// إصلاح أيقونة الماركر الافتراضية في Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const amenitiesIconMap = {
  hospital: FiPlus, school: FiBook, university: FiAward, market: FiShoppingCart,
  mosque: FiMapPin, transport: FiTruck, park: FiSun, road: FiNavigation
};

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const { t } = useTranslation(); // <-- 2. تعريف دالة الترجمة
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [mapCoords, setMapCoords] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
   
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  const isOwner = currentUser && property && currentUser.id === property.user_id;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
        if (error) throw error;
        setProperty(data);
        setEditData(data); 
      } catch (error) {
        console.error("Error:", error);
        alert(t('err_not_found'));
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!currentUser?.id) return;
      const { data } = await supabase.from('favorites').select('id').eq('property_id', id).eq('user_id', currentUser.id);
      if (data && data.length > 0) setIsFav(true);
    };
    checkFavorite();
  }, [currentUser?.id, id]);
  
  useEffect(() => {
    if (!property?.location) return;
    const fetchCoords = async () => {
      setMapLoading(true);
      try {
        const query = encodeURIComponent(property.location);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
        const data = await response.json();
        if (data && data.length > 0) {
          setMapCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setMapCoords([36.19, 3.05]);
        }
      } catch (error) {
        setMapCoords([36.19, 3.05]);
      } finally {
        setMapLoading(false);
      }
    };
    fetchCoords();
  }, [property?.location]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from('properties').update({
      title: editData.title, price: editData.price, description: editData.description, location: editData.location
    }).eq('id', id);

    if (!error) {
      setProperty(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
      alert(t('err_update_success'));
    } else {
      alert(t('err_update_fail') + error.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm(t('err_delete_confirm'))) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) { alert(t('err_delete_success')); navigate('/properties'); }
      else { alert(t('err_delete_fail') + error.message); }
    }
  };

  const handleShare = async () => {
    const shareData = { title: property.title, text: `${t('share_prefix')}: ${property.title} - ${t('share_price')}: ${property.price}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) {}
    } else {
      try { await navigator.clipboard.writeText(window.location.href); alert(t('err_copy_success')); } catch (err) { alert(t('err_copy_fail')); }
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) { alert(t('err_login_fav')); return; }
    setFavLoading(true);
    if (isFav) {
      const { error } = await supabase.from('favorites').delete().eq('property_id', id).eq('user_id', currentUser.id);
      if (!error) setIsFav(false);
    } else {
      const { error } = await supabase.from('favorites').insert({ property_id: id, user_id: currentUser.id });
      if (!error) setIsFav(true);
    }
    setFavLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (phoneError) return;
    if (contactForm.message.length < 10) { alert(t('err_msg_short')); return; }
    if (!contactForm.name || !contactForm.phone || !contactForm.message) { alert(t('err_msg_empty')); return; }

    setSendingMsg(true);
    const { error } = await supabase.from('messages').insert([{
      property_id: id, sender_name: contactForm.name, sender_phone: contactForm.phone, message_text: contactForm.message
    }]);

    if (!error) { setMsgSent(true); setContactForm({ name: '', phone: '', message: '' }); }
    else { alert(t('err_send_fail')); }
    setSendingMsg(false);
  };

  const getValidImages = () => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const validImgs = property.images.filter(img => img && img.startsWith('http'));
      if (validImgs.length > 0) return validImgs;
    }
    if (property?.image && property.image.startsWith('http')) return [property.image];
    return ['https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image'];
  };

  const imagesList = getValidImages();
  const nextImg = () => setActiveImg(prev => (prev + 1) % imagesList.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + imagesList.length) % imagesList.length);

  if (loading) return <div style={{textAlign: 'center', padding: '50px', fontSize: '20px'}}>{t('pd_loading')}</div>;

  return (
    <div className="pd-wrapper">
      {/* === أعلى الصفحة === */}
      <div className="pd-top-section">
        <div className="pd-container">
          <Link to="/properties" className="pd-back-btn">
            <FiArrowLeft /> {t('pd_back')}
          </Link>
          
          <div className="pd-title-row">
            <div style={{flex: 1}}>
              <div className="pd-badges">
                <span className="pd-type-badge">{property.type}</span>
                <span className="pd-for-badge">{property.listing_type === 'rent' ? t('pd_for_rent') : t('pd_for_sale')}</span>
                {property.status === 'pending_review' && (
                  <span className="pd-for-badge" style={{background: '#ffc107', color: '#000'}}>{t('pd_pending')}</span>
                )}
              </div>
              <h1>{property.title}</h1>
              <p className="pd-location"><FiMapPin /> {property.location}</p>
            </div>
            
            <div className="pd-price-actions">
              <h2 className="pd-price">{property.price}   {t('pd_currency')} </h2>
              
              <div className="pd-action-btns">
                {isOwner && (
                  <>
                    <button className="pd-action-btn" onClick={() => setIsEditing(!isEditing)} title={t('pd_edit')}>
                      <FiEdit3 /> {isEditing ? t('pd_cancel') : t('pd_edit')}
                    </button>
                    <button className="pd-action-btn" onClick={handleDelete} title={t('pd_delete')} style={{color: '#dc3545'}}>
                      <FiTrash2 /> {t('pd_delete')}
                    </button>
                  </>
                )}

                <button className={`pd-action-btn ${isFav ? 'fav' : ''}`} onClick={handleFavorite} disabled={favLoading} title={isFav ? t('pd_remove_fav') : t('pd_add_fav')}>
                 <FiHeart /> {favLoading ? '...' : (isFav ? t('pd_saved') : t('pd_save'))}
                </button>
                <button className="pd-action-btn" onClick={handleShare} title={t('pd_share')}>
                  <FiShare2 /> {t('pd_share')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === فورم التعديل === */}
      {isEditing && (
        <div className="pd-container">
          <div className="pd-section">
            <div className="edit-form-header">
              <div className="edit-icon-wrapper">✏️</div>
              <div>
                <h3 className="edit-title">{t('pd_edit_title')}</h3>
                <p className="edit-subtitle">{t('pd_edit_subtitle')}</p>
              </div>
            </div>
            <form onSubmit={handleUpdate} className="edit-form-group">
              <div className="form-group">
                <label className="edit-label">{t('pd_edit_label_title')}</label>
                <input type="text" className="edit-input" value={editData.title || ''} onChange={(e) => setEditData({...editData, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="edit-label">{t('pd_edit_label_price')}</label>
                <input type="text" className="edit-input" value={editData.price || ''} onChange={(e) => setEditData({...editData, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="edit-label">{t('pd_edit_label_loc')}</label>
                <input type="text" className="edit-input" value={editData.location || ''} onChange={(e) => setEditData({...editData, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="edit-label">{t('pd_edit_label_desc')}</label>
                <textarea className="edit-textarea" value={editData.description || ''} onChange={(e) => setEditData({...editData, description: e.target.value})} rows="5"></textarea>
              </div>
              <div className="edit-btn-wrapper">
                <button type="submit" disabled={saving} className="edit-submit-btn">
                  {saving ? (<><span className="edit-spinner"></span>{t('pd_saving')}</>) : (<>💾 {t('pd_save_btn')}</>)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pd-container pd-main-grid">
        {/* === العمود الأيسر === */}
        <div className="pd-left-col">
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img src={imagesList[activeImg]} alt={property.title} loading="lazy" onError={(e) => { e.target.src = 'https://placehold.co/600x400/1a1a2e/ffffff?text=No+Image'; }} />
              {imagesList.length > 1 && (
                <><button className="pd-img-nav prev" onClick={prevImg}><FiChevronRight /></button><button className="pd-img-nav next" onClick={nextImg}><FiChevronLeft /></button></>
              )}
              <span className="pd-img-counter">{activeImg + 1} / {imagesList.length}</span>
            </div>
            {imagesList.length > 1 && (
              <div className="pd-thumbnails">
                {imagesList.map((img, i) => (
                  <div key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt="" onError={(e) => { e.target.src = "https://placehold.co/100x100/1a1a2e/ffffff?text=..."; }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pd-quick-details">
            <div className="pd-qd-item"><FiHome className="pd-qd-icon" /><div><strong>{property.beds || 0}</strong><span>{t('pd_bedrooms')}</span></div></div>
            <div className="pd-qd-item"><FiDroplet className="pd-qd-icon" /><div><strong>{property.baths || 0}</strong><span>{t('pd_bathrooms')}</span></div></div>
            <div className="pd-qd-item"><FiMaximize className="pd-qd-icon" /><div><strong>{property.area || '-'}</strong><span>{t('pd_area')}</span></div></div>
            <div className="pd-qd-item"><FiHome className="pd-qd-icon" /><div><strong>{property.type}</strong><span>{t('pd_type_label')}</span></div></div>
          </div>

          {property.description && (
            <div className="pd-section">
              <h3>{t('pd_desc_title')}</h3>
              <p style={{whiteSpace: 'pre-wrap'}}>{property.description}</p>
            </div>
          )}

          {property.amenities && property.amenities.length > 0 && (
            <div className="pd-section">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <FiNavigation style={{ color: '#f1c991' }} /> {t('pd_amenities_title')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {property.amenities.map((am, index) => {
                  const IconComponent = amenitiesIconMap[am.type] || FiMapPin;
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'none'}>
                      <div style={{ width: '36px', height: '36px', background: '#ecfdf5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <IconComponent size={18} color="#10b981" />
                      </div>
                      <span style={{ fontSize: '14px', color: '#334155', lineHeight: '1.4' }}>
                        {t('pd_amenity_away')} <strong style={{ color: '#0f172a' }}>{am.name}</strong> {t('pd_amenity_distance')} <strong style={{ color: '#0f172a' }}>{am.distance} {am.unit}</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="pd-section">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiMapPin style={{ color: '#f1c991' }} /> {t('pd_map_title')}
            </h3>
            {mapLoading ? (
              <div style={{ height: '300px', background: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#64748b', fontSize: '15px', fontWeight: '500' }}>
                {t('pd_map_loading')}
              </div>
            ) : mapCoords ? (
              <div className="pd-map-container">
                <MapContainer center={mapCoords} zoom={14} scrollWheelZoom={false} className="pd-leaflet-map">
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={mapCoords}><Popup><strong>{property.title}</strong><br />{property.location}</Popup></Marker>
                </MapContainer>
              </div>
            ) : (
              <div style={{ height: '300px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#991b1b', fontSize: '15px' }}>
                {t('pd_map_not_found')}
              </div>
            )}
          </div>
        </div>

        {/* === العمود الأيمن === */}
        <div className="pd-right-col">
          <div className="pd-agent-card">
            <div className="pd-agent-header">
              <img src={`https://ui-avatars.com/api/?name=${property.owner_name || 'Owner'}&background=0D8ABC&color=fff&size=100`} alt={property.owner_name} className="pd-agent-img" />
              <div>
                <h4>
                  {property.owner_name || t('pd_owner_def')}
                  {property.owner_id_number && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1c991', color: '#0a0f18', padding: '2px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', marginRight: '8px', verticalAlign: 'middle' }}>
                      <FiShield size={12} /> {t('pd_verified_badge')}
                    </span>
                  )}
                </h4>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '13px',marginTop: '8px' }}>
                  <FiLock size={13} /> {t('pd_protected_by')}
                </span>
              </div>
            </div>
            
            <div className="pd-agent-actions" style={{ flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => { const form = document.querySelector('.pd-contact-form'); if(form) form.scrollIntoView({ behavior: 'smooth' }); }}
                className="pd-agent-btn primary" style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: '15px' }}>
                <FiMessageCircle /> {t('pd_contact_secure')}
              </button>
              <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                {t('pd_contact_hide_info')}
              </p>
            </div>

            <form className="pd-contact-form" onSubmit={handleSendMessage}>
              <h4>{t('pd_send_msg_title')}</h4>
              <div style={{ background: 'linear-gradient(to right, #fffbeb, #fef3c7)', border: '1px solid #fcd34d', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px', color: '#92400e', lineHeight: '1.7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '5px', color: '#b45309' }}>
                  <FiShield size={16} /> {t('pd_protection_title')}
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.8' }}>
                  <li>{t('pd_protection_1')}</li>
                  <li>{t('pd_protection_2')}</li>
                  <li>{t('pd_protection_3')}</li>
                </ul>
              </div>
              
              {msgSent ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}>
                  <h4 style={{ margin: '0 0 5px' }}>{t('pd_success_title')}</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>{t('pd_success_desc')}</p>
                </div>
              ) : (
                <>
                  <input type="text" placeholder={t('pd_name_placeholder')} required value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} />
                  <input type="tel" placeholder={t('pd_phone_placeholder')} required maxLength={10}
                    value={contactForm.phone} 
                    style={{ border: phoneError ? '1px solid #ef4444' : '1px solid #ccc', outline: 'none' , marginBottom: '15px'}}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      setContactForm({...contactForm, phone: onlyNumbers});
                      const phoneRegex = /^0[5-7][0-9]{8}$/;
                      const fakeNumbers = ['0000000000', '1111111111', '1234567890', '5555555555', '9999999999'];
                      if (onlyNumbers.length === 0) setPhoneError('');
                      else if (!phoneRegex.test(onlyNumbers)) setPhoneError(t('err_phone_format'));
                      else if (fakeNumbers.includes(onlyNumbers)) setPhoneError(t('err_phone_fake'));
                      else setPhoneError('');
                    }} 
                  />
                  {phoneError && (<span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#ef4444', marginTop: '-10px', marginBottom: '15px', fontWeight: '600' }}>⚠️ {phoneError}</span>)}
                  <textarea placeholder={t('pd_msg_placeholder')} rows="4" required value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})}></textarea>
                  <button type="submit" disabled={sendingMsg}>
                    {sendingMsg ? t('pd_sending') : t('pd_send_btn')}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}