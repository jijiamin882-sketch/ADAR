import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { FiMail, FiPhone, FiEye, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next'; // <-- استدعاء المكتبة

export default function DashboardMessages() {
  const { currentUser } = useAuth();
  const { t } = useTranslation(); // <-- تعريف الترجمة
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            properties (
              title,
              image
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length >= 0) {
          setMessages(data);
        }

      } catch (error) {
        console.error("Error fetching messages:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser?.id]);

  const markAsRead = async (msgId) => {
    await supabase.from('messages').update({ is_read: true }).eq('id', msgId);
    setMessages(prev => prev.map(msg => msg.id === msgId ? { ...msg, is_read: true } : msg));
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>{t('dash_loading_messages')}</div>;

  return (
    <div>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#64748b', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FiMail style={{ color: '#f1c991' }} /> {t('dash_inbox')}
        </h1>
        <p style={{ color: '#64748b', marginTop: '5px' }}>{t('dash_inbox_desc')}</p>
      </div>

      {messages.length === 0 ? (
        <div className="dash-content-box" style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
          <FiMail size={40} style={{ marginBottom: '15px', opacity: 0.5 }} />
          <h3>{t('dash_no_messages')}</h3>
          <p style={{ fontSize: '14px' }}>{t('dash_no_messages_desc')}</p>
        </div>
      ) : (
        <div className="dash-content-box" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', textAlign: 'right' }}>
                <th style={{ padding: '15px', color: '#64748b' }}>{t('dash_col_property')}</th>
                <th style={{ padding: '15px', color: '#64748b' }}>{t('dash_col_sender')}</th>
                <th style={{ padding: '15px', color: '#64748b' }}>{t('dash_col_message')}</th>
                <th style={{ padding: '15px', color: '#64748b' }}>{t('dash_col_date')}</th>
                <th style={{ padding: '15px', color: '#64748b' }}>{t('dash_col_status')}</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <tr key={msg.id} style={{ 
                  borderBottom: '1px solid #f1f5f9', 
                  backgroundColor: msg.is_read ? '#ffffff' : '#fffbeb'
                }}>
                  
                  <td style={{ padding: '15px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img 
                        src={msg.properties?.image || 'https://placehold.co/40x40/1a1a2e/ffffff?text=?'} 
                        alt="" 
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                        onError={(e) => e.target.src = 'https://placehold.co/40x40/1a1a2e/ffffff?text=?'}
                      />
                      <span style={{ fontWeight: '500', color: '#0f172a' }}>{msg.properties?.title || t('dash_deleted_property')}</span>
                    </span>
                  </td>
                  
                  <td style={{ padding: '15px' }}>
                    <span style={{ display: 'block', fontWeight: '500' }}>{msg.sender_name}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '12px' }}>
                      <FiPhone size={11} /> {msg.sender_phone}
                    </span>
                  </td>
                  
                                     <td style={{ padding: '15px', color: '#475569', maxWidth: '350px', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '13px' }}>
                    {msg.message_text}
                  </td>
                  
                  <td style={{ padding: '15px', color: '#94a3b8', fontSize: '13px' }}>
                    {new Date(msg.created_at).toLocaleDateString('ar-DZ')}
                  </td>
                  
                  <td style={{ padding: '15px' }}>
                    {msg.is_read ? (
                      <span style={{ color: '#10b981', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCheckCircle /> {t('dash_read')}
                      </span>
                    ) : (
                      <button 
                        onClick={() => markAsRead(msg.id)}
                        style={{ background: '#f1c991', color: '#0a0f18', border: 'none', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        {t('dash_mark_read')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}