import React, { useState } from 'react';
import { FiTruck, FiShield, FiClock, FiMapPin, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Moving.css';

const Moving = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success("تم تأكيد طلب النقل! سيقوم فريقنا بالتواصل معك لترتيب موعد النقل.", {
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
        <h1>خدمة نقل الأثاث الآمنة</h1>
        <p>نقل آمن وموثوق لعفشك باستخدام سيارات مجهزة وفرق عمل محترفة لضمان سلامة منقولاتك من الباب إلى الباب.</p>
      </div>

      <div className="moving-content-container">
        
        <div className="moving-section-box">
          <h2>لماذا تثق بخدمة النقل لدينا؟</h2>
          <div className="moving-features-grid">
            <div className="moving-feature-item">
              <FiShield className="moving-feat-icon" />
              <h3>تأمين شامل</h3>
              <p>جميع منقولاتك مؤمنة ضد أي أضرار أو خسائر قد تحدث أثناء عملية النقل أو التحميل.</p>
            </div>
            <div className="moving-feature-item">
              <FiClock className="moving-feat-icon" />
              <h3>التزام بالمواعيد</h3>
              <p>نلتزم بالميعاد الذي تحدده بدقة، مع إمكانية تتبع حالة الشحنة أثناء النقل.</p>
            </div>
            <div className="moving-feature-item">
              <FiMapPin className="moving-feat-icon" />
              <h3>نقل لجميع الولايات</h3>
              <p>سواء كنت تنقل داخل المدينة أو إلى ولاية أخرى، لدينا شبكة تغطية واسعة لخدمتك.</p>
            </div>
          </div>
        </div>

        <div className="moving-section-box moving-steps-box">
          <h2>كيف تتم عملية النقل؟</h2>
          <div className="moving-steps-flex">
            <div className="moving-step">
              <div className="moving-step-num">1</div>
              <h4>طلب عرض سعر</h4>
              <p>أرسل لنا تفاصيل منزلك وموقعك الجديد وسنقدم لك عرض سعر فوري وشفاف.</p>
            </div>
            <FiArrowLeft className="moving-step-arrow" />
            <div className="moving-step">
              <div className="moving-step-num">2</div>
              <h4>التعبئة والتغليف</h4>
              <p>فريقنا يصل بكامل المعدات (أغطية، صناديق، بلاستيك فقاعي) لتغليف آمن.</p>
            </div>
            <FiArrowLeft className="moving-step-arrow" />
            <div className="moving-step">
              <div className="moving-step-num">3</div>
              <h4>النقل والتفريغ</h4>
              <p>يتم تحميل الأثاث في شاحنات مخصصة، ونقوم بتفريغه وترتيبه في الموقع الجديد.</p>
            </div>
          </div>
        </div>

      </div>

      <div className="moving-actions-bar">
        <button className="moving-back-btn" onClick={() => navigate('/Services')}>
          العودة للخدمات
        </button>
        <button className="moving-cta-btn" onClick={() => setShowModal(true)}>
          احصل على عرض سعر الآن
        </button>
      </div>

      {/* --- النافذة المنبثقة --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>طلب عرض سعر للنقل</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">أدخل تفاصيل النقل وسنرد عليك بعرض سعر مناسب في أسرع وقت.</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder="الاسم الكامل" required />
              <input type="tel" placeholder="رقم الهاتف" required />
              <select required defaultValue="">
                <option value="" disabled>نوع النقل المطلوب</option>
                <option value="local">نقل داخل المدينة</option>
                <option value="intercity">نقل بين الولايات</option>
                <option value="office">نقل مكاتب وشركات</option>
                <option value="furniture-only">نقل أثاث فقط (بدون تغليف)</option>
              </select>
              <textarea rows="4" placeholder="تفاصيل إضافية (عنوان النقل الحالي، العنوان الجديد، طوابق الشقق)..."></textarea>
              
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

export default Moving;