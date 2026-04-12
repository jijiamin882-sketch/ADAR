import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiArrowRight, FiMapPin } from "react-icons/fi";
import "./Favourites.css";

export default function Favourites() {
  // مؤقتاً: مصفوفة فارغة = يظهر "لا توجد مفضلات"
  const favorites = [];

  return (
    <div className="favorites-page">
      <div className="favorites-page-container">

        <div className="favorites-page-header">
          <div>
            <span className="favorites-page-badge">
              <FiHeart /> المفضلة
            </span>
            <h1>العقارات المفضلة</h1>
            <p>العقارات التي قمت بحفظها ستظهر هنا</p>
          </div>
          <Link to="/properties" className="favorites-back-btn">
            <FiArrowRight /> تصفح العقارات
          </Link>
        </div>

        {favorites.length === 0 ? (
          <div className="favorites-empty">
            <div className="favorites-empty-icon">
              <FiHeart size={36} />
            </div>
            <h2>لا توجد عقارات في المفضلة</h2>
            <p>لم تقم بإضافة أي عقار إلى قائمة المفضلة بعد</p>
            <Link to="/properties" className="favorites-browse-btn">
              استكشف العقارات
            </Link>
          </div>
        ) : (
          <div className="favorites-list">
            {favorites.map((item) => (
              <div className="favorite-list-card" key={item.id}>
                <img src={item.image} alt={item.title} className="favorite-list-img" />
                <div className="favorite-list-info">
                  <span className="favorite-list-type">{item.type}</span>
                  <h3>{item.title}</h3>
                  <p className="favorite-list-location">
                    <FiMapPin /> {item.location}
                  </p>
                  <div className="favorite-list-details">
                    <span>{item.beds} غرف</span>
                    <span>{item.area}</span>
                  </div>
                </div>
                <div className="favorite-list-actions">
                  <span className="favorite-list-price">{item.price}</span>
                  <button className="favorite-list-remove">إزالة</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}