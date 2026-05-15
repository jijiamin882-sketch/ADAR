import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiTrash2, FiSettings, FiPlusCircle } from "react-icons/fi";
import { supabase } from "../../../../../supabaseClient";
import { useAuth } from "../../../../../context/AuthContext";

export default function DashboardMyProperties() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("owner");

  useEffect(() => {
    if (!currentUser?.id) return;
    
    // قراءة الدور
    const fetchRole = async () => {
      const { data } = await supabase.from("profiles").select("role").eq("id", currentUser.id).single();
      setUserRole(data?.role?.toLowerCase() || "owner");
    };
    fetchRole();
  }, [currentUser?.id]);

  useEffect(() => {
    if (!currentUser?.id || !userRole) return;

    const fetchProperties = async () => {
      let query = supabase.from("properties").select("*").order("created_at", { ascending: false });

      // ✅ إذا كان Admin، يجلب كل العقارات. إذا مالك، يجلب عقاراته فقط.
      if (userRole !== "admin") {
        query = query.eq("user_id", currentUser.id);
      }

      const { data } = await query;
      setProperties(data || []);
      setLoading(false);
    };

    fetchProperties();
  }, [currentUser?.id, userRole]);

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا العقار؟")) {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (!error) setProperties(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";
    const { error } = await supabase.from("properties").update({ status: newStatus }).eq("id", id);
    if (!error) {
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    }
  };

  const pageTitle = userRole === "admin" ? "إدارة جميع العقارات" : "عقاراتي";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: "24px" }}>{pageTitle}</h1>
          <p style={{ color: "#94a3b8", marginTop: "5px" }}>
            {userRole === "admin" ? "مراجعة وتعديل كل العقارات الموجودة في المنصة." : "إدارة جميع عقاراتك."}
          </p>
        </div>
        <button onClick={() => navigate("/AddProperty")} style={addBtnStyle}>
          <FiPlusCircle style={{ verticalAlign: "middle", marginLeft: "5px" }} /> إضافة عقار جديد
        </button>
      </div>

      <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>جاري التحميل...</p>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <h3>لا توجد عقارات.</h3>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                <th style={{ padding: "15px", color: "#94a3b8" }}>العقار</th>
                {userRole === "admin" && <th style={{ padding: "15px", color: "#94a3b8" }}>المالك</th>}
                <th style={{ padding: "15px", color: "#94a3b8" }}>السعر</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>الحالة</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(prop => (
                <tr key={prop.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  <td style={{ padding: "15px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <img 
                        src={prop.image || "https://placehold.co/40x40/1a1a2e/f1c991?text=عقار"} 
                        alt="" 
                        style={{ width: "40px", height: "40px", borderRadius: "6px", objectFit: "cover" }}
                        onError={(e) => e.target.src = "https://placehold.co/40x40/1a1a2e/f1c991?text=عقار"}
                      />
                      <span style={{ fontWeight: "500", color: "#e2e8f0" }}>{prop.title}</span>
                    </span>
                  </td>
                  {/* ✅ عمود المالك يظهر للأدمن فقط */}
                  {userRole === "admin" && (
                    <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>
                      {prop.owner_name || prop.user_id?.slice(0, 8) + "..."}
                    </td>
                  )}
                  <td style={{ padding: "15px", fontWeight: "bold", color: "#f1c991" }}>{Number(prop.price).toLocaleString()} دج</td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      background: prop.status === "active" ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)", 
                      color: prop.status === "active" ? "#10b981" : "#f59e0b", 
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" 
                    }}>
                      {prop.status === "active" ? "مفعّل" : "معلّق"}
                    </span>
                  </td>
                  <td style={{ padding: "15px" }}>
                    <span style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => navigate(`/property/${prop.id}`)} title="معاينة" style={actionBtnStyle}><FiEye /></button>
                      <button onClick={() => handleToggleStatus(prop.id, prop.status)} title="تعليق/تفعيل" style={{ ...actionBtnStyle, color: prop.status === "active" ? "#f59e0b" : "#10b981" }}><FiSettings /></button>
                      <button onClick={() => handleDelete(prop.id)} title="حذف" style={{ ...actionBtnStyle, color: "#ef4444" }}><FiTrash2 /></button>
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