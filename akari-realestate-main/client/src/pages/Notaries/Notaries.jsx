import React, { useState } from 'react';
import { FiFileText, FiShield, FiClock, FiUsers, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // <-- استدعاء أداة التنبيهات
import './Notaries.css';

const Notaries = () => {
  const navigate = useNavigate();
  
  // حالة لإظهار وإخفاء النافذة المنبثقة
  const [showModal, setShowModal] = useState(false);

  // دالة إرسال النموذج
  const handleFormSubmit = (e) => {
    e.preventDefault(); // لمنع تحديث الصفحة
    // هنا يمكنك لاحقاً إرسال البيانات لقاعدة البيانات (Firebase)
    toast.success("تم إرسال طلبك بنجاح! سيتواصل معك الموثق خلال دقائق.", {
      position: "top-center"
    });
    setShowModal(false); // إغلاق النافذة بعد الإرسال
  };

  return (
    <div className="notary-page-wrapper">
      
      {/* واجهة الخدمة العلوية (Hero) */}
      <div className="notary-hero">
        <div className="notary-hero-icon">
          <FiFileText />
        </div>
        <h1>خدمات الموثقون المعتمدون</h1>
        <p>نضمن لك سلامة معاملاتك العقارية من خلال شراكاتنا مع نخبة من الموثقين القانونيين المعتمدين في منطقتك.</p>
      </div>

      {/* قسم المحتوى */}
      <div className="notary-content-container">
        
        {/* لماذا تختارنا */}
        <div className="notary-section-box">
          <h2>لماذا تختار خدمة التوثيق لدينا؟</h2>
          <div className="notary-features-grid">
            <div className="notary-feature-item">
              <FiShield className="notary-feat-icon" />
              <h3>شرعية مطلقة</h3>
              <p>جميع عقودنا يتم مراجعتها من قبل محامين متخصصين لضمان عدم وجود ثغرات قانونية.</p>
            </div>
            <div className="notary-feature-item">
              <FiClock className="notary-feat-icon" />
              <h3>توفير الوقت</h3>
              <p>نتولى عنك كافة إجراءات المداولة في المحاكم والبلديات بدلاً من الانتظار في الطوابير.</p>
            </div>
            <div className="notary-feature-item">
              <FiUsers className="notary-feat-icon" />
              <h3>شبكة واسعة</h3>
              <p>نوفر لك قائمة بأفضل الموثقين مع تقييمات حقيقية من عملاء سابقين لتختار الأنسب لك.</p>
            </div>
          </div>
        </div>

        {/* كيف تعمل الخدمة */}
        <div className="notary-section-box notary-steps-box">
          <h2>كيف نتمم عملية التوثيق؟</h2>
          <div className="notary-steps-flex">
            <div className="notary-step">
              <div className="step-num">1</div>
              <h4>طلب الخدمة</h4>
              <p>أرسل تفاصيل عقارك ونوع العقد المطلوب عبر نموذجنا المباشر.</p>
            </div>
            <FiArrowLeft className="step-arrow" />
            <div className="notary-step">
              <div className="step-num">2</div>
              <h4>مراجعة الأوراق</h4>
              <p>يقوم فريقنا القانوني بمراجعة مستنداتك الأولية والتأكد من صحتها.</p>
            </div>
            <FiArrowLeft className="step-arrow" />
            <div className="notary-step">
              <div className="step-num">3</div>
              <h4>التوثيق النهائي</h4>
              <p>نثبت موعدك مع الموثق وإتمام التوقيع الرسمي واستلام العقود النهائية.</p>
            </div>
          </div>
        </div>

      </div>

      {/* أزرار التوجيه السفلية */}
      <div className="notary-actions-bar">
        <button className="notary-back-btn" onClick={() => navigate('/Services')}>
          العودة للخدمات
        </button>
        {/* تم تغيير الزر ليفتح النافذة المنبثقة */}
        <button className="notary-cta-btn" onClick={() => setShowModal(true)}>
          تواصل مع موثق الآن
        </button>
      </div>

      {/* --- النافذة المنبثقة (Modal) --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            
            {/* زر الإغلاق */}
            <div className="modal-header">
              <h3>طلب تواصل مع موثق</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            
            <p className="modal-subtitle">أدخل بياناتك وسيتواصل معك أحد الموثقين المعتمدين في أقرب وقت.</p>

            {/* نموذج الإدخال */}
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder="الاسم الكامل" required />
              <input type="tel" placeholder="رقم الهاتف" required />
              <textarea rows="4" placeholder="تفاصيل الخدمة المطلوبة (نوع العقار، المدينة، رقم العقد...)"></textarea>
              
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

export default Notaries;