import React, { useState, useEffect } from "react";
import { FiAlertCircle, FiCheck, FiX, FiHome, FiTool, FiCheckCircle, FiMail, FiEye } from "react-icons/fi";
import { supabase } from "../../supabaseClient";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function DashboardModeration() {
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  const [pendingProperties, setPendingProperties] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);

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

  const handlePropertyAction = async (prop, action) => {
    if (action === "approve") {
      setApprovingId(prop.id);
      try {
        const { error: updateError } = await supabase.from("properties").update({ status: "active" }).eq("id", prop.id);
        if (updateError) throw updateError;

        if (prop.owner_email) {
          // <-- 3. ترجمة وتنسيق رسالة الإيميل
          const subject = encodeURIComponent(t('mod_email_prop_subject'));
          const bodyText = t('mod_email_prop_body')
            .replace('{name}', prop.owner_name || '')
            .replace('{title}', prop.title || '')
            .replace('{footer}', t('mod_email_footer'));
          const body = encodeURIComponent(bodyText);
          
          window.open(`mailto:${prop.owner_email}?subject=${subject}&body=${body}`, '_blank');
        }
        setPendingProperties(prev => prev.filter(p => p.id !== prop.id));
      } catch (error) {
        alert(t('mod_err_prop'));
      } finally {
        setApprovingId(null);
      }
    } else {
      if (window.confirm(t('mod_confirm_delete_prop'))) {
        await supabase.from("properties").delete().eq("id", prop.id);
        setPendingProperties(prev => prev.filter(p => p.id !== prop.id));
      }
    }
  };

  const handleServiceAction = async (serv, action) => {
    if (action === "approve") {
      try {
        const { error: updateError } = await supabase.from("services").update({ status: "active" }).eq("id", serv.id);
        if (updateError) throw updateError;
        if (serv.owner_email) {
          const subject = encodeURIComponent(t('mod_email_svc_subject'));
          const bodyText = t('mod_email_svc_body')
            .replace('{name}', serv.owner_name || '')
            .replace('{title}', serv.title || serv.name || '')
            .replace('{footer}', t('mod_email_footer'));
          const body = encodeURIComponent(bodyText);
          
          window.open(`mailto:${serv.owner_email}?subject=${subject}&body=${body}`, '_blank');
        }
        setPendingServices(prev => prev.filter(s => s.id !== serv.id));
      } catch (error) {
        alert(t('mod_err_svc'));
      }
    } else {
      if (window.confirm(t('mod_confirm_delete_svc'))) {
        await supabase.from("services").delete().eq("id", serv.id);
        setPendingServices(prev => prev.filter(s => s.id !== serv.id));
      }
    }
  };

  const totalCount = pendingProperties.length + pendingServices.length;

  const getPropertyImages = (prop) => {
    let imgs = [];
    if (prop.images && Array.isArray(prop.images)) imgs = [...prop.images];
    if (prop.image && !imgs.includes(prop.image)) imgs.unshift(prop.image);
    return imgs;
  };

  if (loading) return <p style={{ textAlign: "center", padding: "40px", color: "#888" }}>{t('mod_loading')}</p>;

  return (
    <div>
      {lightboxImg && (
        <div onClick={() => setLightboxImg(null)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'zoom-out' }}>
          <img src={lightboxImg} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', boxShadow: '0 0 30px rgba(0,0,0,0.5)' }} />
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ margin: 0, color: "#fff", fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiAlertCircle style={{ color: "#f59e0b" }} /> {t('mod_title')}
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "5px" }}>{t('mod_desc')}</p>
      </div>

      {totalCount === 0 ? (
        <div className="dash-content-box" style={{ textAlign: "center", padding: "60px", color: "#888" }}>
          <FiCheckCircle size={48} style={{ marginBottom: "15px", color: "#10b981" }} />
          <h3>{t('mod_empty')}</h3>
        </div>
      ) : (
        <>
          {pendingProperties.length > 0 && (
            <div className="dash-content-box" style={{ marginBottom: "30px", padding: 0, overflow: "hidden" }}>
              <h3 style={{ padding: "15px", margin: 0, borderBottom: "1px solid #1e293b", color: "#f1c991" }}>
                <FiHome style={{ verticalAlign: "middle", marginLeft: "8px" }} /> {t('mod_props_title')} ({pendingProperties.length})
              </h3>
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "25px" }}>
                {pendingProperties.map(prop => {
                  const allImages = getPropertyImages(prop);
                  return (
                    <div key={prop.id} style={{ border: "1px solid #1e293b", borderRadius: "12px", padding: "20px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ margin: "0 0 5px 0", color: "#fff", fontSize: "18px" }}>{prop.title}</h4>
                        <span style={{ color: "#94a3b8", fontSize: "14px" }}>{t('mod_by')}: {prop.owner_name || t('mod_unknown')} | {t('mod_price')}: <strong style={{color: '#f1c991'}}>{Number(prop.price).toLocaleString()} {t('pd_currency')}</strong> | {t('mod_area')}: {prop.area} {t('mod_sqm')}</span>
                        {prop.owner_email && (
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#3b82f6", fontSize: "13px", marginTop: "5px" }}>
                            <FiMail size={13} /> {prop.owner_email}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                          <h5 style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '14px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>{t('mod_prop_imgs')}</h5>
                          {allImages.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                              {allImages.map((img, i) => (
                                <div key={i} onClick={() => setLightboxImg(img)} style={{ position: 'relative', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: i === 0 ? '2px solid #f1c991' : '2px solid #334155' }}>
                                  <img src={img} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} onError={(e) => e.target.src = 'https://placehold.co/100x80/1a1a2e/ffffff?text=?'} />
                                  {i === 0 && <span style={{ position: 'absolute', top: 0, right: 0, background: '#f1c991', color: '#000', fontSize: '10px', padding: '2px 6px', fontWeight: 'bold' }}>{t('mod_main')}</span>}
                                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0, transition: '0.2s' }}
                                    onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                                    onMouseOut={(e) => e.currentTarget.style.opacity = 0}
                                  >
                                    <FiEye color="#fff" size={20} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: '#64748b', fontSize: '13px' }}>{t('mod_no_imgs')}</p>
                          )}
                        </div>

                        <div>
                          <h5 style={{ margin: '0 0 10px 0', color: '#cbd5e1', fontSize: '14px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>{t('mod_docs_title')}</h5>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {prop.id_image ? (
                              <div onClick={() => setLightboxImg(prop.id_image)} style={{ cursor: 'pointer' }}>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>{t('mod_id_img')}</span>
                                <img src={prop.id_image} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #334155' }} />
                              </div>
                            ) : <p style={{ color: '#64748b', fontSize: '13px' }}>{t('mod_no_id')}</p>}
                            
                            {prop.deed_image ? (
                              <div onClick={() => setLightboxImg(prop.deed_image)} style={{ cursor: 'pointer' }}>
                                <span style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px' }}>{t('mod_deed_img')}</span>
                                <img src={prop.deed_image} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #334155' }} />
                              </div>
                            ) : <p style={{ color: '#64748b', fontSize: '13px' }}>{t('mod_no_deed')}</p>}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #1e293b" }}>
                        <button onClick={() => handlePropertyAction(prop, "reject")} style={{ ...btnStyle, background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444" }}>
                          <FiX /> {t('mod_reject')}
                        </button>
                        <button disabled={approvingId === prop.id} onClick={() => handlePropertyAction(prop, "approve")} style={{ ...btnStyle, background: approvingId === prop.id ? "#065f46" : "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid #10b981" }}>
                          <FiMail style={{ marginLeft: "3px" }} /> {approvingId === prop.id ? t('mod_publishing') : t('mod_publish_email')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {pendingServices.length > 0 && (
            <div className="dash-content-box" style={{ padding: 0, overflow: "hidden" }}>
              <h3 style={{ padding: "15px", margin: 0, borderBottom: "1px solid #1e293b", color: "#f1c991" }}>
                <FiTool style={{ verticalAlign: "middle", marginLeft: "8px" }} /> {t('mod_svcs_title')} ({pendingServices.length})
              </h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.03)", textAlign: "right" }}>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>{t('mod_svc')}</th>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>{t('mod_provider')}</th>
                    <th style={{ padding: "15px", color: "#94a3b8" }}>{t('mod_action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingServices.map(serv => (
                    <tr key={serv.id} style={{ borderBottom: "1px solid #1e293b" }}>
                      <td style={{ padding: "15px", color: "#e2e8f0" }}>{serv.title || serv.name}</td>
                      <td style={{ padding: "15px", color: "#94a3b8", fontSize: "13px" }}>
                        {serv.owner_name || t('mod_unknown')}
                        {serv.owner_email && <div style={{ fontSize: '11px', color: '#3b82f6', marginTop: '2px' }}><FiMail size={10} style={{verticalAlign: 'middle'}} /> {serv.owner_email}</div>}
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleServiceAction(serv, "approve")} style={{ ...btnStyle, background: "rgba(16, 185, 129, 0.2)", color: "#10b981", border: "1px solid #10b981" }}>
                            <FiMail /> {t('mod_accept_email')}
                          </button>
                          <button onClick={() => handleServiceAction(serv, "reject")} style={{ ...btnStyle, background: "rgba(239, 68, 68, 0.2)", color: "#ef4444", border: "1px solid #ef4444" }}>
                            <FiX /> {t('mod_reject_btn')}
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
  display: "flex", alignItems: "center", gap: "5px", padding: "8px 16px", borderRadius: "6px",
  fontWeight: "bold", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", background: "transparent"
};