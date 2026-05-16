import React, { useState } from 'react';
import { FiFileText, FiShield, FiClock, FiUsers, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Notaries.css';
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

const Notaries = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success(t('not_success_msg'), { position: "top-center" });
    setShowModal(false);
  };

  return (
    <div className="notary-page-wrapper">
      
      <div className="notary-hero">
        <div className="notary-hero-icon"><FiFileText /></div>
        <h1>{t('not_hero_title')}</h1>
        <p>{t('not_hero_desc')}</p>
      </div>

      <div className="notary-content-container">
        
        <div className="notary-section-box">
          <h2>{t('not_why_title')}</h2>
          <div className="notary-features-grid">
            <div className="notary-feature-item">
              <FiShield className="notary-feat-icon" />
              <h3>{t('not_feat1_title')}</h3>
              <p>{t('not_feat1_desc')}</p>
            </div>
            <div className="notary-feature-item">
              <FiClock className="notary-feat-icon" />
              <h3>{t('not_feat2_title')}</h3>
              <p>{t('not_feat2_desc')}</p>
            </div>
            <div className="notary-feature-item">
              <FiUsers className="notary-feat-icon" />
              <h3>{t('not_feat3_title')}</h3>
              <p>{t('not_feat3_desc')}</p>
            </div>
          </div>
        </div>

        <div className="notary-section-box notary-steps-box">
          <h2>{t('not_how_title')}</h2>
          <div className="notary-steps-flex">
            <div className="notary-step">
              <div className="step-num">1</div>
              <h4>{t('not_step1_title')}</h4>
              <p>{t('not_step1_desc')}</p>
            </div>
            <FiArrowLeft className="step-arrow" />
            <div className="notary-step">
              <div className="step-num">2</div>
              <h4>{t('not_step2_title')}</h4>
              <p>{t('not_step2_desc')}</p>
            </div>
            <FiArrowLeft className="step-arrow" />
            <div className="notary-step">
              <div className="step-num">3</div>
              <h4>{t('not_step3_title')}</h4>
              <p>{t('not_step3_desc')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="notary-actions-bar">
        <button className="notary-back-btn" onClick={() => navigate('/Services')}>
          {t('not_back_btn')}
        </button>
        <button className="notary-cta-btn" onClick={() => setShowModal(true)}>
          {t('not_cta_btn')}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('not_modal_title')}</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">{t('not_modal_desc')}</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder={t('not_ph_name')} required />
              <input type="tel" placeholder={t('not_ph_phone')} required />
              <textarea rows="4" placeholder={t('not_ph_desc')}></textarea>
              
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>{t('not_cancel_btn')}</button>
                <button type="submit" className="modal-submit-btn">{t('not_submit_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Notaries;