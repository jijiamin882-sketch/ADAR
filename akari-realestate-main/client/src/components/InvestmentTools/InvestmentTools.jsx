import React from 'react';
import { FiSearch, FiTrendingUp, FiList, FiChevronLeft } from 'react-icons/fi';
import './InvestmentTools.css';

export default function InvestmentTools() {
  const tools = [
    {
      id: 1,
      icon: <FiSearch />,
      title: 'بحث العقارات',
      description: 'ابحث بسهولة بين آلاف العقارات المتاحة باستخدام فلاتر متقدمة للعثور على ما يناسبك تماماً.',
      colorClass: 'icon-bg-blue'
    },
    {
      id: 2,
      icon: <FiTrendingUp />,
      title: 'تحليل الأسعار',
      description: 'احصل على رؤى عميقة حول اتجاهات السوق والأسعار لاتخاذ قرارات استثمارية مدروسة.',
      colorClass: 'icon-bg-green'
    },
    {
      id: 3,
      icon: <FiList />,
      title: 'قوائم العقارات',
      description: 'تصفح قوائم العقارات المحدثة يومياً واطلع على التفاصيل الكاملة والصور عالية الجودة.',
      colorClass: 'icon-bg-purple'
    }
  ];

  return (
    <section className="inv-tools-section">
      <div className="inv-tools-header">
        <h1>أدوات الاستثمار العقاري</h1>
        <p>نوفر لك مجموعة متكاملة من الأدوات الذكية لتسهيل عملية البحث والتحليل والمقارنة قبل اتخاذ قرارك الاستثماري.</p>
      </div>

      <div className="inv-tools-grid">
        {tools.map((tool) => (
          <div className="inv-tools-card" key={tool.id}>
            <div className={`inv-icon-box ${tool.colorClass}`}>
              {tool.icon}
            </div>
            <h3>{tool.title}</h3>
            <p>{tool.description}</p>
            <div className="inv-card-link">
              <span>اكتشف المزيد</span>
              <FiChevronLeft className="inv-link-arrow" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}