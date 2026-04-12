import React, { useEffect, useState, useRef } from "react";
import "./Agencies.css";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import {
  MdPhone,
  MdLocationPin,
  MdVerified,
  MdStar,
} from "react-icons/md";
import {
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiMapPin,
  FiArrowLeft,
  FiSend,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// === بيانات تجريبية (احذفها لاحقاً) ===
const topAgencies = [
  {
    id: "top1",
    name: "دار العقارات الجزائرية",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop",
    address: "الجزائر العاصمة - باب الزوار",
    phone: "0555 123 456",
    rating: 4.9,
    deals: "+350",
    type: "شركات كبرى",
  },
  {
    id: "top2",
    name: "مجموعة الإعمار العقارية",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    address: "وهران - وسط المدينة",
    phone: "0661 789 012",
    rating: 4.8,
    deals: "+280",
    type: "شركات كبرى",
  },
  {
    id: "top3",
    name: "وكالة الأمل للعقارات",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop",
    address: "قسنطينة - علي منجلي",
    phone: "0770 345 678",
    rating: 4.7,
    deals: "+190",
    type: "وكالة متخصصة",
  },
];

const wilayaAgencies = [
  {
    id: "w1",
    name: "وكالة الجلفة العقارية",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    address: "الجلفة - وسط المدينة",
    phone: "0550 111 222",
    wilaya: "الجلفة",
  },
  {
    id: "w2",
    name: "عقارات البليدة",
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&h=400&fit=crop",
    address: "البليدة - بوفاريك",
    phone: "0660 333 444",
    wilaya: "البليدة",
  },
  {
    id: "w3",
    name: "مركز العقارات باتنة",
    image: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=600&h=400&fit=crop",
    address: "باتنة - شارع الاستقلال",
    phone: "0770 555 666",
    wilaya: "باتنة",
  },
  {
    id: "w4",
    name: "وكالة سطيف العقارية",
    image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=600&h=400&fit=crop",
    address: "سطيف - الحديقة",
    phone: "0550 777 888",
    wilaya: "سطيف",
  },
  {
    id: "w5",
    name: "عقارات عنابة",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    address: "عنابة - سيدي عمار",
    phone: "0660 999 000",
    wilaya: "عنابة",
  },
  {
    id: "w6",
    name: "وكالة تلمسان للعقارات",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop",
    address: "تلمسان - الناظور",
    phone: "0770 112 233",
    wilaya: "تلمسان",
  },
];

const Agencies = () => {
  const navigate = useNavigate();
  const sectionsRef = useRef([]);

  // Firebase State
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join Form State
  const [form, setForm] = useState({
    name: "",
    phone: "",
    wilaya: "",
    experience: "",
  });

  // Scroll Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("ag-visible");
        });
      },
      { threshold: 0.1 }
    );
    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Firebase Fetch
  useEffect(() => {
    const agenciesRef = ref(db, "agencies");
    const unsubscribe = onValue(agenciesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
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

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("تم إرسال طلبك بنجاح! سنتواصل معك قريباً.");
    setForm({ name: "", phone: "", wilaya: "", experience: "" });
  };

  // دمج البيانات: نعرض البيانات التجريبية + بيانات فايربيز إن وجدت
  const displayWilayaAgencies =
    agencies.length > 0
      ? agencies.map((a) => ({
          ...a,
          image:
            a.image && a.image.startsWith("http")
              ? a.image
              : `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop`,
          wilaya: a.wilaya || a.address || "غير محدد",
        }))
      : wilayaAgencies;

  return (
    <div className="agencies-wrapper">
      {/* ===== 1. Hero Section ===== */}
      <section
        className="ag-hero"
        ref={(el) => (sectionsRef.current[0] = el)}
      >
        <div className="ag-hero-overlay"></div>
        <div className="ag-hero-content">
          <span className="ag-badge">
            <FiAward /> معتمدون وموثقون
          </span>
          <h1>الوكالات العقارية</h1>
          <p>
            تعامل مع نخبة من الوكالات العقارية المعتمدة عبر مختلف ولايات
            الجزائر، واكسب ثقة التعامل الآمن والشفاف
          </p>

          <div className="ag-hero-stats">
            <div className="ag-hero-stat">
              <FiTrendingUp />
              <span>+150 وكالة</span>
            </div>
            <div className="ag-hero-stat">
              <FiMapPin />
              <span>+48 ولاية</span>
            </div>
            <div className="ag-hero-stat">
              <FiUsers />
              <span>+5000 عميل راضٍ</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. Top Agencies Section ===== */}
      <section
        className="ag-top-section"
        ref={(el) => (sectionsRef.current[1] = el)}
      >
        <div className="ag-container">
          <div className="ag-section-header">
            <span className="ag-section-badge">التميز</span>
            <h2 className="ag-section-title">أفضل الوكالات العقارية</h2>
            <p className="ag-section-subtitle">
              وكالات حاصلة على تقييمات عالية وعدد صفقات كبير تضمن لك أفضل
              تجربة
            </p>
          </div>

          <div className="ag-top-grid">
            {topAgencies.map((agency, i) => (
              <div className="ag-top-card" key={i}>
                <div className="ag-top-img-wrapper">
                  <img src={agency.image} alt={agency.name} loading="lazy" />
                  <div className="ag-top-badge">{agency.type}</div>
                  <div className="ag-top-rating">
                    <MdStar /> {agency.rating}
                  </div>
                </div>
                <div className="ag-top-content">
                  <div className="ag-top-header">
                    <h3>{agency.name}</h3>
                    <MdVerified className="ag-verified-icon" />
                  </div>
                  <p className="ag-top-address">
                    <MdLocationPin /> {agency.address}
                  </p>
                  <div className="ag-top-deals">
                    <span>{agency.deals} صفقة منجزة</span>
                  </div>
                  <div className="ag-top-footer">
                    <div className="ag-top-phone">
                      <MdPhone /> {agency.phone}
                    </div>
                    <a
                      href={`tel:${agency.phone}`}
                      className="ag-top-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      اتصل الآن
                    </a>
                  </div>
                </div>
                <div className="ag-card-accent"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 3. Wilaya Agencies Section ===== */}
      <section
        className="ag-wilaya-section"
        ref={(el) => (sectionsRef.current[2] = el)}
      >
        <div className="ag-container">
          <div className="ag-section-header">
            <span className="ag-section-badge">التغطية</span>
            <h2 className="ag-section-title">وكالات الولايات</h2>
            <p className="ag-section-subtitle">
              شبكة واسعة من الوكالات تغطي مختلف ولايات الوطن لخدمتكم أينما
              كنتم
            </p>
          </div>

          <div className="ag-wilaya-grid">
            {loading ? (
              <div className="ag-loading">جاري تحميل الوكالات...</div>
            ) : (
              displayWilayaAgencies.map((agency, i) => (
                <div className="ag-wilaya-card" key={agency.id || i}>
                  <div className="ag-wilaya-img-wrapper">
                    <img src={agency.image} alt={agency.name} loading="lazy" />
                    <MdVerified className="ag-wilaya-verified" />
                  </div>
                  <div className="ag-wilaya-content">
                    <h3>{agency.name}</h3>
                    <p className="ag-wilaya-address">
                      <MdLocationPin /> {agency.address}
                    </p>
                    {agency.wilaya && (
                      <span className="ag-wilaya-tag">{agency.wilaya}</span>
                    )}
                    <div className="ag-wilaya-footer">
                      <span className="ag-wilaya-phone">
                        <MdPhone /> {agency.phone}
                      </span>
                      <a
                        href={`tel:${agency.phone}`}
                        className="ag-wilaya-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        اتصل
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ===== 4. Join as Agent Section ===== */}
      <section
        className="ag-join-section"
        ref={(el) => (sectionsRef.current[3] = el)}
      >
        <div className="ag-container">
          <div className="ag-join-wrapper">
            <div className="ag-join-info">
              <span className="ag-section-badge">انضم إلينا</span>
              <h2 className="ag-section-title" style={{ textAlign: "right" }}>
                انضم كوكيل عقاري معتمد
              </h2>
              <p className="ag-join-text">
                كن جزءاً من شبكة ADAR العقارية واحصل على فرصة للوصول إلى
                آلاف العملاء المحتملين. نوفر لك أدوات احترافية، لوحة تحكم
                متقدمة، ودعم فني متواصل.
              </p>

              <div className="ag-join-perks">
                <div className="ag-perk">
                  <FiUsers />
                  <span>وصول لآلاف العملاء</span>
                </div>
                <div className="ag-perk">
                  <FiAward />
                  <span>شارة الوكيل المعتمد</span>
                </div>
                <div className="ag-perk">
                  <FiTrendingUp />
                  <span>لوحة تحكم وإحصائيات</span>
                </div>
              </div>
            </div>

            <form className="ag-join-form" onSubmit={handleFormSubmit}>
              <h3 className="ag-form-title">قدم طلبك الآن</h3>

              <div className="ag-form-group">
                <label>اسم الوكالة أو الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="مثال: دار العقارات الجزائرية"
                  required
                />
              </div>

              <div className="ag-form-group">
                <label>رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="0555 123 456"
                  required
                />
              </div>

              <div className="ag-form-group">
                <label>الولاية</label>
                <select
                  name="wilaya"
                  value={form.wilaya}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">اختر الولاية</option>
                  <option value="الجزائر">الجزائر</option>
                  <option value="وهران">وهران</option>
                  <option value="قسنطينة">قسنطينة</option>
                  <option value="عنابة">عنابة</option>
                  <option value="باتنة">باتنة</option>
                  <option value="سطيف">سطيف</option>
                  <option value="البليدة">البليدة</option>
                  <option value="تلمسان">تلمسان</option>
                  <option value="الجلفة">الجلفة</option>
                  <option value="بجاية">بجاية</option>
                </select>
              </div>

              <div className="ag-form-group">
                <label>سنوات الخبرة</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">اختر الخبرة</option>
                  <option value="1-3">1 - 3 سنوات</option>
                  <option value="3-5">3 - 5 سنوات</option>
                  <option value="5-10">5 - 10 سنوات</option>
                  <option value="10+">أكثر من 10 سنوات</option>
                </select>
              </div>

              <button type="submit" className="ag-form-btn">
                <FiSend /> إرسال الطلب
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== 5. Back Button ===== */}
      <section
        className="ag-back-section"
        ref={(el) => (sectionsRef.current[4] = el)}
      >
        <div className="ag-container" style={{ textAlign: "center" }}>
          <h2 className="ag-section-title" style={{ color: "#fff" }}>
            ابدأ رحلتك العقارية الآن
          </h2>
          <p
            className="ag-section-subtitle"
            style={{
              color: "rgba(255,255,255,0.55)",
              maxWidth: "550px",
              margin: "0 auto 2rem",
            }}
          >
            تصفح آلاف العقارات المتاحة أو تواصل مع الوكالة المناسبة لك
          </p>
          <div className="ag-back-buttons">
            <button
              className="ag-back-btn ag-back-btn-primary"
              onClick={() => navigate("/properties")}
            >
              تصفح العقارات
            </button>
            <button
              className="ag-back-btn ag-back-btn-secondary"
              onClick={() => navigate("/")}
            >
              <FiArrowLeft /> العودة للرئيسية
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agencies;