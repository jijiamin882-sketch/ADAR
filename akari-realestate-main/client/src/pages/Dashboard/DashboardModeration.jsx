import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiCheck, FiX, FiHome, FiTool, FiCheckCircle } from "react-icons/fi";
import { supabase } from "../../supabaseClient";

export default function DashboardModeration() {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      const { data: props } = await supabase.from("properties").select("*").eq("status", "pending").order("created_at", { ascending: false });
      const { data: servs } = await supabase.from("services").select("*").eq("status", "pending").order("created_at", { ascending: false });
      
      setPendingProperties(props || []);
      setPendingServices(servs || []);
      setLoading(false);
    };
    fetchPending();
  }, []);

  // قبول أو رفض عقار
  const handlePropertyAction = async (id, action) => {
    if (action === "approve") {
      await supabase.from("properties").update({ status: "active" }).eq("id", id);
    } else {
      await supabase.from("properties").delete().eq("id", id);
    }
    setPendingProperties(prev => prev.filter(p => p.id !== id));
  };

  // قبول أو رفض خدمة
  const handleServiceAction = async (id, action) => {
    if (action === "approve") {
      await supabase.from("services").update({ status: "active" }).eq("id", id);
    } else {
      await supabase.from("services").delete().eq("id", id);
    }
    setPendingServices(prev => prev.filter(s => s.id !== id));
  };

  const totalCount = pendingProperties.length + pendingServices.length;

  if (loading) return <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>جاري التحميل...</p>;

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiAlertCircle style={{ color: "#f59e0b" }} /> بانتظار الموافقة
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "5px" }}>مراجعة المحتوى المضاف قبل نشره للعموم.</p>
      </div>

      {totalCount === 0 ? (
        <div className="dash-content-box" style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <FiCheckCircle size={48} style={{ marginBottom: "15px", color: "#10b981" }} />
          <h3>لا يوجد محتوى بانتظار المراجعة</h3>
          <p>كل شيء على ما يرام!</p>
        </div>
      ) : (
        <>
          {/* جدول العقارات المعلقة */}
                     {pendingProperties.length > 0 && (
            <div className="dash-content-box" style={{ marginBottom: "30px", padding: 0, overflow: "hidden" }}>
              <h3 style={{ padding: "15px", margin: 0, borderBottom: "1px solid #1e293b", color: "#f1c991" }}>
                <FiHome style={{ verticalAlign: "middle", marginLeft: "8px" }} /> عقارات بانتظار الموافقة ({pendingProperties.length})
              </h3>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {pendingProperties.map(prop => (
                  <div key={prop.id} style={{ border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", background: "rgba(255,255,255,0.02)" }}>
                    
                    {/* معلومات العقار */}
                    <div style={{ display: "flex", gap: "15px", marginBottom: "15px", alignItems: "center" }}>
                      <img src={prop.image || "https://placehold.co/60x60/1a1a2e/f1c991?text=عقار"} style={{ width: "60px", height: "60px", borderRadius: "8px", objectFit: "cover" }} />
                      <div>
                        <h4 style={{ margin: 0, color: "#fff" }}>{prop.title}</h4>
                        <span style={{ color: "#94a3b8", fontSize: "13px" }}>بواسطة: {prop.owner_name || "غير معروف"} | السعر: {Number(prop.price).toLocaleString()} دج</span>
                      </div>
                    </div>

                    {/* صور الوثائق المرفقة */}
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "15px" }}>
                      {prop.id_image && (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "5px" }}>الهوية الوطنية</span>
                          <a href={prop.id_image} target="_blank" rel="noreferrer">
                            <img src={prop.id_image} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #334155", cursor: "pointer" }} />
                          </a>
                        </div>
                      )}
                      {prop.deed_image && (
                        <div style={{ textAlign: "center" }}>
                          <span style={{ display: "block", color: "#94a3b8", fontSize: "12px", marginBottom: "5px" }}>عقد الملكية</span>
                          <a href={prop.deed_image} target="_blank" rel="noreferrer">
                            <img src={prop.deed_image} style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "6px", border: "1px solid #334155", cursor: "pointer" }} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* أزرار الإجراء */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                      <button onClick={() => handlePropertyAction(prop.id, "reject")} style={{ ...btnStyle, background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444" }}>
                        <FiX /> رفض وحذف
                      </button>
                      <button onClick={() => handlePropertyAction(prop.id, "approve")} style={{ ...btnStyle, background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid #10b981" }}>
                        <FiCheck /> قبول ونشر
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* جدول الخدمات المعلقة */}
          {pendingServices.length > 0 && (
            <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
              <h3 style={{ padding: "15px", margin: 0, borderBottom: "1px solid #1e293b", color: "#f1c991" }}>
                <FiTool style={{ verticalAlign: "middle", marginLeft: "8px" }} /> خدمات بانتظار الموافقة ({pendingServices.length})
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>الخدمة</th>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>مقدم الخدمة</th>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingServices.map(serv => (
                    <tr key={serv.id} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "15px", color: "#e2e8f0" }}>{serv.title || serv.name}</td>
                      <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>{serv.owner_name || "غير معروف"}</td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleServiceAction(serv.id, "approve")} style={{ ...btnStyle, background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid #10b981" }}>
                            <FiCheck /> قبول
                          </button>
                          <button onClick={() => handleServiceAction(serv.id, "reject")} style={{ ...btnStyle, background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444" }}>
                            <FiX /> رفض
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const btnStyle = {
  display: "flex", alignItems: "center", gap: "5px", padding: "6px 14px", borderRadius: "6px",
  fontWeight: "bold", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", background: "transparent"
};