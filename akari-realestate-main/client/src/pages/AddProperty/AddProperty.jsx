import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiMapPin, FiImage, FiCheckCircle, 
  FiChevronLeft, FiArrowLeft, FiDollarSign, 
  FiUser, FiFileText, FiUploadCloud, FiShield,    
  FiPlus, FiBook, FiAward, FiShoppingCart, 
  FiTruck, FiSun, FiNavigation, FiInfo, 
  FiEye, FiX, FiRefreshCw
} from "react-icons/fi";
import "./AddProperty.css";
import "./AddPropertyImages.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

export default function AddProperty() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    listingType: "sale", 
    type: "",
    price: "",
    area: "",
    city: "",
    address: "",
    title: "",
    description: "",
    beds: "",
    baths: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [idImage, setIdImage] = useState(null);
  const [deedImage, setDeedImage] = useState(null);
  
  const [ownerData, setOwnerData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
  });

  // دالة رفع الملفات إلى Supabase Storage
  const uploadDocument = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentUser.id}/${fileName}`;

    const { error } = await supabase.storage
      .from('property-docs')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-docs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من الحقول الأساسية
    if (!formData.title || !formData.price || !formData.type || !formData.city) {
      alert("يرجى ملء جميع الحقول المطلوبة (النوع، السعر، المدينة، العنوان)");
      setStep(1); // يعيده للخطوة الناقصة
      return;
    }

    if (!idImage || !deedImage) {
      alert("يرجى رفع صورة الهوية الوطنية وعقد الملكية");
      setStep(0); // يعيده لخطوة الوثائق
      return;
    }

    setUploading(true);
    try {
      // 1. رفع صور الهوية والعقد
      const idImageUrl = await uploadDocument(idImage);
      const deedImageUrl = await uploadDocument(deedImage);

      // 2. رفع الصورة الرئيسية للعقار
      let mainImageUrl = "./default-property.jpg";
      if (mainImage) {
        mainImageUrl = await uploadDocument(mainImage);
      }

      // 3. حفظ العقار مع جميع البيانات الصحيحة
      const { error } = await supabase.from('properties').insert([{
        title: formData.title,
        listing_type: formData.listingType,
        type: formData.type,
        price: Number(formData.price),
        area: Number(formData.area),
        city: formData.city,
        location: formData.address ? `${formData.city}، ${formData.address}` : formData.city,
        description: formData.description,
        beds: Number(formData.beds) || 0,
        baths: Number(formData.baths) || 0,
        owner_name: `${ownerData.firstName} ${ownerData.lastName}`,
        owner_id_number: ownerData.idNumber,
        image: mainImageUrl, // ← الصورة الرئيسية للعقار
        user_id: currentUser.id,
        status: 'pending', 
        id_image: idImageUrl,
        deed_image: deedImageUrl,
      }]);

      if (error) throw error;
      
      alert("تم إرسال العقار بنجاح! ✅\nسيتم مراجعة هويتك ووثائقك من قبل الإدارة قبل النشر.");
      navigate("/dashboard/my-properties");

    } catch (error) {
      console.error("خطأ في الرفع:", error);
      alert("حدث خطأ أثناء رفع الوثائق أو حفظ العقار: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const getAmenitiesSummary = () => {
    const amenities = [
      { key: 'hospital', label: 'المستشفى', icon: FiPlus },
      { key: 'school', label: 'المدرسة', icon: FiBook },
      { key: 'university', label: 'الجامعة', icon: FiAward },
      { key: 'market', label: 'السوق', icon: FiShoppingCart },
      { key: 'mosque', label: 'المسجد', icon: FiMapPin },
      { key: 'transport', label: 'المواصلات', icon: FiTruck },
      { key: 'park', label: 'الحديقة', icon: FiSun },
      { key: 'road', label: 'الطريق الرئيسي', icon: FiNavigation },
    ];

    const filled = amenities.filter(a => formData[`amenity_${a.key}_dist`]);
    if (filled.length === 0) return null;

    return filled.map(a => {
      const name = formData[`amenity_${a.key}_name`];
      const dist = formData[`amenity_${a.key}_dist`];
      const unit = formData[`amenity_${a.key}_unit`] === 'km' ? 'كم' : 'متر';
      const amenityLabel = name ? name : a.label;
      const IconComponent = a.icon;

      return (
        <div key={a.key} className="preview-item">
          <span className="preview-icon"><IconComponent size={16} /></span>
          <span>يبعد عن <strong>{amenityLabel}</strong> مسافة <strong>{dist} {unit}</strong></span>
        </div>
      );
    });
  };

  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}>
            <FiArrowLeft /> رجوع
          </button>
          <h1>إضافة عقار جديد</h1>
          <p>أضف عقارك في 4 خطوات</p>
        </div>

        <div className="add-prop-progress">
          <div className={`prop-step ${step >= 0 ? 'active' : ''}`}>
            <div className="step-circle"><FiShield /></div>
            <span>التحقق والهوية</span>
          </div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle"><FiHome /></div>
            <span>النوع والسعر</span>
          </div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle"><FiMapPin /></div>
            <span>الموقع والتفاصيل</span>
          </div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle"><FiImage /></div>
            <span>الصور</span>
          </div>
        </div>

        <form className="add-prop-form" onSubmit={handleSubmit}>
          
          {/* ===== الخطوة 0: البيانات والوثائق ===== */}
          {step === 0 && (
            <div className="form-step">
              <h2>بيانات المالك والوثائق</h2>
              <p className="step-desc">أدخل بياناتك وارفع الوثائق المطلوبة للتحقق.</p>
              
              <div className="owner-details-grid">
                <div className="form-group">
                  <label><FiUser style={{verticalAlign: 'middle', marginLeft: '5px'}} /> الاسم</label>
                  <input type="text" name="firstName" placeholder="الاسم الأول" value={ownerData.firstName} onChange={handleOwnerChange} required />
                </div>
                <div className="form-group">
                  <label>اللقب</label>
                  <input type="text" name="lastName" placeholder="لقب العائلة" value={ownerData.lastName} onChange={handleOwnerChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>رقم الهوية الوطنية</label>
                <input type="text" name="idNumber" placeholder="أدخل رقم الهوية" value={ownerData.idNumber} onChange={handleOwnerChange} required maxLength={18} style={{direction: 'ltr', textAlign: 'left'}} />
              </div>

              {/* قسم رفع الوثائق متكامل هنا بدل الأسفل */}
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(241, 201, 145, 0.05)', border: '1px solid rgba(241, 201, 145, 0.2)', borderRadius: '12px' }}>
                <h3 style={{ color: '#f1c991', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiShield /> رفع الوثائق (مطلوب)
                </h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>صورة الهوية الوطنية</label>
                    <input 
                      type="file" accept="image/*" 
                      onChange={(e) => setIdImage(e.target.files[0])}
                      style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>عقد الملكية / رخصة البناء</label>
                    <input 
                      type="file" accept="image/*" 
                      onChange={(e) => setDeedImage(e.target.files[0])}
                      style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 1 ===== */}
          {step === 1 && (
            <div className="form-step">
              <h2>ما نوع العقار وسعره؟</h2>
              <div className="form-group">
                <label>الغرض من الإعلان</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'sale'})}>للبيع</button>
                  <button type="button" className={`toggle-btn rent ${formData.listingType === 'rent' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'rent'})}>للكراء</button>
                </div>
              </div>
              <div className="form-group">
                <label>نوع العقار</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">اختر نوع العقار</option>
                  <option value="شقة">شقة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="منزل">منزل</option>
                  <option value="أرض">أرض</option>
                  <option value="محل تجاري">محل تجاري</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>السعر (دج)</label>
                  <input type="number" name="price" placeholder="مثال: 15000000" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>المساحة (م²)</label>
                  <input type="number" name="area" placeholder="مثال: 120" value={formData.area} onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 2 ===== */}
          {step === 2 && (
            <div className="form-step">
              <h2>أين يقع العقار وما تفاصيله؟</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>المدينة</label>
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">اختر المدينة</option>
                    <option value="الجلفة">الجلفة</option>
                    <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                    <option value="وهران">وهران</option>
                    <option value="تسمسيلت">تسمسيلت</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>العنوان بالتفصيل</label>
                  <input type="text" name="address" placeholder="حي البساتين، شارع 5" value={formData.address} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>عنوان الإعلان</label>
                <input type="text" name="title" placeholder="مثال: شقة فاخرة للبيع" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>وصف العقار</label>
                <textarea name="description" rows="4" placeholder="اكتب وصفاً عاماً عن العقار..." value={formData.description} onChange={handleChange} required></textarea>
              </div>

              {/* (كود المرافق amenities يبقى كما هو بدون تغيير) */}
              <div className="amenities-section">
                <div className="amenities-header">
                  <div className="amenities-header-icon"><FiMapPin size={24} /></div>
                  <div>
                    <h3>المرافق والخدمات القريبة</h3>
                    <p className="amenities-subtitle">حدّد اسم المرفق والمسافة لتظهر تلقائياً في وصف إعلانك</p>
                  </div>
                </div>
                <div className="amenities-grid">
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-red"><FiPlus size={20} /></div><div className="amenity-info"><label>المستشفى</label><input type="text" name="amenity_hospital_name" placeholder="اسم المستشفى" value={formData.amenity_hospital_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_hospital_dist" placeholder="المسافة" min="0" value={formData.amenity_hospital_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_hospital_unit" value={formData.amenity_hospital_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-blue"><FiBook size={20} /></div><div className="amenity-info"><label>المدرسة</label><input type="text" name="amenity_school_name" placeholder="اسم المدرسة" value={formData.amenity_school_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_school_dist" placeholder="المسافة" min="0" value={formData.amenity_school_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_school_unit" value={formData.amenity_school_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-green"><FiAward size={20} /></div><div className="amenity-info"><label>الجامعة</label><input type="text" name="amenity_university_name" placeholder="اسم الجامعة" value={formData.amenity_university_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_university_dist" placeholder="المسافة" min="0" value={formData.amenity_university_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_university_unit" value={formData.amenity_university_unit || 'km'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-gold"><FiShoppingCart size={20} /></div><div className="amenity-info"><label>السوق</label><input type="text" name="amenity_market_name" placeholder="اسم السوق" value={formData.amenity_market_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_market_dist" placeholder="المسافة" min="0" value={formData.amenity_market_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_market_unit" value={formData.amenity_market_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-purple"><FiMapPin size={20} /></div><div className="amenity-info"><label>المسجد</label><input type="text" name="amenity_mosque_name" placeholder="اسم المسجد" value={formData.amenity_mosque_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_mosque_dist" placeholder="المسافة" min="0" value={formData.amenity_mosque_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_mosque_unit" value={formData.amenity_mosque_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-orange"><FiTruck size={20} /></div><div className="amenity-info"><label>المواصلات</label><input type="text" name="amenity_transport_name" placeholder="المحطة" value={formData.amenity_transport_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_transport_dist" placeholder="المسافة" min="0" value={formData.amenity_transport_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_transport_unit" value={formData.amenity_transport_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-emerald"><FiSun size={20} /></div><div className="amenity-info"><label>الحديقة</label><input type="text" name="amenity_park_name" placeholder="اسم الحديقة" value={formData.amenity_park_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_park_dist" placeholder="المسافة" min="0" value={formData.amenity_park_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_park_unit" value={formData.amenity_park_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                  <div className="amenity-card"><div className="amenity-icon amenity-icon-slate"><FiNavigation size={20} /></div><div className="amenity-info"><label>الطريق الرئيسي</label><input type="text" name="amenity_road_name" placeholder="اسم الطريق" value={formData.amenity_road_name || ''} onChange={handleChange} className="amenity-name-input"/><div className="amenity-distance-wrapper"><input type="number" name="amenity_road_dist" placeholder="المسافة" min="0" value={formData.amenity_road_dist || ''} onChange={handleChange} className="amenity-input"/><select name="amenity_road_unit" value={formData.amenity_road_unit || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">متر</option><option value="km">كم</option></select></div></div></div>
                </div>
                <div className="amenities-note"><FiInfo size={16} /><span>يمكنك ترك اسم المرفق فارغاً — سيُعرض نوع المرفق فقط</span></div>
              </div>

              {getAmenitiesSummary() && (
                <div className="amenities-preview">
                  <div className="preview-header"><FiEye size={18} /><span>معاينة الوصف الذي سيظهر في الإعلان</span></div>
                  <div className="preview-content">{getAmenitiesSummary()}</div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group"><label>غرف النوم</label><input type="number" name="beds" placeholder="0" value={formData.beds} onChange={handleChange} /></div>
                <div className="form-group"><label>الحمامات</label><input type="number" name="baths" placeholder="0" value={formData.baths} onChange={handleChange} /></div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 3 (الصور) ===== */}
          {step === 3 && (
            <div className="form-step">
              <h2>أضف صور العقار</h2>
              <p className="step-desc">الصور الجيدة تزيد من اهتمام المشترين بنسبة 80%</p>
              
              <label className="img-section-label">الصورة الرئيسية</label>
              <div 
                className={`main-image-box ${mainImage ? 'has-image' : ''}`}
                onClick={() => document.getElementById('mainImageInput').click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); const file = e.dataTransfer.files[0]; if (file && file.type.startsWith('image/')) setMainImage(file); }}
              >
                {mainImage ? (
                  <>
                    <img src={URL.createObjectURL(mainImage)} alt="الصورة الرئيسية" />
                    <div className="main-image-overlay">
                      <span className="main-label-tag">الصورة الرئيسية</span>
                      <button type="button" className="replace-image-btn" onClick={(e) => { e.stopPropagation(); document.getElementById('mainImageInput').click(); }}><FiRefreshCw size={14} /> استبدل</button>
                      <button type="button" className="remove-main-btn" onClick={(e) => { e.stopPropagation(); setMainImage(null); }}><FiX size={14} /></button>
                    </div>
                  </>
                ) : (
                  <><div className="upload-icon-circle"><FiImage size={28} /></div><p className="empty-text">اختيار صورة رئيسية</p><p className="empty-hint">سحب وإفلات أو انقر</p></>
                )}
                <input id="mainImageInput" type="file" accept="image/*" style={{display: 'none'}} onChange={(e) => { if (e.target.files[0]) setMainImage(e.target.files[0]); e.target.value = ''; }} />
              </div>

              <label className="img-section-label" style={{marginTop: '28px'}}>
                الصور الإضافية {additionalImages.length > 0 && (<span className="img-count-badge">{additionalImages.length}</span>)}
              </label>
              <div className="additional-grid">
                {additionalImages.map((file, index) => (
                  <div key={index} className="additional-card">
                    <img src={URL.createObjectURL(file)} alt={`صورة ${index + 1}`} />
                    <span className="card-index">{index + 1}</span>
                    <button type="button" className="remove-add-btn" onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== index))}><FiX size={11} /></button>
                  </div>
                ))}
                <div 
                  className="add-more-box"
                  onClick={() => document.getElementById('additionalImagesInput').click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                  onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                  onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')); if (files.length) setAdditionalImages(prev => [...prev, ...files]); }}
                >
                  <FiPlus size={22} /><span>اختيار صورك</span><span className="add-hint">سحب وإفلات</span>
                  <input id="additionalImagesInput" type="file" multiple accept="image/*" style={{display: 'none'}} onChange={(e) => { const files = Array.from(e.target.files); if (files.length) setAdditionalImages(prev => [...prev, ...files]); e.target.value = ''; }} />
                </div>
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="form-actions">
            {step > 0 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                <FiChevronLeft /> السابق
              </button>
            )}
            <button type="submit" disabled={uploading} className="submit-btn">
              {uploading ? "جاري رفع الوثائق والحفظ..." : "إرسال العقار للمراجعة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}