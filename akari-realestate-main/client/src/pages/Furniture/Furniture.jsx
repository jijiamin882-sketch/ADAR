import React, { useState } from 'react';
import { FiLayout, FiStar, FiPackage, FiArrowRight, FiX, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Furniture.css';

const Furniture = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    toast.success("تم استلام طلبك بنجاح! سيتواصل معك خبراء الأثاث لتأكيد التفاصيل.", {
      position: "top-center"
    });
    setShowModal(false);
  };

  return (
    <div className="furniture-page-wrapper">
      
      {/* واجهة الخدمة العلوية */}
      <div className="furniture-hero">
        <div className="furniture-hero-icon">
          <FiLayout />
        </div>
        <h1>خدمات الأثاث والتجهيز</h1>
        <p>وفرنا عليك عناء البحث، نوفر لك باقات أثاث جاهزة أو مخصصة حسب مساحة عقارك بتصاميم عصرية تجمع بين الراحة والأناقة.</p>
      </div>

      {/* قسم المحتوى */}
      <div className="furniture-content-container">
        
        {/* لماذا تختار أثاثنا */}
        <div className="furniture-section-box">
          <h2>لماذا تختار خدمة التجهيز لدينا؟</h2>
          <div className="furniture-features-grid">
            <div className="furniture-feature-item">
              <FiLayout className="furniture-feat-icon" />
              <h3>تصاميم عصرية</h3>
              <p>تشكيلات أثاث تجمع بين أحدث صيحات الديكور وأقصى درجات الراحة لتناسب ذوقك.</p>
            </div>
            <div className="furniture-feature-item">
              <FiStar className="furniture-feat-icon" />
              <h3>جودة عالية</h3>
              <p>نختار لك أفضل أنواع الخشب والقماش والمعدن لضمان متانة الأثاث واستمراريته لسنوات.</p>
            </div>
            <div className="furniture-feature-item">
              <FiPackage className="furniture-feat-icon" />
              <h3>توصيل وتركيب</h3>
              <p>فريق متخصص يقوم بتوصيل الأثاث وتركيبه في غرفتك بدقة واحترافية تامة.</p>
            </div>
          </div>
        </div>

        {/* كيف تعمل الخدمة */}
        <div className="furniture-section-box furniture-steps-box">
          <h2>كيف يتم تجهيز عقارك؟</h2>
          <div className="furniture-steps-flex">
            <div className="furniture-step">
              <div className="furniture-step-num">1</div>
              <h4>اختيار الباقة</h4>
              <p>تصفح باقاتنا الجاهزة (غرف نوم، صالات، مكاتب) أو طلب تصميم مخصص بالكامل.</p>
            </div>
            <FiArrowLeft className="furniture-step-arrow" />
            <div className="furniture-step">
              <div className="furniture-step-num">2</div>
              <h4>المعاينة والموافقة</h4>
              <p>نرسل لك نماذج ومواصفات الأثاث بالتفصيل للموافقة عليها قبل بدء التصنيع.</p>
            </div>
            <FiArrowLeft className="furniture-step-arrow" />
            <div className="furniture-step">
              <div className="furniture-step-num">3</div>
              <h4>التسليم النهائي</h4>
              <p>يتم تصنيع الأثاث وتوصيله لعقارك، تركيبه، وتسليمه لك جاهزاً للاستخدام.</p>
            </div>
          </div>
        </div>

      </div>

      {/* أزرار التوجيه السفلية */}
      <div className="furniture-actions-bar">
        <button className="furniture-back-btn" onClick={() => navigate('/Services')}>
          العودة للخدمات
        </button>
        <button className="furniture-cta-btn" onClick={() => setShowModal(true)}>
          اطلب باقة أثاث الآن
        </button>
      </div>

      {/* --- النافذة المنبثقة (Modal) --- */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>طلب تجهيز بالأثاث</h3>
              <FiX className="modal-close-icon" onClick={() => setShowModal(false)} />
            </div>
            <p className="modal-subtitle">أخبرنا بمساحتك ونوع التجهيز الذي تريده وسنقدم لك أفضل العروض.</p>
            
            <form onSubmit={handleFormSubmit} className="modal-form">
              <input type="text" placeholder="الاسم الكامل" required />
              <input type="tel" placeholder="رقم الهاتف" required />
              <select required defaultValue="">
                <option value="" disabled>نوع التجهيز المطلوب</option>
                <option value="bedroom">تجهيز غرف نوم</option>
                <option value="living">تجهيز صالات وجلوس</option>
                <option value="kitchen">تجهيز مطابخ</option>
                <option value="office">تجهيز مكاتب</option>
                <option value="full">تجهيز العقار بالكامل</option>
              </select>
              <textarea rows="4" placeholder="تفاصيل إضافية (المساحة، الألوان المفضلة، ملاحظات)..."></textarea>
              
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

export default Furniture;