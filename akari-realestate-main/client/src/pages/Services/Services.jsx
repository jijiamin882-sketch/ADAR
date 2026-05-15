import React, { useState, useEffect } from "react";
import {
  FiTool,
  FiTruck,
  FiLayout,
  FiFileText,
  FiSend,
  FiMapPin,
  FiUser,
  FiFilter,
  FiSearch,
  FiBriefcase,
  FiBox,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import "./Services.css";

const categories = [
  { id: "all", label: "الكل", icon: <FiFilter /> },
  { id: "maintenance", label: "صيانة", icon: <FiTool /> },
  { id: "transport", label: "نقل وشحن", icon: <FiTruck /> },
  { id: "architecture", label: "هندسة وتصميم", icon: <FiLayout /> },
  { id: "legal", label: "توثيق قانوني", icon: <FiFileText /> },
  { id: "cleaning", label: "تنظيف", icon: <FiBox /> },
  { id: "other", label: "أخرى", icon: <FiBriefcase /> },
];

const categoryLabels = {
  maintenance: "صيانة عقارات",
  transport: "نقل وشحن",
  architecture: "هندسة وتصميم",
  legal: "توثيق قانوني",
  cleaning: "تنظيف وخدمات",
  other: "خدمات أخرى",
};

const Services = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // <-- أضف هذا السطر
  const isMine = searchParams.get('mine') === 'true';
  const { currentUser } = useAuth();
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
         const fetchServices = async () => {
      setLoading(true);
      
      // بناء الاستعلام الأساسي
      let query = supabase.from("services").select("*");

      if (isMine && currentUser) {
        // إذا كان الرابط يحتوي على mine=true، اجلب خدماتي أنا فقط (بجميع حالاتها)
        query = query.eq("user_id", currentUser.id);
      } else {
        // غير ذلك، اعرض الخدمات العامة المفعلة للجميع
        query = query.eq("status", "active");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (!error && data) {
        setServices(data);
        setFilteredServices(data);
      }
      setLoading(false);
    };

    fetchServices();

    const channel = supabase
      .channel("realtime-services")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "services" },
        (payload) => {
          if (payload.new.status === "active") {
            setServices((prev) => [payload.new, ...prev]);
            if (activeFilter === "all" || payload.new.category === activeFilter) {
              setFilteredServices((prev) => [payload.new, ...prev]);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeFilter, isMine, currentUser?.id]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter((s) => s.category === activeFilter)
      );
    }
  }, [activeFilter, services]);

  const handleRequestService = async (service) => {
    if (!currentUser) {
      alert("يجب عليك تسجيل الدخول أولاً لتقديم طلب");
      navigate("/login");
      return;
    }

    const details = prompt(
      "اكتب تفاصيل طلبك هنا:\nمثال: أريد صيانة مكيف في غرفة المعيشة"
    );
    if (!details || details.trim() === "") return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: service.user_id,
          content: `طلب خدمة جديد بخصوص: "${service.title}"\nالتفاصيل: ${details}`,
          is_read: false,
        },
      ]);

      if (error) throw error;
      alert("تم إرسال طلبك بنجاح! سيقوم مقدم الخدمة بالتواصل معك قريباً ✅");
    } catch (error) {
      alert("حدث خطأ: " + error.message);
    }
  };

  const getCategoryCount = (catId) => {
    if (catId === "all") return services.length;
    return services.filter((s) => s.category === catId).length;
  };

  const uniqueWilayas = [...new Set(services.map((s) => s.wilaya))].length;

  return (
    <div className="svc-page">
      {/* Hero */}
             <div className="svc-hero">
        <div className="svc-hero-content">
          <span className="svc-hero-badge"> 
            {isMine ? "خدماتي في سوق ADAR" : "سوق ADAR للخدمات"}
          </span>
          <h1>
            {isMine ? "إدارة خدماتك المضافة" : "كل ما تحتاجه لعقارك في مكان واحد"}
          </h1>
          <p>
            {isMine 
              ? "هنا يمكنك مراجعة جميع الخدمات التي قمت بنشرها." 
              : "اكتشف أفضل مقدمي الخدمات العقارية في الجزائر، من الصيانة والنقل إلى التصميم والتوثيق القانوني"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="svc-stats-bar">
        <div className="svc-stat-item">
          <span className="svc-stat-number">{services.length}</span>
          <span className="svc-stat-label">خدمة متاحة</span>
        </div>
        <div className="svc-stat-item">
          <span className="svc-stat-number">{uniqueWilayas}</span>
          <span className="svc-stat-label">ولاية مغطاة</span>
        </div>
        <div className="svc-stat-item">
          <span className="svc-stat-number">24/7</span>
          <span className="svc-stat-label">تواصل مستمر</span>
        </div>
      </div>

      {/* Filters */}
      <div className="svc-filters">
        <div className="svc-filters-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`svc-filter-btn ${activeFilter === cat.id ? "active" : ""}`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.icon}
              {cat.label}
              <span className="svc-filter-count">{getCategoryCount(cat.id)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="svc-grid">
        {loading ? (
          <div className="svc-loading">
            <div className="svc-spinner"></div>
            <p style={{ color: "#94a3b8" }}>جاري تحميل الخدمات...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="svc-empty">
            <div className="svc-empty-icon">🔍</div>
            <h3>لا توجد خدمات في هذا التصنيف</h3>
            <p>جرب تصفح التصنيفات الأخرى أو عد لاحقاً</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div key={service.id} className="svc-card">
              {/* Card Header */}
              <div className="svc-card-header">
                <div className={`svc-card-icon ${service.category}`}>
                  {service.category === "maintenance" && <FiTool />}
                  {service.category === "transport" && <FiTruck />}
                  {service.category === "architecture" && <FiLayout />}
                  {service.category === "legal" && <FiFileText />}
                  {service.category === "cleaning" && <FiBox />}
                  {(service.category === "other" || !service.category) && (
                    <FiBriefcase />
                  )}
                </div>
                <span className="svc-card-category">
                  {categoryLabels[service.category] || "خدمات"}
                </span>
              </div>

              {/* Card Body */}
              <div className="svc-card-body">
                <h3 className="svc-card-title">{service.title}</h3>
                <p className="svc-card-desc">{service.description}</p>

                {/* Meta Info */}
                <div className="svc-card-meta">
                  <div className="svc-meta-row">
                    <span className="svc-meta-label">
                      <FiUser style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      مقدم الخدمة
                    </span>
                    <span className="svc-meta-value">
                      {service.provider_name}
                    </span>
                  </div>
                  <div className="svc-meta-row">
                    <span className="svc-meta-label">
                      <FiMapPin style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      الولاية
                    </span>
                    <span className="svc-meta-value">{service.wilaya}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="svc-card-price">
                  {service.price_type === "negotiable" ? (
                    <span className="svc-price-negotiable">
                      💰 حسب الاتفاق
                    </span>
                  ) : (
                    <span className="svc-price-tag">
                      {service.price}{" "}
                      <span>
                        دج {service.price_type === "hourly" ? "/ ساعة" : ""}
                      </span>
                    </span>
                  )}
                </div>

                {/* Request Button */}
                                 {/* إخفاء زر الطلب إذا كنت أشاهد خدماتي أنا */}
                {!isMine && (
                  <button
                    className="svc-request-btn"
                    onClick={() => handleRequestService(service)}
                  >
                    <FiSend />
                    طلب هذه الخدمة
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Services;