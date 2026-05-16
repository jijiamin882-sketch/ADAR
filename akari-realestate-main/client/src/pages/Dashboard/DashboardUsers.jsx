import React, { useState, useEffect } from "react";
import { FiUsers, FiShield, FiTrash2 } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function DashboardUsers() {
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  const handleChangeRole = async (userId, newRole) => {
    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(t('users_err_role') + error.message);
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
      case "admin": return t('users_role_admin');
      case "owner": return t('users_role_owner');
      case "provider": return t('users_role_provider');
      default: return t('users_role_user');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiUsers style={{ color: "#f1c991" }} /> {t('users_title')}
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "5px" }}>{t('users_desc')}</p>
      </div>

      <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
        {loading ? (
          <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>{t('users_loading')}</p>
        ) : users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <h3>{t('users_empty')}</h3>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('users_th_name')}</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('users_th_email')}</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('users_th_role')}</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('users_th_date')}</th>
                <th style={{ padding: "15px", color: "#94a3b8" }}>{t('users_th_change')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderBottom: "1px solid #1e293b" }}>
                  
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
                        {user.full_name || t('users_no_name')}
                      </span>
                    </span>
                  </td>

                  <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }} dir="ltr">
                    {user.email}
                  </td>

                  <td style={{ padding: "15px" }}>
                    <span style={{ 
                      background: `${getRoleColor(user.role)}20`, 
                      color: getRoleColor(user.role), 
                      padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" 
                    }}>
                      {getRoleName(user.role)}
                    </span>
                  </td>

                  <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>
                    {new Date(user.created_at).toLocaleDateString("ar-DZ")}
                  </td>

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
                      <option value="user" style={{ background: "#1e293b" }}>{t('users_opt_user')}</option>
                      <option value="owner" style={{ background: "#1e293b" }}>{t('users_opt_owner')}</option>
                      <option value="provider" style={{ background: "#1e293b" }}>{t('users_opt_provider')}</option>
                      <option value="admin" style={{ background: "#1e293b" }}>{t('users_opt_admin')}</option>
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