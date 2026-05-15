import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiDollarSign,
  FiImage,
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiUploadCloud,
  FiX,
  FiPhone,
  FiUser,
  FiAlertCircle,
  FiShield,
} from "react-icons/fi";
import "./AddService.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

const AddService = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const idImageRef = useRef(null);
  const deedImageRef = useRef(null);
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false); // ← جديد: حالة الرفع
  
  // حفظ الملفات الفعلية للرفع
  const [serviceFiles, setServiceFiles] = useState([]);
  const [servicePreviews, setServicePreviews] = useState([]);
  const [idImage, setIdImage] = useState(null); // ← جديد
  const [deedImage, setDeedImage] = useState(null); // ← جديد
  
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    providerName: "",
    wilaya: "",
    priceType: "",
    price: "",
    description: "",
    phone: "",
  });

  const steps = [
    { id: 1, label: "نوع الخدمة", icon: <FiBriefcase /> },
    { id: 2, label: "التسعير والتفاصيل", icon: <FiDollarSign /> },
    { id: 3, label: "الصور والوثائق والتواصل", icon: <FiImage /> }, // ← عدّل الاسم
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // === دالة رفع الملفات إلى Supabase Storage ===
  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentUser.id}/services/${fileName}`;

    const { error } = await supabase.storage
      .from('property-docs')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-docs')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.category.trim()) newErrors.category = "يجب اختيار نوع الخدمة";
      if (!formData.title.trim()) newErrors.title = "عنوان الخدمة مطلوب";
      if (!formData.providerName.trim()) newErrors.providerName = "اسم مقدم الخدمة مطلوب";
      if (!formData.wilaya.trim()) newErrors.wilaya = "الولاية مطلوبة";
    }

    if (step === 2) {
      if (!formData.priceType) newErrors.priceType = "يجب تحديد نوع التسعير";
      if (formData.priceType !== "negotiable" && !formData.price.trim()) {
        newErrors.price = "السعر مطلوب";
      }
      if (!formData.description.trim()) newErrors.description = "وصف الخدمة مطلوب";
    }

    if (step === 3) {
      if (!formData.phone.trim()) {
        newErrors.phone = "رقم الهاتف للتواصل مطلوب";
      } else {
        const cleanPhone = formData.phone.replace(/\s/g, '');
        const phoneRegex = /^0[5-7]\d{8}$/;
        if (!phoneRegex.test(cleanPhone)) {
          newErrors.phone = "رقم الهاتف غير صحيح (يجب أن يبدأ بـ 05/06/07 ويتكون من 10 أرقام)";
        }
      }
      
      // ← إضافة التحقق من الوثائق
      if (!idImage) newErrors.idImage = "يجب رفع صورة الهوية الوطنية";
      if (!deedImage) newErrors.deedImage = "يجب رفع صورة عقد الملكية أو الترخيص";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  // === معالجة صور أعمال الخدمة (متعددة) ===
  const handleServiceImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setServiceFiles((prev) => [...prev, ...files]);
    setServicePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeServiceImage = (index) => {
    setServiceFiles((prev) => prev.filter((_, i) => i !== index));
    setServicePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    
    if (!currentUser) {
      alert("يجب عليك تسجيل الدخول أولاً لإضافة خدمة");
      return;
    }
    
    setUploading(true);
    
    try {
      // 1. رفع صور الأعمال
      let uploadedImagesUrls = [];
      if (serviceFiles.length > 0) {
        for (const file of serviceFiles) {
          const url = await uploadFile(file);
          uploadedImagesUrls.push(url);
        }
      }

      // 2. رفع صور الهوية والعقد
      const idImageUrl = await uploadFile(idImage);
      const deedImageUrl = await uploadFile(deedImage);

      // 3. حفظ البيانات في قاعدة البيانات
      const { data, error } = await supabase.from('services').insert([{
        user_id: currentUser.id,
        category: formData.category,
        title: formData.title,
        provider_name: formData.providerName,
        wilaya: formData.wilaya,
        price_type: formData.priceType,
        price: formData.priceType === 'negotiable' ? 0 : Number(formData.price),
        description: formData.description,
        phone: formData.phone,
        images: uploadedImagesUrls, // مصفوفة روابط صور الأعمال
        id_image: idImageUrl,       // رابط صورة الهوية
        deed_image: deedImageUrl,   // رابط صورة العقد
        status: "pending"           // ← يبقى معلقاً حتى يوافق الإدمن
      }]).select();

      if (error) throw error;
      
      // رسالة مناسبة توضح أن الإدارة ستراجع الطلب
      alert("تم إرسال خدمتك بنجاح! ✅\nسيتم مراجعة هويتك ووثائقك من قبل الإدارة قبل النشر.");
      navigate("/dashboard/my-services");
      
    } catch (error) {
      console.error("خطأ في الرفع:", error);
      alert("حدث خطأ أثناء رفع الوثائق أو حفظ الخدمة: " + error.message);
    } finally {
      setUploading(false);
    }
  };
   
  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}>
            <FiArrowRight /> رجوع
          </button>
          <h1>أضف خدمتك إلى سوق ADAR</h1>
          <p>اعرض خدماتك العقارية وصل بآلاف العملاء المحتملين</p>
        </div>

        <div className="add-prop-progress">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className={`prop-step ${currentStep >= step.id ? "active" : ""}`}>
                <div className="step-circle">{step.icon}</div>
                <span>{step.label}</span>
              </div>
              {index < steps.length - 1 && <div className="progress-line"></div>}
            </React.Fragment>
          ))}
        </div>

        <div className="add-prop-form">
          <form onSubmit={handleSubmit}>
            
            {/* ===== الخطوة 1 ===== */}
            {currentStep === 1 && (
              <div className="form-step">
                <h2>نوع الخدمة ومقدمها</h2>
                <p className="step-desc">حدد نوع الخدمة التي تقدمها ومعلوماتك الأساسية</p>
                
                <div className="form-group">
                  <label>تصنيف الخدمة  </label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={errors.category ? "input-error" : ""}>
                    <option value="">اختر نوع الخدمة</option>
                    <option value="maintenance">صيانة العقارات (سباكة، كهرباء، طلاء)</option>
                    <option value="transport">خدمات النقل والشحن</option>
                    <option value="architecture">هندسة معمارية وتصميم</option>
                    <option value="legal">توثيق قانوني ومحاماة</option>
                    <option value="cleaning">تنظيف وخدمات مساعدة</option>
                    <option value="other">خدمات أخرى</option>
                  </select>
                  {errors.category && <span className="error-text"><FiAlertCircle /> {errors.category}</span>}
                </div>

                <div className="form-group">
                  <label>عنوان الخدمة  </label>
                  <input type="text" name="title" placeholder="مثال: شركة نقل أثاث شامل across الولايات" value={formData.title} onChange={handleInputChange} className={errors.title ? "input-error" : ""} />
                  {errors.title && <span className="error-text"><FiAlertCircle /> {errors.title}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FiUser /> اسم مقدم الخدمة / الشركة</label>
                    <input type="text" name="providerName" placeholder="مؤسسة النور للبناء" value={formData.providerName} onChange={handleInputChange} className={errors.providerName ? "input-error" : ""} />
                    {errors.providerName && <span className="error-text"><FiAlertCircle /> {errors.providerName}</span>}
                  </div>
                  <div className="form-group">
                    <label>الولاية  </label>
                    <input type="text" name="wilaya" placeholder="الجزائر العاصمة" value={formData.wilaya} onChange={handleInputChange} className={errors.wilaya ? "input-error" : ""} />
                    {errors.wilaya && <span className="error-text"><FiAlertCircle /> {errors.wilaya}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ===== الخطوة 2 ===== */}
            {currentStep === 2 && (
              <div className="form-step">
                <h2>التسعير والوصف</h2>
                <p className="step-desc">وضح كيف تفرض رسومك واشرح خدماتك بالتفصيل</p>
                
                <div className="form-group">
                  <label>نوع التسعير  </label>
                  <div className="toggle-group">
                    {[
                      { id: "fixed", label: "سعر ثابت" },
                      { id: "hourly", label: "بالساعة" },
                      { id: "negotiable", label: "حسب الاتفاق" }
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.id}
                        className={`toggle-btn ${formData.priceType === opt.id ? "active" : ""}`}
                        onClick={() => handleInputChange({ target: { name: "priceType", value: opt.id } })}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {errors.priceType && <span className="error-text"><FiAlertCircle /> {errors.priceType}</span>}
                </div>

                {formData.priceType && formData.priceType !== "negotiable" && (
                  <div className="form-group">
                    <label>السعر (د.ج) {formData.priceType === 'hourly' ? '/ ساعة' : ''} *</label>
                    <input type="text" name="price" placeholder="5000" value={formData.price} onChange={handleInputChange} className={errors.price ? "input-error" : ""} />
                    {errors.price && <span className="error-text"><FiAlertCircle /> {errors.price}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label>وصف الخدمة  </label>
                  <textarea name="description" rows="6" placeholder="اشرح خدماتك بالتفصيل، سنوات الخبرة، المناطق التي تغطيها..." value={formData.description} onChange={handleInputChange} className={errors.description ? "input-error" : ""}></textarea>
                  {errors.description && <span className="error-text"><FiAlertCircle /> {errors.description}</span>}
                </div>
              </div>
            )}

            {/* ===== الخطوة 3 (معدّلة بالكامل) ===== */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2>معرض الأعمال والوثائق والتواصل</h2>
                <p className="step-desc">أضف صور أعمالك، وارفع الوثائق المطلوبة للتحقق</p>
                
                {/* === 1. معرض أعمال سابقة (اختياري) === */}
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                  <FiUploadCloud size={40} style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.3)' }} />
                  <h3>أضف صور أعمالك السابقة (اختياري)</h3>
                  <p>اسحب الصور هنا أو اضغط للاختيار</p>
                  <button type="button" className="upload-btn">اختر الصور</button>
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleServiceImagesChange} hidden />
                </div>

                {servicePreviews.length > 0 && (
                  <div className="images-preview-grid">
                    {servicePreviews.map((img, index) => (
                      <div key={index} className="preview-item">
                        <img src={img} alt={`preview ${index}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeServiceImage(index)}>
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* === 2. قسم التحقق من الهوية والعقد (مطلوب) === */}
                <div style={{ 
                  marginTop: '30px', 
                  padding: '20px', 
                  background: 'rgba(241, 201, 145, 0.05)', 
                  border: '1px solid rgba(241, 201, 145, 0.2)', 
                  borderRadius: '12px' 
                }}>
                  <h3 style={{ color: '#f1c991', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiShield /> التحقق من الهوية والترخيص (مطلوب)
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                    لضمان حقوق العملاء، يرجى رفع صورة الهوية الوطنية وعقد الملكية أو الترخيص التجاري.
                  </p>

                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>صورة الهوية الوطنية</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={idImageRef}
                        onChange={(e) => { setIdImage(e.target.files[0]); if(errors.idImage) setErrors(prev => ({...prev, idImage: ""})); }}
                        style={{ width: '100%', padding: '10px', background: '#1e293b', border: errors.idImage ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                      {errors.idImage && <span className="error-text" style={{marginTop: '5px', display: 'block'}}><FiAlertCircle /> {errors.idImage}</span>}
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>عقد الملكية / الترخيص</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        ref={deedImageRef}
                        onChange={(e) => { setDeedImage(e.target.files[0]); if(errors.deedImage) setErrors(prev => ({...prev, deedImage: ""})); }}
                        style={{ width: '100%', padding: '10px', background: '#1e293b', border: errors.deedImage ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                      />
                      {errors.deedImage && <span className="error-text" style={{marginTop: '5px', display: 'block'}}><FiAlertCircle /> {errors.deedImage}</span>}
                    </div>
                  </div>
                </div>

                {/* === 3. رقم الهاتف === */}
                <div className="form-notice-box" style={{ marginTop: '30px', marginBottom: '20px' }}>
                  <FiPhone style={{ color: '#f1c991', flexShrink: 0, marginTop: '2px' }} />
                  <p>رقم الهاتف هو وسيلة التواصل الأساسية بينك وبين العميل، تأكد من صحته.</p>
                </div>

                <div className="form-group">
                  <label><FiPhone /> رقم الهاتف / الواتساب  </label>
                   <input 
                    type="tel" 
                    name="phone" 
                    placeholder="05XX XX XX XX" 
                    value={formData.phone} 
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/[^0-9\s]/g, '');
                      handleInputChange({ target: { name: "phone", value: onlyNumbers } });
                    }}
                    className={`phone-input ${errors.phone ? "input-error" : ""}`} 
                    inputMode="numeric"
                    maxLength={10}
                  />
                  {errors.phone && <span className="error-text"><FiAlertCircle /> {errors.phone}</span>}
                </div>
              </div>
            )}

            {/* أزرار التنقل */}
            <div className="form-actions">
              {currentStep > 1 && (
                <button type="button" className="btn-secondary" onClick={handlePrev}>
                  <FiArrowRight /> السابق
                </button>
              )}

              {currentStep < 3 ? (
                <button type="button" className="btn-primary" onClick={handleNext}>
                  التالي <FiArrowLeft />
                </button>
              ) : (
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? "جاري رفع الوثائق والإرسال..." : <><FiCheck /> إرسال للمراجعة</>}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;