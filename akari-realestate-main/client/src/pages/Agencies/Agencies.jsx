import React, { useEffect, useState } from 'react';
import "./Agencies.css";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { MdPhone, MdLocationPin, MdVerified } from "react-icons/md";
 

const Agencies = () => {
  const { t } = useTranslation();
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاولة جلب البيانات من مسار 'agencies'
    const agenciesRef = ref(db, "agencies"); 
    
    const unsubscribe = onValue(agenciesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // تحويل الكائن إلى مصفوفة
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setAgencies(list);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
     /* هنا السر: استخدمنا نفس لون خلفية الصفحة الرئيسية المتدرج */
     <div style={{ 
      backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/agncies.jpg)", 
      backgroundSize: "cover",           // لجعل الصورة تغطي كامل المساحة
      backgroundPosition: "center",      // لتمرير الصورة في المنتصف
      backgroundRepeat: "no-repeat",     // لمنع تكرار الصورة
      minHeight: "100vh", 
      width: "100%",
      paddingTop: "120px" // لترك مسافة للهيدر
     }}>
      <div className="flexColCenter paddings innerWidth">
        
        {/* عنوان الصفحة بلون أبيض ليتناسب مع الخلفية الداكنة */}
        <div className="flexColCenter s-head" style={{ marginBottom: "3rem" }}>
          <span className="orangeText" style={{ fontSize: "2.5rem" }}>
            {t("الوكالات العقارية المعتمدة") || "الوكالات العقارية المعتمدة"}
          </span>
          <span style={{color: "white", opacity: 0.7}}>نخبة من الوكالات لخدمتكم في ولاية الجلفة</span>
        </div>

        <div className="flexCenter" style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          {loading ? (
             <p style={{color: "white"}}>جاري تحميل البيانات من فايربيز...</p>
          ) : agencies.length > 0 ? (
            agencies.map((agency, i) => (
              <div key={i} className="agency-card" style={{
                background: "rgba(255, 255, 255, 0.05)", // بطاقة زجاجية شفافة
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "20px",
                borderRadius: "20px",
                width: "300px",
                color: "white"
              }}>
                <img 
                   src={
                     agency.image && agency.image.startsWith('http') 
                     ? agency.image                          // إذا كان رابط انترنت كامل
                      : `/images/${agency.image}`             // إذا كان اسم ملف محلي داخل public/images
                    }
                      alt={agency.name} 
                     // هذه الدالة تضع صورة افتراضية إذا لم يجد الصورة الأصلية لكي لا تبقى الصفحة فارغة
                      onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image+Found"; }}
                       style={{ width: "100%", height: "180px", borderRadius: "15px", objectFit: "cover" }} 
                 />
                <div className="flexColStart" style={{ gap: "0.5rem", marginTop: "1rem" }}>
                  <div className="flexStart" style={{ gap: "10px" }}>
                    <h3 style={{ fontSize: "1.3rem", color: "white" }}>{agency.name}</h3>
                    <MdVerified color="#28a745" />
                  </div>
                  <div className="flexStart" style={{ gap: "5px", fontSize: "0.9rem", color: "#ccc" }}>
                    <MdLocationPin color="#e9ae5d" />
                    <span>{agency.address}</span>
                  </div>
                  <div style={{ background: "rgba(64, 102, 255, 0.2)", padding: "8px 15px", borderRadius: "10px", width: "100%", color: "#6da5ff", fontWeight: "bold" }}>
                    <MdPhone /> {agency.phone}
                  </div>
                  <a href={`tel:${agency.phone}`} className="button" style={{ width: "100%", textAlign: "center", marginTop: "1rem", textDecoration: "none" }}>
                    اتصل الآن
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p style={{color: "white"}}>لم يتم العثور على وكالات. تأكدي من المسار في Firebase.</p>
          )}
        </div>
      </div>
    </div>
  
  );
};

export default Agencies;
 