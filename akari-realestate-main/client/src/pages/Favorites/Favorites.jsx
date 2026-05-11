import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiMapPin, FiHome, FiTrash2 } from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import "./Favorites.css";

export default function Favorites() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب العقارات المفضلة مربوطة بتفاصيل العقار
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // نجلب المفضلة ونجلب بيانات العقار المرتبطة بها في طلب واحد (Join)
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
        
        // تنقية البيانات (في حال تم حذف العقار وبقيت المفضلة عالقة)
        const validFavorites = data.filter(item => item.properties !== null);
        setFavorites(validFavorites);
      } catch (error) {
        console.error("خطأ في جلب المفضلات:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [currentUser?.id]); // ✅ تم الإصلاح: نستخدم ID فقط لمنع التكرار اللانهائي

  // دالة إزالة العقار من المفضلة
  const handleRemove = async (favId, propertyId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favId);

    if (!error) {
      setFavorites(prev => prev.filter(fav => fav.id !== favId));
    }
  };

  // حالة عدم تسجيل الدخول
  if (!currentUser) {
    return (
      <div className="fav-empty-state">
        <FiHeart size={50} color="#555" />
        <h2>يجب تسجيل الدخول أولاً</h2>
        <p>لرؤية عقاراتك المفضلة، يرجى تسجيل الدخول.</p>
        <button onClick={() => navigate('/login')} className="fav-login-btn">تسجيل الدخول</button>
      </div>
    );
  }

  // حالة التحميل
  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px', color: '#fff'}}>جاري تحميل المفضلة...</div>;
  }

  return (
    <div className="fav-wrapper">
      <div className="fav-container">
        
        {/* عنوان الصفحة */}
        <div className="fav-header">
          <h1><FiHeart style={{color: '#dc3545'}} /> عقاراتي المفضلة</h1>
          <p>لقد قمت بحفظ {favorites.length} عقار</p>
        </div>

        {/* حالة عدم وجود عقارات */}
        {favorites.length === 0 ? (
          <div className="fav-empty-state">
            <FiHeart size={60} color="#333" />
            <h2>لا توجد عقارات مفضلة حتى الآن</h2>
            <p>عندما تجد عقاراً يعجبك، اضغط على زر "حفظ" وسيظهر هنا.</p>
            <Link to="/properties" className="fav-browse-btn">تصفح العقارات</Link>
          </div>
        ) : (
          /* شبكة العقارات */
          <div className="fav-grid">
            {favorites.map((fav) => {
              const prop = fav.properties;
              
              // ✅ تم الإصلاح: التحقق من أن الرابط صحيح ويعمل قبل استخدامه
              const getValidImage = () => {
                const firstImg = prop.images?.find(img => img && img.startsWith('http'));
                if (firstImg) return firstImg;
                
                if (prop.image && prop.image.startsWith('http')) return prop.image;
                
                return 'https://placehold.co/400x250/1a1a2e/ffffff?text=لا+توجد+صورة';
              };

              const mainImage = getValidImage();
              
              return (
                <div key={fav.id} className="fav-card">
                  <Link to={`/property/${prop.id}`} className="fav-card-img-link">
                    {/* ✅ تم الإصلاح: إضافة onError لمنع ظهور 404 نهائياً */}
                    <img 
                      src={mainImage} 
                      alt={prop.title} 
                      className="fav-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/400x250/1a1a2e/ffffff?text=لا+توجد+صورة';
                      }}
                    />
                    <div className="fav-card-badge">
                      {prop.listing_type === 'rent' ? 'للكراء' : 'للبيع'}
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
                        title="إزالة من المفضلة"
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