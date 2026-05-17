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
  FiBriefcase,
  FiBox,
} from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next"; // استدعاء الترجمة
import "./Services.css";

const Services = () => {
  const { t } = useTranslation(); // تعريف الترجمة
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMine = searchParams.get('mine') === 'true';
  const { currentUser } = useAuth();
  
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // تم نقل المصفوفات للداخل لتعمل مع t()
  const categories = [
    { id: "all", label: t('svc_cat_all'), icon: <FiFilter /> },
    { id: "maintenance", label: t('svc_cat_maintenance'), icon: <FiTool /> },
    { id: "transport", label: t('svc_cat_transport'), icon: <FiTruck /> },
    { id: "architecture", label: t('svc_cat_architecture'), icon: <FiLayout /> },
    { id: "legal", label: t('svc_cat_legal'), icon: <FiFileText /> },
    { id: "cleaning", label: t('svc_cat_cleaning'), icon: <FiBox /> },
    { id: "other", label: t('svc_cat_other'), icon: <FiBriefcase /> },
  ];

  const categoryLabels = {
    maintenance: t('svc_label_maintenance'),
    transport: t('svc_label_transport'),
    architecture: t('svc_label_architecture'),
    legal: t('svc_label_legal'),
    cleaning: t('svc_label_cleaning'),
    other: t('svc_label_other'),
  };

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      let query = supabase.from("services").select("*");

      if (isMine && currentUser) {
        query = query.eq("user_id", currentUser.id);
      } else {
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
  }, [activeFilter, isMine, currentUser?.id, t]);

  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((s) => s.category === activeFilter));
    }
  }, [activeFilter, services]);

  const handleRequestService = async (service) => {
    if (!currentUser) {
      alert(t('svc_alert_login'));
      navigate("/login");
      return;
    }

    const details = prompt(t('svc_alert_prompt'));
    if (!details || details.trim() === "") return;

    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: currentUser.id,
          receiver_id: service.user_id,
          content: `${t('svc_msg_prefix')} "${service.title}"\n${t('svc_msg_details')}: ${details}`,
          is_read: false,
        },
      ]);

      if (error) throw error;
      alert(t('svc_alert_success'));
    } catch (error) {
      alert(`${t('svc_alert_error')} ${error.message}`);
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
            {isMine ? t('svc_hero_badge_mine') : t('svc_hero_badge_public')}
          </span>
          <h1>
            {isMine ? t('svc_hero_title_mine') : t('svc_hero_title_public')}
          </h1>
          <p>
            {isMine 
              ? t('svc_hero_desc_mine') 
              : t('svc_hero_desc_public')}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="svc-stats-bar">
        <div className="svc-stat-item">
          <span className="svc-stat-number">{services.length}</span>
          <span className="svc-stat-label">{t('svc_stat_available')}</span>
        </div>
        <div className="svc-stat-item">
          <span className="svc-stat-number">{uniqueWilayas}</span>
          <span className="svc-stat-label">{t('svc_stat_wilayas')}</span>
        </div>
        <div className="svc-stat-item">
          <span className="svc-stat-number">24/7</span>
          <span className="svc-stat-label">{t('svc_stat_support')}</span>
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
            <p style={{ color: "#94a3b8" }}>{t('svc_loading')}</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="svc-empty">
            <div className="svc-empty-icon">🔍</div>
            <h3>{t('svc_empty_title')}</h3>
            <p>{t('svc_empty_desc')}</p>
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
                  {(service.category === "other" || !service.category) && <FiBriefcase />}
                </div>
                <span className="svc-card-category">
                  {categoryLabels[service.category] || t('svc_label_default')}
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
                      {t('svc_card_provider')}
                    </span>
                    <span className="svc-meta-value">{service.provider_name}</span>
                  </div>
                  <div className="svc-meta-row">
                    <span className="svc-meta-label">
                      <FiMapPin style={{ verticalAlign: "middle", marginLeft: 4 }} />
                      {t('svc_card_wilaya')}
                    </span>
                    <span className="svc-meta-value">{service.wilaya}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="svc-card-price">
                  {service.price_type === "negotiable" ? (
                    <span className="svc-price-negotiable">💰 {t('svc_price_negotiable')}</span>
                  ) : (
                    <span className="svc-price-tag">
                      {service.price}{" "}
                      <span>
                        {t('svc_currency')} {service.price_type === "hourly" ? t('svc_price_hourly') : ""}
                      </span>
                    </span>
                  )}
                </div>

                {/* Request Button */}
                {!isMine && (
                  <button className="svc-request-btn" onClick={() => handleRequestService(service)}>
                    <FiSend />
                    {t('svc_btn_request')}
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