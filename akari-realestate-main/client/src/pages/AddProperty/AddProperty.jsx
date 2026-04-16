import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiMapPin, FiImage, FiCheckCircle, 
  FiChevronLeft, FiArrowLeft, FiDollarSign
} from "react-icons/fi";
import { firestoreDB } from "../../firebase";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    listingType: "sale", // sale أو rent
    type: "",
    price: "",
    area: "",
    city: "",
    address: "",
    title: "",
    description: "",
    beds: "",
    baths: "",
    images: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

     const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        
        await addDoc(collection(firestoreDB, "properties"), {
          listingType: formData.listingType,
          type: formData.type,
          price: formData.price + (formData.listingType === 'rent' ? ' دج/شهر' : ' دج'),
          title: formData.title,
          location: formData.city + (formData.address ? '، ' + formData.address : ''),
          beds: parseInt(formData.beds) || 0,
          baths: parseInt(formData.baths) || 0,
          area: formData.area,
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600",
          createdAt: new Date().toISOString()
        });

        alert("تم نشر العقار بنجاح في قاعدة البيانات! ✅");
        navigate("/properties");
      } catch (error) {
        console.error("خطأ في الحفظ:", error);
        alert("حدث خطأ أثناء الحفظ، حاولي مرة أخرى");
      }
    }
  };
  return (
    <div className="add-prop-wrapper">
      <div className="add-prop-container">
        
        {/* الهيدر */}
        <div className="add-prop-header">
          <button className="add-prop-back" onClick={() => navigate(-1)}>
            <FiArrowLeft /> رجوع
          </button>
          <h1>إضافة عقار جديد</h1>
          <p>أضف عقارك في 3 خطوات سهلة</p>
        </div>

        {/* أشرطة التقدم */}
        <div className="add-prop-progress">
          <div className={`prop-step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-circle"><FiHome /></div>
            <span>النوع والسعر</span>
          </div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-circle"><FiMapPin /></div>
            <span>الموقع والتفاصيل</span>
          </div>
          <div className="progress-line"></div>
          <div className={`prop-step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-circle"><FiImage /></div>
            <span>الصور</span>
          </div>
        </div>

        {/* النموذج */}
        <form className="add-prop-form" onSubmit={handleSubmit}>
          
          {/* ===== الخطوة 1: النوع والسعر ===== */}
          {step === 1 && (
            <div className="form-step">
              <h2>ما نوع العقار وسعره؟</h2>
              
              <div className="form-group">
                <label>الغرض من الإعلان</label>
                <div className="toggle-group">
                  <button type="button"   className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'sale'})}>للبيع</button>
                  <button type="button" className={`toggle-btn rent ${formData.listingType === 'rent' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'rent'})}>للكراء</button>
                </div>
              </div>

              <div className="form-group">
                <label>نوع العقار</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">اختر نوع العقار</option>
                  <option value="شقة">شقة</option>
                  <option value="فيلا">فيلا</option>
                  <option value="منزل">منزل</option>
                  <option value="أرض">أرض</option>
                  <option value="محل تجاري">محل تجاري</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>السعر (دج) {formData.listingType === 'rent' ? '(شهرياً)' : ''}</label>
                  <input type="number" name="price" placeholder="مثال: 15000000" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>المساحة (م²)</label>
                  <input type="number" name="area" placeholder="مثال: 120" value={formData.area} onChange={handleChange} required />
                </div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 2: الموقع والتفاصيل ===== */}
          {step === 2 && (
            <div className="form-step">
              <h2>أين يقع العقار وما تفاصيله؟</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label>المدينة</label>
                  <select name="city" value={formData.city} onChange={handleChange} required>
                    <option value="">اختر المدينة</option>
                    <option value="الجلفة">الجلفة</option>
                    <option value="الجزائر العاصمة">الجزائر العاصمة</option>
                    <option value="وهران">وهران</option>
                    <option value="تسمسيلت">تسمسيلت</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>العنوان بالتفصيل (اختياري)</label>
                  <input type="text" name="address" placeholder="مثال: حي البساتين، شارع 5" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label>عنوان الإعلان</label>
                <input type="text" name="title" placeholder="مثال: شقة فاخرة للبيع في قلب المدينة" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>وصف العقار</label>
                <textarea name="description" rows="5" placeholder="اكتب وصفاً تفصيلياً عن العقار، مميزاته، وحالته..." value={formData.description} onChange={handleChange} required></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>غرف النوم</label>
                  <input type="number" name="beds" placeholder="0" value={formData.beds} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>الحمامات</label>
                  <input type="number" name="baths" placeholder="0" value={formData.baths} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {/* ===== الخطوة 3: الصور ===== */}
          {step === 3 && (
            <div className="form-step">
              <h2>أضف صور العقار</h2>
              <p className="step-desc">الصور الجيدة تزيد من اهتمام المشترين بنسبة 80%</p>
              
              <div className="upload-area">
                <FiImage size={48} />
                <h3>اسحب الصور هنا أو انقر للرفع</h3>
                <p>(سنضيف رفع الصور لـ Firebase لاحقاً)</p>
                <button type="button" className="upload-btn">اختر الصور</button>
              </div>
            </div>
          )}

          {/* أزرار التنقل */}
          <div className="form-actions">
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                <FiChevronLeft /> السابق
              </button>
            )}
            
            <button type="submit" className="btn-primary">
              {step === 3 ? (
                <><FiCheckCircle /> نشر العقار</>
              ) : (
                <>التالي</>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}