import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../../components/BlogCard/BlogCard";
import "./Blog.css";

// بيانات وهمية للمدونة (يمكنك استبدالها ببيانات من Firebase أو API)
const blogData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop",
    category: "أخبار العقارات",
    type: "news",
    date: "15 أكتوبر 2023",
    title: "ارتفاع ملحوظ في أسعار العقارات الفاخرة بالعاصمة الرباط",
    description: "شهدت الأشهر الأخيرة ارتفاعاً بنسبة 12% في أسعار الفيلات والشقق الفاخرة في منطقة سوية والمعاريف، مما يعكس ثقة المستثمرين في السوق المغربي.",
    link: "/blog/1"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=1000&auto=format&fit=crop",
    category: "نصائح الاستثمار",
    type: "tips",
    date: "8 أكتوبر 2023",
    title: "5 نصائح ذهبية قبل شراء عقارك الأول",
    description: "شراء العقار لأول مرة يمكن أن يكون تجربة مرهقة. في هذا المقال نستعرض أهم الخطوات التي يجب اتباعها لضمان صفقة ناجحة وآمنة.",
    link: "/blog/2"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=1000&auto=format&fit=crop",
    category: "دليل المشتري",
    type: "guide",
    date: "1 أكتوبر 2023",
    title: "الدليل الشامل للقروض العقارية في المغرب",
    description: "كل ما تحتاج معرفته عن شروط القروض العقارية، نسب الفائدة، والبنوك التي تقدم أفضل العروض لعام 2023.",
    link: "/blog/3"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop",
    category: "أخبار العقارات",
    type: "news",
    date: "25 سبتمبر 2023",
    title: "مشاريع سكنية عملاقة قادمة إلى مدينة مراكش",
    description: "أعلنت عدة شركات تطوير عقاري عن خططها لإنشاء مجمعات سكنية حديثة تضم مرافق ترفيهية وتجارية بمنطقة مراكش.",
    link: "/blog/4"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1000&auto=format&fit=crop",
    category: "نصائح الاستثمار",
    type: "tips",
    date: "18 سبتمبر 2023",
    title: "كيف تختار موقعك العقاري المثالي؟",
    description: "الموقع هو العامل الأول في نجاح استثمارك العقاري. تعرف على المعايير الجغرافية والاقتصادية التي يجب أن تنتبه لها.",
    link: "/blog/5"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1000&auto=format&fit=crop",
    category: "دليل المشتري",
    type: "guide",
    date: "10 سبتمبر 2023",
    title: "الفرق بين الشراء على الخارطة والشراء الجاهز",
    description: "مقارنة شاملة بين الشراء في المشروعات قيد الإنشاء والشراء من العقارات الجاهزة من حيث التكلفة والمخاطر والمزايا.",
    link: "/blog/6"
  }
];

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeFilter, setActiveFilter] = useState(initialType);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setActiveFilter(type);
    } else {
      setActiveFilter('all');
    }
  }, [searchParams]);

  const handleFilterChange = (type) => {
    if (type === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ type });
    }
    setActiveFilter(type);
  };

  const filteredData = activeFilter === 'all' 
    ? blogData 
    : blogData.filter(post => post.type === activeFilter);

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'news', label: 'أخبار العقارات' },
    { key: 'tips', label: 'نصائح الاستثمار' },
    { key: 'guide', label: 'دليل المشتري' }
  ];

  return (
    <div className="blog-wrapper">
      
      {/* هيرو المدونة */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>المدونة</h1>
          <p>نصائح، أخبار، ودليلك الشامل لعالم الاستثمار العقاري</p>
        </div>
      </div>

      {/* محتوى المدونة */}
      <div className="blog-container">
        
        {/* فلتر التصنيفات */}
        <div className="blog-filters">
          {filters.map(filter => (
            <button 
              key={filter.key}
              className={`blog-filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* شبكة المقالات */}
        {filteredData.length > 0 ? (
          <div className="blog-grid">
            {filteredData.map(post => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="blog-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <h3>لا توجد مقالات في هذا التصنيف حالياً</h3>
            <button onClick={() => handleFilterChange('all')}>عرض جميع المقالات</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;