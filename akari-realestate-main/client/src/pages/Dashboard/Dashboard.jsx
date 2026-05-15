import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiLogOut, FiMenu, FiX, FiHeart, FiGrid, FiUsers, FiTool, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // === قراءة دور المستخدم ===
  const [userRole, setUserRole] = useState('user');
  
  // === تعريف stats مرة واحدة فقط (مع pendingItems) ===
  const [stats, setStats] = useState({ 
    totalProperties: 0, activeProperties: 0, totalFavorites: 0, totalServices: 0, totalUsers: 0, messages: 0, pendingItems: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

     useEffect(() => {
    if (!currentUser?.id) return;
    
    const fetchRole = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
          
        if (error) throw error;
        setUserRole(data?.role?.toLowerCase() || 'user');
      } catch (err) {
        console.warn("خطأ في جلب الدور، تم التعيين كمستخدم عادي:", err.message);
        setUserRole('user'); // يعطيه صلاحيات عادية بدل أن يتهنج
      }
    };
    
    fetchRole();
  }, [currentUser?.id]);

  const isActive = (path) => location.pathname === path ? 'dash-link active' : 'dash-link';

  // === جلب الإحصائيات فقط ===
  useEffect(() => {
    if (!currentUser?.id || !userRole) return;

    const fetchData = async () => {
      try {
        const newStats = { totalProperties: 0, activeProperties: 0, totalFavorites: 0, totalServices: 0, totalUsers: 0, messages: 0, pendingItems: 0 };
        
        if (userRole === 'admin') {
          const { count: totalProps } = await supabase.from('properties').select('*', { count: 'exact', head: true });
          const { count: totalServs } = await supabase.from('services').select('*', { count: 'exact', head: true });
          const { count: totalUsrs } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
          const { count: unreadMsgs } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
          const { count: pendingProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('status', 'pending');
          const { count: pendingServs } = await supabase.from('services').select('*', { count: 'exact', head: true }).eq('status', 'pending');

          newStats.pendingItems = (pendingProps || 0) + (pendingServs || 0);
          newStats.totalProperties = totalProps || 0;
          newStats.totalServices = totalServs || 0;
          newStats.totalUsers = totalUsrs || 0;
          newStats.messages = unreadMsgs || 0;

        } else if (userRole === 'owner') {
          const { count: totalProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
          const { count: activeProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id).eq('status', 'active');
          const { count: totalFavs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
          const { count: unreadMsgs } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
          
          newStats.totalProperties = totalProps || 0;
          newStats.activeProperties = activeProps || 0;
          newStats.totalFavorites = totalFavs || 0;
          newStats.messages = unreadMsgs || 0;

        } else if (userRole === 'provider') {
          const { count: totalServs } = await supabase.from('services').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
          const { count: totalFavs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
          const { count: unreadMsgs } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);
          
          newStats.totalServices = totalServs || 0;
          newStats.totalFavorites = totalFavs || 0;
          newStats.messages = unreadMsgs || 0;

        } else {
          const { count: totalFavs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
          newStats.totalFavorites = totalFavs || 0;
        }

        setStats(newStats);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchData();
  }, [currentUser?.id, userRole]);

  const getRoleName = () => {
    switch (userRole) {
      case 'admin': return 'مدير النظام';
      case 'owner': return 'مالك عقار';
      case 'provider': return 'مقدم خدمة';
      default: return 'مستخدم';
    }
  };

  const renderSidebarLinks = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiGrid className="dash-link-icon" /> الرئيسية</Link>
          <Link to="/AddProperty" className={isActive('/AddProperty')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة عقار</Link>
          <Link to="/AddService" className={isActive('/AddService')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة خدمة</Link>
          <Link to="/dashboard/my-properties" className={isActive('/dashboard/my-properties')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> إدارة العقارات</Link>
          <Link to="/dashboard/my-services" className={isActive('/dashboard/my-services')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> إدارة الخدمات</Link>
          <Link to="/dashboard/moderation" className={isActive('/dashboard/moderation')} onClick={() => setSidebarOpen(false)}><FiAlertCircle className="dash-link-icon" /> بانتظار الموافقة</Link>
          <Link to="/dashboard/users" className={isActive('/dashboard/users')} onClick={() => setSidebarOpen(false)}><FiUsers className="dash-link-icon" /> إدارة المستخدمين</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> الرسائل</Link>
        </>
      );
    }
    if (userRole === 'owner') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> الرئيسية</Link>
          <Link to="/AddProperty" className={isActive('/AddProperty')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة عقار جديد</Link>
          <Link to="/dashboard/my-properties" className={isActive('/dashboard/my-properties')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> عقاراتي</Link>
          <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> مفضلاتي</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> الرسائل</Link>
        </>
      );
    }
    if (userRole === 'provider') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> الرئيسية</Link>
          <Link to="/AddService" className={isActive('/AddService')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة خدمة جديدة</Link>
          <Link to="/dashboard/my-services" className={isActive('/dashboard/my-services')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> خدماتي</Link>
          <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> مفضلاتي</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> الرسائل</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> الرئيسية</Link>
        <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> مفضلاتي</Link>
      </>
    );
  };

  const renderStatsCards = () => {
    if (userRole === 'admin') {
      return (
        <>
          <StatCard to="/dashboard/moderation" title="بانتظار الموافقة" value={stats.pendingItems} color="red" loading={loadingStats} />
          <StatCard to="/dashboard/my-properties" title="إجمالي العقارات" value={stats.totalProperties} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/my-services" title="إجمالي الخدمات" value={stats.totalServices} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/users" title="إجمالي المستخدمين" value={stats.totalUsers} color="gold" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title="الرسائل الجديدة" value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    if (userRole === 'owner') {
      return (
        <>
          <StatCard to="/dashboard/my-properties" title="عقاراتي" value={stats.totalProperties} color="blue" loading={loadingStats} />
          <StatCard to="/favorites" title="مفضلاتي" value={stats.totalFavorites} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/my-properties" title="عقارات مفعّلة" value={stats.activeProperties} color="gold" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title="الرسائل الجديدة" value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    if (userRole === 'provider') {
      return (
        <>
          <StatCard to="/dashboard/my-services" title="خدماتي" value={stats.totalServices} color="blue" loading={loadingStats} />
          <StatCard to="/favorites" title="مفضلاتي" value={stats.totalFavorites} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title="الرسائل الجديدة" value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    return (
      <StatCard to="/favorites" title="مفضلاتي" value={stats.totalFavorites} color="blue" loading={loadingStats} />
    );
  };

  return (
    <div className="dash-wrapper">
      <button className={`dash-toggle-btn ${sidebarOpen ? 'shifted' : ''}`} onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FiX /> : <FiMenu />}
      </button>

      {sidebarOpen && <div className="dash-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`dash-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="dash-sidebar-header">
          <h2 className="dash-logo">ADAR</h2>
          <p className="dash-logo-sub">لوحة التحكم ({getRoleName()})</p>
        </div>
        
        <nav className="dash-nav">
          {renderSidebarLinks()}
          <Link to="/" className="dash-link dash-logout" onClick={() => setSidebarOpen(false)}><FiLogOut className="dash-link-icon" /> العودة للموقع</Link>
        </nav>
      </aside>

      <main className={`dash-main ${sidebarOpen ? 'shifted' : ''}`}>
        {location.pathname === '/dashboard' ? (
          <>
            <div className="dash-welcome">
              <h1>مرحباً بك، {currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0]} 👋</h1>
              <p>إدارة حسابك بسهولة (بدور: {getRoleName()}).</p>
            </div>

            <div className="dash-stats-grid">
              {renderStatsCards()}
            </div>
          </>
        ) : (
          <Outlet /> 
        )}
      </main>
    </div>
  );
}

// === مكون صغير لبطاقة الإحصائيات ===
const StatCard = ({ to, title, value, color, loading }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div className={`dash-stat-card ${color}`} style={{ cursor: 'pointer' }}>
      <h3 className="dash-stat-title">{title}</h3>
      <span className="dash-stat-number">{loading ? '...' : value}</span>
    </div>
  </Link>
);