import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase, FiDollarSign, FiImage, FiCheck, FiArrowLeft, FiArrowRight,
  FiUploadCloud, FiX, FiPhone, FiUser, FiAlertCircle, FiShield,
} from "react-icons/fi";
import "./AddService.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

const AddService = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const idImageRef = useRef(null);
  const deedImageRef = useRef(null);
  const { currentUser } = useAuth();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  
  const [serviceFiles, setServiceFiles] = useState([]);
  const [servicePreviews, setServicePreviews] = useState([]);
  const [idImage, setIdImage] = useState(null);
  const [deedImage, setDeedImage] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    category: "", title: "", providerName: "", wilaya: "", priceType: "", price: "", description: "", phone: "",
  });

  // <-- 3. ترجمة خطوات النموذج
  const steps = [
    { id: 1, label: t('svc_step1_label'), icon: <FiBriefcase /> },
    { id: 2, label: t('svc_step2_label'), icon: <FiDollarSign /> },
    { id: 3, label: t('svc_step3_label'), icon: <FiImage /> },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentUser.id}/services/${fileName}`;
    const { error } = await supabase.storage.from('property-docs').upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('property-docs').getPublicUrl(filePath);
    return publicUrl;
  };

  // <-- 4. ترجمة رسائل التحقق (Validation)
  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.category.trim()) newErrors.category = t('svc_err_category');
      if (!formData.title.trim()) newErrors.title = t('svc_err_title');
      if (!formData.providerName.trim()) newErrors.providerName = t('svc_err_provider');
      if (!formData.wilaya.trim()) newErrors.wilaya = t('svc_err_wilaya');
    }
    if (step === 2) {
      if (!formData.priceType) newErrors.priceType = t('svc_err_pricetype');
      if (formData.priceType !== "negotiable" && !formData.price.trim()) newErrors.price = t('svc_err_price');
      if (!formData.description.trim()) newErrors.description = t('svc_err_desc');
    }
    if (step === 3) {
      if (!formData.phone.trim()) newErrors.phone = t('svc_err_phone');
      else {
        const cleanPhone = formData.phone.replace(/\s/g, '');
        if (!/^0[5-7]\d{8}$/.test(cleanPhone)) newErrors.phone = t('svc_err_phone_format');
      }
      if (!idImage) newErrors.idImage = t('svc_err_id');
      if (!deedImage) newErrors.deedImage = t('svc_err_deed');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep((prev) => prev + 1); };
  const handlePrev = () => { if (currentStep > 1) setCurrentStep((prev) => prev - 1); setErrors({}); };

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
    if (!currentUser) { alert(t('svc_alert_login')); return; }
    
    setUploading(true);
    try {
      let uploadedImagesUrls = [];
      if (serviceFiles.length > 0) {
        for (const file of serviceFiles) { const url = await uploadFile(file); uploadedImagesUrls.push(url); }
      }
      const idImageUrl = await uploadFile(idImage);
      const deedImageUrl = await uploadFile(deedImage);

      const { error } = await supabase.from('services').insert([{
        user_id: currentUser.id, category: formData.category, title: formData.title,
        provider_name: formData.providerName, wilaya: formData.wilaya, price_type: formData.priceType,
        price: formData.priceType === 'negotiable' ? 0 : Number(formData.price), description: formData.description,
        phone: formData.phone, images: uploadedImagesUrls, id_image: idImageUrl, deed_image: deedImageUrl, status: "pending"
      }]).select();

      if (error) throw error;
      alert(t('svc_alert_success'));
      navigate("/dashboard/my-services");
    } catch (error) {
      console.error("Error:", error);
      alert(t('svc_alert_fail') + error.message);
    } finally {
      setUploading(false);
    }
  };
   
  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}><FiArrowRight /> {t('svc_back')}</button>
          <h1>{t('svc_title')}</h1>
          <p>{t('svc_header_desc')}</p>
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
            
            {currentStep === 1 && (
              <div className="form-step">
                <h2>{t('svc_s1_title')}</h2>
                <p className="step-desc">{t('svc_s1_desc')}</p>
                
                <div className="form-group">
                  <label>{t('svc_s1_category')}</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className={errors.category ? "input-error" : ""}>
                    <option value="">{t('svc_s1_category_ph')}</option>
                    <option value="maintenance">{t('svc_opt_maintenance')}</option>
                    <option value="transport">{t('svc_opt_transport')}</option>
                    <option value="architecture">{t('svc_opt_architecture')}</option>
                    <option value="legal">{t('svc_opt_legal')}</option>
                    <option value="cleaning">{t('svc_opt_cleaning')}</option>
                    <option value="other">{t('svc_opt_other')}</option>
                  </select>
                  {errors.category && <span className="error-text"><FiAlertCircle /> {errors.category}</span>}
                </div>

                <div className="form-group">
                  <label>{t('svc_s1_title_label')}</label>
                  <input type="text" name="title" placeholder={t('svc_s1_title_ph')} value={formData.title} onChange={handleInputChange} className={errors.title ? "input-error" : ""} />
                  {errors.title && <span className="error-text"><FiAlertCircle /> {errors.title}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label><FiUser /> {t('svc_s1_provider')}</label>
                    <input type="text" name="providerName" placeholder={t('svc_s1_provider_ph')} value={formData.providerName} onChange={handleInputChange} className={errors.providerName ? "input-error" : ""} />
                    {errors.providerName && <span className="error-text"><FiAlertCircle /> {errors.providerName}</span>}
                  </div>
                  <div className="form-group">
                    <label>{t('svc_s1_wilaya')}</label>
                    <input type="text" name="wilaya" placeholder={t('svc_s1_wilaya_ph')} value={formData.wilaya} onChange={handleInputChange} className={errors.wilaya ? "input-error" : ""} />
                    {errors.wilaya && <span className="error-text"><FiAlertCircle /> {errors.wilaya}</span>}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h2>{t('svc_s2_title')}</h2>
                <p className="step-desc">{t('svc_s2_desc')}</p>
                
                <div className="form-group">
                  <label>{t('svc_s2_pricetype')}</label>
                  <div className="toggle-group">
                    {[{ id: "fixed", label: t('svc_opt_fixed') }, { id: "hourly", label: t('svc_opt_hourly') }, { id: "negotiable", label: t('svc_opt_negotiable') }].map((opt) => (
                      <button type="button" key={opt.id} className={`toggle-btn ${formData.priceType === opt.id ? "active" : ""}`} onClick={() => handleInputChange({ target: { name: "priceType", value: opt.id } })}>{opt.label}</button>
                    ))}
                  </div>
                  {errors.priceType && <span className="error-text"><FiAlertCircle /> {errors.priceType}</span>}
                </div>

                {formData.priceType && formData.priceType !== "negotiable" && (
                  <div className="form-group">
                    <label>{t('svc_s2_price')} {formData.priceType === 'hourly' ? t('svc_s2_price_hr') : ''} *</label>
                    <input type="text" name="price" placeholder="5000" value={formData.price} onChange={handleInputChange} className={errors.price ? "input-error" : ""} />
                    {errors.price && <span className="error-text"><FiAlertCircle /> {errors.price}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label>{t('svc_s2_desc_label')}</label>
                  <textarea name="description" rows="6" placeholder={t('svc_s2_desc_ph')} value={formData.description} onChange={handleInputChange} className={errors.description ? "input-error" : ""}></textarea>
                  {errors.description && <span className="error-text"><FiAlertCircle /> {errors.description}</span>}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h2>{t('svc_s3_title')}</h2>
                <p className="step-desc">{t('svc_s3_desc')}</p>
                
                <div className="upload-area" onClick={() => fileInputRef.current.click()}>
                  <FiUploadCloud size={40} style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.3)' }} />
                  <h3>{t('svc_s3_upload_title')}</h3>
                  <p>{t('svc_s3_upload_desc')}</p>
                  <button type="button" className="upload-btn">{t('svc_s3_choose_btn')}</button>
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleServiceImagesChange} hidden />
                </div>

                {servicePreviews.length > 0 && (
                  <div className="images-preview-grid">
                    {servicePreviews.map((img, index) => (
                      <div key={index} className="preview-item"><img src={img} alt="" /><button type="button" className="remove-img-btn" onClick={() => removeServiceImage(index)}><FiX /></button></div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(241, 201, 145, 0.05)', border: '1px solid rgba(241, 201, 145, 0.2)', borderRadius: '12px' }}>
                  <h3 style={{ color: '#f1c991', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiShield /> {t('svc_s3_verify_title')}</h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>{t('svc_s3_verify_desc')}</p>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>{t('svc_s3_id_label')}</label>
                      <input type="file" accept="image/*" ref={idImageRef} onChange={(e) => { setIdImage(e.target.files[0]); if(errors.idImage) setErrors(prev => ({...prev, idImage: ""})); }} style={{ width: '100%', padding: '10px', background: '#1e293b', border: errors.idImage ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                      {errors.idImage && <span className="error-text" style={{marginTop: '5px', display: 'block'}}><FiAlertCircle /> {errors.idImage}</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>{t('svc_s3_deed_label')}</label>
                      <input type="file" accept="image/*" ref={deedImageRef} onChange={(e) => { setDeedImage(e.target.files[0]); if(errors.deedImage) setErrors(prev => ({...prev, deedImage: ""})); }} style={{ width: '100%', padding: '10px', background: '#1e293b', border: errors.deedImage ? '1px solid #ef4444' : '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                      {errors.deedImage && <span className="error-text" style={{marginTop: '5px', display: 'block'}}><FiAlertCircle /> {errors.deedImage}</span>}
                    </div>
                  </div>
                </div>

                <div className="form-notice-box" style={{ marginTop: '30px', marginBottom: '20px' }}>
                  <FiPhone style={{ color: '#f1c991', flexShrink: 0, marginTop: '2px' }} />
                  <p>{t('svc_s3_phone_notice')}</p>
                </div>

                <div className="form-group">
                  <label><FiPhone /> {t('svc_s3_phone_label')}</label>
                   <input type="tel" name="phone" placeholder={t('svc_s3_phone_ph')} value={formData.phone} onChange={(e) => { const onlyNumbers = e.target.value.replace(/[^0-9\s]/g, ''); handleInputChange({ target: { name: "phone", value: onlyNumbers } }); }} className={`phone-input ${errors.phone ? "input-error" : ""}`} inputMode="numeric" maxLength={10} />
                  {errors.phone && <span className="error-text"><FiAlertCircle /> {errors.phone}</span>}
                </div>
              </div>
            )}

            <div className="form-actions">
              {currentStep > 1 && (<button type="button" className="btn-secondary" onClick={handlePrev}><FiArrowRight /> {t('svc_prev')}</button>)}
              {currentStep < 3 ? (
                <button type="button" className="btn-primary" onClick={handleNext}>{t('svc_next')} <FiArrowLeft /></button>
              ) : (
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {uploading ? t('svc_uploading') : <><FiCheck /> {t('svc_submit')}</>}
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