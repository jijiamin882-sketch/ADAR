import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiMapPin, FiHome, FiTrash2 } from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import "./Favorites.css";
import { useTranslation } from "react-i18next"; // <-- 1. استدعاء المكتبة

export default function Favorites() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation(); // <-- 2. تعريف الترجمة
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select(`
            id,
            property_id,
            properties (
              id,
              title,
              price,
              location,
              image,
              images,
              type,
              listing_type
            )
          `)
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const validFavorites = data.filter(item => item.properties !== null);
        setFavorites(validFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser?.id]);

  const handleRemove = async (favId, propertyId) => {
    const { error } = await supabase.from('favorites').delete().eq('id', favId);
    if (!error) {
      setFavorites(prev => prev.filter(fav => fav.id !== favId));
    }
  };

  if (!currentUser) {
    return (
      <div className="fav-empty-state">
        <FiHeart size={50} color="#555" />
        <h2>{t('fav_not_logged_title')}</h2>
        <p>{t('fav_not_logged_desc')}</p>
        <button onClick={() => navigate('/login')} className="fav-login-btn">{t('fav_login_btn')}</button>
      </div>
    );
  }

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px', color: '#fff'}}>{t('fav_loading')}</div>;
  }

  return (
    <div className="fav-wrapper">
      <div className="fav-container">
        
        <div className="fav-header">
          <h1><FiHeart style={{color: '#dc3545'}} /> {t('fav_page_title')}</h1>
          <p>{t('fav_page_count')} {favorites.length} {t('fav_page_word')}</p>
        </div>

        {favorites.length === 0 ? (
          <div className="fav-empty-state">
            <FiHeart size={60} color="#333" />
            <h2>{t('fav_empty_title')}</h2>
            <p>{t('fav_empty_desc')}</p>
            <Link to="/properties" className="fav-browse-btn">{t('fav_browse_btn')}</Link>
          </div>
        ) : (
          <div className="fav-grid">
            {favorites.map((fav) => {
              const prop = fav.properties;
              
              const getValidImage = () => {
                const firstImg = prop.images?.find(img => img && img.startsWith('http'));
                if (firstImg) return firstImg;
                if (prop.image && prop.image.startsWith('http')) return prop.image;
                return 'https://placehold.co/400x250/1a1a2e/ffffff?text=No+Image';
              };

              const mainImage = getValidImage();
              
              return (
                <div key={fav.id} className="fav-card">
                  <Link to={`/property/${prop.id}`} className="fav-card-img-link">
                    <img 
                      src={mainImage} 
                      alt={prop.title} 
                      className="fav-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x250/1a1a2e/ffffff?text=No+Image';
                      }}
                    />
                    <div className="fav-card-badge">
                      {prop.listing_type === 'rent' ? t('pd_for_rent') : t('pd_for_sale')}
                    </div>
                  </Link>
                  
                  <div className="fav-card-body">
                    <Link to={`/property/${prop.id}`} className="fav-card-title">
                      {prop.title}
                    </Link>
                    <p className="fav-card-location"><FiMapPin /> {prop.location}</p>
                    <div className="fav-card-footer">
                      <span className="fav-card-price">{prop.price}</span>
                      <button 
                        onClick={() => handleRemove(fav.id, prop.id)} 
                        className="fav-remove-btn"
                        title={t('fav_remove_title')}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
      </div>
    </div>
  );
}