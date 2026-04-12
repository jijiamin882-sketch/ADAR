import React, { useState } from 'react';
import { FiTool, FiZap, FiUserCheck, FiSettings, FiArrowRight, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Maintenance.css';

const Maintenance = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success("تم استلام طلب الصيانة بنجاح! سيقوم فني بالتواصل معك قريباً.", {
      position: "top-center"
    });
    setShowModal(false);
  };

  return (
    <div className="maintenance-page-wrapper">
      
      {/* واجهة الخدمة العلوية */}
      <div className="maintenance-hero">
        <div className="maintenance-hero-icon">
          <FiTool />
        </div>
        <h1>خدمات صيانة العقارات</h1>
        <p>فريق متخصص وذو كفاءة عالية لضمان الحفاظ على عقارك. نقدم صيانة دورية وطوارئ فورية على مدار الساعة.</p>
      </div>

      {/* قسم المحتوى */}
      <div className="maintenance-content-container">
        
        {/* لماذا تختار صيانتنا */}
        <div className="maintenance-section-box">
          <h2>لماذا تثق بخدمات الصيانة لدينا؟</h2>
          <div className="maintenance-features-grid">
            <div className="maintenance-feature-item">
              <FiZap className="maintenance-feat-icon" />
              <h3>استجابة فورية</h3>
              <p>فريق طوارئ جاهز للتحرك خلال دقائق لحل الأعطال المفاجئة كالأعطال الكهربائية أو انسداد المجاري.</p>
            </div>
            <div className="maintenance-feature-item">
              <FiUserCheck className="maintenance-feat-icon" />
              <h3>فنيون معتمدون</h3>
              <p>جميع فنيينا حاصلون على شهادات خبرة ويخضعون لفحص أمني لضمان أمان منزلك.</p>
            </div>
            <div className="maintenance-feature-item">
              <FiSettings className="maintenance-feat-icon" />
              <h3>خدمات شاملة</h3>
              <p>من السباكة والكهرباء إلى التكييف والطلاء، نوفر لك كل ما تحتاجه تحت سقف واحد.</p>
            </div>
          </div>
        </div>

        {/* كيف تعمل الخدمة */}
        <div className="maintenance-section-box maintenance-steps-box">
          <h2>كيف ندير عملية الصيانة؟</h2>
          <div className="maintenance-steps-flex">
            <div className="maintenance-step">
              <div className="maintenance-step-num">1</div>
              <h4>حجز موعد</h4>
              <p>حدد نوع العطل واختر الوقت المناسب لك من خلال نموذج التواصل السريع.</p>
            </div>
            <FiArrowRight className="maintenance-step-arrow" />
            <div className="maintenance-step">
              <div className="maintenance-step-num">2</div>
              <h4>الفحص والتشخيص</h4>
              <p>يصل الفني لموقعك، يقوم بتشخيص المشكلة بدقة ويحدد التكلفة قبل البدء.</p>
            </div>
            <FiArrowRight className="maintenance-step-arrow" />
            <div className="maintenance-step">
              <div className="maintenance-step-num">3</div>
              <h4>الإصلاح والضمان</h4>
              <p>تنفيذ الإصلاح فوراً مع تقديم ضمان شامل على قطع الغيار وأعمال الصيانة.</p>
            </div>
          </div>
        </div>

      </div>

      {/* أزرار التوجيه السفلية (مرتبة عن الفوتر) */}
      <div className="maintenance-actions-bar">
        <button className="maintenance-back-btn" onClick={() => navigate('/Services')}>
          العودة للخدمات
        </button>
        <button className="maintenance-cta-btn" onClick={() => setShowModal(true)}>
          احجز فني صيانة الآن
        </button>
      </div>

      {/* --- النافذة المنبثقة (Modal) --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>طلب خدمة صيانة</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">صف لنا المشكلة وسنرسل لك أفضل فني متخصص في منطقتك.</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder="الاسم الكامل" required />
              <input type="tel" placeholder="رقم الهاتف" required />
              <select required defaultValue="">
                <option value="" disabled>نوع الصيانة المطلوبة</option>
                <option value="plumbing">سباكة</option>
                <option value="electrical">كهرباء</option>
                <option value="ac">صيانة تكييف</option>
                <option value="painting">طلاء وتشطيبات</option>
                <option value="other">أخرى</option>
              </select>
              <textarea rows="4" placeholder="وصف مختصر للمشكلة..."></textarea>
              
              <div className="modal-actions">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowModal(false)}>إلغاء</button>
                <button type="submit" className="modal-submit-btn">إرسال الطلب</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Maintenance;