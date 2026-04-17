import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiHome, FiMapPin, FiImage, FiCheckCircle, 
  FiChevronLeft, FiArrowLeft, FiDollarSign, 
  FiUser, FiFileText, FiUploadCloud, FiShield
} from "react-icons/fi";
import { firestoreDB } from "../../firebase";
import "./AddProperty.css";

export default function AddProperty() {
  const navigate = useNavigate();
  // تغيير البداية من 1 إلى 0 لتصبح الخطوة الأولى هي التحقق
  const [step, setStep] = useState(0);

  const [formData, setFormData] = useState({
    listingType: "sale", 
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

  // حالة خاصة ببيانات المالك والوثائق (لأنها لا تذهب لقاعدة البيانات بنفس طريقة العقار)
  const [ownerData, setOwnerData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    propertyDoc: null // لتخزين ملف الوثيقة مؤقتاً
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOwnerChange = (e) => {
    const { name, value } = e.target;
    setOwnerData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setOwnerData(prev => ({ ...prev, propertyDoc: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من خطوة الهوية قبل الانتقال
    if (step === 0) {
      if (!ownerData.firstName || !ownerData.lastName || !ownerData.idNumber) {
        alert("يرجى ملء جميع بيانات الهوية للمتابعة");
        return;
      }
      if (!ownerData.propertyDoc) {
        alert("يرجى إرفاق وثيقة تثبت ملكية العقار (عقد، رخصة...)");
        return;
      }
      setStep(step + 1);
      return;
    }

    // التنقل بين الخطوات العادية
    if (step < 3) {
      setStep(step + 1);
    } else {
      try {
        const { collection, addDoc } = await import("firebase/firestore");
        
        await addDoc(collection(firestoreDB, "properties"), {
          // حفظ بيانات المالك مع العقار (للمراجعة الإدارية لاحقاً)
          ownerName: `${ownerData.firstName} ${ownerData.lastName}`,
          ownerIdNumber: ownerData.idNumber,
          listingType: formData.listingType,
          type: formData.type,
          price: formData.price + (formData.listingType === 'rent' ? ' دج/شهر' : ' دج'),
          title: formData.title,
          location: formData.city + (formData.address ? '، ' + formData.address : ''),
          beds: parseInt(formData.beds) || 0,
          baths: parseInt(formData.baths) || 0,
          area: formData.area,
          image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=600",
          status: "pending_review", // حالة انتظار المراجعة بسبب الوثائق
          createdAt: new Date().toISOString()
        });

        alert("تم إرسال طلب النشر بنجاح! سيتم مراجعة هويتك ووثائق العقار وسيظهر إعلانك خلال 24 ساعة. ✅");
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
          <p>أضف عقارك في 4 خطوات (بما فيها التحقق من الهوية)</p>
        </div>

        {/* أشرطة التقدم (تم تحديثها لتصبح 4 خطوات) */}
        <div className="add-prop-progress">
          <div className={`prop-step ${step >= 0 ? 'active' : ''}`}>
            <div className="step-circle"><FiShield /></div>
            <span>التحقق والهوية</span>
          </div>
          <div className="progress-line"></div>
          
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
          
          {/* ===== الخطوة 0 (الجديدة): التحقق من هوية المالك والوثائق ===== */}
          {step === 0 && (
            <div className="form-step">
              <h2>التحقق من هوية المالك وصحة العقار</h2>
              <p className="step-desc">لضمان أمان المنصة وعدم وجود إعلانات وهمية، يجب إثبات الهوية وملكية العقار.</p>
              
              <div className="owner-details-grid">
                <div className="form-group">
                  <label><FiUser style={{verticalAlign: 'middle', marginLeft: '5px'}} /> الاسم</label>
                  <input 
                    type="text" 
                    name="firstName" 
                    placeholder="الاسم الأول" 
                    value={ownerData.firstName} 
                    onChange={handleOwnerChange} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>اللقب</label>
                  <input 
                    type="text" 
                    name="lastName" 
                    placeholder="لقب العائلة" 
                    value={ownerData.lastName} 
                    onChange={handleOwnerChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>رقم الهوية الوطنية (رقم التعريف)</label>
                <input 
                  type="text" 
                  name="idNumber" 
                  placeholder="أدخل رقم الهوية الوطنية المكون من 18 رقم" 
                  value={ownerData.idNumber} 
                  onChange={handleOwnerChange} 
                  required 
                  maxLength={18}
                  style={{direction: 'ltr', textAlign: 'left'}}
                />
              </div>

              <div className="form-group">
                <label><FiFileText style={{verticalAlign: 'middle', marginLeft: '5px'}} /> وثيقة إثبات الملكية</label>
                <div className="upload-area" style={{padding: '20px', cursor: 'pointer', borderStyle: 'dashed'}} onClick={() => document.getElementById('docUpload').click()}>
                  <FiUploadCloud size={32} />
                  <h3>{ownerData.propertyDoc ? ownerData.propertyDoc.name : "انقر لرفع العقد أو رخصة الملكية"}</h3>
                  <p>(يتم قبول: صيغة PDF، JPG، PNG بحجم أقصى 5 ميجابايت)</p>
                  <input 
                    id="docUpload"
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{display: 'none'}} 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>

              <div className="form-notice-box">
                <FiShield size={20} color="#e3c08d" />
                <p>بياناتك الشخصية ووثائقك محمية ولا يتم مشاركتها مع أي طرف ثالث. تُستخدم فقط من قبل إدارة الموقع للتحقق من صحة الإعلان.</p>
              </div>
            </div>
          )}

          {/* ===== الخطوة 1: النوع والسعر ===== */}
          {step === 1 && (
            <div className="form-step">
              <h2>ما نوع العقار وسعره؟</h2>
              
              <div className="form-group">
                <label>الغرض من الإعلان</label>
                <div className="toggle-group">
                  <button type="button" className={`toggle-btn ${formData.listingType === 'sale' ? 'active' : ''}`} onClick={() => setFormData({...formData, listingType: 'sale'})}>للبيع</button>
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
            {/* إخفاء زر السابق في الخطوة الأولى فقط */}
            {step > 0 && (
              <button type="button" className="btn-secondary" onClick={() => setStep(step - 1)}>
                <FiChevronLeft /> السابق
              </button>
            )}
            
            <button type="submit" className="btn-primary">
              {step === 3 ? (
                <><FiCheckCircle /> إرسال للمراجعة</>
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