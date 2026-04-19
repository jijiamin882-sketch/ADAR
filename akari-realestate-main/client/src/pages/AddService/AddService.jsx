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
} from "react-icons/fi";
import "./AddService.css";

const AddService = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({}); // لحفظ أخطاء كل خطوة
  
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
    { id: 3, label: "الصور والتواصل", icon: <FiImage /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // مسح الخطأ عند الكتابة
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // === دالة التحقق من الحقول قبل الانتقال ===
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
      if (!formData.phone.trim()) newErrors.phone = "رقم الهاتف للتواصل مطلوب";
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
    setErrors({}); // مسح الأخطاء عند العودة
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // تحقق أخير للخطوة 3
    if (!validateStep(3)) return;
    
    console.log("تم إرسال بيانات الخدمة:", { ...formData, images });
    alert("تم نشر خدمتك بنجاح في سوق ADAR!");
    navigate("/services");
  };

  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        
        {/* الهيدر */}
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}>
            <FiArrowRight /> رجوع
          </button>
          <h1>أضف خدمتك إلى سوق ADAR</h1>
          <p>اعرض خدماتك العقارية وصل بآلاف العملاء المحتملين</p>
        </div>

        {/* مؤشر الخطوات */}
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

        {/* النموذج */}
        <div className="add-prop-form">
          <form onSubmit={handleSubmit}>
            
            {/* الخطوة 1 */}
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

            {/* الخطوة 2 */}
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

            {/* الخطوة 3 */}
            {currentStep === 3 && (
              <div className="form-step">
                <h2>معرض الأعمال والتواصل</h2>
                <p className="step-desc">أضف صوراً ل أعمالك لزيادة ثقة العملاء بك</p>
                
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                  <FiUploadCloud size={40} style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.3)' }} />
                  <h3>أضف صور أعمالك السابقة</h3>
                  <p>اسحب الصور هنا أو اضغط للاختيار</p>
                  <button type="button" className="upload-btn">اختر الصور</button>
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageChange} hidden />
                </div>

                {images.length > 0 && (
                  <div className="images-preview-grid">
                    {images.map((img, index) => (
                      <div key={index} className="preview-item">
                        <img src={img} alt={`preview ${index}`} />
                        <button type="button" className="remove-img-btn" onClick={() => removeImage(index)}>
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-notice-box" style={{ marginTop: '30px', marginBottom: '30px' }}>
                  <FiPhone style={{ color: '#f1c991', flexShrink: 0, marginTop: '2px' }} />
                  <p>رقم الهاتف هو وسيلة التواصل الأساسية بينك وبين العميل، تأكد من صحته.</p>
                </div>

                <div className="form-group">
                  <label><FiPhone /> رقم الهاتف / الواتساب  </label>
                  <input type="tel" name="phone" placeholder="05XX XX XX XX" value={formData.phone} onChange={handleInputChange} className={`phone-input ${errors.phone ? "input-error" : ""}`} />
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
                <button type="submit" className="btn-primary">
                  <FiCheck /> نشر الخدمة الآن
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