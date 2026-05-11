import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiMapPin, FiImage, FiCheckCircle, 
  FiChevronLeft, FiArrowLeft, FiDollarSign, 
  FiUser, FiFileText, FiUploadCloud, FiShield,    
  FiPlus, 
  FiBook, 
  FiAward, 
  FiShoppingCart, 
  FiTruck, 
  FiSun, 
  FiNavigation, 
  FiInfo, 
  FiEye,
  FiX,           // ← مضاف
  FiRefreshCw    // ← مضاف
} from "react-icons/fi";
import "./AddProperty.css";
import "./AddPropertyImages.css"; // ← مضاف

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

  // حالات الصور المحدثة
  const [mainImage, setMainImage] = useState(null);          // ← changed
  const [additionalImages, setAdditionalImages] = useState([]); // ← changed
  const [isUploading, setIsUploading] = useState(false); 

  const [ownerData, setOwnerData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    propertyDoc: null 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setOwnerData(prev => ({ ...prev, propertyDoc: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert("يجب عليك تسجيل الدخول أولاً لتتمكن من إضافة عقار");
      navigate("/");
      return;
    }

    if (step === 0) {
      if (!ownerData.firstName || !ownerData.lastName || !ownerData.idNumber) {
        alert("يرجى ملء جميع بيانات الهوية للمتابعة");
        return;
      }
      if (!ownerData.propertyDoc) {
        alert("يرجى إرفاق وثيقة تثبت ملكية العقار");
        return;
      }
      setStep(step + 1);
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsUploading(true);
      
      try {
        let uploadedImageUrls = [];

        // 1. رفع الصورة الرئيسية أولاً
        if (mainImage) {
          const mainFileName = `main_${Date.now()}_${mainImage.name}`;
          const { error: mainError } = await supabase.storage
            .from('property-images')
            .upload(mainFileName, mainImage);

          if (mainError) throw mainError;

          const { data: mainUrlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(mainFileName);

          uploadedImageUrls.push(mainUrlData.publicUrl);
        }

        // 2. رفع الصور الإضافية
        for (const file of additionalImages) {
          const fileName = `add_${Date.now()}_${Math.random().toString(36).substr(2, 5)}_${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          uploadedImageUrls.push(urlData.publicUrl);
          await new Promise(resolve => setTimeout(resolve, 500));
        }

        // 3. إذا لم تُرفع أي صور
        if (uploadedImageUrls.length === 0) {
          uploadedImageUrls = ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600"];
        }

        // 4. حفظ البيانات
        const { error } = await supabase.from('properties').insert([{
          user_id: currentUser.id,
          owner_name: `${ownerData.firstName} ${ownerData.lastName}`,
          owner_id_number: ownerData.idNumber,
          listing_type: formData.listingType,
          type: formData.type,
          price: parseFloat(formData.price) || 0,
          title: formData.title,
          location: formData.city + (formData.address ? '، ' + formData.address : ''),
          city: formData.city,
          beds: parseInt(formData.beds) || 0,
          baths: parseInt(formData.baths) || 0,
          area: formData.area,
          description: formData.description,
          image: uploadedImageUrls[0],
          images: uploadedImageUrls,
          status: "active",
        }]).select();

        if (error) throw error;
        
        alert("تم نشر عقارك مع الصور بنجاح!");
        navigate("/properties");
        
      } catch (error) {
        console.error("خطأ في الرفع أو الحفظ:", error);
        alert("حدث خطأ أثناء رفع الصور أو حفظ العقار: " + error.message);
      } finally {
        setIsUploading(false);
      }
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
          
          {/* ===== الخطوة 0 ===== */}
          {step === 0 && (
            <div className="form-step">
              <h2>التحقق من هوية المالك وصحة العقار</h2>
              <p className="step-desc">لضمان أمان المنصة، يجب إثبات الهوية وملكية العقار.</p>
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
              <div className="form-group">
                <label><FiFileText style={{verticalAlign: 'middle', marginLeft: '5px'}} /> وثيقة إثبات الملكية</label>
                <div className="upload-area" style={{padding: '20px', cursor: 'pointer', borderStyle: 'dashed'}} onClick={() => document.getElementById('docUpload').click()}>
                  <FiUploadCloud size={32} />
                  <h3>{ownerData.propertyDoc ? ownerData.propertyDoc.name : "انقر لرفع العقد أو رخصة الملكية"}</h3>
                  <input id="docUpload" type="file" accept=".pdf,.jpg,.jpeg,.png" style={{display: 'none'}} onChange={handleFileChange} />
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
                  <input type="text" name="address" placeholder="مثال: حي البساتين، شارع 5" value={formData.address} onChange={handleChange} />
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

              <div className="amenities-section">
                <div className="amenities-header">
                  <div className="amenities-header-icon"><FiMapPin size={24} /></div>
                  <div>
                    <h3>المرافق والخدمات القريبة</h3>
                    <p className="amenities-subtitle">حدّد اسم المرفق والمسافة لتظهر تلقائياً في وصف إعلانك</p>
                  </div>
                </div>

                <div className="amenities-grid">
                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-red"><FiPlus size={20} /></div>
                    <div className="amenity-info">
                      <label>المستشفى / العيادة</label>
                      <input type="text" name="amenity_hospital_name" placeholder="مثال: مستشفى ابن سينا" value={formData.amenity_hospital_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_hospital_dist" placeholder="المسافة" min="0" value={formData.amenity_hospital_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_hospital_unit" value={formData.amenity_hospital_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-blue"><FiBook size={20} /></div>
                    <div className="amenity-info">
                      <label>الابتدائية / المتوسطة / الثانوية</label>
                      <input type="text" name="amenity_school_name" placeholder="مثال: متوسطة الشهداء" value={formData.amenity_school_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_school_dist" placeholder="المسافة" min="0" value={formData.amenity_school_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_school_unit" value={formData.amenity_school_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-green"><FiAward size={20} /></div>
                    <div className="amenity-info">
                      <label>الجامعة</label>
                      <input type="text" name="amenity_university_name" placeholder="مثال: جامعة الجلفة" value={formData.amenity_university_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_university_dist" placeholder="المسافة" min="0" value={formData.amenity_university_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_university_unit" value={formData.amenity_university_unit || 'km'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-gold"><FiShoppingCart size={20} /></div>
                    <div className="amenity-info">
                      <label>السوق / المتجر</label>
                      <input type="text" name="amenity_market_name" placeholder="مثال: سوق الحمراء" value={formData.amenity_market_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_market_dist" placeholder="المسافة" min="0" value={formData.amenity_market_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_market_unit" value={formData.amenity_market_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-purple"><FiMapPin size={20} /></div>
                    <div className="amenity-info">
                      <label>المسجد</label>
                      <input type="text" name="amenity_mosque_name" placeholder="مثال: مسجد النور" value={formData.amenity_mosque_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_mosque_dist" placeholder="المسافة" min="0" value={formData.amenity_mosque_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_mosque_unit" value={formData.amenity_mosque_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-orange"><FiTruck size={20} /></div>
                    <div className="amenity-info">
                      <label>محطة المواصلات</label>
                      <input type="text" name="amenity_transport_name" placeholder="مثال: محطة الحافلات المركزية" value={formData.amenity_transport_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_transport_dist" placeholder="المسافة" min="0" value={formData.amenity_transport_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_transport_unit" value={formData.amenity_transport_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-emerald"><FiSun size={20} /></div>
                    <div className="amenity-info">
                      <label>حديقة / منتزه</label>
                      <input type="text" name="amenity_park_name" placeholder="مثال: حديقة الحرية" value={formData.amenity_park_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_park_dist" placeholder="المسافة" min="0" value={formData.amenity_park_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_park_unit" value={formData.amenity_park_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="amenity-card">
                    <div className="amenity-icon amenity-icon-slate"><FiNavigation size={20} /></div>
                    <div className="amenity-info">
                      <label>الطريق الرئيسي</label>
                      <input type="text" name="amenity_road_name" placeholder="مثال: الطريق الوطني رقم 1" value={formData.amenity_road_name || ''} onChange={handleChange} className="amenity-name-input"/>
                      <div className="amenity-distance-wrapper">
                        <input type="number" name="amenity_road_dist" placeholder="المسافة" min="0" value={formData.amenity_road_dist || ''} onChange={handleChange} className="amenity-input"/>
                        <select name="amenity_road_unit" value={formData.amenity_road_unit || 'm'} onChange={handleChange} className="amenity-unit">
                          <option value="m">متر</option>
                          <option value="km">كم</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="amenities-note">
                  <FiInfo size={16} />
                  <span>يمكنك ترك اسم المرفق فارغاً — سيُعرض نوع المرفق فقط في الوصف</span>
                </div>
              </div>

              {getAmenitiesSummary() && (
                <div className="amenities-preview">
                  <div className="preview-header">
                    <FiEye size={18} />
                    <span>معاينة الوصف الذي سيظهر في الإعلان</span>
                  </div>
                  <div className="preview-content">
                    {getAmenitiesSummary()}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>غرف النوم</label>
                  <input type="number" name="beds" placeholder="0" value={formData.beds} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>الحمامات</label>
                  <input type="number" name="baths" placeholder="0" value={formData.baths} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 3 (الصور) ===== */}
          {step === 3 && (
            <div className="form-step">
              <h2>أضف صور العقار</h2>
              <p className="step-desc">الصور الجيدة تزيد من اهتمام المشترين بنسبة 80%</p>
              
              {/* --- الصورة الرئيسية --- */}
              <label className="img-section-label">الصورة الرئيسية</label>
              <div 
                className={`main-image-box ${mainImage ? 'has-image' : ''}`}
                onClick={() => document.getElementById('mainImageInput').click()}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('drag-over');
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) setMainImage(file);
                }}
              >
                {mainImage ? (
                  <>
                    <img src={URL.createObjectURL(mainImage)} alt="الصورة الرئيسية" />
                    <div className="main-image-overlay">
                      <span className="main-label-tag">الصورة الرئيسية</span>
                      <button type="button" className="replace-image-btn" onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('mainImageInput').click();
                      }}>
                        <FiRefreshCw size={14} />
                        استبدل الصورة
                      </button>
                      <button type="button" className="remove-main-btn" onClick={(e) => {
                        e.stopPropagation();
                        setMainImage(null);
                      }}>
                        <FiX size={14} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="upload-icon-circle">
                      <FiImage size={28} />
                    </div>
                    <p className="empty-text">اختيار صورة رئيسية</p>
                    <p className="empty-hint">سحب وإفلات أو انقر</p>
                  </>
                )}
                <input 
                  id="mainImageInput"
                  type="file" 
                  accept="image/*" 
                  style={{display: 'none'}} 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setMainImage(file);
                    e.target.value = '';
                  }}
                />
              </div>

              {/* --- الصور الإضافية --- */}
              <label className="img-section-label" style={{marginTop: '28px'}}>
                الصور الإضافية
                {additionalImages.length > 0 && (
                  <span className="img-count-badge">{additionalImages.length}</span>
                )}
              </label>
              <div className="additional-grid">
                {additionalImages.map((file, index) => (
                  <div key={index} className="additional-card">
                    <img src={URL.createObjectURL(file)} alt={`صورة ${index + 1}`} />
                    <span className="card-index">{index + 1}</span>
                    <button 
                      type="button"
                      className="remove-add-btn"
                      onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== index))}
                    >
                      <FiX size={11} />
                    </button>
                  </div>
                ))}
                <div 
                  className="add-more-box"
                  onClick={() => document.getElementById('additionalImagesInput').click()}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                  onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drag-over');
                    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                    if (files.length) setAdditionalImages(prev => [...prev, ...files]);
                  }}
                >
                  <FiPlus size={22} />
                  <span>اختيار صورك</span>
                  <span className="add-hint">سحب وإفلات</span>
                  <input 
                    id="additionalImagesInput"
                    type="file" 
                    multiple 
                    accept="image/*" 
                    style={{display: 'none'}} 
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      if (files.length) setAdditionalImages(prev => [...prev, ...files]);
                      e.target.value = '';
                    }}
                  />
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
            
            <button type="submit" className="btn-primary" disabled={isUploading}>
              {step === 3 ? (
                <>{isUploading ? "جاري رفع الصور..." : <><FiCheckCircle /> إرسال للمراجعة</>}</>
              ) : (
                <>التالي</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}