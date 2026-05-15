import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash2, FiSettings, FiPlusCircle } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";

export default function DashboardMyServices() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
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

      // ✅ إذا كان Admin، يجلب كل الخدمات
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
    if (window.confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
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

  const pageTitle = userRole === "admin" ? "إدارة جميع الخدمات" : "خدماتي";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>{pageTitle}</h1>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            {userRole === "admin" ? "مراقبة وإدارة كل الخدمات المضافة في المنصة." : "إدارة جميع خدماتك."}
          </p>
        </div>
        <button onClick={() => navigate("/AddService")} style={addBtnStyle}>
          <FiPlusCircle style={{ verticalAlign: "middle", marginLeft: "5px" }} /> إضافة خدمة جديدة
        </button>
      </div>

      <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>جاري التحميل...</p>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <h3>لا توجد خدمات.</h3>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                <th style={{ padding: "15px", color: "#94a3b8" }}>الخدمة</th>
                {userRole === "admin" && <th style={{ padding: "15px", color: "#94a3b8" }}>مقدم الخدمة</th>}
                <th style={{ padding: "15px", color: "#94a3b8" }}>الحالة</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {services.map(serv => (
                <tr key={serv.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "15px" }}>
                    <span style={{ fontWeight: "500", color: "#e2e8f0" }}>{serv.title || serv.name || "بدون اسم"}</span>
                  </td>
                  {/* ✅ عمود مقدم الخدمة يظهر للأدمن فقط */}
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
                      {serv.status === "active" ? "مفعّلة" : "معلّقة"}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => handleToggleStatus(serv.id, serv.status)} title="تعليق/تفعيل" style={{ ...actionBtnStyle, color: serv.status === "active" ? "#f59e0b" : "#10b981" }}><FiSettings /></button>
                      <button onClick={() => handleDelete(serv.id)} title="حذف" style={{ ...actionBtnStyle, color: "#ef4444" }}><FiTrash2 /></button>
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