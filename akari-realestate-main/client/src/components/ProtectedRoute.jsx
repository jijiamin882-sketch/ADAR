import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setChecking(false);
      return;
    }

    const checkRole = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", currentUser.id)
        .single();

      // تحويل لصغير عشان Admin أو ADMIN تصبح admin
      setUserRole(data?.role?.toLowerCase() || "user");
      setChecking(false);
    };

    checkRole();
  }, [currentUser?.id]);

  // 1. لم يسجل دخول → ارجعه للرئيسية
  if (!currentUser) return <Navigate to="/" replace />;

  // 2. جاري التحقق من الدور → اعرض تحميل
  if (checking) return (
    <div style={{ textAlign: "center", padding: "100px", color: "#888" }}>
      جاري التحقق من صلاحياتك...
    </div>
  );

  // 3. دوره غير مصرح له → ارجعه للوحة التحكم الأساسية
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 4. كل شيء تمام → اعرض الصفحة
  return children;
}