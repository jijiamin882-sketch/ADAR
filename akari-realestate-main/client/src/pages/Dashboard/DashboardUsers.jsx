import React, { useState, useEffect } from "react";
import { FiUsers, FiShield, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../supabaseClient";

export default function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);

    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert("خطأ في تغيير الدور: " + error.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "#ef4444";
      case "owner": return "#3b82f6";
      case "provider": return "#f59e0b";
      default: return "#94a3b8";
    }
  };

  const getRoleName = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "مدير";
      case "owner": return "مالك عقار";
      case "provider": return "مقدم خدمة";
      default: return "مستخدم عادي";
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiUsers style={{ color: "#f1c991" }} /> إدارة المستخدمين
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "5px" }}>عرض جميع الحسابات وتغيير الأدوار.</p>
      </div>

      <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>جاري تحميل المستخدمين...</p>
        ) : users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <h3>لا يوجد مستخدمين مسجلين بعد.</h3>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                <th style={{ padding: "15px", color: "#94a3b8" }}>المستخدم</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>البريد الإلكتروني</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>الدور الحالي</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>تاريخ التسجيل</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>تغيير الدور</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  
                  {/* اسم المستخدم */}
                  <td style={{ padding: "15px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ 
                        width: "35px", height: "35px", borderRadius: "50%", 
                        background: "rgba(241, 201, 145, 0.2)", color: "#f1c991",
                        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold"
                      }}>
                        {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: "500", color: "#e2e8f0" }}>
                        {user.full_name || "لم يحدد اسم"}
                      </span>
                    </span>
                  </td>

                  {/* الإيميل */}
                  <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }} dir="ltr">
                    {user.email}
                  </td>

                  {/* الدور الحالي */}
                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      background: `${getRoleColor(user.role)}20`, 
                      color: getRoleColor(user.role), 
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" 
                    }}>
                      {getRoleName(user.role)}
                    </span>
                  </td>

                  {/* تاريخ التسجيل */}
                  <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>
                    {new Date(user.created_at).toLocaleDateString("ar-DZ")}
                  </td>

                  {/* أزرار تغيير الدور */}
                  <td style={{ padding: "15px" }}>
                    <select 
                      value={user.role?.toLowerCase() || "user"}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      style={{
                        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "#e2e8f0", padding: "6px 10px", borderRadius: "6px", fontSize: "13px",
                        cursor: "pointer", fontFamily: "inherit", outline: "none"
                      }}
                    >
                      <option value="user" style={{ background: "#1e293b" }}>مستخدم عادي</option>
                      <option value="owner" style={{ background: "#1e293b" }}>مالك عقار</option>
                      <option value="provider" style={{ background: "#1e293b" }}>مقدم خدمة</option>
                      <option value="admin" style={{ background: "#1e293b" }}>مدير (Admin)</option>
                    </select>
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