import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiLogOut, FiMenu, FiX, FiHeart, FiGrid, FiUsers, FiTool, FiPlusCircle, FiAlertCircle } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userRole, setUserRole] = useState('user');
  
  const [stats, setStats] = useState({ 
    totalProperties: 0, activeProperties: 0, totalFavorites: 0, totalServices: 0, totalUsers: 0, messages: 0, pendingItems: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;
    const fetchRole = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('role').eq('id', currentUser.id).single();
        if (error) throw error;
        setUserRole(data?.role?.toLowerCase() || 'user');
      } catch (err) {
        console.warn("Error fetching role:", err.message);
        setUserRole('user');
      }
    };
    fetchRole();
  }, [currentUser?.id]);

  const isActive = (path) => location.pathname === path ? 'dash-link active' : 'dash-link';

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
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchData();
  }, [currentUser?.id, userRole]);

  // <-- 3. ترجمة أسماء الأدوار
  const getRoleName = () => {
    switch (userRole) {
      case 'admin': return t('dash_role_admin');
      case 'owner': return t('dash_role_owner');
      case 'provider': return t('dash_role_provider');
      default: return t('dash_role_user');
    }
  };

  // <-- 4. ترجمة روابط القائمة الجانبية
  const renderSidebarLinks = () => {
    if (userRole === 'admin') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiGrid className="dash-link-icon" /> {t('dash_nav_home')}</Link>
          <Link to="/AddProperty" className={isActive('/AddProperty')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> {t('dash_nav_add_prop')}</Link>
          <Link to="/AddService" className={isActive('/AddService')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> {t('dash_nav_add_svc')}</Link>
          <Link to="/dashboard/my-properties" className={isActive('/dashboard/my-properties')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> {t('dash_nav_manage_props')}</Link>
          <Link to="/dashboard/my-services" className={isActive('/dashboard/my-services')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> {t('dash_nav_manage_svcs')}</Link>
          <Link to="/dashboard/moderation" className={isActive('/dashboard/moderation')} onClick={() => setSidebarOpen(false)}><FiAlertCircle className="dash-link-icon" /> {t('dash_nav_moderation')}</Link>
          <Link to="/dashboard/users" className={isActive('/dashboard/users')} onClick={() => setSidebarOpen(false)}><FiUsers className="dash-link-icon" /> {t('dash_nav_users')}</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> {t('dash_nav_messages')}</Link>
        </>
      );
    }
    if (userRole === 'owner') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> {t('dash_nav_home')}</Link>
          <Link to="/AddProperty" className={isActive('/AddProperty')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> {t('dash_nav_new_prop')}</Link>
          <Link to="/dashboard/my-properties" className={isActive('/dashboard/my-properties')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> {t('dash_nav_my_props')}</Link>
          <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> {t('dash_nav_favorites')}</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> {t('dash_nav_messages')}</Link>
        </>
      );
    }
    if (userRole === 'provider') {
      return (
        <>
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> {t('dash_nav_home')}</Link>
          <Link to="/AddService" className={isActive('/AddService')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> {t('dash_nav_new_svc')}</Link>
          <Link to="/dashboard/my-services" className={isActive('/dashboard/my-services')} onClick={() => setSidebarOpen(false)}><FiTool className="dash-link-icon" /> {t('dash_nav_my_svcs')}</Link>
          <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> {t('dash_nav_favorites')}</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> {t('dash_nav_messages')}</Link>
        </>
      );
    }
    return (
      <>
        <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> {t('dash_nav_home')}</Link>
        <Link to="/favorites" className={isActive('/favorites')} onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> {t('dash_nav_favorites')}</Link>
      </>
    );
  };

  // <-- 5. ترجمة بطاقات الإحصائيات
  const renderStatsCards = () => {
    if (userRole === 'admin') {
      return (
        <>
          <StatCard to="/dashboard/moderation" title={t('dash_stat_pending')} value={stats.pendingItems} color="red" loading={loadingStats} />
          <StatCard to="/dashboard/my-properties" title={t('dash_stat_total_props')} value={stats.totalProperties} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/my-services" title={t('dash_stat_total_svcs')} value={stats.totalServices} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/users" title={t('dash_stat_total_users')} value={stats.totalUsers} color="gold" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title={t('dash_stat_new_msgs')} value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    if (userRole === 'owner') {
      return (
        <>
          <StatCard to="/dashboard/my-properties" title={t('dash_stat_my_props')} value={stats.totalProperties} color="blue" loading={loadingStats} />
          <StatCard to="/favorites" title={t('dash_stat_my_favs')} value={stats.totalFavorites} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/my-properties" title={t('dash_stat_active_props')} value={stats.activeProperties} color="gold" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title={t('dash_stat_new_msgs')} value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    if (userRole === 'provider') {
      return (
        <>
          <StatCard to="/dashboard/my-services" title={t('dash_stat_my_svcs')} value={stats.totalServices} color="blue" loading={loadingStats} />
          <StatCard to="/favorites" title={t('dash_stat_my_favs')} value={stats.totalFavorites} color="blue" loading={loadingStats} />
          <StatCard to="/dashboard/messages" title={t('dash_stat_new_msgs')} value={stats.messages} color="green" loading={loadingStats} />
        </>
      );
    }
    return (
      <StatCard to="/favorites" title={t('dash_stat_my_favs')} value={stats.totalFavorites} color="blue" loading={loadingStats} />
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
          <p className="dash-logo-sub">{t('dash_control_panel')} ({getRoleName()})</p>
        </div>
        
        <nav className="dash-nav">
          {renderSidebarLinks()}
          <Link to="/" className="dash-link dash-logout" onClick={() => setSidebarOpen(false)}><FiLogOut className="dash-link-icon" /> {t('dash_nav_logout')}</Link>
        </nav>
      </aside>

      <main className={`dash-main ${sidebarOpen ? 'shifted' : ''}`}>
        {location.pathname === '/dashboard' ? (
          <>
            <div className="dash-welcome">
              <h1>{t('dash_welcome')}, {currentUser?.user_metadata?.full_name || currentUser?.email?.split('@')[0]} 👋</h1>
              <p>{t('dash_manage_account')} ({t('dash_role_label')}: {getRoleName()}).</p>
            </div>
            <div className="dash-stats-grid">{renderStatsCards()}</div>
          </>
        ) : (
          <Outlet /> 
        )}
      </main>
    </div>
  );
}

const StatCard = ({ to, title, value, color, loading }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div className={`dash-stat-card ${color}`} style={{ cursor: 'pointer' }}>
      <h3 className="dash-stat-title">{title}</h3>
      <span className="dash-stat-number">{loading ? '...' : value}</span>
    </div>
  </Link>
);