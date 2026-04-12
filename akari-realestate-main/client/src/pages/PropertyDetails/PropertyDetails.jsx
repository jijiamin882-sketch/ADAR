import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { 
  FiMapPin, FiHeart, FiShare2, FiPhone, FiMessageCircle, 
  FiHome, FiArrowLeft, FiChevronLeft, FiChevronRight, 
  FiDroplet , FiMaximize, FiCheckCircle
} from 'react-icons/fi';  
import "leaflet/dist/leaflet.css";
import "./PropertyDetails.css";

// إصلاح أيقونة الماركر الافتراضية في Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// بيانات وهمية
const mockProperties = {
  1: {
    id: 1,
    title: "شقة فاخرة في قلب المدينة",
    location: "الجلفة، حي البساتين",
    price: "12,500,000 دج",
    type: "شقة",
    beds: 3, baths: 2, area: "120 م²",
    description: "شقة فاخرة جداً تتميز بتصميم عصري أنيق وتشطيبات عالية الجودة. تقع في موقع استراتيجي في حي البساتين، قريبة من جميع المرافق الأساسية (مدارس، مستشفيات، محلات تجارية). الشقة تتكون من صالة واسعة، 3 غرف نوم، مطبخ مجهز، وحمامين. إطلالة رائعة على المدينة.",
    images: [
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200"
    ],
    features: ["مطبخ مجهز", "تكييف مركزي", "بلكونة واسعة", "مواقف سيارات", "حارس أمن", "قرب المدارس"],
    agent: { name: "مكتب زينو العقاري", phone: "0555 123 456", img: "https://tse4.mm.bing.net/th/id/OIP.5OQwnp8OLEGrBc1k9bN59gHaHj?rs=1&pid=ImgDetMain" },
    coords: [36.1906, 3.0453] // إحداثيات الجلفة
  },
  2: {
    id: 2,
    title: "فيلا حديثة مع حديقة",
    location: "الجزائر العاصمة، باب الزوار",
    price: "35,000,000 دج",
    type: "فيلا",
    beds: 5, baths: 3, area: "280 م²",
    description: "فيلا فاخرة بتصميم حديث وتشطيبات سوبر لوكس. تتضمن حديقة خاصة كبيرة، مسبح، ومرآب لسيارتين. تقع في أرقى أحياء العاصمة، تتميز بالهدوء والخصوصية مع قربها من المراكز التجارية الكبرى.",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200"
    ],
    features: ["مسبح خاص", "حديقة", "مرآب سيارات", "تجهيز سوبر لوكس", "نظام مراقبة", "موقع استراتيجي"],
    agent: { name: "ونوقي للعقارات", phone: "0661 987 654", img: "https://tse4.mm.bing.net/th/id/OIP.9GPanPH78ZV0O_u6MCz8IQHaEl?rs=1&pid=ImgDetMain" },
    coords: [36.7538, 3.0588] // إحداثيات العاصمة
  }
};

// بيانات افتراضية لأي عقار ليس في البيانات الوهمية
const defaultProperty = {
  id: 0, title: "عقار مميز", location: "الجزائر", price: "يحدد لاحقاً", type: "عقار",
  beds: 3, baths: 2, area: "150 م²",
  description: "تفاصيل هذا العقار ستتوفر قريباً. تواصل مع الوكيل للحصول على معلومات دقيقة.",
  images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200"],
  features: ["موقع مميز", "إطلالة جميلة", "تهوية جيدة"],
  agent: { name: "وكالة ADAR", phone: "0555 000 000", img: "https://tse4.mm.bing.net/th/id/OIP.5OQwnp8OLEGrBc1k9bN59gHaHj?rs=1&pid=ImgDetMain" },
  coords: [36.1906, 3.0453]
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [activeImg, setActiveImg] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const property = mockProperties[id] || defaultProperty;

  const nextImg = () => setActiveImg(prev => (prev + 1) % property.images.length);
  const prevImg = () => setActiveImg(prev => (prev - 1 + property.images.length) % property.images.length);

  return (
    <div className="pd-wrapper">
      {/* === أعلى الصفحة === */}
      <div className="pd-top-section">
        <div className="pd-container">
          <Link to="/properties" className="pd-back-btn">
            <FiArrowLeft /> العودة للعقارات
          </Link>
          
          <div className="pd-title-row">
            <div>
              <div className="pd-badges">
                <span className="pd-type-badge">{property.type}</span>
                <span className="pd-for-badge">للبيع</span>
              </div>
              <h1>{property.title}</h1>
              <p className="pd-location"><FiMapPin /> {property.location}</p>
            </div>
            <div className="pd-price-actions">
              <h2 className="pd-price">{property.price}</h2>
              <div className="pd-action-btns">
                <button className={`pd-action-btn ${isFav ? 'fav' : ''}`} onClick={() => setIsFav(!isFav)}>
                  <FiHeart /> {isFav ? 'محفوظ' : 'حفظ'}
                </button>
                <button className="pd-action-btn">
                  <FiShare2 /> مشاركة
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-container pd-main-grid">
        {/* === العمود الأيسر (الصور والمحتوى) === */}
        <div className="pd-left-col">
          
          {/* معرض الصور */}
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img src={property.images[activeImg]} alt={property.title} />
              {property.images.length > 1 && (
                <>
                  <button className="pd-img-nav prev" onClick={prevImg}><FiChevronRight /></button>
                  <button className="pd-img-nav next" onClick={nextImg}><FiChevronLeft /></button>
                </>
              )}
              <span className="pd-img-counter">{activeImg + 1} / {property.images.length}</span>
            </div>
            <div className="pd-thumbnails">
              {property.images.map((img, i) => (
                <div 
                  key={i} 
                  className={`pd-thumb ${i === activeImg ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt={`صورة ${i+1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* تفاصيل سريعة */}
          <div className="pd-quick-details">
            <div className="pd-qd-item">
              <FiHome className="pd-qd-icon" />
              <div>
                <strong>{property.beds}</strong>
                <span>غرف النوم</span>
              </div>
            </div>
            <div className="pd-qd-item">
              <FiDroplet className="pd-qd-icon" />
              <div>
                <strong>{property.baths}</strong>
                <span>الحمامات</span>
              </div>
            </div>
            <div className="pd-qd-item">
              <FiMaximize className="pd-qd-icon" />
              <div>
                <strong>{property.area}</strong>
                <span>المساحة</span>
              </div>
            </div>
            <div className="pd-qd-item">
              <FiHome className="pd-qd-icon" />
              <div>
                <strong>{property.type}</strong>
                <span>نوع العقار</span>
              </div>
            </div>
          </div>

          {/* الوصف */}
          <div className="pd-section">
            <h3>وصف العقار</h3>
            <p>{property.description}</p>
          </div>

          {/* المميزات */}
          <div className="pd-section">
            <h3>مميزات العقار</h3>
            <div className="pd-features-grid">
              {property.features.map((feat, i) => (
                <div key={i} className="pd-feature-item">
                  <FiCheckCircle className="pd-feat-icon" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* الخريطة */}
          <div className="pd-section">
            <h3>الموقع على الخريطة</h3>
            <div className="pd-map-container">
              {property.coords && (
                <MapContainer center={property.coords} zoom={14} scrollWheelZoom={false} className="pd-leaflet-map">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={property.coords}>
                    <Popup>{property.title}<br />{property.location}</Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </div>

        {/* === العمود الأيمن (بطاقة الوكيل) === */}
        <div className="pd-right-col">
          <div className="pd-agent-card">
            <div className="pd-agent-header">
              <img src={property.agent.img} alt={property.agent.name} className="pd-agent-img" />
              <div>
                <h4>{property.agent.name}</h4>
                <span>وكيل عقاري معتمد</span>
              </div>
            </div>
            <div className="pd-agent-actions">
              <a href={`tel:${property.agent.phone}`} className="pd-agent-btn primary">
                <FiPhone /> اتصل الآن
              </a>
              <a href={`https://wa.me/${property.agent.phone.replace(/\s/g, '')}`} target="_blank" className="pd-agent-btn whatsapp">
                <FiMessageCircle /> واتساب
              </a>
            </div>
            
            <form className="pd-contact-form" onSubmit={(e) => e.preventDefault()}>
              <h4>أرسل رسالة</h4>
              <input type="text" placeholder="الاسم الكامل" />
              <input type="tel" placeholder="رقم الهاتف" />
              <textarea placeholder="أنا مهتم بهذا العقار..." rows="4"></textarea>
              <button type="submit">إرسال الرسالة</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}