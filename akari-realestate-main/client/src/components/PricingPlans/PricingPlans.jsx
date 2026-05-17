import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiZap, FiStar, FiLayout, FiShield, FiBox, FiGrid, FiCreditCard, FiLock } from "react-icons/fi";
import "./PricingPlans.css";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة

export default function PricingPlans() {
  const { t } = useTranslation(); // تعريف الترجمة
  
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

  // تم نقل المصفوفة للداخل لترجمتها
  const plans = [
    {
      id: "free",
      name: t('pricing_plan_free_name'),
      desc: t('pricing_plan_free_desc'),
      price: "0",
      period: t('pricing_period_permanent'),
      icon: <FiZap />,
      style: "basic",
      features: [
        { text: t('pricing_plan_free_feat_1'), included: true },
        { text: t('pricing_plan_free_feat_2'), included: true },
        { text: t('pricing_plan_free_feat_3'), included: true },
        { text: t('pricing_plan_free_feat_4'), included: false },
        { text: t('pricing_plan_free_feat_5'), included: false },
      ],
    },
    {
      id: "normal",
      name: t('pricing_plan_normal_name'),
      desc: t('pricing_plan_normal_desc'),
      price: "500",
      period: t('pricing_period_monthly'),
      icon: <FiLayout />,
      style: "standard",
      features: [
        { text: t('pricing_plan_normal_feat_1'), included: true },
        { text: t('pricing_plan_normal_feat_2'), included: true },
        { text: t('pricing_plan_normal_feat_3'), included: true },
        { text: t('pricing_plan_normal_feat_4'), included: false },
        { text: t('pricing_plan_normal_feat_5'), included: false },
      ],
    },
    {
      id: "premium",
      name: t('pricing_plan_premium_name'),
      desc: t('pricing_plan_premium_desc'),
      price: "2,500",
      period: t('pricing_period_monthly'),
      icon: <FiStar />,
      style: "popular",
      features: [
        { text: t('pricing_plan_premium_feat_1'), included: true },
        { text: t('pricing_plan_premium_feat_2'), included: true },
        { text: t('pricing_plan_premium_feat_3'), included: true },
        { text: t('pricing_plan_premium_feat_4'), included: true },
        { text: t('pricing_plan_premium_feat_5'), included: false },
      ],
    },
    {
      id: "certification",
      name: t('pricing_plan_cert_name'),
      desc: t('pricing_plan_cert_desc'),
      price: "5,000",
      period: t('pricing_period_once'),
      icon: <FiShield />,
      style: "standard",
      features: [
        { text: t('pricing_plan_cert_feat_1'), included: true },
        { text: t('pricing_plan_cert_feat_2'), included: true },
        { text: t('pricing_plan_cert_feat_3'), included: true },
        { text: t('pricing_plan_cert_feat_4'), included: true },
        { text: t('pricing_plan_cert_feat_5'), included: false },
      ],
    },
    {
      id: "banner",
      name: t('pricing_plan_banner_name'),
      desc: t('pricing_plan_banner_desc'),
      price: "15,000",
      period: t('pricing_period_monthly'),
      icon: <FiBox />,
      style: "premium",
      features: [
        { text: t('pricing_plan_banner_feat_1'), included: true },
        { text: t('pricing_plan_banner_feat_2'), included: true },
        { text: t('pricing_plan_banner_feat_3'), included: true },
        { text: t('pricing_plan_banner_feat_4'), included: true },
        { text: t('pricing_plan_banner_feat_5'), included: false },
      ],
    },
    {
      id: "office",
      name: t('pricing_plan_office_name'),
      desc: t('pricing_plan_office_desc'),
      price: "10,000",
      period: t('pricing_period_monthly'),
      icon: <FiGrid />,
      style: "premium",
      features: [
        { text: t('pricing_plan_office_feat_1'), included: true },
        { text: t('pricing_plan_office_feat_2'), included: true },
        { text: t('pricing_plan_office_feat_3'), included: true },
        { text: t('pricing_plan_office_feat_4'), included: true },
        { text: t('pricing_plan_office_feat_5'), included: false },
      ],
    },
  ];

  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showPaymentModal]);

  const handleOpenPayment = (plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    setLoadingPlan(selectedPlan.id);
    setTimeout(() => {
      // استخدام المتغيرات في الترجمة
      alert(t('pricing_alert_success', { name: selectedPlan.name, price: selectedPlan.price, period: selectedPlan.period }));
      setLoadingPlan(null);
      setShowPaymentModal(false);
      setCardData({ number: '', expiry: '', cvv: '' });
    }, 2000);
  };

  return (
    <div className="pricing-page-wrapper">
      <div className="pricing-container">
        <div className="pricing-header">
          <span className="pricing-badge">{t('pricing_header_badge')}</span>
          <h1>{t('pricing_header_title')}</h1>
          <p>{t('pricing_header_desc')}</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.style}`}>
              {plan.style === 'popular' && <div className="popular-tag">{t('pricing_popular_tag')}</div>}
              
              <div className="pricing-card-header">
                <div className="pricing-icon">{plan.icon}</div>
                <h3>{plan.name}</h3>
                <p>{plan.desc}</p>
              </div>

              <div className="pricing-card-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-currency">{t('pricing_currency')} <small style={{color: '#64748b'}}>/ {plan.period}</small></span>
              </div>

              <ul className="pricing-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className={!feature.included ? 'disabled' : ''}>
                    {feature.included ? <FiCheck className="icon-check" /> : <FiX className="icon-x" />}
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>

              <button 
                className={`pricing-btn ${plan.style === 'popular' ? 'btn-popular' : ''}`}
                onClick={() => plan.id === 'free' ? alert(t('pricing_alert_free')) : handleOpenPayment(plan)}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? t('pricing_btn_loading') : plan.id === 'free' ? t('pricing_btn_free') : t('pricing_btn_subscribe')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* === نافذة الدفع المنبثقة === */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}><FiX /></button>

            <div className="modal-header">
              <h2>{t('pricing_modal_title')}</h2>
              <p>{t('pricing_modal_subtitle')} <strong>{selectedPlan?.name}</strong></p>
            </div>

            <div className="modal-amount-display">
              <span className="amount-label">{t('pricing_modal_amount_label')}</span>
              <span className="amount-value">{selectedPlan?.price} <small>{t('pricing_currency')}</small></span>
              <span className="amount-period">({selectedPlan?.period})</span>
            </div>

            <form onSubmit={handlePaySubmit} className="payment-form">
              <div className="card-preview">
                <div className="card-preview-header">
                  <span>{t('pricing_card_bank_name')}</span>
                  <span>{t('pricing_card_bank_type')}</span>
                </div>
                <div className="card-preview-number">
                  {cardData.number.replace(/\s/g, '').length > 0 
                    ? cardData.number.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').padEnd(19, '•')
                    : '•••• •••• •••• ••••'}
                </div>
                <div className="card-preview-footer">
                  <span>{cardData.expiry || 'MM/YY'}</span>
                  <span>{cardData.cvv ? `••• ${cardData.cvv}` : '••••'}</span>
                </div>
              </div>

              <div className="form-group">
                <label>{t('pricing_modal_number_label')}</label>
                <input 
                  type="text" 
                  maxLength={19}
                  placeholder="0000 0000 0000 0000" 
                  value={cardData.number}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ');
                    setCardData({...cardData, number: val});
                  }}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('pricing_modal_expiry_label')}</label>
                  <input 
                    type="text" 
                    maxLength={5}
                    placeholder="MM/YY" 
                    value={cardData.expiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.slice(0,2) + '/' + val.slice(2);
                      setCardData({...cardData, expiry: val});
                    }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{t('pricing_modal_cvv_label')}</label>
                  <input 
                    type="password" 
                    maxLength={3}
                    placeholder="•••" 
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '')})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="pay-submit-btn" disabled={loadingPlan === selectedPlan?.id}>
                {loadingPlan === selectedPlan?.id ? (
                  <>{t('pricing_modal_processing')}</>
                ) : (
                  <><FiLock /> {t('pricing_modal_btn_pay')} ({selectedPlan?.price} {t('pricing_currency')})</>
                )}
              </button>

              <div className="secure-note">
                <FiLock size={14} /> {t('pricing_modal_secure_note')}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}