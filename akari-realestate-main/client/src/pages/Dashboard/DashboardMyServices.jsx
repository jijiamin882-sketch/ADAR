import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiSettings, FiPlusCircle } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function DashboardMyServices() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("provider");

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchRole = async () => {
      const { data } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
      setUserRole(data?.role?.toLowerCase() || "provider");
    };
    fetchRole();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || !userRole) return;

    const fetchServices = async () => {
      let query = supabase.from("services").select("*").order("created_at", { ascending: false });
      if (userRole !== "admin") {
        query = query.eq("user_id", currentUser.id);
      }
      const { data } = await query;
      setServices(data || []);
      setLoading(false);
    };

    fetchServices();
  }, [currentUser?.id, userRole]);

  const handleDelete = async (id) => {
    if (window.confirm(t('my_svc_confirm_delete'))) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (!error) setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";
    const { error } = await supabase.from("services").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setServices(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    }
  };

  const pageTitle = userRole === "admin" ? t('my_svc_admin_title') : t('my_svc_user_title');

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>{pageTitle}</h1>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            {userRole === "admin" ? t('my_svc_admin_desc') : t('my_svc_user_desc')}
          </p>
        </div>
        <button onClick={() => navigate("/AddService")} style={addBtnStyle}>
          <FiPlusCircle style={{ verticalAlign: "middle", marginLeft: "5px" }} /> {t('my_svc_add_btn')}
        </button>
      </div>

      <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>{t('my_svc_loading')}</p>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <h3>{t('my_svc_empty')}</h3>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('my_svc_th_svc')}</th>
                {userRole === "admin" && <th style={{ padding: "15px", color: "#94a3b8" }}>{t('my_svc_th_provider')}</th>}
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('my_svc_th_status')}</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('my_svc_th_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {services.map(serv => (
                <tr key={serv.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "15px" }}>
                    <span style={{ fontWeight: "500", color: "#e2e8f0" }}>{serv.title || serv.name || t('my_svc_no_name')}</span>
                  </td>
                  {userRole === "admin" && (
                    <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>
                      {serv.owner_name || serv.user_id?.slice(0, 8) + "..."}
                    </td>
                  )}
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      background: serv.status === "active" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", 
                      color: serv.status === "active" ? "#10b981" : "#f59e0b", 
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" 
                    }}>
                      {serv.status === "active" ? t('my_svc_active') : t('my_svc_pending')}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleToggleStatus(serv.id, serv.status)} title={t('my_svc_toggle_title')} style={{ ...actionBtnStyle, color: serv.status === "active" ? "#f59e0b" : "#10b981" }}><FiSettings /></button>
                      <button onClick={() => handleDelete(serv.id)} title={t('my_svc_delete_title')} style={{ ...actionBtnStyle, color: "#ef4444" }}><FiTrash2 /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const addBtnStyle = {
  background: "#f1c991", color: "#0a0f18", padding: "10px 20px", borderRadius: "8px", 
  border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px", fontFamily: "inherit"
};

const actionBtnStyle = {
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8",
  width: "32px", height: "32px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
};