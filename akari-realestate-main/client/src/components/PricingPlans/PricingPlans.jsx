import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiZap, FiStar, FiLayout, FiShield, FiBox, FiGrid, FiCreditCard, FiLock } from "react-icons/fi";
import "./PricingPlans.css";

const plans = [
  {
    id: "free",
    name: "مجاني",
    desc: "للتجربة المنصة ونشر عقار واحد بحد أقصى.",
    price: "0",
    period: "دائم",
    icon: <FiZap />,
    style: "basic",
    features: [
      { text: "نشر 1 عقار فقط", included: true },
      { text: "صور عادية الجودة", included: true },
      { text: "الظهور في نتائج البحث العادية", included: true },
      { text: "شارة (مميز) للإعلان", included: false },
      { text: "أولوية ظهور في الموقع", included: false },
    ],
  },
  {
    id: "normal",
    name: "إعلان عادي لعقارك",
    desc: "لنشر إعلانك العقاري بشكل موسع في قسم العقارات.",
    price: "500",
    period: "شهرياً",
    icon: <FiLayout />,
    style: "standard",
    features: [
      { text: "نشر الإعلان في قسم العقارات", included: true },
      { text: "صور متعددة للعقار", included: true },
      { text: "الظهور في نتائج البحث العادية", included: true },
      { text: "شارة (مميز) للإعلان", included: false },
      { text: "أولوية ظهور في الموقع", included: false },
    ],
  },
  {
    id: "premium",
    name: "إعلان ممتاز لعقارك",
    desc: "لجذب انتباه الآلاف! يظهر في أعلى النتائج بشارة مميزة.",
    price: "2,500",
    period: "شهرياً",
    icon: <FiStar />,
    style: "popular",
    features: [
      { text: "نشر الإعلان بقوة في قسم العقارات", included: true },
      { text: "صور عالية الجودة (HD)", included: true },
      { text: 'شارة "مميز" ذهبية على الإعلان', included: true },
      { text: "أولوية قصوى في نتائج البحث", included: true },
      { text: "الظهور في الصفحة الرئيسية", included: false },
    ],
  },
  {
    id: "certification",
    name: "خدمة توثيق عقار",
    desc: "لإصدار شهادة توثيق رسمية تزيد من ثقة المشتري بعقارك.",
    price: "5,000",
    period: "عملية واحدة",
    icon: <FiShield />,
    style: "standard",
    features: [
      { text: "إصدار شهادة توثيق رسمية", included: true },
      { text: "شارة (موثق) تظهر على الإعلان", included: true },
      { text: "تقرير تقييم عقاري أولي", included: true },
      { text: "متابعة حالة التوثيق", included: true },
      { text: "ترقية تلقائية للإعلان المميز", included: false },
    ],
  },
  {
    id: "banner",
    name: "لافتة إعلانية",
    desc: "إعلان بانر كبير يظهر لكل زوار الموقع لزيادة الشهرة.",
    price: "15,000",
    period: "شهرياً",
    icon: <FiBox />,
    style: "premium",
    features: [
      { text: "ظهور البانر في أعلى/أسفل الصفحة", included: true },
      { text: "تصميم احترافي للبانر", included: true },
      { text: "إحصائيات النقرات والمشاهدات", included: true },
      { text: "ربط البانر برابط إعلانك المباشر", included: true },
      { text: "استهداف جغرافي حسب الولاية", included: false },
    ],
  },
  {
    id: "office",
    name: "اشتراك المكاتب العقارية",
    desc: "للمكاتب والشركات العقارية لإدارة فريق وعقارات متعددة.",
    price: "10,000",
    period: "شهرياً",
    icon: <FiGrid />,
    style: "premium",
    features: [
      { text: "إدارة فريق عمل متكامل", included: true },
      { text: "نشر عقارات وخدمات غير محدودة", included: true },
      { text: "لوحة تحكم إحصائية متقدمة", included: true },
      { text: "حسابات متعددة للموظفين", included: true },
      { text: "دعم فني مخصص عاجل", included: false },
    ],
  },
];

export default function PricingPlans() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '' });

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
      alert(`تمت عملية الدفع بنجاح!\nالخدمة: ${selectedPlan.name}\nالتكلفة: ${selectedPlan.price} د.ج (${selectedPlan.period})`);
      setLoadingPlan(null);
      setShowPaymentModal(false);
      setCardData({ number: '', expiry: '', cvv: '' });
    }, 2000);
  };

  return (
    <div className="pricing-page-wrapper">
      <div className="pricing-container">
        <div className="pricing-header">
          <span className="pricing-badge">خدمات المنصة</span>
          <h1>اختر الخدمة المناسبة لاحتياجاتك</h1>
          <p>ادفع مقابل الخدمة التي تحتاجها فقط (نشر مميز، توثيق، لافتة، أو اشتراك مؤسسي).</p>
        </div>

        <div className="pricing-grid">
          {plans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.style}`}>
              {plan.style === 'popular' && <div className="popular-tag">الأكثر طلباً</div>}
              
              <div className="pricing-card-header">
                <div className="pricing-icon">{plan.icon}</div>
                <h3>{plan.name}</h3>
                <p>{plan.desc}</p>
              </div>

              <div className="pricing-card-price">
                <span className="price-amount">{plan.price}</span>
                <span className="price-currency">د.ج <small style={{color: '#64748b'}}>/ {plan.period}</small></span>
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
                onClick={() => plan.id === 'free' ? alert('تم تفعيل الباقة المجانية!') : handleOpenPayment(plan)}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? '...جاري التحميل' : plan.id === 'free' ? 'ابدأ مجاناً' : 'اشترك الآن'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* === نافذة الدفع المنبثقة (تبقى كما هي بدون تغيير) === */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}><FiX /></button>

            <div className="modal-header">
              <h2>ادفع مقابل الخدمة</h2>
              <p>أنت على وشك تفعيل: <strong>{selectedPlan?.name}</strong></p>
            </div>

            <div className="modal-amount-display">
              <span className="amount-label">إجمالي المبلغ المطلوب</span>
              <span className="amount-value">{selectedPlan?.price} <small>د.ج</small></span>
              <span className="amount-period">({selectedPlan?.period})</span>
            </div>

            <form onSubmit={handlePaySubmit} className="payment-form">
              <div className="card-preview">
                <div className="card-preview-header">
                  <span>البطاقة الذهبية</span>
                  <span>CIB / Edahabia</span>
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
                <label>رقم البطاقة (16 رقم)</label>
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
                  <label>تاريخ الانتهاء</label>
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
                  <label>رمز الأمان (CVV)</label>
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
                  <>جاري معالجة الدفع...</>
                ) : (
                  <><FiLock /> ادفع الآن ({selectedPlan?.price} د.ج)</>
                )}
              </button>

              <div className="secure-note">
                <FiLock size={14} /> دخولك مشفر ومحمي ببروتوكول SSL
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}