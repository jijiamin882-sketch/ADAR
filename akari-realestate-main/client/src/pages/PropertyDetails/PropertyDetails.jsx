import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useAuth } from "../../context/AuthContext";
import { 
  FiMapPin, FiHeart, FiShare2, FiPhone, FiMessageCircle, 
  FiHome, FiArrowLeft, FiChevronLeft, FiChevronRight, 
  FiDroplet , FiMaximize, FiCheckCircle, FiEdit3, FiTrash2, FiShield, FiLock
} from 'react-icons/fi';  
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";
import { supabase } from "../../supabaseClient"; 

// إصلاح أيقونة الماركر الافتراضية في Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
   
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false); // حالة تحميل جديدة للزر
  // حالات التعديل
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
    // === حالات نموذج التواصل ===
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // === التحقق من الملكية (يوضع هنا وليس في الـ return) ===
  const isOwner = currentUser && property && currentUser.id === property.user_id;

  // جلب بيانات العقار من Supabase
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
           

        if (error) throw error;
        
        setProperty(data);
        setEditData(data); 
      } catch (error) {
        console.error("خطأ في جلب العقار:", error);
        alert("لم يتم العثور على العقار أو حدث خطأ.");
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);
    // التحقق من حالة المفضلة عند فتح الصفحة
    // التحقق من حالة المفضلة عند فتح الصفحة (الكود المصحح)
  useEffect(() => {
    const checkFavorite = async () => {
      if (!currentUser?.id) return; // تأكد من وجود الـ ID فقط
      
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('property_id', id)
        .eq('user_id', currentUser.id);
        // تمت إزالة .single() لأنها تسبب خطأ 406 إذا لم يجد شيئاً

      if (data && data.length > 0) {
        setIsFav(true);
      }
    };

    checkFavorite();
  }, [currentUser?.id, id]); // نضع IDs فقط لتجنب الحلقة اللانهائية
  // دالة التعديل
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase
      .from('properties')
      .update({
        title: editData.title,
        price: editData.price,
        description: editData.description,
        location: editData.location
      })
      .eq('id', id);

    if (!error) {
      setProperty(prev => ({ ...prev, ...editData }));
      setIsEditing(false);
      alert("تم تعديل بيانات العقار بنجاح ✅");
    } else {
      alert("حدث خطأ أثناء التعديل: " + error.message);
    }
    setSaving(false);
  };

  // دالة الحذف
    // دالة الحذف المعدلة
  const handleDelete = async () => {
    if (window.confirm("هل أنت متأكد من حذف هذا العقار نهائياً؟ لا يمكن التراجع عن هذا الإجراء.")) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (!error) {
        alert("تم حذف العقار بنجاح ✅");
        navigate('/properties');
      } else {
        // هذا السطر سيظهر لك السبب الحقيقي
        alert("حدث خطأ أثناء الحذف: " + error.message);
        console.error("تفاصيل خطأ الحذف:", error);
      }
    }
  };
    // دالة المشاركة
  const handleShare = async () => {
    const shareData = {
      title: property.title,
      text: `عقار: ${property.title} - السعر: ${property.price}`,
      url: window.location.href
    };

    // إذا كان المتصفح يدعم المشاركة الأصلية (مثل الهواتف)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("خطأ في المشاركة:", error);
      }
    } else {
      // للمتصفحات العادية (الكمبيوتر) يقوم بنسخ الرابط
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("تم نسخ رابط العقار بنجاح! 📋");
      } catch (err) {
        alert("لم يتم نسخ الرابط، يرجى نسخه من شريط العنوان.");
      }
    }
  };
    // دالة الإضافة/الحذف من المفضلة
  const handleFavorite = async () => {
    if (!currentUser) {
      alert("يجب تسجيل الدخول أولاً لحفظ العقار ❤️");
      return;
    }

    setFavLoading(true); // تفعيل حالة التحميل

    if (isFav) {
      // إزالة من المفضلة
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('property_id', id)
        .eq('user_id', currentUser.id);
        
      if (!error) setIsFav(false);
    } else {
      // إضافة للمفضلة
      const { error } = await supabase
        .from('favorites')
        .insert({ property_id: id, user_id: currentUser.id });
        
      if (!error) setIsFav(true);
    }

    setFavLoading(false); // إيقاف حالة التحميل
  };
    // === دالة إرسال رسالة للمالك ===
  const handleSendMessage = async (e) => {
    e.preventDefault();
       
    
    // ✅ إذا كانت هناك أخطاء في الهاتف، لا ترسل الرسالة
    if (phoneError) {
      return;
    }
    
    // التحقق من طول الرسالة
    if (contactForm.message.length < 10) {
      alert("يرجى كتابة رسالة واضحة (10 أحرف على الأقل).");
      return;
    }

    // ... باقي كود الإرسال ...
    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      alert("يرجى ملء جميع حقول الرسالة");
      return;
    }

    setSendingMsg(true);

    const { error } = await supabase.from('messages').insert([{
      property_id: id,
      sender_name: contactForm.name,
      sender_phone: contactForm.phone,
      message_text: contactForm.message
    }]);

    if (!error) {
      setMsgSent(true); // إظهار رسالة النجاح
      setContactForm({ name: '', phone: '', message: '' }); // مسح الحقول
    } else {
      alert("حدث خطأ أثناء إرسال الرسالة");
    }
    
    setSendingMsg(false);
  };
  // معالجة الصور
    // معالجة الصور مع حماية كاملة من الروابط الفارغة أو الخاطئة
  const getValidImages = () => {
    if (property?.images && Array.isArray(property.images) && property.images.length > 0) {
      const validImgs = property.images.filter(img => img && img.startsWith('http'));
      if (validImgs.length > 0) return validImgs;
    }

    if (property?.image && property.image.startsWith('http')) {
      return [property.image];
    }

    return ['https://placehold.co/600x400/1a1a2e/ffffff?text=لا+توجد+صورة'];
  };

  const imagesList = getValidImages();

  const nextImg = () => setActiveImg(prev => (prev + 1) % imagesList.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + imagesList.length) % imagesList.length);

  if (loading) return <div style={{textAlign: 'center', padding: '50px', fontSize: '20px'}}>جاري تحميل بيانات العقار...</div>;

  // ==========================================
  // === بدء الـ return (مكان وضع الـ HTML) ===
  // ==========================================
  return (
    <div className="pd-wrapper">
      {/* === أعلى الصفحة === */}
      <div className="pd-top-section">
        <div className="pd-container">
          <Link to="/properties" className="pd-back-btn">
            <FiArrowLeft /> العودة للعقارات
          </Link>
          
          <div className="pd-title-row">
            <div style={{flex: 1}}>
              <div className="pd-badges">
                <span className="pd-type-badge">{property.type}</span>
                <span className="pd-for-badge">{property.listing_type === 'rent' ? 'للكراء' : 'للبيع'}</span>
                {property.status === 'pending_review' && (
                  <span className="pd-for-badge" style={{background: '#ffc107', color: '#000'}}>بانتظار المراجعة</span>
                )}
              </div>
              <h1>{property.title}</h1>
              <p className="pd-location"><FiMapPin /> {property.location}</p>
            </div>
            
            <div className="pd-price-actions">
              <h2 className="pd-price">{property.price}   دج </h2>
              
              {/* ========================================== */}
              {/* === مكان الأزرار الصحيح مع شرط isOwner === */}
              {/* ========================================== */}
              <div className="pd-action-btns">
                
                {/* أزرار التعديل والحذف تظهر فقط لصاحب العقار */}
                {isOwner && (
                  <>
                    <button className="pd-action-btn" onClick={() => setIsEditing(!isEditing)} title="تعديل العقار">
                      <FiEdit3 /> {isEditing ? 'إلغاء' : 'تعديل'}
                    </button>
                    <button className="pd-action-btn" onClick={handleDelete} title="حذف العقار" style={{color: '#dc3545'}}>
                      <FiTrash2 /> حذف
                    </button>
                  </>
                )}

                {/* أزرار المفضلة والمشاركة يظهر للجميع دائماً */}
                <button 
                  className={`pd-action-btn ${isFav ? 'fav' : ''}`} onClick={handleFavorite}disabled={favLoading}
                  title={isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}>
                 <FiHeart /> {favLoading ? '...' : (isFav ? 'محفوظ' : 'حفظ')}
                </button>
                <button className="pd-action-btn" onClick={handleShare} title="مشاركة العقار">
                  <FiShare2 /> مشاركة
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
      
      {/* عنوان القسم */}
      <div className="edit-form-header">
        <div className="edit-icon-wrapper">✏️</div>
        <div>
          <h3 className="edit-title">تعديل بيانات العقار</h3>
          <p className="edit-subtitle">قم بتعديل البيانات المطلوبة ثم اضغط حفظ</p>
        </div>
      </div>

      {/* النموذج */}
      <form onSubmit={handleUpdate} className="edit-form-group">
        
        <div className="form-group">
          <label className="edit-label">عنوان الإعلان</label>
          <input 
            type="text" 
            className="edit-input"
            value={editData.title || ''} 
            onChange={(e) => setEditData({...editData, title: e.target.value})} 
            required 
            placeholder="أدخل عنوان الإعلان..."
          />
        </div>

        <div className="form-group">
          <label className="edit-label">السعر </label>
          <input 
            type="text" 
            className="edit-input"
            value={editData.price || ''} 
            onChange={(e) => setEditData({...editData, price: e.target.value})} 
            required 
            placeholder="أدخل السعر..."
          />
        </div>

        <div className="form-group">
          <label className="edit-label">العنوان / الموقع</label>
          <input 
            type="text" 
            className="edit-input"
            value={editData.location || ''} 
            onChange={(e) => setEditData({...editData, location: e.target.value})} 
            placeholder="أدخل الموقع..."
          />
        </div>

        <div className="form-group">
          <label className="edit-label">الوصف</label>
          <textarea 
            className="edit-textarea"
            value={editData.description || ''} 
            onChange={(e) => setEditData({...editData, description: e.target.value})} 
            rows="5"
            placeholder="أدخل وصف العقار..."
          ></textarea>
        </div>

        <div className="edit-btn-wrapper">
          <button 
            type="submit" 
            disabled={saving} 
            className="edit-submit-btn"
          >
            {saving ? (
              <>
                <span className="edit-spinner"></span>
                جاري الحفظ...
              </>
            ) : (
              <>💾 حفظ التعديلات</>
            )}
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
              <img src={imagesList[activeImg]} alt={property.title} 
              loading="lazy"
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x400/1a1a2e/ffffff?text=لا+توجد+صورة';
                }}
              />
              {imagesList.length > 1 && (
                <>
                  <button className="pd-img-nav prev" onClick={prevImg}><FiChevronRight /></button>
                  <button className="pd-img-nav next" onClick={nextImg}><FiChevronLeft /></button>
                </>
              )}
              <span className="pd-img-counter">{activeImg + 1} / {imagesList.length}</span>
            </div>
            {imagesList.length > 1 && (
              <div className="pd-thumbnails">
                {imagesList.map((img, i) => (
                  <div key={i} className={`pd-thumb ${i === activeImg ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                    <img src={img} alt={`صورة ${i+1}`} 
                    onError={(e) => {
                        e.target.src = "https://placehold.co/100x100/1a1a2e/ffffff?text=...";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pd-quick-details">
            <div className="pd-qd-item"><FiHome className="pd-qd-icon" /><div><strong>{property.beds || 0}</strong><span>غرف النوم</span></div></div>
            <div className="pd-qd-item"><FiDroplet className="pd-qd-icon" /><div><strong>{property.baths || 0}</strong><span>الحمامات</span></div></div>
            <div className="pd-qd-item"><FiMaximize className="pd-qd-icon" /><div><strong>{property.area || '-'}</strong><span>المساحة (م²)</span></div></div>
            <div className="pd-qd-item"><FiHome className="pd-qd-icon" /><div><strong>{property.type}</strong><span>نوع العقار</span></div></div>
          </div>

          {property.description && (
            <div className="pd-section">
              <h3>وصف العقار</h3>
              <p style={{whiteSpace: 'pre-wrap'}}>{property.description}</p>
            </div>
          )}

          {property.coords && (
            <div className="pd-section">
              <h3>الموقع على الخريطة</h3>
              <div className="pd-map-container">
                <MapContainer center={property.coords} zoom={14} scrollWheelZoom={false} className="pd-leaflet-map">
                  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={property.coords}><Popup>{property.title}<br />{property.location}</Popup></Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* === العمود الأيمن === */}
        <div className="pd-right-col">
          <div className="pd-agent-card">
                         <div className="pd-agent-header">
              <img src={`https://ui-avatars.com/api/?name=${property.owner_name || 'مالك'}&background=0D8ABC&color=fff&size=100`} alt={property.owner_name} className="pd-agent-img" />
              <div>
                <h4>
                  {property.owner_name || 'مالك العقار'}
                  {/* ✅ شارة المالك الموثق (تظهر فقط إذا رفع بطاقته) */}
                  {property.owner_id_number && (
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', 
                      background: '#f1c991', color: '#0a0f18', padding: '2px 8px', 
                      borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', 
                      marginRight: '8px', verticalAlign: 'middle' 
                    }}>
                      <FiShield size={12} /> موثق
                    </span>
                  )}
                </h4>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontSize: '13px',marginTop: '8px' }}>
                  <FiLock size={13} /> محمي بواسطة ADAR
                </span>
              </div>
            </div>
                         <div className="pd-agent-actions" style={{ flexDirection: 'column', gap: '10px' }}>
              
              {/* ✅ الزر الرئيسي الجديد */}
              <button 
                onClick={() => {
                  const form = document.querySelector('.pd-contact-form');
                  if(form) form.scrollIntoView({ behavior: 'smooth' });
                }}
                className="pd-agent-btn primary" 
                style={{ width: '100%', justifyContent: 'center', cursor: 'pointer', border: 'none', fontSize: '15px' }}
              >
                <FiMessageCircle /> تواصل مع المالك بأمان
              </button>

              {/* ✅ ملاحظة صغيرة توضح لماذا نحن الأفضل */}
              <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', margin: 0 }}>
                يتم إخفاء البيانات الشخصية لحمايتك من الاحتيال
              </p>
            </div>
             <form className="pd-contact-form" onSubmit={handleSendMessage}>
              <h4>أرسل رسالة للمالك</h4>
              <div style={{ 
                background: 'linear-gradient(to right, #fffbeb, #fef3c7)', 
                border: '1px solid #fcd34d', padding: '15px', borderRadius: '8px', 
                marginBottom: '20px', fontSize: '13px', color: '#92400e', lineHeight: '1.7' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', marginBottom: '5px', color: '#b45309' }}>
                  <FiShield size={16} /> تعهد ADAR بالحماية
                </div>
                <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: '1.8' }}>
                  <li>لا تقم بتحويل أي أموال قبل معاينة العقار شخصياً.</li>
                  <li>تأكد من مطابقة العقار للوصف وصحة العقد في الحي العقاري.</li>
                  <li>المنصة غير مسؤولة عن صفقات تتم خارج نطاق هذا النموذج.</li>
                </ul>
              </div>
              {msgSent ? (
                <div style={{ textAlign: 'center', padding: '20px', background: '#dcfce7', borderRadius: '8px', color: '#166534' }}>
                  <h4 style={{ margin: '0 0 5px' }}>تم إرسال رسالتك بنجاح! ✅</h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>سيقوم المالك بالرد عليك قريباً.</p>
                </div>
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder="الاسم الكامل" 
                    required 
                    value={contactForm.name} 
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})} 
                  />
                  <input 
                    type="tel" 
                    placeholder="                                     رقم الهاتف (مثال: 0555123456)" 
                    required 
                    maxLength={10}
                    value={contactForm.phone} 
                    style={{ 
                      border: phoneError ? '1px solid #ef4444' : '1px solid #ccc', 
                      outline: 'none' , marginBottom: '15px'
                    }} // ✅ حدود حمراء عند الخطأ
                    onChange={(e) => {
                      // 1. إزالة أي شيء ليس رقم
                      const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                      setContactForm({...contactForm, phone: onlyNumbers});

                      // 2. قواعد التحقق
                      const phoneRegex = /^0[5-7][0-9]{8}$/;
                      const fakeNumbers = ['0000000000', '1111111111', '1234567890', '5555555555', '9999999999'];

                      if (onlyNumbers.length === 0) {
                        setPhoneError(''); // مسح الخطأ إذا كان الحقل فارغاً
                      } else if (!phoneRegex.test(onlyNumbers)) {
                        setPhoneError('يجب أن يتكون من 10 أرقام، يبدأ بـ 0، والرقم الثاني (5، 6، أو 7)');
                      } else if (fakeNumbers.includes(onlyNumbers)) {
                        setPhoneError('لا يمكن استخدام أرقام وهمية أو تجريبية');
                      } else {
                        setPhoneError(''); // رقم صحيح، امسح الخطأ
                      }
                    }} 
                  />
                  
                  {/* ✅ رسالة الخطأ التي تظهر هنا */}
                  {phoneError && (
                    <span style={{ 
                      display: 'block', 
                      fontSize: '12px', 
                      color: '#ef4444', 
                      marginTop: '5px', 
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚠️ {phoneError}
                    </span>
                  )}
                  <textarea 
                    placeholder="أنا مهتم بهذا العقار..." 
                    rows="4" 
                    required 
                    value={contactForm.message} 
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  ></textarea>
                  <button type="submit" disabled={sendingMsg}>
                    {sendingMsg ? 'جاري الإرسال...' : 'إرسال الرسالة'}
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