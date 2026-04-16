import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom"; // <--- تأكد من استيراد Link
import BlogCard from "../../components/BlogCard/BlogCard";
import { blogData } from "../../blogData"; // <--- تأكد من مسار البيانات
import "./BlogCard.css";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'all';
  
  const [activeFilter, setActiveFilter] = useState(initialType);
  const [visibleCount, setVisibleCount] = useState(6);

  // ... (باقي منطق الفلترة والدوال كما هو في الكود السابق) ...

  // ... (لقد قمت باختصار الجزء العلوي للتركيز على التصحيح المطلوب) ...

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'news', label: 'قوانين العقارات' },
    { key: 'tips', label: 'نصائح استثمارية' },
    { key: 'guide', label: 'دليل الولايات' }
  ];

  // تصفية البيانات
  const filteredData = activeFilter === 'all' 
    ? blogData 
    : blogData.filter(post => post.type === activeFilter);

  const displayedData = filteredData.slice(0, visibleCount);

  return (
    <div className="blog-wrapper">
      
      {/* هيرو المدونة */}
      <div className="blog-hero">
        <div className="blog-hero-content">
          <h1>المدونة العقارية</h1>
          <p>دليلك الشامل للاستثمار، القوانين، وأهم الأحياء في الجزائر</p>
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

        {/* --- هذا هو الجزء الذي تم تصحيحه --- */}
        {displayedData.length > 0 ? (
          <>
            <div className="blog-grid">
              {displayedData.map(post => (
                <Link 
                  to={`/blog/${post.id}`} 
                  className="blog-card-link" 
                  key={post.id}
                >
                  <BlogCard 
                    image={post.image} 
                    category={post.category} 
                    date={post.date} 
                    title={post.title} 
                    description={post.description} 
                  />
                </Link>
              ))}
            </div>

            {/* زر عرض المزيد */}
            {filteredData.length > visibleCount && (
              <div className="blog-load-more-wrapper">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  عرض المزيد من المقالات
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="blog-empty">
             {/* كود الحالة الفارغة */}
            <h3>لا توجد مقالات</h3>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blog;