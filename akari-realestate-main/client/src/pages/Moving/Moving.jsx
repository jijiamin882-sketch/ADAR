import React, { useState } from 'react';
import { FiTruck, FiShield, FiClock, FiMapPin, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Moving.css';
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

const Moving = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success(t('mov_success_msg'), {
      position: "top-center"
    });
    setShowModal(false);
  };

  return (
    <div className="moving-page-wrapper">
      
      <div className="moving-hero">
        <div className="moving-hero-icon">
          <FiTruck />
        </div>
        <h1>{t('mov_hero_title')}</h1>
        <p>{t('mov_hero_desc')}</p>
      </div>

      <div className="moving-content-container">
        
        <div className="moving-section-box">
          <h2>{t('mov_why_title')}</h2>
          <div className="moving-features-grid">
            <div className="moving-feature-item">
              <FiShield className="moving-feat-icon" />
              <h3>{t('mov_feat1_title')}</h3>
              <p>{t('mov_feat1_desc')}</p>
            </div>
            <div className="moving-feature-item">
              <FiClock className="moving-feat-icon" />
              <h3>{t('mov_feat2_title')}</h3>
              <p>{t('mov_feat2_desc')}</p>
            </div>
            <div className="moving-feature-item">
              <FiMapPin className="moving-feat-icon" />
              <h3>{t('mov_feat3_title')}</h3>
              <p>{t('mov_feat3_desc')}</p>
            </div>
          </div>
        </div>

        <div className="moving-section-box moving-steps-box">
          <h2>{t('mov_how_title')}</h2>
          <div className="moving-steps-flex">
            <div className="moving-step">
              <div className="moving-step-num">1</div>
              <h4>{t('mov_step1_title')}</h4>
              <p>{t('mov_step1_desc')}</p>
            </div>
            <FiArrowLeft className="moving-step-arrow" />
            <div className="moving-step">
              <div className="moving-step-num">2</div>
              <h4>{t('mov_step2_title')}</h4>
              <p>{t('mov_step2_desc')}</p>
            </div>
            <FiArrowLeft className="moving-step-arrow" />
            <div className="moving-step">
              <div className="moving-step-num">3</div>
              <h4>{t('mov_step3_title')}</h4>
              <p>{t('mov_step3_desc')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="moving-actions-bar">
        <button className="moving-back-btn" onClick={() => navigate('/Services')}>
          {t('mov_back_btn')}
        </button>
        <button className="moving-cta-btn" onClick={() => setShowModal(true)}>
          {t('mov_cta_btn')}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('mov_modal_title')}</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">{t('mov_modal_desc')}</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder={t('mov_ph_name')} required />
              <input type="tel" placeholder={t('mov_ph_phone')} required />
              <select required defaultValue="">
                <option value="" disabled>{t('mov_ph_type')}</option>
                <option value="local">{t('mov_opt_local')}</option>
                <option value="intercity">{t('mov_opt_intercity')}</option>
                <option value="office">{t('mov_opt_office')}</option>
                <option value="furniture-only">{t('mov_opt_furniture')}</option>
              </select>
              <textarea rows="4" placeholder={t('mov_ph_desc')}></textarea>
              
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>{t('mov_cancel_btn')}</button>
                <button type="submit" className="modal-submit-btn">{t('mov_submit_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Moving;