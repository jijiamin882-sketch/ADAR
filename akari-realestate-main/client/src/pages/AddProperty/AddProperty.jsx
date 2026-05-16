import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiMapPin, FiImage, FiCheckCircle, 
  FiChevronLeft, FiArrowLeft, FiShield,    
  FiPlus, FiBook, FiAward, FiShoppingCart, 
  FiTruck, FiSun, FiNavigation, FiInfo, 
  FiEye, FiX, FiRefreshCw, FiUser
} from "react-icons/fi";
import "./AddProperty.css";
import "./AddPropertyImages.css";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function AddProperty() {
  const navigate = useNavigate();
  const { currentUser } = useAuth(); 
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [step, setStep] = useState(0);
  const [validationError, setValidationError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    listingType: "sale", type: "", price: "", area: "", city: "", address: "", title: "", description: "", beds: "", baths: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [idImage, setIdImage] = useState(null);
  const [deedImage, setDeedImage] = useState(null);
  
  const [ownerData, setOwnerData] = useState({ firstName: "", lastName: "", idNumber: "" });

  const uploadDocument = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `${currentUser.id}/${fileName}`;
    const { error } = await supabase.storage.from('property-docs').upload(filePath, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('property-docs').getPublicUrl(filePath);
    return publicUrl;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
    setValidationError("");
  };

  const validateStep = (currentStep) => {
    setValidationError("");
    switch(currentStep) {
      case 0:
        if (!ownerData.firstName || !ownerData.lastName || !ownerData.idNumber || !idImage || !deedImage) {
          setValidationError(t('add_val_0'));
          return false;
        }
        return true;
      case 1:
        if (!formData.type || !formData.price || !formData.area) {
          setValidationError(t('add_val_1'));
          return false;
        }
        return true;
      case 2:
        if (!formData.city || !formData.title || !formData.description) {
          setValidationError(t('add_val_2'));
          return false;
        }
        return true;
      case 3:
        if (!mainImage) {
          setValidationError(t('add_val_3'));
          return false;
        }
        return true;
      default: return true;
    }
  };

  const handleNext = () => { if (validateStep(step)) setStep(step + 1); };
  const handleBack = () => { if (step > 0) setStep(step - 1); };

  const prepareAmenitiesForDB = () => {
    const keys = [
      { key: 'hospital', label: t('add_amenity_hospital') },
      { key: 'school', label: t('add_amenity_school') },
      { key: 'university', label: t('add_amenity_university') },
      { key: 'market', label: t('add_amenity_market') },
      { key: 'mosque', label: t('add_amenity_mosque') },
      { key: 'transport', label: t('add_amenity_transport') },
      { key: 'park', label: t('add_amenity_park') },
      { key: 'road', label: t('add_amenity_road') },
    ];

    return keys
      .filter(item => formData[`amenity_${item.key}_dist`])
      .map(item => ({
        type: item.key,
        name: formData[`amenity_${item.key}_name`] || item.label,
        distance: formData[`amenity_${item.key}_dist`],
        unit: formData[`amenity_${item.key}_unit`] === 'km' ? t('add_unit_km') : t('add_unit_m')
      }));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setValidationError("");
    try {
      const idImageUrl = await uploadDocument(idImage);
      const deedImageUrl = await uploadDocument(deedImage);
      let mainImageUrl = "./default-property.jpg";
      if (mainImage) mainImageUrl = await uploadDocument(mainImage);
      
      let additionalImageUrls = [];
      if (additionalImages.length > 0) {
        additionalImageUrls = await Promise.all(additionalImages.map(img => uploadDocument(img)));
      }

      const { error } = await supabase.from('properties').insert([{
        title: formData.title, listing_type: formData.listingType, type: formData.type,
        price: Number(formData.price), area: Number(formData.area), city: formData.city,
        location: formData.address ? `${formData.city}، ${formData.address}` : formData.city,
        description: formData.description, beds: Number(formData.beds) || 0, baths: Number(formData.baths) || 0,
        owner_name: `${ownerData.firstName} ${ownerData.lastName}`, owner_id_number: ownerData.idNumber,
        owner_email: currentUser.email, image: mainImageUrl, images: additionalImageUrls,
        user_id: currentUser.id, status: 'pending', id_image: idImageUrl, deed_image: deedImageUrl,
        amenities: prepareAmenitiesForDB(),
      }]);

      if (error) throw error;
      navigate("/dashboard/my-properties");
    } catch (error) {
      setValidationError(t('add_err_save') + error.message);
    } finally {
      setUploading(false);
    }
  };

  // <-- 3. ترجمة مصفوفة المرافق
  const amenitiesData = [
    { key: 'hospital', label: t('add_amenity_hospital'), icon: FiPlus, color: 'red' },
    { key: 'school', label: t('add_amenity_school'), icon: FiBook, color: 'blue' },
    { key: 'university', label: t('add_amenity_university'), icon: FiAward, color: 'green' },
    { key: 'market', label: t('add_amenity_market'), icon: FiShoppingCart, color: 'gold' },
    { key: 'mosque', label: t('add_amenity_mosque'), icon: FiMapPin, color: 'purple' },
    { key: 'transport', label: t('add_amenity_transport'), icon: FiTruck, color: 'orange' },
    { key: 'park', label: t('add_amenity_park'), icon: FiSun, color: 'emerald' },
    { key: 'road', label: t('add_amenity_road'), icon: FiNavigation, color: 'slate' },
  ];

  const getAmenitiesSummary = () => {
    return amenitiesData.filter(a => formData[`amenity_${a.key}_dist`]).map(a => {
      const name = formData[`amenity_${a.key}_name`] || a.label;
      const dist = formData[`amenity_${a.key}_dist`];
      const unit = formData[`amenity_${a.key}_unit`] === 'km' ? t('add_unit_km') : t('add_unit_m');
      return <div key={a.key} className="preview-item"><span>• {t('add_away_from')} <strong>{name}</strong> {t('add_distance_word')} <strong>{dist} {unit}</strong></span></div>;
    });
  };

  const RenderReviewStep = () => (
    <div className="form-step review-step">
      <div className="review-header-icon"><FiCheckCircle size={40} /></div>
      <h2>{t('add_review_title')}</h2>
      <p className="step-desc">{t('add_review_desc')}</p>
      <div className="review-grid">
        <div className="review-card">
          <h3><FiShield /> {t('add_review_docs_title')}</h3>
          <p><strong>{t('add_review_name')}:</strong> {ownerData.firstName} {ownerData.lastName}</p>
          <p><strong>{t('add_review_id')}:</strong> {ownerData.idNumber}</p>
          <p><strong>{t('add_review_id_img')}:</strong> {t('add_review_uploaded')}</p>
          <p><strong>{t('add_review_deed')}:</strong> {t('add_review_uploaded')}</p>
        </div>
        <div className="review-card">
          <h3><FiHome /> {t('add_review_details_title')}</h3>
          <p><strong>{t('add_review_purpose')}:</strong> {formData.listingType === 'sale' ? t('pd_for_sale') : t('pd_for_rent')}</p>
          <p><strong>{t('add_review_type')}:</strong> {formData.type} | <strong>{t('pd_area')}:</strong> {formData.area} م²</p>
          <p><strong>{t('add_review_price')}:</strong> {Number(formData.price).toLocaleString()} {t('pd_currency')}</p>
          <p><strong>{t('pd_bedrooms')}:</strong> {formData.beds || 0} | <strong>{t('pd_bathrooms')}:</strong> {formData.baths || 0}</p>
        </div>
        <div className="review-card">
          <h3><FiMapPin /> {t('add_review_loc_title')}</h3>
          <p><strong>{t('add_review_city')}:</strong> {formData.city} - {formData.address || t('add_review_gen_addr')}</p>
          <p><strong>{t('add_review_ad_title')}:</strong> {formData.title}</p>
          <p className="review-desc"><strong>{t('pd_desc_title')}:</strong> {formData.description}</p>
        </div>
        <div className="review-card">
          <h3><FiImage /> {t('pd_map_title')}</h3>
          <div className="review-images-preview">
            {mainImage && <img src={URL.createObjectURL(mainImage)} alt="" className="review-thumb main-thumb" />}
            {additionalImages.slice(0, 3).map((img, i) => <img key={i} src={URL.createObjectURL(img)} alt="" className="review-thumb" />)}
            {additionalImages.length > 3 && <div className="review-thumb more-thumb">+{additionalImages.length - 3}</div>}
          </div>
          <p style={{marginTop: '10px', fontSize: '14px', color: '#94a3b8'}}>{t('add_review_main_img')} + {additionalImages.length} {t('add_review_add_imgs')}</p>
        </div>
        {getAmenitiesSummary().length > 0 && (
          <div className="review-card full-width"><h3><FiNavigation /> {t('pd_amenities_title')}</h3>{getAmenitiesSummary()}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}><FiArrowLeft /> {t('add_back')}</button>
          <h1>{t('add_title')}</h1>
          <p>{step === 4 ? t('add_header_review') : t('add_header_normal')}</p>
        </div>

        <div className="add-prop-progress">
          <div className={`prop-step ${step >= 0 ? 'active' : ''}`}><div className="step-circle"><FiShield /></div><span>{t('add_step_verify')}</span></div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 1 ? 'active' : ''}`}><div className="step-circle"><FiHome /></div><span>{t('add_step_type')}</span></div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 2 ? 'active' : ''}`}><div className="step-circle"><FiMapPin /></div><span>{t('add_step_location')}</span></div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 3 ? 'active' : ''}`}><div className="step-circle"><FiImage /></div><span>{t('add_step_images')}</span></div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 4 ? 'active' : ''}`}><div className="step-circle"><FiCheckCircle /></div><span>{t('add_step_review')}</span></div>
        </div>

        <form className="add-prop-form" onSubmit={handleFinalSubmit}>
          
          {step === 0 && (
            <div className="form-step">
              <h2>{t('add_s0_title')}</h2>
              <p className="step-desc">{t('add_s0_desc')}</p>
              <div className="owner-details-grid">
                <div className="form-group">
                  <label><FiUser style={{verticalAlign: 'middle', marginLeft: '5px'}} /> {t('add_s0_fname')}</label>
                  <input type="text" name="firstName" placeholder={t('add_s0_fname_ph')} value={ownerData.firstName} onChange={handleOwnerChange} />
                </div>
                <div className="form-group">
                  <label>{t('add_s0_lname')}</label>
                  <input type="text" name="lastName" placeholder={t('add_s0_lname_ph')} value={ownerData.lastName} onChange={handleOwnerChange} />
                </div>
              </div>
              <div className="form-group">
                <label>{t('add_s0_id_num')}</label>
                <input type="text" name="idNumber" placeholder={t('add_s0_id_num_ph')} value={ownerData.idNumber} onChange={handleOwnerChange} maxLength={18} style={{direction: 'ltr', textAlign: 'left'}} />
              </div>
              <div style={{ marginTop: '20px', padding: '20px', background: 'rgba(241, 201, 145, 0.05)', border: '1px solid rgba(241, 201, 145, 0.2)', borderRadius: '12px' }}>
                <h3 style={{ color: '#f1c991', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><FiShield /> {t('add_s0_docs_title')}</h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>{t('add_s0_id_img')}</label>
                    <input type="file" accept="image/*" onChange={(e) => setIdImage(e.target.files[0])} style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#e2e8f0', fontSize: '14px' }}>{t('add_s0_deed_img')}</label>
                    <input type="file" accept="image/*" onChange={(e) => setDeedImage(e.target.files[0])} style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="form-step">
              <h2>{t('add_s1_title')}</h2>
              <div className="form-group">
                <label>{t('add_s1_purpose')}</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'sale'})}>{t('pd_for_sale')}</button>
                  <button type="button" className={`toggle-btn rent ${formData.listingType === 'rent' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'rent'})}>{t('pd_for_rent')}</button>
                </div>
              </div>
              <div className="form-group">
                <label>{t('add_s1_type')}</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="">{t('add_s1_type_ph')}</option>
                  <option value="شقة">{t('type_apartment')}</option>
                  <option value="فيلا">{t('type_villa')}</option>
                  <option value="منزل">{t('type_house')}</option>
                  <option value="أرض">{t('type_land')}</option>
                  <option value="محل تجاري">{t('type_commercial')}</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>{t('add_s1_price')}</label><input type="number" name="price" placeholder="15000000" value={formData.price} onChange={handleChange} /></div>
                <div className="form-group"><label>{t('add_s1_area')}</label><input type="number" name="area" placeholder="120" value={formData.area} onChange={handleChange} /></div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>{t('add_s2_title')}</h2>
              <div className="form-row">
                <div className="form-group"><label>{t('add_s2_city')}</label><select name="city" value={formData.city} onChange={handleChange}><option value="">{t('add_s2_city_ph')}</option><option value="الجلفة">{t('city_djelfa')}</option><option value="الجزائر العاصمة">{t('city_algiers')}</option><option value="وهران">{t('city_oran')}</option><option value="تسمسيلت">{t('city_tmsilt')}</option></select></div>
                <div className="form-group"><label>{t('add_s2_address')}</label><input type="text" name="address" placeholder={t('add_s2_address_ph')} value={formData.address} onChange={handleChange} /></div>
              </div>
              <div className="form-group"><label>{t('add_s2_ad_title')}</label><input type="text" name="title" placeholder={t('add_s2_ad_title_ph')} value={formData.title} onChange={handleChange} /></div>
              <div className="form-group"><label>{t('add_s2_desc')}</label><textarea name="description" rows="4" placeholder={t('add_s2_desc_ph')} value={formData.description} onChange={handleChange}></textarea></div>
              
              <div className="amenities-section">
                <div className="amenities-header"><div className="amenities-header-icon"><FiMapPin size={24} /></div><div><h3>{t('add_s2_amenities_title')}</h3><p className="amenities-subtitle">{t('add_s2_amenities_desc')}</p></div></div>
                <div className="amenities-grid">
                  {amenitiesData.map((amenity) => (
                    <div key={amenity.key} className="amenity-card">
                      <div className={`amenity-icon amenity-icon-${amenity.color}`}><amenity.icon size={20} /></div>
                      <div className="amenity-info">
                        <label>{amenity.label}</label>
                        <input type="text" name={`amenity_${amenity.key}_name`} placeholder={`${t('add_s2_am_name')} ${amenity.label}`} value={formData[`amenity_${amenity.key}_name`] || ''} onChange={handleChange} className="amenity-name-input"/>
                        <div className="amenity-distance-wrapper">
                          <input type="number" name={`amenity_${amenity.key}_dist`} placeholder={t('add_s2_am_dist')} min="0" value={formData[`amenity_${amenity.key}_dist`] || ''} onChange={handleChange} className="amenity-input"/>
                          <select name={`amenity_${amenity.key}_unit`} value={formData[`amenity_${amenity.key}_unit`] || 'm'} onChange={handleChange} className="amenity-unit"><option value="m">{t('add_unit_m')}</option><option value="km">{t('add_unit_km')}</option></select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="amenities-note"><FiInfo size={16} /><span>{t('add_s2_am_note')}</span></div>
              </div>

              <div className="form-row">
                <div className="form-group"><label>{t('pd_bedrooms')}</label><input type="number" name="beds" placeholder="0" value={formData.beds} onChange={handleChange} /></div>
                <div className="form-group"><label>{t('pd_bathrooms')}</label><input type="number" name="baths" placeholder="0" value={formData.baths} onChange={handleChange} /></div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>{t('add_s3_title')}</h2>
              <p className="step-desc">{t('add_s3_desc')}</p>
              
              <label className="img-section-label">{t('add_s3_main_img')}</label>
              <div className={`main-image-box ${mainImage ? 'has-image' : ''}`} onClick={() => document.getElementById('mainImageInput').click()}>
                {mainImage ? (
                  <><img src={URL.createObjectURL(mainImage)} alt="" /><div className="main-image-overlay"><span className="main-label-tag">{t('add_s3_main_img')}</span><button type="button" className="replace-image-btn" onClick={(e) => { e.stopPropagation(); document.getElementById('mainImageInput').click(); }}><FiRefreshCw size={14} /> {t('add_s3_replace')}</button><button type="button" className="remove-main-btn" onClick={(e) => { e.stopPropagation(); setMainImage(null); }}><FiX size={14} /></button></div></>
                ) : (
                  <><div className="upload-icon-circle"><FiImage size={28} /></div><p className="empty-text">{t('add_s3_choose_main')}</p><p className="empty-hint">{t('add_s3_drag')}</p></>
                )}
                <input id="mainImageInput" type="file" accept="image/*" style={{display: 'none'}} onChange={(e) => { if (e.target.files[0]) setMainImage(e.target.files[0]); e.target.value = ''; }} />
              </div>

              <label className="img-section-label" style={{marginTop: '28px'}}>{t('add_s3_add_imgs')} {additionalImages.length > 0 && <span className="img-count-badge">{additionalImages.length}</span>}</label>
              <div className="additional-grid">
                {additionalImages.map((file, index) => (
                  <div key={index} className="additional-card"><img src={URL.createObjectURL(file)} alt="" /><span className="card-index">{index + 1}</span><button type="button" className="remove-add-btn" onClick={() => setAdditionalImages(prev => prev.filter((_, i) => i !== index))}><FiX size={11} /></button></div>
                ))}
                <div className="add-more-box" onClick={() => document.getElementById('additionalImagesInput').click()}>
                  <FiPlus size={22} /><span>{t('add_s3_choose_add')}</span><span className="add-hint">{t('add_s3_drag')}</span>
                  <input id="additionalImagesInput" type="file" multiple accept="image/*" style={{display: 'none'}} onChange={(e) => { const files = Array.from(e.target.files); if (files.length) setAdditionalImages(prev => [...prev, ...files]); e.target.value = ''; }} />
                </div>
              </div>
            </div>
          )}

          {step === 4 && <RenderReviewStep />}

          <div className="form-actions" style={{ flexDirection: 'column', gap: '15px' }}>
            {validationError && (
              <div style={{ color: '#f87171', fontSize: '14px', width: '100%', textAlign: 'center', background: 'rgba(248, 113, 113, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                {validationError}
              </div>
            )}

            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              {step > 0 && (
                <button type="button" className="btn-secondary" onClick={handleBack}>
                  <FiChevronLeft /> {t('add_prev')}
                </button>
              )}
              
              {step < 3 && (
                <button type="button" className="submit-btn" onClick={handleNext}>{t('add_next')}</button>
              )}
              {step === 3 && (
                <button type="button" className="submit-btn" onClick={handleNext} style={{background: '#f59e0b'}}>
                  <FiEye /> {t('add_review_btn')}
                </button>
              )}
              {step === 4 && (
                <button type="submit" disabled={uploading} className="submit-btn" style={{background: '#10b981'}}>
                  {uploading ? t('add_uploading') : t('add_submit_btn')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .review-step { text-align: center; }
        .review-header-icon { color: #10b981; margin-bottom: 10px; }
        .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; text-align: right; margin-top: 20px; }
        .review-card { background: rgba(30, 41, 59, 0.8); border: 1px solid #334155; padding: 20px; border-radius: 12px; }
        .review-card.full-width { grid-column: 1 / -1; }
        .review-card h3 { color: #f1c991; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; font-size: 16px; }
        .review-card p { color: #cbd5e1; font-size: 14px; margin-bottom: 8px; line-height: 1.6; }
        .review-desc { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .review-images-preview { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; }
        .review-thumb { width: 80px; height: 60px; object-fit: cover; border-radius: 8px; border: 2px solid #334155; }
        .main-thumb { border-color: #f1c991; }
        .more-thumb { background: #334155; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; }
        @media (max-width: 768px) { .review-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}