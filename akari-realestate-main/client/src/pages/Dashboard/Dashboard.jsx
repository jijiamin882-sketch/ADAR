import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { FiHome, FiMessageSquare, FiSettings, FiPlusCircle, FiLogOut, FiMenu, FiX, FiHeart, FiEye, FiEdit3, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path ? 'dash-link active' : 'dash-link';

  const [stats, setStats] = useState({ totalProperties: 0, activeProperties: 0, totalFavorites: 0, messages: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  const [recentProperties, setRecentProperties] = useState([]);
  const [loadingTable, setLoadingTable] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      try {
        const { count: totalProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
        const { count: activeProps } = await supabase.from('properties').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id).eq('status', 'active');
        const { count: totalFavs } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', currentUser.id);
        const { count: unreadMsgs } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false);

        setStats({
          totalProperties: totalProps || 0,
          activeProperties: activeProps || 0,
          totalFavorites: totalFavs || 0,
          messages: unreadMsgs || 0 
        });

        const { data: properties } = await supabase
          .from('properties')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentProperties(properties || []);
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setLoadingStats(false);
        setLoadingTable(false);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  const handleQuickDelete = async (e, id) => {
    e.preventDefault();
    if (window.confirm("هل أنت متأكد من حذف هذا العقار؟")) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) {
        setRecentProperties(prev => prev.filter(p => p.id !== id));
        setStats(prev => ({ ...prev, totalProperties: prev.totalProperties - 1 }));
      } else {
        alert("حدث خطأ أثناء الحذف");
      }
    }
  };

  const handleToggleStatus = async (e, id, currentStatus) => {
    e.preventDefault();
    const newStatus = currentStatus === 'active' ? 'pending' : 'active';
    const statusText = newStatus === 'active' ? 'تفعيل' : 'تعليق';

    if (window.confirm(`هل تريد ${statusText} هذا العقار؟`)) {
      const { error } = await supabase.from('properties').update({ status: newStatus }).eq('id', id);
      if (!error) {
        setRecentProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setStats(prev => ({ ...prev, activeProperties: newStatus === 'active' ? prev.activeProperties + 1 : prev.activeProperties - 1 }));
      }
    }
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
          <p className="dash-logo-sub">لوحة التحكم</p>
        </div>
        <nav className="dash-nav">
          <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> الرئيسية</Link>
          <Link to="/AddProperty" className={isActive('/AddProperty')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة عقار جديد</Link>
          <Link to="/AddService" className={isActive('/AddService')} onClick={() => setSidebarOpen(false)}><FiPlusCircle className="dash-link-icon" /> إضافة خدمة جديدة</Link>
          <Link to="/properties?mine=true" className={isActive('/properties?mine=true')} onClick={() => setSidebarOpen(false)}><FiHome className="dash-link-icon" /> عقاراتي</Link>
          <Link to="/favorites" className="dash-link" onClick={() => setSidebarOpen(false)}><FiHeart className="dash-link-icon" /> مفضلاتي</Link>
          <Link to="/dashboard/messages" className={isActive('/dashboard/messages')} onClick={() => setSidebarOpen(false)}><FiMessageSquare className="dash-link-icon" /> الرسائل</Link>
          <Link to="/#" className="dash-link dash-logout"><FiLogOut className="dash-link-icon" /> العودة للموقع</Link>
        </nav>
      </aside>

      <main className={`dash-main ${sidebarOpen ? 'shifted' : ''}`}>
        {location.pathname === '/dashboard' ? (
          <>
            <div className="dash-welcome">
              <h1>مرحباً بك في لوحة التحكم 👋</h1>
              <p>إدارة عقاراتك ومتابعة الاهتمامات بسهولة.</p>
            </div>

            <div className="dash-stats-grid">
              <Link to="/properties?mine=true" style={{ textDecoration: 'none' }}>
                <div className="dash-stat-card blue" style={{ cursor: 'pointer' }}>
                  <h3 className="dash-stat-title">عقاراتي</h3>
                  <span className="dash-stat-number">{loadingStats ? '...' : stats.totalProperties}</span>
                </div>
              </Link>
              <Link to="/Services?mine=true" style={{ textDecoration: 'none' }}>
                <div className="dash-stat-card blue" style={{ cursor: 'pointer' }}>
                  <h3 className="dash-stat-title">خدماتي</h3>
                  <span className="dash-stat-number">{loadingStats ? '...' : stats.totalProperties}</span>
                </div>
              </Link>

              <Link to="/favorites" style={{ textDecoration: 'none' }}>
                <div className="dash-stat-card blue" style={{ cursor: 'pointer' }}>
                  <h3 className="dash-stat-title">مفضلاتي</h3>
                  <span className="dash-stat-number">{loadingStats ? '...' : stats.totalFavorites}</span>
                </div>
              </Link>

              <Link to="/properties?mine=true" style={{ textDecoration: 'none' }}>
                <div className="dash-stat-card gold" style={{ cursor: 'pointer' }}>
                  <h3 className="dash-stat-title">عقارات مفعّلة</h3>
                  <span className="dash-stat-number">{loadingStats ? '...' : stats.activeProperties}</span>
                </div>
              </Link>

              <Link to="/dashboard/messages" style={{ textDecoration: 'none' }}>
                <div className="dash-stat-card green" style={{ cursor: 'pointer' }}>
                  <h3 className="dash-stat-title">الرسائل الجديدة</h3>
                  <span className="dash-stat-number">{loadingStats ? '...' : stats.messages}</span>
                </div>
              </Link>
            </div>

            <div className="dash-content-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>آخر العقارات المضافة</h2>
                <Link to="/AddProperty" style={{ background: '#f1c991', color: '#0a0f18', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px' }}>
                  <FiPlusCircle style={{ verticalAlign: 'middle', marginLeft: '5px' }} /> إضافة جديد
                </Link>
              </div>

              {loadingTable ? (
                <p style={{ textAlign: 'center', color: '#888' }}>جاري تحميل العقارات...</p>
              ) : recentProperties.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888' }}>لم تقم بإضافة أي عقارات بعد.</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'right' }}>
                      <th style={{ padding: '10px', color: '#64748b' }}>العقار</th>
                      <th style={{ padding: '10px', color: '#64748b' }}>السعر</th>
                      <th style={{ padding: '10px', color: '#64748b' }}>الحالة</th>
                      <th style={{ padding: '10px', color: '#64748b' }}>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProperties.map(prop => (
                      <tr key={prop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={prop.image || 'https://placehold.co/40x40/1a1a2e/ffffff?text=عقار'} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://placehold.co/40x40/1a1a2e/ffffff?text=عقار'} />
                            <span style={{ fontWeight: '500', color: '#64748b' }}>{prop.title}</span>
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: '#64748b' }}>{prop.price} دج</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: prop.status === 'active' ? '#dcfce7' : '#fef3c7', color: prop.status === 'active' ? '#166534' : '#92400e', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                            {prop.status === 'active' ? 'مفعّل' : 'معلّق'}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => navigate(`/property/${prop.id}`)} title="معاينة" style={actionBtnStyle}><FiEye /></button>
                            <button onClick={() => navigate(`/property/${prop.id}`)} title="تعديل" style={{ ...actionBtnStyle, color: '#3b82f6' }}><FiEdit3 /></button>
                            <button onClick={(e) => handleToggleStatus(e, prop.id, prop.status)} title="تعليق/تفعيل" style={{ ...actionBtnStyle, color: prop.status === 'active' ? '#f59e0b' : '#10b981' }}><FiSettings /></button>
                            <button onClick={(e) => handleQuickDelete(e, prop.id)} title="حذف" style={{ ...actionBtnStyle, color: '#ef4444' }}><FiTrash2 /></button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <Outlet /> 
        )}
      </main>
    </div>
  );
}

const actionBtnStyle = {
  background: '#f1f5f9',
  border: 'none',
  width: '32px',
  height: '32px',
  borderRadius: '6px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: '0.2s'
};