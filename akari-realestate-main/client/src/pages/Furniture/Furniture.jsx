import React, { useState } from 'react';
import { FiLayout, FiStar, FiPackage, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Furniture.css';
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

const Furniture = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success(t('fur_success_msg'), {
      position: "top-center"
    });
    setShowModal(false);
  };

  return (
    <div className="furniture-page-wrapper">
      
      <div className="furniture-hero">
        <div className="furniture-hero-icon">
          <FiLayout />
        </div>
        <h1>{t('fur_hero_title')}</h1>
        <p>{t('fur_hero_desc')}</p>
      </div>

      <div className="furniture-content-container">
        
        <div className="furniture-section-box">
          <h2>{t('fur_why_title')}</h2>
          <div className="furniture-features-grid">
            <div className="furniture-feature-item">
              <FiLayout className="furniture-feat-icon" />
              <h3>{t('fur_feat1_title')}</h3>
              <p>{t('fur_feat1_desc')}</p>
            </div>
            <div className="furniture-feature-item">
              <FiStar className="furniture-feat-icon" />
              <h3>{t('fur_feat2_title')}</h3>
              <p>{t('fur_feat2_desc')}</p>
            </div>
            <div className="furniture-feature-item">
              <FiPackage className="furniture-feat-icon" />
              <h3>{t('fur_feat3_title')}</h3>
              <p>{t('fur_feat3_desc')}</p>
            </div>
          </div>
        </div>

        <div className="furniture-section-box furniture-steps-box">
          <h2>{t('fur_how_title')}</h2>
          <div className="furniture-steps-flex">
            <div className="furniture-step">
              <div className="furniture-step-num">1</div>
              <h4>{t('fur_step1_title')}</h4>
              <p>{t('fur_step1_desc')}</p>
            </div>
            <FiArrowLeft className="furniture-step-arrow" />
            <div className="furniture-step">
              <div className="furniture-step-num">2</div>
              <h4>{t('fur_step2_title')}</h4>
              <p>{t('fur_step2_desc')}</p>
            </div>
            <FiArrowLeft className="furniture-step-arrow" />
            <div className="furniture-step">
              <div className="furniture-step-num">3</div>
              <h4>{t('fur_step3_title')}</h4>
              <p>{t('fur_step3_desc')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="furniture-actions-bar">
        <button className="furniture-back-btn" onClick={() => navigate('/Services')}>
          {t('fur_back_btn')}
        </button>
        <button className="furniture-cta-btn" onClick={() => setShowModal(true)}>
          {t('fur_cta_btn')}
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('fur_modal_title')}</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">{t('fur_modal_desc')}</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder={t('fur_ph_name')} required />
              <input type="tel" placeholder={t('fur_ph_phone')} required />
              <select required defaultValue="">
                <option value="" disabled>{t('fur_ph_type')}</option>
                <option value="bedroom">{t('fur_opt_bedroom')}</option>
                <option value="living">{t('fur_opt_living')}</option>
                <option value="kitchen">{t('fur_opt_kitchen')}</option>
                <option value="office">{t('fur_opt_office')}</option>
                <option value="full">{t('fur_opt_full')}</option>
              </select>
              <textarea rows="4" placeholder={t('fur_ph_details')}></textarea>
              
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>{t('fur_cancel_btn')}</button>
                <button type="submit" className="modal-submit-btn">{t('fur_submit_btn')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Furniture;