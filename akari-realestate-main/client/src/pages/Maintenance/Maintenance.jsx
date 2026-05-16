import React, { useState } from 'react';
import { FiTool, FiZap, FiUserCheck, FiSettings, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Maintenance.css';
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

const Maintenance = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success(t('maint_success_msg'), {
      position: "top-center"
    });
    setShowModal(false);
  };

  return (
    <div className="maintenance-page-wrapper">
      
      <div className="maintenance-hero">
        <div className="maintenance-hero-icon">
          <FiTool />
        </div>
        <h1>{t('maint_hero_title')}</h1>
        <p>{t('maint_hero_desc')}</p>
      </div>

      <div className="maintenance-content-container">
        
        <div className="maintenance-section-box">
          <h2>{t('maint_why_title')}</h2>
          <div className="maintenance-features-grid">
            <div className="maintenance-feature-item">
              <FiZap className="maintenance-feat-icon" />
              <h3>{t('maint_feat1_title')}</h3>
              <p>{t('maint_feat1_desc')}</p>
            </div>
            <div className="maintenance-feature-item">
              <FiUserCheck className="maintenance-feat-icon" />
              <h3>{t('maint_feat2_title')}</h3>
              <p>{t('maint_feat2_desc')}</p>
            </div>
            <div className="maintenance-feature-item">
              <FiSettings className="maintenance-feat-icon" />
              <h3>{t('maint_feat3_title')}</h3>
              <p>{t('maint_feat3_desc')}</p>
            </div>
          </div>
        </div>

        <div className="maintenance-section-box maintenance-steps-box">
          <h2>{t('maint_how_title')}</h2>
          <div className="maintenance-steps-flex">
            <div className="maintenance-step">
              <div className="maintenance-step-num">1</div>
              <h4>{t('maint_step1_title')}</h4>
              <p>{t('maint_step1_desc')}</p>
            </div>
            <FiArrowLeft className="maintenance-step-arrow" />
            <div className="maintenance-step">
              <div className="maintenance-step-num">2</div>
              <h4>{t('maint_step2_title')}</h4>
              <p>{t('maint_step2_desc')}</p>
            </div>
             <FiArrowLeft className="maintenance-step-arrow" />
            
            <div className="maintenance-step">
              <div className="maintenance-step-num">3</div>
              <h4>{t('maint_step3_title')}</h4>
              <p>{t('maint_step3_desc')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="maintenance-actions-bar">
        <button className="maintenance-back-btn" onClick={() => navigate('/Services')}>
          {t('maint_back_btn')}
        </button>
        <button className="maintenance-cta-btn" onClick={() => setShowModal(true)}>
          {t('maint_cta_btn')}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('maint_modal_title')}</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">{t('maint_modal_desc')}</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder={t('maint_ph_name')} required />
              <input type="tel" placeholder={t('maint_ph_phone')} required />
              <select required defaultValue="">
                <option value="" disabled>{t('maint_ph_type')}</option>
                <option value="plumbing">{t('maint_opt_plumbing')}</option>
                <option value="electrical">{t('maint_opt_electrical')}</option>
                <option value="ac">{t('maint_opt_ac')}</option>
                <option value="painting">{t('maint_opt_painting')}</option>
                <option value="other">{t('maint_opt_other')}</option>
              </select>
              <textarea rows="4" placeholder={t('maint_ph_desc')}></textarea>
              
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>{t('maint_cancel_btn')}</button>
                <button type="submit" className="modal-submit-btn">{t('maint_submit_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;