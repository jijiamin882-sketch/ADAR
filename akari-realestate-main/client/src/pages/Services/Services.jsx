import React from "react";
import { FiFileText, FiTool, FiLayout, FiTruck, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // <-- 1. استيراد أداة التنقل
import './Services.css'; 

const Services = () => {
  const navigate = useNavigate(); // <-- 2. تفعيل أداة التنقل

  // بيانات الخدمات مع إضافة خاصية (path) لكل خدمة
  const servicesData = [
    {
      id: 1,
      icon: <FiFileText />,
      title: "خدمات الموثقون",
      description: "تواصل مباشرة مع موثقين معتمدين لضمان شرعية وسلامة معاملاتك العقارية. نضمن لك إتمام الإجراءات القانونية بسرعة ودقة عالية بعيداً عن التعقيدات.",
      features: ["توثيق عقود البيع والشراء", "استخراج رسوم عقارية", "تحقيق في الملكية القانونية"],
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reverse: false,
      path: "/notaries" // <-- مسار صفحة الموثقين
    },
    {
      id: 2,
      icon: <FiTool />,
      title: "صيانة العقار",
      description: "فريق متخصص لضمان بقاء منزلك في حالة مثالية بعد الشراء أو خلال فترة الكراء. نقدم حلولاً شاملة تشمل الكهرباء، السباكة، والتشطيبات.",
      features: ["صيانة كهربائية وسباكة", "طلاء وتشطيبات داخلية", "خدمات طوارئ على مدار الساعة"],
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reverse: true,
      path: "/maintenance" // <-- مسار صفحة الصيانة
    },
    {
      id: 3,
      icon: <FiLayout />,
      title: "خدمات الأثاث",
      description: "وفرنا عليك عناء البحث، نوفر لك باقات أثاث جاهزة أو مخصصة حسب مساحة عقارك بتصاميم عصرية تجمع بين الراحة والأناقة.",
      features: ["باقات أثاث حديثة بالكامل", "تصميم داخلي مخصص", "توصيل وتركيب احترافي"],
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reverse: false,
      path: "/furniture" // <-- مسار صفحة الأثاث
    },
    {
      id: 4,
      icon: <FiTruck />,
      title: "خدمة نقل الأثاث",
      description: "نقل آمن وموثوق لعفشك باستخدام سيارات مجهزة وفرق عمل محترفة لضمان سلامة منقولاتك من الباب إلى الباب.",
      features: ["تعبئة وتغليف باحترافية عالية", "نقل داخل وخارج المدينة", "تأمين شامل على المنقولات"],
      image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reverse: true,
      path: "/moving" // <-- مسار صفحة النقل
    }
  ];

  return (
    <div className="services-page">
      
      <div className="svc-main-header">
        <h1>خدماتنا المتكاملة</h1>
        <p>لا نكتفي بتسهيل عقود البيع والشراء، بل نوفر لك حلولاً متكاملة لما بعد الاستحواذ على عقارك.</p>
      </div>

      {servicesData.map((service, index) => (
        <section 
          key={service.id} 
          className={`svc-section ${index === 0 || index === 3 ? 'svc-dark-bg' : 'svc-light-bg'} ${service.reverse ? 'svc-reverse' : ''}`}
        >
          <div className="svc-container">
            
            <div className="svc-content">
              <div className="svc-icon-wrapper">
                {service.icon}
              </div>
              <h2>{service.title}</h2>
              <p>{service.description}</p>
              
              <ul className="svc-features">
                {service.features.map((feat, i) => (
                  <li key={i}>
                    <FiCheckCircle className="svc-check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* <-- 3. إضافة حدث الضغط للذهاب للمسار المحدد --> */}
              <button 
                className="svc-btn" 
                onClick={() => navigate(service.path)}
              >
                اكتشف الخدمة
              </button>
            </div>

            <div className="svc-image-wrapper">
              <img src={service.image} alt={service.title} className="svc-img" />
            </div>

          </div>
        </section>
      ))}
    </div>
  );
};

export default Services;