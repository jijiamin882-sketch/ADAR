import React, { useState } from "react";
import { toast } from "react-toastify";
import "./AddProperty.css";
// استيراد db و storage من ملف الفايربيز الذي وجدناه في src
import { db, storage } from "../../firebase"; 

// استيراد أدوات Firestore و Storage الرسمية
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
const AddProperty = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    city: "الجلفة", // قيمة افتراضية
    country: "الجزائر",
    bathrooms: 0,
    bedrooms: 0,
    parkings: 0,
  });
  const [images, setImages] = useState([]);

  // معالجة تغيير النصوص
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // معالجة اختيار الصور
  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // دالة الرفع والنشر
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return toast.error("يرجى اختيار صورة واحدة على الأقل");

    setUploading(true);
    try {
      // 1. رفع الصور والحصول على روابطها
      const imageUrls = await Promise.all(
        images.map(async (image) => {
          const storageRef = ref(storage, `properties/${Date.now()}-${image.name}`);
          await uploadBytes(storageRef, image);
          return getDownloadURL(storageRef);
        })
      );

      // 2. إرسال البيانات إلى Firestore
      await addDoc(collection(db, "properties"), {
        ...formData,
        image: imageUrls[0], // سنأخذ أول صورة كصورة رئيسية كما في مشروعك الحالي
        allImages: imageUrls, // ونخزن الباقي في مصفوفة
        createdAt: new Date(),
      });

      toast.success("تم إضافة العقار بنجاح!");
      navigate("/properties"); // الانتقال لصفحة العقارات لرؤية النتيجة
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-property-wrapper paddings innerWidth">
      <h2 className="primaryText">إضافة إعلان جديد</h2>
      <form onSubmit={handleSubmit} className="flexColStart add-form">
        <input type="text" id="title" placeholder="عنوان الإعلان (مثلاً: فيلا فاخرة)" onChange={handleChange} required />
        <textarea id="description" placeholder="وصف العقار بالتفصيل" onChange={handleChange} required />
        <input type="number" id="price" placeholder="السعر بالدينار الجزائري" onChange={handleChange} required />
        <input type="text" id="address" placeholder="العنوان بالتفصيل" onChange={handleChange} required />
        
        <div className="flexStart facilities-input">
          <input type="number" id="bedrooms" placeholder="الغرف" onChange={handleChange} />
          <input type="number" id="bathrooms" placeholder="الحمامات" onChange={handleChange} />
          <input type="number" id="parkings" placeholder="المرآب" onChange={handleChange} />
        </div>

        <label>اختر صور العقار:</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} required />

        <button type="submit" className="button" disabled={uploading}>
          {uploading ? "جاري الرفع..." : "نشر الإعلان"}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;